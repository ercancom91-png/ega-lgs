"""kursunkalem.com — 2018 KAZANIM TESTLERI (konu bazli sayfalar).

Sayfa basinda IKI PDF vardir:
  1) testin kendisi        ("CUMLE TURLERI - 1 / Test 24 / TURKCE / 1. ...")
  2) kitabin CEVAP ANAHTARI ("CEVAP ANAHTARI / Test 1 ... Test 32")

Eski indirici yalnizca URL'de "cevap" gecen dosyayi anahtar sanirdigi icin bu
sayfalardan hic anahtar kaydedilmemisti (185 dosyanin hepsi anahtarsizdi).

Burada:
  - PDF'ler icerikten siniflandirilir (anahtar mi soru mu)
  - testin kendi basligindaki NUMARA cikarilir -> dosya "TEST_24_...pdf"
    olur; build_kazanim.py dis_anahtar_bul() bu numaradan dogru anahtar
    grubunu secer (tahmin yok, eslesmeyen numara atlanir)
  - kitap anahtari klasore TEK KEZ "cevap_anahtari.pdf" olarak konur

Kayit: build/kaynaklar/kursun2018/<ders>/TEST_<no>_<konu>.pdf

Ayri klasor (kursun2018) onemlidir: oradaki kitap anahtari "Test 1..32"
grupluyken, eski kursun klasorunun cevap_anahtari.pdf dosyasi "1. Tema"
gruplidir; ikisi ayni klasorde birbirini ezer.
"""
import os
import re
import sys
import shutil
import urllib.parse

import fitz

SITE = "http://www.kursunkalem.com"
KOK = "/kazanim-testleri/8-sinif/"
HEDEF = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                     "build", "kaynaklar", "kursun2018")

DERSLER = [
    ("turkce", "turkce"),
    ("matematik", "matematik"),
    ("fen-bilimleri", "fen"),
    ("ingilizce", "ingilizce"),
    ("din-kulturu-ve-ahlak-bilgisi", "din"),
    ("t-c-inkilap-tarihi-ve-ataturkculuk", "inkilap"),
]

# birim sayfalari ayri indiricinin isi (indir_kursunkalem.py)
BIRIM = re.compile(r"/(\d+)-(?:unite|tema)[^/]*/2019/?$")


def get(url, ksayfa=8):
    if "=" in url and "page" not in url:
        url += ("&" if "?" in url else "?") + "page=%d"
    say = url % ksayfa if "%d" in url else url
    p = subprocess_run(["curl", "-skL", "--max-time", "60",
                        "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                              "AppleWebKit/537.36 (KHTML, like Gecko) "
                              "Chrome/122.0 Safari/537.36",
                        "-H", "Accept-Language: tr-TR,tr;q=0.9", say])
    return p or ""


def subprocess_run(args):
    import subprocess
    try:
        return subprocess.run(args, capture_output=True, timeout=90).stdout.decode(
            "utf-8", "replace")
    except Exception:
        return ""


def mutlak(u):
    if u.startswith("//"):
        u = "http:" + u
    elif not u.startswith("http"):
        u = SITE + (u if u.startswith("/") else "/" + u)
    b = urllib.parse.urlsplit(u)
    return urllib.parse.urlunsplit((b.scheme, b.netloc,
                                    urllib.parse.quote(b.path, safe="/"),
                                    b.query, b.fragment))


def indir(url, hedef):
    if os.path.exists(hedef) and os.path.getsize(hedef) > 1000:
        return True
    import subprocess
    try:
        subprocess.run(["curl", "-skL", "--max-time", "120", "-A",
                        "Mozilla/5.0", "-o", hedef, url], timeout=140,
                       check=False)
    except Exception:
        return False
    return os.path.exists(hedef) and os.path.getsize(hedef) > 1000


def test_sayfalari(slug):
    html = get(SITE + KOK + slug + "/")
    bag = set(re.findall(r'href="(/kazanim-testleri/8-sinif/' + re.escape(slug)
                         + r'/[^"#?]+)"', html))
    return sorted(s for s in bag if not BIRIM.search(s + "/"))


def metin(yol):
    try:
        d = fitz.open(yol)
        t = "\n".join(p.get_text("text") for p in d)
        d.close()
        return t
    except Exception:
        return ""


def anahtar_mi(t):
    """PDF cevap anahtari mi? (testin icinde tek cevap bolumu ayristirir)"""
    if len(set(re.findall(r"(?m)^\s*Test\s+(\d{1,2})\s*$", t))) >= 3:
        return True
    if re.search(r"(?m)^\s*CEVAP\s+ANAHTARI\s*$", t) and not re.search(r"[A-D]\)\s", t):
        return True
    return False


# kursunkalem kendi HTML'inde klasor adini kirpar; kirilmis yolda PDF yerine
# 24 KB'lik tanitim PDF'i donurur (404 degil, 200 + yanlis icerik)
KIRPMA = [("kazanim-testleri-8-sinif/din-kulturu-ve-ahlak-bilg/",
           "kazanim-testleri-8-sinif/din-kulturu-ve-ahlak-bilgisi/")]


def tam_yol(u):
    for eski, yeni in KIRPMA:
        u = u.replace(eski, yeni)
    return u


def gercek_pdf_mi(t):
    """Indirilen dosya gercek test/anahtar mi, yoksa sitenin tanitim PDF'i mi?"""
    if not t or len(t) < 300:
        return False
    if re.search(r"(?i)Tarihte b[üu]g[üu]n|Ders Notlar[ıi]|©|Men[üu]", t):
        return False
    return True


