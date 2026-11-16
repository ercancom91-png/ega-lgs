import { useEffect, useState } from "react";
import type { DenemeSonuc } from "./scoring";
import {
  aktifOturumAl,
  KullaniciOturumu,
  supabaseCikisYap,
  supabaseGirisYap,
  supabaseKayitOl,
  supabaseVeriSenkronizeEt,
} from "./supabase";
import { oracleDenemeKaydet, oracleProfilSenkronizeEt } from "./oracle";

const ANAHTAR = "ega.lgs.v1";

export interface Gunluk {
  cozulen: number;
  dogru: number;
  yanlis: number;
}

export interface Profil {
  ad: string;
  soyad: string;
  eposta: string;
  /** Profil fotoğrafı (JPEG/WebP veri URI'si) */
  foto?: string;
  hedefPuan: number;
  hedefGunlukSoru: number;
  /** Yerel uygulama kilidi — SHA-256 (tuz + şifre) */
  sifreHash?: string;
  sifreTuz?: string;
  /** true ise açılışta şifre sorulur */
  kilit?: boolean;
}

export interface Veri {
  profil: Profil;
  aktifGun: string | null;
  uzunluk: number;
  enUzun: number;
  gunluk: Record<string, Gunluk>;
  sorular: Record<
    string,
    { dogru: number; yanlis: number; bos: number; enSon: number }
  >;
  denemeler: DenemeSonuc[];
  rozetler: string[];
}

const BOS: Veri = {
  profil: {
    ad: "Öğrenci",
    soyad: "",
    eposta: "",
    hedefPuan: 420,
    hedefGunlukSoru: 30,
  },
  aktifGun: null,
  uzunluk: 0,
  enUzun: 0,
  gunluk: {},
  sorular: {},
  denemeler: [],
  rozetler: [],
};

const dinleyiciler = new Set<() => void>();
let onbellek: Veri | null = null;

export function bugun(): string {
  return new Date().toISOString().slice(0, 10);
}

function yayinla() {
  dinleyiciler.forEach((f) => f());
}

export function veriYukle(): Veri {
  if (onbellek) return onbellek;
  if (typeof window === "undefined") return BOS;
  let sonuc: Veri;
  try {
    const ham = window.localStorage.getItem(ANAHTAR);
    const hamVeri = ham ? JSON.parse(ham) : {};
    sonuc = {
      ...BOS,
      ...hamVeri,
      profil: { ...BOS.profil, ...(hamVeri.profil || {}) },
    };
  } catch {
    sonuc = { ...BOS };
  }
  onbellek = sonuc;
  return sonuc;
}

function bulutSenkronize(v: Veri) {
  if (typeof window === "undefined") return;
  const oturum = aktifOturumAl();
  const uid = oturum?.id || v.profil.eposta || "yerel-ogrenci";
  void supabaseVeriSenkronizeEt(v);
  void oracleProfilSenkronizeEt(uid, v);
}

function veriYaz(v: Veri, bulut = true) {
  onbellek = v;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ANAHTAR, JSON.stringify(v));
    } catch {
      /* kota dolu olabilir */
    }
    if (bulut) {
      bulutSenkronize(v);
    }
  }
  yayinla();
}

function seriGuncelle(v: Veri): Veri {
  const g = bugun();
  if (v.aktifGun === g) return v;
  const d = new Date();
  const onceki = new Date(d.getTime() - 86400000).toISOString().slice(0, 10);
  const uzunluk = v.aktifGun === onceki ? v.uzunluk + 1 : 1;
  return {
    ...v,
    aktifGun: g,
    uzunluk,
    enUzun: Math.max(v.enUzun, uzunluk),
  };
}

/** Bir soru çözüldüğünde çağrılır (boş bırakıldıysa bos = true). */
export function soruKaydet(soruId: string, sonuc: "dogru" | "yanlis" | "bos") {
  const v = { ...veriYukle() };
  v.gunluk = { ...v.gunluk };
  const g = bugun();
  const gun = v.gunluk[g] || { cozulen: 0, dogru: 0, yanlis: 0 };
  v.gunluk[g] = {
    cozulen: gun.cozulen + 1,
    dogru: gun.dogru + (sonuc === "dogru" ? 1 : 0),
    yanlis: gun.yanlis + (sonuc === "yanlis" ? 1 : 0),
  };
  v.sorular = { ...v.sorular };
  const s = v.sorular[soruId] || { dogru: 0, yanlis: 0, bos: 0, enSon: 0 };
  v.sorular[soruId] = {
    dogru: s.dogru + (sonuc === "dogru" ? 1 : 0),
    yanlis: s.yanlis + (sonuc === "yanlis" ? 1 : 0),
    bos: s.bos + (sonuc === "bos" ? 1 : 0),
    enSon: Date.now(),
  };
  veriYaz(seriGuncelle(v));
}

