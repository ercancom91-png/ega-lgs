"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useVeri, ozetHesapla, profilGuncelle } from "@/lib/store";
import { gunlukSoz } from "@/lib/motivasyon";
import { aktifRozetler } from "@/lib/rozetler";
import { BANK, kaynakSayilari } from "@/lib/questions";
import { CIKMIS_YILLAR } from "@/lib/exams";

const SLAYTLAR = [
  {
    no: "01 · ÇIKMIŞ DENEMELER",
    baslik: "2018–2025 arası gerçek MEB kitapçıkları.",
    aciklama:
      "Elle taranmış, cevap anahtarı doğrulanmış resmî sorular. Sözel ve sayısal oturumlarını kılavuzdaki aynen sürelerle çöz.",
    cta: "Denemelere git",
    href: "/denemeler/",
    etiket: `${CIKMIS_YILLAR.length} yıl · resmî`,
  },
  {
    no: "02 · SORU BANKASI",
    baslik: "Ders, konu, zorluk ve kaynağa göre süz.",
    aciklama:
      "Çıkmış LGS, MEB çalışma kitapları ve banka sorularını tek havuzda birleştir; istediğin kadar sorudan kendi testini kur.",
    cta: "Test kur",
    href: "/banka/",
    etiket: `${BANK.length} soru`,
  },
  {
    no: "03 · DERSLER",
    baslik: "Altı ders, konu konu ayrıştırıldı.",
    aciklama:
      "Dersi seç, konularını gör, üzerine bas ve o konudan soru getir. Çalışma akışını sen belirle.",
    cta: "Dersleri gör",
    href: "/dersler/",
    etiket: "6 ders",
  },
  {
    no: "04 · SINAV SİMÜLASYONU",
    baslik: "Aynı gün iki oturum, resmî süreler.",
    aciklama:
      "09.30'da sözel 50 soru/75 dakika, mola, ardından 11.30'da sayısal 40 soru/80 dakika. Puan MEB formülüyle hesaplanır.",
    cta: "Simülasyona başla",
    href: "/sinav/?id=ega-tam",
    etiket: "Gerçek tempoda",
  },
];

export default function AnaSayfa() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);
  const [soz, setSoz] = useState({ metin: "", kim: "EGA" });
  const [hedef, setHedef] = useState(veri.profil.hedefPuan);
  const [ad, setAd] = useState(veri.profil.ad);
  const [kuruldu, setKuruldu] = useState(false);
  const [slayt, setSlayt] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setSlayt((n) => (n + 1) % SLAYTLAR.length),
      6000
    );
    return () => clearInterval(t);
  }, []);

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
      <div className="slider slider-hero">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${slayt * 100}%)` }}
        >
          {SLAYTLAR.map((s) => (
            <div className="slide" key={s.no}>
              <span className="s-no">{s.no}</span>
              <h2>{s.baslik}</h2>
              <p>{s.aciklama}</p>
              <div className="row wrap" style={{ marginTop: 6 }}>
                <Link href={s.href} className="btn btn-primary">
                  {s.cta} →
                </Link>
                <span className="pill">{s.etiket}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          className="slider-arrow prev"
          onClick={() => setSlayt((n) => (n - 1 + SLAYTLAR.length) % SLAYTLAR.length)}
          aria-label="Önceki"
        >
          ‹
        </button>
        <button
          className="slider-arrow next"
          onClick={() => setSlayt((n) => (n + 1) % SLAYTLAR.length)}
          aria-label="Sonraki"
        >
          ›
        </button>
        <div className="slider-nav">
          {SLAYTLAR.map((s, i) => (
            <button
              key={s.no}
              className={i === slayt ? "on" : ""}
              onClick={() => setSlayt(i)}
              aria-label={`${i + 1}. slayt`}
            />
          ))}
        </div>
      </div>

      <section className="hero-wrap home-hero">
        <div className="hero-tilt">
          <p className="eyebrow" style={{ marginBottom: 16 }}>
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

        <div className="between" style={{ marginTop: 26 }}>
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

      <div className="grid g-4">
        <div className="kpi">
          <div className="v">{BANK.length}</div>
          <div className="k">Havuzdaki soru</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--acc)" }}>
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
                background: "linear-gradient(90deg,var(--acc),var(--acc-2))",
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
    </>
  );
}
