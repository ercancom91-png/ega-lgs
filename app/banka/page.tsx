"use client";

import { useMemo, useState } from "react";
import SoruBlok from "@/components/SoruBlok";
import { filtrele, karistir, konular } from "@/lib/questions";
import {
  DERS_ADI,
  DERS_RENK,
  Ders,
  Harf,
  Soru,
  ZORLUK_ADI,
  Zorluk,
} from "@/lib/types";
import { netHesapla } from "@/lib/scoring";
import { soruKaydet } from "@/lib/store";

const TUM_DERSLER: Ders[] = [
  "Turkce",
  "Matematik",
  "Fen",
  "Inkilap",
  "Ingilizce",
  "Din",
];

export default function Banka() {
  const [ders, setDers] = useState<Ders | "hepsi">("hepsi");
  const [konu, setKonu] = useState<string | "hepsi">("hepsi");
  const [zorluk, setZorluk] = useState<Zorluk | "hepsi">("hepsi");
  const [adet, setAdet] = useState(10);
  const [test, setTest] = useState<Soru[]>([]);
  const [cevaplar, setCevaplar] = useState<Record<string, Harf | null>>({});
  const [kesinlesti, setKesinlesti] = useState(false);

  const konuListesi = konular(ders === "hepsi" ? undefined : ders);
  const havuz = useMemo(() => filtrele({ ders, konu, zorluk }), [ders, konu, zorluk]);

  const testKur = () => {
    const secili = karistir(havuz, Math.random).slice(0, adet);
    setTest(secili);
    setCevaplar({});
    setKesinlesti(false);
  };

  const cevapla = (id: string, h: Harf) => {
    if (kesinlesti) return;
    setCevaplar((c) => ({ ...c, [id]: h }));
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

  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">BÖLÜM 04</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Soru Bankası
        </h1>
        <p className="lead">
          Ders, konu ve zorluk seç; istediğin kadar sorudan kendi testini kur. Kontrol
          ettiğinde her sorunun çözümü ve doğru cevabı açılır, sonuç istatistiğine işlenir.
        </p>
      </section>

      <div className="panel panel-pad" style={{ marginBottom: 22 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          DERS
        </p>
        <div className="chips" style={{ marginBottom: 18 }}>
          <button
            className={`chip ${ders === "hepsi" ? "on" : ""}`}
            onClick={() => {
              setDers("hepsi");
              setKonu("hepsi");
            }}
          >
            Tümü
          </button>
          {TUM_DERSLER.map((d) => (
            <button
              key={d}
              className={`chip ${ders === d ? "on" : ""}`}
              onClick={() => {
                setDers(d);
                setKonu("hepsi");
              }}
            >
              <i className="ders-dot" style={{ background: DERS_RENK[d], marginRight: 6 }} />
              {DERS_ADI[d]}
            </button>
          ))}
        </div>

        <div className="row" style={{ alignItems: "flex-end", gap: 18 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              KONU
            </p>
            <select
              value={konu}
              onChange={(e) => setKonu(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="hepsi">Tüm konular ({havuz.length} soru)</option>
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
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              SORU SAYISI
            </p>
            <select value={adet} onChange={(e) => setAdet(Number(e.target.value))}>
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} soru
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={testKur} disabled={!havuz.length}>
            Testi kur →
          </button>
        </div>

        <div className="chips" style={{ marginTop: 16 }}>
          {[
            { ad: "Hız testi", d: "hepsi", k: "hepsi", z: "hepsi" as Zorluk | "hepsi", n: 5 },
            { ad: "Sadece zor sorular", d: "hepsi", k: "hepsi", z: 3 as Zorluk | "hepsi", n: 10 },
            { ad: "Sadece matematik", d: "Matematik", k: "hepsi", z: "hepsi" as Zorluk | "hepsi", n: 10 },
            { ad: "Sadece Türkçe", d: "Turkce", k: "hepsi", z: "hepsi" as Zorluk | "hepsi", n: 10 },
          ].map((h) => (
            <button
              key={h.ad}
              className="chip"
              onClick={() => {
                setDers(h.d as Ders | "hepsi");
                setKonu(h.k);
                setZorluk(h.z);
                setAdet(h.n);
              }}
            >
              {h.ad}
            </button>
          ))}
        </div>
      </div>

      {test.length > 0 && (
        <>
          <div className="between" style={{ marginBottom: 18 }}>
            <h2 className="h-sec">Testin ({test.length} soru)</h2>
            <div className="row">
              {kesinlesti ? (
                <>
                  <span className="pill green">Doğru {dogru}</span>
                  <span className="pill red">Yanlış {yanlis}</span>
                  <span className="pill">Boş {bos}</span>
                  <span className="pill blue">Net {net}</span>
                  <button className="btn btn-sm" onClick={testKur}>
                    Yeni test kur
                  </button>
                </>
              ) : (
                <>
                  <span className="pill">
                    {Object.keys(cevaplar).length} / {test.length} işaretlendi
                  </span>
                  <button className="btn btn-sm btn-primary" onClick={kontrolEt}>
                    Kontrol et ✓
                  </button>
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
                onSec={(h) => cevapla(s.id, h)}
                geriBildirim={kesinlesti}
              />
            ))}
          </div>

          {kesinlesti && (
            <div className="panel panel-pad center" style={{ marginTop: 24, padding: 34 }}>
              <p className="eyebrow">OTURUM ÖZETİ</p>
              <div className="streak" style={{ margin: "10px 0" }}>
                <b>{net}</b>
                <span className="muted small">net · {dogru}/{test.length} doğru</span>
              </div>
              <div className="row" style={{ justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={testKur}>
                  Aynı filtrelerle yeni test
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setTest([]);
                    setCevaplar({});
                  }}
                >
                  Testi kapat
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {test.length === 0 && (
        <div className="panel panel-pad center" style={{ padding: 50 }}>
          <div style={{ fontSize: 40 }}>📚</div>
          <h3 style={{ fontSize: 20, margin: "10px 0 6px" }}>Henüz test kurulmadı</h3>
          <p className="small muted" style={{ maxWidth: 440, lineHeight: 1.8 }}>
            Yukarıdaki filtreleri seç ve <b>Testi kur</b> butonuna bas. Hazır şablonlarla
            da tek tıkla başlayabilirsin.
          </p>
        </div>
      )}
    </>
  );
}
