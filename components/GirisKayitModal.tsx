"use client";

import { useRef, useState } from "react";
import {
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

const HIZLI_PUANLAR = [380, 400, 420, 450, 480, 500];

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

  // Kayıt alanları
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [eposta, setEposta] = useState("");
  const [parola, setParola] = useState("");
  const [parolaTekrar, setParolaTekrar] = useState("");
  const [hedefPuan, setHedefPuan] = useState(450);
  const [gunlukHedef] = useState(40);
  const [foto, setFoto] = useState<string | undefined>(undefined);

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
      setMesaj({
        tur: "hata",
        yazi: "Girdiğiniz parolalar birbiriyle eşleşmiyor.",
      });
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
      <div className="modal orta kaydir" style={{ maxWidth: 560 }}>
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
                  setMesaj(null);
                }}
              >
                Hemen kayıt ol →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleKayit} className="stack" style={{ gap: 13 }}>
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

            <div className="hedef-secici" style={{ paddingTop: 10 }}>
              <div className="between" style={{ marginBottom: 6 }}>
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
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={yukleniyor}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            >
              {yukleniyor
                ? "Oracle Veritabanına Kaydediliyor..."
                : "Kayıt Ol ve İçeriği Aç →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
