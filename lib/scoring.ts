import { Ders, LGS_YAPISI, SAYISAL_DERSLER, SOZEL_DERSLER } from "./types";

export interface DersSonuc {
  ders: Ders;
  dogru: number;
  yanlis: number;
  bos: number;
  soru: number;
  net: number;
  dogruYuzde: number;
}

export interface DenemeSonuc {
  id: string;
  denemeId: string;
  ad: string;
  tur: "cikmis" | "uretilmis";
  tarih: string;
  sure: number; // saniye
  toplamSoru: number;
  dogru: number;
  yanlis: number;
  bos: number;
  net: number;
  puan: number;
  dersler: DersSonuc[];
  cevaplar: Record<string, string | null>;
  isaretlenenler: string[];
  /** Sınavın açılış sorgusu (id=... / ozel=...&seed=...) — "Tekrar aç" için */
  baslangic?: string;
}

/** MEB kuralı: ham puan = doğru − (yanlış / 3) */
export function netHesapla(dogru: number, yanlis: number): number {
  return Math.round((dogru - yanlis / 3) * 100) / 100;
}

export function dersSonuclari(
  sorular: { id: string; ders: Ders }[],
  cevaplar: Record<string, string | null>,
  dogrular: Record<string, string>
): DersSonuc[] {
  const harita = new Map<Ders, DersSonuc>();
  sorular.forEach((s) => {
    if (!harita.has(s.ders)) {
      harita.set(s.ders, {
        ders: s.ders,
        dogru: 0,
        yanlis: 0,
        bos: 0,
        soru: 0,
        net: 0,
        dogruYuzde: 0,
      });
    }
    const d = harita.get(s.ders)!;
    d.soru++;
    const cevap = cevaplar[s.id];
    if (!cevap) d.bos++;
    else if (cevap === dogrular[s.id]) d.dogru++;
    else d.yanlis++;
  });
  return Array.from(harita.values()).map((d) => ({
    ...d,
    net: netHesapla(d.dogru, d.yanlis),
    dogruYuzde: d.soru ? Math.round((d.dogru / d.soru) * 100) : 0,
  }));
}

/**
 * Alt test ham puanlarının popülasyon ortalaması ve standart sapması
 * (MEB LGS dağılımlarından yaklaşıklık — simülasyon için sabit referans).
 */
export const ALT_TEST: Record<Ders, { mu: number; sigma: number }> = {
  Turkce: { mu: 11.3, sigma: 4.2 },
  Matematik: { mu: 7.8, sigma: 4.6 },
  Fen: { mu: 9.1, sigma: 4.7 },
  Inkilap: { mu: 6.2, sigma: 2.7 },
  Din: { mu: 7.1, sigma: 2.4 },
  Ingilizce: { mu: 6.4, sigma: 2.8 },
};

/** Standart puan: SP = ((HP − ort) / ss) × 10 + 50 */
function standartPuan(d: DersSonuc): number {
  const t = ALT_TEST[d.ders];
  const hp = d.dogru - d.yanlis / 3;
  return ((hp - t.mu) / t.sigma) * 10 + 50;
}

/** Katsayı 4 (Türkçe, Mat, Fen) / 1 (diğerleri) ile ağırlıklı toplam */
function tasP(dersler: DersSonuc[]): number {
  return dersler.reduce((t, d) => t + standartPuan(d) * LGS_YAPISI[d.ders].katsayi, 0);
}

/**
 * MEB puanlaması:
 *  HP = doğru − yanlış/3  →  SP = ((HP−ort)/ss)×10+50  →  ASP = SP × katsayı
 *  TASP (toplam) kendi içinde 100–500 aralığına dönüştürülür.
 * Kılavuzdaki "en küçük 100, en büyük 500" kuralı uyarlanmıştır.
 */
export function lgsPuani(dersler: DersSonuc[]): number {
  if (!dersler.length) return 100;
  const giren = tasP(dersler);

  // verilen ders kümesi için teorik alt/üst sınır
  const alt = dersler.reduce((t, d) => {
    const temel: DersSonuc = { ...d, dogru: 0, yanlis: d.soru, bos: 0, net: 0, dogruYuzde: 0 };
    return t + standartPuan(temel) * LGS_YAPISI[d.ders].katsayi;
  }, 0);
  const ust = dersler.reduce((t, d) => {
    const temel: DersSonuc = { ...d, dogru: d.soru, yanlis: 0, bos: 0, net: 0, dogruYuzde: 0 };
    return t + standartPuan(temel) * LGS_YAPISI[d.ders].katsayi;
  }, 0);

  if (ust - alt < 1) return 300;
  const oran = (giren - alt) / (ust - alt);
  return Math.max(100, Math.min(500, Math.round(100 + oran * 400)));
}

export function sureyiYaz(saniye: number): string {
  const dk = Math.floor(saniye / 60);
  const sn = saniye % 60;
  return `${String(dk).padStart(2, "0")}:${String(sn).padStart(2, "0")}`;
}

export function toplamOzet(s: DenemeSonuc) {
  return {
    dogru: s.dogru,
    yanlis: s.yanlis,
    bos: s.bos,
    net: s.net,
    puan: s.puan,
  };
}

export const oturumAdi = (dersler: Ders[]) => {
  const sozel = dersler.every((d) => SOZEL_DERSLER.includes(d));
  const sayisal = dersler.every((d) => SAYISAL_DERSLER.includes(d));
  return sozel ? "1. Oturum — Sözel" : sayisal ? "2. Oturum — Sayısal" : "Deneme";
};
