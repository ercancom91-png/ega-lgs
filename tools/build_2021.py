"""2021 Sayisal kitapcigini OCR ciktisindan (build/ocr_sorular/2021_SAYISAL.json)
cikmis.json semasina cevirir ve cikmis.json'a ekler.

PDF metin katmani kirik oldugu icin PNG'ler latin-model OCR ile okundu
(tools/ocr_2021_sayisal.py).

Kitapcik yapisi (OCR ile dogrulandi):
  p2-p19   -> MATEMATIK, sorular 1..20 (kendi basina numaralanir)
  p20-p31  -> FEN BILIMLERI, sorular 1..20
  p32      -> sinav uyarilari, p33 -> cevap anahtari (iki sutun)

Cevap anahtari (p33 PNG'si gorsel olarak dogrulandi; ELLE'deki MAT
degerleri 3-7. pozisyonlarda hataliydi):
  Matematik BBDCABADDCCABCADBBAC
  Fen       DABCBACDBBADCADBACCD
"""
import json, os, re, sys

ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
OCR = os.path.join(ROOT, "build", "ocr_sorular", "2021_SAYISAL.json")
CIKTI = os.path.join(ROOT, "build", "cikti", "cikmis.json")

# gorsel olarak dogrulanmis cevap anahtarlari (p33)
ELLE_MAT = "BBDCABADDCCABCADBBAC"
ELLE_FEN = "DABCBACDBBADCADBACCD"

DERS_BAS = [
    ("MATEMATIK", re.compile(r"MATEMAT[Iİ]K", re.I)),
    ("FEN", re.compile(r"FEN[ .]?B[Iİ]L", re.I)),
]

QNUM = re.compile(r"(?<![\d.)])(\d{1,2})\.\s+(?=[A-Za-zÇĞİÖŞÜçğıöşü0-9•(])")
# siklar genelde tek satirda yan yana gelir; lookahead gevsek birakilir
SEC = re.compile(
    r"A\)\s*(?P<a>.{1,400}?)\s*B\)\s*(?P<b>.{1,400}?)\s*"
    r"C\)\s*(?P<c>.{1,400}?)\s*D\)\s*(?P<d>.{1,500}?)(?=\s*\Z|\s*A\)\s)",
    re.S)
GURULTU = re.compile(
    r"(Diğer sayfaya geç|Diğer soruya geç|SINAV BAŞLAMADAN|UYARILARI"
    r"|SINAV GÖREV|Başlama zilini|başarilar dileriz|Kitapçığ|kitapçi"
    r"|KURUMLARINA|CEVAP ANAHTARI|B[İI]L[İI]MLER[İI] EG[Iİ]T[Iİ]M|MATEMAT[Iİ]K\.?\s*$)")


def sayfa_dersi(p):
    ust = [s["t"] for s in sorted(p["satirlar"], key=lambda x: (x["y"], x["x"]))
           if s["y"] < 130]
    metin = " ".join(ust)
    for ders, kalip in DERS_BAS:
        if kalip.search(metin):
            return ders
    return None


def sayfa_metni(p):
    satirlar = sorted(p["satirlar"], key=lambda s: (s["y"], s["x"]))
    parcalar = []
    for s in satirlar:
        t = s["t"].strip()
        if not t or GURULTU.search(t):
            continue
        parcalar.append(t)
    return " ".join(" ".join(parcalar).split())


def temizle(v):
    v = " ".join((v or "").split())
    v = re.sub(r"\s*\$\s*$", "", v)          # OCR artigi dolar isaretleri
    v = v.replace("\u2212", "-").replace("\u2013", "-")
    return v.strip()


def ayristir(metin):
    """Sayfadaki A) B) C) D) gruplarini soru olarak uretir.

    Her sik grubundan once gelen en yakin soru numarasi o sorunun numarasidir.
    """
    sorular = []
    for m in SEC.finditer(metin):
        oncesi = metin[: m.start()]
        numaralar = list(QNUM.finditer(oncesi))
        if not numaralar:
            continue
        son = numaralar[-1]
        no = int(son.group(1))
        govde = oncesi[son.end():].strip()
        govde = " ".join(govde.split())
        if len(govde) < 20:
            continue
        if re.search(r"Bu testte|Cevaplarınızı|cevap kâğıd", govde, re.I):
            continue
        sec = {h.upper(): temizle(m.group(h)) for h in ("a", "b", "c", "d")}
        if not all(sec.values()):
            continue
        sorular.append({"no": no, "metin": govde, "secenekler": sec,
                        "gorselSecenek": False})
    return sorular


def main():
    if not os.path.exists(OCR):
        print("OCR ciktisi yok:", OCR, file=sys.stderr)
        sys.exit(1)

    sayfalar = json.load(open(OCR, encoding="utf-8"))
    # ders bazli: no -> soru (ayni no birden fazla gorunurse ilkini al)
    toplam = {}
    for p in sayfalar:
        ders = sayfa_dersi(p)
        if not ders or p["sayfa"] in (1, 32, 33):
            continue
        for s in ayristir(sayfa_metni(p)):
            if not 1 <= s["no"] <= 20:
                continue
            toplam.setdefault(ders, {}).setdefault(s["no"], s)

    cikti = []
    for ders, anahtar in (("MATEMATIK", ELLE_MAT), ("FEN", ELLE_FEN)):
        bulunan = toplam.get(ders, {})
        for no in range(1, 21):
            s = bulunan.get(no)
            if not s:
                print(f"  eksik: {ders} {no}")
                continue
            cikti.append({
                "no": no, "metin": s["metin"], "secenekler": s["secenekler"],
                "gorselSecenek": False, "sayfa": s.get("sayfa"),
                "yil": 2021, "bolum": "sayisal", "ders": ders,
                "kitapcik": "2021_SAYISAL_BOLUM_A_", "dogru": anahtar[no - 1],
            })
        print(f"{ders}: {len(bulunan)}/20 soru okundu")

    tum = json.load(open(CIKTI, encoding="utf-8"))
    tum = [x for x in tum
           if not (x.get("yil") == 2021 and x.get("bolum") == "sayisal")]
    tum.extend(cikti)
    tum.sort(key=lambda x: (x.get("yil", 0), x.get("kitapcik", ""),
                            x.get("bolum", ""), x.get("no", 0)))
    with open(CIKTI, "w", encoding="utf-8") as f:
        json.dump(tum, f, ensure_ascii=False, indent=1)
    print(f"2021 sayisal: {len(cikti)} soru eklendi; toplam {len(tum)}")


if __name__ == "__main__":
    main()
