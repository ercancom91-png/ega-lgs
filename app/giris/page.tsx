"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  fotoDosyasiniIsle,
  kullaniciCikisYap,
  kullaniciGirisYap,
  kullaniciKayitOl,
  useVeri,
} from "@/lib/store";
import { aktifOturumAl, supabaseYapilandirildiMi } from "@/lib/supabase";
import { oracleDurumAl } from "@/lib/oracle";

const HIZLI_PUANLAR = [380, 400, 420, 450, 480, 500];

export default function GirisSayfasi() {
  const router = useRouter();
  const veri = useVeri();
  const fotoRef = useRef<HTMLInputElement | null>(null);

  const [mod, setMod] = useState<"giris" | "kayit">("giris");
  const [oturum, setOturum] = useState(() => aktifOturumAl());

  // Giriş alanları
  const [girisEposta, setGirisEposta] = useState("");
  const [girisParola, setGirisParola] = useState("");

  // Kayıt alanları
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [eposta, setEposta] = useState("");
  const [parola, setParola] = useState("");
  const [parolaTekrar, setParolaTekrar] = useState("");
  const [hedefPuan, setHedefPuan] = useState(450);
  const [gunlukHedef, setGunlukHedef] = useState(40);
  const [foto, setFoto] = useState<string | undefined>(undefined);

  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<{ tur: "ok" | "hata"; yazi: string } | null>(null);

  useEffect(() => {
    setOturum(aktifOturumAl());
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("mod") === "kayit") setMod("kayit");
    }
  }, []);

  const fotoYukle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    try {
      const uri = await fotoDosyasiniIsle(dosya);
      setFoto(uri);
    } catch {
      setMesaj({ tur: "hata", yazi: "Fotoğraf işlenemedi." });
    }
    e.target.value = "";
  };

  const handleGiris = async (e: React.FormEvent) => {
    e.preventDefault();
    setMesaj(null);
    setYukleniyor(true);
    const sonuc = await kullaniciGirisYap(girisEposta, girisParola);
    setYukleniyor(false);
    if (!sonuc.ok) {
      setMesaj({ tur: "hata", yazi: sonuc.mesaj });
      return;
    }
    setOturum(sonuc.oturum || null);
    setMesaj({ tur: "ok", yazi: sonuc.mesaj });
    setTimeout(() => router.push("/profil/"), 600);
  };

  const handleKayit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMesaj(null);
    if (!ad.trim()) {
      setMesaj({ tur: "hata", yazi: "Lütfen adınızı girin." });
      return;
    }
    if (parola.length < 6) {
      setMesaj({ tur: "hata", yazi: "Parola en az 6 karakter olmalıdır." });
      return;
    }
    if (parola !== parolaTekrar) {
      setMesaj({ tur: "hata", yazi: "Girdiğiniz parolalar birbiriyle eşleşmiyor." });
      return;
    }
    setYukleniyor(true);
    const sonuc = await kullaniciKayitOl({
      ad,
      soyad,
      eposta,
      parola,
      foto,
      hedefPuan,
      hedefGunlukSoru: gunlukHedef,
    });
    setYukleniyor(false);
    if (!sonuc.ok) {
      setMesaj({ tur: "hata", yazi: sonuc.mesaj });
      return;
    }
    setOturum(sonuc.oturum || null);
    setMesaj({ tur: "ok", yazi: sonuc.mesaj });
    setTimeout(() => router.push("/profil/"), 700);
  };

  const oracle = oracleDurumAl();
  const supaBagli = supabaseYapilandirildiMi();

  return (
    <section style={{ padding: "32px 0 40px" }}>
      <div className="auth-layout">
        {/* SOL BİLGİ PANELİ */}
        <div className="auth-hero panel panel-pad">
          <p className="eyebrow">EGA · BULUT HESAP & VERİTABANI</p>
          <h1 className="h-sec" style={{ margin: "14px 0 12px" }}>
            LGS Hazırlıkta Tüm İlerlemen Güvende
          </h1>
          <p className="lead" style={{ fontSize: 15.5 }}>
            Hesabını oluşturarak çözdüğün çıkmış LGS denemelerini, konu testlerini,
            hedef puanını ve rozetlerini <strong>Supabase Auth</strong> ve{" "}
            <strong>Oracle Veritabanı</strong> altyapısıyla senkronize et.
          </p>

          <div className="auth-ozellik-liste">
            <div className="auth-ozellik">
              <span className="auth-ico">🔐</span>
              <div>
                <b>Supabase Kimlik Doğrulama</b>
                <p className="small muted">
                  E-posta ve SHA-256 korumalı parolanla güvenli kayıt ve oturum yönetimi.
                </p>
              </div>
            </div>
            <div className="auth-ozellik">
              <span className="auth-ico">🗄️</span>
              <div>
                <b>Oracle Autonomous Database</b>
                <p className="small muted">
                  Deneme sonuçların, netlerin ve soru istatistiklerin kurumsal veritabanı
                  şemasıyla saklanır.
                </p>
              </div>
            </div>
            <div className="auth-ozellik">
              <span className="auth-ico">🎯</span>
              <div>
                <b>Kişiselleştirilmiş Hedef & Profil Fotoğrafı</b>
                <p className="small muted">
                  Profil fotoğrafını yükle, hedef LGS puanını belirle ve gelişimini anlık
                  izle.
                </p>
              </div>
            </div>
          </div>

          <div className="auth-db-durum">
            <span className="pill green">
              ● Supabase Auth {supaBagli ? "Bulut" : "Aktif"}
            </span>
            <span className="pill blue">
              ● Oracle DB ({oracle.toplamKayit} senkron işlem)
            </span>
          </div>
        </div>

        {/* SAĞ FORM PANELİ */}
        <div className="auth-form-kutu panel panel-pad">
          {oturum && (
            <div className="auth-aktif-oturum">
              <div className="row" style={{ gap: 12 }}>
                <div className="nav-avatar" style={{ width: 42, height: 42, fontSize: 17 }}>
                  {veri.profil.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={veri.profil.foto}
                      alt={oturum.ad}
                      className="avatar-img"
                    />
                  ) : (
                    (oturum.ad || "Ö").slice(0, 1).toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>
                    {[veri.profil.ad || oturum.ad, veri.profil.soyad || oturum.soyad]
                      .filter(Boolean)
                      .join(" ")}
                  </div>
                  <div className="small muted">{oturum.eposta} · Oturum açık</div>
                </div>
              </div>
              <div className="row wrap" style={{ marginTop: 12 }}>
                <Link href="/profil/" className="btn btn-primary btn-sm">
                  Profile Git →
                </Link>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={async () => {
                    await kullaniciCikisYap();
                    setOturum(null);
                  }}
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mod === "giris" ? "on" : ""}`}
              onClick={() => {
                setMod("giris");
                setMesaj(null);
              }}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              className={`auth-tab ${mod === "kayit" ? "on" : ""}`}
              onClick={() => {
                setMod("kayit");
                setMesaj(null);
              }}
            >
              Kayıt Ol
            </button>
          </div>

          {mesaj && (
            <div
              className={`auth-mesaj ${mesaj.tur === "ok" ? "ok" : "hata"}`}
              role="alert"
            >
              {mesaj.yazi}
            </div>
          )}

          {mod === "giris" ? (
            <form onSubmit={handleGiris} className="stack" style={{ gap: 16 }}>
              <div>
                <label className="small muted" htmlFor="giris-eposta">
                  E-posta Adresi
                </label>
                <input
                  id="giris-eposta"
                  type="email"
                  required
                  value={girisEposta}
                  onChange={(e) => setGirisEposta(e.target.value)}
                  placeholder="ornek@ogrenci.com"
                  style={{ width: "100%", marginTop: 6 }}
                />
              </div>

              <div>
                <label className="small muted" htmlFor="giris-parola">
                  Parola
                </label>
                <input
                  id="giris-parola"
                  type="password"
                  required
                  value={girisParola}
                  onChange={(e) => setGirisParola(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", marginTop: 6 }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={yukleniyor}
                style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
              >
                {yukleniyor ? "Giriş yapılıyor..." : "Hesabıma Giriş Yap →"}
              </button>

              <div className="between wrap" style={{ paddingTop: 6 }}>
                <span className="small muted">Henüz hesabın yok mu?</span>
                <button
                  type="button"
                  className="avatar-link"
                  onClick={() => {
                    setMod("kayit");
                    setMesaj(null);
                  }}
                >
                  Hemen ücretsiz kayıt ol →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleKayit} className="stack" style={{ gap: 15 }}>
              {/* Profil Fotoğrafı Seçimi */}
              <div className="kayit-foto-satir">
                <button
                  type="button"
                  className="kayit-foto-btn"
                  onClick={() => fotoRef.current?.click()}
                >
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto} alt="Önizleme" className="avatar-img" />
                  ) : (
                    <span>📷</span>
                  )}
                </button>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    Profil Fotoğrafı (İsteğe Bağlı)
                  </div>
                  <div className="small muted" style={{ marginTop: 2 }}>
                    Yüklemek için fotoğrafa veya aşağıdaki butona tıkla.
                  </div>
                  <div className="row" style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => fotoRef.current?.click()}
                    >
                      {foto ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
                    </button>
                    {foto && (
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => setFoto(undefined)}
                      >
                        Kaldır
                      </button>
                    )}
                  </div>
                </div>
                <input
                  ref={fotoRef}
                  type="file"
                  accept="image/*"
                  onChange={fotoYukle}
                  style={{ display: "none" }}
                />
              </div>

              <div className="g-2">
                <div>
                  <label className="small muted" htmlFor="kayit-ad">
                    İsim *
                  </label>
                  <input
                    id="kayit-ad"
                    type="text"
                    required
                    value={ad}
                    onChange={(e) => setAd(e.target.value)}
                    placeholder="Adın"
                    style={{ width: "100%", marginTop: 6 }}
                  />
                </div>
                <div>
                  <label className="small muted" htmlFor="kayit-soyad">
                    Soyisim *
                  </label>
                  <input
                    id="kayit-soyad"
                    type="text"
                    required
                    value={soyad}
                    onChange={(e) => setSoyad(e.target.value)}
                    placeholder="Soyadın"
                    style={{ width: "100%", marginTop: 6 }}
                  />
                </div>
              </div>

              <div>
                <label className="small muted" htmlFor="kayit-eposta">
                  E-posta Adresi (Mail) *
                </label>
                <input
                  id="kayit-eposta"
                  type="email"
                  required
                  value={eposta}
                  onChange={(e) => setEposta(e.target.value)}
                  placeholder="ogrenci@okul.com"
                  style={{ width: "100%", marginTop: 6 }}
                />
              </div>

              <div className="g-2">
                <div>
                  <label className="small muted" htmlFor="kayit-parola">
                    Parola (en az 6 karakter) *
                  </label>
                  <input
                    id="kayit-parola"
                    type="password"
                    required
                    minLength={6}
                    value={parola}
                    onChange={(e) => setParola(e.target.value)}
                    placeholder="••••••"
                    style={{ width: "100%", marginTop: 6 }}
                  />
                </div>
                <div>
                  <label className="small muted" htmlFor="kayit-parola-tekrar">
                    Parola Tekrar *
                  </label>
                  <input
                    id="kayit-parola-tekrar"
                    type="password"
                    required
                    minLength={6}
                    value={parolaTekrar}
                    onChange={(e) => setParolaTekrar(e.target.value)}
                    placeholder="••••••"
                    style={{ width: "100%", marginTop: 6 }}
                  />
                </div>
              </div>

              {/* Hedef Puan Seçimi */}
              <div className="hedef-secici" style={{ marginTop: 4 }}>
                <div className="between" style={{ marginBottom: 8 }}>
                  <span className="hedef-etiket">Hedef LGS Puanın</span>
                  <span className="hedef-deger-rozet">{hedefPuan} Puan</span>
                </div>
                <div className="hedef-presets">
                  {HIZLI_PUANLAR.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`hedef-chip ${hedefPuan === p ? "on" : ""}`}
                      onClick={() => setHedefPuan(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="hedef-slider-satir" style={{ marginTop: 8 }}>
                  <input
                    type="range"
                    min={200}
                    max={500}
                    step={5}
                    value={hedefPuan}
                    onChange={(e) => setHedefPuan(Number(e.target.value))}
                    className="hedef-range"
                  />
                  <span className="small muted" style={{ whiteSpace: "nowrap" }}>
                    Günlük {gunlukHedef} soru
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={yukleniyor}
                style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              >
                {yukleniyor ? "Kaydediliyor..." : "Supabase ile Kayıt Ol →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
