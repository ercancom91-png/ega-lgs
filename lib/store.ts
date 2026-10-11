import { useEffect, useState } from "react";
import type { DenemeSonuc } from "./scoring";

const ANAHTAR = "ega.lgs.v1";
const OLAY = "ega-lgs-veri";

export interface Gunluk {
  cozulen: number;
  dogru: number;
  yanlis: number;
}

export interface Profil {
  ad: string;
  hedefPuan: number;
  hedefGunlukSoru: number;
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
  profil: { ad: "Öğrenci", hedefPuan: 420, hedefGunlukSoru: 30 },
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
    sonuc = ham ? { ...BOS, ...JSON.parse(ham) } : { ...BOS };
  } catch {
    sonuc = { ...BOS };
  }
  onbellek = sonuc;
  return sonuc;
}

function veriYaz(v: Veri) {
  onbellek = v;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ANAHTAR, JSON.stringify(v));
    } catch {
      /* kota dolu olabilir */
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
    // ders bazlı ilerleme de günlük akışa işlensin
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
  veriYaz(seriGuncelle(v));
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
