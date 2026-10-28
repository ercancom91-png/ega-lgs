import type { Ders } from "./types";
import { DERS_ADI } from "./types";

export interface DersBilgi {
  ders: Ders;
  slug: string;
  ikon: string;
  aciklama: string;
  oturum: string;
}

export const DERS_BILGI: DersBilgi[] = [
  {
    ders: "Turkce",
    slug: "turkce",
    ikon: "📖",
    aciklama:
      "Sözel beceri, okuduğunu anlama, dil bilgisi, yazım ve noktalama, söz sanatları.",
    oturum: "1. oturum · 20 soru",
  },
  {
    ders: "Matematik",
    slug: "matematik",
    ikon: "➗",
    aciklama:
      "Sayılar, cebir, geometri, veri; çok adımlı problem çözme ve yeni nesil sorular.",
    oturum: "2. oturum · 20 soru",
  },
  {
    ders: "Fen",
    slug: "fen",
    ikon: "🔬",
    aciklama:
      "Fizik, kimya ve biyoloji temelleri; olayları açıklama, model kurma ve deney yorumu.",
    oturum: "2. oturum · 20 soru",
  },
  {
    ders: "Inkilap",
    slug: "inkilap",
    ikon: "🏛️",
    aciklama:
      "I. Dünya Savaşı, Kurtuluş Savaşı, Inkılaplar, Atatürk ilkeleri ve çağdaşlaşma.",
    oturum: "1. oturum · 10 soru",
  },
  {
    ders: "Din",
    slug: "din",
    ikon: "🕌",
    aciklama:
      "İman, ibadet, ahlak, Hz. Peygamberin hayatı ve din – hayat ilişkisi.",
    oturum: "1. oturum · 10 soru",
  },
  {
    ders: "Ingilizce",
    slug: "ingilizce",
    ikon: "🌍",
    aciklama:
      "Kelime, dil bilgisi, okuduğunu anlama, dinlediğini anlama ve günlük kullanım.",
    oturum: "1. oturum · 10 soru",
  },
];

const bySlug = new Map(DERS_BILGI.map((d) => [d.slug, d]));
const byDers = new Map(DERS_BILGI.map((d) => [d.ders, d]));

export function slugBul(slug: string): DersBilgi | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function dersBilgisi(ders: Ders): DersBilgi {
  return byDers.get(ders)!;
}

export function dersAdi(slug: string): string {
  const b = slugBul(slug);
  return b ? DERS_ADI[b.ders] : slug;
}

/** Ders slug'ından URL için güvenli konu slug'ı üretir. */
export function konuSlug(konu: string): string {
  return encodeURIComponent(
    konu
      .toLocaleLowerCase("tr")
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}-]/gu, "")
  );
}
