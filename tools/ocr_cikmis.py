"""Cikmis kitapciklarinin sayfa gorsellerini OCR ile metne cevirir.

Cikti: build/ocr/{kitapcik}.json  -> [{sayfa, satirlar:[{y, x, metin, conf}]}]
"""
import fitz, os, json, glob, time, sys
from rapidocr_onnxruntime import RapidOCR

DISK = os.path.expanduser("~/Desktop/LGS")
OUT = "/Users/ercan/Documents/Qoder/lgs-hazirlik/build/ocr"
os.makedirs(OUT, exist_ok=True)

ocr = RapidOCR()

def isle(pdf_yolu, anahtar):
    cikti = os.path.join(OUT, anahtar + ".json")
    if os.path.exists(cikti):
        return
    d = fitz.open(pdf_yolu)
    sayfalar = []
    for i in range(d.page_count):
        pm = d[i].get_pixmap(matrix=fitz.Matrix(2.0, 2.0))
        tmp = "/tmp/_ocr.png"
        pm.save(tmp)
        res, _ = ocr(tmp)
        satirlar = []
        for box, txt, conf in (res or []):
            x = round(min(p[0] for p in box))
            y = round(min(p[1] for p in box))
            satirlar.append({"y": y, "x": x, "t": txt, "c": round(float(conf), 2)})
        satirlar.sort(key=lambda s: (s["y"], s["x"]))
        sayfalar.append({"sayfa": i + 1, "satirlar": satirlar})
    with open(cikti, "w", encoding="utf-8") as f:
        json.dump(sayfalar, f, ensure_ascii=False)
    print(f"  {anahtar}: {d.page_count} sayfa -> {cikti}", flush=True)

if __name__ == "__main__":
    bas = time.time()
    for p in sorted(glob.glob(os.path.join(DISK, "Çıkmış", "*.pdf"))):
        anahtar = os.path.splitext(os.path.basename(p))[0]
        try:
            isle(p, anahtar)
        except Exception as e:
            print("HATA", anahtar, e, file=sys.stderr)
    print(f"\ntoplam {time.time()-bas:.0f} sn")
