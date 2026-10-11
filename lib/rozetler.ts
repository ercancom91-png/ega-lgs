import type { Veri, Ozet } from "./store";
import type { Ders } from "./types";
import { DERS_ADI } from "./types";

export interface Rozet {
  id: string;
  ad: string;
  aciklama: string;
  ikon: string;
  sart: (v: Veri, o: Ozet) => boolean;
}

export const ROZETLER: Rozet[] = [
  {
    id: "ilk-adim",
    ad: "İlk Adım",
    aciklama: "İlk sorunu çözdün",
    ikon: "🚀",
    sart: (_v, o) => o.toplamSoru >= 1,
  },
  {
    id: "yuz-soru",
    ad: "Yüz Soru",
    aciklama: "Toplam 100 soru çözdün",
    ikon: "💯",
    sart: (_v, o) => o.toplamSoru >= 100,
  },
  {
    id: "bes-yuz",
    ad: "Beş Yüz",
    aciklama: "Toplam 500 soru çözdün",
    ikon: "🏛️",
    sart: (_v, o) => o.toplamSoru >= 500,
  },
  {
    id: "seri-3",
    ad: "3 Gün Seri",
    aciklama: "3 gün üst üste çözüm yaptın",
    ikon: "🔥",
    sart: (v) => v.enUzun >= 3,
  },
  {
    id: "seri-7",
    ad: "Haftalık Seri",
    aciklama: "7 gün üst üste çözüm yaptın",
    ikon: "⚡",
    sart: (v) => v.enUzun >= 7,
  },
  {
    id: "ilk-deneme",
    ad: "Sınavı Tamamladın",
    aciklama: "İlk deneme sınavını bitirdin",
    ikon: "📝",
    sart: (_v, o) => o.denemeSayisi >= 1,
  },
  {
    id: "uc-deneme",
    ad: "Deneme Uzmanı",
    aciklama: "3 deneme sınavı tamamladın",
    ikon: "🏅",
    sart: (_v, o) => o.denemeSayisi >= 3,
  },
  {
    id: "puan-300",
    ad: "300 Puan",
    aciklama: "En iyi deneme puanın 300'ü geçti",
    ikon: "🥉",
    sart: (_v, o) => o.enIyiPuan >= 300,
  },
  {
    id: "puan-400",
    ad: "400 Puan",
    aciklama: "En iyi deneme puanın 400'ü geçti",
    ikon: "🥈",
    sart: (_v, o) => o.enIyiPuan >= 400,
  },
  {
    id: "puan-450",
    ad: "450 Puan",
    aciklama: "En iyi deneme puanın 450'yi geçti",
    ikon: "🥇",
    sart: (_v, o) => o.enIyiPuan >= 450,
  },
  {
    id: "hedef-gunluk",
    ad: "Hedefi Yakaladın",
    aciklama: "Günlük soru hedefini aştın",
    ikon: "🎯",
    sart: (v, o) => o.bugunCozulen >= v.profil.hedefGunlukSoru && o.bugunCozulen > 0,
  },
  {
    id: "mat-ustasi",
    ad: "Matematik Ustası",
    aciklama: "Matematikte %80 doğruluk ve 50 soru",
    ikon: "➗",
    sart: (v) => matYuzde(v) >= 80 && matSoru(v) >= 50,
  },
];

function dersIstatistik(v: Veri, ders: Ders) {
  let soru = 0,
    dogru = 0,
    yanlis = 0;
  v.denemeler.forEach((d) => {
    const ds = d.dersler.find((x) => x.ders === ders);
    if (ds) {
      soru += ds.soru;
      dogru += ds.dogru;
      yanlis += ds.yanlis;
    }
  });
  return {
    soru,
    dogru,
    yanlis,
    yuzde: soru ? Math.round((dogru / soru) * 100) : 0,
  };
}

function matYuzde(v: Veri) {
  return dersIstatistik(v, "Matematik").yuzde;
}
function matSoru(v: Veri) {
  return dersIstatistik(v, "Matematik").soru;
}

export function kazanilanlar(v: Veri, o: Ozet): Rozet[] {
  return ROZETLER.filter((r) => r.sart(v, o));
}

/** Saklanan + koşullardan hesaplanan rozetlerin birleşimi. */
export function aktifRozetler(v: Veri, o: Ozet): Set<string> {
  const set = new Set(v.rozetler);
  ROZETLER.forEach((r) => {
    if (r.sart(v, o)) set.add(r.id);
  });
  return set;
}

export function dersOzeti(v: Veri) {
  const dersler: Ders[] = [
    "Turkce",
    "Matematik",
    "Fen",
    "Inkilap",
    "Ingilizce",
    "Din",
  ];
  return dersler.map((d) => ({ ders: d, ad: DERS_ADI[d], ...dersIstatistik(v, d) }));
}
