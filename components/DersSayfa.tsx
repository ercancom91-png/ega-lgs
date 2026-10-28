"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SoruBlok from "@/components/SoruBlok";
import { slugBul } from "@/lib/dersler";
import { filtrele, karistir, konular } from "@/lib/questions";
import { DERS_ADI, Harf, Soru, Zorluk } from "@/lib/types";
import { netHesapla } from "@/lib/scoring";
import { soruKaydet } from "@/lib/store";

export default function DersSayfa({ slug }: { slug: string }) {
  const bilgi = slugBul(slug);
  const [aktifKonu, setAktifKonu] = useState<string>("hepsi");
  const [zorluk, setZorluk] = useState<Zorluk | "hepsi">("hepsi");
  const [adet, setAdet] = useState(10);
  const [test, setTest] = useState<Soru[]>([]);
  const [cevaplar, setCevaplar] = useState<Record<string, Harf | null>>({});
  const [isaretler, setIsaretler] = useState<Record<string, boolean>>({});
  const [kesinlesti, setKesinlesti] = useState(false);

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("konu");
    if (k) setAktifKonu(decodeURIComponent(k));
  }, []);

  const ders = bilgi?.ders;
  const konuListesi = useMemo(() => (ders ? konular(ders) : []), [ders]);
  const konuSayilari = useMemo(() => {
    const m: Record<string, number> = {};
    if (ders) {
      konuListesi.forEach((k) => {
        m[k] = filtrele({ ders, konu: k }).length;
      });
    }
    return m;
  }, [ders, konuListesi]);

  const havuz = useMemo(
    () => (ders ? filtrele({ ders, konu: aktifKonu, zorluk }) : []),
    [ders, aktifKonu, zorluk]
  );

  if (!bilgi) {
    return (
      <div className="bos-durum">
        <div className="ico">🔎</div>
        <h3>Bu ders bulunamadı</h3>
        <Link href="/dersler/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Derslere dön
        </Link>
      </div>
    );
  }

  const toplam = filtrele({ ders: bilgi.ders }).length;

  const testKur = () => {
    setTest(karistir(havuz, Math.random).slice(0, adet));
    setCevaplar({});
    setIsaretler({});
    setKesinlesti(false);
    setTimeout(() => {
      document.getElementById("test-baslangic")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const konSec = (k: string) => {
    setAktifKonu(k);
    setTest([]);
    setCevaplar({});
    setKesinlesti(false);
    setTimeout(() => {
      document.getElementById("soru-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  };

  /** Şık işaretlenince bir sonraki soruya kendisi atlar. */
  const cevapla = (id: string, h: Harf, i: number) => {
    if (kesinlesti) return;
    setCevaplar((c) => ({ ...c, [id]: h }));
    const sonraki = test[i + 1];
    if (!sonraki) return;
    window.setTimeout(() => {
      const el = document.querySelector(`[data-soru-id="${sonraki.id}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 220);
  };

  const kontrolEt = () => {
    test.forEach((s) => {
      const c = cevaplar[s.id];
      soruKaydet(s.id, !c ? "bos" : c === s.dogru ? "dogru" : "yanlis");
    });
    setKesinlesti(true);
  };

  const dogru = test.filter((s) => cevaplar[s.id] === s.dogru).length;
  const yanlis = test.filter((s) => cevaplar[s.id] && cevaplar[s.id] !== s.dogru).length;
  const bos = test.length - dogru - yanlis;
  const net = netHesapla(dogru, yanlis);
  const isaretliSayi = Object.values(isaretler).filter(Boolean).length;

  return (
    <>
      <section className="ders-hero">
        <div>
          <Link href="/dersler/" className="eyebrow ink">← TÜM DERSLER</Link>
          <h1 className="h-sec" style={{ margin: "14px 0 10px" }}>
            {bilgi.ikon} {DERS_ADI[bilgi.ders]}
          </h1>
          <p className="lead">{bilgi.aciklama}</p>
          <div className="chips" style={{ marginTop: 16 }}>
            <span className="pill red">{toplam} soru</span>
            <span className="pill">{konuListesi.length} konu</span>
            <span className="pill blue">{bilgi.oturum}</span>
          </div>
        </div>
      </section>

      <div className="between" style={{ margin: "30px 0 14px" }}>
        <h2 className="h-sec">Konular</h2>
        <span className="pill">Bir konuya bas, sorular gelsin</span>
      </div>

      <div className="konu-liste">
        <button
          className={`konu-card ${aktifKonu === "hepsi" ? "on" : ""}`}
          onClick={() => konSec("hepsi")}
        >
          <span className="k-no">★</span>
          <span className="k-ad">Tüm konular</span>
          <span className="k-n">{toplam} soru</span>
        </button>
        {konuListesi.map((k, i) => (
          <button
            key={k}
            className={`konu-card ${aktifKonu === k ? "on" : ""}`}
            onClick={() => konSec(k)}
          >
            <span className="k-no">{String(i + 1).padStart(2, "0")}</span>
            <span className="k-ad">{k}</span>
            <span className="k-n">{konuSayilari[k]} soru</span>
          </button>
        ))}
      </div>

      <div className="panel panel-pad soru-panel" id="soru-panel" style={{ marginTop: 26 }}>
        <div className="between" style={{ marginBottom: 16 }}>
          <div>
            <p className="eyebrow">SORU GETİR</p>
            <h3 style={{ fontSize: 19, marginTop: 10 }}>
              {aktifKonu === "hepsi" ? `${DERS_ADI[bilgi.ders]} · tüm konular` : aktifKonu}
            </h3>
          </div>
          <span className="pill red">{havuz.length} soru havuzda</span>
        </div>

        <div className="filtre-row">
          <div className="filtre-alan">
            <label>ZORLUK</label>
            <select value={zorluk} onChange={(e) => setZorluk(e.target.value as Zorluk | "hepsi")}>
              <option value="hepsi">Karışık</option>
              <option value={1}>Kolay</option>
              <option value={2}>Orta</option>
              <option value={3}>Zor</option>
            </select>
          </div>
          <div className="filtre-alan">
            <label>SORU SAYISI</label>
            <select value={adet} onChange={(e) => setAdet(Number(e.target.value))}>
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n} soru</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={testKur} disabled={!havuz.length}>
            Soruları getir →
          </button>
        </div>

        {havuz.length === 0 && (
          <p className="small" style={{ color: "var(--red)", marginTop: 14 }}>
            Bu filtrelere uyan soru yok. Başka bir konu seç.
          </p>
        )}
      </div>

      <div id="test-baslangic" />
      {test.length > 0 && (
        <>
          <div className="between test-ust" style={{ marginBottom: 16 }}>
            <h2 className="h-sec">Testin ({test.length} soru)</h2>
            <div className="row">
              {kesinlesti ? (
                <>
                  <span className="pill green">Doğru {dogru}</span>
                  <span className="pill red">Yanlış {yanlis}</span>
                  <span className="pill">Boş {bos}</span>
                  <span className="pill blue">Net {net}</span>
                </>
              ) : (
                <>
                  <span className="pill">{Object.keys(cevaplar).length}/{test.length} cevaplandı</span>
                  <span className="pill red">{isaretliSayi} işaretli</span>
                </>
              )}
            </div>
          </div>

          <div className="stack">
            {test.map((s, i) => (
              <SoruBlok
                key={s.id}
                soru={s}
                no={i + 1}
                secim={cevaplar[s.id] ?? null}
                onSec={(h) => cevapla(s.id, h, i)}
                geriBildirim={kesinlesti}
                isaret={!!isaretler[s.id]}
                onIsaretle={() =>
                  setIsaretler((v) => ({ ...v, [s.id]: !v[s.id] }))
                }
              />
            ))}
          </div>

          <div className="kontrol-alt">
            {kesinlesti ? (
              <div className="row wrap" style={{ justifyContent: "center" }}>
                <span className="big-score">{net}</span>
                <span className="muted" style={{ alignSelf: "center" }}>
                  net · {dogru}/{test.length} doğru
                </span>
                <button className="btn btn-primary" onClick={testKur}>
                  Aynı filtrelerle yeni test
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={kontrolEt}>
                Kontrol et ✓
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
