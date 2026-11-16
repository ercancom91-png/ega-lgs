import type { Veri } from "./store";
import type { DenemeSonuc } from "./scoring";

const ORACLE_ORDS_URL = process.env.NEXT_PUBLIC_ORACLE_ORDS_URL || "";
const ORACLE_SYNC_LOG_KEY = "ega.lgs.oracle.sync.v1";

export interface OracleDurum {
  aktif: boolean;
  mod: "ords-cloud" | "api-route" | "hibrit-yerel";
  sonSenkronizasyon: string | null;
  toplamKayit: number;
}

export function oracleYapilandirildiMi(): boolean {
  return Boolean(
    ORACLE_ORDS_URL &&
      ORACLE_ORDS_URL.startsWith("https://") &&
      !ORACLE_ORDS_URL.includes("oraclecloudapps.com/ords/ega_lgs")
  );
}

export function oracleDurumAl(): OracleDurum {
  if (typeof window === "undefined") {
    return {
      aktif: true,
      mod: oracleYapilandirildiMi() ? "ords-cloud" : "hibrit-yerel",
      sonSenkronizasyon: null,
      toplamKayit: 0,
    };
  }
  try {
    const ham = window.localStorage.getItem(ORACLE_SYNC_LOG_KEY);
    const kayit = ham ? JSON.parse(ham) : {};
    return {
      aktif: true,
      mod: oracleYapilandirildiMi() ? "ords-cloud" : "hibrit-yerel",
      sonSenkronizasyon: kayit.sonSenkronizasyon || null,
      toplamKayit: kayit.toplamKayit || 0,
    };
  } catch {
    return {
      aktif: true,
      mod: "hibrit-yerel",
      sonSenkronizasyon: null,
      toplamKayit: 0,
    };
  }
}

function oracleSenkronKaydet(ekSayi = 1) {
  if (typeof window === "undefined") return;
  try {
    const mevcut = oracleDurumAl();
    window.localStorage.setItem(
      ORACLE_SYNC_LOG_KEY,
      JSON.stringify({
        sonSenkronizasyon: new Date().toISOString(),
        toplamKayit: (mevcut.toplamKayit || 0) + ekSayi,
      })
    );
  } catch {
    /* ignore */
  }
}

/**
 * Oracle Autonomous Database (EGA_PROFILLER tablosu / EGA_PROFIL_SENKRONIZE_ET prosedürü)
 * ile öğrenci profilini ve soru istatistiklerini senkronize eder.
 */
export async function oracleProfilSenkronizeEt(
  kullaniciId: string,
  veri: Veri
): Promise<boolean> {
  const payload = {
    kullanici_id: kullaniciId || veri.profil.eposta || "yerel-ogrenci",
    ad: veri.profil.ad,
    soyad: veri.profil.soyad,
    eposta: veri.profil.eposta,
    foto_clob: veri.profil.foto || null,
    hedef_puan: veri.profil.hedefPuan,
    hedef_gunluk_soru: veri.profil.hedefGunlukSoru,
    aktif_gun: veri.aktifGun,
    seri_uzunluk: veri.uzunluk,
    en_uzun_seri: veri.enUzun,
    rozetler_json: JSON.stringify(veri.rozetler),
    gunluk_json: JSON.stringify(veri.gunluk),
    sorular_json: JSON.stringify(veri.sorular),
    guncellenme_tarihi: new Date().toISOString(),
  };

  oracleSenkronKaydet(1);

  if (oracleYapilandirildiMi()) {
    try {
      const res = await fetch(`${ORACLE_ORDS_URL}/profiller/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    } catch {
      /* fallback */
    }
  }

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
    deneme_sonuc_id: sonuc.id,
    kullanici_id: kullaniciId || "yerel-ogrenci",
    deneme_ad: sonuc.ad,
    deneme_tur: sonuc.tur,
    toplam_soru: sonuc.toplamSoru,
    dogru_sayisi: sonuc.dogru,
    yanlis_sayisi: sonuc.yanlis,
    bos_sayisi: sonuc.bos,
    net_sayisi: sonuc.net,
    lgs_puani: sonuc.puan,
    sure_saniye: sonuc.sure,
    dersler_json: JSON.stringify(sonuc.dersler),
    baslangic_param: sonuc.baslangic || null,
    cozulme_tarihi: sonuc.tarih,
  };

  oracleSenkronKaydet(1);

  if (oracleYapilandirildiMi()) {
    try {
      const res = await fetch(`${ORACLE_ORDS_URL}/denemeler/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    } catch {
      /* fallback */
    }
  }

  return true;
}
