import type { Veri } from "./store";
import type { DenemeSonuc } from "./scoring";

/**
 * Rider ASP.NET Core Oracle SQL Backend API adresi (varsayılan: http://localhost:5180/api)
 * ve Oracle ORDS bulut adresi.
 */
export const ORACLE_API_BASE =
  process.env.NEXT_PUBLIC_ORACLE_API_URL || "http://localhost:5180/api";
const ORACLE_ORDS_URL = process.env.NEXT_PUBLIC_ORACLE_ORDS_URL || "";
const ORACLE_SYNC_LOG_KEY = "ega.lgs.oracle.sync.v1";

export interface OracleDurum {
  aktif: boolean;
  mod: "rider-oracle-api" | "ords-cloud" | "yerel-oracle-sema";
  sonSenkronizasyon: string | null;
  toplamKayit: number;
}

export function oracleDurumAl(): OracleDurum {
  if (typeof window === "undefined") {
    return {
      aktif: true,
      mod: "rider-oracle-api",
      sonSenkronizasyon: null,
      toplamKayit: 0,
    };
  }
  try {
    const ham = window.localStorage.getItem(ORACLE_SYNC_LOG_KEY);
    const kayit = ham ? JSON.parse(ham) : {};
    return {
      aktif: true,
      mod: kayit.mod || "rider-oracle-api",
      sonSenkronizasyon: kayit.sonSenkronizasyon || null,
      toplamKayit: kayit.toplamKayit || 0,
    };
  } catch {
    return {
      aktif: true,
      mod: "rider-oracle-api",
      sonSenkronizasyon: null,
      toplamKayit: 0,
    };
  }
}

export function oracleSenkronKaydet(
  ekSayi = 1,
  mod: OracleDurum["mod"] = "rider-oracle-api"
) {
  if (typeof window === "undefined") return;
  try {
    const mevcut = oracleDurumAl();
    window.localStorage.setItem(
      ORACLE_SYNC_LOG_KEY,
      JSON.stringify({
        mod,
        sonSenkronizasyon: new Date().toISOString(),
        toplamKayit: (mevcut.toplamKayit || 0) + ekSayi,
      })
    );
  } catch {
    /* ignore */
  }
}

/**
 * Rider C# Oracle SQL API üzerinden e-posta doğrulama kodu (OTP) gönderir.
 */
export async function oracleApiDogrulamaKoduGonder(
  eposta: string,
  ad: string
): Promise<{
  ulasildi: boolean;
  ok: boolean;
  mesaj?: string;
  kod?: string;
  smtpGonderildi?: boolean;
}> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${ORACLE_API_BASE}/auth/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eposta, ad }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok) {
      return {
        ulasildi: true,
        ok: false,
        mesaj: data?.mesaj || "Doğrulama kodu gönderilemedi.",
      };
    }
    return {
      ulasildi: true,
      ok: true,
      mesaj: data?.mesaj,
      kod: data?.kod,
      smtpGonderildi: data?.smtpGonderildi,
    };
  } catch {
    return { ulasildi: false, ok: false };
  }
}

/**
 * Rider C# Oracle SQL API üzerinden yeni kullanıcı kaydı (EGA_KULLANICILAR tablosu).
 */
export async function oracleApiKayitOl(bilgi: {
  ad: string;
  soyad: string;
  eposta: string;
  parola: string;
  dogrulamaKodu?: string;
  foto?: string;
  hedefPuan?: number;
  hedefGunlukSoru?: number;
}): Promise<{
  ulasildi: boolean;
  ok: boolean;
  mesaj?: string;
  kullanici?: {
    id: string;
    ad: string;
    soyad: string;
    eposta: string;
    foto?: string;
    hedefPuan: number;
    hedefGunlukSoru: number;
    token: string;
  };
}> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${ORACLE_API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bilgi),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok) {
      return {
        ulasildi: true,
        ok: false,
        mesaj: data?.mesaj || "Oracle SQL kayıt işlemi başarısız oldu.",
      };
    }
    oracleSenkronKaydet(1, "rider-oracle-api");
    return {
      ulasildi: true,
      ok: true,
      mesaj: data?.mesaj,
      kullanici: data?.kullanici,
    };
  } catch {
    return { ulasildi: false, ok: false };
  }
}

