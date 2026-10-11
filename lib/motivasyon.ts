export interface Soz {
  metin: string;
  kim: string;
}

export const SOZLER: Soz[] = [
  { metin: "Başarı, her gün tekrar edilen küçük çabaların toplamıdır.", kim: "EGA" },
  { metin: "Bugün çözmediğin her soru, yarın pişmanlığın olur.", kim: "EGA" },
  { metin: "Kendinle yarış. Dünkü senden bir soru fazla çöz.", kim: "EGA" },
  { metin: "Zor soru, seni yavaşlatan değil, yükselten sorudur.", kim: "EGA" },
  { metin: "Süre dolmadan önce bitmiş hissetmek, çalışmanın sonucudur.", kim: "EGA" },
  { metin: "Netlerin düşebilir; asla düşmeyen şey, yeniden başlama cesaretindir.", kim: "EGA" },
  { metin: "Bir konuyu anlamak, onu başkasına anlatabildiğinde başlar.", kim: "EGA" },
  { metin: "Masa başında geçen her dakika, hedef okulun bir kademesidir.", kim: "EGA" },
  { metin: "Motivasyon gelmez; motivasyon, başladıktan sonra ortaya çıkar.", kim: "EGA" },
  { metin: "Hata yapmak değil, hatayı tekrar etmek hatadır.", kim: "EGA" },
  { metin: "Her doğru cevap, geleceğine attığın bir tuğladır.", kim: "EGA" },
  { metin: "Sessiz bir odanın sesi, geleceğinin sesidir.", kim: "EGA" },
  { metin: "Deneme sınavları seni yargılamaz; seni hazırlar.", kim: "EGA" },
  { metin: "Bugünün 30 sorusu, yarının yüzlerce doğru cevabıdır.", kim: "EGA" },
  { metin: "En iyi plan, başladığın plandır.", kim: "EGA" },
  { metin: "Kısa süreli rahatlık, uzun süreli pişmanlıktır.", kim: "EGA" },
  { metin: "Hedefine yaklaştıkça sorular kolaylaşmaz; sen güçlenirsin.", kim: "EGA" },
  { metin: "Bir konuyu geçiştirmek, sınavda seni geçiştirir.", kim: "EGA" },
  { metin: "Süre yönetimi, bilgi kadar önemlidir.", kim: "EGA" },
  { metin: "Cesaret, korkuyu yok etmez; onunla birlikte çalışmaktır.", kim: "EGA" },
  { metin: "Her sabah yeni bir sayfa; dün kapandı, bugün açık.", kim: "EGA" },
  { metin: "Düzenli çalışkan, yetenekli çalışkandan güçlüdür.", kim: "EGA" },
  { metin: "Başarı bir günde gelmez, her gün gelir.", kim: "EGA" },
  { metin: "Elindeki tek sınır, kendine koyduğun inançtır.", kim: "EGA" },
];

export function gunlukSoz(tarih = new Date()): Soz {
  const tohum =
    tarih.getFullYear() * 10000 + (tarih.getMonth() + 1) * 100 + tarih.getDate();
  return SOZLER[tohum % SOZLER.length];
}

export const MOTIVASYON_KARTLARI = [
  {
    baslik: "Günlük 30 soru",
    aciklama: "Her gün sadece 30 soru. Bir ayda 900 soru — bir yıllık bir fasikülün toplamı.",
    ikon: "🎯",
  },
  {
    baslik: "Deneme sonrası analiz",
    aciklama: "Sınav bittiğinde net sayısına değil, yanlışlarının konusuna bak.",
    ikon: "📊",
  },
  {
    baslik: "Zayıf konu avı",
    aciklama: "En çok yanlış yaptığın konu, sınavda en çok puan kaybettiren konudur.",
    ikon: "🔍",
  },
  {
    baslik: "Seri (streak) koru",
    aciklama: "Her gün tek soru çözsen bile seriyi yaşat. Süreklilik, yeteneğin önüne geçer.",
    ikon: "🔥",
  },
];
