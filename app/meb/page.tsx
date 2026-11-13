"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { BANK } from "@/lib/questions";
import { DERS_ADI, DERS_RENK, Ders, LGS_YAPISI } from "@/lib/types";
import { DERS_BILGI } from "@/lib/dersler";

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
  return Array.from(harita.values()).sort((a, b) =>
    a.konu.localeCompare(b.konu, "tr")
  );
}

export default function MEBSayfasi() {
  const gruplar = useMemo(gruplariTopla, []);
  const [secili, setSecili] = useState<Ders | null>(null);

  const toplam = useMemo(
    () => gruplar.reduce((t, g) => t + g.adet, 0),
    [gruplar]
  );

  /* Her ders için toplam soru + konu sayısı (ders kartları) */
  const dersKartlari = useMemo(() => {
    const map = new Map<Ders, { adet: number; konu: number }>();
    gruplar.forEach((g) => {
      const m = map.get(g.ders) || { adet: 0, konu: 0 };
      m.adet += g.adet;
      m.konu += 1;
      map.set(g.ders, m);
    });
    return Array.from(map.entries())
      .map(([ders, m]) => ({ ders, ...m }))
      .sort((a, b) => DERS_ADI[a.ders].localeCompare(DERS_ADI[b.ders], "tr"));
  }, [gruplar]);

  const seciliGruplar = useMemo(
    () => (secili ? gruplar.filter((g) => g.ders === secili) : []),
    [gruplar, secili]
  );

  const testAc = (g: Grup) => {
    const soruSayisi = Math.min(20, g.adet);
    const birSoruSure =
      (LGS_YAPISI[g.ders].sure / LGS_YAPISI[g.ders].soru) * soruSayisi;
    const secim = {
      dersler: [g.ders],
      soruSayisi,
      sure: Math.max(5, Math.round(birSoruSure)),
      zorluk: "hepsi" as const,
      ad: `MEB · ${g.konu}`,
      konu: g.konu,
    };
    window.location.href = `/sinav/?ozel=${encodeURIComponent(
      JSON.stringify(secim)
    )}`;
  };

  const bilgi = secili ? DERS_BILGI.find((b) => b.ders === secili) : null;

  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">MEB ÇALIŞMA KİTAPLARI</p>
          <h1 style={{ margin: "10px 0 8px" }}>
            {secili ? DERS_ADI[secili] : "Ders Ders Çalışma Kitapları"}
          </h1>
          <p className="sub">
            {secili
              ? `${DERS_ADI[secili]} kitabındaki ${seciliGruplar.length} ünite/tema; her birinde cevap anahtarıyla çalışan test var. Konuyu seç, doğrudan çöz.`
              : `MEB’in ücretsiz LGS çalışma kitaplarından çıkarılan ${toplam} soru, ${dersKartlari.length} derse göre ayrıldı. Bir ders kartına bas, o derste hangi konular olduğunu gör.`}
          </p>
        </div>
        <span className="chip red">
          {secili
            ? `${seciliGruplar.length} konu`
            : `${dersKartlari.length} ders · ${toplam} soru`}
        </span>
      </section>

      {secili === null ? (
        /* ---------------- DERS KARTLARI ---------------- */
        <div className="grid g-3">
          {dersKartlari.map((k) => {
            const d = DERS_BILGI.find((x) => x.ders === k.ders);
            return (
              <button
                key={k.ders}
                className="ders-card"
                style={
                  { "--ders-renk": DERS_RENK[k.ders] } as CSSProperties
                }
                onClick={() => setSecili(k.ders)}
              >
                <div className="d-ico">{d?.ikon ?? "📘"}</div>
                <h3>{DERS_ADI[k.ders]}</h3>
                <p>{d?.aciklama}</p>
                <div className="d-stat">
                  <span className="pill">{k.konu} konu</span>
                  <span className="pill red">{k.adet} soru</span>
                </div>
                <div className="d-go">Konuları gör →</div>
              </button>
            );
          })}
        </div>
      ) : (
        /* ---------------- SEÇİLİ DERSİN KONULARI ---------------- */
        <>
          <div className="between" style={{ margin: "4px 0 18px" }}>
            <button className="btn btn-sm" onClick={() => setSecili(null)}>
              ← TÜM DERSLER
            </button>
            <span className="pill blue">
              {bilgi?.oturum ?? DERS_ADI[secili]}
            </span>
          </div>

          <div className="grid g-3">
            {seciliGruplar.map((g) => (
              <div key={g.ders + g.konu} className="tile">
                <div className="between">
                  <span className="pill" style={{ color: DERS_RENK[g.ders] }}>
                    <i
                      className="ders-dot"
                      style={{ background: DERS_RENK[g.ders] }}
                    />
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

          {!seciliGruplar.length && (
            <div className="bos-durum">
              <div className="ico">📘</div>
              <p>Bu derste grup bulunamadı.</p>
            </div>
          )}
        </>
      )}

      <div className="divider" />

      <div className="grid g-2">
        <div className="panel pad">
          <p className="eyebrow">KAYNAK</p>
          <ul
            className="small muted"
            style={{ lineHeight: 2, margin: "12px 0 0", paddingLeft: 18 }}
          >
            <li>LGS Matematik çalışma kitabı (6 ünite)</li>
            <li>LGS Fen Bilimleri çalışma kitabı</li>
            <li>LGS Türkçe çalışma kitabı (8 tema)</li>
            <li>LGS İnkılap · Din · İngilizce çalışma kitapları</li>
          </ul>
        </div>
        <div className="panel pad">
          <p className="eyebrow blue">TAVSİYE</p>
          <p
            className="small muted"
            style={{ lineHeight: 1.9, margin: "12px 0 16px" }}
          >
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
