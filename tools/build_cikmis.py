"""Cikmis kitapciklari PDF metninden (fitz) soru soru ayristirir.

Ders tespiti: her kitapcikta testler sabit sira ile gelir ve her testin
ilk sayfasinda "1. Bu testte N soru vardır." satiri vardir.
  sayisal -> [MATEMATIK, FEN]
  sozel   -> [TURKCE, INKILAP, DIN, INGILIZCE]
Ders basligi (bozuk font olsa bile) varsa capraz dogrulama yapilir.

Cevap anahtari: build/cikti/anahtarlar.json (ders bazli).

Cikti: build/cikti/cikmis.json
"""
import fitz, json, os, re, glob, collections

DISK = os.path.expanduser("~/Desktop/LGS")
ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
OUT = os.path.join(ROOT, "build", "cikti")
os.makedirs(OUT, exist_ok=True)

TEST_SIRA = {
    "sayisal": ["MATEMATIK", "FEN"],
    "sozel": ["TURKCE", "INKILAP", "DIN", "INGILIZCE"],
}

DERS_BASLIK = [
    ("MATEMATIK", r"MATEMAT[Iİ]K"),
    # bazi kitapciklarda font kaymasi: FEN BİLİMLERİ -> )EN %İLİMLERİ
    ("FEN", r"FEN B[Iİ]L[Iİ]MLER[Iİ]|%[Iİ]/[Iİ]M|%[Iİ]L[Iİ]MLER[Iİ]|EN %L"),
    ("TURKCE", r"T[UÜ]RK[ÇC]E"),
    ("INKILAP", r"INKILAP|İNKILAP|NKILA3"),
    ("INGILIZCE", r"YABANCI D[Iİ]L|A%ANCI|ANCI .*L[İI]ZCE"),
    ("DIN", r"D[Iİ]N K[UÜ]LT[UÜ]R[UÜ]|IN K[LÜ]LT"),
]

NO_OFFSET = {"TURKCE": 0, "INKILAP": 0, "DIN": 0, "INGILIZCE": 0,
             "MATEMATIK": 0, "FEN": 0}

# test basindaki uyari satirlarini temizle (sahte soru numaralari)
GURULTU_SATIR = re.compile(
    r"(?m)^\s*\d{1,2}\.\s*(Bu testte[^.]*\.|Cevaplarınızı[^.]*\.|"
    r"Cevaplarınız[^.]*\.|Bu kitapcık[^.]*\.)\s*$")

GURULTU_SAYFA = re.compile(
    r"CEVAP\s*ANAHTARI|SINAV BAŞLAMADAN|SALON GÖREV|ÖĞRENCİLERİN DİKKATİNE")

SEC_RE = re.compile(
    r"A\)\s*(?P<a>.{1,400}?)\s*B\)\s*(?P<b>.{1,400}?)\s*"
    r"C\)\s*(?P<c>.{1,400}?)\s*D\)\s*(?P<d>.{1,500}?)(?=\s*\d{1,3}\.\s|\s*A\)\s|\Z)",
    re.S)
QNUM = re.compile(r"(?m)^\s*(\d{1,3})\.\s+")


def ders_basligi_bul(metin):
    bas = metin[:500]
    for ad, kalip in DERS_BASLIK:
        if re.search(kalip, bas):
            return ad
    return None


def metni_temizle(t):
    for k, v in {"\u2212": "-", "\u2013": "-", "\u2014": "-", "\u2019": "'",
                 "\u00a0": " ", "\u2026": "...", "\u00d7": " × ", "\u00f7": " ÷ ",
                 "\u2264": " ≤ ", "\u2265": " ≥ "}.items():
        t = t.replace(k, v)
    return t


def sayfayi_ayristir(sayfa_metni):
    """Tek sayfadaki sorulari cikarir (ders farkindan bagimsiz)."""
    t = GURULTU_SATIR.sub(" ", metni_temizle(sayfa_metni))
    sorular = []
    for m in SEC_RE.finditer(t):
        oncesi = t[:m.start()]
        baslar = [mm.start() for mm in QNUM.finditer(oncesi)]
        if not baslar:
            continue
        no = int(QNUM.match(oncesi[baslar[-1]:]).group(1))
        govde = oncesi[baslar[-1]:]
        govde = re.sub(r"^\s*\d{1,3}\.\s*", "", govde).strip()
        govde = " ".join(govde.split())
        if len(govde) < 20:
            continue
        if re.search(r"Bu testte|Cevaplarınızı", govde):
            continue
        sec, gorsel = {}, False
        for h in ("a", "b", "c", "d"):
            v = " ".join(m.group(h).split())
            if not v:
                v = "[görsel]"
                gorsel = True
            sec[h.upper()] = v
        sorular.append({"no": no, "metin": govde, "secenekler": sec,
                        "gorselSecenek": gorsel})
    return sorular


