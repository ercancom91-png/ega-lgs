import type { Soru } from "../types";

const MATEMATIK: Soru[] = [
  {
    id: "mt-01",
    ders: "Matematik",
    konu: "Alan Ölçme",
    zorluk: 2,
    metin:
      "Uzun kenarı 8 cm olan dikdörtgen şeklindeki bir kâğıt, Şekil I'de kesik çizgilerle gösterildiği gibi kesilerek üç parça hâline getirilmiştir. Parçaların genişlikleri 2 cm, 3 cm ve 3 cm'dir. Şekil II'de kâğıdın orta parçası (II) kullanılarak logo oluşturulmuştur.\n\nBuna göre, orta parçanın alanı kaç cm² olur?",
    sekil: "dikdortgen-kesim",
    secenekler: [
      { id: "A", text: "12" },
      { id: "B", text: "15" },
      { id: "C", text: "18" },
      { id: "D", text: "20" },
    ],
    dogru: "B",
    cozum:
      "Kâğıdın kısa kenarı 5 cm'dir (2+3+3=8 cm uzun kenar). Orta parçanın genişliği 3 cm olduğundan alanı 3 × 5 = 15 cm² olur. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-02",
    ders: "Matematik",
    konu: "Rasyonel Sayılar",
    zorluk: 2,
    metin:
      "Şekildeki sayı doğrusunda M ve N noktaları işaretlenmiştir.\n\nBuna göre, M ile N arasındaki uzunluk kaç birimdir?",
    sekil: "sayi-dogrusu",
    secenekler: [
      { id: "A", text: "7,5" },
      { id: "B", text: "10" },
      { id: "C", text: "12,5" },
      { id: "D", text: "15" },
    ],
    dogru: "B",
    cozum:
      "Her iki aralık 5 birim olduğundan M = 7,5 ve N = 17,5'tir. MN = 17,5 − 7,5 = 10 birim. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-03",
    ders: "Matematik",
    konu: "Alan Ölçme",
    zorluk: 2,
    metin:
      "Şekildeki dairenin 90°'lik dilimin alanı 28 cm²'dir.\n\nBuna göre tüm dairenin alanı kaç cm² olur?",
    sekil: "daire-dilim",
    secenekler: [
      { id: "A", text: "84" },
      { id: "B", text: "112" },
      { id: "C", text: "140" },
      { id: "D", text: "196" },
    ],
    dogru: "B",
    cozum:
      "90° tam açının dörtte biridir. Dilim alanı 28 cm² ise daire alanı 28 × 4 = 112 cm² olur. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-04",
    ders: "Matematik",
    konu: "Veri Analizi",
    zorluk: 2,
    metin:
      "Bir öğrenci hafta içinde her gün bisikletle kat ettiği mesafeyi grafikte göstermiştir.\n\nBuna göre öğrenci hafta boyunca toplam kaç km yol yapmıştır?",
    sekil: "cizgi-grafik",
    secenekler: [
      { id: "A", text: "270" },
      { id: "B", text: "280" },
      { id: "C", text: "290" },
      { id: "D", text: "300" },
    ],
    dogru: "C",
    cozum:
      "Günlük mesafeler 20, 50, 40, 80 ve 100 km'dir. Toplam: 20 + 50 + 40 + 80 + 100 = 290 km. Doğru cevap C'dir.",
    kaynak: "Vortex Orijinal",
  },
  {
    id: "mt-05",
    ders: "Matematik",
    konu: "Veri Analizi",
    zorluk: 1,
    metin:
      "Bir sınıf başkanlığı seçiminde dört adayın aldığı oylar sütun grafiğinde gösterilmiştir.\n\nBuna göre en çok oyu alan aday, en az oyu alandan kaç fazla oy almıştır?",
    sekil: "sutun-grafik",
    secenekler: [
      { id: "A", text: "28" },
      { id: "B", text: "29" },
      { id: "C", text: "30" },
      { id: "D", text: "32" },
    ],
    dogru: "B",
    cozum:
      "En çok oy: C adayı 50, en az oy: B adayı 21. Fark: 50 − 21 = 29. Doğru cevap B'dir.",
    kaynak: "Vortex Orijinal",
  },
  {
    id: "mt-06",
    ders: "Matematik",
    konu: "Yüzdeler",
    zorluk: 1,
    metin:
      "Bir sınıftaki 30 öğrencinin dağılımı şekildeki yüzde grafiğiyle gösterilmiştir.\n\nBuna göre koyu renkli (%40) bölümde kaç öğrenci vardır?",
    sekil: "yuzde-grafik",
    secenekler: [
      { id: "A", text: "9" },
      { id: "B", text: "10" },
      { id: "C", text: "12" },
      { id: "D", text: "15" },
    ],
    dogru: "C",
    cozum:
      "30 × %40 = 30 × 0,40 = 12 öğrenci. Doğru cevap C'dir.",
    kaynak: "Vortex Orijinal",
  },
  {
    id: "mt-07",
    ders: "Matematik",
    konu: "Eşitsizlikler",
    zorluk: 2,
    metin:
      "3x − 7 < 5 eşitsizliğini sağlayan en büyük tam sayı x değeri kaçtır?",
    secenekler: [
      { id: "A", text: "2" },
      { id: "B", text: "3" },
      { id: "C", text: "4" },
      { id: "D", text: "5" },
    ],
    dogru: "B",
    cozum:
      "3x < 12 → x < 4. Bu koşulu sağlayan en büyük tam sayı 3'tür. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-08",
    ders: "Matematik",
    konu: "Kareköklü İfadeler",
    zorluk: 2,
    metin: "√48 + √27 işleminin sonucu aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "7√3" },
      { id: "B", text: "8√3" },
      { id: "C", text: "9√3" },
      { id: "D", text: "11√3" },
    ],
    dogru: "A",
    cozum:
      "√48 = √(16·3) = 4√3 ve √27 = √(9·3) = 3√3. Toplam 4√3 + 3√3 = 7√3. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-09",
    ders: "Matematik",
    konu: "Üslü İfadeler",
    zorluk: 2,
    metin: "2⁵ · 4³ işleminin sonucu aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "2⁸" },
      { id: "B", text: "2¹⁰" },
      { id: "C", text: "2¹¹" },
      { id: "D", text: "2¹⁵" },
    ],
    dogru: "C",
    cozum:
      "4³ = (2²)³ = 2⁶. Bu durumda 2⁵ · 2⁶ = 2¹¹. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-10",
    ders: "Matematik",
    konu: "Denklemler",
    zorluk: 2,
    metin:
      "x + y = 12 ve x − y = 4 olduğuna göre, x · y işleminin sonucu kaçtır?",
    secenekler: [
      { id: "A", text: "24" },
      { id: "B", text: "28" },
      { id: "C", text: "32" },
      { id: "D", text: "36" },
    ],
    dogru: "C",
    cozum:
      "Denklemler toplanırsa 2x = 16 → x = 8, y = 4. x · y = 8 · 4 = 32. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-11",
    ders: "Matematik",
    konu: "Oran-Orantı",
    zorluk: 1,
    metin:
      "3 kalem 45 TL olduğuna göre aynı cinsten 7 kalem kaç TL'dir?",
    secenekler: [
      { id: "A", text: "90" },
      { id: "B", text: "105" },
      { id: "C", text: "120" },
      { id: "D", text: "135" },
    ],
    dogru: "B",
    cozum:
      "1 kalem 45 ÷ 3 = 15 TL'dir. 7 kalem 7 × 15 = 105 TL olur. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-12",
    ders: "Matematik",
    konu: "Yüzdeler",
    zorluk: 2,
    metin:
      "240 TL'lik bir ürüne %25 indirim yapılmıştır. İndirimden sonra ödenmesi gereken tutar kaç TL'dir?",
    secenekler: [
      { id: "A", text: "160" },
      { id: "B", text: "180" },
      { id: "C", text: "200" },
      { id: "D", text: "210" },
    ],
    dogru: "B",
    cozum:
      "İndirim tutarı 240 × 0,25 = 60 TL'dir. Ödenecek tutar 240 − 60 = 180 TL. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-13",
    ders: "Matematik",
    konu: "Üçgenler",
    zorluk: 3,
    metin:
      "Şekildeki ABC üçgeninde AB = 8 cm, AC = 6 cm ve BC = 10 cm'dir.\n\nBuna göre A köşesinden BC kenarına indirilen yükseklik kaç cm'dir?",
    sekil: "ucgen-abc",
    secenekler: [
      { id: "A", text: "4,6" },
      { id: "B", text: "4,8" },
      { id: "C", text: "5" },
      { id: "D", text: "5,2" },
    ],
    dogru: "B",
    cozum:
      "ABC dik üçgendir (6-8-10). Alan = (6 · 8) / 2 = 24 cm². Ayrıca alan = (10 · h) / 2 olduğundan h = 48 / 10 = 4,8 cm. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-14",
    ders: "Matematik",
    konu: "Çember ve Daire",
    zorluk: 1,
    metin:
      "Yarıçapı 7 cm olan bir çemberin çevre uzunluğu kaç cm'dir? (π alınız)",
    secenekler: [
      { id: "A", text: "14π" },
      { id: "B", text: "21π" },
      { id: "C", text: "28π" },
      { id: "D", text: "49π" },
    ],
    dogru: "A",
    cozum:
      "Çevre = 2 · π · r = 2 · π · 7 = 14π cm. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-15",
    ders: "Matematik",
    konu: "Çokgenler",
    zorluk: 2,
    metin:
      "Bir sekizgenin iç açılarının ölçüleri toplamı kaç derecedir?",
    secenekler: [
      { id: "A", text: "900" },
      { id: "B", text: "1080" },
      { id: "C", text: "1260" },
      { id: "D", text: "1440" },
    ],
    dogru: "B",
    cozum:
      "İç açılar toplamı = (n − 2) · 180 = (8 − 2) · 180 = 1080°. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-16",
    ders: "Matematik",
    konu: "Dönüşüm Geometrisi",
    zorluk: 2,
    metin:
      "A(2, 3) noktasının önce x-ekseni, sonra y-ekseni göre simetriğinin koordinatları aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "(2, −3)" },
      { id: "B", text: "(−2, −3)" },
      { id: "C", text: "(−2, 3)" },
      { id: "D", text: "(2, 3)" },
    ],
    dogru: "C",
    cozum:
      "x-ekseni simetriği A'(2, −3), bunun y-ekseni simetriği A''(−2, 3) olur. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-17",
    ders: "Matematik",
    konu: "Olasılık",
    zorluk: 2,
    metin:
      "Bir torbada 4 kırmızı ve 6 mavi bilye vardır. Torbadan çekilen bir bilyenin kırmızı olma olasılığı kaçtır?",
    secenekler: [
      { id: "A", text: "2/5" },
      { id: "B", text: "3/5" },
      { id: "C", text: "1/2" },
      { id: "D", text: "1/3" },
    ],
    dogru: "A",
    cozum:
      "Toplam bilye 10, istenen 4'tür. Olasılık = 4/10 = 2/5. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-18",
    ders: "Matematik",
    konu: "Veri Analizi",
    zorluk: 2,
    metin:
      "Bir öğrencinin beş yazılı sınav notu aşağıdaki tabloda verilmiştir.\n\nBuna göre bu notların aritmetik ortalaması kaçtır?",
    tablo: [
      ["Yazılı", "I", "II", "III", "IV", "V"],
      ["Not", "70", "80", "60", "90", "80"],
    ],
    secenekler: [
      { id: "A", text: "74" },
      { id: "B", text: "76" },
      { id: "C", text: "78" },
      { id: "D", text: "80" },
    ],
    dogru: "B",
    cozum:
      "Toplam = 70 + 80 + 60 + 90 + 80 = 380. Ortalama = 380 ÷ 5 = 76. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-19",
    ders: "Matematik",
    konu: "Cebirsel İfadeler",
    zorluk: 1,
    metin:
      "Bir sayının 3 katının 5 eksiğini gösteren ifade aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "5x − 3" },
      { id: "B", text: "3x − 5" },
      { id: "C", text: "3(x − 5)" },
      { id: "D", text: "3x + 5" },
    ],
    dogru: "B",
    cozum:
      "Sayı x ise 3 katı 3x, 5 eksiği 3x − 5 olur. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-20",
    ders: "Matematik",
    konu: "Benzerlik",
    zorluk: 3,
    metin:
      "İki benzer üçgenin karşılıklı kenarları 6 cm ve 9 cm'dir. Birinci üçgenin bir diğer kenarı 10 cm ise ikinci üçgenin aynı kenarı kaç cm'dir?",
    secenekler: [
      { id: "A", text: "12" },
      { id: "B", text: "14" },
      { id: "C", text: "15" },
      { id: "D", text: "18" },
    ],
    dogru: "C",
    cozum:
      "Benzerlik oranı 9/6 = 3/2'dir. 10 × (3/2) = 15 cm. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-21",
    ders: "Matematik",
    konu: "Çarpanlara Ayırma",
    zorluk: 2,
    metin: "(√5 + 2)(√5 − 2) işleminin sonucu kaçtır?",
    secenekler: [
      { id: "A", text: "1" },
      { id: "B", text: "9" },
      { id: "C", text: "√5" },
      { id: "D", text: "−1" },
    ],
    dogru: "A",
    cozum:
      "Farkın kareleri: (√5)² − 2² = 5 − 4 = 1. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-22",
    ders: "Matematik",
    konu: "Üslü İfadeler",
    zorluk: 3,
    metin: "(3⁴ · 3⁻²) ÷ 3³ işleminin sonucu kaçtır?",
    secenekler: [
      { id: "A", text: "1/3" },
      { id: "B", text: "3" },
      { id: "C", text: "9" },
      { id: "D", text: "1/9" },
    ],
    dogru: "A",
    cozum:
      "3⁴ · 3⁻² = 3². Sonra 3² ÷ 3³ = 3⁻¹ = 1/3. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-23",
    ders: "Matematik",
    konu: "Yüzdeler",
    zorluk: 3,
    metin:
      "400 olan bir sayı önce %20 artırılır, ardından bulunan sayı %20 azaltılırsa son sayı kaç olur?",
    secenekler: [
      { id: "A", text: "384" },
      { id: "B", text: "400" },
      { id: "C", text: "416" },
      { id: "D", text: "396" },
    ],
    dogru: "A",
    cozum:
      "400 × 1,20 = 480. 480 × 0,80 = 384. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-24",
    ders: "Matematik",
    konu: "Problemler",
    zorluk: 2,
    metin:
      "Bir işi 6 işçi 12 günde bitiriyorsa aynı işi 4 işçi kaç günde bitirir?",
    secenekler: [
      { id: "A", text: "16" },
      { id: "B", text: "18" },
      { id: "C", text: "20" },
      { id: "D", text: "24" },
    ],
    dogru: "B",
    cozum:
      "Toplam iş 6 × 12 = 72 işçi-gün. 72 ÷ 4 = 18 gün. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-25",
    ders: "Matematik",
    konu: "Çember ve Daire",
    zorluk: 2,
    metin:
      "Yarıçapı 5 cm olan bir dairenin alanının yarısı kaç cm²'dir? (π alınız)",
    secenekler: [
      { id: "A", text: "10π" },
      { id: "B", text: "12,5π" },
      { id: "C", text: "25π" },
      { id: "D", text: "50π" },
    ],
    dogru: "B",
    cozum:
      "Daire alanı π · 5² = 25π cm²'dir. Yarısı 12,5π cm² olur. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-26",
    ders: "Matematik",
    konu: "Sayısal Örüntüler",
    zorluk: 2,
    metin:
      "3, 6, 12, 24, ... şeklinde devam eden sayı dizisinin 8. terimi kaçtır?",
    secenekler: [
      { id: "A", text: "192" },
      { id: "B", text: "256" },
      { id: "C", text: "384" },
      { id: "D", text: "768" },
    ],
    dogru: "C",
    cozum:
      "Dizi 2 ile çarpma örüntüsüdür. 8. terim = 3 · 2⁷ = 3 · 128 = 384. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-27",
    ders: "Matematik",
    konu: "Problemler",
    zorluk: 2,
    metin:
      "Bir kermeste poğaçanın tanesi 15 TL, simidin tanesi 10 TL'dir. 20 poğaça ve 15 simit satıldığında toplam kaç TL kazanılmıştır?",
    secenekler: [
      { id: "A", text: "420" },
      { id: "B", text: "450" },
      { id: "C", text: "480" },
      { id: "D", text: "500" },
    ],
    dogru: "B",
    cozum:
      "Poğaça: 20 × 15 = 300 TL, simit: 15 × 10 = 150 TL. Toplam 450 TL. Doğru cevap B'dir.",
    kaynak: "Vortex Orijinal",
  },
  {
    id: "mt-28",
    ders: "Matematik",
    konu: "Çevre ve Alan",
    zorluk: 2,
    metin:
      "Alanı 96 cm², genişliği 8 cm olan bir dikdörtgenin çevresi kaç cm'dir?",
    secenekler: [
      { id: "A", text: "20" },
      { id: "B", text: "26" },
      { id: "C", text: "36" },
      { id: "D", text: "40" },
    ],
    dogru: "D",
    cozum:
      "Uzunluk = 96 ÷ 8 = 12 cm. Çevre = 2 · (12 + 8) = 40 cm. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-29",
    ders: "Matematik",
    konu: "Kümeler ve Dengelenmiş Terazi",
    zorluk: 2,
    metin:
      "Şekildeki terazi dengededir. Buna göre x değeri kaçtır?",
    sekil: "agirlik-cizelge",
    secenekler: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "4" },
    ],
    dogru: "B",
    cozum:
      "Denge koşulundan 2 + x = 3 + 1 → x = 2. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-30",
    ders: "Matematik",
    konu: "Üçgenler",
    zorluk: 2,
    metin:
      "Bir üçgenin iç açılarının ölçüleri 2 : 3 : 5 oranındadır. Buna göre en büyük açının ölçüsü kaç derecedir?",
    secenekler: [
      { id: "A", text: "60" },
      { id: "B", text: "72" },
      { id: "C", text: "80" },
      { id: "D", text: "90" },
    ],
    dogru: "D",
    cozum:
      "2x + 3x + 5x = 180 → 10x = 180 → x = 18. En büyük açı 5 × 18 = 90°. Doğru cevap D'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-31",
    ders: "Matematik",
    konu: "Hareket Problemleri",
    zorluk: 3,
    metin:
      "Bir bisikletlinin yaptığı yolculuk zaman-mesafe grafiğinde gösterilmiştir.\n\nGrafiğe göre bisikletli yalnızca hareket ettiği anlar dikkate alındığında ortalama hızı kaç km/saat olmuştur?",
    sekil: "hareket-grafik",
    secenekler: [
      { id: "A", text: "20" },
      { id: "B", text: "24" },
      { id: "C", text: "25" },
      { id: "D", text: "30" },
    ],
    dogru: "B",
    cozum:
      "Bisikletli toplam 16 km yol almış, bunun için 15 + 25 = 40 dakika hareket etmiştir. Hız = 16 km ÷ (40/60) saat = 24 km/saat. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-32",
    ders: "Matematik",
    konu: "Kareköklü İfadeler",
    zorluk: 2,
    metin: "√(18 · 8) işleminin sonucu kaçtır?",
    secenekler: [
      { id: "A", text: "10" },
      { id: "B", text: "12" },
      { id: "C", text: "14" },
      { id: "D", text: "16" },
    ],
    dogru: "B",
    cozum:
      "18 · 8 = 144 ve √144 = 12. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "mt-33",
    ders: "Matematik",
    konu: "Çember ve Daire",
    zorluk: 3,
    metin:
      "Yarıçapı 9 cm olan bir çemberde 90°'lik dairesel yayın uzunluğu kaç cm'dir? (π alınız)",
    secenekler: [
      { id: "A", text: "4,5π" },
      { id: "B", text: "9π" },
      { id: "C", text: "18π" },
      { id: "D", text: "2π" },
    ],
    dogru: "A",
    cozum:
      "Çevre 2 · π · 9 = 18π cm'dir. 90° tam açının dörtte biri olduğundan yay 18π ÷ 4 = 4,5π cm. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "mt-34",
    ders: "Matematik",
    konu: "Oran-Orantı",
    zorluk: 2,
    metin:
      "Bir matbaa 5 saatte 3000 broşür basabilmektedir. Aynı hızda çalışan matbaa 8 saatte kaç broşür basar?",
    secenekler: [
      { id: "A", text: "4500" },
      { id: "B", text: "4800" },
      { id: "C", text: "5000" },
      { id: "D", text: "5400" },
    ],
    dogru: "B",
    cozum:
      "Saatte 3000 ÷ 5 = 600 broşür basılır. 8 saatte 8 × 600 = 4800 broşür. Doğru cevap B'dir.",
    kaynak: "Vortex Orijinal",
  },
];

export default MATEMATIK;
