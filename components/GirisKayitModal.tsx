"use client";

import { useRef, useState } from "react";
import {
  epostaDogrulamaKoduGonder,
  fotoDosyasiniIsle,
  kullaniciGirisYap,
  kullaniciKayitOl,
} from "@/lib/store";

interface Props {
  baslangicMod?: "giris" | "kayit";
  uyari?: string;
  kapat: () => void;
  basarili?: () => void;
}

export default function GirisKayitModal({
  baslangicMod = "giris",
  uyari,
  kapat,
  basarili,
}: Props) {
  const fotoRef = useRef<HTMLInputElement | null>(null);
  const [mod, setMod] = useState<"giris" | "kayit">(baslangicMod);

  // Giriş alanları
  const [girisEposta, setGirisEposta] = useState("");
  const [girisParola, setGirisParola] = useState("");

  // Kayıt alanları (Adım 1: Bilgiler, Adım 2: E-posta Doğrulama Kodu)
  const [kayitAdim, setKayitAdim] = useState<"bilgi" | "dogrulama">("bilgi");
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [eposta, setEposta] = useState("");
  const [parola, setParola] = useState("");
  const [parolaTekrar, setParolaTekrar] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [dogrulamaKodu, setDogrulamaKodu] = useState("");
  const [gonderilenKodBilgi, setGonderilenKodBilgi] = useState<string | null>(
    null
  );

  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<{
    tur: "ok" | "hata";
    yazi: string;
  } | null>(null);

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
    setMesaj({ tur: "ok", yazi: sonuc.mesaj });
    setTimeout(() => {
      basarili?.();
      kapat();
    }, 350);
  };

  const kodGonder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setMesaj(null);
    if (!ad.trim()) {
      setMesaj({ tur: "hata", yazi: "Lütfen adınızı girin." });
      return;
    }
    if (!soyad.trim()) {
      setMesaj({ tur: "hata", yazi: "Lütfen soyadınızı girin." });
      return;
    }
    if (parola.length < 6) {
      setMesaj({ tur: "hata", yazi: "Parola en az 6 karakter olmalıdır." });
      return;
    }
    if (parola !== parolaTekrar) {
      setMesaj({
        tur: "hata",
        yazi: "Girdiğiniz parolalar birbiriyle eşleşmiyor.",
      });
      return;
    }
    setYukleniyor(true);
    const yanit = await epostaDogrulamaKoduGonder({
      ad,
      soyad,
      eposta,
      parola,
    });
    setYukleniyor(false);
    if (!yanit.ok) {
      setMesaj({ tur: "hata", yazi: yanit.mesaj });
      return;
    }
    setKayitAdim("dogrulama");
    setDogrulamaKodu("");
    setGonderilenKodBilgi(yanit.dogrulamaKodu || null);
    setMesaj({ tur: "ok", yazi: yanit.mesaj });
  };

  const handleKayitTamamla = async (e: React.FormEvent) => {
    e.preventDefault();
    setMesaj(null);
    if (dogrulamaKodu.trim().length !== 6) {
      setMesaj({
        tur: "hata",
        yazi: "Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.",
      });
      return;
    }
    setYukleniyor(true);
    const sonuc = await kullaniciKayitOl({
      ad,
      soyad,
      eposta,
      parola,
      dogrulamaKodu: dogrulamaKodu.trim(),
      foto,
    });
    setYukleniyor(false);
    if (!sonuc.ok) {
      setMesaj({ tur: "hata", yazi: sonuc.mesaj });
      return;
    }
    setMesaj({ tur: "ok", yazi: sonuc.mesaj });
    setTimeout(() => {
      basarili?.();
      kapat();
    }, 400);
  };

  return (
    <div
      className="modal-bg giris-modal-kapsam"
      onClick={(e) => {
        if (e.target === e.currentTarget) kapat();
      }}
    >
      <div className="modal orta kaydir" style={{ maxWidth: 540 }}>
        <div className="modal-ust">
          <div className="row" style={{ gap: 10 }}>
            <span className="eyebrow">ORACLE SQL · ÜYELİK GEREKLİ</span>
          </div>
          <button
            type="button"
            className="modal-kapat"
            onClick={kapat}
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Uyarı kutusu */}
        <div
          style={{
            padding: "14px 16px",
            marginBottom: 18,
            background: "var(--acc-wash)",
            borderLeft: "4px solid var(--acc)",
            borderTop: "1px solid var(--line-2)",
            borderRight: "1px solid var(--line-2)",
            borderBottom: "1px solid var(--line-2)",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--acc)" }}>
            🔒 İçeriğe Erişmek İçin Giriş Yapın veya Kayıt Olun
          </div>
          <p className="small" style={{ marginTop: 4, color: "var(--text)" }}>
            {uyari ||
              "Kayıt olmayan kullanıcılar yalnızca sayfaları görüntüleyebilir. Soru çözmek, denemelere katılmak ve hedeflerinizi kaydetmek için lütfen giriş yapın veya ücretsiz kayıt olun."}
          </p>
        </div>

        <div className="auth-tabs" style={{ marginBottom: 16 }}>
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
              setKayitAdim("bilgi");
              setMesaj(null);
            }}
          >
            Ücretsiz Kayıt Ol
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
          <form onSubmit={handleGiris} className="stack" style={{ gap: 14 }}>
            <div>
              <label className="small muted" htmlFor="modal-giris-eposta">
                E-posta Adresi
              </label>
              <input
                id="modal-giris-eposta"
                type="email"
                required
                autoFocus
                value={girisEposta}
                onChange={(e) => setGirisEposta(e.target.value)}
                placeholder="ogrenci@okul.com"
                style={{ width: "100%", marginTop: 6 }}
              />
            </div>

            <div>
              <label className="small muted" htmlFor="modal-giris-parola">
                Parola
              </label>
              <input
                id="modal-giris-parola"
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
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            >
              {yukleniyor ? "Giriş yapılıyor..." : "Giriş Yap ve Devam Et →"}
            </button>

            <div className="between wrap" style={{ paddingTop: 4 }}>
              <span className="small muted">Henüz hesabın yok mu?</span>
              <button
                type="button"
                className="avatar-link"
                onClick={() => {
                  setMod("kayit");
                  setKayitAdim("bilgi");
                  setMesaj(null);
                }}
              >
                Hemen kayıt ol →
              </button>
            </div>
          </form>
        ) : kayitAdim === "bilgi" ? (
          <form onSubmit={kodGonder} className="stack" style={{ gap: 13 }}>
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
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                  Profil Fotoğrafı (İsteğe Bağlı)
                </div>
                <div className="row" style={{ marginTop: 6, marginBottom: 0 }}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => fotoRef.current?.click()}
                  >
                    {foto ? "Değiştir" : "Fotoğraf Seç"}
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
                <label className="small muted" htmlFor="modal-kayit-ad">
                  İsim *
                </label>
                <input
                  id="modal-kayit-ad"
                  type="text"
                  required
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Adın"
                  style={{ width: "100%", marginTop: 6 }}
                />
              </div>
              <div>
                <label className="small muted" htmlFor="modal-kayit-soyad">
                  Soyisim *
                </label>
                <input
                  id="modal-kayit-soyad"
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
              <label className="small muted" htmlFor="modal-kayit-eposta">
                E-posta Adresi (Mail) *
              </label>
              <input
                id="modal-kayit-eposta"
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
                <label className="small muted" htmlFor="modal-kayit-parola">
                  Parola (en az 6 karakter) *
                </label>
                <input
                  id="modal-kayit-parola"
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
                <label
                  className="small muted"
                  htmlFor="modal-kayit-parola-tekrar"
                >
                  Parola Tekrar *
                </label>
                <input
                  id="modal-kayit-parola-tekrar"
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

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={yukleniyor}
              style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            >
              {yukleniyor
                ? "Doğrulama Kodu Gönderiliyor..."
                : "E-postama Doğrulama Kodu Gönder →"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleKayitTamamla}
            className="stack"
            style={{ gap: 14 }}
          >
            <div className="otp-bilgi-kutu">
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                ✉️ E-posta Doğrulama Kodu Gönderildi
              </div>
              <p className="small muted" style={{ marginTop: 4 }}>
                <strong>{eposta}</strong> adresine gönderilen 6 haneli doğrulama
                kodunu aşağıya girin.
              </p>
              {gonderilenKodBilgi && (
                <div className="otp-onizleme">
                  <span>Gelen Kutusu Doğrulama Kodunuz:</span>
                  <b>{gonderilenKodBilgi}</b>
                </div>
              )}
            </div>

            <div>
              <label className="small muted" htmlFor="modal-otp-input">
                6 Haneli Doğrulama Kodu *
              </label>
              <input
                id="modal-otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                value={dogrulamaKodu}
                onChange={(e) =>
                  setDogrulamaKodu(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="otp-input"
                style={{ width: "100%", marginTop: 6 }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={yukleniyor || dogrulamaKodu.length !== 6}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            >
              {yukleniyor
                ? "Doğrulanıyor ve Kaydediliyor..."
                : "Kodu Doğrula ve Kaydı Tamamla ✓"}
            </button>

            <div className="between wrap" style={{ paddingTop: 4 }}>
              <button
                type="button"
                className="avatar-link"
                onClick={() => {
                  setKayitAdim("bilgi");
                  setMesaj(null);
                }}
              >
                ← Bilgileri düzenle
              </button>
              <button
                type="button"
                className="avatar-link"
                onClick={() => kodGonder()}
              >
                Kodu tekrar gönder ↻
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