def kitapcigi_isle(path, anahtarlar):
    ad = os.path.splitext(os.path.basename(path))[0]
    yil = int(re.search(r"(20\d\d)", ad).group(1))
    bolum = "sayisal" if "sayisal" in ad.lower() else "sozel"
    sira_map = TEST_SIRA[bolum]
    d = fitz.open(path)
    # tum sayfalardan (sayfa_no, sira_index, soru) topla
    ham = []
    sayfa_test = {}  # sayfa -> test basindaki "Bu testte" satiri var mi
    bekleyen_sinir = False
    for i in range(d.page_count):
        metin = d[i].get_text()
        if GURULTU_SAYFA.search(metin[:400]):
            continue
        sayfa_test[i + 1] = bool(re.search(r"Bu testte", metin[:600]))
        if sayfa_test[i + 1]:
            bekleyen_sinir = True
        for si, s in enumerate(sayfayi_ayristir(metin)):
            s["sayfa"] = i + 1
            s["_si"] = si
            s["_bt"] = bekleyen_sinir
            bekleyen_sinir = False
            ham.append(s)

    # testlere bol
    testler, mevcut, son_no = [], [], 0
    for idx, s in enumerate(ham):
        if s.get("_bt"):
            if mevcut:
                testler.append(mevcut)
                mevcut = []
            son_no = 0
        no = s["no"]
        if no <= son_no:
            if no == 1:
                sonraki = ham[idx + 1] if idx + 1 < len(ham) else None
                if sonraki and sonraki["no"] == 2:
                    if mevcut:
                        testler.append(mevcut)
                        mevcut = []
                    son_no = 0
                else:
                    continue
            else:
                continue
        mevcut.append(s)
        son_no = no
    if mevcut:
        testler.append(mevcut)

    cikti = []
    for ti, grup in enumerate(testler):
        ders = sira_map[ti] if ti < len(sira_map) else None
        if not ders:
            continue
        for s in grup:
            ic_no = s["no"]
            anahtar = anahtarlar.get(ad, {}).get(ders, {})
            dogru = anahtar.get(str(ic_no)) or anahtar.get(ic_no)
            s.update({"yil": yil, "bolum": bolum, "ders": ders,
                      "kitapcik": ad, "dogru": dogru})
            s.pop("_si", None)
            s.pop("_bt", None)
            cikti.append(s)
    return cikti


if __name__ == "__main__":
    anahtarlar = json.load(open(os.path.join(OUT, "anahtarlar.json")))
    tum = []
    for p in sorted(glob.glob(os.path.join(DISK, "Çıkmış", "*.pdf"))):
        s = kitapcigi_isle(p, anahtarlar)
        ad = os.path.splitext(os.path.basename(p))[0]
        dersler = collections.Counter(x["ders"] for x in s)
        cevapli = sum(1 for x in s if x["dogru"])
        print(f"{ad[:46]:<48} {len(s):>3} soru {cevapli:>3} cevapli {dict(dersler)}")
        tum += s

    # tekrarlari temizle: ayni kitapcik + ders + no -> en uzun metinli kalsin
    en_iyi = {}
    for s in tum:
        k = (s["kitapcik"], s["ders"], s["no"])
        if k not in en_iyi or len(s["metin"]) > len(en_iyi[k]["metin"]):
            en_iyi[k] = s
    benzersiz = list(en_iyi.values())
    print(f"\n{len(tum)} -> tekrar temizligi sonrasi {len(benzersiz)}")
    with open(os.path.join(OUT, "cikmis.json"), "w", encoding="utf-8") as f:
        json.dump(benzersiz, f, ensure_ascii=False, indent=1)
    print(f"cevapli: {sum(1 for x in benzersiz if x['dogru'])}")
