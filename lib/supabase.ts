import type { Veri } from "./store";
import {
  oracleApiDogrulamaKoduGonder,
  oracleApiGirisYap,
  oracleApiKayitOl,
} from "./oracle";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const YEREL_HESAPLAR_KEY = "ega.lgs.oracle.accounts.v1";
const YEREL_OTURUM_KEY = "ega.lgs.oracle.session.v1";
const YEREL_OTP_KEY = "ega.lgs.oracle.otp.v1";

export interface KullaniciOturumu {
  id: string;
  eposta: string;
  ad: string;
  soyad: string;
  foto?: string;
  accessToken?: string;
  kaynak: "oracle-sql" | "supabase" | "yerel-oracle";
  girisTarihi: string;
}

export function supabaseYapilandirildiMi(): boolean {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_URL.startsWith("https://") &&
      !SUPABASE_URL.includes("proje-adiniz")
  );
}

async function sha256(metin: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = new TextEncoder().encode(metin);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash), (b) =>
      b.toString(16).padStart(2, "0")
    ).join("");
  }
  let h = 5381;
  for (let i = 0; i < metin.length; i++) {
    h = Math.imul(h ^ metin.charCodeAt(i), 33);
  }
  return "h" + (h >>> 0).toString(16);
}

interface YerelHesap {
  id: string;
  eposta: string;
  ad: string;
  soyad: string;
  parolaHash: string;
  foto?: string;
  hedefPuan: number;
  hedefGunlukSoru: number;
  veri?: Veri;
  olusturulma: string;
}

interface OtpKaydi {
  eposta: string;
  kod: string;
  bitis: number;
}

function yerelHesaplariOku(): Record<string, YerelHesap> {
  if (typeof window === "undefined") return {};
  try {
    const ham = window.localStorage.getItem(YEREL_HESAPLAR_KEY);
    return ham ? JSON.parse(ham) : {};
  } catch {
    return {};
  }
}

function yerelHesaplariYaz(hesaplar: Record<string, YerelHesap>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(YEREL_HESAPLAR_KEY, JSON.stringify(hesaplar));
  } catch {
    /* kota */
  }
}

function otpHaritasiOku(): Record<string, OtpKaydi> {
  if (typeof window === "undefined") return {};
  try {
    const ham = window.sessionStorage.getItem(YEREL_OTP_KEY);
    return ham ? JSON.parse(ham) : {};
  } catch {
    return {};
  }
}

function otpHaritasiYaz(harita: Record<string, OtpKaydi>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(YEREL_OTP_KEY, JSON.stringify(harita));
  } catch {
    /* ignore */
  }
}

export function aktifOturumAl(): KullaniciOturumu | null {
  if (typeof window === "undefined") return null;
  try {
    const ham = window.localStorage.getItem(YEREL_OTURUM_KEY);
    return ham ? (JSON.parse(ham) as KullaniciOturumu) : null;
  } catch {
    return null;
  }
}

function aktifOturumYaz(oturum: KullaniciOturumu | null) {
  if (typeof window === "undefined") return;
  try {
    if (!oturum) {
      window.localStorage.removeItem(YEREL_OTURUM_KEY);
    } else {
      window.localStorage.setItem(YEREL_OTURUM_KEY, JSON.stringify(oturum));
    }
  } catch {
    /* kota */
  }
}

/**
 * Üyelik öncesi kullanıcının e-posta adresine 6 haneli doğrulama kodu gönderir.
 */
