"use client";

import Link from "next/link";
import { CIKMIS_DENEMELER } from "@/lib/exams";
import { useVeri } from "@/lib/store";
import { DERS_ADI, DERS_RENK } from "@/lib/types";
import { BANK } from "@/lib/questions";
import { modalAc } from "@/lib/modal";

export default function Denemeler() {
  const veri = useVeri();
  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">BÖLÜM 01</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Çıkmış Denemeler
        </h1>
        <p className="lead">
          MEB’in 2018–2025 arasında yayımladığı resmî kitapçıklardan derlenen tam
          format denemeler. Gerçek sınavdaki gibi iki oturum: 09.30’da 50 soruluk
          sözel (75 dakika), 11.30’da 40 soruluk sayısal (80 dakika). Puanlama MEB
          katsayılarıyla (Türkçe/Mat/Fen 4, diğerleri 1) hesaplanır.
        </p>
      </section>

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Denemeler</h2>
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
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Çıkmışlar bittiyse?</h3>
          <p className="small muted" style={{ lineHeight: 1.9, margin: "0 0 16px" }}>
            Menüden <b style={{ color: "var(--acc)" }}>Deneme Üret</b> butonuna bas;
            dersleri, soru sayısını, süreyi ve zorluğu sen seçtiğin bir deneme
            hemen kurulsun. Her açılışta farklı soru kombinasyonu gelir.
          </p>
          <button className="btn btn-blue" onClick={() => modalAc("uret")}>
            Deneme oluştur →
          </button>
        </div>
      </div>
    </>
  );
}
