"""Her cikmis kitapcik icin ders bazli cevap anahtarini PDF metninden cikarir.

Cikti: build/cikti/anahtarlar.json
  {kitapcik: {"MATEMATIK": {1:"D",...}, "FEN": {...}, ...}}
"""
import fitz, glob, os, re, json

DISK = os.path.expanduser("~/Desktop/LGS")
OUT = "/Users/ercan/Documents/Qoder/lgs-hazirlik/build/cikti"
os.makedirs(OUT, exist_ok=True)

DERS_KALIP = [
    ("MATEMATIK", r"MATEMAT[Iİ]K"),
    ("FEN", r"FEN B[Iİ]L[Iİ]MLER[Iİ]"),
    ("TURKCE", r"T[UÜ]RK[ÇC]E"),
    ("INKILAP", r"INKILAP|İNKILAP"),
    ("INGILIZCE", r"YABANCI D[Iİ]L"),
    ("DIN", r"D[Iİ]N K[UÜ]LT[UÜ]R[UÜ]"),
]

# Fontu bozuk oldugu icin metinden okunamayan tek kitapcik: elle alindi
ELLE = {
    "2021_SAYISAL_BOLUM_A_": {
        "MATEMATIK": dict(zip(range(1, 21),
            list("BBCBAADDDCCABCADBBAC"))),
        "FEN": dict(zip(range(1, 21),
            list("DABC BACDBBADCADBACC D".replace(" ", "")))),
    }
}


def anahtar_cikar(path):
    d = fitz.open(path)
    tam = "\n".join(d[i].get_text() for i in range(d.page_count))
    # TOC'taki "Cevap Anahtarı . . . 291" satirlarini temizle
    tam = re.sub(r"Cevap\s*Anahtarı\s*[\s.]*\d+", " ", tam)

    # her "CEVAP ANAHTARI" gecisini ayri degerlendir; en zengin olan sec
    en_iyi = {}
    for m in re.finditer(r"CEVAP\s*ANAHTARI", tam):
        # ders basligi "CEVAP ANAHTARI"ndan once de olabilir -> pencereyi genislet
        govde = tam[max(0, m.start() - 400): m.end() + 4000]
        # sonraki bolum basligina (orn. "SINAVLA ...") kadar kes
        govde = re.split(r"\n\s*\d{4}-\d{4} ", govde)[0]

        # 1) ders etiketlerini metin sirasina gore bul
        etiketler = []
        for kalip in [k[1] for k in DERS_KALIP]:
            for em in re.finditer(kalip, govde):
                etiketler.append((em.start(), kalip))
        etiketler.sort()
        # ayni ders tekrarlanmasin
        gorulen, sira = set(), []
        for pos, kalip in etiketler:
            if kalip in gorulen:
                continue
            gorulen.add(kalip)
            sira.append((pos, kalip))

        # 2) cevap bloklarini bul: 1. X 2. X ... ardışik diziler;
        #    numara kuculdugunde yeni ders bloku baslar
        bloklar = []
        for bm in re.finditer(r"(?:\d{1,3}\.\s*[A-D]\s*){5,}", govde):
            mevcut, onceki = {}, 0
            for n, h in re.findall(r"(\d{1,3})\.\s*([A-D])\b", bm.group(0)):
                n = int(n)
                if n <= onceki and mevcut:
                    bloklar.append((bm.start(), dict(mevcut)))
                    mevcut = {}
                mevcut[n] = h
                onceki = n
            if mevcut:
                bloklar.append((bm.start(), mevcut))
        bloklar.sort(key=lambda t: t[0])

        # 3) etiket sirasi ile blok sirasini eslestir
        blok = {}
        for i, (pos, kalip) in enumerate(sira):
            if i >= len(bloklar):
                break
            ad = next(a for a, k in DERS_KALIP if k == kalip)
            blok[ad] = dict(sorted(bloklar[i][1].items()))
        if sum(len(v) for v in blok.values()) > sum(len(v) for v in en_iyi.values()):
            en_iyi = blok
    return en_iyi


if __name__ == "__main__":
    sonuc = {}
    tot = 0
    for p in sorted(glob.glob(os.path.join(DISK, "Çıkmış", "*.pdf"))):
        ad = os.path.splitext(os.path.basename(p))[0]
        b = ELLE.get(ad) or anahtar_cikar(p)
        sonuc[ad] = b
        n = sum(len(v) for v in b.values())
        tot += n
        detay = " ".join(f"{k}:{len(v)}" for k, v in b.items())
        print(f"{ad[:48]:<50} {n:>4}  {detay}")
    print("TOPLAM:", tot)
    with open(os.path.join(OUT, "anahtarlar.json"), "w", encoding="utf-8") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=1)