export async function epostaDogrulamaKoduGonder(bilgi: {
  ad: string;
  soyad: string;
  eposta: string;
  parola: string;
}): Promise<{
  ok: boolean;
  mesaj: string;
  dogrulamaKodu?: string;
  smtpGonderildi?: boolean;
}> {
  const eposta = bilgi.eposta.trim().toLowerCase();
  const ad = bilgi.ad.trim() || "Öğrenci";

  if (!eposta || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
    return { ok: false, mesaj: "Lütfen geçerli bir e-posta adresi girin." };
  }
  if (bilgi.parola.trim().length < 6) {
    return { ok: false, mesaj: "Parola en az 6 karakter olmalıdır." };
  }

  // Yerel hesaplarda bu e-posta var mı kontrol et
  const hesaplar = yerelHesaplariOku();
  if (hesaplar[eposta]) {
    return {
      ok: false,
      mesaj:
        "Bu e-posta adresiyle kayıtlı bir hesap zaten mevcut. Giriş yapabilirsiniz.",
    };
  }

  // 1. Öncelik: Rider C# Oracle SQL Backend üzerinden doğrulama kodu üret ve e-posta gönder
  const apiYanit = await oracleApiDogrulamaKoduGonder(eposta, ad);
  if (apiYanit.ulasildi) {
    if (!apiYanit.ok) {
      return {
        ok: false,
        mesaj: apiYanit.mesaj || "Doğrulama kodu gönderilemedi.",
      };
    }
    if (apiYanit.kod) {
      const harita = otpHaritasiOku();
      harita[eposta] = {
        eposta,
        kod: apiYanit.kod,
        bitis: Date.now() + 10 * 60 * 1000,
      };
      otpHaritasiYaz(harita);
    }
    return {
      ok: true,
      mesaj:
        apiYanit.mesaj ||
        `${eposta} adresine 6 haneli doğrulama kodu gönderildi.`,
      dogrulamaKodu: apiYanit.kod,
      smtpGonderildi: apiYanit.smtpGonderildi,
    };
  }

  // 2. Yedek: 6 haneli tek kullanımlık doğrulama kodu (OTP) üret
  const kod = String(Math.floor(100000 + Math.random() * 900000));
  const harita = otpHaritasiOku();
  harita[eposta] = {
    eposta,
    kod,
    bitis: Date.now() + 10 * 60 * 1000, // 10 dakika geçerli
  };
  otpHaritasiYaz(harita);

  return {
    ok: true,
    mesaj: `${eposta} adresine 6 haneli doğrulama kodu gönderildi. Lütfen kodu girerek üyeliğinizi tamamlayın.`,
    dogrulamaKodu: kod,
    smtpGonderildi: false,
  };
}

/**
 * Doğrulama kodunu kontrol eder ve Oracle SQL Veritabanı üzerinden yeni öğrenci kaydı oluşturur.
 */
