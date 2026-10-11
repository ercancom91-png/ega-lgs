import type { Soru } from "../types";

const INKILAP: Soru[] = [
  {
    id: "nk-01",
    ders: "Inkilap",
    konu: "I. Dünya Savaşı ve Cepheler",
    zorluk: 2,
    metin:
      "Kahramanmaraş'ın düşman işgalinden temizlenmesinde etkili olan ve \"Maraşlılar Türk'tür, Arap değildir.\" sözüyle anılan komutan kimdir?",
    secenekler: [
      { id: "A", text: "Mustafa Kemal Paşa" },
      { id: "B", text: "Şerif Paşa" },
      { id: "C", text: "Kâzım Karabekir" },
      { id: "D", text: "Şefik (Aydın) Paşa" },
    ],
    dogru: "D",
    cozum:
      "Maraş savunmasının başındaki komutan Şefik (Aydın) Paşa'dır. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-02",
    ders: "Inkilap",
    konu: "Millî Mücadele Örgütlenmesi",
    zorluk: 2,
    metin:
      "Kongrelerin ilki ve Amasya Genelgesi'nin amacı aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Saltanatı kaldırmak" },
      { id: "B", text: "Millî iradeyi ortaya koymak ve Mondros'un şartlarını reddetmek" },
      { id: "C", text: "Cumhuriyeti ilan etmek" },
      { id: "D", text: "Misak-ı Millî'yi kabul etmek" },
    ],
    dogru: "B",
    cozum:
      "Amasya Genelgesi, milletin iradesini esas alacağını ve Mondros maddelerinin kabul edilmeyeceğini ilan eden ilk belgedir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-03",
    ders: "Inkilap",
    konu: "Millî Mücadele Cepheleri",
    zorluk: 2,
    metin:
      "I. İnönü Savaşı'nın sonucu olarak aşağıdakilerden hangisi söylenebilir?",
    secenekler: [
      { id: "A", text: "Yunan ordusu İstanbul'a ulaşmıştır." },
      { id: "B", text: "İtilaf Devletleri ateşkes görüşmelerine başlamıştır." },
      { id: "C", text: "Mustafa Kemal Paşa general olmuştur." },
      { id: "D", text: "Lozan Antlaşması imzalanmıştır." },
    ],
    dogru: "B",
    cozum:
      "I. İnönü zaferi, Türk ordusunun düzenli ordu olarak kazandığı ilk başarıdır ve İtilaf Devletleri'ni ateşkes isteğine yöneltmiştir. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "nk-04",
    ders: "Inkilap",
    konu: "Atatürkçülük",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi Atatürk'ün \"Hayatta en hakiki mürşit ilimdir.\" sözüyle vurgulanan ilke ile ilişkilendirilebilir?",
    secenekler: [
      { id: "A", text: "Laiklik" },
      { id: "B", text: "Devletçilik" },
      { id: "C", text: "İnkılâpçılık" },
      { id: "D", text: "Milliyetçilik" },
    ],
    dogru: "A",
    cozum:
      "Din ve devlet işlerinin ayrılması, eğitim-öğretimin laik esaslara göre düzenlenmesi anlamındaki laiklik ilkesi bu sözle ilişkilidir. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-05",
    ders: "Inkilap",
    konu: "İnkılâplar",
    zorluk: 1,
    metin:
      "Cumhuriyet döneminde harf inkılâbının en önemli nedeni aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Arap alfabesinin estetik olması" },
      { id: "B", text: "Yazıyı günlük hayatın gerektirdiği hız ve kolaylığa kavuşturmak" },
      { id: "C", text: "Yabancı dillerin etkisinden kaçınmak" },
      { id: "D", text: "Matbaacılığı geliştirmek" },
    ],
    dogru: "B",
    cozum:
      "Arap alfabesinin Türkçe seslere uygun olmaması ve okuma-yazmayı zorlaştırması, yeni harflerin benimsenmesinin temel nedenidir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-06",
    ders: "Inkilap",
    konu: "Misak-ı Millî",
    zorluk: 3,
    metin:
      "Misak-ı Millî kararlarının kabul edildiği meclis aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Sivas Kongresi" },
      { id: "B", text: "TBMM I. Dönem" },
      { id: "C", text: "Son Osmanlı Mebusan Meclisi" },
      { id: "D", text: "II. TBMM" },
    ],
    dogru: "C",
    cozum:
      "Misak-ı Millî, son Osmanlı Mebusan Meclisi tarafından 28 Ocak 1920'de kabul edilmiştir. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "nk-07",
    ders: "Inkilap",
    konu: "İtilaf Devletlerinin Politikaları",
    zorluk: 2,
    metin:
      "Mondros Ateşkes Antlaşması'nın 7. maddesi aşağıdakilerden hangisine olanak tanıyordu?",
    secenekler: [
      { id: "A", text: "İstanbul'un boşaltılması" },
      { id: "B", text: "İtilaf Devletlerinin diledikleri bölgede karışıklık çıkması hâlinde bir noktayı işgal etmeleri" },
      { id: "C", text: "Ordunun silahsızlandırılması" },
      { id: "D", text: "Boğazların açılması" },
    ],
    dogru: "B",
    cozum:
      "7. madde, düşman devletlere huzursuzluk gerekçesiyle Anadolu'nun herhangi bir noktasını işgal yetkisi vermiştir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-08",
    ders: "Inkilap",
    konu: "Kurtuluş Savaşı Sonuçları",
    zorluk: 2,
    metin:
      "Ankara Antlaşması, aşağıdakilerden hangisi arasında imzalanmıştır?",
    secenekler: [
      { id: "A", text: "TBMM Hükûmeti ile Fransa" },
      { id: "B", text: "TBMM Hükûmeti ile İtalya" },
      { id: "C", text: "TBMM Hükûmeti ile Ermenistan" },
      { id: "D", text: "TBMM Hükûmeti ile İngiltere" },
    ],
    dogru: "A",
    cozum:
      "20 Ekim 1921'de Fransa ile imzalanan Ankara Antlaşması, Güney cephesini kapatmıştır. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-09",
    ders: "Inkilap",
    konu: "İnkılâplar",
    zorluk: 2,
    metin:
      "Soyadı Kanunu'nun kabul tarihi ve amacı aşağıdakilerden hangisinde doğru verilmiştir?",
    secenekler: [
      { id: "A", text: "1925 – soyadlarının devletçe belirlenmesi" },
      { id: "B", text: "1928 – ailelerin soyadı kullanmasını zorunlu kılmak" },
      { id: "C", text: "1934 – herkesin soyadı taşımasını sağlamak ve soyadlarında \"Paşa, Bey\" gibi unvanları yasaklamak" },
      { id: "D", text: "1937 – soyadlarının yabancı dillerden arındırılması" },
    ],
    dogru: "C",
    cozum:
      "Soyadı Kanunu 21 Haziran 1934'te kabul edilmiştir; unvanların kullanılması da yasaklanmıştır. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "nk-10",
    ders: "Inkilap",
    konu: "Lozan Antlaşması",
    zorluk: 3,
    metin:
      "Lozan Antlaşması'nda aşağıdakilerden hangisi Türk lehine sonuçlanmamıştır?",
    secenekler: [
      { id: "A", text: "Boğazların Türkiye'ye bırakılması" },
      { id: "B", text: "Kapitülasyonların kaldırılması" },
      { id: "C", text: "Musul'un Türkiye'ye bırakılması" },
      { id: "D", text: "Ermeni devleti kurulmasının reddedilmesi" },
    ],
    dogru: "C",
    cozum:
      "Musul sorunu Lozan'da çözülememiş, konu İngiltere ile ikili görüşmelere bırakılmıştır. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "nk-11",
    ders: "Inkilap",
    konu: "Devletleşme Süreci",
    zorluk: 1,
    metin:
      "TBMM'nin açılmasının en temel nedeni aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Saltanatı kaldırmak" },
      { id: "B", text: "Millî iradeyi egemen kılmak ve millî bir hükümet oluşturmak" },
      { id: "C", text: "Cumhuriyeti ilan etmek" },
      { id: "D", text: "Yeni harfleri getirmek" },
    ],
    dogru: "B",
    cozum:
      "Meclis, egemenliğin millete ait olduğunu gösteren ve Millî Mücadele'yi yöneten siyasi organ olarak açılmıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-12",
    ders: "Inkilap",
    konu: "İnkılâplar",
    zorluk: 2,
    metin:
      "Devrimlerin yapılmasındaki temel amaç aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Geleneksel düzeni sürdürmek" },
      { id: "B", text: "Türkiye'yi çağdaş ve laik bir devlet yapmak" },
      { id: "C", text: "Avrupa'nın kültürünü benimsetmek" },
      { id: "D", text: "Osmanlı kurumlarını yaşatmak" },
    ],
    dogru: "B",
    cozum:
      "Atatürk İnkılâpları, bağımsız, laik ve çağdaş bir Türkiye hedefinin gereğidir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-13",
    ders: "Inkilap",
    konu: "Atatürk'ün Hayatı",
    zorluk: 2,
    metin:
      "Mustafa Kemal Paşa'nın askerî hayatına yön veren ve kendisiyle ilk kez Sırp ordusuna karşı savaşta tanıştığı komutan kimdir?",
    secenekler: [
      { id: "A", text: "Enver Paşa" },
      { id: "B", text: "Mahmut Şevket Paşa" },
      { id: "C", text: "Fevzi (Çakmak) Paşa" },
      { id: "D", text: "Otman Nuri (Bey)" },
    ],
    dogru: "D",
    cozum:
      "Manastır'da tanıdığı ve kendisini takdir eden Osman Nuri (Bey), onun askerî hayatında yönlendirici olmuştur. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-14",
    ders: "Inkilap",
    konu: "Millî Mücadele Cepheleri",
    zorluk: 2,
    metin:
      "Sakarya Meydan Muharebesi'nin kazanılması üzerine Mustafa Kemal Paşa'ya hangi unvan verilmiştir?",
    secenekler: [
      { id: "A", text: "Gazi" },
      { id: "B", text: "Mareşal" },
      { id: "C", text: "Halaskâr" },
      { id: "D", text: "Başkomutan" },
    ],
    dogru: "B",
    cozum:
      "19 Eylül 1921'de Gazi unvanı almış, Sakarya sonrası 1922'de Mareşal rütbesi verilmiştir. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "nk-15",
    ders: "Inkilap",
    konu: "Yapısal İnkılâplar",
    zorluk: 2,
    metin:
      "Cumhuriyet'in ilk yıllarında ekonomide devletçi politikanın benimsenmesinin en önemli nedeni aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Özel girişimciliğin çok gelişmiş olması" },
      { id: "B", text: "Savaş sonrası yıkılmış ekonomiyi ve altyapıyı devlet eliyle geliştirmek" },
      { id: "C", text: "Yabancı yatırımları artırmak" },
      { id: "D", text: "Tarımı ortadan kaldırmak" },
    ],
    dogru: "B",
    cozum:
      "Savaşlar sonrası özel sermaye yetersiz olduğundan sanayileşme ve altyapı devlet öncülüğünde planlanmıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-16",
    ders: "Inkilap",
    konu: "Diplomasi",
    zorluk: 3,
    metin:
      "Moskova Antlaşması'nın en önemli sonucu aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Doğu sınırının güven altına alınması" },
      { id: "B", text: "Boğazların kontrolünün alınması" },
      { id: "C", text: "Fransa ile ilişkilerin düzeltilmesi" },
      { id: "D", text: "İtilaf Devletleri ile barış sağlanması" },
    ],
    dogru: "A",
    cozum:
      "16 Mart 1921'de imzalanan Moskova Antlaşması ile Ermenistan ve Gürcistan sınırı belirlenmiş, doğu cephesi rahatlamıştır. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "nk-17",
    ders: "Inkilap",
    konu: "Laiklik",
    zorluk: 2,
    metin:
      "Laiklik ilkesinin eğitim-öğretim alanındaki uygulaması aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Özel okulların kapatılması" },
      { id: "B", text: "Tevhid-i Tedrisat Kanunu ile eğitim-öğretimin tek elden, laik esaslara göre düzenlenmesi" },
      { id: "C", text: "Din derslerinin zorunlu olması" },
      { id: "D", text: "Yükseköğretim kurumlarının kapatılması" },
    ],
    dogru: "B",
    cozum:
      "3 Mart 1924'te kabul edilen Tevhid-i Tedrisat, eğitim birliğini ve laik eğitimi sağlamıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "nk-18",
    ders: "Inkilap",
    konu: "Kurtuluş Savaşı Sonuçları",
    zorluk: 2,
    metin:
      "Cumhuriyet'in ilan edilmesiyle birlikte aşağıdakilerden hangisi ortadan kalkmıştır?",
    secenekler: [
      { id: "A", text: "Millî egemenlik" },
      { id: "B", text: "Saltanat" },
      { id: "C", text: "Lozan Antlaşması" },
      { id: "D", text: "Halkçılık" },
    ],
    dogru: "B",
    cozum:
      "Cumhuriyetle birlikte saltanat kaldırılmış, devlet başkanlığı Cumhurbaşkanlığına bağlanmıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
];

export default INKILAP;
