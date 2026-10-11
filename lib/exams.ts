import {
  Ders,
  Deneme,
  LGS_YAPISI,
  OTURUM_SURE,
  SAYISAL_DERSLER,
  SOZEL_DERSLER,
  Soru,
  Zorluk,
} from "./types";
import { BANK, karistir, seeded } from "./questions";

export interface DenemeKural {
  dersler: Ders[];
  dersBasinaSoru: Record<string, number>;
  zorluk?: Zorluk | "hepsi";
  /** çıkmış denemelerde hangi yılın soruları öncelikli olsun */
  yil?: number;
  /** tek konuya/üniteye sınırlı test (MEB modülü) */
  konu?: string;
}

export interface DenemeTanimi extends Deneme {
  seed: number;
  kurallar: DenemeKural;
  kaynak: string;
}

const TAM_YAPI = (dersler: Ders[]) =>
  Object.fromEntries(dersler.map((d) => [d, LGS_YAPISI[d].soru])) as Record<
    string,
    number
  >;

const LGS_TAM_DERSLER: Ders[] = [...SOZEL_DERSLER, ...SAYISAL_DERSLER];

/** Kılavuzdaki resmî iki oturum: Sözel 50/75 dk, Sayısal 40/80 dk */
const IKI_OTURUM = [
  { ad: "1. Oturum — Sözel", dersler: SOZEL_DERSLER, sure: OTURUM_SURE.sozel },
  { ad: "2. Oturum — Sayısal", dersler: SAYISAL_DERSLER, sure: OTURUM_SURE.sayisal },
];

function tamDeneme(id: string, yil: number, seed: number): DenemeTanimi {
  return {
    id,
    ad: `LGS ${yil} · Çıkmış Deneme`,
    yil,
    tur: "cikmis",
    kaynak: `MEB ${yil} resmî kitapçıkları`,
    rozet: `MEB · ${yil}`,
    aciklama: `${yil} LGS'de çıkan resmî MEB kitapçık sorularıyla (sözel 50, sayısal 40). Kılavuzdaki gibi iki oturum: 09.30'da sözel 75 dakika, 11.30'da sayısal 80 dakika. Puanlama MEB katsayılarıyla (Türkçe/Mat/Fen 4, diğerleri 1).`,
    oturumlar: IKI_OTURUM,
    seed,
    kurallar: {
      dersler: LGS_TAM_DERSLER,
      dersBasinaSoru: TAM_YAPI(LGS_TAM_DERSLER),
      yil,
    },
  };
}

export const CIKMIS_YILLAR = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const CIKMIS_DENEMELER: DenemeTanimi[] = CIKMIS_YILLAR.map((y) =>
  tamDeneme(`lgs-${y}`, y, y * 10000 + 615)
);

function uretilmisTanim(
  id: string,
  ad: string,
  rozet: string,
  aciklama: string,
  oturumlar: Deneme["oturumlar"],
  dersler: Ders[],
  seed: number
): DenemeTanimi {
  return {
    id,
    ad,
    yil: new Date().getFullYear(),
    tur: "uretilmis",
    kaynak: "EGA havuzu",
    rozet,
    aciklama,
    oturumlar,
    seed,
    kurallar: { dersler, dersBasinaSoru: TAM_YAPI(dersler) },
  };
}

export const URETILMIS_DENEMELER: DenemeTanimi[] = [
  uretilmisTanim(
    "ega-tam",
    "EGA Deneme · Tam Sınav",
    "90 soru · 155 dakika",
    "Resmî LGS formatında iki oturumlu tam deneme. Sözel 50 soru/75 dk, sayısal 40 soru/80 dk. Her açılışta havuzdan farklı soru kombinasyonu gelir.",
    IKI_OTURUM,
    LGS_TAM_DERSLER,
    9001
  ),
  uretilmisTanim(
    "ega-sayisal",
    "EGA Deneme · Sayısal Sprint",
    "40 soru · 80 dakika",
    "Matematik ve Fen. Gerçek sayısal oturum süresi (80 dk) aynen uygulanır.",
    [{ ad: "2. Oturum — Sayısal", dersler: SAYISAL_DERSLER, sure: OTURUM_SURE.sayisal }],
    SAYISAL_DERSLER,
    21
  ),
  uretilmisTanim(
    "ega-sozel",
    "EGA Deneme · Sözel Sprint",
    "50 soru · 75 dakika",
    "Türkçe, İnkılap, Din ve İngilizce. Gerçek sözel oturum süresi (75 dk) aynen uygulanır.",
    [{ ad: "1. Oturum — Sözel", dersler: SOZEL_DERSLER, sure: OTURUM_SURE.sozel }],
    SOZEL_DERSLER,
    33
  ),
];

