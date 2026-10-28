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
    (r"millî mücadele|atatürk", "Millî Mücadele"),
    (r"bilim|teknoloji", "Bilim ve Teknoloji"),
    (r"birey|toplum", "Birey ve Toplum"),
    (r"zaman|mekân", "Zaman ve Mekân"),
    (r"kültür", "Millî Kültür"),
    (r"doğa|evren", "Doğa ve Evren"),
    (r"vatandaşlık", "Vatandaşlık"),
    (r"kahraman|bağımsızlık|destan", "Kurtuluş Savaşı"),
    (r"demokratikleşme", "Demokratikleşme"),
    (r"dış politika", "Dış Politika"),
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


# konu etiketi olarak kullanilmamasi gereken genel bolum/bolum adlari
KONU_ARTIK = re.compile(
    r"(?i)^\W*(alıştırma|etkinlik|test|değerlendirme|degerlendirme|kazanım"
    r"|kazanim|soru|özet|ozet|cevap anahtarı|ölçme|olcme|bölüm|bolum"
    r"|ünite|unite|tema|konu)\W*$")


def konu_etiketle(ders, konu):
    k = (konu or "").strip()
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
                "konu": konu_etiketle(ders, s.get("konu")),
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
