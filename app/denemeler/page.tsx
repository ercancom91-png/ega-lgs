"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CIKMIS_DENEMELER } from "@/lib/exams";
import { useVeri } from "@/lib/store";
import { DERS_ADI, DERS_RENK, Ders, ZORLUK_ADI, Zorluk } from "@/lib/types";
import { SOZEL_DERSLER, SAYISAL_DERSLER } from "@/lib/types";
import { BANK } from "@/lib/questions";
import { havuzSayisi } from "@/lib/questions/havuz";

const TUM_DERSLER: Ders[] = [
  "Turkce",
  "Matematik",
  "Fen",
  "Inkilap",
  "Ingilizce",
  "Din",
];

const ON_HAZIR: { ad: string; dersler: Ders[]; soru: number; sure: number }[] = [
  { ad: "Tam Deneme", dersler: TUM_DERSLER, soru: 90, sure: 115 },
  { ad: "Sözel Sprint", dersler: SOZEL_DERSLER, soru: 50, sure: 75 },
  { ad: "Sayısal Sprint", dersler: SAYISAL_DERSLER, soru: 40, sure: 40 },
  { ad: "Mini Test", dersler: TUM_DERSLER, soru: 12, sure: 15 },
];

export default function Denemeler() {
  const veri = useVeri();

  // --- kendi denemeni üret ---
  const [dersler, setDersler] = useState<Ders[]>(TUM_DERSLER);
  const [soruSayisi, setSoruSayisi] = useState(90);
  const [sure, setSure] = useState(115);
  const [zorluk, setZorluk] = useState<Zorluk | "hepsi">("hepsi");
  const [ad, setAd] = useState("Özel Denemem");

  const mevcut = useMemo(() => havuzSayisi(dersler, zorluk), [dersler, zorluk]);
  const uygun = Math.min(soruSayisi, mevcut);

  const secim = encodeURIComponent(
    JSON.stringify({ dersler, soruSayisi: uygun, sure, zorluk, ad })
  );

  const dersDegistir = (d: Ders) =>
    setDersler((l) => (l.includes(d) ? l.filter((x) => x !== d) : [...l, d]));

  return (
    <>
      <section style={{ padding: "46px 0 30px" }}>
        <p className="eyebrow">BÖLÜM 01</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Denemeler
        </h1>
        <p className="lead">
          İki yol: aşağıdan kendi denemeni üret ya da MEB’in 2018–2025 arasında
          yayımladığı resmî kitapçıklardan çıkmış denemeleri çöz. Gerçek sınavdaki
          gibi iki oturum: 09.30’da 50 soruluk sözel (75 dakika), 11.30’da 40 soruluk
          sayısal (80 dakika). Puanlama MEB katsayılarıyla (Türkçe/Mat/Fen 4,
          diğerleri 1) hesaplanır.
        </p>
      </section>

      <section id="uret" style={{ scrollMarginTop: 80 }}>
        <h2 className="h-sec" style={{ marginBottom: 8 }}>
          Kendi denemeni üret
        </h2>
        <p className="lead" style={{ marginBottom: 22 }}>
          Dersleri, soru sayısını, süreyi ve zorluğu seç; site sana o kurallara uygun
          bir deneme kursun. Aynı ayarlarda her basışta yeni bir kombinasyon gelir.
        </p>

        <div className="grid g-2" style={{ alignItems: "start" }}>
          <div className="panel panel-pad stack">
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                DERSLER
              </p>
              <div className="chips">
                {TUM_DERSLER.map((d) => (
                  <button
                    key={d}
                    className={`chip ${dersler.includes(d) ? "on" : ""}`}
                    onClick={() => dersDegistir(d)}
                  >
                    <i
                      className="ders-dot"
                      style={{ background: DERS_RENK[d], marginRight: 6 }}
                    />
                    <b
                      style={{
                        color: dersler.includes(d) ? "var(--acc-ink)" : "var(--muted-2)",
                        fontSize: 13,
                      }}
                    >
                      {dersler.includes(d) ? "✓" : "◻"}
                    </b>
                    {DERS_ADI[d]} · {havuzSayisi([d], zorluk)} soru
                  </button>
                ))}
              </div>
              <p className="small muted" style={{ marginTop: 12 }}>
                <b style={{ color: "var(--acc)" }}>{dersler.length}</b> ders seçili
                {dersler.length
                  ? ` · ${dersler.map((d) => DERS_ADI[d]).join(", ")}`
                  : " · en az bir ders seç"}
              </p>
            </div>

            <div className="row">
              <button
                className="btn btn-sm"
                onClick={() => {
                  setDersler(SOZEL_DERSLER);
                  setSoruSayisi(50);
                  setSure(75);
                }}
              >
                Sözel oturum
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  setDersler(SAYISAL_DERSLER);
                  setSoruSayisi(40);
                  setSure(40);
                }}
              >
                Sayısal oturum
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  setDersler(TUM_DERSLER);
                  setSoruSayisi(90);
                  setSure(115);
                }}
              >
                Tam LGS
              </button>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                SORU SAYISI: {uygun}
              </p>
              <input
                type="range"
                min={5}
                max={Math.max(10, Math.min(120, mevcut))}
                value={uygun}
                onChange={(e) => setSoruSayisi(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                SÜRE: {sure} DAKİKA
              </p>
              <input
                type="range"
                min={5}
                max={150}
                value={sure}
                onChange={(e) => setSure(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                ZORLUK
              </p>
              <div className="chips">
                {([1, 2, 3, "hepsi"] as (Zorluk | "hepsi")[]).map((z) => (
                  <button
                    key={String(z)}
                    className={`chip ${zorluk === z ? "on" : ""}`}
                    onClick={() => setZorluk(z)}
                  >
                    {z === "hepsi" ? "Karışık" : ZORLUK_ADI[z]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                DENEME ADI
              </p>
              <input
                type="text"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="panel panel-pad">
            <p className="eyebrow">ÖZET</p>
            <div className="streak" style={{ margin: "12px 0 4px" }}>
              <b>{uygun}</b>
              <span className="muted small">soru · {sure} dakika</span>
            </div>
            <p className="small muted" style={{ marginBottom: 18 }}>
              Seçilen derslerin bankasında{" "}
              <b style={{ color: "var(--text)" }}>{mevcut}</b> uygun soru var.
            </p>

            <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
              {dersler.map((d) => {
                const adet = Math.round(
                  (havuzSayisi([d], zorluk) / Math.max(1, mevcut)) * uygun
                );
                return (
                  <div className="bar-row" key={d} style={{ marginBottom: 0 }}>
                    <span className="small">{DERS_ADI[d]}</span>
                    <div className="bar">
                      <i
                        style={{
                          width: `${(adet / Math.max(1, uygun)) * 100}%`,
                          background: DERS_RENK[d],
                        }}
                      />
                    </div>
                    <span className="small" style={{ textAlign: "right" }}>
                      ~{adet}
                    </span>
                  </div>
                );
              })}
            </div>

            {uygun < soruSayisi && (
              <p className="small" style={{ color: "var(--red-soft)", marginBottom: 14 }}>
                Bankada yeterli soru yok; deneme {uygun} soru olarak kurulacak.
              </p>
            )}

            <Link
              href={`/sinav/?ozel=${secim}`}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Denemeyi başlat →
            </Link>
            <p className="small muted" style={{ marginTop: 14 }}>
              Önerilen hazır ayarlar:
            </p>
            <div className="chips" style={{ marginTop: 8 }}>
              {ON_HAZIR.map((h) => (
                <button
                  key={h.ad}
                  className="chip"
                  onClick={() => {
                    setDersler(h.dersler);
                    setSoruSayisi(h.soru);
                    setSure(h.sure);
                    setAd(h.ad);
                  }}
                >
                  {h.ad}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Çıkmış Denemeler</h2>
        <span className="pill red">
          {CIKMIS_DENEMELER.length} resmî deneme · 2018–2025
        </span>
      </div>

      <div className="stack">
        {CIKMIS_DENEMELER.map((d) => {
          const kayit = veri.denemeler.find((x) => x.denemeId === d.id);
          const gercekSoru = BANK.filter(
            (s) => s.kaynak === "cikmis" && s.yil === d.yil
          ).length;
          return (
            <div key={d.id} className="tile accent-red" style={{ display: "block" }}>
              <div className="between">
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <span className="pill red">{d.rozet}</span>
                    <span className="pill">90 soru · 155 dakika</span>
                    <span className="pill blue">{gercekSoru} gerçek soru hazır</span>
                    {kayit && (
                      <span className="pill green">
                        En iyi: {kayit.puan} puan · net {kayit.net}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 26 }}>{d.ad}</h3>
                  <p style={{ marginTop: 8, maxWidth: "60ch" }}>{d.aciklama}</p>
                  <div className="chips" style={{ marginTop: 14 }}>
                    {d.oturumlar.flatMap((o) => o.dersler).map((ders) => (
                      <span key={ders} className="pill" style={{ color: DERS_RENK[ders] }}>
                        <i className="ders-dot" style={{ background: DERS_RENK[ders] }} />
                        {DERS_ADI[ders]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="row" style={{ alignItems: "stretch" }}>
                  <Link href={`/sinav/?id=${d.id}`} className="btn btn-primary btn-lg">
                    Sınava gir →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="divider" />

      <div className="grid g-2">
        <div className="panel panel-pad">
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Deneme sonrası ne yapmalısın?</h3>
          <ol className="small muted" style={{ lineHeight: 2, margin: 0, paddingLeft: 18 }}>
            <li>Önce net ve puanına değil, yanlışların konularına bak.</li>
            <li>En az 3 yanlış yaptığın konuyu tekrar çalış.</li>
            <li>Boş bıraktığın soruları, cevabı bildiğin hâlde bile işaretleme.</li>
            <li>Aynı denemeyi bir hafta sonra tekrar çöz; gelişimini gör.</li>
          </ol>
        </div>
        <div className="panel panel-pad">
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Kendi denemeni üret</h3>
          <p className="small muted" style={{ lineHeight: 1.9, margin: "0 0 16px" }}>
            Çıkmış denemeleri bitirdiysen yukarıdaki oluşturucudan yeni bir deneme
            kur: dersleri, soru sayısını, süreyi ve zorluğu sen seçiyorsun. Her
            açılışta farklı soru kombinasyonu gelir.
          </p>
          <a href="#uret" className="btn btn-blue">
            Oluşturucuya git ↑
          </a>
        </div>
      </div>
    </>
  );
}