def test_no_bul(t):
    """Testin global numarasi.

    MEB kitaplarinda 'Test' satirinin ALTINDA numara durur, ancak bu baslik
    bazen sayfa 1'in sonunda ya da sayfa 2'nin basinda cikar (orn. 'FOTOSENTEZ
    / Test / 26'); bu yuzden tum belge taranir. Yalnizca satir bazli aranir ki
    'KAZANIM KAVRAMA TESTI 8. SINIF' gibi ifadeler sinif numarasi sanilmasin."""
    m = re.search(r"(?m)^\s*Test\s*$[\r\n]+\s*(\d{1,2})\s*$", t)
    if m:
        return int(m.group(1))
    m = re.search(r"(?m)^\s*Test\s+(\d{1,2})\s*$", t)
    if m:
        return int(m.group(1))
    return None


def anahtar_adlari(html):
    return sorted(set(re.findall(r'(?:href|src)\s*=\s*"([^"]+\.pdf)"', html, re.I)))


def main():
    ozet = {}
    for slug, klasor in DERSLER:
        hedef = os.path.join(HEDEF, klasor)
        os.makedirs(hedef, exist_ok=True)
        for f in list(os.listdir(hedef)):          # onceki calismadan kalma
            if f.startswith("_tmp"):
                os.remove(os.path.join(hedef, f))
        sayfalar = test_sayfalari(slug)
        print(f"\n=== {klasor}: {len(sayfalar)} konu sayfasi ===")

        anahtar_yol = os.path.join(hedef, "cevap_anahtari.pdf")
        anahtar_url = None            # kitap anahtarinin URL'deki adi (bir kez)
        alinan, atlanan = 0, 0
        mevcut = {f for f in os.listdir(hedef) if f.endswith(".pdf")}

        for s in sayfalar:
            slug_ad = re.sub(r"[^A-Za-z0-9]+", "_", os.path.basename(
                s.rstrip("/").split("/")[-1]))[:44] or "konu"
            # sayfa zaten indirilmis mi? (dosya adi sayfa slug'i ile biter)
            if any(f.endswith("_" + slug_ad + ".pdf") for f in mevcut):
                alinan += 1
                continue
            html = get(SITE + s)
            pdfler = anahtar_adlari(html) if html else []
            if not pdfler:
                atlanan += 1
                continue

            def gecici_sil(tut=()):
                for f in list(os.listdir(hedef)):
                    p = os.path.join(hedef, f)
                    if f.startswith("_tmp") and p not in tut:
                        os.remove(p)

            soru_tmp, anahtar_tmp = [], []
            for i, u in enumerate(pdfler):
                # kitap anahtari zaten kayitli: her sayfada tekrar indirme
                if anahtar_url is not None and os.path.basename(u) == anahtar_url \
                        and os.path.exists(anahtar_yol):
                    anahtar_tmp.append((u, anahtar_yol))
                    continue
                tmp = os.path.join(hedef, f"_tmp{i}.pdf")
                if os.path.exists(tmp):
                    os.remove(tmp)                  # indir() var olani atlar
                if not indir(mutlak(u), tmp):
                    continue
                if not gercek_pdf_mi(metin(tmp)):   # tanitim PDF'i / kirik yol
                    os.remove(tmp)
                    if not indir(mutlak(tam_yol(u)), tmp) or \
                            not gercek_pdf_mi(metin(tmp)):
                        if os.path.exists(tmp):
                            os.remove(tmp)
                        continue
                hedef_liste = anahtar_tmp if anahtar_mi(metin(tmp)) else soru_tmp
                hedef_liste.append((u, tmp))

            # kesin eslesme: tam 1 soru + en az 1 anahtar (tahmin yok)
            if len(soru_tmp) != 1 or not anahtar_tmp:
                gecici_sil()
                atlanan += 1
                continue

            sp = soru_tmp[0][1]
            no = test_no_bul(metin(sp))
            if no is None:                           # test numarasi yok -> atla
                gecici_sil()
                atlanan += 1
                continue

            stem = f"TEST_{no}_{slug_ad}"
            yol = os.path.join(hedef, stem + ".pdf")
            if os.path.exists(yol):                 # ayni test ikinci kez
                gecici_sil()
                atlanan += 1
                continue

            # anahtari yerlestir: kitap anahtari klasore bir kez, farkli bir
            # anahtar varsa yalnizca o testin yanina (_ca.pdf)
            aup, ap = anahtar_tmp[0]
            ad = os.path.basename(aup)
            if anahtar_url is None:
                if ap != anahtar_yol:
                    if os.path.exists(anahtar_yol):
                        os.remove(ap)
                    else:
                        shutil.move(ap, anahtar_yol)
                anahtar_url = ad
            elif ad != anahtar_url and ap != anahtar_yol:
                shutil.move(ap, os.path.join(hedef, stem + "_ca.pdf"))
            for _, p in anahtar_tmp[1:]:
                if p != anahtar_yol and os.path.exists(p):
                    os.remove(p)

            shutil.move(sp, yol)
            mevcut.add(stem + ".pdf")
            gecici_sil()
            alinan += 1

        ozet[klasor] = alinan
        print(f"  -> {alinan} test indirildi, {atlanan} atlandi, "
              f"anahtar: {'VAR' if os.path.exists(anahtar_yol) else 'YOK'}")

    print("\nÖZET:", ozet)


if __name__ == "__main__":
    main()
