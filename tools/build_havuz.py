"""Ayristirilan tum kaynaklari (cikmis + meb + uretilmis) tek TypeScript
havuzunda birlestirir -> lib/soruHavuzu.ts

Her soruya:
  - benzersiz id (kaynak on ekli)
  - ders, konu, zorluk (kaynak verisinden turetilir)
  - dogru cevap (PDF anahtarindan)
  - benzerlik parmakizi (tekrar tespiti icin)
"""
import json, os, re, hashlib, collections, unicodedata

ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
CIKTI = os.path.join(ROOT, "build", "cikti")
OUT = os.path.join(ROOT, "lib", "soruHavuzu.ts")

DERS_TS = {
    "TURKCE": "Turkce", "MATEMATIK": "Matematik", "FEN": "Fen",
    "INKILAP": "Inkilap", "INGILIZCE": "Ingilizce", "DIN": "Din",
}

# MEB kitap bolum konulari -> daha ince LGS kazanim etiketleri
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
    # daha ozel kurallar genel "atatürk" kuralindan once gelmeli
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


# ODSGM üniteli kitaplarda konu, PDF'in basindaki "2. Ünite" gibi sayisal
# bir satirdan cikariliyor. Gercek bolum adi kitabin ilk sayfasinda, o satirin
# hemen ustunde durur -> kitap adina gore gercek konu adina cevrilir.
KITAP_BASLIK = {
    "dkab_2.pdf": "Zekât ve Sadaka",
    "dkab_3.pdf": "Din ve Hayat",
    "dkab_4.pdf": "Hz. Muhammed'in Örnekliği",
    "dkab_5.pdf": "Kur'an-ı Kerim ve Özellikleri",
    "fen_2.pdf": "DNA ve Genetik Kod",
    "fen_3.pdf": "Basınç",
    "fen_4.pdf": "Madde ve Endüstri",
    "fen_5.pdf": "Basit Makineler",
    "fen_6.pdf": "Enerji Dönüşümleri ve Çevre Bilimi",
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
    "turk_2.pdf": "Millî Mücadele ve Atatürk",
    "turk_3.pdf": "Bilim ve Teknoloji",
    "turk_4.pdf": "Birey ve Toplum",
    "turk_5.pdf": "Zaman ve Mekân",
    "turk_6.pdf": "Millî Kültürümüz",
    "turk_7.pdf": "Doğa ve Evren",
    "turk_8.pdf": "Vatandaşlık",
}

# Kapagi basligi olmayan bazi kitaplar (turkce_unite_*) ayni MEB mufredatini
# paylastigi icin ders + etiket ile yedeklenir. Cozulemeyen etiket -> "Genel".
ETIKET_BASLIK = {
    ("Turkce", "2. Tema"): "Millî Mücadele ve Atatürk",
    ("Turkce", "3. Tema"): "Bilim ve Teknoloji",
    ("Turkce", "4. Tema"): "Birey ve Toplum",
    ("Turkce", "5. Tema"): "Zaman ve Mekân",
    ("Turkce", "6. Tema"): "Millî Kültürümüz",
    ("Turkce", "7. Tema"): "Doğa ve Evren",
    ("Turkce", "8. Tema"): "Vatandaşlık",
}

YAPISAL_KONU = re.compile(r"^\d{1,2}\.\s*(ünite|tema|çıkış|unite)\s*$", re.I)


def gercek_konu(konu, kitap, ders):
    """'2. Ünite' gibi sayisal etiketi kitabin gercek bolum adina cevirir."""
    k = (konu or "").strip()
    if not YAPISAL_KONU.match(k):
        return konu
    return KITAP_BASLIK.get(kitap or "") or ETIKET_BASLIK.get((ders, k)) or ""


# konu etiketi olarak kullanilmamasi gereken genel bolum/bolum adlari
KONU_ARTIK = re.compile(
    r"(?i)^\W*(alıştırma|etkinlik|test|değerlendirme|degerlendirme|kazanım"
    r"|kazanim|soru|özet|ozet|cevap anahtarı|ölçme|olcme|bölüm|bolum"
    r"|ünite|unite|tema|konu)\W*$")


def konu_etiketle(ders, konu):
    k = (konu or "").strip()
    # "Ünite: Mevsimler ve İklim" -> "Mevsimler ve İklim" (on ek gurultusu)
    k = re.sub(r"(?i)^(ünite|unite|tema|bölüm|bolum)\s*[:\-]\s*", "", k).strip()
    if not k or KONU_ARTIK.match(k):
        return "Genel"
    # noktalama/kesik cizgiden ibaret etiketler ("- ----", ".......")
    if sum(c.isalpha() for c in k) < len(k) * 0.4:
        return "Genel"
    for kalip, ad in KONU_ESLEME:
        if re.search(kalip, k.lower()):
            return ad
    return k


def zorluk_tahmin(metin, secenekler):
    """Basit heuristik: uzunluk + matematik sembol yogunlugu."""
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
            ders = DERS_TS.get(s.get("ders"))
            if not ders:
                continue
            dogru = s.get("dogru")
            if dogru not in ("A", "B", "C", "D"):
                continue
            sec = s.get("secenekler", {})
            if not all(sec.get(h) for h in "ABCD"):
                continue
            sorular.append({
                "id": (f"{on_ek}-{s.get('kitapcik', kaynak)[:24]}-{ders[:3]}-"
                       f"{s['no']}-{parmakizi(s['metin'])[:8]}"),
                "ders": ders,
                "konu": konu_etiketle(
                    ders, gercek_konu(s.get("konu"), s.get("kitap", ""), ders)),
                "zorluk": zorluk_tahmin(s["metin"], sec),
                "metin": " ".join(s["metin"].split()),
                "secenekler": {h: " ".join((sec.get(h) or "").split()) for h in "ABCD"},
                "dogru": dogru,
                "cozum": "",
                "kaynak": kaynak,
                "yil": s.get("yil"),
                "parmak": parmakizi(s["metin"]),
            })
    return sorular


if __name__ == "__main__":
    sorular = yukle()
    # tekrar temizligi (parmak izi)
    gorulen, benzersiz = {}, []
    for s in sorular:
        p = s["parmak"]
        if p in gorulen:
            gorulen[p]["tekrar"] = gorulen[p].get("tekrar", 1) + 1
            continue
        gorulen[p] = s
        benzersiz.append(s)
    print(f"{len(sorular)} ham -> {len(benzersiz)} benzersiz")
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
        f.write("}\n\n")
        # Veri JSON string olarak gömülür: 2500+ nesnelik dizi literal'i
        # TypeScript'in birleşik tip sınırını aştığı için çalışma anında parse edilir.
        dizi = json.dumps(benzersiz, ensure_ascii=False, indent=0)
        f.write("// Veri JSON string olarak gömülür; TS birleşik tip sınırını aşmamak için\n")
        f.write("// çalışma anında parse edilir.\n")
        f.write("const HAM: string = ")
        f.write(json.dumps(dizi, ensure_ascii=False))
        f.write(";\n\n")
        f.write("export const HAVUZ: HavuzSoru[] = JSON.parse(HAM);\n")
    print(f"yazildi: {OUT}")
