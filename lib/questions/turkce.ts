import type { Soru } from "../types";

const TURKCE: Soru[] = [
  {
    id: "tr-01",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 2,
    metin:
      "İnsan, çevresini gözlemlediği oranda kendini de tanır. Bir kentin sokaklarını arşınlarken gördüğümüz her detay, aslında zihnimizde yeni bir kapının açılmasına vesile olur. Kitap okumak da bu anlamda bir gözlem biçimidir: başkalarının hayatını okuyarak kendi hayatımıza dair ipuçları yakalarız.\n\nBu parçanın konusu aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Kentlerin tarihi gelişimi" },
      { id: "B", text: "Gözlemin insanı tanımadaki yeri" },
      { id: "C", text: "Kitapların basım süreçleri" },
      { id: "D", text: "İnsanların birbirini anlaması" },
    ],
    dogru: "B",
    cozum:
      "Paragrafın tamamı \"çevresini gözlemlediği oranda kendini tanır\" cümlesi etrafında kurulmuştur; kitaptan örnek verilmesi bunu destekler. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "tr-02",
    ders: "Turkce",
    konu: "Paragrafta Yapı",
    zorluk: 2,
    metin:
      "(I) Ülkemizde üretilen fındığın büyük bölümü ihraç edilmektedir. (II) Bu durum, üreticiyi doğrudan dünya piyasa fiyatlarına bağımlı kılmaktadır. (III) Fındık, Karadeniz Bölgesi'nin en önemli geçim kaynaklarındandır. (IV) Fiyatlardaki ani düşüşler, binlerce aileyi doğrudan etkilemektedir.\n\nBu parçadaki numaralı cümlelerden hangisi düşüncesin gelişmesini bozar?",
    secenekler: [
      { id: "A", text: "I" },
      { id: "B", text: "II" },
      { id: "C", text: "III" },
      { id: "D", text: "IV" },
    ],
    dogru: "C",
    cozum:
      "III. cümle genel bir bilgi verir ve \"bu durum\" bağıntısını keser; paragraf ihracat–bağımlılık–etki akışını sürdürüyor. Doğru cevap III'tür.",
    kaynak: "LGS 2025",
  },
  {
    id: "tr-03",
    ders: "Turkce",
    konu: "Anlatım Bozukluğu",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde anlatım bozukluğu vardır?",
    secenekler: [
      { id: "A", text: "Sınavda çıkabilecek soruları önceden tahmin etmeye çalıştı." },
      { id: "B", text: "Hem projeye katılmak hem de geziye gitmek istiyordu." },
      { id: "C", text: "Okulun bahçesindeki bütün öğrenciler törene katıldı." },
      { id: "D", text: "Gereken malzemeleri alarak hazırlıkları bitirmiştir." },
    ],
    dogru: "D",
    cozum:
      "\"Gereken\" kelimesi isim-fiil (mastar) ister; \"alarak\"-fiil eki fiile getirilmiştir. Doğrusu \"gereken malzemeleri alıp\" veya \"gerekenleri alarak\" olmalıdır. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-04",
    ders: "Turkce",
    konu: "Yazım Kuralları",
    zorluk: 1,
    metin: "Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?",
    secenekler: [
      { id: "A", text: "Yolun karşısına geçerken dikkatli ol." },
      { id: "B", text: "Sınav sonuçları Cuma günü açıklanacak." },
      { id: "C", text: "Bu sene tatile biraz erken çıkacağız." },
      { id: "D", text: "Yaz tatilini bu yıl ağustosta geçireceğiz." },
    ],
    dogru: "D",
    cozum:
      "Ay adları daima büyük harfle başlar: \"Ağustos\" → \"Ağustosta\". Ayrıca \"yaz tatili\" birleşik değil ayrı yazılır. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-05",
    ders: "Turkce",
    konu: "Cümlenin Ögeleri",
    zorluk: 2,
    metin:
      "\"Şehrin gürültüsünden uzakta, tek katlı küçük bir evde yaşıyordu.\" cümlesinde aşağıdakilerden hangisi yargı bildirir?",
    secenekler: [
      { id: "A", text: "tek katlı küçük bir evde" },
      { id: "B", text: "şehirin gürültüsünden uzakta" },
      { id: "C", text: "yaşıyordu" },
      { id: "D", text: "bir evde" },
    ],
    dogru: "C",
    cozum:
      "Yargıyı (eylemi) bildiren yüklem \"yaşıyordu\"dur; öteki öğeler tümleçtir. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-06",
    ders: "Turkce",
    konu: "Sözcükte Anlam",
    zorluk: 1,
    metin:
      "Aşağıdaki cümlelerin hangisinde \"ışık\" sözcüğü gerçek anlamda kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Öğretmenimizin sözleri bize ışık oldu." },
      { id: "B", text: "Deniz feneri geceleri denizcilere ışık tutuyor." },
      { id: "C", text: "Bu haber benim için bir ışık sayılır." },
      { id: "D", text: "Onun gelişi evimize ışık getirdi." },
    ],
    dogru: "B",
    cozum:
      "Gerçek anlam, sözcüğün algılanabilir fiziksel anlamıdadır: fenerin yaydığı aydınlatma. Doğru cevap B'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-07",
    ders: "Turkce",
    konu: "Sözcükte Anlam",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde \"yeşil\" sözcüğü mecaz anlamda kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Bahçedeki otlar iyice yeşermişti." },
      { id: "B", text: "Tepedeki çam ormanı yemyeşildi." },
      { id: "C", text: "İş hayatında daha yeni olduğum için beni yeşil buldular." },
      { id: "D", text: "Yeşil yapraklar rüzgârla dans ediyordu." },
    ],
    dogru: "C",
    cozum:
      "\"Yeşil\" burada tecrübesiz, acemi anlamında mecaz olarak kullanılmıştır. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-08",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 3,
    metin:
      "Bir dil öğrenmek, yalnızca kelimeleri ezberlemek değildir. O dili konuşan insanların nasıl düşündüğünü, neye güldüğünü ve neye üzüldüğünü anlamaya çalışmaktır. Bu çaba, kendi kültürümüze de daha dışarıdan bir gözle bakmamızı sağlar.\n\nBu parçadan çıkarılabilecek en doğru sonuç aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Dil öğrenimi, kendi kültürümüzü unutmamızı gerektirir." },
      { id: "B", text: "Yabancı dil bilmeden iyi bir okur olmak mümkün değildir." },
      { id: "C", text: "Dil öğrenimi, kültürel bir bakış kazandıran bir süreçtir." },
      { id: "D", text: "Kelime ezberi dil öğreniminin en zor aşamasıdır." },
    ],
    dogru: "C",
    cozum:
      "Parçanın mesajı, dil öğreniminin düşünce ve kültür boyutudur; en doğru sonuç C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "tr-09",
    ders: "Turkce",
    konu: "Yapı Bilgisi",
    zorluk: 2,
    metin:
      "\"Kitaplığındaki romanları tek tek okuyarak kendini geliştirmeye çalışıyordu.\" cümlesindeki isim-fiil hangisidir?",
    secenekler: [
      { id: "A", text: "kitaplığındaki" },
      { id: "B", text: "romanları" },
      { id: "C", text: "okuyarak" },
      { id: "D", text: "geliştirmeye" },
    ],
    dogru: "D",
    cozum:
      "\"geliştirmek\" fiilinden türeyen \"geliştirme\" isim-fiilinin belirli hâli \"geliştirmeye\" biçimindedir. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-10",
    ders: "Turkce",
    konu: "Gerçek - Mecaz - Terim",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde \"yol\" sözcüğü terim anlamda kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Yolun sonunda küçük bir köy vardı." },
      { id: "B", text: "Matematikte doğru yolu bulmak için çözüm önerilerini gözden geçirdik." },
      { id: "C", text: "Yol çalışması nedeniyle cadde trafiğe kapatıldı." },
      { id: "D", text: "Bir yolunu bulup ona yardım edeceğim." },
    ],
    dogru: "C",
    cozum:
      "Yol, şehircilik/ulaşım terimi olarak \"cadde ve sokakların tamamı\" anlamında kullanılmıştır. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-11",
    ders: "Turkce",
    konu: "Dil Bilgisi - Fiilimsi",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde sıfat-fiil (ortaç) kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Gelen herkes bize hediyeler getirmişti." },
      { id: "B", text: "Kitabı okuyan öğrenciler sınava girecek." },
      { id: "C", text: "Güneş doğar doğmaz yola çıktık." },
      { id: "D", text: "Onu görünce çok sevindim." },
    ],
    dogru: "B",
    cozum:
      "\"okuyan\" sıfat-fiil, \"öğrenciler\" ismini nitelemektedir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-12",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 2,
    metin:
      "Uyku, gün içinde zihinsel olarak tükettiğimiz kaynakları yeniden doldurur. Yeterince uyumayan bir öğrenci, ertesi gün öğrendiklerini hatırlamakta zorlanır. Bu nedenle sınav haftalarında uykuyu kısaltmak, çoğu zaman verimliliği artırmak yerine azaltır.\n\nBu parçanın vermek istediği mesaj aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Sınav haftalarında ders çalışmak gerekir." },
      { id: "B", text: "Uyku, öğrenmenin önünü açan bir süreçtir." },
      { id: "C", text: "Az uyuyan öğrenciler daha başarılıdır." },
      { id: "D", text: "Zihinsel kaynaklar sınırsızdır." },
    ],
    dogru: "B",
    cozum:
      "Paragraf, uykunun hafıza ve öğrenme üzerindeki destekleyici rolünü vurgular. Doğru cevap B'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-13",
    ders: "Turkce",
    konu: "Anlatım Türleri",
    zorluk: 1,
    metin:
      "\"Sabahın erken saatinde, serin havayı içime çekerek parkta koşmaya başladım.\" cümlesi aşağıdaki anlatım türlerinden hangisini gösterir?",
    secenekler: [
      { id: "A", text: "Açıklama" },
      { id: "B", text: "Ekşi" },
      { id: "C", text: "Betimleme" },
      { id: "D", text: "İkna" },
    ],
    dogru: "C",
    cozum:
      "Duyularla algılanan ortam ayrıntılarıyla anlatıldığı için betimlemedir. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-14",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 3,
    metin:
      "Bir toplumun geleceğini, o toplumun çocuklara verdiği değer belirler. Çocuklar yalnızca okulda değil, sokakta, kütüphanede, sporda da desteklenmelidir. Çünkü yetiştirdiğimiz her çocuk, yarının yetişkinidir.\n\nBu parçadaki düşünceyi aşağıdakilerden hangisi en iyi özetler?",
    secenekler: [
      { id: "A", text: "Çocukların eğitimi yalnızca okulun sorumluluğundadır." },
      { id: "B", text: "Toplumun geleceği, çocuklara gösterilen değere bağlıdır." },
      { id: "C", text: "Spor, çocukların gelişimi için gereksizdir." },
      { id: "D", text: "Kütüphaneler yalnızca yetişkinlere hizmet vermelidir." },
    ],
    dogru: "B",
    cozum:
      "Parçanın ana düşüncesi ilk cümlededir; sonraki cümleler bunu destekler. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "tr-15",
    ders: "Turkce",
    konu: "Noktalama İşaretleri",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde noktalama işareti yanlış kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Defterini, kalemini ve silgisini çantasına koy." },
      { id: "B", text: "Bugün: 15 Haziran, sınav günü." },
      { id: "C", text: "Hangi kitabı okudun - biliyor musun?" },
      { id: "D", text: "Bir, iki, üç... devam et." },
    ],
    dogru: "C",
    cozum:
      "Soru cümlesinin içinde bağlaç olarak \"mı\" kullanılırsa kesme işareti gerekir: \"Hangi kitabı okudun mu biliyor musun?\" Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-16",
    ders: "Turkce",
    konu: "Sözcükte Anlam",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde \"kapı\" sözcüğü mecaz anlamda kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Kapıyı çalmadan içeri girdi." },
      { id: "B", text: "Bu fırsat, onun için yeni bir kapı açtı." },
      { id: "C", text: "Kapının üstündeki anahtarı al." },
      { id: "D", text: "Komşular kapı önüne sandalye bırakmış." },
    ],
    dogru: "B",
    cozum:
      "Kapı, burada \"fırsat, imkân\" anlamında mecaz olarak kullanılmıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-17",
    ders: "Turkce",
    konu: "Paragrafta Yapı",
    zorluk: 2,
    metin:
      "Mustafa Kemal, Samsun'a çıktığında elinde somut bir kuvvet yoktu. Ancak halkın desteğini kazanarak Millî Mücadele'nin temellerini attı. Bir milletin kendi kaderini eline alabileceğini tüm dünyaya gösterdi.\n\nBu parçanın giriş cümlesi aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Bir milletin kendi kaderini eline alabileceğini tüm dünyaya gösterdi." },
      { id: "B", text: "Ancak halkın desteğini kazanarak Millî Mücadele'nin temellerini attı." },
      { id: "C", text: "Mustafa Kemal, Samsun'a çıktığında elinde somut bir kuvvet yoktu." },
      { id: "D", text: "Her iki cümle de giriş cümlesi sayılabilir." },
    ],
    dogru: "C",
    cozum:
      "Konu ilk cümlede tanıtıldığı için giriş cümlesi C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-18",
    ders: "Turkce",
    konu: "Yazım Kuralları",
    zorluk: 2,
    metin: "Aşağıdakilerin hangisinde yazım yanlışı vardır?",
    secenekler: [
      { id: "A", text: "Öğrenciler teneffüste bahçede top oynadı." },
      { id: "B", text: "Bu haberi dün akşam televizyondan izledim." },
      { id: "C", text: "Senin ki de benimki kadar temiz olmalı." },
      { id: "D", text: "Rehberlik servisine başvurmanızı öneririm." },
    ],
    dogru: "C",
    cozum:
      "\"Senin ki\" bileşimi bitişik yazılır: \"Seninki\". Niteleme sıfatı olan \"senin\" ile zamir olan \"ki\" birleşince ayrılmaz. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-19",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 2,
    metin:
      "Bir şehrin kimliğini, en çok o şehrin meydanları yansıtır. Meydanlar; insanların buluştuğu, konuştuğu, bazen tartıştığı ortak alanlardır. Tarih boyunca da meydanlar, toplumsal hafızanın canlı tanıkları olmuştur.\n\nBu parçada meydanlar için aşağıdakilerden hangisi söylenebilir?",
    secenekler: [
      { id: "A", text: "Trafik yoğunluğunun yaşandığı alanlar" },
      { id: "B", text: "Ortak yaşamın ve toplumsal hafızanın mekânları" },
      { id: "C", text: "Yalnızca turistlere hizmet veren yerler" },
      { id: "D", text: "Şehir planlamasında göz ardı edilen alanlar" },
    ],
    dogru: "B",
    cozum:
      "Paragrafın tamamı meydanların ortak yaşam ve hafıza ile ilişkisini anlatır. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "tr-20",
    ders: "Turkce",
    konu: "Anlatım Bozukluğu",
    zorluk: 3,
    metin:
      "Aşağıdaki cümlelerin hangisinde ses bilgisi kuralına (ünsüz benzeşmesine) aykırılık vardır?",
    secenekler: [
      { id: "A", text: "Okulun bahçesindeki bütün ağaçlar dikildi." },
      { id: "B", text: "Ödevimi bitirdikten sonra kitap okuyacağım." },
      { id: "C", text: "Arkadaşlarımla birlikte kütüphaneye gittik." },
      { id: "D", text: "Yurtumuzda kalan öğrenciler için yemekhane açıldı." },
    ],
    dogru: "D",
    cozum:
      "\"Yurt\" sözcüğü ünlüyle başlayan ek alırken son ünlüsü yumuşar: yurt → yurdu → yurdumuz. \"Yurtumuzda\" değil, <b>yurdumuzda</b> yazılır. Doğru cevap D'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-21",
    ders: "Turkce",
    konu: "Cümlenin Ögeleri",
    zorluk: 2,
    metin:
      "\"Kütüphanedeki bütün kaynakları iki günde bitirdi.\" cümlesinde nesne aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "kütüphanedeki" },
      { id: "B", text: "bütün kaynakları" },
      { id: "C", text: "iki günde" },
      { id: "D", text: "bitirdi" },
    ],
    dogru: "B",
    cozum:
      "Yüklemi nesnel alan \"bütün kaynakları\"dır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-22",
    ders: "Turkce",
    konu: "Anlatım Türleri",
    zorluk: 2,
    metin:
      "\"Bu uygulamayı mutlaka denemelisiniz; çünkü hem ücretsiz hem de son derece pratik.\" cümlesinde aşağıdakilerden hangisi ağır basar?",
    secenekler: [
      { id: "A", text: "Öyküleme" },
      { id: "B", text: "Tartışma" },
      { id: "C", text: "İkna (günlük hayatta konuşma dili)" },
      { id: "D", text: "Betimleme" },
    ],
    dogru: "C",
    cozum:
      "Okuyucuyu bir davranışa yöneltmek için kanıt sunulmuş; ikna edici anlatım vardır. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-23",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 3,
    metin:
      "Şiir, okurunu acele ettirmez. Dizeler arasında açılan boşluklar, okurun kendi düşüncesini yerleştirebileceği bir alandır. Bu yüzden şiir okumak, pasif bir dinleme değil etkin bir ortaklık biçimidir.\n\nBu parçada şiirin özelliği olarak vurgulanan nedir?",
    secenekler: [
      { id: "A", text: "Dizelerin kısa olması" },
      { id: "B", text: "Okurla birlikte anlam üretmesi" },
      { id: "C", text: "Kafiye kurallarına uyması" },
      { id: "D", text: "Sade bir dille yazılması" },
    ],
    dogru: "B",
    cozum:
      "Boşlukların okura alan tanıması, \"ortaklık\" vurgusunu destekler. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "tr-24",
    ders: "Turkce",
    konu: "Sözcükte Anlam",
    zorluk: 1,
    metin:
      "Aşağıdaki cümlelerin hangisinde \"göz\" sözcüğü gerçek anlamda kullanılmıştır?",
    secenekler: [
      { id: "A", text: "Gözlerini hiç kırpmadan dinledi." },
      { id: "B", text: "Bu işi gözü kapalı yapar." },
      { id: "C", text: "Göz bebeği büyüdüğünde ışık azalır." },
      { id: "D", text: "İkimizin de aynı noktaya gözü düştü." },
    ],
    dogru: "C",
    cozum:
      "Göz bebeği, gözün fizyolojik bir parçasıdır; gerçek anlamdadır. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-25",
    ders: "Turkce",
    konu: "Noktalama İşaretleri",
    zorluk: 2,
    metin:
      "\"Eğer çalışırsan...... sonuca ulaşabilirsin.\" cümlesinde noktalama işareti olarak aşağıdakilerden hangisi getirilmelidir?",
    secenekler: [
      { id: "A", text: "virgül" },
      { id: "B", text: "nokta" },
      { id: "C", text: "iki nokta" },
      { id: "D", text: "tire" },
    ],
    dogru: "A",
    cozum:
      "\"Eğer\" ile kurulan koşul cümlesinden sonra virgül kullanılır. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-26",
    ders: "Turkce",
    konu: "Paragrafta Yapı",
    zorluk: 2,
    metin:
      "Bir botanik bahçesinde yüzlerce bitki türü yan yana durur. Bunlardan bazıları günlük su ister, bazıları hiç su istemez. Aynı şekilde bazıları güneşte bazıları gölgede gelişir. Bu yüzden bitki yetiştirmek, bir tür planlama işidir.\n\nBu parçanın akışına göre son cümlede verilen sonuç aşağıdakilerden hangisine dayanır?",
    secenekler: [
      { id: "A", text: "Bitkilerin farklı ihtiyaç duymasına" },
      { id: "B", text: "Bahçenin çok geniş olmasına" },
      { id: "C", text: "Bitkilerin pahalı olmasına" },
      { id: "D", text: "Ziyaretçi sayısının azlığına" },
    ],
    dogru: "A",
    cozum:
      "Sonuç cümlesi, önceki farklılık betimlemesinin doğal devamıdır. Doğru cevap A'dır.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-27",
    ders: "Turkce",
    konu: "Anlatım Bozukluğu",
    zorluk: 2,
    metin:
      "Aşağıdaki cümlelerin hangisinde \"kadar\" sözcüğünün kullanımı yanlışmıştır?",
    secenekler: [
      { id: "A", text: "Bu kitabı bir oturuşta okuyabilecek kadar hızlı okur." },
      { id: "B", text: "Yorgunluktan ayakta duracak hâli kalmamıştı." },
      { id: "C", text: "Sınav sonucunu görene kadar hiç konuşmadı." },
      { id: "D", text: "Bütün bunları bana söyleyecek kadar cesaret topladı." },
    ],
    dogru: "B",
    cozum:
      "\"Kadar\" olumsuz yapılarda \"hâl\" anlamındaki sözcüğün üzerine gelir: \"ayakta duracak hâli kalmamıştı\" yerine \"ayakta duracak kadar yorgundu\" ya da \"ayakta duracak hâli yoktu\" olmalıdır. Doğru cevap B'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-28",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 2,
    metin:
      "Bir kütüphane yalnızca kitapların saklandığı yer değildir. İnsanların sessizce düşünebildiği, kendisiyle baş başa kalabildiği bir sığınaktır da. Bu nedenle kütüphanelerin sayısı arttıkça toplumun okuma alışkanlığı da güçlenir.\n\nBu parçada aşağıdakilerden hangisi savunulmaktadır?",
    secenekler: [
      { id: "A", text: "Kütüphanelerde sesli konuşulmalıdır." },
      { id: "B", text: "Kitaplar yalnızca okullarda bulunmalıdır." },
      { id: "C", text: "Kütüphaneler, okuma kültürünü besleyen mekânlardır." },
      { id: "D", text: "Kütüphanelerde internet kullanılmamalıdır." },
    ],
    dogru: "C",
    cozum:
      "Parçanın savunduğu temel düşünce kütüphanenin okuma kültüründeki rolüdür. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "tr-29",
    ders: "Turkce",
    konu: "Yapı Bilgisi",
    zorluk: 3,
    metin:
      "\"Çocukluğumdan beri hep deniz kenarında yaşamak istemişimdir.\" cümlesindeki \"istemişimdir\" fiilinde kaç farklı yapı bir arada bulunmaktadır?",
    secenekler: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "4" },
    ],
    dogru: "C",
    cozum:
      "\"iste-miş-im-dir\": kök \"iste\", birleşik fiil \"miş\", yargı bildiren ek \"im\", geniş zaman eki \"dir\". Üç yapı vardır. Doğru cevap C'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "tr-30",
    ders: "Turkce",
    konu: "Paragrafta Anlam",
    zorluk: 3,
    metin:
      "Alışkanlıklar, her gün tekrar edilen küçük kararların birikimidir. Bir günde değişmeyebilirler; ancak otuz gün boyunca yapılan küçük bir iyileşme, sonunda kişinin davranış yapısını dönüştürebilir. Bu yüzden büyük hedefler yerine günlük küçük adımlar belirlemek daha kalıcıdır.\n\nBu parçadan hareketle aşağıdakilerden hangisi söylenebilir?",
    secenekler: [
      { id: "A", text: "Alışkanlıklar, kısa sürede tamamen değişebilir." },
      { id: "B", text: "Büyük hedefler koymak her zaman daha etkilidir." },
      { id: "C", text: "Kalıcı değişim, küçük ve düzenli adımlarla mümkündür." },
      { id: "D", text: "Alışkanlıkların hiçbiri değiştirilemez." },
    ],
    dogru: "C",
    cozum:
      "Parçanın ana düşüncesi günlük küçük adımların dönüştürücü gücüdür. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
];

export default TURKCE;
