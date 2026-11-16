"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  hesapSil,
  ozetHesapla,
  profilGuncelle,
  sifreBelirle,
  sifreDegistir,
  sifreKaldir,
  useVeri,
} from "@/lib/store";
import { gunlukSoz } from "@/lib/motivasyon";
import { ROZETLER, aktifRozetler } from "@/lib/rozetler";
import { sureyiYaz } from "@/lib/scoring";

export default function Profil() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);
  const kazanilan = aktifRozetler(veri, ozet);
  const soz = gunlukSoz();

  /* ---------- profil alanları ---------- */
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

  /* ---------- uygulama kilidi ---------- */
  const kilitli = !!veri.profil.kilit;
  const [sifreMod, setSifreMod] = useState<"degistir" | "kaldir">("degistir");
  const [kurKodu, setKurKodu] = useState("");
  const [mevcutKod, setMevcutKod] = useState("");
  const [yeniKod, setYeniKod] = useState("");
  const [sifreMsg, setSifreMsg] = useState<{ tur: "ok" | "hata"; yazi: string } | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const sifreBilgi = (tur: "ok" | "hata", yazi: string) => setSifreMsg({ tur, yazi });

  const kodKur = async () => {
    if (kurKodu.trim().length < 4) {
      sifreBilgi("hata", "Kod en az 4 karakter olmalı.");
      return;
    }
    setYukleniyor(true);
    await sifreBelirle(kurKodu);
    setYukleniyor(false);
    setKurKodu("");
    sifreBilgi("ok", "Kilid ayarlandı. Uygulama her yeni oturumda bu kodu soracak.");
  };

  const kodGuncelle = async () => {
    if (!mevcutKod.trim()) {
      sifreBilgi("hata", "Mevcut kodu gir.");
      return;
    }
    if (yeniKod.trim().length < 4) {
      sifreBilgi("hata", "Yeni kod en az 4 karakter olmalı.");
      return;
    }
    setYukleniyor(true);
    const tamam = await sifreDegistir(mevcutKod, yeniKod);
    setYukleniyor(false);
    if (tamam) {
      setMevcutKod("");
      setYeniKod("");
      sifreBilgi("ok", "Kod güncellendi.");
    } else {
      sifreBilgi("hata", "Mevcut kod hatalı.");
    }
  };

  const kodKaldir = async () => {
    if (!mevcutKod.trim()) {
      sifreBilgi("hata", "Kaldırmak için mevcut kodu gir.");
      return;
    }
    setYukleniyor(true);
    const tamam = await sifreKaldir(mevcutKod);
    setYukleniyor(false);
    if (tamam) {
      setMevcutKod("");
      sifreBilgi("ok", "Kilit kaldırıldı. Artık koda gerek yok.");
    } else {
      sifreBilgi("hata", "Mevcut kod hatalı.");
    }
  };

  /* ---------- hesabı sil ---------- */
  const [silOnayi, setSilOnayi] = useState(false);
  const hesabiSil = () => {
    if (!silOnayi) {
      setSilOnayi(true);
      return;
    }
    hesapSil();
    window.location.reload();
  };

  /* ---------- hedefler ---------- */
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
  const denemeler = veri.denemeler;

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
          Profil & Ayarlar
        </h1>
        <p className="lead">
          Adın, hedeflerin ve kilit ayarların burada; hepsi yalnızca bu cihazda
          saklanır. Aşağıda ilerlemeni ve çözdüğün denemeleri tekrar tekrar açabilirsin.
        </p>
      </section>

      {/* --- PROFİL & AYARLAR (en üstte) --- */}
      <div className="panel panel-pad" id="ayarlar" style={{ marginBottom: 20 }}>
        <div className="between" style={{ marginBottom: 18 }}>
          <div>
            <p className="eyebrow">KİMLİK & HEDEFLER</p>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "56ch" }}>
              Adın menüde, hedefin profil kartında görünür.
            </p>
          </div>
          {kaydedildi && <span className="pill green">Kaydedildi ✓</span>}
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

        {/* --- uygulama kilidi --- */}
        <div className="divider" style={{ margin: "26px 0" }} />
        <div className="between" style={{ marginBottom: 14 }}>
          <div>
            <p className="eyebrow">UYGULAMA KİLİDİ</p>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "58ch" }}>
              {kilitli
                ? "Kodun açık; her yeni oturumda önce bu kod istenir. Değiştirebilir veya kaldırabilirsin."
                : "Kod eklersen EGA her yeni oturumda ilk önce bunu sorar. Kodun bu cihazda özetlenerek saklanır."}
            </p>
          </div>
          {kilitli && <span className="pill green">Korunuyor</span>}
        </div>

        {!kilitli ? (
          <div className="row wrap">
            <input
              type="password"
              placeholder="Profil kodu (en az 4 karakter)"
              value={kurKodu}
              onChange={(e) => setKurKodu(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && kodKur()}
              style={{ flex: 1, minWidth: 240 }}
            />
            <button
              className="btn btn-primary"
              disabled={yukleniyor || kurKodu.trim().length < 4}
              onClick={kodKur}
            >
              Kilidi kur
            </button>
          </div>
        ) : (
          <>
            <div className="chips" style={{ marginBottom: 12 }}>
              <button
                className={`chip ${sifreMod === "degistir" ? "on" : ""}`}
                onClick={() => setSifreMod("degistir")}
              >
                Kodu değiştir
              </button>
              <button
                className={`chip ${sifreMod === "kaldir" ? "on" : ""}`}
                onClick={() => setSifreMod("kaldir")}
              >
                Kilidi kaldır
              </button>
            </div>
            <div className="row wrap">
              <input
                type="password"
                placeholder="Mevcut kod"
                value={mevcutKod}
                onChange={(e) => setMevcutKod(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (sifreMod === "degistir" ? kodGuncelle() : kodKaldir())}
                style={{ width: 200 }}
              />
              {sifreMod === "degistir" && (
                <input
                  type="password"
                  placeholder="Yeni kod (en az 4 karakter)"
                  value={yeniKod}
                  onChange={(e) => setYeniKod(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && kodGuncelle()}
                  style={{ flex: 1, minWidth: 220 }}
                />
              )}
              {sifreMod === "degistir" ? (
                <button
                  className="btn btn-primary"
                  disabled={yukleniyor || !mevcutKod.trim() || yeniKod.trim().length < 4}
                  onClick={kodGuncelle}
                >
                  Güncelle
                </button>
              ) : (
                <button
                  className="btn btn-red"
                  disabled={yukleniyor || !mevcutKod.trim()}
                  onClick={kodKaldir}
                >
                  Kaldır
                </button>
              )}
            </div>
          </>
        )}

        {sifreMsg && (
          <p
            className="small"
            style={{
              color: sifreMsg.tur === "ok" ? "var(--green)" : "var(--red)",
              marginTop: 10,
            }}
          >
            {sifreMsg.yazi}
          </p>
        )}

        {/* --- tehlikeli bölge --- */}
        <div className="divider" style={{ margin: "26px 0" }} />
        <div className="between">
          <div>
            <p className="eyebrow" style={{ background: "transparent", color: "var(--red)", boxShadow: "none", padding: 0 }}>
              TEHLİKELİ BÖLGE
            </p>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "56ch" }}>
              Adın, hedeflerin, soru geçmişin, denemelerin, rozetlerin ve kilit
              ayarların bu cihazdan kalıcı olarak silinir. Geri yükleme yoktur.
            </p>
          </div>
          <div className="row">
            {silOnayi ? (
              <>
                <button className="btn" onClick={() => setSilOnayi(false)}>
                  Vazgeç
                </button>
                <button className="btn btn-red" onClick={hesabiSil}>
                  Eminim, hesabımı sil
                </button>
              </>
            ) : (
              <button className="btn btn-red" onClick={hesabiSil}>
                Hesabımı sil
              </button>
            )}
          </div>
        </div>
      </div>

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

      {/* --- rozetler + denemelerim --- */}
      <div className="grid g-2" style={{ alignItems: "start" }}>
        <div className="stack">
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
            <Link href="/istatistik/" className="btn btn-sm" style={{ marginTop: 16 }}>
              Tüm rozetler ve analiz →
            </Link>
          </div>

          <div className="panel panel-pad">
            <p className="eyebrow">GÜNÜN SÖZÜ</p>
            <p className="quote" style={{ margin: "14px 0 10px" }}>
              “{soz.metin}”
            </p>
            <p className="small muted">— {soz.kim}</p>
          </div>
        </div>

        {/* --- denemelerim --- */}
        <div className="panel panel-pad">
          <div className="between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 19 }}>Denemelerim</h3>
            <span className="pill blue">{denemeler.length} deneme</span>
          </div>

          {denemeler.length === 0 ? (
            <p className="small muted">
              Henüz deneme bitirmedin. İlk denemeni çözdüğünde adı, doğru/yanlış/net
              ve puanı burada listelenir; istediğin gibi tekrar açabilirsin.
            </p>
          ) : (
            <div className="denemeler-liste">
              {denemeler.map((d) => {
                const yol = d.baslangic ? `/sinav/?${d.baslangic}` : "/denemeler/";
                return (
                  <Link href={yol} className="deneme-satir" key={d.id}>
                    <div className="ds-bas">
                      <b>{d.ad}</b>
                      <span className="small muted">
                        {new Date(d.tarih).toLocaleDateString("tr-TR")} ·{" "}
                        {d.tur === "cikmis" ? "Çıkmış" : "Üretilmiş"} ·{" "}
                        {sureyiYaz(d.sure)} · {d.toplamSoru} soru
                      </span>
                    </div>
                    <div className="ds-sonuc">
                      <span className="ds-v" style={{ color: "var(--green)" }}>
                        {d.dogru}
                        <i>D</i>
                      </span>
                      <span className="ds-v" style={{ color: "var(--red)" }}>
                        {d.yanlis}
                        <i>Y</i>
                      </span>
                      <span className="ds-v" style={{ color: "var(--blue-soft)" }}>
                        {d.net}
                        <i>N</i>
                      </span>
                      <span className="ds-v" style={{ color: "var(--acc)" }}>
                        {d.puan}
                        <i>P</i>
                      </span>
                    </div>
                    <span className="small ds-ac">Tekrar aç →</span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="row wrap" style={{ marginTop: 16 }}>
            <Link href="/denemeler/" className="btn btn-primary btn-sm">
              Yeni deneme başlat →
            </Link>
            <Link href="/banka/" className="btn btn-sm">
              Test Çöz
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
