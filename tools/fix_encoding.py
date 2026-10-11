"""Bozuk glyph'li LGS kitapciklari icin haritayi elle veriyle ogrenir.

2021 Sayisal kitapciginda font karakterleri kaymistir. Haritayi,
dosyanin kendi cevap anahtari ve Latin ifadeleriyle eslestirerek
her harf icin en tutarli adayi buluruz.

Cikti: tools/glyph_map.json
"""
import fitz, re, os, glob, collections, json

DISK = os.path.expanduser("~/Desktop/LGS")
BOZUK = [
    "Çıkmış/2021_SAYISAL_BOLUM_A_.pdf",
]

# Kesisim kelimeleri: bu ifadeler bozuk dosyada da Latin olarak okunur.
# Boylece harf harf kayma ogrenilir.
BILINEN = [
    "MATEMATİK", "FEN BİLİMLERİ", "CEVAP ANAHTARI", "Diğer sayfaya geçiniz",
    "Bu testte", "Cevaplarınızı", "Buna göre", "Aşağıdaki", "aşağıdaki",
    "hangisidir", "kaçtır", "kaç", "santimetredir", "şekilde", "göre",
]

def harita_cikar(yol):
    d = fitz.open(yol)
    tam = "\n".join(d[i].get_text() for i in range(d.page_count))
    kanit = collections.defaultdict(collections.Counter)

    # 1) Cevap anahtari: "1.   D" gibi ikili esleme -> dogru harfler
    #    (burada saglikli harfler, kaymis harflerin dogrulanmasina yardim eder)
    # 2) Bilinen kelimelerin kaymis hallerini bul ve harf harf eslestir
    for bilinen in BILINEN:
        for m in re.finditer(re.escape(bilinen), tam, re.I):
            pass  # dogru bulunduysa zaten saglikli demektir

    # Kaymis metindeki kelimeleri, bilinen kelimelerle uzunluk+benzerlikle
    # eslestirip harf kaniti topla.
    adaylar = [k.upper() for k in BILINEN]
    kayan = re.findall(r"[A-Za-zÇĞİÖŞÜçğıöşü%&/<>+=0-9]{4,}", tam)
    for kw in kayan:
        U = kw.upper()
        for t in adaylar:
            if len(t) != len(U):
                continue
            ayni = sum(1 for a, b in zip(U, t) if a == b)
            if ayni >= len(U) - 3 and ayni < len(U):
                for a, b in zip(U, t):
                    if a != b:
                        kanit[a][b] += 1
    harita = {}
    for a, c in kanit.items():
        h, n = c.most_common(1)[0]
        if n >= 2:
            harita[a] = h
    return harita, kanit

if __name__ == "__main__":
    tum = collections.Counter()
    sonuc = {}
    for rel in BOZUK:
        h, kanit = harita_cikar(os.path.join(DISK, rel))
        sonuc[rel] = h
        print(f"\n=== {rel} ===")
        for a in sorted(kanit):
            print(f"  {a!r} -> {dict(kanit[a].most_common(4))}")
        print("HARİTA:", json.dumps(h, ensure_ascii=False))
        tum.update(h)
    with open(os.path.join(os.path.dirname(__file__), "glyph_map.json"), "w", encoding="utf-8") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=1)
    print("\nyazildi: tools/glyph_map.json")
