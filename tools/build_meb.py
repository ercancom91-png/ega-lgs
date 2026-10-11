"""MEB LGS calisma kitaplarindan soru ayristirir.

Yapi:
  ders (TOC basligi) -> bolum (Tema / Ünite / Unit) -> sorular
  Cevap anahtari: "N. Tema/Ünite/Unit" baslikli bloklar (kitap sonunda)
  "20XX-20XX Merkezî Sınav Soruları" bolumleri atlanir (zaten cikmis verisi)

Cikti: build/cikti/meb.json
"""
import fitz, json, os, re, glob, collections

DISK = os.path.expanduser("~/Desktop/LGS/MEB")
OUT = "/Users/ercan/Documents/Qoder/lgs-hazirlik/build/cikti"
os.makedirs(OUT, exist_ok=True)

DERS_AD = [
    ("MATEMATIK", r"^MATEMAT[Iİ]K$"),
    ("FEN", r"^FEN B[Iİ]L[Iİ]MLER[Iİ]$"),
    ("TURKCE", r"^T[UÜ]RK[ÇC]E$"),
    ("INKILAP", r"^T\.?C\.? ?INKILAP|^T\.C\. İNKILAP"),
    ("DIN", r"^D[Iİ]N K[UÜ]LT"),
    ("INGILIZCE", r"^YABANCI D[Iİ]L"),
]

BOLUM_RE = re.compile(
    r"^(\d+|Unit\s*\d+)\s*[:.]\s*(.+?)\s*(?:\.\s*){2,}(\d+)\s*$", re.M)
SINAV_RE = re.compile(r"Merkez[îi] Snav|Merkezî Sınav|Sorular[ıi]", re.I)

SEC_RE = re.compile(
    r"A\)\s*(?P<a>.{1,400}?)\s*B\)\s*(?P<b>.{1,400}?)\s*"
    r"C\)\s*(?P<c>.{1,400}?)\s*D\)\s*(?P<d>.{1,500}?)(?=\s*\d{1,3}\.\s|\s*A\)\s|\Z)",
    re.S)
QNUM = re.compile(r"(?m)^\s*(\d{1,3})\.\s+")


def temizle(t):
    for k, v in {"\u2212": "-", "\u2013": "-", "\u2014": "-", "\u2019": "'",
                 "\u00a0": " ", "\u2026": "...", "\u00f7": " / ", "\u2264": " <= ",
                 "\u2265": " >= "}.items():
        t = t.replace(k, v)
    return t


def sayfayi_ayristir(sayfa_metni):
    t = temizle(sayfa_metni)
    sorular = []
    for m in SEC_RE.finditer(t):
        oncesi = t[:m.start()]
        baslar = [mm.start() for mm in QNUM.finditer(oncesi)]
        if not baslar:
            continue
        no = int(QNUM.match(oncesi[baslar[-1]:]).group(1))
        govde = re.sub(r"^\s*\d{1,3}\.\s*", "", oncesi[baslar[-1]:]).strip()
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


def toc_coz(d):
    """TOC'den (sayfa, ders, bolum, bolumNo, sinav) listesi."""
    metin = ""
    for i in range(min(14, d.page_count)):
        metin += d[i].get_text()
    girdi = []
    ders = None
    # "Cevap Anahtarı" basliklarini ayri yaka (ders bazli)
    for satir in metin.split("\n"):
        s = satir.strip()
        if not s:
            continue
        for ad, kalip in DERS_AD:
            if re.match(kalip, s):
                ders = ad
                break
        if SINAV_RE.search(s):
            m = re.search(r"(?:\.\s*){2,}(\d+)", s)
            if m:
                girdi.append({"sayfa": int(m.group(1)), "ders": ders,
                              "bolum": "SINAV", "sinav": True})
            continue
        m = BOLUM_RE.match(s)
        if m and ders:
            raw = m.group(1)
            no = int(raw.replace("Unit", "").strip()) if "Unit" in raw else int(raw)
            girdi.append({"sayfa": int(m.group(3)), "ders": ders,
                          "bolum": m.group(2).strip(), "no": no, "sinav": False})
        elif ders and re.search(r"Cevap Anaht", s):
            m2 = re.search(r"\.{2,}\s*(\d+)", s)
            if m2:
                girdi.append({"sayfa": int(m2.group(1)), "ders": ders,
                              "bolum": "CEVAP", "sinav": True})
    girdi.sort(key=lambda g: g["sayfa"])
    return girdi


