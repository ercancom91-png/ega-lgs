"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  fotoDosyasiniIsle,
  hesapSil,
  kullaniciCikisYap,
  ozetHesapla,
  profilGuncelle,
  sifreBelirle,
  sifreDegistir,
  sifreKaldir,
  useVeri,
} from "@/lib/store";
import { aktifOturumAl, supabaseParolaGuncelle } from "@/lib/supabase";
import { oracleDurumAl } from "@/lib/oracle";
import { gunlukSoz } from "@/lib/motivasyon";
import { ROZETLER, aktifRozetler } from "@/lib/rozetler";
import { sureyiYaz } from "@/lib/scoring";

const HEDEF_PUAN_SECENEKLER = [380, 400, 420, 450, 480, 500];
const GUNLUK_SORU_SECENEKLER = [20, 30, 50, 75, 100];

export default function Profil() {
  const veri = useVeri();
  const ozet = ozetHesapla(veri);
  const kazanilan = aktifRozetler(veri, ozet);
  const soz = gunlukSoz();
  const fotoInputRef = useRef<HTMLInputElement | null>(null);

  const [oturum, setOturum] = useState(() => aktifOturumAl());
  const [oracleDurum, setOracleDurum] = useState(() => oracleDurumAl());

  /* ---------- kimlik alanları (Rozetlerin altındaki bölüm) ---------- */
  const [ad, setAd] = useState(veri.profil.ad);
  const [soyad, setSoyad] = useState(veri.profil.soyad || "");
  const [eposta, setEposta] = useState(veri.profil.eposta || "");
  const [kaydedildi, setKaydedildi] = useState(false);
  const [hedefKaydedildi, setHedefKaydedildi] = useState(false);
  const [fotoHata, setFotoHata] = useState<string | null>(null);

  useEffect(() => {
    setAd(veri.profil.ad);
    setSoyad(veri.profil.soyad || "");
    setEposta(veri.profil.eposta || "");
    setOturum(aktifOturumAl());
    setOracleDurum(oracleDurumAl());
  }, [veri.profil.ad, veri.profil.soyad, veri.profil.eposta, veri.denemeler.length, ozet.toplamSoru]);

  useEffect(() => {
    if (!kaydedildi) return;
    const t = setTimeout(() => setKaydedildi(false), 2500);
    return () => clearTimeout(t);
  }, [kaydedildi]);

  useEffect(() => {
    if (!hedefKaydedildi) return;
    const t = setTimeout(() => setHedefKaydedildi(false), 1800);
    return () => clearTimeout(t);
  }, [hedefKaydedildi]);

  /* ---------- profil fotoğrafı yükleme ---------- */
  const fotoSecildi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    setFotoHata(null);
    if (!dosya.type.startsWith("image/")) {
      setFotoHata("Lütfen geçerli bir görsel dosyası (PNG, JPG, WebP) seçin.");
      return;
    }
    try {
      const veriUri = await fotoDosyasiniIsle(dosya);
      profilGuncelle({ foto: veriUri });
    } catch {
      setFotoHata("Fotoğraf işlenirken bir hata oluştu.");
    }
    e.target.value = "";
  };

  const fotoKaldir = () => {
    profilGuncelle({ foto: undefined });
  };

  /* ---------- hedef puan & günlük soru güncelleme ---------- */
  const hedefPuanSec = (deger: number) => {
    const temiz = Math.max(100, Math.min(500, Math.round(deger || 420)));
    profilGuncelle({ hedefPuan: temiz });
    setHedefKaydedildi(true);
  };

  const gunlukSoruSec = (deger: number) => {
    const temiz = Math.max(1, Math.min(500, Math.round(deger || 30)));
    profilGuncelle({ hedefGunlukSoru: temiz });
    setHedefKaydedildi(true);
  };

  /* ---------- kimlik bilgilerini kaydet ---------- */
  const kimlikKaydet = () => {
    profilGuncelle({
      ad: ad.trim() || "Öğrenci",
      soyad: soyad.trim(),
      eposta: eposta.trim().toLowerCase(),
    });
    setKaydedildi(true);
  };

  /* ---------- parola & uygulama kilidi ---------- */
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
      sifreBilgi("hata", "Parola / kilit kodu en az 4 karakter olmalı.");
      return;
    }
    setYukleniyor(true);
    await sifreBelirle(kurKodu);
    setYukleniyor(false);
    setKurKodu("");
    sifreBilgi("ok", "Parola kilidi ayarlandı. Her yeni oturumda bu parola sorulacak.");
  };

  const kodGuncelle = async () => {
    if (!mevcutKod.trim()) {
      sifreBilgi("hata", "Mevcut parolayı girin.");
      return;
    }
    if (yeniKod.trim().length < 4) {
      sifreBilgi("hata", "Yeni parola en az 4 karakter olmalı.");
      return;
    }
    setYukleniyor(true);
    const tamam = await sifreDegistir(mevcutKod, yeniKod);
    if (veri.profil.eposta) {
      await supabaseParolaGuncelle(veri.profil.eposta, mevcutKod, yeniKod);
    }
    setYukleniyor(false);
    if (tamam) {
      setMevcutKod("");
      setYeniKod("");
      sifreBilgi("ok", "Parolanız başarıyla güncellendi.");
    } else {
      sifreBilgi("hata", "Mevcut parola hatalı.");
    }
  };

  const kodKaldir = async () => {
    if (!mevcutKod.trim()) {
      sifreBilgi("hata", "Kaldırmak için mevcut parolayı girin.");
      return;
    }
    setYukleniyor(true);
    const tamam = await sifreKaldir(mevcutKod);
    setYukleniyor(false);
    if (tamam) {
      setMevcutKod("");
      sifreBilgi("ok", "Uygulama kilidi kaldırıldı.");
    } else {
      sifreBilgi("hata", "Mevcut parola hatalı.");
    }
  };

  /* ---------- hesabı sil / çıkış ---------- */
  const [silOnayi, setSilOnayi] = useState(false);
  const hesabiSil = () => {
    if (!silOnayi) {
      setSilOnayi(true);
      return;
    }
    hesapSil();
    window.location.reload();
  };

  const oturumKapat = async () => {
    await kullaniciCikisYap();
    setOturum(null);
  };

  /* ---------- hesaplamalar ---------- */
  const tamAd = [veri.profil.ad || "Öğrenci", veri.profil.soyad]
    .filter(Boolean)
    .join(" ");
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

  return (
    <>
      <section style={{ padding: "36px 0 22px" }}>
        <div className="between wrap" style={{ gap: 16 }}>
          <div>
            <p className="eyebrow">PROFİL & HEDEFLER</p>
            <h1 className="h-sec" style={{ margin: "10px 0 10px" }}>
              Öğrenci Profili
            </h1>
            <p className="lead">
              Hedef puanını, günlük soru kotanı, çözdüğün denemeleri ve rozetlerini
              buradan takip edebilir; en alttaki ayarlar bölümünden kimlik ve parola
              bilgilerini yönetebilirsin.
            </p>
          </div>
          <div className="row wrap">
            {oturum ? (
              <>
                <span className="pill green">
                  ● Oracle SQL Oturumu Aktif ({oturum.eposta})
                </span>
                <button className="btn btn-sm" onClick={oturumKapat}>
                  Oturumu Kapat
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("ega-modal", { detail: { tur: "giris" } })
                  );
                }}
              >
                Giriş Yap / Kayıt Ol →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* --- 1. PROFİL KARTI (Fotoğraf + İsim Soyisim + Özet) --- */}
      <div className="profil" style={{ marginBottom: 22 }}>
        <div className="profil-avatar-wrap">
          <button
            type="button"
            className="avatar avatar-btn"
            onClick={() => fotoInputRef.current?.click()}
            title="Profil fotoğrafı yüklemek veya değiştirmek için tıkla"
          >
            {veri.profil.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={veri.profil.foto}
                alt={tamAd}
                className="avatar-img"
              />
            ) : (
              <span>{bas}</span>
            )}
            <span className="avatar-kamera">📷</span>
          </button>
          <input
            ref={fotoInputRef}
            type="file"
            accept="image/*"
            onChange={fotoSecildi}
            style={{ display: "none" }}
          />
          <div className="avatar-aksiyonlar">
            <button
              type="button"
              className="avatar-link"
              onClick={() => fotoInputRef.current?.click()}
            >
              {veri.profil.foto ? "Değiştir" : "Fotoğraf ekle"}
            </button>
            {veri.profil.foto && (
              <button
                type="button"
                className="avatar-link sil"
                onClick={fotoKaldir}
              >
                Kaldır
              </button>
            )}
          </div>
        </div>

        <div className="profil-bilgi">
          <h2>{tamAd}</h2>
          <div className="p-sub">
            8. Sınıf · LGS Hazırlık
            {veri.profil.eposta ? ` · ${veri.profil.eposta}` : ""}
          </div>
          <div className="profil-rozet-satir">
            <span className="p-tag">🎯 Hedef: {veri.profil.hedefPuan} Puan</span>
            <span className="p-tag">📝 Günlük: {veri.profil.hedefGunlukSoru} Soru</span>
            <span className="p-tag">
              🗄️ Oracle DB & Supabase:{" "}
              {oracleDurum.sonSenkronizasyon ? "Senkronize" : "Hazır"}
            </span>
          </div>
          {fotoHata && (
            <p className="small" style={{ color: "#7f1d1d", marginTop: 6, fontWeight: 700 }}>
              {fotoHata}
            </p>
          )}
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

      {/* --- 2. HEDEFLER BÖLÜMÜ (Profil İsminin Altında İnteraktif Hedef Seçimi) --- */}
      <div className="hedef-baslik-satir between wrap" style={{ marginBottom: 14 }}>
        <div className="row wrap">
          <span className="eyebrow">HEDEFLERİM & İLERLEME</span>
          <span className="small muted">
            Hedef puanını ve günlük soru kotanı doğrudan aşağıdaki kartlardan seçebilirsin.
          </span>
        </div>
        {hedefKaydedildi && <span className="pill green">Hedef güncellendi ✓</span>}
      </div>

      <div className="grid g-3" style={{ marginBottom: 22 }}>
        {/* HEDEF PUAN KARTI */}
        <div className="panel panel-pad hedef-kart aktif-kart">
          <div className="between">
            <p className="eyebrow">HEDEF PUAN</p>
            <span className="pill acc">%{puanYuzde}</span>
          </div>
          <div className="streak" style={{ margin: "12px 0 10px" }}>
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
          <p className="small muted" style={{ marginTop: 10 }}>
            {ozet.enIyiPuan >= veri.profil.hedefPuan
              ? "Hedef puanı geçtin, tebrikler! 🏆"
              : `Hedefe ${Math.max(
                  0,
                  veri.profil.hedefPuan - (ozet.enIyiPuan || 0)
                )} puan kaldı.`}
          </p>

          {/* İnteraktif Hedef Puan Seçici */}
          <div className="hedef-secici">
            <div className="between" style={{ marginBottom: 8 }}>
              <span className="hedef-etiket">Hedef Puanı Seç (100–500)</span>
              <span className="hedef-deger-rozet">{veri.profil.hedefPuan} P</span>
            </div>
            <div className="hedef-presets">
              {HEDEF_PUAN_SECENEKLER.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`hedef-chip ${veri.profil.hedefPuan === p ? "on" : ""}`}
                  onClick={() => hedefPuanSec(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="hedef-slider-satir">
              <button
                type="button"
                className="hedef-step"
                onClick={() => hedefPuanSec(veri.profil.hedefPuan - 5)}
                title="5 puan azalt"
              >
                −
              </button>
              <input
                type="range"
                min={100}
                max={500}
                step={5}
                value={veri.profil.hedefPuan}
                onChange={(e) => hedefPuanSec(Number(e.target.value))}
                className="hedef-range"
                aria-label="Hedef puan kaydırıcı"
              />
              <button
                type="button"
                className="hedef-step"
                onClick={() => hedefPuanSec(veri.profil.hedefPuan + 5)}
                title="5 puan artır"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* GÜNLÜK SORU HEDEFİ KARTI */}
        <div className="panel panel-pad hedef-kart">
          <div className="between">
            <p className="eyebrow">GÜNLÜK SORU</p>
            <span className={`pill ${gunlukYuzde >= 100 ? "green" : "acc"}`}>
              %{gunlukYuzde}
            </span>
          </div>
          <div className="streak" style={{ margin: "12px 0 10px" }}>
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
          <p className="small muted" style={{ marginTop: 10 }}>
            {kalan === 0
              ? "Bugünkü hedefini tamamladın. Harikasın! 🎉"
              : `Bugün ${kalan} soru daha çözmelisin.`}
          </p>

          {/* İnteraktif Günlük Soru Seçici */}
          <div className="hedef-secici">
            <div className="between" style={{ marginBottom: 8 }}>
              <span className="hedef-etiket">Günlük Hedef Seç</span>
              <span className="hedef-deger-rozet">{veri.profil.hedefGunlukSoru} Soru</span>
            </div>
            <div className="hedef-presets">
              {GUNLUK_SORU_SECENEKLER.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`hedef-chip ${veri.profil.hedefGunlukSoru === s ? "on" : ""}`}
                  onClick={() => gunlukSoruSec(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="hedef-slider-satir">
              <button
                type="button"
                className="hedef-step"
                onClick={() => gunlukSoruSec(veri.profil.hedefGunlukSoru - 5)}
                title="5 soru azalt"
              >
                −
              </button>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={Math.min(200, veri.profil.hedefGunlukSoru)}
                onChange={(e) => gunlukSoruSec(Number(e.target.value))}
                className="hedef-range"
                aria-label="Günlük soru hedefi kaydırıcı"
              />
              <button
                type="button"
                className="hedef-step"
                onClick={() => gunlukSoruSec(veri.profil.hedefGunlukSoru + 5)}
                title="5 soru artır"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* GÜN SERİSİ KARTI */}
        <div className="panel panel-pad hedef-kart">
          <div className="between">
            <p className="eyebrow">GÜN SERİSİ</p>
            <span className="pill blue">en uzun {veri.enUzun}</span>
          </div>
          <div className="streak" style={{ margin: "12px 0 10px" }}>
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
          <p className="small muted" style={{ marginTop: 10 }}>
            Seriyi bozmamak için her gün en az 1 soru çöz. 🔥
          </p>

          <div className="hedef-secici">
            <div className="between" style={{ marginBottom: 8 }}>
              <span className="hedef-etiket">Günün Motivasyon Sözü</span>
              <span className="pill">{soz.kim}</span>
            </div>
            <p className="small" style={{ lineHeight: 1.6, color: "var(--text)" }}>
              “{soz.metin}”
            </p>
          </div>
        </div>
      </div>

      {/* --- 3. ÖZET KPI KARTLARI --- */}
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

      {/* --- 4. ROZETLERİM + DENEMELERİM --- */}
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
          <Link href="/istatistik/" className="btn btn-sm" style={{ marginTop: 16 }}>
            Tüm rozetler ve analiz →
          </Link>
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

      <div className="divider" />

      {/* --- 5. KİMLİK, E-POSTA & PAROLA AYARLARI (Rozetlerin Altında) --- */}
      <div className="panel panel-pad" id="ayarlar">
        <div className="between wrap" style={{ marginBottom: 18, gap: 12 }}>
          <div>
            <p className="eyebrow">HESAP & KİMLİK BİLGİLERİ</p>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "62ch" }}>
              İsim, soyisim, e-posta ve parola ayarların burada yer alır. Bilgilerin
              Supabase ve Oracle veritabanı katmanıyla senkronize edilir.
            </p>
          </div>
          {kaydedildi && <span className="pill green">Bilgiler kaydedildi ✓</span>}
        </div>

        <div className="kimlik-form-grid">
          <div className="form-alan">
            <label className="small muted" htmlFor="profil-ad">
              İsim
            </label>
            <input
              id="profil-ad"
              type="text"
              value={ad}
              placeholder="Adın"
              onChange={(e) => setAd(e.target.value)}
            />
          </div>
          <div className="form-alan">
            <label className="small muted" htmlFor="profil-soyad">
              Soyisim
            </label>
            <input
              id="profil-soyad"
              type="text"
              value={soyad}
              placeholder="Soyadın"
              onChange={(e) => setSoyad(e.target.value)}
            />
          </div>
          <div className="form-alan">
            <label className="small muted" htmlFor="profil-eposta">
              E-posta (Mail)
            </label>
            <input
              id="profil-eposta"
              type="email"
              value={eposta}
              placeholder="ornek@ogrenci.com"
              onChange={(e) => setEposta(e.target.value)}
            />
          </div>
          <div className="form-alan form-buton-alan">
            <button className="btn btn-primary" onClick={kimlikKaydet} style={{ width: "100%", justifyContent: "center" }}>
              Bilgileri Kaydet
            </button>
          </div>
        </div>

        {/* --- parola & uygulama kilidi --- */}
        <div className="divider" style={{ margin: "26px 0" }} />
        <div className="between wrap" style={{ marginBottom: 14, gap: 12 }}>
          <div>
            <p className="eyebrow">PAROLA & UYGULAMA KİLİDİ</p>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "60ch" }}>
              {kilitli
                ? "Parola kilidin aktif; her yeni oturumda önce bu parola istenir. Aşağıdan değiştirebilir veya kaldırabilirsin."
                : "Parola belirleyerek hesabını ve uygulama açılışını koruma altına alabilirsin. Parolan SHA-256 ile özetlenerek saklanır."}
            </p>
          </div>
          {kilitli && <span className="pill green">Parola Koruması Aktif</span>}
        </div>

        {!kilitli ? (
          <div className="row wrap">
            <input
              type="password"
              placeholder="Parola belirle (en az 4 karakter)"
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
              Parolayı Kaydet
            </button>
          </div>
        ) : (
          <>
            <div className="chips" style={{ marginBottom: 12 }}>
              <button
                className={`chip ${sifreMod === "degistir" ? "on" : ""}`}
                onClick={() => setSifreMod("degistir")}
              >
                Parolayı değiştir
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
                placeholder="Mevcut parola"
                value={mevcutKod}
                onChange={(e) => setMevcutKod(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (sifreMod === "degistir" ? kodGuncelle() : kodKaldir())
                }
                style={{ minWidth: 200, flex: 1 }}
              />
              {sifreMod === "degistir" && (
                <input
                  type="password"
                  placeholder="Yeni parola (en az 4 karakter)"
                  value={yeniKod}
                  onChange={(e) => setYeniKod(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && kodGuncelle()}
                  style={{ flex: 1, minWidth: 220 }}
                />
              )}
              {sifreMod === "degistir" ? (
                <button
                  className="btn btn-primary"
                  disabled={
                    yukleniyor || !mevcutKod.trim() || yeniKod.trim().length < 4
                  }
                  onClick={kodGuncelle}
                >
                  Parolayı Güncelle
                </button>
              ) : (
                <button
                  className="btn btn-red"
                  disabled={yukleniyor || !mevcutKod.trim()}
                  onClick={kodKaldir}
                >
                  Kilidi Kaldır
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
        <div className="between wrap" style={{ gap: 14 }}>
          <div>
            <p
              className="eyebrow"
              style={{
                background: "transparent",
                color: "var(--red)",
                boxShadow: "none",
                padding: 0,
              }}
            >
              TEHLİKELİ BÖLGE
            </p>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "56ch" }}>
              Adın, hedeflerin, soru geçmişin, denemelerin, rozetlerin ve parola
              ayarların bu cihazdan kalıcı olarak silinir. Geri yükleme yoktur.
            </p>
          </div>
          <div className="row wrap">
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
    </>
  );
}
