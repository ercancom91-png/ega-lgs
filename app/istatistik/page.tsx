"use client";

import Link from "next/link";
import { useMemo } from "react";
import { bugun, ozetHesapla, useVeri, veriSifirla } from "@/lib/store";
import { BANK } from "@/lib/questions";
import { DERS_ADI, DERS_RENK } from "@/lib/types";
import { sureyiYaz } from "@/lib/scoring";
import { ROZETLER, aktifRozetler } from "@/lib/rozetler";

export default function Istatistik() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);

  const konuMap = useMemo(() => new Map(BANK.map((s) => [s.id, s])), []);

  const sonGunler = useMemo(() => {
    const gunler: { gun: string; cozulen: number; dogru: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const anahtar = d.toISOString().slice(0, 10);
      const g = veri.gunluk[anahtar] || { cozulen: 0, dogru: 0, yanlis: 0 };
      gunler.push({
        gun: d.toLocaleDateString("tr-TR", { weekday: "short" }),
        cozulen: g.cozulen,
        dogru: g.dogru,
      });
    }
    return gunler;
  }, [veri.gunluk]);

  const konuAnaliz = useMemo(() => {
    const harita = new Map<
      string,
      { konu: string; ders: string; soru: number; dogru: number; yanlis: number }
    >();
    Object.entries(veri.sorular).forEach(([id, s]) => {
      const q = konuMap.get(id);
      if (!q) return;
      const k = harita.get(q.konu) || {
        konu: q.konu,
        ders: q.ders,
        soru: 0,
        dogru: 0,
        yanlis: 0,
      };
      k.soru += s.dogru + s.yanlis + s.bos;
      k.dogru += s.dogru;
      k.yanlis += s.yanlis;
      harita.set(q.konu, k);
    });
    return Array.from(harita.values())
      .filter((k) => k.soru >= 3)
      .map((k) => ({ ...k, yuzde: Math.round((k.dogru / k.soru) * 100) }))
      .sort((a, b) => a.yuzde - b.yuzde);
  }, [veri.sorular, konuMap]);

  const enZayif = konuAnaliz.slice(0, 6);
  const enGuc = konuAnaliz.slice(-4).reverse();

  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">BÖLÜM 05</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          İstatistik & Motivasyon
        </h1>
        <p className="lead">
          {veri.profil.ad}, çözdüğün her soru burada toplanır. Sayılara değil, trende bak:
          zayıf konularını gör, güçlü taraflarını koru.
        </p>
      </section>

      <div className="grid g-4">
        <div className="kpi">
          <div className="v">{ozet.toplamSoru}</div>
          <div className="k">Toplam soru</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--green)" }}>
            {ozet.dogru}
          </div>
          <div className="k">Doğru</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--red)" }}>
            {ozet.yanlis}
          </div>
          <div className="k">Yanlış</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--blue-soft)" }}>
            {ozet.net}
          </div>
          <div className="k">Toplam net</div>
        </div>
      </div>

      <div className="grid g-3" style={{ marginTop: 18 }}>
        <div className="kpi">
          <div className="v" style={{ color: "var(--red)" }}>
            {veri.uzunluk} 🔥
          </div>
          <div className="k">Aktif seri (en uzun {veri.enUzun})</div>
        </div>
        <div className="kpi">
          <div className="v">%{ozet.dogruYuzde}</div>
          <div className="k">Genel doğruluk</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--blue-soft)" }}>
            {ozet.enIyiPuan || "—"}
          </div>
          <div className="k">En iyi deneme puanı</div>
        </div>
      </div>

      <div className="divider" />

      <h2 className="h-sec" style={{ marginBottom: 18 }}>
        Son 7 gün
      </h2>
      <div className="panel panel-pad">
        <div className="grid g-4" style={{ gap: 14 }}>
          {sonGunler.map((g, i) => {
            const max = Math.max(10, ...sonGunler.map((x) => x.cozulen));
            const bugunMu =
              g.gun === new Date().toLocaleDateString("tr-TR", { weekday: "short" });
            return (
              <div key={i}>
                <div
                  style={{
                    height: 130,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: `${(g.cozulen / max) * 100}%`,
                      minHeight: 3,
                      borderRadius: "8px 8px 3px 3px",
                      background:
                        g.cozulen === 0
                          ? "var(--panel-3)"
                          : "linear-gradient(180deg,var(--red),var(--blue))",
                      opacity: bugunMu ? 1 : 0.75,
                    }}
                  />
                </div>
                <div className="small muted" style={{ marginTop: 8 }}>
                  {g.gun}
                </div>
                <div style={{ fontWeight: 700 }}>{g.cozulen}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      <div className="grid g-2" style={{ alignItems: "start" }}>
        <div className="panel panel-pad">
          <h3 style={{ fontSize: 19, marginBottom: 16 }}>Ders bazlı dağılım</h3>
          {ozet.toplamSoru === 0 ? (
            <p className="small muted">Henüz veri yok. Birkaç soru çözmeye başla.</p>
          ) : (
            Object.keys(DERS_ADI).map((ders) => {
              let soru = 0,
                dogru = 0;
              veri.denemeler.forEach((d) => {
                const ds = d.dersler.find((x) => x.ders === ders);
                if (ds) {
                  soru += ds.soru;
                  dogru += ds.dogru;
                }
              });
              const gunlukDers = BANK.filter((s) => s.ders === ders).filter((s) => {
                const st = veri.sorular[s.id];
                return st && st.dogru + st.yanlis + st.bos > 0;
              }).length;
              const toplam = soru + gunlukDers;
              if (!toplam) return null;
              return (
                <div className="bar-row" key={ders}>
                  <span className="small">{DERS_ADI[ders as keyof typeof DERS_ADI]}</span>
                  <div className="bar">
                    <i
                      style={{
                        width: `${Math.min(100, (dogru / Math.max(1, soru || gunlukDers)) * 100)}%`,
                        background: DERS_RENK[ders as keyof typeof DERS_RENK],
                      }}
                    />
                  </div>
                  <span className="small" style={{ textAlign: "right" }}>
                    {toplam} soru
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="panel panel-pad">
          <h3 style={{ fontSize: 19, marginBottom: 16 }}>Zayıf konu analizi</h3>
          {enZayif.length === 0 ? (
            <p className="small muted">
              En az 3 soru çözdüğün bir konu olduğunda analiz burada görünecek.
            </p>
          ) : (
            enZayif.map((k) => (
              <div className="bar-row" key={k.konu}>
                <span className="small">{k.konu}</span>
                <div className="bar">
                  <i
                    style={{
                      width: `${k.yuzde}%`,
                      background:
                        k.yuzde < 50
                          ? "var(--red)"
                          : k.yuzde < 75
                          ? "var(--amber)"
                          : "var(--green)",
                    }}
                  />
                </div>
                <span className="small" style={{ textAlign: "right" }}>
                  %{k.yuzde}
                </span>
              </div>
            ))
          )}
          {enGuc.length > 0 && (
            <>
              <p className="eyebrow" style={{ margin: "20px 0 10px" }}>
                EN GÜÇLÜ KONULARIN
              </p>
              <div className="chips">
                {enGuc.map((k) => (
                  <span key={k.konu} className="pill green">
                    {k.konu} · %{k.yuzde}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="divider" />

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Deneme geçmişi</h2>
        <Link href="/uretilmis/" className="btn btn-sm btn-blue">
          Yeni deneme üret
        </Link>
      </div>
      {veri.denemeler.length === 0 ? (
        <div className="panel panel-pad center" style={{ padding: 44 }}>
          <div style={{ fontSize: 38 }}>📝</div>
          <h3 style={{ fontSize: 20, margin: "10px 0 6px" }}>Henüz deneme bitirmedin</h3>
          <p className="small muted" style={{ maxWidth: 440, lineHeight: 1.8 }}>
            Deneme bittiğinde puanın, netlerin ve ders bazlı analizin buraya kaydedilir.
          </p>
          <Link href="/denemeler/" className="btn btn-primary" style={{ marginTop: 16 }}>
            İlk denemene başla →
          </Link>
        </div>
      ) : (
        <div className="panel panel-pad" style={{ overflowX: "auto" }}>
          <table className="q-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Deneme</th>
                <th>Tarih</th>
                <th>Süre</th>
                <th>Doğru</th>
                <th>Yanlış</th>
                <th>Boş</th>
                <th>Net</th>
                <th>Puan</th>
              </tr>
            </thead>
            <tbody>
              {veri.denemeler.map((d) => (
                <tr key={d.id}>
                  <td style={{ textAlign: "left" }}>{d.ad}</td>
                  <td>{new Date(d.tarih).toLocaleDateString("tr-TR")}</td>
                  <td>{sureyiYaz(d.sure)}</td>
                  <td style={{ color: "var(--green)" }}>{d.dogru}</td>
                  <td style={{ color: "var(--red)" }}>{d.yanlis}</td>
                  <td>{d.bos}</td>
                  <td>{d.net}</td>
                  <td>
                    <b>{d.puan}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="divider" />

      <div className="between" style={{ marginBottom: 18 }}>
        <h2 className="h-sec">Rozetler</h2>
        <span className="pill">
          {aktifRozetler(veri, ozet).size} / {ROZETLER.length} kazanıldı
        </span>
      </div>
      <div className="grid g-4">
        {ROZETLER.map((r) => (
          <div
            key={r.id}
            className={`badge ${aktifRozetler(veri, ozet).has(r.id) ? "on" : "off"}`}
          >
            <div className="ico">{r.ikon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.ad}</div>
              <div className="small muted">{r.aciklama}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="panel panel-pad between">
        <div>
          <h3 style={{ fontSize: 18 }}>Verilerini sıfırla</h3>
          <p className="small muted" style={{ margin: "6px 0 0", maxWidth: "52ch" }}>
            Tüm ilerlemen bu tarayıcıda saklanır ({bugun()} itibarıyla {ozet.toplamSoru}{" "}
            soru kaydı). Sıfırlamak geri alınamaz.
          </p>
        </div>
        <button
          className="btn"
          onClick={() => {
            if (confirm("Tüm ilerleme silinecek. Emin misin?")) veriSifirla();
          }}
        >
          Verileri sil
        </button>
      </div>
    </>
  );
}
