import type { Ders, Harf, Soru, Zorluk } from "../types";
import { HAVUZ, HavuzSoru } from "../soruHavuzu";
import TURKCE from "./turkce";
import MATEMATIK from "./matematik";
import FEN from "./fen";
import INKILAP from "./inkilap";
import INGILIZCE from "./ingilizce";
import DIN from "./din";

const ORIJINAL: Soru[] = [
  ...TURKCE,
  ...MATEMATIK,
  ...FEN,
  ...INKILAP,
  ...INGILIZCE,
  ...DIN,
];

/** PDF/OCR'dan çıkarılan havuzu sitedeki Soru tipine dönüştürür. */
function donustur(h: HavuzSoru): Soru {
  const gorsel = Object.values(h.secenekler).some((v) => v.startsWith("[görsel]"));
  return {
    id: h.id,
    ders: h.ders as Ders,
    konu: h.konu,
    zorluk: (h.zorluk || 1) as Zorluk,
    metin: h.metin,
    gorselUrl: h.gorselUrl,
    secenekGorselUrl: h.secenekGorselUrl,
    secenekler: ["A", "B", "C", "D"].map((x) => ({
      id: x as Harf,
      text: h.secenekler[x] || "",
    })),
    dogru: h.dogru as Harf,
    cozum: h.cozum || "",
    kaynak: h.kaynak,
    yil: h.yil,
    gorsel,
  };
}

/** Ana soru havuzu: MEB/Çıkmış PDF'lerinden çıkarılanlar + orijinal banka. */
export const BANK: Soru[] = [...HAVUZ.map(donustur), ...ORIJINAL];

const byId = new Map(BANK.map((s) => [s.id, s]));

export function soruGetir(id: string): Soru | undefined {
  return byId.get(id);
}

export function bankaSayilari(): Record<Ders, number> {
  const c: Record<string, number> = {};
  BANK.forEach((s) => (c[s.ders] = (c[s.ders] || 0) + 1));
  return c as Record<Ders, number>;
}

/** Kaynak bazlı sayılar (cikmis / meb / uretilmis) */
export function kaynakSayilari(): Record<string, number> {
  const c: Record<string, number> = {};
  BANK.forEach((s) => (c[s.kaynak] = (c[s.kaynak] || 0) + 1));
  return c;
}

export function filtrele(f: {
  ders?: Ders | "hepsi";
  konu?: string | "hepsi";
  zorluk?: Zorluk | "hepsi";
  kaynak?: string | "hepsi";
  yil?: number | "hepsi";
}): Soru[] {
  return BANK.filter((s) => {
    if (f.ders && f.ders !== "hepsi" && s.ders !== f.ders) return false;
    if (f.konu && f.konu !== "hepsi" && s.konu !== f.konu) return false;
    if (f.zorluk && f.zorluk !== "hepsi" && s.zorluk !== f.zorluk) return false;
    if (f.kaynak && f.kaynak !== "hepsi" && s.kaynak !== f.kaynak) return false;
    if (f.yil && f.yil !== "hepsi" && s.yil !== f.yil) return false;
    return true;
  });
}

/** Deterministik rastgele seçim (aynı seed → aynı sonuç) */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function karistir<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function konular(ders?: Ders): string[] {
  const set = new Set(BANK.filter((s) => !ders || s.ders === ders).map((s) => s.konu));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
}
