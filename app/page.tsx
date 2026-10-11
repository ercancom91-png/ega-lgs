"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useVeri, ozetHesapla, profilGuncelle } from "@/lib/store";
import { gunlukSoz, MOTIVASYON_KARTLARI } from "@/lib/motivasyon";
import { ROZETLER, aktifRozetler } from "@/lib/rozetler";
import { sureyiYaz } from "@/lib/scoring";
import { BANK, kaynakSayilari } from "@/lib/questions";
import { CIKMIS_YILLAR } from "@/lib/exams";

const MODULLER = [
  {
    href: "/denemeler/",
    baslik: "Çıkmış Denemeler",
    aciklama:
      "2018–2025 MEB resmî kitapçıkları. Gerçek iki oturum: sözel 50 soru/75 dk, sayısal 40 soru/80 dk.",
    etiket: `${CIKMIS_YILLAR.length} yıl`,
    sinif: "accent-red",
    no: "01",
  },
  {
    href: "/uretilmis/",
    baslik: "Üretilmiş Denemeler",
    aciklama:
      "Havuzdan her açılışta yeni kombinasyon üreten denemeler. Tam sınav ve ders sprintleri.",
    etiket: "Yeni karışım",
    sinif: "accent-blue",
    no: "02",
  },
  {
    href: "/banka/",
    baslik: "Soru Bankası",
    aciklama:
      "Ders, konu, zorluk, kaynak ve yıl filtresiyle kendi testini kur. Kontrol anında.",
    etiket: `${BANK.length} soru`,
    sinif: "",
    no: "03",
  },
  {
    href: "/rastgele/",
    baslik: "Rastgele Soru",
    aciklama:
      "Butona bas; ders ve zorluk seçimine göre saniyeler içinde yeni soru gelsin.",
    etiket: "Sonsuz",
    sinif: "",
    no: "04",
  },
  {
    href: "/meb/",
    baslik: "MEB Çalışma Kitapları",
    aciklama:
      "MEB LGS çalışma kitaplarındaki ünite/tema testleri, cevap anahtarlarıyla birlikte.",
    etiket: "Ünite testleri",
    sinif: "",
    no: "05",
  },
  {
    href: "/istatistik/",
    baslik: "İstatistik",
    aciklama:
      "Ders ders doğru-yanlış, zayıf konu analizi, deneme puanların ve rozetlerin tek ekranda.",
    etiket: "Analiz",
    sinif: "",
    no: "06",
  },
];