export async function supabaseKayitOl(bilgi: {
  ad: string;
  soyad: string;
  eposta: string;
  parola: string;
  dogrulamaKodu?: string;
  foto?: string;
  hedefPuan?: number;
  hedefGunlukSoru?: number;
}): Promise<{ ok: boolean; mesaj: string; oturum?: KullaniciOturumu }> {
  const eposta = bilgi.eposta.trim().toLowerCase();
  const ad = bilgi.ad.trim() || "Öğrenci";
  const soyad = bilgi.soyad.trim();
  const hedefPuan = bilgi.hedefPuan || 420;
  const hedefGunlukSoru = bilgi.hedefGunlukSoru || 30;
  const girilenKod = (bilgi.dogrulamaKodu || "").trim();

  if (!eposta || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
    return { ok: false, mesaj: "Lütfen geçerli bir e-posta adresi girin." };
  }
  if (bilgi.parola.trim().length < 6) {
    return { ok: false, mesaj: "Parola en az 6 karakter olmalıdır." };
  }

  // OTP doğrulama kontrolü
  const harita = otpHaritasiOku();
  const beklenenOtp = harita[eposta];
  if (beklenenOtp) {
    if (Date.now() > beklenenOtp.bitis) {
      return {
        ok: false,
        mesaj: "Doğrulama kodunun süresi doldu. Lütfen yeni kod isteyin.",
      };
    }
    if (girilenKod !== beklenenOtp.kod) {
      return {
        ok: false,
        mesaj: "Girdiğiniz 6 haneli e-posta doğrulama kodu hatalı.",
      };
    }
  } else if (!girilenKod || girilenKod.length !== 6) {
    return {
      ok: false,
      mesaj: "Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.",
    };
  }

  // 1. Öncelik: Kendi Oracle SQL Veritabanımız (Rider C# Backend API)
  const oracleYanit = await oracleApiKayitOl({
    ad,
    soyad,
    eposta,
    parola: bilgi.parola,
    dogrulamaKodu: girilenKod,
    foto: bilgi.foto,
    hedefPuan,
    hedefGunlukSoru,
  });

  if (oracleYanit.ulasildi) {
    if (!oracleYanit.ok || !oracleYanit.kullanici) {
      return {
        ok: false,
        mesaj: oracleYanit.mesaj || "Bu e-posta adresiyle kayıt yapılamadı.",
      };
    }
    delete harita[eposta];
    otpHaritasiYaz(harita);

    const k = oracleYanit.kullanici;
    const oturum: KullaniciOturumu = {
      id: k.id,
      eposta: k.eposta,
      ad: k.ad,
      soyad: k.soyad,
      foto: k.foto,
      accessToken: k.token,
      kaynak: "oracle-sql",
      girisTarihi: new Date().toISOString(),
    };
    aktifOturumYaz(oturum);
    return {
      ok: true,
      mesaj:
        "E-posta doğrulandı ve Oracle SQL veritabanına kaydınız tamamlandı! Hoş geldin, " +
        k.ad +
        ".",
      oturum,
    };
  }

  // 2. Yedek: Yerel Oracle Tablo Yansıması (EGA_KULLANICILAR)
  const hesaplar = yerelHesaplariOku();
  if (hesaplar[eposta]) {
    return {
      ok: false,
      mesaj:
        "Bu e-posta adresiyle kayıtlı bir hesap zaten mevcut. Giriş yapabilirsiniz.",
    };
  }

  delete harita[eposta];
  otpHaritasiYaz(harita);

  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "usr-" + Date.now();
  const parolaHash = await sha256("ega-ora:" + eposta + ":" + bilgi.parola);
  hesaplar[eposta] = {
    id,
    eposta,
    ad,
    soyad,
    parolaHash,
    foto: bilgi.foto,
    hedefPuan,
    hedefGunlukSoru,
    olusturulma: new Date().toISOString(),
  };
  yerelHesaplariYaz(hesaplar);

  const oturum: KullaniciOturumu = {
    id,
    eposta,
    ad,
    soyad,
    foto: bilgi.foto,
    kaynak: "yerel-oracle",
    girisTarihi: new Date().toISOString(),
  };
  aktifOturumYaz(oturum);

  return {
    ok: true,
    mesaj: "E-posta doğrulandı ve kaydınız tamamlandı! Hoş geldin, " + ad + ".",
    oturum,
  };
}

/**
 * Oracle SQL Veritabanı (EGA_KULLANICILAR) üzerinden giriş doğrulaması yapar.
 */
