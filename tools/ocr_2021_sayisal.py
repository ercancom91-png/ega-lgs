"""2021 Sayisal kitapciginin bozuk fontlu PDF'ini PNG'lerden OCR ile okur.

PDF'te gomulu font kirik oldugu icin metin katmani alinamaz; build/sayfalar/
altindaki 2021_SAYISAL__p*.png gorselleri latin model OCR ile okunur.

Cikti: build/ocr_sorular/2021_SAYISAL.json -> [{sayfa, satirlar:[{y,x,t,c}]}]
Ardindan tools/build_2021.py bu veriyi cikmis.json'a ek soru olarak yazar.
"""
import fitz, os, json, glob, re, sys, time
from rapidocr_onnxruntime import RapidOCR
from huggingface_hub import hf_hub_download

ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
PNG_DIR = os.path.join(ROOT, "build", "sayfalar")
PDF = os.path.expanduser("~/Desktop/LGS/Çıkmış/2021_SAYISAL_BOLUM_A_.pdf")
OUT = os.path.join(ROOT, "build", "ocr_sorular", "2021_SAYISAL.json")

det = hf_hub_download("monkt/paddleocr-onnx", "detection/v5/det.onnx")
rec = hf_hub_download("monkt/paddleocr-onnx", "languages/latin/rec.onnx")
dkl = hf_hub_download("monkt/paddleocr-onnx", "languages/latin/dict.txt")
ocr = RapidOCR(det_model_path=det, rec_model_path=rec, rec_keys_path=dkl)

if os.path.exists(OUT):
    print("zaten var:", OUT)
    sys.exit(0)

sayfalar = []
pencere = sorted(glob.glob(os.path.join(PNG_DIR, "2021_SAYISAL__p*.png")))
for yol in pencere:
    res, _ = ocr(yol)
    satirlar = []
    for box, txt, conf in (res or []):
        satirlar.append({
            "y": round(min(p[1] for p in box)),
            "x": round(min(p[0] for p in box)),
            "t": txt,
            "c": round(float(conf), 2),
        })
    satirlar.sort(key=lambda s: (s["y"], s["x"]))
    m = re.search(r"p(\d+)\.png$", os.path.basename(yol))
    no = int(m.group(1)) if m else len(sayfalar) + 1
    sayfalar.append({"sayfa": no, "satirlar": satirlar})
    print(f"p{no} okundu ({len(satirlar)} satir)", end="\r", flush=True)

sayfalar.sort(key=lambda p: p["sayfa"])
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(sayfalar, f, ensure_ascii=False)
print(f"\n{len(sayfalar)} sayfa -> {OUT}")
