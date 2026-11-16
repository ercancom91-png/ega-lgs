"""Ayristirilan tum kaynaklari (cikmis + meb + sorular + kazanim) tek TypeScript
havuzunda birlestirir -> lib/soruHavuzu.ts

Her soruya:
  - benzersiz id (kaynak on ekli)
  - ders, konu, zorluk (kaynak verisinden turetilir)
  - dogru cevap (PDF anahtarindan)
  - temizlenmis Turkce karakterler, birlestirilmis tireli kelimeler
  - maddeler alt alta (\n) ve soru cumlesi ayri paragrafta (\n\n)
  - varsa gorselUrl ve secenekGorselUrl (/gorseller/...)
"""
import json, os, re, collections, unicodedata

ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
CIKTI = os.path.join(ROOT, "build", "cikti")
OUT = os.path.join(ROOT, "lib", "soruHavuzu.ts")

DERS_TS = {
    "TURKCE": "Turkce", "MATEMATIK": "Matematik", "FEN": "Fen",
    "INKILAP": "Inkilap", "INGILIZCE": "Ingilizce", "DIN": "Din",
}

MAP_ODSGM = {
    "FEN": "fen", "MATEMATIK": "mat", "TURKCE": "turk",
    "INKILAP": "ink", "DIN": "dkab", "INGILIZCE": "ing",
}

KONU_ESLEME = [
    (r"çarpanlar|katlar|üslü", "Çarpanlar ve Katlar"),
    (r"karekök", "Kareköklü İfadeler"),
    (r"veri analizi|grafik", "Veri Analizi"),
    (r"olasılık", "Olasılık"),
    (r"cebirsel|özdeşlik", "Cebirsel İfadeler"),
    (r"doğrusal denklem", "Doğrusal Denklemler"),
    (r"eşitsizlik", "Eşitsizlikler"),
    (r"üçgen", "Üçgenler"),
    (r"eşlik|benzerlik", "Eşlik ve Benzerlik"),
    (r"dönüşüm", "Dönüşüm Geometrisi"),
    (r"geometrik cisim", "Geometrik Cisimler"),
    (r"erdem", "Erdemler"),
    (r"dış politika", "Dış Politika"),
    (r"çağdaşlaşan", "Çağdaşlaşan Türkiye"),
    (r"millî mücadele|atatürk", "Millî Mücadele"),
    (r"bilim|teknoloji", "Bilim ve Teknoloji"),
    (r"birey|toplum", "Birey ve Toplum"),
    (r"zaman|mekân", "Zaman ve Mekân"),
    (r"kültür", "Millî Kültür"),
    (r"doğa|evren", "Doğa ve Evren"),
    (r"vatandaşlık", "Vatandaşlık"),
    (r"kahraman|bağımsızlık|destan", "Kurtuluş Savaşı"),
    (r"demokratikleşme", "Demokratikleşme"),
    (r"kader", "İman ve Kader"),
    (r"zekât|sadaka", "İbadetler"),
    (r"din ve hayat", "Din ve Hayat"),
    (r"muhammed|peygamber", "Peygamberimizin Örnekliği"),
    (r"kur'an", "Kur'an-ı Kerim"),
    (r"friendship", "Friendship"),
    (r"teen life", "Teen Life"),
    (r"kitchen", "In the Kitchen"),
    (r"phone", "On the Phone"),
    (r"internet", "The Internet"),
    (r"adventure", "Adventures"),
    (r"tourism", "Tourism"),
    (r"hücre", "Hücre"),
    (r"dna|genetik", "Genetik"),
    (r"enerji", "Enerji"),
    (r"basınç", "Basınç"),
    (r"elektrik", "Elektrik"),
    (r"kuvvet|hareket", "Kuvvet ve Hareket"),
    (r"madde", "Madde ve Endüstri"),
    (r"çevre|ekosistem", "Çevre"),
    (r"ses|optik", "Ses ve Optik"),
]