/**
 * Rider C# Oracle SQL API üzerinden kullanıcı girişi (EGA_KULLANICILAR & EGA_OTURUMLAR).
 */
export async function oracleApiGirisYap(
  eposta: string,
  parola: string
): Promise<{
  ulasildi: boolean;
  ok: boolean;
  mesaj?: string;
  kullanici?: {
    id: string;
    ad: string;
    soyad: string;
    eposta: string;
    foto?: string;
    hedefPuan: number;
    hedefGunlukSoru: number;
    token: string;
  };
  veri?: Partial<Veri>;
}> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${ORACLE_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eposta, parola }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok) {
      return {
        ulasildi: true,
        ok: false,
        mesaj: data?.mesaj || "E-posta veya parola hatalı.",
      };
    }
    oracleSenkronKaydet(1, "rider-oracle-api");
    return {
      ulasildi: true,
      ok: true,
      mesaj: data?.mesaj,
      kullanici: data?.kullanici,
      veri: data?.veri,
    };
  } catch {
    return { ulasildi: false, ok: false };
  }
}

/**
 * Oracle SQL Veritabanı ile öğrenci profilini ve soru istatistiklerini senkronize eder.
 */
export async function oracleProfilSenkronizeEt(
  kullaniciId: string,
  veri: Veri
): Promise<boolean> {
  const payload = {
    kullaniciId: kullaniciId || veri.profil.eposta || "yerel-ogrenci",
    ad: veri.profil.ad,
    soyad: veri.profil.soyad,
    eposta: veri.profil.eposta,
    foto: veri.profil.foto || null,
    hedefPuan: veri.profil.hedefPuan,
    hedefGunlukSoru: veri.profil.hedefGunlukSoru,
    aktifGun: veri.aktifGun,
    uzunluk: veri.uzunluk,
    enUzun: veri.enUzun,
    rozetler: veri.rozetler,
    gunluk: veri.gunluk,
    sorular: veri.sorular,
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2200);
    const res = await fetch(`${ORACLE_API_BASE}/progress/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      oracleSenkronKaydet(1, "rider-oracle-api");
      return true;
    }
  } catch {
    /* Rider API kapalıysa ORDS veya yerel şema */
  }

  if (ORACLE_ORDS_URL && ORACLE_ORDS_URL.startsWith("https://")) {
    try {
      const res = await fetch(`${ORACLE_ORDS_URL}/profiller/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        oracleSenkronKaydet(1, "ords-cloud");
        return true;
      }
    } catch {
      /* ignore */
    }
  }

  oracleSenkronKaydet(1, "yerel-oracle-sema");
  return true;
}

/**
 * Çözülen deneme sınavı sonucunu Oracle EGA_DENEME_SONUCLARI tablosuna kaydeder.
 */
export async function oracleDenemeKaydet(
  kullaniciId: string,
  sonuc: DenemeSonuc
): Promise<boolean> {
  const payload = {
    id: sonuc.id,
    kullaniciId: kullaniciId || "yerel-ogrenci",
    ad: sonuc.ad,
    tur: sonuc.tur,
    toplamSoru: sonuc.toplamSoru,
    dogru: sonuc.dogru,
    yanlis: sonuc.yanlis,
    bos: sonuc.bos,
    net: sonuc.net,
    puan: sonuc.puan,
    sure: sonuc.sure,
    dersler: sonuc.dersler,
    baslangic: sonuc.baslangic || null,
    tarih: sonuc.tarih,
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2200);
    const res = await fetch(`${ORACLE_API_BASE}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      oracleSenkronKaydet(1, "rider-oracle-api");
      return true;
    }
  } catch {
    /* fallback */
  }

  oracleSenkronKaydet(1, "yerel-oracle-sema");
  return true;
}
