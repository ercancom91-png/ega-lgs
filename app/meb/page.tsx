"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BANK } from "@/lib/questions";
import { DERS_ADI, DERS_RENK, LGS_YAPISI, Ders } from "@/lib/types";

interface Grup {
  ders: Ders;
  konu: string;
  adet: number;
  cevapli: number;
}

/** MEB kitaplarından gelen soruları ders + ünite/tema bazında gruplar. */
function gruplariTopla(): Grup[] {
  const harita = new Map<string, Grup>();
  BANK.forEach((s) => {
    if (s.kaynak !== "meb") return;
    const k = `${s.ders}::${s.konu}`;
    const g = harita.get(k) || {
      ders: s.ders,
      konu: s.konu,
      adet: 0,
      cevapli: 0,
    };
    g.adet++;
    if (s.dogru) g.cevapli++;
    harita.set(k, g);
  });
  return Array.from(harita.values()).sort(
    (a, b) =>
      a.ders.localeCompare(b.ders, "tr") || a.konu.localeCompare(b.konu, "tr")
  );
}

export default function MEBSayfasi() {
  const gruplar = useMemo(gruplariTopla, []);
  const [ders, setDers] = useState<Ders | "hepsi">("hepsi");

  const filtreli = gruplar.filter((g) => ders === "hepsi" || g.ders === ders);
  const toplam = gruplar.reduce((t, g) => t + g.adet, 0);
  const dersler = Array.from(new Set(gruplar.map((g) => g.ders)));

  const testAc = (g: Grup) => {
    const soruSayisi = Math.min(20, g.adet);
    const birSoruSure = (LGS_YAPISI[g.ders].sure / LGS_YAPISI[g.ders].soru) * soruSayisi;
    const secim = {
      dersler: [g.ders],
      soruSayisi,
      sure: Math.max(5, Math.round(birSoruSure)),
      zorluk: "hepsi" as const,
      ad: `MEB · ${g.konu}`,
      konu: g.konu,
    };
    window.location.href = `/sinav/?ozel=${encodeURIComponent(JSON.stringify(secim))}`;
  };

  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">MEB ÇALIŞMA KİTAPLARI</p>
          <h1 style={{ margin: "10px 0 8px" }}>Ünite &amp; Tema Testleri</h1>
          <p className="sub">
            MEB’in ücretsiz LGS çalışma kitaplarından çıkarılan {toplam} soru; ünite,
            tema ve konu bazında testlere ayrıldı. Her test cevap anahtarıyla birlikte
            çalışır.
          </p>
        </div>
        <span className="chip red">{toplam} soru</span>
      </section>

      <div className="row wrap" style={{ marginBottom: 20 }}>
        <button
          className={`chip ${ders === "hepsi" ? "red" : ""}`}
          onClick={() => setDers("hepsi")}
        >
          Tüm dersler
        </button>
        {dersler.map((d) => (
          <button
            key={d}
            className={`chip ${ders === d ? "red" : ""}`}
            onClick={() => setDers(d)}
            style={{ color: ders === d ? undefined : DERS_RENK[d] }}
          >
            {DERS_ADI[d]} ·{" "}
            {gruplar.filter((g) => g.ders === d).reduce((t, g) => t + g.adet, 0)}
          </button>
        ))}
      </div>

      <div className="grid g-3">
        {filtreli.map((g) => (
          <div key={g.ders + g.konu} className="tile">
            <div className="between">
              <span className="pill" style={{ color: DERS_RENK[g.ders] }}>
                <i className="ders-dot" style={{ background: DERS_RENK[g.ders] }} />
                {DERS_ADI[g.ders]}
              </span>
              <span className="pill blue">{g.adet} soru</span>
            </div>
            <h3 style={{ marginTop: 12, fontSize: 16 }}>{g.konu}</h3>
            <p>
              {g.cevapli === g.adet
                ? "Cevap anahtarı tam."
                : `${g.cevapli}/${g.adet} sorunun cevap anahtarı var.`}
            </p>
            <div className="row">
              <button
                className="btn btn-sm btn-primary"
                disabled={g.cevapli < 5}
                onClick={() => testAc(g)}
              >
                {Math.min(20, g.adet)} soruluk test →
              </button>
            </div>
          </div>
        ))}
      </div>

      {!filtreli.length && (
        <div className="bos-durum">
          <div className="ico">📘</div>
          <p>Bu derste grup bulunamadı.</p>
        </div>
      )}

      <div className="divider" />

      <div className="grid g-2">
        <div className="panel pad">
          <p className="eyebrow">KAYNAK</p>
          <ul className="small muted" style={{ lineHeight: 2, margin: "12px 0 0", paddingLeft: 18 }}>
            <li>LGS Matematik çalışma kitabı (6 ünite)</li>
            <li>LGS Fen Bilimleri çalışma kitabı</li>
            <li>LGS Türkçe çalışma kitabı (8 tema)</li>
            <li>LGS İnkılap · Din · İngilizce çalışma kitapları</li>
          </ul>
        </div>
        <div className="panel pad">
          <p className="eyebrow blue">TAVSİYE</p>
          <p className="small muted" style={{ lineHeight: 1.9, margin: "12px 0 16px" }}>
            Ünite testlerini konu çalışmasından hemen sonra çöz; yanlışların 3’ten
            fazla olduğu üniteyi bir gün sonra tekrar dene.
          </p>
          <Link href="/istatistik/" className="btn btn-sm btn-blue">
            Zayıf konuları gör →
          </Link>
        </div>
      </div>
    </>
  );
}
