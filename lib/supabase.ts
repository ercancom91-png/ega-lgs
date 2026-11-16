import type { Veri } from "./store";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const YEREL_HESAPLAR_KEY = "ega.lgs.supabase.accounts.v1";
const YEREL_OTURUM_KEY = "ega.lgs.supabase.session.v1";

export interface KullaniciOturumu {
  id: string;
  eposta: string;
  ad: string;
  soyad: string;
  foto?: string;
  accessToken?: string;
  kaynak: "supabase" | "yerel-bulut";
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
 * Supabase Auth ile yeni öğrenci kaydı oluşturur ve profiles tablosuna yazar.
 */
export async function supabaseKayitOl(bilgi: {
  ad: string;
  soyad: string;
  eposta: string;
  parola: string;
  foto?: string;
  hedefPuan?: number;
  hedefGunlukSoru?: number;
}): Promise<{ ok: boolean; mesaj: string; oturum?: KullaniciOturumu }> {
  const eposta = bilgi.eposta.trim().toLowerCase();
  const ad = bilgi.ad.trim() || "Öğrenci";
  const soyad = bilgi.soyad.trim();
  const hedefPuan = bilgi.hedefPuan || 420;
  const hedefGunlukSoru = bilgi.hedefGunlukSoru || 30;

  if (!eposta || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
    return { ok: false, mesaj: "Lütfen geçerli bir e-posta adresi girin." };
  }
  if (bilgi.parola.trim().length < 6) {
    return { ok: false, mesaj: "Parola en az 6 karakter olmalıdır." };
  }

  // 1. Gerçek Supabase Auth API çağrısı (yapılandırılmışsa)
  if (supabaseYapilandirildiMi()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: eposta,
          password: bilgi.parola,
          data: {
            ad,
            soyad,
            foto: bilgi.foto || null,
            hedefPuan,
            hedefGunlukSoru,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          ok: false,
          mesaj:
            data?.msg ||
            data?.error_description ||
            data?.message ||
            "Supabase kaydı sırasında bir hata oluştu.",
        };
      }
      const userId = data?.user?.id || data?.id || crypto.randomUUID();
      const token = data?.access_token;

      // Profiles tablosuna ilk kaydı gönder
      if (token) {
        await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({
            id: userId,
            ad,
            soyad,
            eposta,
            foto_url: bilgi.foto || null,
            hedef_puan: hedefPuan,
            hedef_gunluk_soru: hedefGunlukSoru,
          }),
        }).catch(() => {});
      }

      const oturum: KullaniciOturumu = {
        id: userId,
        eposta,
        ad,
        soyad,
        foto: bilgi.foto,
        accessToken: token,
        kaynak: "supabase",
        girisTarihi: new Date().toISOString(),
      };
      aktifOturumYaz(oturum);
      return {
        ok: true,
        mesaj: "Supabase hesabın başarıyla oluşturuldu ve oturum açıldı.",
        oturum,
      };
    } catch {
      /* Ağ hatasında yerel bulut katmanına düş */
    }
  }

  // 2. Yerel Supabase Uyumlu Hesap Kaydı (Anında çalışan izole katman)
  const hesaplar = yerelHesaplariOku();
  if (hesaplar[eposta]) {
    return {
      ok: false,
      mesaj: "Bu e-posta adresiyle kayıtlı bir hesap zaten mevcut. Giriş yapabilirsiniz.",
    };
  }
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "usr-" + Date.now();
  const parolaHash = await sha256("ega-supa:" + eposta + ":" + bilgi.parola);
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
    kaynak: "yerel-bulut",
    girisTarihi: new Date().toISOString(),
  };
  aktifOturumYaz(oturum);

  return {
    ok: true,
    mesaj: "Kayıt işlemi tamamlandı! Hoş geldin, " + ad + ".",
    oturum,
  };
}