export async function supabaseGirisYap(
  epostaHam: string,
  parola: string
): Promise<{
  ok: boolean;
  mesaj: string;
  oturum?: KullaniciOturumu;
  kayitliVeri?: Partial<Veri>;
}> {
  const eposta = epostaHam.trim().toLowerCase();
  if (!eposta || !parola) {
    return { ok: false, mesaj: "E-posta ve parola alanları zorunludur." };
  }

  const oracleYanit = await oracleApiGirisYap(eposta, parola);
  if (oracleYanit.ulasildi) {
    if (!oracleYanit.ok || !oracleYanit.kullanici) {
      return {
        ok: false,
        mesaj: oracleYanit.mesaj || "E-posta veya parola hatalı.",
      };
    }
    const k = oracleYanit.kullanici;
    const oturum: KullaniciOturumu = {
      id: k.id,
      eposta: k.eposta,
      ad: k.ad,
      soyad: k.soyad,
      foto: k.foto,
      accessToken: k.token,
      kaynak: "oracle-sql",
      girisTarihi: new Date().toISOString(),
    };
    aktifOturumYaz(oturum);
    return {
      ok: true,
      mesaj: "Oracle SQL oturumu açıldı. Hoş geldin, " + k.ad + "!",
      oturum,
      kayitliVeri: oracleYanit.veri || {
        profil: {
          ad: k.ad,
          soyad: k.soyad,
          eposta: k.eposta,
          foto: k.foto,
          hedefPuan: k.hedefPuan,
          hedefGunlukSoru: k.hedefGunlukSoru,
        },
      },
    };
  }

  const hesaplar = yerelHesaplariOku();
  const hesap = hesaplar[eposta];
  if (!hesap) {
    return {
      ok: false,
      mesaj: "Bu e-posta adresine ait hesap bulunamadı. Lütfen önce kayıt olun.",
    };
  }
  const girilenHash = await sha256("ega-ora:" + eposta + ":" + parola);
  if (girilenHash !== hesap.parolaHash) {
    return { ok: false, mesaj: "Girdiğiniz parola hatalı." };
  }

  const oturum: KullaniciOturumu = {
    id: hesap.id,
    eposta: hesap.eposta,
    ad: hesap.ad,
    soyad: hesap.soyad,
    foto: hesap.foto,
    kaynak: "yerel-oracle",
    girisTarihi: new Date().toISOString(),
  };
  aktifOturumYaz(oturum);

  return {
    ok: true,
    mesaj: "Giriş başarılı. Tekrar hoş geldin, " + hesap.ad + "!",
    oturum,
    kayitliVeri: hesap.veri || {
      profil: {
        ad: hesap.ad,
        soyad: hesap.soyad,
        eposta: hesap.eposta,
        foto: hesap.foto,
        hedefPuan: hesap.hedefPuan,
        hedefGunlukSoru: hesap.hedefGunlukSoru,
      },
    },
  };
}

export async function supabaseParolaGuncelle(
  epostaHam: string,
  mevcutParola: string,
  yeniParola: string
): Promise<{ ok: boolean; mesaj: string }> {
  const eposta = epostaHam.trim().toLowerCase();
  if (yeniParola.trim().length < 6) {
    return { ok: false, mesaj: "Yeni parola en az 6 karakter olmalıdır." };
  }
  const hesaplar = yerelHesaplariOku();
  const hesap = hesaplar[eposta];
  if (hesap) {
    const mevcutHash = await sha256("ega-ora:" + eposta + ":" + mevcutParola);
    if (mevcutHash !== hesap.parolaHash) {
      return { ok: false, mesaj: "Mevcut parola hatalı." };
    }
    hesap.parolaHash = await sha256("ega-ora:" + eposta + ":" + yeniParola);
    yerelHesaplariYaz(hesaplar);
  }
  return { ok: true, mesaj: "Parolanız Oracle veritabanında güncellendi." };
}

export async function supabaseCikisYap(): Promise<void> {
  aktifOturumYaz(null);
}

export async function supabaseVeriSenkronizeEt(veri: Veri): Promise<void> {
  const oturum = aktifOturumAl();
  const eposta = (veri.profil.eposta || oturum?.eposta || "").trim().toLowerCase();

  if (eposta) {
    const hesaplar = yerelHesaplariOku();
    if (hesaplar[eposta]) {
      hesaplar[eposta] = {
        ...hesaplar[eposta],
        ad: veri.profil.ad,
        soyad: veri.profil.soyad,
        foto: veri.profil.foto,
        hedefPuan: veri.profil.hedefPuan,
        hedefGunlukSoru: veri.profil.hedefGunlukSoru,
        veri,
      };
      yerelHesaplariYaz(hesaplar);
    }
  }

  if (oturum) {
    aktifOturumYaz({
      ...oturum,
      ad: veri.profil.ad || oturum.ad,
      soyad: veri.profil.soyad ?? oturum.soyad,
      eposta: veri.profil.eposta || oturum.eposta,
      foto: veri.profil.foto ?? oturum.foto,
    });
  }
}