export default function AnaSayfa() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);
  const [soz, setSoz] = useState({ metin: "", kim: "EGA" });
  const [hedef, setHedef] = useState(veri.profil.hedefPuan);
  const [ad, setAd] = useState(veri.profil.ad);
  const [kuruldu, setKuruldu] = useState(false);

  const kaynaklar = kaynakSayilari();

  useEffect(() => {
    setSoz(gunlukSoz());
    setHedef(veri.profil.hedefPuan);
    setAd(veri.profil.ad);
    setKuruldu(true);
  }, [veri.profil.hedefPuan, veri.profil.ad]);

  const kazanilan = aktifRozetler(veri, ozet);
  const ilerleme = Math.min(
    100,
    Math.round((ozet.enIyiPuan / veri.profil.hedefPuan) * 100)
  );

  return (
    <>
      <section className="hero-wrap">
        <div className="hero-tilt">
          <p className="eyebrow" style={{ marginBottom: 18 }}>
            MEB KAYNAKLI · RESMÎ SÜRELERLE · ÜCRETSİZ
          </p>
          <h1 className="h-hero">
            GERÇEK SORULARLA
            <br />
            <span className="out">GERÇEK</span> <span className="red">SINAV PROVASI.</span>
            <br />
            HEDEFİ YAKALA.
          </h1>
        </div>

        <div className="between" style={{ marginTop: 34 }}>
          <p className="lead">
            Çıkmış LGS denemeleri, MEB çalışma kitapları, konu konu soru bankası ve
            kılavuzdaki aynen sürelerle çalışan sınav simülasyonu. Kayıt olmadan, tek
            ekranda.
          </p>
          <div className="row">
            <Link href="/denemeler/" className="btn btn-primary btn-lg">
              Denemeye başla →
            </Link>
            <Link href="/rastgele/" className="btn btn-ghost btn-lg">
              🎲 Rastgele soru
            </Link>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} style={{ display: "flex", gap: 42 }}>
              <span>Türkçe</span>
              <span>·</span>
              <span>Matematik</span>
              <span>·</span>
              <span>Fen Bilimleri</span>
              <span>·</span>
              <span>T.C. İnkılap Tarihi</span>
              <span>·</span>
              <span>Yabancı Dil</span>
              <span>·</span>
              <span>Din Kültürü</span>
              <span>·</span>
              <span style={{ color: "var(--red)" }}>
                09.30 SÖZEL 50/75 DK · 11.30 SAYISAL 40/80 DK
              </span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid g-4">
        <div className="kpi">
          <div className="v">{BANK.length}</div>
          <div className="k">Havuzdaki soru</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--red)" }}>
            {kaynaklar.cikmis || 0}
          </div>
          <div className="k">Gerçek LGS çıkmış soru</div>
        </div>
        <div className="kpi">
          <div className="v">{ozet.toplamSoru}</div>
          <div className="k">Çözdüğün soru</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--blue)" }}>
            {ozet.enIyiPuan || "—"}
          </div>
          <div className="k">En iyi deneme puanı</div>
        </div>
      </div>

      <div className="grid g-2" style={{ marginTop: 22 }}>
        <div className="panel panel-pad">
          <p className="eyebrow">GÜNLÜK MOTİVASYON</p>
          <p className="quote" style={{ margin: "14px 0 10px" }}>
            “{soz.metin}”
          </p>
          <p className="small muted">— {soz.kim}</p>
          <div className="row wrap" style={{ marginTop: 16 }}>
            <span className="chip red">🔥 {veri.uzunluk} günlük seri</span>
            <span className="chip blue">Bugün {ozet.bugunCozulen} soru</span>
            <span className="chip green">{kazanilan.size} rozet</span>
          </div>
        </div>

        <div className="panel panel-pad">
          <div className="between">
            <p className="eyebrow">HEDEF PUAN</p>
            <span className="pill red">{ilerleme}%</span>
          </div>
          <div className="streak" style={{ margin: "12px 0" }}>
            <b>{ozet.enIyiPuan || 0}</b>
            <span className="muted">/ {veri.profil.hedefPuan} puan</span>
          </div>
          <div className="bar" style={{ marginBottom: 18 }}>
            <i
              style={{
                width: `${ilerleme}%`,
                background: "linear-gradient(90deg,var(--red),var(--blue))",
              }}
            />
          </div>
          <div className="row wrap">
            <input
              type="text"
              value={ad}
              placeholder="Adın"
              onChange={(e) => setAd(e.target.value)}
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="number"
              value={hedef}
              min={100}
              max={500}
              onChange={(e) => setHedef(Number(e.target.value))}
              style={{ width: 110 }}
            />
            <button
              className="btn btn-blue"
              onClick={() =>
                profilGuncelle({
                  ad: ad || "Öğrenci",
                  hedefPuan: Math.max(100, Math.min(500, hedef || 420)),
                })
              }
            >
              Kaydet
            </button>
          </div>
          {kuruldu && (
            <p className="small muted" style={{ marginTop: 12 }}>
              {ozet.bugunCozulen >= veri.profil.hedefGunlukSoru
                ? "Bugünkü hedefini tamamladın. Harikasın! 🎉"
                : `Bugün ${Math.max(0, veri.profil.hedefGunlukSoru - ozet.bugunCozulen)} soru daha çözmelisin.`}
            </p>
          )}
        </div>
      </div>

      <div className="divider" />

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Resmî sınav yapısı (2026 kılavuzu)</h2>
        <span className="pill blue">Aynı gün iki oturum</span>
      </div>
      <div className="g-2">
        <div className="panel panel-pad">
          <p className="eyebrow">1. OTURUM · 09.30</p>
          <div className="streak" style={{ margin: "10px 0" }}>
            <b>75</b>
            <span className="muted small">dakika · 50 soru</span>
          </div>
          <div className="chips">
            <span className="pill">Türkçe 20</span>
            <span className="pill">İnkılap 10</span>
            <span className="pill">Din 10</span>
            <span className="pill">İngilizce 10</span>
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            Oturumlar arasında kuru meyveli yulaf barı, ceviz, kuru üzüm ve 330 ml su
            molası verilir.
          </p>
        </div>
        <div className="panel panel-pad">
          <p className="eyebrow blue">2. OTURUM · 11.30</p>
          <div className="streak" style={{ margin: "10px 0" }}>
            <b>80</b>
            <span className="muted small">dakika · 40 soru</span>
          </div>
          <div className="chips">
            <span className="pill blue">Matematik 20</span>
            <span className="pill blue">Fen 20</span>
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            Ham puan = doğru − (yanlış ÷ 3). Katsayılar: Türkçe/Matematik/Fen 4,
            diğerleri 1. Toplam puan 100–500.
          </p>
        </div>
      </div>

      <div className="divider" />

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Modüller</h2>
        <span className="pill blue">
          {kuruldu ? `${veri.denemeler.length} deneme kayıtlı` : "—"}
        </span>
      </div>

      <div className="grid g-3">
        {MODULLER.map((m) => (
          <Link key={m.no + m.baslik} href={m.href} className={`tile ${m.sinif}`}>
            <div className="between">
              <span className="idx">{m.no}</span>
              <span className="pill">{m.etiket}</span>
            </div>
            <h3 style={{ marginTop: 14 }}>{m.baslik}</h3>
            <p>{m.aciklama}</p>
            <span className="go">İncele →</span>
          </Link>
        ))}
      </div>

      <div className="divider" />

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Rozetler</h2>
        <span className="pill">
          {kazanilan.size} / {ROZETLER.length}
        </span>
      </div>
      <div className="grid g-4">
        {ROZETLER.map((r) => (
          <div key={r.id} className={`badge ${kazanilan.has(r.id) ? "on" : "off"}`}>
            <div className="ico">{r.ikon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.ad}</div>
              <div className="small muted">{r.aciklama}</div>
            </div>
          </div>
        ))}
      </div>

      {kuruldu && veri.denemeler[0] && (
        <>
          <div className="divider" />
          <h2 className="h-sec" style={{ marginBottom: 18 }}>
            Son denemen
          </h2>
          <Link href="/istatistik/" className="tile" style={{ display: "block" }}>
            <div className="between">
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {veri.denemeler[0].ad}
                </div>
                <div className="small muted">
                  {new Date(veri.denemeler[0].tarih).toLocaleDateString("tr-TR")} · süre{" "}
                  {sureyiYaz(veri.denemeler[0].sure)} · net {veri.denemeler[0].net}
                </div>
              </div>
              <div className="streak">
                <b>{veri.denemeler[0].puan}</b>
                <span className="muted small">puan</span>
              </div>
            </div>
          </Link>
        </>
      )}

      <div className="divider" />

      <div className="grid g-2">
        {MOTIVASYON_KARTLARI.map((k) => (
          <div key={k.baslik} className="panel panel-pad">
            <div style={{ fontSize: 26 }}>{k.ikon}</div>
            <h3 style={{ fontSize: 18, margin: "8px 0 6px" }}>{k.baslik}</h3>
            <p className="small muted" style={{ margin: 0, lineHeight: 1.7 }}>
              {k.aciklama}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