/**
 * Supabase Auth ile e-posta ve parola doğrulaması yaparak oturum açar.
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

  if (supabaseYapilandirildiMi()) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email: eposta, password: parola }),
        }
      );
      const data = await res.json();
      if (res.ok && data?.user) {
        const meta = data.user.user_metadata || {};
        const oturum: KullaniciOturumu = {
          id: data.user.id,
          eposta,
          ad: meta.ad || "Öğrenci",
          soyad: meta.soyad || "",
          foto: meta.foto,
          accessToken: data.access_token,
          kaynak: "supabase",
          girisTarihi: new Date().toISOString(),
        };
        aktifOturumYaz(oturum);
        const bulutVeri = await supabaseVeriCek(oturum);
        return {
          ok: true,
          mesaj: "Supabase oturumu başarıyla açıldı.",
          oturum,
          kayitliVeri: bulutVeri || undefined,
        };
      }
    } catch {
      /* Yerel doğrulamaya devam et */
    }
  }

  const hesaplar = yerelHesaplariOku();
  const hesap = hesaplar[eposta];
  if (!hesap) {
    return {
      ok: false,
      mesaj: "Bu e-posta adresine ait hesap bulunamadı. Lütfen önce kayıt olun.",
    };
  }
  const girilenHash = await sha256("ega-supa:" + eposta + ":" + parola);
  if (girilenHash !== hesap.parolaHash) {
    return { ok: false, mesaj: "Girdiğiniz parola hatalı." };
  }

  const oturum: KullaniciOturumu = {
    id: hesap.id,
    eposta: hesap.eposta,
    ad: hesap.ad,
    soyad: hesap.soyad,
    foto: hesap.foto,
    kaynak: "yerel-bulut",
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
    const mevcutHash = await sha256("ega-supa:" + eposta + ":" + mevcutParola);
    if (mevcutHash !== hesap.parolaHash) {
      return { ok: false, mesaj: "Mevcut parola hatalı." };
    }
    hesap.parolaHash = await sha256("ega-supa:" + eposta + ":" + yeniParola);
    yerelHesaplariYaz(hesaplar);
  }
  const oturum = aktifOturumAl();
  if (oturum?.accessToken && supabaseYapilandirildiMi()) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${oturum.accessToken}`,
        },
        body: JSON.stringify({ password: yeniParola }),
      });
    } catch {
      /* ignore */
    }
  }
  return { ok: true, mesaj: "Parolanız güvenli şekilde güncellendi." };
}

export async function supabaseCikisYap(): Promise<void> {
  const oturum = aktifOturumAl();
  if (oturum?.accessToken && supabaseYapilandirildiMi()) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${oturum.accessToken}`,
        },
      });
    } catch {
      /* ignore */
    }
  }
  aktifOturumYaz(null);
}

/**
 * Kullanıcının profil ve çalışma verilerini Supabase ile senkronize eder.
 */
export async function supabaseVeriSenkronizeEt(veri: Veri): Promise<void> {
  const oturum = aktifOturumAl();
  const eposta = (veri.profil.eposta || oturum?.eposta || "").trim().toLowerCase();

  // Yerel hesabı da güncel tut
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

  if (!oturum?.accessToken || !supabaseYapilandirildiMi()) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${oturum.accessToken}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: oturum.id,
        ad: veri.profil.ad,
        soyad: veri.profil.soyad,
        eposta: veri.profil.eposta || oturum.eposta,
        foto_url: veri.profil.foto || null,
        hedef_puan: veri.profil.hedefPuan,
        hedef_gunluk_soru: veri.profil.hedefGunlukSoru,
        aktif_gun: veri.aktifGun,
        seri_uzunluk: veri.uzunluk,
        en_uzun_seri: veri.enUzun,
        rozetler: veri.rozetler,
        gunluk_istatistik: veri.gunluk,
        soru_gecmisi: veri.sorular,
        guncellenme_tarihi: new Date().toISOString(),
      }),
    });
  } catch {
    /* ağ çevrimdışı */
  }
}

export async function supabaseVeriCek(
  oturum: KullaniciOturumu
): Promise<Partial<Veri> | null> {
  if (!oturum.accessToken || !supabaseYapilandirildiMi()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(oturum.id)}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${oturum.accessToken}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    const r = rows?.[0];
    if (!r) return null;
    return {
      profil: {
        ad: r.ad || oturum.ad,
        soyad: r.soyad || oturum.soyad,
        eposta: r.eposta || oturum.eposta,
        foto: r.foto_url || oturum.foto,
        hedefPuan: r.hedef_puan || 420,
        hedefGunlukSoru: r.hedef_gunluk_soru || 30,
      },
      aktifGun: r.aktif_gun || null,
      uzunluk: r.seri_uzunluk || 0,
      enUzun: r.en_uzun_seri || 0,
      rozetler: Array.isArray(r.rozetler) ? r.rozetler : [],
      gunluk: r.gunluk_istatistik || {},
      sorular: r.soru_gecmisi || {},
    };
  } catch {
    return null;
  }
}
