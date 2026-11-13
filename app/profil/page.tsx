"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ozetHesapla, profilGuncelle, useVeri } from "@/lib/store";
import { gunlukSoz } from "@/lib/motivasyon";
import { ROZETLER, aktifRozetler } from "@/lib/rozetler";

export default function Profil() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);
  const kazanilan = aktifRozetler(veri, ozet);
  const soz = gunlukSoz();

  const [ad, setAd] = useState(veri.profil.ad);
  const [hedef, setHedef] = useState(veri.profil.hedefPuan);
  const [gunluk, setGunluk] = useState(veri.profil.hedefGunlukSoru);
  const [kaydedildi, setKaydedildi] = useState(false);

  useEffect(() => {
    setAd(veri.profil.ad);
    setHedef(veri.profil.hedefPuan);
    setGunluk(veri.profil.hedefGunlukSoru);
  }, [veri.profil.ad, veri.profil.hedefPuan, veri.profil.hedefGunlukSoru]);

  useEffect(() => {
    if (!kaydedildi) return;
    const t = setTimeout(() => setKaydedildi(false), 2500);
    return () => clearTimeout(t);
  }, [kaydedildi]);

  const bas = (veri.profil.ad || "Ö").trim().slice(0, 1).toUpperCase();
  const gunlukYuzde = Math.min(
    100,
    Math.round((ozet.bugunCozulen / Math.max(1, veri.profil.hedefGunlukSoru)) * 100)
  );
  const puanYuzde = Math.min(
    100,
    Math.round((ozet.enIyiPuan / Math.max(1, veri.profil.hedefPuan)) * 100)
  );
  const seriYuzde = veri.enUzun
    ? Math.min(100, Math.round((veri.uzunluk / veri.enUzun) * 100))
    : 0;
  const kalan = Math.max(0, veri.profil.hedefGunlukSoru - ozet.bugunCozulen);
  const sonDeneme = veri.denemeler[0];

  const kaydet = () => {
    profilGuncelle({
      ad: ad.trim() || "Öğrenci",
      hedefPuan: Math.max(100, Math.min(500, hedef || 420)),
      hedefGunlukSoru: Math.max(1, Math.min(500, gunluk || 30)),
    });
    setKaydedildi(true);
  };

  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">PROFİL</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Profil
        </h1>
        <p className="lead">
          {veri.profil.ad}, kim olduğunu, hedeflerini ve birikimini tek ekranda gör.
          Adını ve hedeflerini buradan güncelle; ilerlemen her yerde buna göre yazılır.
        </p>
      </section>

      {/* --- profil kartı --- */}
      <div className="profil" style={{ marginBottom: 20 }}>
        <div className="avatar">{bas}</div>
        <div>
          <h2>{veri.profil.ad || "Öğrenci"}</h2>
          <div className="p-sub">
            8. Sınıf · LGS Hazırlık · Hedef {veri.profil.hedefPuan} puan ·
            Günlük {veri.profil.hedefGunlukSoru} soru
          </div>
        </div>
        <div className="p-meta">
          <div className="pm">
            <b>{veri.uzunluk}</b>
            <span>günlük seri</span>
          </div>
          <div className="pm">
            <b>{ozet.enIyiPuan || "—"}</b>
            <span>en iyi puan</span>
          </div>
          <div className="pm">
            <b>{kazanilan.size}</b>
            <span>rozet</span>
          </div>
        </div>
      </div>

      {/* --- hedefler --- */}
      <div className="grid g-3">
        <div className="panel panel-pad">
          <div className="between">
            <p className="eyebrow">GÜNLÜK SORU</p>
            <span className={`pill ${gunlukYuzde >= 100 ? "green" : "acc"}`}>
              %{gunlukYuzde}
            </span>
          </div>
          <div className="streak" style={{ margin: "12px 0" }}>
            <b>{ozet.bugunCozulen}</b>
            <span className="muted">/ {veri.profil.hedefGunlukSoru} soru</span>
          </div>
          <div className="bar">
            <i
              style={{
                width: `${gunlukYuzde}%`,
                background:
                  gunlukYuzde >= 100
                    ? "linear-gradient(90deg,var(--green),#3fb950)"
                    : "linear-gradient(90deg,var(--acc),var(--acc-2))",
              }}
            />
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            {kalan === 0
              ? "Bugünkü hedefini tamamladın. Harikasın! 🎉"
              : `Bugün ${kalan} soru daha çözmelisin.`}
          </p>
        </div>

        <div className="panel panel-pad">
          <div className="between">
            <p className="eyebrow">HEDEF PUAN</p>
            <span className="pill red">%{puanYuzde}</span>
          </div>
          <div className="streak" style={{ margin: "12px 0" }}>
            <b>{ozet.enIyiPuan || 0}</b>
            <span className="muted">/ {veri.profil.hedefPuan} puan</span>
          </div>
          <div className="bar">
            <i
              style={{
                width: `${puanYuzde}%`,
                background: "linear-gradient(90deg,var(--acc),var(--acc-2))",
              }}
            />
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            {ozet.enIyiPuan >= veri.profil.hedefPuan
              ? "Hedef puanı geçtin, aferin! 🏆"
              : `Hedefe ${Math.max(
                  0,
                  veri.profil.hedefPuan - (ozet.enIyiPuan || 0)
                )} puan kaldı. Denemelerle üstüne koy.`}
          </p>
        </div>

        <div className="panel panel-pad">
          <div className="between">
            <p className="eyebrow">GÜN SERİSİ</p>
            <span className="pill blue">en uzun {veri.enUzun}</span>
          </div>
          <div className="streak" style={{ margin: "12px 0" }}>
            <b>{veri.uzunluk}</b>
            <span className="muted">gün üst üste</span>
          </div>
          <div className="bar">
            <i
              style={{
                width: `${seriYuzde}%`,
                background: "linear-gradient(90deg,var(--red),var(--amber))",
              }}
            />
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            Seriyi bozmamak için her gün en az 1 soru çöz. 🔥
          </p>
        </div>
      </div>

      {/* --- özet --- */}
      <div className="grid g-4" style={{ marginTop: 20 }}>
        <div className="kpi">
          <div className="v">{ozet.toplamSoru}</div>
          <div className="k">Çözülen soru</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--green)" }}>
            %{ozet.dogruYuzde}
          </div>
          <div className="k">Doğruluk</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--blue-soft)" }}>
            {ozet.net}
          </div>
          <div className="k">Toplam net</div>
        </div>
        <div className="kpi">
          <div className="v" style={{ color: "var(--acc)" }}>
            {ozet.denemeSayisi}
          </div>
          <div className="k">Çözülen deneme</div>
        </div>
      </div>

      <div className="divider" />

      {/* --- rozetler + deneme özeti --- */}
      <div className="grid g-2" style={{ alignItems: "start" }}>
        <div className="panel panel-pad">
          <div className="between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 19 }}>Rozetlerim</h3>
            <span className="pill">
              {kazanilan.size} / {ROZETLER.length}
            </span>
          </div>
          {kazanilan.size === 0 ? (
            <p className="small muted">
              Henüz rozet kazanmadın. İlk sorunu çözdüğünde “İlk Adım” rozeti senin.
            </p>
          ) : (
            <div className="grid g-3" style={{ gap: 14 }}>
              {ROZETLER.filter((r) => kazanilan.has(r.id)).map((r) => (
                <div key={r.id} className="badge on">
                  <div className="ico">{r.ikon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.ad}</div>
                    <div className="small muted">{r.aciklama}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            href="/istatistik/"
            className="btn btn-sm"
            style={{ marginTop: 16 }}
          >
            Tüm rozetler ve analiz →
          </Link>
        </div>

        <div className="stack">
          <div className="panel panel-pad">
            <div className="between" style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 19 }}>Deneme kartım</h3>
              <span className="pill blue">{ozet.denemeSayisi} deneme</span>
            </div>
            {sonDeneme ? (
              <>
                <div className="streak" style={{ marginBottom: 8 }}>
                  <b>{sonDeneme.puan}</b>
                  <span className="muted">
                    puan · {sonDeneme.ad} ·{" "}
                    {new Date(sonDeneme.tarih).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="small muted">
                  En iyi {ozet.enIyiPuan || sonDeneme.puan} · Son denemede{" "}
                  {sonDeneme.dogru} doğru, {sonDeneme.yanlis} yanlış,{" "}
                  {sonDeneme.bos} boş.
                </p>
              </>
            ) : (
              <p className="small muted">
                Henüz deneme bitirmedin. İlk denemeni çözdüğünde puanın burada.
              </p>
            )}
            <div className="row wrap" style={{ marginTop: 14 }}>
              <Link href="/denemeler/" className="btn btn-primary btn-sm">
                Denemeler →
              </Link>
              <Link href="/banka/" className="btn btn-sm">
                Test Çöz
              </Link>
            </div>
          </div>

          <div className="panel panel-pad">
            <p className="eyebrow">GÜNÜN SÖZÜ</p>
            <p className="quote" style={{ margin: "14px 0 10px" }}>
              “{soz.metin}”
            </p>
            <p className="small muted">— {soz.kim}</p>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* --- profil ayarları --- */}
      <div className="panel panel-pad" id="ayarlar">
        <div className="between" style={{ marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 19 }}>Profil ayarları</h3>
            <p className="small muted" style={{ margin: "6px 0 0", maxWidth: "54ch" }}>
              İlerlemen bu tarayıcıda saklanır; adın ve hedeflerin her yerde görünür.
            </p>
          </div>
          {kaydedildi && (
            <span className="pill green">Kaydedildi ✓</span>
          )}
        </div>
        <div className="row wrap">
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="small muted">Adın</label>
            <input
              type="text"
              value={ad}
              placeholder="Adın"
              onChange={(e) => setAd(e.target.value)}
              style={{ width: "100%", marginTop: 6 }}
            />
          </div>
          <div style={{ width: 150 }}>
            <label className="small muted">Hedef puan</label>
            <input
              type="number"
              value={hedef}
              min={100}
              max={500}
              onChange={(e) => setHedef(Number(e.target.value))}
              style={{ width: "100%", marginTop: 6 }}
            />
          </div>
          <div style={{ width: 170 }}>
            <label className="small muted">Günlük soru hedefi</label>
            <input
              type="number"
              value={gunluk}
              min={1}
              max={500}
              onChange={(e) => setGunluk(Number(e.target.value))}
              style={{ width: "100%", marginTop: 6 }}
            />
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-blue" onClick={kaydet}>
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