export function denemeKaydet(sonuc: DenemeSonuc) {
  const v = { ...veriYukle() };
  v.denemeler = [sonuc, ...v.denemeler].slice(0, 60);
  sonuc.dersler.forEach((d) => {
    const g = bugun();
    const gun = v.gunluk[g] || { cozulen: 0, dogru: 0, yanlis: 0 };
    v.gunluk = {
      ...v.gunluk,
      [g]: {
        cozulen: gun.cozulen + d.soru,
        dogru: gun.dogru + d.dogru,
        yanlis: gun.yanlis + d.yanlis,
      },
    };
  });
  const yeni = seriGuncelle(v);
  veriYaz(yeni);
  const oturum = aktifOturumAl();
  void oracleDenemeKaydet(oturum?.id || yeni.profil.eposta || "yerel-ogrenci", sonuc);
}

export function rozetEkle(id: string) {
  const v = { ...veriYukle() };
  if (v.rozetler.includes(id)) return;
  v.rozetler = [...v.rozetler, id];
  veriYaz(v);
}

export function profilGuncelle(p: Partial<Profil>) {
  const v = { ...veriYukle() };
  v.profil = { ...v.profil, ...p };
  veriYaz(v);
}

export function veriSifirla() {
  veriYaz({ ...BOS, gunluk: {}, sorular: {}, denemeler: [], rozetler: [] });
}

/* ---------- Supabase & Oracle Hesap İşlemleri ---------- */

export async function kullaniciKayitOl(bilgi: {
  ad: string;
  soyad: string;
  eposta: string;
  parola: string;
  foto?: string;
  hedefPuan?: number;
  hedefGunlukSoru?: number;
}): Promise<{ ok: boolean; mesaj: string; oturum?: KullaniciOturumu }> {
  const yanit = await supabaseKayitOl(bilgi);
  if (!yanit.ok) return yanit;

  // Parolayı aynı zamanda profil kilidi olarak da özetle
  const tuz = rastgeleTuz();
  const hash = await ozet(tuz + bilgi.parola.trim());
  const v = { ...veriYukle() };
  v.profil = {
    ...v.profil,
    ad: bilgi.ad.trim() || "Öğrenci",
    soyad: bilgi.soyad.trim(),
    eposta: bilgi.eposta.trim().toLowerCase(),
    foto: bilgi.foto ?? v.profil.foto,
    hedefPuan: bilgi.hedefPuan || v.profil.hedefPuan || 420,
    hedefGunlukSoru: bilgi.hedefGunlukSoru || v.profil.hedefGunlukSoru || 30,
    sifreTuz: tuz,
    sifreHash: hash,
  };
  veriYaz(v, true);
  return yanit;
}

export async function kullaniciGirisYap(
  eposta: string,
  parola: string
): Promise<{ ok: boolean; mesaj: string; oturum?: KullaniciOturumu }> {
  const yanit = await supabaseGirisYap(eposta, parola);
  if (!yanit.ok) return yanit;

  const v = { ...veriYukle() };
  const kv = yanit.kayitliVeri;
  const birlesik: Veri = {
    ...v,
    ...(kv || {}),
    profil: {
      ...v.profil,
      ...(kv?.profil || {}),
      ad: kv?.profil?.ad || yanit.oturum?.ad || v.profil.ad,
      soyad: kv?.profil?.soyad ?? yanit.oturum?.soyad ?? v.profil.soyad,
      eposta: kv?.profil?.eposta || yanit.oturum?.eposta || eposta.trim().toLowerCase(),
      foto: kv?.profil?.foto ?? yanit.oturum?.foto ?? v.profil.foto,
    },
  };
  try {
    sessionStorage.setItem(KILIT_OTURUM, "acik");
  } catch {
    /* ignore */
  }
  veriYaz(birlesik, true);
  return yanit;
}

export async function kullaniciCikisYap(): Promise<void> {
  await supabaseCikisYap();
  yayinla();
}

/**
 * Yüklenen fotoğraf dosyasını 256x256 boyutunda sıkıştırılmış JPEG veri URI'sine çevirir.
 */
export function fotoDosyasiniIsle(dosya: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Görsel yüklenemedi."));
      img.onload = () => {
        const BOYUT = 256;
        const canvas = document.createElement("canvas");
        canvas.width = BOYUT;
        canvas.height = BOYUT;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        // Merkezden kare kırpma (cover)
        const minKenar = Math.min(img.width, img.height);
        const sx = (img.width - minKenar) / 2;
        const sy = (img.height - minKenar) / 2;
        ctx.drawImage(img, sx, sy, minKenar, minKenar, 0, 0, BOYUT, BOYUT);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(dosya);
  });
}

/* ---------- yerel uygulama kilidi (profil kodu) ---------- */

const KILIT_OTURUM = "ega.lgs.kilit";