KITAP_BASLIK = {
    "dkab_1.pdf": "Kader İnancı",
    "dkab_2.pdf": "Zekât ve Sadaka",
    "dkab_3.pdf": "Din ve Hayat",
    "dkab_4.pdf": "Hz. Muhammed'in Örnekliği",
    "dkab_5.pdf": "Kur'an-ı Kerim ve Özellikleri",
    "fen_1.pdf": "Mevsimler ve İklim",
    "fen_2.pdf": "DNA ve Genetik Kod",
    "fen_3.pdf": "Basınç",
    "fen_4.pdf": "Madde ve Endüstri",
    "fen_5.pdf": "Basit Makineler",
    "fen_6.pdf": "Enerji Dönüşümleri ve Çevre Bilimi",
    "fen_7.pdf": "Elektrik Yükleri ve Elektrik Enerjisi",
    "ink_1.pdf": "Bir Kahraman Doğuyor",
    "ink_2.pdf": "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar",
    "ink_3.pdf": "Millî Bir Destan: Ya İstiklal Ya Ölüm!",
    "ink_4.pdf": "Atatürkçülük ve Çağdaşlaşan Türkiye",
    "ink_5.pdf": "Demokratikleşme Çabaları",
    "ink_6.pdf": "Atatürk Dönemi Türk Dış Politikası",
    "mat_2.pdf": "Kareköklü İfadeler-Veri Analizi",
    "mat_3.pdf": "Basit Olayların Olma Olasılığı-Cebirsel İfadeler ve Özdeşlikler",
    "mat_4.pdf": "Doğrusal Denklemler-Eşitsizlikler",
    "mat_5.pdf": "Üçgenler-Eşlik ve Benzerlik",
    "mat_6.pdf": "Dönüşüm Geometrisi-Geometrik Cisimler",
    "turk_1.pdf": "Erdemler",
    "turk_2.pdf": "Millî Mücadele ve Atatürk",
    "turk_3.pdf": "Bilim ve Teknoloji",
    "turk_4.pdf": "Birey ve Toplum",
    "turk_5.pdf": "Zaman ve Mekân",
    "turk_6.pdf": "Millî Kültürümüz",
    "turk_7.pdf": "Doğa ve Evren",
    "turk_8.pdf": "Vatandaşlık",
}

ETIKET_BASLIK = {
    ("Turkce", "1. Tema"): "Erdemler",
    ("Turkce", "2. Tema"): "Millî Mücadele ve Atatürk",
    ("Turkce", "3. Tema"): "Bilim ve Teknoloji",
    ("Turkce", "4. Tema"): "Birey ve Toplum",
    ("Turkce", "5. Tema"): "Zaman ve Mekân",
    ("Turkce", "6. Tema"): "Millî Kültürümüz",
    ("Turkce", "7. Tema"): "Doğa ve Evren",
    ("Turkce", "8. Tema"): "Vatandaşlık",
}

YAPISAL_KONU = re.compile(r"^\d{1,2}\.\s*(ünite|tema|çıkış|unite)\s*$", re.I)

KONU_ARTIK = re.compile(
    r"(?i)^\W*(alıştırma|etkinlik|test|değerlendirme|degerlendirme|kazanım"
    r"|kazanim|soru|özet|ozet|cevap anahtarı|ölçme|olcme|bölüm|bolum"
    r"|ünite|unite|tema|konu)\W*$")


def tr_lower(s: str) -> str:
    return s.replace("İ", "i").replace("I", "ı").lower()


def tr_upper_first(s: str) -> str:
    if not s:
        return s
    first = s[0]
    if first == "i":
        first = "İ"
    elif first == "ı":
        first = "I"
    else:
        first = first.upper()
    return first + s[1:]


