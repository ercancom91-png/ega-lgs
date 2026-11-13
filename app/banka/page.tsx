"use client";

import { useMemo, useState } from "react";
import SoruBlok from "@/components/SoruBlok";
import { filtrele, karistir, konular } from "@/lib/questions";
import { DERS_ADI, DERS_RENK, Ders, Harf, Soru } from "@/lib/types";
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
  const [adet, setAdet] = useState(10);
  const [test, setTest] = useState<Soru[]>([]);
  const [cevaplar, setCevaplar] = useState<Record<string, Harf | null>>({});
  const [isaretler, setIsaretler] = useState<Record<string, boolean>>({});
  const [kesinlesti, setKesinlesti] = useState(false);

  const konuListesi = konular(ders === "hepsi" ? undefined : ders);
  const havuz = useMemo(() => filtrele({ ders, konu }), [ders, konu]);

  const testKur = () => {
    const secili = karistir(havuz, Math.random).slice(0, adet);
    setTest(secili);
    setCevaplar({});
    setIsaretler({});
    setKesinlesti(false);
    setTimeout(() => {
      document.getElementById("test-baslangic")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  /** Şık işaretlenince bir sonraki soruya kendisi atlar. */
  const cevapla = (id: string, h: Harf, i: number) => {
    if (kesinlesti) return;
    setCevaplar((c) => ({ ...c, [id]: h }));
    const sonraki = test[i + 1];
    if (!sonraki) return;
    setTimeout(() => {
      document
        .querySelector(`[data-soru-id="${sonraki.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">BÖLÜM 04</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Soru Bankası
        </h1>
        <p className="lead">
          Ders ve konu seç, kaç soru çözmek istediğini belirle; kendi testini kur.
          Kontrol ettiğinde her sorunun çözümü ve doğru cevabı açılır, sonuç
          istatistiğine işlenir.
        </p>
      </section>

      <div className="panel filtre-panel" style={{ marginBottom: 24 }}>
        <div className="filtre-blok">
          <div className="filtre-baslik">
            <p className="eyebrow">1 · DERS SEÇ</p>
            <span className="pill acc">
              {ders === "hepsi" ? "Tüm dersler" : `${DERS_ADI[ders as Ders]} seçildi`}
            </span>
          </div>
          <div className="chips">
            <button
              className={`chip ${ders === "hepsi" ? "on" : ""}`}
              onClick={() => {
                setDers("hepsi");
                setKonu("hepsi");
              }}
            >
              <b style={{ fontSize: 13 }}>{ders === "hepsi" ? "✓" : "◻"}</b> Tümü
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
                <i
                  className="ders-dot"
                  style={{ background: DERS_RENK[d], marginRight: 6 }}
                />
                <b style={{ fontSize: 13 }}>{ders === d ? "✓" : "◻"}</b>
                {DERS_ADI[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="filtre-blok">
          <div className="filtre-baslik">
            <p className="eyebrow">2 · FİLTRELERİ AYARLA</p>
            <span className="pill">{havuz.length} soru eşleşti</span>
          </div>
          <div className="filtre-row">
            <div className="filtre-alan">
              <label>KONU</label>
              <select value={konu} onChange={(e) => setKonu(e.target.value)}>
                <option value="hepsi">Tüm konular ({havuz.length} soru)</option>
                {konuListesi.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
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
              Testi kur →
            </button>
          </div>
        </div>

        <div className="filtre-blok">
          <p className="eyebrow ink" style={{ marginBottom: 14 }}>
            HAZIR ŞABLONLAR
          </p>
          <div className="chips">
            {[
              { ad: "Hız testi", d: "hepsi", k: "hepsi", n: 5 },
              { ad: "20 soruluk genel", d: "hepsi", k: "hepsi", n: 20 },
              { ad: "Sadece matematik", d: "Matematik", k: "hepsi", n: 10 },
              { ad: "Sadece Türkçe", d: "Turkce", k: "hepsi", n: 10 },
            ].map((h) => {
              const aktif = ders === h.d && konu === h.k && adet === h.n;
              return (
                <button
                  key={h.ad}
                  className={`chip ${aktif ? "on" : ""}`}
                  onClick={() => {
                    setDers(h.d as Ders | "hepsi");
                    setKonu(h.k);
                    setAdet(h.n);
                  }}
                >
                  {aktif ? "✓ " : ""}{h.ad}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div id="test-baslangic" />
      {test.length > 0 && (
        <>
          <div className="between test-ust" style={{ marginBottom: 18 }}>
            <h2 className="h-sec">Testin ({test.length} soru)</h2>
            <div className="row wrap">
              {kesinlesti ? (
                <>
                  <span className="pill green">Doğru {dogru}</span>
                  <span className="pill red">Yanlış {yanlis}</span>
                  <span className="pill">Boş {bos}</span>
                  <span className="pill acc">Net {net}</span>
                </>
              ) : (
                <>
                  <span className="pill">
                    {Object.keys(cevaplar).length} / {test.length} işaretlendi
                  </span>
                  <span className="pill blue">Cevapladıkça alttaki soruya atlar</span>
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
                onIsaretle={() => setIsaretler((v) => ({ ...v, [s.id]: !v[s.id] }))}
              />
            ))}
          </div>

          <div className="kontrol-alt">
            {kesinlesti ? (
              <div className="row wrap" style={{ justifyContent: "center", gap: 18 }}>
                <span className="big-score">{net}</span>
                <span className="muted" style={{ alignSelf: "center" }}>
                  net · {dogru}/{test.length} doğru
                </span>
                <button className="btn btn-primary" onClick={testKur}>
                  Aynı filtrelerle yeni test
                </button>
                <button className="btn ghost" onClick={() => { setTest([]); setCevaplar({}); }}>
                  Testi kapat
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={kontrolEt}>
                  Kontrol et ✓
                </button>
                <p className="small muted" style={{ marginTop: 14 }}>
                  Yanlışlar kırmızı, doğrular yeşil, boşlar gri işaretlenir; her sorunun
                  çözümü açılır.
                </p>
              </>
            )}
          </div>
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
