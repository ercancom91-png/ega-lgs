export type Ders =
  | "Turkce"
  | "Matematik"
  | "Fen"
  | "Inkilap"
  | "Ingilizce"
  | "Din";

export type Zorluk = 1 | 2 | 3;

export type Harf = "A" | "B" | "C" | "D";

export interface Secenek {
  id: Harf;
  text: string;
}

export interface Soru {
  id: string;
  ders: Ders;
  konu: string;
  zorluk: Zorluk;
  metin: string;
  sekil?: string;
  gorselUrl?: string;
  secenekGorselUrl?: string;
  tablo?: string[][];
  secenekler: Secenek[];
  dogru: Harf;
  cozum: string;
  /** "cikmis" | "meb" | "sorular" | "uretilmis" — kaynağına göre gruplanır */
  kaynak: string;
  /** Çıkmış sorular için sınav yılı */
  yil?: number;
  /** Resimli şıklıysa (PDF'ten geldiğinde şıklar "[görsel]") */
  gorsel?: boolean;
}

export const DERS_ADI: Record<Ders, string> = {
  Turkce: "Türkçe",
  Matematik: "Matematik",
  Fen: "Fen Bilimleri",
  Inkilap: "T.C. İnkılap Tarihi",
  Ingilizce: "Yabancı Dil (İngilizce)",
  Din: "Din Kültürü ve Ahlak Bilgisi",
};

export const DERS_KISA: Record<Ders, string> = {
  Turkce: "Türkçe",
  Matematik: "Mat.",
  Fen: "Fen",
  Inkilap: "İnkılap",
  Ingilizce: "İng.",
  Din: "Din",
};

export const DERS_RENK: Record<Ders, string> = {
  Turkce: "#ff3b5c",
  Matematik: "#3b82f6",
  Fen: "#22d3ee",
  Inkilap: "#f59e0b",
  Ingilizce: "#a78bfa",
  Din: "#34d399",
};

export const ZORLUK_ADI: Record<Zorluk, string> = {
  1: "Kolay",
  2: "Orta",
  3: "Zor",
};

/**
 * MEB LGS sınav yapısı (2026 kılavuzu):
 *  1. Oturum Sözel 50 soru / 75 dk — 09.30'da başlar
 *  2. Oturum Sayısal 40 soru / 80 dk — 11.30'da başlar
 * Puanlama katsayıları: Türkçe/Matematik/Fen = 4, diğerleri = 1
 */
export const LGS_YAPISI: Record<
  Ders,
  { soru: number; sure: number; katsayi: number }
> = {
  Turkce: { soru: 20, sure: 36, katsayi: 4 },
  Inkilap: { soru: 10, sure: 18, katsayi: 1 },
  Ingilizce: { soru: 10, sure: 9, katsayi: 1 },
  Din: { soru: 10, sure: 12, katsayi: 1 },
  Matematik: { soru: 20, sure: 40, katsayi: 4 },
  Fen: { soru: 20, sure: 40, katsayi: 4 },
};

/** Oturum tanımları (süre saniye) — kılavuzdaki resmî süreler */
export const OTURUM_SURE = {
  sozel: 75 * 60,
  sayisal: 80 * 60,
};

export const SOZEL_DERSLER: Ders[] = ["Turkce", "Inkilap", "Ingilizce", "Din"];
export const SAYISAL_DERSLER: Ders[] = ["Matematik", "Fen"];

export interface Deneme {
  id: string;
  ad: string;
  yil: number;
  tur: "cikmis" | "uretilmis";
  oturumlar: { ad: string; dersler: Ders[]; sure: number }[];
  aciklama: string;
  rozet: string;
}
