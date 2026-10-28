"""kursunkalem.com 8. sinif kazanim testlerini kesfeder ve indirir.

Her ders index sayfasindaki test sayfalarini gezer, o sayfadaki PDF baglantisini
ve cevap anahtari dosyasini cikarir. Dosyalar build/kaynaklar/kursun/<ders>/
altina, anahtar dosyasi "cevap_anahtari.pdf" adiyla kaydedilir; boylece
build_kazanim.py ayri anahtar modunu kullanir.

    python3 tools/indir_kursunkalem.py
"""
import os
import re
import subprocess
import sys
import urllib.parse

SITE = "http://www.kursunkalem.com"
DERSLER = [
    ("turkce", "turkce"),
    ("matematik", "matematik"),
    ("fen-bilimleri", "fen"),
    ("ingilizce", "ingilizce"),
    ("din-kulturu-ve-ahlak-bilgisi", "din"),
    ("t-c-inkilap-tarihi-ve-ataturkculuk", "inkilap"),
]
ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
HEDEF = os.path.join(ROOT, "build", "kaynaklar", "kursun")

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " \
     "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"


def indir(url, hedef, deneme=3):
    if os.path.exists(hedef) and os.path.getsize(hedef) > 1000:
        return True
    for i in range(deneme):
        p = subprocess.run(
            ["curl", "-skL", "--max-time", "90", "-A", UA, "-o", hedef, url],
            capture_output=True)
        if p.returncode == 0 and os.path.exists(hedef):
            with open(hedef, "rb") as f:
                if f.read(4) == b"%PDF":
                    return True
            os.remove(hedef)
    return False


def get(url):
    p = subprocess.run(["curl", "-skL", "--max-time", "60", "-A", UA, url],
                       capture_output=True)
    return p.stdout.decode("utf-8", "ignore")


def test_sayfalari(slug):
    """Ders index sayfasindaki test sayfalarinin linklerini toplar."""
    on = f"/kazanim-testleri/8-sinif/{slug}/"
    html = get(SITE + on)
    linkler = set(l for l in re.findall(r'href="(/kazanim-testleri/[^"]+)"',
                                        html) if l.startswith(on))
    genis = set(linkler)
    for l in linkler:
        h = get(SITE + l)
        genis |= set(x for x in re.findall(r'href="(/kazanim-testleri/[^"]+)"',
                                           h) if x.startswith(on))
    return sorted(genis)


def pdf_bul(sayfa_html):
    """Sayfadaki soru PDF'i ve cevap anahtari PDF'ini cikarir."""
    md = sayfa_html
    anahtar = None
    soru = None
    for m in re.finditer(r'href="([^"]+\.pdf)"', md, re.I):
        u = m.group(1)
        if "cevap" in u.lower():
            anahtar = u
        elif not soru:
            soru = u
    # iframe src de olabilir
    if not soru:
        m = re.search(r'<iframe[^>]+src="([^"]+\.pdf)"', md, re.I)
        if m:
            soru = m.group(1)
    return soru, anahtar


def mutlak(u):
    if u.startswith("//"):
        u = "http:" + u
    elif not u.startswith("http"):
        u = SITE + (u if u.startswith("/") else "/" + u)
    # bosluklu yollari kodla (orn. ".../Cebirsel Ifadeler.../x.pdf")
    yol = urllib.parse.urlsplit(u)
    return urllib.parse.urlunsplit(
        (yol.scheme, yol.netloc, urllib.parse.quote(yol.path, safe="/"),
         yol.query, yol.fragment))


UNITE_RE = re.compile(r"/(\d+)-(?:unite|tema)[^/]*/2019/?$")


def main():
    toplam = {}
    for slug, klasor in DERSLER:
        hedef = os.path.join(HEDEF, klasor)
        os.makedirs(hedef, exist_ok=True)
        sayfalar = test_sayfalari(slug)
        # yalnizca 2019 birim testleri: anahtari "N. Ünite" gruplari halinde
        # verilen tek cevap_anahtari.pdf dosyasiyla hatasiz eslesirler
        sayfalar = [s for s in sayfalar if UNITE_RE.search(s)]
        print(f"\n=== {slug}: {len(sayfalar)} birim testi ===")
        anahtar_indirildi = False
        alinan = 0
        for i, s in enumerate(sayfalar):
            html = get(SITE + s)
            soru_url, anahtar_url = pdf_bul(html)
            if not soru_url:
                continue
            birim = int(UNITE_RE.search(s).group(1))
            # dosya adi birim numarasiyla BITER: build_kazanim dis_anahtar_bul()
            # buradan "N. Ünite" anahtar grubunu dogru secer
            ad = f"{klasor}_unite_{birim}"
            if not indir(mutlak(soru_url), os.path.join(hedef, ad + ".pdf")):
                print(f"  ! indirilemedi: {soru_url}")
            else:
                alinan += 1
            if anahtar_url and not anahtar_indirildi:
                # ortak anahtar klasore bir kez konur (yedek aday)
                indir(mutlak(anahtar_url),
                      os.path.join(hedef, "cevap_anahtari.pdf"))
                anahtar_indirildi = True
        toplam[klasor] = alinan
        print(f"  -> {alinan} soru PDF'i, anahtar: "
              f"{'VAR' if anahtar_indirildi else 'YOK'}")

    print("\nÖZET:", toplam)


if __name__ == "__main__":
    main()
