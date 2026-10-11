import type { Soru } from "../types";

const DIN: Soru[] = [
  {
    id: "dn-01",
    ders: "Din",
    konu: "İnanç",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi İslam'ın şartlarından biri değildir?",
    secenekler: [
      { id: "A", text: "Oruç tutmak" },
      { id: "B", text: "Zekât vermek" },
      { id: "C", text: "Hacca gitmek" },
      { id: "D", text: "Cuma namazı kılmak" },
    ],
    dogru: "D",
    cozum:
      "İslam'ın beş şartı: şehadet getirmek, namaz kılmak, zekât vermek, oruç tutmak ve hicret edebilen için hacca gitmektir. Cuma namazı bu beş şarttan biri değildir. Doğru cevap D'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-02",
    ders: "Din",
    konu: "Ahlak",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi komşuluk hukukuyla ilgili bir davranıştır?",
    secenekler: [
      { id: "A", text: "Komşusunun rahatsız olabileceği şekilde yüksek sesle müzik açmak" },
      { id: "B", text: "Komşusunun yardımına koşmak" },
      { id: "C", text: "Komşusunun sırlarını başkalarına anlatmak" },
      { id: "D", text: "Komşusunun kapısını sürekli rahatsız etmek" },
    ],
    dogru: "B",
    cozum:
      "Dinimiz komşuya yardım etmeyi, onu rahatsız etmemeyi ve sır saklamayı emreder. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-03",
    ders: "Din",
    konu: "Kur'an-ı Kerim",
    zorluk: 2,
    metin:
      "Kur'an-ı Kerim'in ilk inen suresi hangisidir?",
    secenekler: [
      { id: "A", text: "Fatiha" },
      { id: "B", text: "Bakara" },
      { id: "C", text: "İnşirah" },
      { id: "D", text: "Kadir" },
    ],
    dogru: "A",
    cozum:
      "İlk inen sure Alak suresinin ilk beş ayeti, ilk inen tam sure ise Fatiha'dır. Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-04",
    ders: "Din",
    konu: "Peygamberler",
    zorluk: 2,
    metin:
      "\"SABR\" peygamberi olarak da bilinen ve Kuran'da sabrıyla anılan peygamber kimdir?",
    secenekler: [
      { id: "A", text: "Hz. Nuh" },
      { id: "B", text: "Hz. Eyüp" },
      { id: "C", text: "Hz. Musa" },
      { id: "D", text: "Hz. İbrahim" },
    ],
    dogru: "B",
    cozum:
      "Hz. Eyüp, sıkıntılar karşısındaki sabrı nedeniyle \"SABR\" peygamberi olarak anılır. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "dn-05",
    ders: "Din",
    konu: "İbadetler",
    zorluk: 2,
    metin:
      "Namazın vacip şartlarından biri aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Oruç tutmak" },
      { id: "B", text: "Abdest almak" },
      { id: "C", text: "Zekât vermek" },
      { id: "D", text: "Kur'an okumak" },
    ],
    dogru: "B",
    cozum:
      "Namazın vacip şartları: abdest, namazın vaktine girmesi, avret mahallinin örtünmesi ve kıbleye dönülmektir. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-06",
    ders: "Din",
    konu: "Din ve Hayat",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi dinin günlük hayattaki işlevlerinden biri değildir?",
    secenekler: [
      { id: "A", text: "İnsanlara huzur vermesi" },
      { id: "B", text: "İnsanları dürüst olmaya yönlendirmesi" },
      { id: "C", text: "Bireyleri yalnızlığa sürüklemesi" },
      { id: "D", text: "Topumsal yardımlaşmayı güçlendirmesi" },
    ],
    dogru: "C",
    cozum:
      "Din, insanı yalnızlaştırmaz; aksine toplumsal dayanışmayı ve birlikte yaşamayı güçlendirir. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-07",
    ders: "Din",
    konu: "Ahlak",
    zorluk: 2,
    metin:
      "Bir öğrenci sınavda kopya çekmek yerine çalışarak başarıya ulaşmayı tercih ediyor. Bu davranış aşağıdakilerden hangisiyle örneklendirilir?",
    secenekler: [
      { id: "A", text: "Sabır" },
      { id: "B", text: "Tecessüs" },
      { id: "C", text: "Dürüstlük ve helâl kazanma" },
      { id: "D", text: "Bencillik" },
    ],
    dogru: "C",
    cozum:
      "Haksız kazançtan kaçınma ve emekle başarı, dürüstlüğün ve helâl kazancın göstergesidir. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "dn-08",
    ders: "Din",
    konu: "İnanç",
    zorluk: 2,
    metin:
      "Aşağıdakilerden hangisi iman esaslarından biridir?",
    secenekler: [
      { id: "A", text: "Namaz kılmak" },
      { id: "B", text: "Oruç tutmak" },
      { id: "C", text: "Meleklere inanmak" },
      { id: "D", text: "Zekât vermek" },
    ],
    dogru: "C",
    cozum:
      "İman esasları: Allah'a, meleklere, kitaplara, peygamberlere, ahiret gününe ve kadere inanmaktır. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-09",
    ders: "Din",
    konu: "Zekât ve İnfak",
    zorluk: 2,
    metin:
      "Zekâtın İslam dinindeki temel işlevi aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Zenginliği artırmak" },
      { id: "B", text: "Malı temizlemek ve yardıma muhtaç insanların ihtiyaçlarını gidermek" },
      { id: "C", text: "Yalnızca vergi toplamak" },
      { id: "D", text: "Ticareti engellemek" },
    ],
    dogru: "B",
    cozum:
      "Zekât, malı temizler ve toplumsal dayanışmayı sağlayarak muhtaçların ihtiyacını karşılar. Doğru cevap B'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "dn-10",
    ders: "Din",
    konu: "Peygamberler",
    zorluk: 2,
    metin:
      "Hz. Yusuf ile ilgili aşağıdakilerden hangisi doğrudur?",
    secenekler: [
      { id: "A", text: "Kavmini tufandan kurtarmıştır." },
      { id: "B", text: "Ailesini Mısır'a taşımış ve orada büyük bir yönetici olmuştur." },
      { id: "C", text: "İbrahim ile birlikte Kâbe'yi inşa etmiştir." },
      { id: "D", text: "Süleyman ile birlikte görev yapmıştır." },
    ],
    dogru: "B",
    cozum:
      "Hz. Yusuf, Mısır'a götürülmüş ve ilerleyen yıllarda orada yüksek bir makama ulaşarak ailesini yanına almıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-11",
    ders: "Din",
    konu: "Din ve Çevre",
    zorluk: 1,
    metin:
      "Aşağıdakilerden hangisi dinimizin çevreye karşı sorumlulukla ilgili hükümleriyle uyumludur?",
    secenekler: [
      { id: "A", text: "Suyu boşa akıtmak" },
      { id: "B", text: "Ağaç dikmek ve israftan kaçınmak" },
      { id: "C", text: "Çöpleri sokağa atmak" },
      { id: "D", text: "Ormanları yakmak" },
    ],
    dogru: "B",
    cozum:
      "İsraf haramdır; yararlı iş yapmak ve eko-sistemi korumak dinimizin tavsiye ettiği davranışlardır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-12",
    ders: "Din",
    konu: "Günlük Hayatta Din",
    zorluk: 1,
    metin:
      "Anne-babaya saygı ile ilgili aşağıdaki ayetlerden hangisi doğrudur?",
    secenekler: [
      { id: "A", text: "\"Rabbiniz emretti ki, O'ndan başka hiçbir puta tapmayın, ana ve babaya iyi davranın.\"" },
      { id: "B", text: "\"Dininizi kolaylaştırın.\"" },
      { id: "C", text: "\"Sabredenlerle beraber olun.\"" },
      { id: "D", text: "\"Namazı kılın, zekâtı verin.\"" },
    ],
    dogru: "A",
    cozum:
      "İsrâ suresinde anne-babaya iyi davranma emredilir. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "dn-13",
    ders: "Din",
    konu: "Ahlak",
    zorluk: 2,
    metin:
      "Yalan söylemenin dinimizdeki yeri aşağıdakilerden hangisidir?",
    secenekler: [
      { id: "A", text: "Sadece başkalarına zarar veriyorsa yasaktır." },
      { id: "B", text: "Her koşulda yasaktır." },
      { id: "C", text: "Sadece dini konularda yasaktır." },
      { id: "D", text: "Önemli değildir." },
    ],
    dogru: "B",
    cozum:
      "Yalan, İslam ahlakında kesinlikle yasaklanan ve insanın güvenilirliğini yok eden bir davranıştır. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "dn-14",
    ders: "Din",
    konu: "İbadetler",
    zorluk: 3,
    metin:
      "Aşağıdaki ibadetlerden hangisinin vakti belirli zamanlara bağlı değildir?",
    secenekler: [
      { id: "A", text: "Namaz" },
      { id: "B", text: "Oruç" },
      { id: "C", text: "Zekât" },
      { id: "D", text: "Hac" },
    ],
    dogru: "C",
    cozum:
      "Namazın ve orucun belirli vakitleri, hacın ise belirli günleri vardır; zekât ise yılda bir kez verilir ve belirli bir güne bağlı değildir. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
];

export default DIN;