def anahtar_cikar(d):
    """'N. Tema/Ünite/Unit' baslikli cevap anahtari -> {(ders, no): {no: harf}}."""
    anahtar = collections.defaultdict(dict)
    BAS_RE = re.compile(r"(?m)^\s*(?:\d+\.\s*(?:Tema|Ünite)|Unit\s*\d+|"
                        r"\d+\.\s*Ünite)\s*$")
    IC_BAS_RE = re.compile(r"(?m)^\s*(?:\d+)\.\s*(?:Tema|Ünite)\s*$")
    BAS_NO_RE = re.compile(r"(\d+)\.\s*(?:Tema|Ünite)|Unit\s*(\d+)")
    for i in range(d.page_count):
        t = d[i].get_text()
        if "CEVAP ANAHTARI" not in t.upper():
            continue
        olaylar = []
        for m in BAS_NO_RE.finditer(t):
            satir = t[max(0, t.rfind("\n", 0, m.start()) + 1):
                      t.find("\n", m.end())]
            if len(satir.strip()) > 30:
                continue  # govde icinde gecen sahte baslik
            no = int(m.group(1) or m.group(2))
            olaylar.append((m.start(), "baslik", no))
        for m in re.finditer(r"(?m)^\s*(\d{1,3})\.\s*([A-D])\s*$", t):
            olaylar.append((m.start(), "cevap", (int(m.group(1)), m.group(2))))
        olaylar.sort()
        aktif = None
        for _, tur, veri in olaylar:
            if tur == "baslik":
                aktif = veri
            elif aktif is not None:
                anahtar[aktif][veri[0]] = veri[1]
    return anahtar


def kitabi_isle(path):
    ad = os.path.splitext(os.path.basename(path))[0]
    d = fitz.open(path)
    girdi = toc_coz(d)
    anahtar = anahtar_cikar(d)

    # bolum araliklari
    bolumler = [g for g in girdi if not g.get("sinav")]
    cikti = []
    for bi, g in enumerate(bolumler):
        bas = g["sayfa"]
        bit = (bolumler[bi + 1]["sayfa"] - 1) if bi + 1 < len(bolumler) \
            else d.page_count
        son_no = 0
        for i in range(bas - 1, min(bit, d.page_count)):
            t = d[i].get_text()
            if "CEVAP ANAHTARI" in t.upper():
                continue
            for s in sayfayi_ayristir(t):
                if s["no"] <= son_no:
                    continue
                son_no = s["no"]
                dogru = anahtar.get(g["no"], {}).get(str(s["no"])) \
                    or anahtar.get(g["no"], {}).get(s["no"])
                s.update({"ders": g["ders"], "konu": g["bolum"],
                          "bolumNo": g["no"], "kitap": ad, "dogru": dogru})
                cikti.append(s)
    return cikti


if __name__ == "__main__":
    tum = []
    for p in sorted(glob.glob(os.path.join(DISK, "*.pdf"))):
        s = kitabi_isle(p)
        n = sum(1 for x in s if x["dogru"])
        print(f"{os.path.basename(p):<24} {len(s):>5} soru  {n:>5} cevapli  "
              f"{dict(collections.Counter(x['ders'] for x in s))}")
        tum += s
    with open(os.path.join(OUT, "meb.json"), "w", encoding="utf-8") as f:
        json.dump(tum, f, ensure_ascii=False, indent=1)
    print(f"\nTOPLAM {len(tum)} soru | cevapli {sum(1 for x in tum if x['dogru'])}")
