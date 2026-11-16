"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SoruBlok from "@/components/SoruBlok";
import {
  denemeGetir,
  denemeSorulariniUret,
  DenemeTanimi,
  ozelDenemeOlustur,
} from "@/lib/exams";
import { DERS_ADI, DERS_RENK, Harf, Soru } from "@/lib/types";
import {
  dersSonuclari,
  DenemeSonuc,
  lgsPuani,
  netHesapla,
  sureyiYaz,
} from "@/lib/scoring";
import { denemeKaydet, soruKaydet, useVeri } from "@/lib/store";

function parametre(ad: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(ad);
}

export default function SinavSayfasi() {
  const veri = useVeri();
  const [tanim, setTanim] = useState<DenemeTanimi | null>(null);
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [faz, setFaz] = useState<"hazir" | "sinav" | "ara" | "sonuc">("hazir");
  const [oturum, setOturum] = useState(0);
  const [aktif, setAktif] = useState(0);
  const [cevaplar, setCevaplar] = useState<Record<string, Harf | null>>({});
  const [isaretlenen, setIsaretlenen] = useState<string[]>([]);
  const [kalan, setKalan] = useState(0);
  const [baslangic, setBaslangic] = useState(0);
  const [sonuc, setSonuc] = useState<DenemeSonuc | null>(null);
  const [yok, setYok] = useState(false);
  /** Sınavın açılış sorgusu — sonuç "Tekrar aç" ile aynı sınavı yeniden yüklesin */
  const kaynakRef = useRef("");

  useEffect(() => {
    kaynakRef.current = window.location.search.replace(/^\?/, "");
    const id = parametre("id");
    const seedParam = parametre("seed");
    const ozelParam = parametre("ozel");
    const seed = seedParam ? Number(seedParam) : undefined;

    if (ozelParam) {
      try {
        const secim = JSON.parse(decodeURIComponent(ozelParam));
        const t = ozelDenemeOlustur(secim, seed ?? Date.now() % 100000);
        setTanim(t);
        setSorular(denemeSorulariniUret(t, seed));
      } catch {
        setYok(true);
      }
      return;
    }

    if (!id) {
      setYok(true);
      return;
    }
    const t = denemeGetir(id);
    if (!t) {
      setYok(true);
      return;
    }
    setTanim(t);
    setSorular(denemeSorulariniUret(t, seed));
  }, []);

  const oturumSorulari = useMemo(() => {
    if (!tanim) return [] as { bas: number; bit: number; liste: Soru[] }[];
    let bas = 0;
    return tanim.oturumlar.map((o) => {
      const liste = sorular.filter((s) => o.dersler.includes(s.ders));
      const bit = bas + liste.length;
      const aralik = { bas, bit, liste };
      bas = bit;
      return aralik;
    });
  }, [tanim, sorular]);

  const aktifOturum = oturumSorulari[oturum];
  const toplamSure = tanim?.oturumlar.reduce((t, o) => t + o.sure, 0) ?? 0;

  const bitir = useCallback(
    (gecenSure: number) => {
      if (!tanim) return;
      const dogrular = Object.fromEntries(sorular.map((s) => [s.id, s.dogru]));
      const cev: Record<string, string | null> = {};
      sorular.forEach((s) => (cev[s.id] = cevaplar[s.id] ?? null));
      const dersler = dersSonuclari(sorular, cev, dogrular);
      const dogru = dersler.reduce((t, d) => t + d.dogru, 0);
      const yanlis = dersler.reduce((t, d) => t + d.yanlis, 0);
      const bos = dersler.reduce((t, d) => t + d.bos, 0);
      const s: DenemeSonuc = {
        id: `${tanim.id}-${Date.now()}`,
        denemeId: tanim.id,
        ad: tanim.ad,
        tur: tanim.tur,
        tarih: new Date().toISOString(),
        sure: gecenSure,
        toplamSoru: sorular.length,
        dogru,
        yanlis,
        bos,
        net: netHesapla(dogru, yanlis),
        puan: lgsPuani(dersler),
        dersler,
        cevaplar: cev,
        isaretlenenler: isaretlenen,
        baslangic: kaynakRef.current || undefined,
      };
      sorular.forEach((q) => {
        const c = cev[q.id];
        soruKaydet(q.id, c === null ? "bos" : c === q.dogru ? "dogru" : "yanlis");
      });
      denemeKaydet(s);
      setSonuc(s);
      setFaz("sonuc");
    },
    [tanim, sorular, cevaplar, isaretlenen]
  );

  const kalanRef = useRef(0);

  useEffect(() => {
    if (faz !== "sinav" || !tanim) return;
    kalanRef.current = tanim.oturumlar[oturum].sure;
    setKalan(kalanRef.current);
    const t = setInterval(() => {
      kalanRef.current -= 1;
      setKalan(kalanRef.current);
      if (kalanRef.current <= 0) {
        clearInterval(t);
        if (oturum < tanim.oturumlar.length - 1) {
          // Süre bitti → ara ekranı (kılavuzdaki molaya karşılık gelir)
          setFaz("ara");
        } else {
          bitir(Math.max(1, Math.round((Date.now() - baslangic) / 1000)));
        }
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faz, oturum]);

  const basla = () => {
    if (!tanim) return;
    setBaslangic(Date.now());
    setAktif(0);
    setFaz("sinav");
  };

  const oturumuBitir = () => {
    if (!tanim) return;
    if (oturum < tanim.oturumlar.length - 1) {
      setFaz("ara");
    } else {
      bitir(Math.max(1, Math.round((Date.now() - baslangic) / 1000)));
    }
  };

  /** Ara ekranından 2. oturuma geçiş (kılavuzdaki 11.30 başlangıcı) */
  const ikinciOturumaGec = () => {
    const yeni = oturum + 1;
    setOturum(yeni);
    setAktif(oturumSorulari[yeni]?.bas ?? 0);
    setFaz("sinav");
  };

  if (yok)
    return (
      <div style={{ padding: "80px 0" }} className="center">
        <h1 className="h-sec">Deneme bulunamadı</h1>
        <p className="lead" style={{ margin: "14px auto 24px" }}>
          Bağlantı geçersiz olabilir. Deneme listesine dönüp tekrar dene.
        </p>
        <Link href="/denemeler/" className="btn btn-primary">
          Denemelere dön
        </Link>
      </div>
    );

  if (!tanim)
    return <p className="muted" style={{ padding: "60px 0" }}>Deneme hazırlanıyor…</p>;

  /* ---------- SONUÇ ---------- */
  if (faz === "sonuc" && sonuc) {
    return (
      <>
        <section style={{ padding: "46px 0 26px" }}>
          <p className="eyebrow">SONUÇ · {sonuc.ad}</p>
          <h1 className="h-sec" style={{ margin: "10px 0 22px" }}>
            {sonuc.puan >= 420
              ? "Hedefin çok yakın. Bu seviyeyi koru! 🔥"
              : sonuc.puan >= 350
              ? "Sağlam bir temel var. Zayıf konulara odaklan."
              : "Bu bir başlangıç. Yanlışlarını analiz et, tekrar dene."}
          </h1>

          <div className="score-hero">
            <div className="panel panel-pad center" style={{ padding: 30 }}>
              <p className="eyebrow">TAHMİNÎ LGS PUANI</p>
              <div className="big-score">{sonuc.puan}</div>
              <p className="small muted" style={{ marginTop: 10 }}>
                Hedef: {veri.profil.hedefPuan} puan
              </p>
            </div>

            <div className="panel panel-pad">
              <div className="grid g-4" style={{ gap: 12, marginBottom: 20 }}>
                <div className="kpi">
                  <div className="v" style={{ color: "var(--green)" }}>
                    {sonuc.dogru}
                  </div>
                  <div className="k">Doğru</div>
                </div>
                <div className="kpi">
                  <div className="v" style={{ color: "var(--red)" }}>
                    {sonuc.yanlis}
                  </div>
                  <div className="k">Yanlış</div>
                </div>
                <div className="kpi">
                  <div className="v">{sonuc.bos}</div>
                  <div className="k">Boş</div>
                </div>
                <div className="kpi">
                  <div className="v" style={{ color: "var(--blue-soft)" }}>
                    {sonuc.net}
                  </div>
                  <div className="k">Net</div>
                </div>
              </div>

              {sonuc.dersler.map((d) => (
                <div className="bar-row" key={d.ders}>
                  <span>{DERS_ADI[d.ders]}</span>
                  <div className="bar">
                    <i
                      style={{
                        width: `${d.dogruYuzde}%`,
                        background: DERS_RENK[d.ders],
                      }}
                    />
                  </div>
                  <span style={{ textAlign: "right" }}>
                    {d.dogru}/{d.soru}
                  </span>
                </div>
              ))}

              <div className="row" style={{ marginTop: 20 }}>
                <span className="pill">
                  Süre: {sureyiYaz(sonuc.sure)} / {sureyiYaz(toplamSure)}
                </span>
                <span className="pill blue">{sonuc.toplamSoru} soru</span>
                <Link href="/istatistik/" className="btn btn-sm">
                  İstatistiğe git
                </Link>
                <button className="btn btn-sm" onClick={() => window.location.reload()}>
                  Yeniden çöz
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />
        <h2 className="h-sec" style={{ marginBottom: 18 }}>
          Çözüm dökümü
        </h2>
        <div className="stack">
          {sorular.map((s, i) => (
            <SoruBlok
              key={s.id}
              soru={s}
              no={i + 1}
              secim={cevaplar[s.id] ?? null}
              geriBildirim
            />
          ))}
        </div>
      </>
    );
  }

  /* ---------- ARA (kılavuzdaki mola) ---------- */
  if (faz === "ara" && tanim.oturumlar[oturum + 1]) {
    const biten = tanim.oturumlar[oturum];
    const sonraki = tanim.oturumlar[oturum + 1];
    const doldurulan = (oturumSorulari[oturum]?.liste || []).filter(
      (q) => cevaplar[q.id]
    ).length;
    return (
      <section className="center" style={{ padding: "70px 0" }}>
        <p className="eyebrow">{biten.ad.toUpperCase()} TAMAMLANDI</p>
        <h1 className="h-hero" style={{ margin: "14px 0 10px" }}>
          <span className="red">ARA VERİLDİ.</span>
        </h1>
        <p className="lead" style={{ margin: "0 auto 26px" }}>
          Gerçek sınavda {biten.ad.split("—")[1]?.trim() || "ilk"} oturum 09.30’da
          başlar ve 10.45’te biter; 2. oturum 11.30’da başlar. Arada kuru meyveli
          yulaf barı, ceviz, kuru üzüm ve 330 ml su molası verilir.
        </p>

        <div className="grid g-3" style={{ maxWidth: 860, margin: "0 auto 30px" }}>
          <div className="kpi">
            <div className="v">{doldurulan}</div>
            <div className="k">İşaretlenen cevap</div>
          </div>
          <div className="kpi">
            <div className="v" style={{ color: "var(--blue)" }}>
              {(oturumSorulari[oturum]?.liste.length) || 0}
            </div>
            <div className="k">{biten.ad} sorusu</div>
          </div>
          <div className="kpi">
            <div className="v" style={{ color: "var(--red)" }}>
              {Math.round(sonraki.sure / 60)}
            </div>
            <div className="k">{sonraki.ad} süresi (dk)</div>
          </div>
        </div>

        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary btn-lg" onClick={ikinciOturumaGec}>
            {sonraki.ad}’e başla →
          </button>
        </div>
        <p className="small muted" style={{ marginTop: 16 }}>
          Cevapların korunur. Simülasyonda molayı beklemeden devam edebilirsin.
        </p>
      </section>
    );
  }

  /* ---------- SINAV ---------- */
  if (faz === "sinav" && aktifOturum) {
    const s = sorular[aktif];
    const doldurulan = aktifOturum.liste.filter((q) => cevaplar[q.id]).length;
    return (
      <>
        <div className="exam-top">
          <div className="exam-top-inner">
            <span className="pill red">{tanim.oturumlar[oturum].ad}</span>
            <span className={`timer ${kalan < 300 ? "warn" : ""}`}>
              ⏱ {sureyiYaz(kalan)}
            </span>
            <div className="progressbar">
              <i
                style={{
                  width: `${(doldurulan / Math.max(1, aktifOturum.liste.length)) * 100}%`,
                }}
              />
            </div>
            <span className="small muted">
              {aktif - aktifOturum.bas + 1} / {aktifOturum.liste.length}
            </span>
            <button className="btn btn-sm btn-primary" onClick={oturumuBitir}>
              {oturum < tanim.oturumlar.length - 1
                ? "Oturumu bitir →"
                : "Sınavı bitir ✓"}
            </button>
          </div>
        </div>

        <div className="exam-body">
          <div className="stack">
            {s && (
              <SoruBlok
                soru={s}
                no={aktif + 1}
                secim={cevaplar[s.id] ?? null}
                onSec={(h) => setCevaplar((c) => ({ ...c, [s.id]: h }))}
                isaret={isaretlenen.includes(s.id)}
              />
            )}
            <div className="between">
              <button
                className="btn"
                disabled={aktif <= aktifOturum.bas}
                onClick={() => setAktif((a) => a - 1)}
              >
                ← Önceki
              </button>
              <button
                className="btn btn-ghost"
                onClick={() =>
                  s &&
                  setIsaretlenen((l) =>
                    l.includes(s.id) ? l.filter((x) => x !== s.id) : [...l, s.id]
                  )
                }
              >
                ⚑ İşaretle
              </button>
              <button
                className="btn btn-blue"
                disabled={aktif >= aktifOturum.bit - 1}
                onClick={() => setAktif((a) => a + 1)}
              >
                Sonraki →
              </button>
            </div>
          </div>

          <div className="panel answer-sheet">
            <div className="between">
              <p className="eyebrow">CEVAP KÂĞIDI</p>
              <span className="pill">{doldurulan}</span>
            </div>
            <div className="sheet-grid">
              {aktifOturum.liste.map((q, i) => (
                <button
                  key={q.id}
                  className={[
                    cevaplar[q.id] ? "filled" : "",
                    isaretlenen.includes(q.id) ? "flagged" : "",
                    aktif === aktifOturum.bas + i ? "cur" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setAktif(aktifOturum.bas + i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: 14 }}>
              Mavi: cevaplandı · Kırmızı alt çizgi: işaretli · Çerçeve: şu anki soru
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ---------- HAZIRLIK ---------- */
  return (
    <section style={{ padding: "46px 0" }}>
      <p className="eyebrow">{tanim.tur === "cikmis" ? "ÇIKMIŞ DENEME" : "ÜRETİLMİŞ DENEME"}</p>
      <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
        {tanim.ad}
      </h1>
      <p className="lead" style={{ marginBottom: 22 }}>
        {tanim.aciklama}
      </p>

      <div className="grid g-3" style={{ marginBottom: 26 }}>
        {tanim.oturumlar.map((o, i) => (
          <div key={i} className="panel panel-pad">
            <p className="eyebrow">{o.ad}</p>
            <div className="streak" style={{ margin: "10px 0" }}>
              <b>{Math.round(o.sure / 60)}</b>
              <span className="muted small">dakika</span>
            </div>
            <div className="chips">
              <span className="pill red">
                {oturumSorulari[i]?.liste.length ?? 0} soru
              </span>
              <span className="pill">{i === 0 ? "09.30 başlangıç" : "11.30 başlangıç"}</span>
            </div>
            <div className="chips" style={{ marginTop: 8 }}>
              {o.dersler.map((d) => (
                <span key={d} className="pill" style={{ color: DERS_RENK[d] }}>
                  {DERS_ADI[d]}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="panel panel-pad">
          <p className="eyebrow">TOPLAM</p>
          <div className="streak" style={{ margin: "10px 0" }}>
            <b>{sorular.length}</b>
            <span className="muted small">soru · {Math.round(toplamSure / 60)} dk</span>
          </div>
          <p className="small muted">
            Puanlama MEB katsayılarıyla: Türkçe/Mat/Fen ×4, diğerleri ×1.
            Yanlışlar üçte bir net düşürür.
          </p>
        </div>
      </div>

      <div className="panel panel-pad" style={{ marginBottom: 26 }}>
        <p className="eyebrow">SINAV KURALLARI (MEB KILAVUZU)</p>
        <ul className="small muted" style={{ lineHeight: 2, margin: "10px 0 0" }}>
          <li>1. Oturum 09.30’da sözel (50 soru / 75 dk), 2. Oturum 11.30’da sayısal (40 soru / 80 dk) başlar.</li>
          <li>Süre oturum bazında ilerler; süre bittiğinde oturum otomatik kapanır ve ara ekranı açılır.</li>
          <li>İşaretlediğin sorular cevap kâğidında kırmızı çizgiyle gösterilir.</li>
          <li>Ham puan = doğru − (yanlış ÷ 3); boş bırakmak ham puanı değiştirmez.</li>
          <li>Katsayılar: Türkçe, Matematik, Fen 4; İnkılap, Din, İngilizce 1. Toplam puan 100–500 arasıdır.</li>
          <li>Sınav sonunda tüm soruların çözümleri ve ders bazlı analiz açılır.</li>
        </ul>
      </div>

      <button className="btn btn-primary btn-lg" onClick={basla}>
        Sınavı başlat →
      </button>
      <Link href="/" className="btn btn-lg" style={{ marginLeft: 12 }}>
        Vazgeç
      </Link>
    </section>
  );
}