def sozluk_kur():
    clean_words = collections.Counter()
    for fn in ["meb.json", "kazanim.json", "cikmis.json"]:
        p = os.path.join(CIKTI, fn)
        if not os.path.exists(p):
            continue
        for q in json.load(open(p, encoding="utf-8")):
            if q.get("ders") == "INGILIZCE":
                continue
            for w in re.findall(r"[A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ']+", q.get("metin", "")):
                wl = tr_lower(w)
                if any(c in wl for c in "çğıöşü"):
                    clean_words[wl] += 1

    i_map = {}
    ascii_map = {}
    for wl, cnt in clean_words.items():
        if cnt < 2:
            continue
        if "ı" in wl:
            ci = wl.replace("ı", "i")
            if ci not in clean_words or clean_words[ci] * 5 < cnt:
                if ci not in i_map or clean_words[i_map[ci]] < cnt:
                    i_map[ci] = wl
        ca = (wl.replace("ı", "i").replace("ö", "o").replace("ü", "u")
                .replace("ş", "s").replace("ç", "c").replace("ğ", "g"))
        if ca != wl and len(wl) >= 5 and cnt >= 3 and ca not in clean_words:
            if ca not in ascii_map or clean_words[ascii_map[ca]] < cnt:
                ascii_map[ca] = wl

    EXPLICIT = {
        "aşağida": "aşağıda", "aşağidaki": "aşağıdaki", "asagida": "aşağıda", "asagidaki": "aşağıdaki",
        "yukarida": "yukarıda", "yukaridaki": "yukarıdaki", "yukanda": "yukarıda", "yukandaki": "yukarıdaki",
        "sayilar": "sayılar", "sayilarin": "sayıların", "sayilari": "sayıları", "sayilarini": "sayılarını",
        "sayilarinin": "sayılarının", "sayilarindan": "sayılarından", "sayisi": "sayısı", "sayisinin": "sayısının",
        "sayisina": "sayısına", "sayisindan": "sayısından", "sayi": "sayı", "sayiyi": "sayıyı", "sayiya": "sayıya",
        "ayrilmiştir": "ayrılmıştır", "ayrilmistir": "ayrılmıştır", "ayriliyor": "ayrılıyor",
        "verilmiştir": "verilmiştir", "verilmistir": "verilmiştir", "yapilmiştir": "yapılmıştır",
        "yapilmistir": "yapılmıştır", "yazilmiştir": "yazılmıştır", "yazilmistir": "yazılmıştır",
        "yazilir": "yazılır", "yazilarak": "yazılarak", "atiliyor": "atılıyor", "atilacaktir": "atılacaktır",
        "atılacaktir": "atılacaktır", "olacaktir": "olacaktır", "bulunmaktadir": "bulunmaktadır",
        "satilmaktadir": "satılmaktadır", "vardir": "vardır", "kaçtir": "kaçtır", "kactir": "kaçtır",
        "kadardir": "kadardır", "fazladir": "fazladır", "azdir": "azdır",
        "bazilarinin": "bazılarının", "bazilari": "bazıları", "alanlari": "alanları", "alanlarinin": "alanlarının",
        "kenarlarinin": "kenarlarının", "kenarlari": "kenarları", "uzunluklari": "uzunlukları",
        "uzunluklarinin": "uzunluklarının", "toplami": "toplamı", "toplaminin": "toplamının",
        "farki": "farkı", "orani": "oranı", "çarpimi": "çarpımı", "carpimi": "çarpımı",
        "arasinda": "arasında", "arasindaki": "arasındaki", "tarafindan": "tarafından",
        "araciliğiyla": "aracılığıyla", "fabrikasinda": "fabrikasında", "parmaklarina": "parmaklarına",
        "kullanilacaği": "kullanılacağı", "kullanilarak": "kullanılarak", "kullanilan": "kullanılan",
        "çıkarildiği": "çıkarıldığı", "cikarildigi": "çıkarıldığı", "sivilaştirilarak": "sıvılaştırılarak",
        "taşinabilir": "taşınabilir", "dikdortgen": "dikdörtgen", "dikdortgenler": "dikdörtgenler",
        "dikdortgenin": "dikdörtgenin", "dikdortgene": "dikdörtgene", "uzere": "üzere", "şekdinde": "şeklinde",
        "seklinde": "şeklinde", "başarilar": "başarılar", "kâğidina": "kâğıdına", "kagidina": "kâğıdına",
        "sinif": "sınıf", "sıcakliğinda": "sıcaklığında", "sicakliğinda": "sıcaklığında",
        "kismi": "kısmı", "kismina": "kısmına", "kisminda": "kısmında", "frekansli": "frekanslı",
        "şieleme": "şişeleme", "makinadan": "makineden", "kagitta": "kâğıtta", "kâğitta": "kâğıtta",
        "olasiliklari": "olasılıkları", "olasiligi": "olasılığı", "olasiliği": "olasılığı",
        "programlama": "programlama", "uygulandiğinda": "uygulandığında", "uygulandiginda": "uygulandığında",
        "uygulanirsa": "uygulanırsa", "tanimlari": "tanımları", "adim": "adım", "adima": "adıma", "adimdan": "adımdan",
    }
    i_map.update(EXPLICIT)
    return i_map, ascii_map


