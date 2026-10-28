import type { Soru } from "../types";

const FEN: Soru[] = [
  {
    id: "fn-01",
    ders: "Fen",
    konu: "Genetik",
    zorluk: 1,
    metin:
      "Şekilde, kendini eşlemeye başlayan bir DNA molekülünün bir kısmı modellenmiştir.\n\nBuna göre DNA'nın tamamı eşlendiğinde oluşan molekül hangi yapıda olur?",
    sekil: "dna",
    secenekler: [
      { id: "A", text: "Tek sarmallı" },
      { id: "B", text: "Çift sarmallı" },
      { id: "C", text: "Üç sarmallı" },
      { id: "D", text: "Halka biçimli" },
    ],
    dogru: "B",
    cozum:
      "DNA, birbirine zıt yönde sarmallanmış iki nükleotid zincirinden oluşur; tam eşlemede çift sarmallı yapı korunur. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-02",
    ders: "Fen",
    konu: "Hücre",
    zorluk: 1,
    metin:
      "Şekildeki hücrede, zararlı maddelerin hücre içine girmesini ve çıkmasını kontrol eden yapı hangisidir?",
    sekil: "hucre",
    secenekler: [
      { id: "A", text: "Çekirdek" },
      { id: "B", text: "Sitoplazma" },
      { id: "C", text: "Hücre zarı" },
      { id: "D", text: "Mitokondri" },
    ],
    dogru: "C",
    cozum:
      "Hücre zarı, seçici geçirgen yapısıyla madde geçişini kontrol eder. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-03",
    ders: "Fen",
    konu: "Elektrik ve Manyetizma",
    zorluk: 3,
    metin:
      "Şekildeki devrede pilin gerilimi 6 V, R₁ direnci 10 Ω ve R₂ direnci 20 Ω'dur.\n\nBuna göre ampermetrede okunan akım kaç amperdir?",
    sekil: "devre",
    secenekler: [
      { id: "A", text: "0,1" },
      { id: "B", text: "0,2" },
      { id: "C", text: "0,3" },
      { id: "D", text: "0,6" },
    ],
    dogru: "B",
    cozum:
      "Dirençler seri bağlıdır: R = 10 + 20 = 30 Ω. Ohm yasasından I = V / R = 6 / 30 = 0,2 A. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-04",
    ders: "Fen",
    konu: "Dünya Bilimleri",
    zorluk: 1,
    metin:
      "Şekilde Dünyanın katmanları modellenmiştir.\n\nBuna göre Dünyanın en kalın katmanı aşağıdakilerden hangisidir?",
    sekil: "katman-kesit",
    secenekler: [
      { id: "A", text: "Kabuk" },
      { id: "B", text: "Manto" },
      { id: "C", text: "Çekirdek" },
      { id: "D", text: "Litosfer" },
    ],
    dogru: "B",
    cozum:
      "Yer kabuğu ince bir tabaka iken manto, kalınlığı yaklaşık 2900 km olan en geniş katmandır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-05",
    ders: "Fen",
    konu: "Dünya Bilimleri",
    zorluk: 2,
    metin:
      "Şekilde küre üzerinde ekvator, 30° Kuzey ve 30° Güney paralelleri işaretlenmiştir.\n\nBuna göre 30° Kuzey paraleli ile ekvator arasındaki açısal uzaklık kaç derecedir?",
    sekil: "kuresel",
    secenekler: [
      { id: "A", text: "15" },
      { id: "B", text: "30" },
      { id: "C", text: "45" },
      { id: "D", text: "60" },
    ],
    dogru: "B",
    cozum:
      "Paraleller arasındaki açısal uzaklık, derece değerlerinin farkıdır: 30° − 0° = 30°. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-06",
    ders: "Fen",
    konu: "Uzay ve Teknoloji",
    zorluk: 2,
    metin:
      "Şekilde, Ay'ın Dünya'nın oluşturduğu gölge konisine girmesi modellenmiştir.\n\nBuna göre bu konumda gözlemlenen gök olayı aşağıdakilerden hangisidir?",
    sekil: "kutup-koniler",
    secenekler: [
      { id: "A", text: "Güneş tutulması" },
      { id: "B", text: "Yeni Ay evresi" },
      { id: "C", text: "Tam Ay tutulması" },
      { id: "D", text: "Halkalı Ay tutulması" },
    ],
    dogru: "C",
    cozum:
      "Ay'ın tümünün gölge konisine girmesi hâlinde tam Ay tutulması oluşur. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-07",
    ders: "Fen",
    konu: "Deney ve Bilimsel Süreç",
    zorluk: 3,
    metin:
      "Bir öğrenci, aynı ortamda yetiştirilen üç farklı tohumun boylarını ölçmüştür (Şekil I-III).\n\nÖğrencinin bu sonuçlara ulaşmasında en büyük etken aşağıdakilerden hangisidir?",
    sekil: "bitki-bicim",
    secenekler: [
      { id: "A", text: "Bitkilerin farklı boylarda ölçülmesi" },
      { id: "B", text: "Deneyde kontrol edilmesi gereken başka değişkenlerin olması" },
      { id: "C", text: "Ortamdaki sıcaklığın değişmemesi" },
      { id: "D", text: "Ölçüm biriminin santimetre olması" },
    ],
    dogru: "B",
    cozum:
      "Farklı boyların nedeni ancak kontrollü deneyle aydınlanabilir; ışık, su gibi değişkenler kontrol edilmediğinde sonuç yorumlanamaz. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-08",
    ders: "Fen",
    konu: "Kuvvet ve Hareket",
    zorluk: 2,
    metin:
      "Sürtünmesiz bir zeminde sabit hızla hareket eden bir cisme etki eden net kuvvet kaç newton'dur?",
    secenekler: [
      { id: "A", text: "Sıfır" },
      { id: "B", text: "Hareket yönünde pozitif" },
      { id: "C", text: "Hareket yönünde negatif" },
      { id: "D", text: "Değeri hızla orantılı" },
    ],
    dogru: "A",
    cozum:
      "Sabit hız, ivmenin sıfır olması demektir. Newton'un II. yasasına göre net kuvvet de sıfırdır. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-09",
    ders: "Fen",
    konu: "Isı ve Sıcaklık",
    zorluk: 2,
    metin:
      "1 kg suyun sıcaklığını 10 °C'den 20 °C'ye çıkarmak için gereken ısı kaç kcal'dir? (suyun öz ısı 1 kcal/kg·°C)",
    secenekler: [
      { id: "A", text: "5" },
      { id: "B", text: "10" },
      { id: "C", text: "20" },
      { id: "D", text: "100" },
    ],
    dogru: "B",
    cozum:
      "Q = m · c · ΔT = 1 × 1 × (20 − 10) = 10 kcal. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-10",
    ders: "Fen",
    konu: "Madde ve Özellikleri",
    zorluk: 1,
    metin:
      "Bir katı maddenin ısı alarak sıvı hâle dönüşmesine ne ad verilir?",
    secenekler: [
      { id: "A", text: "Donma" },
      { id: "B", text: "Erime" },
      { id: "C", text: "Yoğuşma" },
      { id: "D", text: "Buharlaşma" },
    ],
    dogru: "B",
    cozum:
      "Katının ısı alarak sıvıya dönüşmesi erime, sıvının ısı alarak gaza dönüşmesi buharlaşmadır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-11",
    ders: "Fen",
    konu: "Asitler, Bazlar ve pH",
    zorluk: 2,
    metin:
      "Bir maddenin su çözeltisinin pH değeri 3'ten 5'e yükselmiştir.\n\nBuna göre maddenin asitliği nasıl değişmiştir?",
    secenekler: [
      { id: "A", text: "Artmıştır" },
      { id: "B", text: "Azalmıştır" },
      { id: "C", text: "Değişmemiştir" },
      { id: "D", text: "Önce artmış sonra azalmıştır" },
    ],
    dogru: "B",
    cozum:
      "pH değeri küçüldükçe asitlik artar, büyüdükçe azalır. 3'ten 5'e yükseliş asitliğin azaldığını gösterir. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-12",
    ders: "Fen",
    konu: "Ekosistem",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi bir besin zincirinde üretici konumundadır?",
    secenekler: [
      { id: "A", text: "Kurt" },
      { id: "B", text: "Tavşan" },
      { id: "C", text: "Çim" },
      { id: "D", text: "Baykuş" },
    ],
    dogru: "C",
    cozum:
      "Üreticiler, ışık enerjisini kimyasal enerjiye çeviren bitkilerdir. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-13",
    ders: "Fen",
    konu: "Enerji Dönüşümleri",
    zorluk: 2,
    metin:
      "Bir el fenerindeki enerji dönüşümü sırasıyla aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Isı → ışık → elektrik" },
      { id: "B", text: "Kimyasal → elektrik → ışık" },
      { id: "C", text: "Mekanik → kimyasal → ısı" },
      { id: "D", text: "Işık → elektrik → kimyasal" },
    ],
    dogru: "B",
    cozum:
      "Pilde depolanan kimyasal enerji elektrik enerjisine, ampulde de ışık (ve bir miktar ısı) enerjisine dönüşür. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-14",
    ders: "Fen",
    konu: "Kuvvet ve Basınç",
    zorluk: 2,
    metin:
      "Bir yüzeye uygulanan kuvvet sabitken yüzeyin alanı iki katına çıkarılırsa basınç nasıl değişir?",
    secenekler: [
      { id: "A", text: "İki katına çıkar" },
      { id: "B", text: "Yarıya iner" },
      { id: "C", text: "Değişmez" },
      { id: "D", text: "Dört katına çıkar" },
    ],
    dogru: "B",
    cozum:
      "Basınç = Kuvvet / Yüzey Alanı. Alan iki katına çıkarsa basınç yarıya iner. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-15",
    ders: "Fen",
    konu: "Sesin Yayılması",
    zorluk: 2,
    metin:
      "Sesin boşlukta yayılabilmesi için aşağıdakilerden hangisi gereklidir?",
    secenekler: [
      { id: "A", text: "Hava akımı" },
      { id: "B", text: "Bir ortam (katı, sıvı ya da gaz)" },
      { id: "C", text: "Isı farkı" },
      { id: "D", text: "Manyetik alan" },
    ],
    dogru: "B",
    cozum:
      "Ses, titreşen cisimlerin ortamdaki tanecikleriyle yayılır; tam boşlukta yayılmaz. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-16",
    ders: "Fen",
    konu: "Optik",
    zorluk: 2,
    metin:
      "Düz bir aynada oluşan görüntü için aşağıdakilerden hangisi söylenebilir?",
    secenekler: [
      { id: "A", text: "Dik ve gerçek" },
      { id: "B", text: "Ters ve gerçek" },
      { id: "C", text: "Dik ve sanal" },
      { id: "D", text: "Ters ve sanal" },
    ],
    dogru: "C",
    cozum:
      "Düz aynada görüntü diktir, gerçek cisimle eşit boyuttadır ve arkada sanal olarak oluşur. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-17",
    ders: "Fen",
    konu: "Manyetizma",
    zorluk: 1,
    metin:
      "Serbestçe asılabilen manyetik bir iğnenin kuzey ucu hangi yöne yönelir?",
    secenekler: [
      { id: "A", text: "Coğrafi kuzeye" },
      { id: "B", text: "Manyetik kuzeye" },
      { id: "C", text: "Doğuya" },
      { id: "D", text: "Batıya" },
    ],
    dogru: "B",
    cozum:
      "Manyetik iğnenin kuzey ucu, Dünyanın manyetik kuzey kutbuna yönelir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-18",
    ders: "Fen",
    konu: "Madde Değişimleri",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi kimyasal değişime örnektir?",
    secenekler: [
      { id: "A", text: "Buzun erimesi" },
      { id: "B", text: "Demirin paslanması" },
      { id: "C", text: "Suyun buharlaşması" },
      { id: "D", text: "Camın kırılması" },
    ],
    dogru: "B",
    cozum:
      "Paslanmada yeni maddeler (demir oksit) oluşur; öteki örnekler fiziksel değişimdir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-19",
    ders: "Fen",
    konu: "Canlılar",
    zorluk: 1,
    metin:
      "Aşağıdaki canlılardan hangisinin hücre yapısında çekirdek bulunur?",
    secenekler: [
      { id: "A", text: "Bakteri" },
      { id: "B", text: "Virüs" },
      { id: "C", text: "İnsan" },
      { id: "D", text: "Mavi-yeşil alg" },
    ],
    dogru: "C",
    cozum:
      "İnsan hücreleri gerçek çekirdekli (eukaryot) hücrelerdir; bakteri ve mavi-yeşil algler çekirdeksizdir. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-20",
    ders: "Fen",
    konu: "Fotosentez",
    zorluk: 2,
    metin:
      "Bitkilerin fotosentez sonucu ortama saldığı gaz aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Karbon dioksit" },
      { id: "B", text: "Azot" },
      { id: "C", text: "Oksijen" },
      { id: "D", text: "Su buharı" },
    ],
    dogru: "C",
    cozum:
      "Fotosentezde CO₂ ve su kullanılarak glikoz üretilir ve oksijen açığa çıkar. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-21",
    ders: "Fen",
    konu: "Solunum",
    zorluk: 2,
    metin:
      "Hayvan hücrelerinde enerjinin büyük kısmının üretildiği yapı hangisidir?",
    secenekler: [
      { id: "A", text: "Ribozom" },
      { id: "B", text: "Mitokondri" },
      { id: "C", text: "Lizozom" },
      { id: "D", text: "Çekirdekçik" },
    ],
    dogru: "B",
    cozum:
      "Solunum olayının büyük bölümü mitokondride gerçekleşir ve burada ATP üretilir. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-22",
    ders: "Fen",
    konu: "Su Döngüsü",
    zorluk: 1,
    metin:
      "Yüzey sularının ısı alarak gaz hâline geçmesine ne ad verilir?",
    secenekler: [
      { id: "A", text: "Yoğuşma" },
      { id: "B", text: "Buharlaşma" },
      { id: "C", text: "Kaynama" },
      { id: "D", text: "Donma" },
    ],
    dogru: "B",
    cozum:
      "Suyun yüzeyden ısı alarak gaz hâline geçmesi buharlaşmadır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-23",
    ders: "Fen",
    konu: "Dünya Bilimleri",
    zorluk: 2,
    metin:
      "Gece ile gündüzün oluşmasına neden olan Dünya hareketi aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Günlük hareket" },
      { id: "B", text: "Yıllık hareket" },
      { id: "C", text: "Eksen eğikliği" },
      { id: "D", text: "Dolanma hareketi" },
    ],
    dogru: "A",
    cozum:
      "Dünyanın eksen etrafındaki dönüşü (günlük hareket) gece ve gündüzü oluşturur. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-24",
    ders: "Fen",
    konu: "Deprem ve Volkanizma",
    zorluk: 2,
    metin:
      "Deprem dalgalarından yer kabuğunda en hızlı yayılan dalga türü aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "S dalgası" },
      { id: "B", text: "Yüzey dalgası" },
      { id: "C", text: "L dalgası" },
      { id: "D", text: "P dalgası" },
    ],
    dogru: "D",
    cozum:
      "Boyutuna göre yayılan P (birincil) dalgası en hızlı dalgadır ve sarsıntıyı ilk hissettirir. Doğru cevap D'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-25",
    ders: "Fen",
    konu: "Kuvvet ve Hareket",
    zorluk: 2,
    metin:
      "Bir cismin hareket yönünün tersine etkiyen sürtünme kuvveti, cismin hızını nasıl etkiler?",
    secenekler: [
      { id: "A", text: "Hızlandırır" },
      { id: "B", text: "Yavaşlatır" },
      { id: "C", text: "Değiştirmez" },
      { id: "D", text: "Yönüne etki eder" },
    ],
    dogru: "B",
    cozum:
      "Sürtünme kuvveti daima hareket yönünün tersindedir ve cismin hızını azaltır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-26",
    ders: "Fen",
    konu: "Hücre Bölünmeleri",
    zorluk: 3,
    metin:
      "Mayoz bölünme sonucunda oluşan yeni hücre sayısı ve kromozom sayısı sırasıyla kaçtır?",
    secenekler: [
      { id: "A", text: "2 hücre, diploid" },
      { id: "B", text: "4 hücre, haploid" },
      { id: "C", text: "4 hücre, diploid" },
      { id: "D", text: "2 hücre, haploid" },
    ],
    dogru: "B",
    cozum:
      "Mayoz iki bölünme geçirir; sonunda 4 tane ve kromozom sayısı yarıya inmiş (haploid) hücre oluşur. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-27",
    ders: "Fen",
    konu: "Genetik",
    zorluk: 2,
    metin:
      "İnsanın vücut hücrelerinde 46 kromozom bulunduğuna göre üreme hücrelerinde kaç kromozom bulunur?",
    secenekler: [
      { id: "A", text: "23" },
      { id: "B", text: "46" },
      { id: "C", text: "92" },
      { id: "D", text: "12" },
    ],
    dogru: "A",
    cozum:
      "Üreme hücreleri mayozla oluşur ve kromozom sayısı yarıya iner: 46 ÷ 2 = 23. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-28",
    ders: "Fen",
    konu: "Madde ve Özellikleri",
    zorluk: 3,
    metin:
      "Katı bir maddenin ısı almadan doğrudan gaz hâline geçmesine ne ad verilir?",
    secenekler: [
      { id: "A", text: "Sublimasyon (süblimleşme)" },
      { id: "B", text: "Yoğuşma" },
      { id: "C", text: "Erime" },
      { id: "D", text: "Kaynama" },
    ],
    dogru: "A",
    cozum:
      "Katıdan sıvı hâline geçmeden doğrudan gaza geçişe süblimleşme denir (örnek: buz karbonu). Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "fn-29",
    ders: "Fen",
    konu: "Basınç",
    zorluk: 2,
    metin:
      "Aşağıdaki durumların hangisinde bir cismin üzerine uygulanan basınç en azdır? (Kuvvetler eşittir.)",
    secenekler: [
      { id: "A", text: "Defterin geniş yüzeyi masaya konulduğunda" },
      { id: "B", text: "Defterin ince kenarı masaya konulduğunda" },
      { id: "C", text: "Defter tek ayağa konulduğunda" },
      { id: "D", text: "Defter masaya dik konulduğunda" },
    ],
    dogru: "A",
    cozum:
      "Aynı kuvvet için temas alanı büyüdükçe basınç azalır. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "fn-30",
    ders: "Fen",
    konu: "Ekosistem",
    zorluk: 3,
    metin:
      "Bir ekosistemin sürdürülebilirliği için aşağıdakilerden hangisinin sağlanması en temel koşuldur?",
    secenekler: [
      { id: "A", text: "Üretici popülasyonunun korunması" },
      { id: "B", text: "Avcı sayısının artırılması" },
      { id: "C", text: "Atık miktarının artırılması" },
      { id: "D", text: "Su sıcaklığının sabit tutulması" },
    ],
    dogru: "A",
    cozum:
      "Enerjinin sisteme girişi üreticilerle olur; üreticiler yok olursa tüm besin zinciri çöker. Doğru cevap A'dır.",
    kaynak: "EGA Özgün",
  },
];

export default FEN;