function rastgeleTuz(): string {
  const dizi = new Uint8Array(16);
  crypto.getRandomValues(dizi);
  return Array.from(dizi, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function ozet(metin: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const bayt = new TextEncoder().encode(metin);
    const dilim = await crypto.subtle.digest("SHA-256", bayt);
    return Array.from(new Uint8Array(dilim), (b) =>
      b.toString(16).padStart(2, "0")
    ).join("");
  }
  let h = 5381;
  for (let i = 0; i < metin.length; i++)
    h = Math.imul(h ^ metin.charCodeAt(i), 33);
  return "d" + (h >>> 0).toString(36);
}

export async function sifreBelirle(kod: string): Promise<void> {
  const tuz = rastgeleTuz();
  const v = { ...veriYukle() };
  v.profil = {
    ...v.profil,
    sifreTuz: tuz,
    sifreHash: await ozet(tuz + kod.trim()),
    kilit: true,
  };
  try {
    sessionStorage.setItem(KILIT_OTURUM, "acik");
  } catch {
    /* ignore */
  }
  veriYaz(v);
}

export async function sifreDegistir(
  mevcut: string,
  yeni: string
): Promise<boolean> {
  const p = veriYukle().profil;
  if (!p.sifreHash || !p.sifreTuz) return false;
  if ((await ozet(p.sifreTuz + mevcut.trim())) !== p.sifreHash) return false;
  const tuz = rastgeleTuz();
  const v = { ...veriYukle() };
  v.profil = {
    ...v.profil,
    sifreTuz: tuz,
    sifreHash: await ozet(tuz + yeni.trim()),
  };
  veriYaz(v);
  return true;
}

export async function sifreKaldir(mevcut: string): Promise<boolean> {
  const p = veriYukle().profil;
  if (!p.sifreHash || !p.sifreTuz) return false;
  if ((await ozet(p.sifreTuz + mevcut.trim())) !== p.sifreHash) return false;
  const v = { ...veriYukle() };
  v.profil = {
    ...v.profil,
    sifreHash: undefined,
    sifreTuz: undefined,
    kilit: false,
  };
  veriYaz(v);
  sessionStorage.removeItem(KILIT_OTURUM);
  return true;
}

export function oturumuKilitle() {
  try {
    sessionStorage.removeItem(KILIT_OTURUM);
  } catch {
    /* erişim engelli ortam */
  }
}

export function kilitliMi(): boolean {
  if (typeof window === "undefined") return false;
  const p = veriYukle().profil;
  if (!p.kilit || !p.sifreHash || !p.sifreTuz) return false;
  return sessionStorage.getItem(KILIT_OTURUM) !== "acik";
}

export async function kilidiAc(kod: string): Promise<boolean> {
  const p = veriYukle().profil;
  if (!p.sifreHash || !p.sifreTuz) return true;
  if ((await ozet(p.sifreTuz + kod.trim())) !== p.sifreHash) return false;
  try {
    sessionStorage.setItem(KILIT_OTURUM, "acik");
  } catch {
    /* erişim engelli ortam */
  }
  return true;
}

export function hesapSil() {
  try {
    window.localStorage.removeItem(ANAHTAR);
  } catch {
    /* erişim engelli ortam */
  }
  void supabaseCikisYap();
  oturumuKilitle();
  onbellek = { ...BOS, profil: { ...BOS.profil } };
  yayinla();
}

function abone(f: () => void): () => void {
  dinleyiciler.add(f);
  return () => {
    dinleyiciler.delete(f);
  };
}

export function useVeri(): Veri {
  const [v, setV] = useState<Veri>(() => veriYukle());
  useEffect(() => {
    setV(veriYukle());
    return abone(() => setV(veriYukle()));
  }, []);
  return v;
}

export interface Ozet {
  toplamSoru: number;
  dogru: number;
  yanlis: number;
  net: number;
  dogruYuzde: number;
  bugunCozulen: number;
  denemeSayisi: number;
  enIyiPuan: number;
  sonDeneme?: DenemeSonuc;
}

export function ozetHesapla(v: Veri): Ozet {
  let toplamSoru = 0,
    dogru = 0,
    yanlis = 0;
  Object.values(v.sorular).forEach((s) => {
    toplamSoru += s.dogru + s.yanlis + s.bos;
    dogru += s.dogru;
    yanlis += s.yanlis;
  });
  const gununVerisi = v.gunluk[bugun()] || { cozulen: 0, dogru: 0, yanlis: 0 };
  const enIyiPuan = v.denemeler.reduce((m, d) => Math.max(m, d.puan), 0);
  return {
    toplamSoru,
    dogru,
    yanlis,
    net: Math.round((dogru - yanlis / 3) * 100) / 100,
    dogruYuzde: toplamSoru ? Math.round((dogru / toplamSoru) * 100) : 0,
    bugunCozulen: gununVerisi.cozulen,
    denemeSayisi: v.denemeler.length,
    enIyiPuan,
    sonDeneme: v.denemeler[0],
  };
}
