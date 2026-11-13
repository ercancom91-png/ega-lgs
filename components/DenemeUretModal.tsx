"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DERS_ADI, DERS_RENK, Ders, ZORLUK_ADI, Zorluk } from "@/lib/types";
import { SOZEL_DERSLER, SAYISAL_DERSLER } from "@/lib/types";
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

interface Props {
  kapat: () => void;
}

/** Menüdeki "Deneme Üret" butonunun açtığı özel deneme oluşturucu. */
export default function DenemeUretModal({ kapat }: Props) {
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
    <div className="modal-bg" onClick={kapat}>
      <div
        className="modal genis kaydir"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Deneme oluştur"
      >
        <div className="modal-ust">
          <p className="eyebrow">DENEME ÜRET</p>
          <button className="modal-kapat" onClick={kapat} aria-label="Kapat">
            ✕
          </button>
        </div>

        <h3 style={{ marginBottom: 6 }}>Kendi denemeni oluştur</h3>
        <p style={{ marginBottom: 20 }}>
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
                        color: dersler.includes(d)
                          ? "var(--acc-ink)"
                          : "var(--muted-2)",
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
              <p
                className="small"
                style={{ color: "var(--red-soft)", marginBottom: 14 }}
              >
                Bankada yeterli soru yok; deneme {uygun} soru olarak kurulacak.
              </p>
            )}

            <Link
              href={`/sinav/?ozel=${secim}`}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={kapat}
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
      </div>
    </div>
  );
}
