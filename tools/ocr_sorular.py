"""Sorular klasorundeki (Sinerji soru bankalari) PDF'leri OCR ile metne cevirir.

Motor: RapidOCR + PP-OCRv5 det + latin (Turkce destekli) tanima modeli.
Varsayilan Cince mobil model kelimeleri birlestirdigi icin latin model kullanilir.

Cikti: build/ocr_sorular/{dosya}.json -> [{sayfa, satirlar:[{y,x,t,c}]}]
"""
import fitz, os, json, glob, time, sys
from rapidocr_onnxruntime import RapidOCR
from huggingface_hub import hf_hub_download

DISK = os.path.expanduser("~/Desktop/LGS/Sorular")
OUT = "/Users/ercan/Documents/Qoder/lgs-hazirlik/build/ocr_sorular"
os.makedirs(OUT, exist_ok=True)

det = hf_hub_download("monkt/paddleocr-onnx", "detection/v5/det.onnx")
rec = hf_hub_download("monkt/paddleocr-onnx", "languages/latin/rec.onnx")
dkl = hf_hub_download("monkt/paddleocr-onnx", "languages/latin/dict.txt")
ocr = RapidOCR(det_model_path=det, rec_model_path=rec, rec_keys_path=dkl)

ZOOM = 3.0


def isle(pdf_yolu, anahtar):
    cikti = os.path.join(OUT, anahtar + ".json")
    if os.path.exists(cikti):
        return
    d = fitz.open(pdf_yolu)
    sayfalar = []
    for i in range(d.page_count):
        pm = d[i].get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM))
        tmp = "/tmp/_ocr_s.png"
        pm.save(tmp)
        res, _ = ocr(tmp)
        satirlar = []
        for box, txt, conf in (res or []):
            x = round(min(p[0] for p in box))
            y = round(min(p[1] for p in box))
            satirlar.append({"y": y, "x": x, "t": txt, "c": round(float(conf), 2)})
        satirlar.sort(key=lambda s: (s["y"], s["x"]))
        sayfalar.append({"sayfa": i + 1, "satirlar": satirlar})
        print(f"  {anahtar} s{i+1}/{d.page_count}", end="\r", flush=True)
    with open(cikti, "w", encoding="utf-8") as f:
        json.dump(sayfalar, f, ensure_ascii=False)
    print(f"  {anahtar}: {d.page_count} sayfa OK")


if __name__ == "__main__":
    bas = time.time()
    for p in sorted(glob.glob(os.path.join(DISK, "*.pdf"))):
        anahtar = os.path.splitext(os.path.basename(p))[0]
        try:
            isle(p, anahtar)
        except Exception as e:
            print("HATA", anahtar, e, file=sys.stderr)
    print(f"\ntoplam {time.time()-bas:.0f} sn")