I_MAP, ASCII_MAP = sozluk_kur()

# Loanwords that legitimately have back vowel + 'i'
LOAN_EXCEPT = {
    "dakika", "makine", "makina", "grafik", "trafik", "pratik", "statik", "dinamik", "optik", "genetik",
    "fizik", "kimya", "ekonomik", "otomatik", "elektronik", "mekanik", "organik", "plastik", "lastik",
    "taktik", "teknik", "antik", "klasik", "kronik", "tropik", "etik", "estetik", "botanik", "manyetik",
    "kinetik", "aritmetik", "geometrik", "simetrik", "elektrik", "fabrika", "harita", "tarih", "daire",
    "kaide", "aile", "ait", "dair", "şair", "cahil", "dahil", "sahil", "sakin", "tahmin", "tahlil",
    "tahsil", "takdir", "takip", "takvim", "talep", "talim", "tamir", "tarif", "tatil", "tayin", "vazife",
    "ilan", "ilaç", "ilave", "iman", "imkan", "imkân", "imza", "inanç", "inkılap", "insan", "irade",
    "ispat", "istiklal", "istisna", "işaret", "itibar", "itilaf", "itiraz", "ittifak", "miras", "mizah",
    "nisan", "nizam", "pilav", "silah", "sipariş", "sistem", "sivil", "siyaset", "siyasi", "ticaret",
    "ticari", "viraj", "ziyaret", "cami", "camii", "sanayi", "faaliyet", "hakimiyet", "muallim", "muhafaza",
    "muharebe", "muhtaç", "mutlaka", "radyo", "rakip", "kitap", "hitap", "hesap", "cevap", "sevab",
}


def kelime_duzelt(m_obj):
    w = m_obj.group(0)
    wl = tr_lower(w)
    hedef = I_MAP.get(wl) or ASCII_MAP.get(wl)
    if not hedef:
        # Back-vowel suffix harmony check: if word has [aıou] and no [eöü], and ends with common back-vowel suffix written with 'i'
        if any(c in wl for c in "aıou") and not any(c in wl for c in "eöü"):
            if not any(wl.startswith(lw) for lw in LOAN_EXCEPT):
                hedef = re.sub(r"(?<=[\wçğıöşü])i", "ı", wl)
                if hedef == wl:
                    hedef = None
            else:
                # Even on a loanword like 'fabrika' or 'harita', suffixes after final 'a'/'ı'/'o'/'u' take 'ı'!
                m_suf = re.search(r"[aıou]([a-zçğıöşü']*i[a-zçğıöşü']*)$", wl)
                if m_suf:
                    pre = wl[:m_suf.start(1)]
                    suf = m_suf.group(1).replace("i", "ı")
                    hedef = pre + suf
    if not hedef or hedef == wl:
        return w
    if w.isupper():
        return hedef.replace("i", "İ").replace("ı", "I").upper()
    if w[0].isupper():
        return tr_upper_first(hedef)
    return hedef


SORU_KOKU_RE = re.compile(
    r"(?<!\n)\s+(?="
    r"(?:Buna göre|Bu bilgilere göre|Verilen bilgilere göre|Yukarıdaki bilgilere göre"
    r"|Bu metne göre|Bu parçaya göre|Bu açıklamaya göre|Bu ifadeye göre|Bu metinden|Bu parçadan|Bu metinde"
    r"|Bu görsele göre|Görsele göre|Bu grafiğe göre|Grafiğe göre|Bu tabloya göre|Tabloya göre|Tablodaki bilgilere göre|Tabloda ücretleri"
    r"|Bu haritaya göre|Haritaya göre|Şekildeki\s+\S+\s+göre|Bu deneyde|Bu deneye göre|Bu programa göre|Bu kurada|Bu uyarıların|Bu düşünceyi"
    r"|Yukarıdakilerden hangisi|Yukarıdakilerden hangileri|Aşağıdakilerden hangisi|Aşağıdakilerden hangileri"
    r"|Numaralanmış cümlelerin hangisinde|Numaralanmış ifadelerden hangileri|Numaralanmış yerlerin hangisinde"
    r"|According to the|Which of the following)\b"
    r")",
    re.I
)


