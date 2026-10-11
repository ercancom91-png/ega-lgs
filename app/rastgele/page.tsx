"use client";

import { useCallback, useState } from "react";
import SoruBlok from "@/components/SoruBlok";
import { BANK, filtrele, karistir, konular } from "@/lib/questions";
import { DERS_ADI, DERS_RENK, Ders, Harf, Soru, ZORLUK_ADI, Zorluk } from "@/lib/types";
import { soruKaydet, useVeri, ozetHesapla } from "@/lib/store";

const TUM_DERSLER: Ders[] = [
  "Turkce",
  "Matematik",
  "Fen",
  "Inkilap",
  "Ingilizce",
  "Din",
];

export default function Rastgele() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);

  const [ders, setDers] = useState<Ders | "hepsi">("hepsi");
  const [konu, setKonu] = useState<string | "hepsi">("hepsi");
  const [zorluk, setZorluk] = useState<Zorluk | "hepsi">("hepsi");
  const [soru, setSoru] = useState<Soru | null>(null);
  const [secim, setSecim] = useState<Harf | null>(null);
  const [cevaplandi, setCevaplandi] = useState(false);
  const [sayac, setSayac] = useState(0);
  const [dogruSay, setDogruSay] = useState(0);
  const [sonuc, setSonuc] = useState<"dogru" | "yanlis" | null>(null);

  const konuListesi = konular(ders === "hepsi" ? undefined : ders);
  const havuz = filtrele({ ders, konu, zorluk }).length;

  const uret = useCallback(() => {
    const havuzSorular = filtrele({ ders, konu, zorluk });
    if (!havuzSorular.length) return;
    const onceki = soru?.id;
    let aday = karistir(havuzSorular, Math.random);
    if (onceki && aday[0]?.id === onceki && aday.length > 1) aday = aday.slice(1);
    const yeni = aday[0];
    setSoru(yeni);
    setSecim(null);
    setCevaplandi(false);
    setSonuc(null);
  }, [ders, konu, zorluk, soru]);

  const cevapla = (h: Harf) => {
    if (!soru || cevaplandi) return;
    setSecim(h);
    setCevaplandi(true);
    const s = h === soru.dogru ? "dogru" : "yanlis";
    setSonuc(s);
    soruKaydet(soru.id, s);
    setSayac((n) => n + 1);
    if (s === "dogru") setDogruSay((n) => n + 1);
  };

  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">BÖLÜM 03</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Rastgele Soru
        </h1>
        <p className="lead">
          Filtrelerini seç ve butona bas. Sistem bankadan sana yeni bir soru getirir;
          cevapladığında anında çözüm ve açıklama açılır. Bugün çözdüğün toplam:{" "}
          <b style={{ color: "var(--text)" }}>{ozet.bugunCozulen}</b> soru.
        </p>
      </section>

      <div className="panel panel-pad" style={{ marginBottom: 22 }}>
        <div className="row" style={{ alignItems: "flex-end", gap: 18 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              DERS
            </p>
            <select value={ders} onChange={(e) => { setDers(e.target.value as Ders | "hepsi"); setKonu("hepsi"); }}>
              <option value="hepsi">Tüm dersler</option>
              {TUM_DERSLER.map((d) => (
                <option key={d} value={d}>
                  {DERS_ADI[d]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              KONU
            </p>
            <select value={konu} onChange={(e) => setKonu(e.target.value)}>
              <option value="hepsi">Tüm konular</option>
              {konuListesi.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              ZORLUK
            </p>
            <select value={zorluk} onChange={(e) => setZorluk(e.target.value as Zorluk | "hepsi")}>
              <option value="hepsi">Karışık</option>
              <option value={1}>Kolay</option>
              <option value={2}>Orta</option>
              <option value={3}>Zor</option>
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={uret} disabled={havuz === 0}>
            🎲 {soru ? "Yeni soru üret" : "Soru üret"}
          </button>
          <span className="pill blue" style={{ marginLeft: "auto" }}>
            Havuzda {havuz} soru
          </span>
        </div>

        {havuz === 0 && (
          <p className="small" style={{ color: "var(--red-soft)", marginTop: 14 }}>
            Bu filtrelere uyan soru yok. Filtreleri gevşetmeyi dene.
          </p>
        )}
      </div>

      {sayac > 0 && (
        <div className="grid g-3" style={{ marginBottom: 22 }}>
          <div className="kpi">
            <div className="v">{sayac}</div>
            <div className="k">Bu oturumda çözdüğün</div>
          </div>
          <div className="kpi">
            <div className="v" style={{ color: "var(--green)" }}>
              {dogruSay}
            </div>
            <div className="k">Doğru</div>
          </div>
          <div className="kpi">
            <div className="v" style={{ color: "var(--blue-soft)" }}>
              {Math.round((dogruSay / sayac) * 100)}%
            </div>
            <div className="k">Doğruluk</div>
          </div>
        </div>
      )}

      {soru ? (
        <div className="stack">
          <SoruBlok
            soru={soru}
            no={sayac + (cevaplandi ? 0 : 1)}
            secim={secim}
            onSec={cevaplandi ? undefined : cevapla}
            geriBildirim={cevaplandi}
          />
          <div className="between">
            {cevaplandi ? (
              <>
                <span className={`pill ${sonuc === "dogru" ? "green" : "red"}`}>
                  {sonuc === "dogru" ? "✓ Doğru!" : "✗ Yanlış"} · doğru cevap {soru.dogru}
                </span>
                <button className="btn btn-primary" onClick={uret}>
                  Sıradaki soru →
                </button>
              </>
            ) : (
              <span className="small muted">
                Cevabını seç; çözüm ve konu açıklaması anında açılsın.
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="panel panel-pad center" style={{ padding: 60 }}>
          <div style={{ fontSize: 44 }}>🎯</div>
          <h3 style={{ fontSize: 22, margin: "12px 0 8px" }}>Hazır olduğunda butona bas</h3>
          <p className="small muted" style={{ maxWidth: 460, lineHeight: 1.8 }}>
            Bankada {BANK.length} soru var. Ders ve zorluk seçerek sana özel bir akış
            oluşturabilirsin; istersen filtreleri boş bırakıp tamamen rastgele ilerle.
          </p>
        </div>
      )}
    </>
  );
}