export function denemeGetir(id: string): DenemeTanimi | undefined {
  return (
    CIKMIS_DENEMELER.find((d) => d.id === id) ||
    URETILMIS_DENEMELER.find((d) => d.id === id)
  );
}

/**
 * Deneme sorularını havuzdan seçer.
 * Çıkmış denemelerde önce o yılın resmî soruları kullanılır; eksik kalan
 * yerler (görselli/çıkışta kaçan sorular) aynı dersten diğer yıllardan
 * tamamlanır.
 */
export function denemeSorulariniUret(
  tanim: DenemeTanimi,
  seedOverride?: number
): Soru[] {
  const rnd = seeded(seedOverride ?? tanim.seed);
  const sorular: Soru[] = [];
  tanim.kurallar.dersler.forEach((ders) => {
    const istenen = tanim.kurallar.dersBasinaSoru[ders] ?? LGS_YAPISI[ders].soru;
    let havuz = BANK.filter((s) => s.ders === ders);
    if (tanim.kurallar.konu) {
      havuz = havuz.filter((s) => s.konu === tanim.kurallar.konu);
    }

    if (tanim.kurallar.yil) {
      const yilHavuz = havuz.filter(
        (s) => s.kaynak === "cikmis" && s.yil === tanim.kurallar.yil
      );
      const diger = havuz.filter((s) => !(s.kaynak === "cikmis" && s.yil === tanim.kurallar.yil));
      const secilen = karistir(yilHavuz, rnd).slice(0, istenen);
      if (secilen.length < istenen) {
        secilen.push(...karistir(diger, rnd).slice(0, istenen - secilen.length));
      }
      sorular.push(...secilen);
      return;
    }

    if (tanim.kurallar.zorluk && tanim.kurallar.zorluk !== "hepsi") {
      havuz = havuz.filter((s) => s.zorluk === tanim.kurallar.zorluk);
    }
    sorular.push(...karistir(havuz, rnd).slice(0, istenen));
  });
  return sorular;
}

export interface OzelDenemeSecim {
  dersler: Ders[];
  soruSayisi: number;
  sure: number; // dakika
  zorluk: Zorluk | "hepsi";
  ad: string;
  konu?: string;
}

export function ozelDenemeOlustur(secim: OzelDenemeSecim, seed: number): DenemeTanimi {
  const dersBasinaSoru: Record<string, number> = {};
  const esit = Math.floor(secim.soruSayisi / secim.dersler.length);
  let kalan = secim.soruSayisi - esit * secim.dersler.length;
  secim.dersler.forEach((d) => {
    dersBasinaSoru[d] = esit + (kalan-- > 0 ? 1 : 0);
  });
  return {
    id: `ozel-${seed}`,
    ad: secim.ad || "Özel Deneme",
    yil: new Date().getFullYear(),
    tur: "uretilmis",
    kaynak: "Senin kurallarınla üretildi",
    rozet: `${secim.soruSayisi} soru · ${secim.sure} dk`,
    aciklama:
      "Kendi belirlediğin ders, soru sayısı, süre ve zorluk dağılımıyla üretilen deneme.",
    oturumlar: [
      {
        ad: secim.dersler.length === LGS_TAM_DERSLER.length ? "Tam Deneme" : "Özel Oturum",
        dersler: secim.dersler,
        sure: secim.sure * 60,
      },
    ],
    seed,
    kurallar: { dersler: secim.dersler, dersBasinaSoru, zorluk: secim.zorluk, konu: secim.konu },
  };
}

export const tumDenemeler = (): DenemeTanimi[] => [
  ...CIKMIS_DENEMELER,
  ...URETILMIS_DENEMELER,
];