def metin_bicimlendir(metin: str, ders: str) -> str:
    if not metin:
        return ""
    t = metin

    # 1. Remove garbled shifted-ASCII font blocks (e.g. !"#$%&'()*+,-./0...)
    t = re.sub(r"(?:[!\"#$%&'()*+,\-./0-9:;<=>?@]{4,}\s*){2,}", " ", t)

    # 2. Fix 2021 Sözel quote encoding ³...´ -> “...”
    t = re.sub(r"³([^´]{1,200})´", r"“\1”", t)

    # 3. De-hyphenate broken line-wrap words: "santimet- rekareden" -> "santimetrekareden"
    for _ in range(3):
        t = re.sub(r"([a-zçğıöşüA-ZÇĞİÖŞÜ]{2,})-\s+([a-zçğıöşü]{2,})", r"\1\2", t)

    # 4. Strip stray leading question/unit headers like "Ünite Mevsimler ve İklim 1."
    t = re.sub(r"^(?:Ünite|Tema)\s+[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,35}?\s+\d{1,2}\.\s+", "", t)

    # 5. Clean math & superscript symbols
    t = re.sub(r"\b(mm|cm|dm|m|km)2\b", r"\1²", t)
    t = re.sub(r"\b(mm|cm|dm|m|km)3\b", r"\1³", t)
    t = t.replace("0,00013 10a #", "0,00013 × 10ᵃ")
    t = re.sub(r"\s*\$\s*$", "", t)

    # Collapse whitespace before structural newline insertion
    t = " ".join(t.split())

    # 6. Turkish character restoration (for non-English courses)
    if ders != "Ingilizce":
        t = re.sub(r"[A-Za-zÇĞİÖŞÜçğıöşü']{3,}", kelime_duzelt, t)

    # 7. Format bullet items (•, ●, ▪) onto their own lines (\n)
    t = re.sub(r"\s*([•●▪])\s*", r"\n\1 ", t)

    # 8. Format numbered steps ("1. Adım:", "2. Adım:", etc.) onto their own lines
    if re.search(r"\b1\.\s*Adım\s*:", t) and re.search(r"\b2\.\s*Adım\s*:", t):
        t = re.sub(r"\s+(?=\d\.\s*Adım\s*:)", "\n", t)

    # 9. Format Roman numeral premises (I., II., III., IV.) onto their own lines when both I. and II. exist
    if re.search(r"(?:^|\s)I\.\s+[A-ZÇĞİÖŞÜ0-9“\"(]", t) and re.search(r"\sII\.\s+[A-ZÇĞİÖŞÜ0-9“\"(]", t):
        t = re.sub(r"\s+(?=(?:I|II|III|IV|V)\.\s+[A-ZÇĞİÖŞÜ0-9“\"(])", "\n", t)
    elif re.search(r"(?:^|\s)\(I\)\s+", t) and re.search(r"\s\(II\)\s+", t):
        t = re.sub(r"\s+(?=\((?:I|II|III|IV|V)\)\s+)", "\n", t)

    # 10. Separate the final question stem ("Buna göre...", "Yukarıdakilerden hangisi...", etc.) into its own paragraph (\n\n)
    matches = list(SORU_KOKU_RE.finditer(t))
    if matches:
        last_m = matches[-1]
        if last_m.start() > 25:
            t = t[:last_m.start()].rstrip() + "\n\n" + t[last_m.end():].lstrip()

    # Clean up excessive newlines
    t = re.sub(r"\n{3,}", "\n\n", t).strip()
    return t


