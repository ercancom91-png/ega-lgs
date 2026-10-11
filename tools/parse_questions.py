"""PDF'lerden LGS sorularını ayrıştırır -> build/cikti/*.json

Kullanım:  python3 tools/parse_questions.py
Çıktı:    build/cikti/{kaynak}_{ders}.json
"""
import fitz, re, os, json, glob, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DISK = os.path.expanduser("~/Desktop/LGS")
OUT = os.path.join(ROOT, "build", "cikti")
os.makedirs(OUT, exist_ok=True)

# --- birim karakter -> unicode (parçalanmış matematik ifadeleri için) ---
UNI = {
    "\u2212": "-", "\u2013": "-", "\u2014": "-", "\u2019": "'", "\u2018": "'",
    "\u201c": '"', "\u201d": '"', "\u00a0": " ", "\u2026": "...",
    "\u00d7": "x", "\u00f7": "/", "\u2248": "~", "\u2264": "<=", "\u2265": ">=",
}
def norm(t: str) -> str:
    for k, v in UNI.items():
        t = t.replace(k, v)
    return t

# A) B) C) D) secenekleri tek satirda ya da satır başındaysa yakalanır
SEC_RE = re.compile(r"A\)\s*(?P<a>.{1,400}?)\s*B\)\s*(?P<b>.{1,400}?)\s*C\)\s*(?P<c>.{1,400}?)\s*D\)\s*(?P<d>.{1,500}?)(?=\s*\d{1,3}\.\s|\s*[A-D]\)\s|\Z)", re.S)
QNUM_RE = re.compile(r"(?m)^\s*(\d{1,3})\.\s+")

def cevap_anahtari_bul(tam: str):
    """Sayfa sonlarındaki 'CEVAP ANAHTARI' bloklarindan {ders: {no: harf}}."""
    out = {}
    for m in re.finditer(r"CEVAP\s*ANAHTARI(.*?)(?:Diğer sayfaya geçiniz|\Z)", tam, re.S):
        blok = m.group(1)
        ders = "GENEL"
        for num, harf in re.findall(r"(\d{1,3})\.\s*([A-D])\b", blok):
            out.setdefault(ders, {})[int(num)] = harf
    return out

def sayfalari_oku(path):
    d = fitz.open(path)
    return [norm(d[i].get_text()) for i in range(d.page_count)]

def ayristir(path, etiket):
    sayfalar = sayfalari_oku(path)
    tam = "\n".join(sayfalar)
    anahtar = cevap_anahtari_bul(tam)
    sorular = []
    for si, sayfa in enumerate(sayfalar):
        # cevap anahtari sayfalarini atla
        if re.search(r"CEVAP\s*ANAHTARI", sayfa) and len(sayfa) < 900:
            continue
        for m in SEC_RE.finditer(sayfa):
            oncesi = sayfa[:m.start()]
            nums = QNUM_RE.findall(oncesi)
            if not nums:
                continue
            no = int(nums[-1])
            soru_metni = oncesi[QNUM_RE.search(oncesi).start():].strip()
            # numarayi temizle
            soru_metni = re.sub(r"^\s*\d{1,3}\.\s*", "", soru_metni).strip()
            if len(soru_metni) < 25:
                continue
            secenekler = {
                "A": " ".join(m.group("a").split()),
                "B": " ".join(m.group("b").split()),
                "C": " ".join(m.group("c").split()),
                "D": " ".join(m.group("d").split()),
            }
            if any(len(v) < 1 for v in secenekler.values()):
                continue
            sorular.append({
                "no_pdf": no,
                "sayfa": si + 1,
                "metin": " ".join(soru_metni.split()),
                "secenekler": secenekler,
                "dogru": anahtar.get("GENEL", {}).get(no),
                "kaynak": etiket,
                "dosya": os.path.basename(path),
            })
    return sorular

if __name__ == "__main__":
    hedefler = [
        ("Çıkmış/*.pdf", "cikmis"),
        ("MEB/*.pdf", "meb"),
        ("Sorular/*.pdf", "sorular"),
    ]
    rapor = []
    for desen, etiket in hedefler:
        for path in sorted(glob.glob(os.path.join(DISK, desen))):
            try:
                s = ayristir(path, etiket)
            except Exception as e:
                print("HATA", path, e, file=sys.stderr)
                continue
            ad = f"{etiket}_{os.path.splitext(os.path.basename(path))[0]}.json"
            with open(os.path.join(OUT, ad), "w", encoding="utf-8") as f:
                json.dump(s, f, ensure_ascii=False, indent=1)
            cevapli = sum(1 for x in s if x["dogru"])
            rapor.append((etiket, os.path.basename(path), len(s), cevapli))
    print(f"\n{'KAYNAK':<10} {'DOSYA':<56} {'SORU':>5} {'CEVAPLI':>8}")
    print("-" * 84)
    for e, d, n, c in rapor:
        print(f"{e:<10} {d:<56} {n:>5} {c:>8}")
    print("-" * 84)
    print(f"{'TOPLAM':<67} {sum(r[2] for r in rapor):>5} {sum(r[3] for r in rapor):>8}")