def secenek_bicimlendir(sec_dict, ders: str, kitapcik: str = "", no: int = 0):
    out = {}
    for h in "ABCD":
        v = " ".join((sec_dict.get(h) or "").split()).strip()
        v = re.sub(r"([a-zçğıöşüA-ZÇĞİÖŞÜ]{2,})-\s+([a-zçğıöşü]{2,})", r"\1\2", v)
        v = re.sub(r"\b(mm|cm|dm|m|km)2\b", r"\1²", v)
        v = re.sub(r"\b(mm|cm|dm|m|km)3\b", r"\1³", v)
        if kitapcik == "2018_SAYISAL_BOLUM_A_kitapcigi" and ders == "Matematik" and no == 2 and v in ("94", "88", "79", "68"):
            v = f"√{v}"
        if ders != "Ingilizce" and v != "[görsel]":
            v = re.sub(r"[A-Za-zÇĞİÖŞÜçğıöşü']{3,}", kelime_duzelt, v)
        out[h] = v
    return out


def gercek_konu(konu, kitap, ders):
    k = (konu or "").strip()
    if not YAPISAL_KONU.match(k):
        return konu
    return KITAP_BASLIK.get(kitap or "") or ETIKET_BASLIK.get((ders, k)) or ""


def konu_etiketle(ders, konu):
    k = (konu or "").strip()
    k = re.sub(r"(?i)^(ünite|unite|tema|bölüm|bolum)\s*[:\-]\s*", "", k).strip()
    if not k or KONU_ARTIK.match(k):
        return "Genel"
    if sum(c.isalpha() for c in k) < len(k) * 0.4:
        return "Genel"
    for kalip, ad in KONU_ESLEME:
        if re.search(kalip, k.lower()):
            return ad
    return k


def zorluk_tahmin(metin, secenekler):
    puan = 0
    if len(metin) > 320:
        puan += 1
    if len(metin) > 480:
        puan += 1
    if re.search(r"\d+[.,]?\d*\s*[×÷√^²³≤≥]|%|\$", metin):
        puan += 1
    if any(re.search(r"\d", v or "") for v in secenekler.values()):
        puan += 1
    if puan <= 1:
        return 1
    if puan == 2:
        return 2
    return 3


def parmakizi(metin):
    m = unicodedata.normalize("NFKD", metin).lower()
    m = re.sub(r"[^a-z0-9çğıöşü]", "", m, flags=re.I)
    m = re.sub(r"(a|ı|o|u|e|i|ö|ü){2,}", r"\1", m)
    return m[:160]


def gorsel_kontrol(rel_path):
    tam = os.path.join(ROOT, "public", rel_path.lstrip("/"))
    return rel_path if os.path.exists(tam) else None


def yukle():
    sorular = []
    for dosya, kaynak, on_ek in [
        ("cikmis.json", "cikmis", "LGS"),
        ("meb.json", "meb", "MEB"),
        ("sorular.json", "sorular", "SIN"),
        ("kazanim.json", "kazanim", "KAZ"),
    ]:
        yol = os.path.join(CIKTI, dosya)
        if not os.path.exists(yol):
            continue
        for s in json.load(open(yol, encoding="utf-8")):
            ders_ham = s.get("ders")
            ders = DERS_TS.get(ders_ham)
            if not ders:
                continue
            dogru = s.get("dogru")
            if dogru not in ("A", "B", "C", "D"):
                continue
            sec_ham = s.get("secenekler", {})
            if not all(sec_ham.get(h) for h in "ABCD"):
                continue

            kitapcik = s.get("kitapcik", "")
            kitap = s.get("kitap", "")
            no = s.get("no", 0)

            # Resolve gorselUrl and secenekGorselUrl
            gorsel_url = s.get("gorselUrl")
            sec_gorsel_url = s.get("secenekGorselUrl")
            if kaynak == "cikmis" and kitapcik:
                gorsel_url = gorsel_url or gorsel_kontrol(f"/gorseller/cikmis/{kitapcik}_{ders_ham}_{no}.webp")
                sec_gorsel_url = sec_gorsel_url or gorsel_kontrol(f"/gorseller/cikmis/{kitapcik}_{ders_ham}_{no}_sec.webp")
            elif kaynak == "meb" and s.get("bolumNo"):
                stem = f"{MAP_ODSGM.get(ders_ham, '')}_{s['bolumNo']}"
                gorsel_url = gorsel_url or gorsel_kontrol(f"/gorseller/meb/{stem}_{no}.webp")
                sec_gorsel_url = sec_gorsel_url or gorsel_kontrol(f"/gorseller/meb/{stem}_{no}_sec.webp")
            elif kaynak == "kazanim" and kitap:
                stem = os.path.splitext(kitap)[0]
                gorsel_url = gorsel_url or gorsel_kontrol(f"/gorseller/meb/{stem}_{no}.webp")
                sec_gorsel_url = sec_gorsel_url or gorsel_kontrol(f"/gorseller/meb/{stem}_{no}_sec.webp")

            temiz_metin = metin_bicimlendir(s["metin"], ders)
            temiz_sec = secenek_bicimlendir(sec_ham, ders, kitapcik, no)

            # Keep original fingerprint logic on raw text so IDs remain stable where possible
            pk_raw = parmakizi(s["metin"])
            kayit = {
                "id": (f"{on_ek}-{(kitapcik or kaynak)[:24]}-{ders[:3]}-"
                       f"{no}-{pk_raw[:8]}"),
                "ders": ders,
                "konu": konu_etiketle(
                    ders, gercek_konu(s.get("konu"), kitap, ders)),
                "zorluk": zorluk_tahmin(temiz_metin, temiz_sec),
                "metin": temiz_metin,
                "secenekler": temiz_sec,
                "dogru": dogru,
                "cozum": "",
                "kaynak": kaynak,
                "yil": s.get("yil"),
                "parmak": pk_raw if len(pk_raw) >= 20 else f"{kaynak}-{kitapcik}-{kitap}-{ders}-{no}",
            }
            if gorsel_url:
                kayit["gorselUrl"] = gorsel_url
            if sec_gorsel_url:
                kayit["secenekGorselUrl"] = sec_gorsel_url
            sorular.append(kayit)
    return sorular


if __name__ == "__main__":
    sorular = yukle()
    gorulen, benzersiz = {}, []
    for s in sorular:
        p = s["parmak"]
        if p in gorulen:
            # Eger yeni kayitta gorselUrl varsa ve eskisinde yoksa mirasi aktar
            if s.get("gorselUrl") and not gorulen[p].get("gorselUrl"):
                gorulen[p]["gorselUrl"] = s["gorselUrl"]
            if s.get("secenekGorselUrl") and not gorulen[p].get("secenekGorselUrl"):
                gorulen[p]["secenekGorselUrl"] = s["secenekGorselUrl"]
            gorulen[p]["tekrar"] = gorulen[p].get("tekrar", 1) + 1
            continue
        gorulen[p] = s
        benzersiz.append(s)
    print(f"{len(sorular)} ham -> {len(benzersiz)} benzersiz")
    gorselli = sum(1 for s in benzersiz if s.get("gorselUrl") or s.get("secenekGorselUrl"))
    maddeli = sum(1 for s in benzersiz if "\n" in s["metin"])
    print(f"Gorselli soru: {gorselli}, Cok paragrafli / maddeli soru: {maddeli}")
    ders_say = collections.Counter(s["ders"] for s in benzersiz)
    kaynak_say = collections.Counter(s["kaynak"] for s in benzersiz)
    print("ders:", dict(ders_say))
    print("kaynak:", dict(kaynak_say))
    for s in benzersiz:
        s.pop("parmak", None)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// Bu dosya tools/build_havuz.py ile otomatik olusturulmustur.\n")
        f.write("export interface HavuzSoru {\n")
        f.write("  id: string; ders: string; konu: string; zorluk: 1|2|3;\n")
        f.write("  metin: string; secenekler: Record<string,string>;\n")
        f.write("  dogru: string; cozum: string; kaynak: string; yil?: number;\n")
        f.write("  gorselUrl?: string; secenekGorselUrl?: string;\n")
        f.write("}\n\n")
        dizi = json.dumps(benzersiz, ensure_ascii=False, indent=0)
        f.write("// Veri JSON string olarak gömülür; TS birleşik tip sınırını aşmamak için\n")
        f.write("// çalışma anında parse edilir.\n")
        f.write("const HAM: string = ")
        f.write(json.dumps(dizi, ensure_ascii=False))
        f.write(";\n\n")
        f.write("export const HAVUZ: HavuzSoru[] = JSON.parse(HAM);\n")
    print(f"yazildi: {OUT}")
