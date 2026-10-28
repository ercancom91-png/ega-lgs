"""Sinerji soru bankasi OCR ciktisini (build/ocr_sorular) sorulara ayristirir.

Cikti: build/cikti/sorular.json  (build_havuz.py ile ayni sema)

Yapi:
  Matematik kitabi : sayfa ustu baslik = bolum adi ("CARPANLAR KATLAR"),
                      soru numaralari bolum icinde kesintisiz 1..N,
                      cevap anahtari "Bolum N: <ad>" + numara/harf tablosu.
  Turkce kitabi    : sayfa ustu baslik = "TEST - N" + konu ("SOZCUKTE ANLAM"),
                      soru numaralari test icinde 1..N,
                      cevap anahtari "N. Unite: <konu>" + TEST tablolari.
"""
import difflib, json, os, re, sys, unicodedata, collections

ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
OCR_DIR = os.path.join(ROOT, "build", "ocr_sorular")
OUT = os.path.join(ROOT, "build", "cikti", "sorular.json")


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


# konu adlarinda anlam tasimayan durak kelimeler
DURAK = {"ve", "ile", "icin", "the", "of", "unite", "bolum", "test", "konu"}


def eslesme(var, ad):
    """Sayfa basligi ile anahtar adi eslesir mi?

    OCR hatalarina dayanikli olsun diye hem alt-dizek hem de karakter
    benzerligi (difflib) kullanilir; esik 0.60.
    """
    a, b = norm(var), norm(ad)
    if not a or not b:
        return False
    a = re.sub(r"\s+", " ", re.sub(r"\b(ve|ile|icin|the)\b", " ", a)).strip()
    b = re.sub(r"\s+", " ", re.sub(r"\b(ve|ile|icin|the)\b", " ", b)).strip()
    if a == b or (len(a) > 4 and len(b) > 4 and (a in b or b in a)):
        return True
    if not a or not b:
        return False
    oran = difflib.SequenceMatcher(None, a, b).ratio()
    # kelime bazli: anahtar adinin TUM anlami kelimeleri karsilanmali
    # (ortalama gevsekligi "esitsizlikler" -> "ozdeslikler" gibi yanlis
    # eslesmelere yol aciyordu)
    ka, kb = a.split(), b.split()
    if ka and kb:
        kelimeler = [
            max(difflib.SequenceMatcher(None, w, v).ratio() for v in kb)
            for w in ka
        ]
        kelime_oran = sum(kelimeler) / len(kelimeler)
        oran = max(oran, kelime_oran)
    return oran >= 0.80


NOISE = re.compile(
    r"(sinerji|hiper\s*zeka|x\s*bank|\bvisa\b"
    r"|yeni\s*nes[ıi]l|di[ğg]er (sayfaya|soruya)|sayfaya gec|soruya gec"
    r"|^qr\b|www\.|\.com|@|sinif soru)",
    re.I,
)

QNUM = re.compile(r"^(\d{1,2})\.\s*")
OPT_BAS = re.compile(r"(?<![A-Za-zÇĞİÖŞÜıçğıöşü])([A-D])\)")
TEST_BAS = re.compile(r"TEST\s*[-–—]?\s*(\d{1,2})\b", re.I)
UNITE_BAS = re.compile(r"(\d{1,2})\.?\s*[ÜuU]nite\s*:?\s*(.+)")
BOLUM_BAS = re.compile(r"b[öoıi]l[üu]m\s*(\d{1,2})\s*:?\s*(.+)", re.I)
CEVAP_SAYFA = re.compile(r"cevap\s*anahtar", re.I)
SAYI_TOKEN = re.compile(r"^\d{1,3}$")
HARF_TOKEN = re.compile(r"^([A-D])$")

# metinle baslayan sorularda kucuk harfle baslayabilen gercek acilislar
# (tablo satirlari "oyuncu", "adim" gibi uzun kelimelerle baslar -> elenir)
SAHNE_KELIME = {
    "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz",
    "aşağıdaki", "yukarıdaki", "aşagidaki", "yukaridaki", "verilen",
    "belirtilen", "ölçülen", "sayesinde", "olduğuna", "göre", "buna",
    "şekilde", "şekildeki", "cümlede", "cümlelerin", "paragrafta",
}


def gurultu_mu(metin):
    n = norm(metin)
    if not n:
        return True
    if NOISE.search(metin):
        return True
    if re.fullmatch(r"\d{1,3}", n):
        return True
    return False


# ------------------------------------------------------------ cevap anahtari

def anahtar_ayristir(sayfalar, tur):
    """Cevap anahtari tablolarini okur.

    tur == 'mat':  bolum adi -> {no: harf}
    tur == 'tr':   konu adi  -> {test_no: {no: harf}}
    """
    if tur == "mat":
        sonuc, aktif = {}, None
    else:
        sonuc, aktif_unite, aktif_test = {}, None, None

    for p in sayfalar:
        if not any(CEVAP_SAYFA.search(s["t"]) for s in p["satirlar"]):
            continue
        sayilar, harfler = [], []

        def kapat():
            nonlocal sayilar, harfler
            if sayilar and harfler:
                hedef = None
                if tur == "mat":
                    hedef = sonuc.setdefault(aktif or "?", {})
                elif aktif_unite and aktif_test is not None:
                    hedef = sonuc.setdefault(aktif_unite, {}).setdefault(aktif_test, {})
                if hedef is not None:
                    for no, harf in zip(sayilar, harfler):
                        hedef[no] = harf
            sayilar, harfler = [], []

        # cevap anahtari sayfalari da iki sutunlu olabilir (tr): once sol
        # sutun (baslik + bloklar), sonra sag sutun — aksi halde iki unite
        # basligi ustune biner ve bloklar son basliga yazilir
        for s in sayfa_sirala(p["satirlar"], tur):
            t = s["t"].strip()

            m = BOLUM_BAS.search(t)
            if m and tur == "mat":
                kapat()
                aktif = m.group(2).strip()
                sonuc.setdefault(aktif, {})
                continue

            m = UNITE_BAS.search(t)
            if m and tur == "tr":
                kapat()
                aktif_unite = m.group(2).strip()
                aktif_test = None
                sonuc.setdefault(aktif_unite, {})
                continue

            m = TEST_BAS.search(t)
            if m and tur == "tr" and len(t) < 25:
                kapat()
                aktif_test = int(m.group(1))
                continue

            for tok in t.split():
                if SAYI_TOKEN.match(tok):
                    if harfler:
                        kapat()
                    sayilar.append(int(tok))
                else:
                    mh = HARF_TOKEN.match(tok)
                    if mh:
                        if not sayilar:
                            continue
                        harfler.append(mh.group(1))
                        if len(harfler) == len(sayilar):
                            kapat()
        kapat()
    return sonuc


def kelime_eslesme(w, n):
    """Anahtar kelimesi (w) ile baslik kelimesi (n) eslesir mi?

    Tekil/coolgul ve OCR ekleri icin: kazanim/kazanimlar, sozcuk/sozcukte
    gibi varyantlarin on ek benzerligiyle karsilanmasi saglanir.
    """
    if not w or not n or len(w) < 4 or len(n) < 4:
        return w == n
    adaylar = {w}
    if w.endswith(("lar", "ler")):
        adaylar.add(w[:-3])
    else:
        adaylar.update({w + "lar", w + "ler"})
    adaylar.update({w[:6], n[:6]})  # ortak 6 karakter on ek
    return any(
        a == n or difflib.SequenceMatcher(None, a, n).ratio() > 0.82
        for a in adaylar
        if len(a) >= 4
    )


def baslik_benizer(t, anahtar):
    """Baslik, cevap anahtarindaki bir konu adinin anlami kismini
    tasiyor mu? (parcali OCR satirlarini ("ANLAM") eler)"""
    n = norm(t)
    if len(n) < 5:
        return False
    kelimeler = set(n.split())
    for ad in anahtar:
        anlamlar = [w for w in norm(ad).split() if w not in DURAK]
        if not anlamlar:
            continue
        eslesen = sum(
            1 for w in anlamlar if any(kelime_eslesme(w, k) for k in kelimeler)
        )
        if eslesen == len(anlamlar) or eslesen >= 2:
            return True
    return False


def sayfa_sirala(satirlar, tur):
    """Satirlari okuma sirasina dizer.

    Turkce kitabi iki sutunlu: once sol sutun (x<850) tamamen, sonra sag
    sutun. Matematik kitabi tek sutun (siklar tum genisligi kaplar).
    """
    if tur == "tr":
        return sorted(satirlar, key=lambda s: (0 if s["x"] < 850 else 1, s["y"], s["x"]))
    return sorted(satirlar, key=lambda s: (s["y"], s["x"]))


# --------------------------------------------------------------- soru akisi

def secenekleri_bol(metin):
    """Satirdaki A) B) C) D) parcalarini ayirir -> (on ek, [(harf, deger)])"""
    es = list(OPT_BAS.finditer(metin))
    if not es:
        return None, []
    on_ek = metin[: es[0].start()].strip()
    secenekler = []
    for i, m in enumerate(es):
        bitis = es[i + 1].start() if i + 1 < len(es) else len(metin)
        secenekler.append((m.group(1), metin[m.end(): bitis].strip(" |;,")))
    return on_ek, secenekler


def sorulari_ayristir(sayfalar, tur, anahtar, ders, kitap, sayfa_esleme):
    """Sayfa -> bolum/konu eslemesiyle sorulari uretir."""
    sonuc, sayac = [], collections.Counter()
    son_no, bekleyen = 0, None
    aktif_grup = None  # mat: bolum adi / tr: (konu, test)
    kullanilan = set()  # aktif grupta gercek soru olarak baslayan numaralar

    def bitir():
        nonlocal bekleyen
        if bekleyen is None:
            return
        s = bekleyen
        bekleyen = None

        metin_satirlari, secenek_map = [], {}
        for _x, t in s["satirlar"]:
            on_ek, sec = secenekleri_bol(t)
            if sec:
                if on_ek and not gurultu_mu(on_ek):
                    metin_satirlari.append(on_ek)
                for harf, deger in sec:
                    if harf not in secenek_map and deger.strip():
                        secenek_map[harf] = deger.strip()
            else:
                metin_satirlari.append(t)
        metin = re.sub(r"\s+", " ", " ".join(metin_satirlari)).strip()

        if len(metin) < 25:
            sayac["kisa_metin"] += 1
            return
        if not all(h in secenek_map for h in "ABCD"):
            sayac["eksik_sik"] += 1
            return

        grup = sayfa_esleme.get((kitap, s["sayfa"]))
        if tur == "mat":
            konu, cevaplar = grup or "", anahtar.get(grup, {})
        else:
            konu, test = grup if grup else (None, None)
            cevaplar, konu_ad = {}, konu or ""
            for ad in anahtar:
                if konu and eslesme(konu, ad):
                    konu_ad = ad
                    cevaplar = anahtar[ad].get(test, {})
                    # sayfa basligindaki test no'su OCR ile bozulduysa
                    # cevap YALNIZCA baska bir testte birebir tek ise
                    # alinir; her test 1..8 numaralandigi icin carpan
                    # eslesmelerde cevap atamak yanlis olurdu
                    if s["no"] not in cevaplar:
                        aday = [
                            c2[s["no"]] for c2 in anahtar[ad].values()
                            if s["no"] in c2
                        ]
                        if len(set(aday)) == 1:
                            cevaplar = {s["no"]: aday[0]}
                        else:
                            cevaplar = {}
                    break
            konu = konu_ad

        cevap = cevaplar.get(s["no"])
        if cevap not in ("A", "B", "C", "D"):
            sayac["cevapsiz"] += 1
            return
        if not konu:
            sayac["konusuz"] += 1
            return

        sonuc.append({
            "kitapcik": kitap,
            "ders": ders,
            "konu": konu,
            "no": s["no"],
            "metin": metin,
            "secenekler": {h: secenek_map[h] for h in "ABCD"},
            "dogru": cevap,
            "yil": 2022 if ders == "MATEMATIK" else None,
        })

    for p in sayfalar:
        satirlar = sayfa_sirala(p["satirlar"], tur)
        if any(CEVAP_SAYFA.search(s["t"]) for s in satirlar):
            bitir()
            son_no = 0
            kullanilan.clear()
            continue

        grup = sayfa_esleme.get((kitap, p["sayfa"]))
        # bu sayfanin gecerli soru numaralari (cevap anahtarindan) -> sahte
        # "1." "2." baslangiclarini ve numara atlamalarini eler
        if tur == "mat":
            gecerli_no = set(anahtar.get(grup, {}).keys())
        else:
            gecerli_no = set()
            konu_s, test_s = grup if grup else (None, None)
            for ad in anahtar:
                if konu_s and eslesme(konu_s, ad):
                    # test bazli anahtar bir testte OCR ile dusmus olabilir;
                    # baslangic kontrolu unite geneli birlesimle yapilir,
                    # cevap bulma yine test oncelikli (fallback'li)
                    for _t_no, cev in anahtar[ad].items():
                        gecerli_no |= set(cev.keys())
                    break
        if grup != aktif_grup:
            bitir()
            son_no = 0
            kullanilan.clear()
            aktif_grup = grup

        for s in satirlar:
            if s["y"] < 250:
                continue  # sayfa basligi bandi (baslik y~160-175, icerik y>260)
            t = s["t"].strip()
            if gurultu_mu(t):
                continue
            m = QNUM.match(t)
            if m and s["x"] < 1700:
                no = int(m.group(1))
                kalan = t[m.end():].strip()
                # yalnizca cevap anahtarinda gercekten var olan numaralar
                # (iki sutunlu sayfalarda tablo ici sahte numaralar da elenir)
                # ve ayni test icinde daha once kullanilmamis numaralar:
                # soru icindeki tablo satirlari ("1. cumlede...") boyle elenir
                gecerli = (
                    no in gecerli_no and no != son_no and no not in kullanilan
                )
                # "22.00" gibi ondalik/saat kaliplari sahte baslangictir
                if gecerli and kalan and re.match(r"^[.,]\d", kalan):
                    gecerli = False
                # metinle baslayan numaralar: uzun kucuk harfli ilk kelime
                # tablo satiri olabilir ("1. oyuncu", "2. adim") -> reddet
                if gecerli and kalan:
                    ilk_kelime = re.match(r"[a-zçğıöşü]{4,}", kalan)
                    if ilk_kelime and ilk_kelime.group(0) not in SAHNE_KELIME:
                        gecerli = False
                if gecerli:
                    bitir()
                    son_no = no
                    kullanilan.add(no)
                    bekleyen = {
                        "no": no,
                        "sayfa": p["sayfa"],
                        "satirlar": (
                            [(s["x"], kalan)] if kalan and not gurultu_mu(kalan) else []
                        ),
                    }
                    continue
            if bekleyen is not None and t:
                bekleyen["satirlar"].append((s["x"], t))
    bitir()

    for k, v in sayac.items():
        print(f"    atlanan[{k}]: {v}")
    return sonuc


def sayfa_eslemesi_kur(sayfalar, tur, anahtar, kitap):
    """Her sayfayi bolum (mat) veya (konu, test) ciftine (tr) esler."""
    esleme = {}
    aktif_bolum, aktif_konu, aktif_test = None, None, None
    for p in sayfalar:
        satirlar = sayfa_sirala(p["satirlar"], tur)
        for s in [x for x in satirlar if x["y"] < 250]:
            t = s["t"].strip()
            if tur == "mat":
                for b in anahtar:
                    if eslesme(t, b):
                        aktif_bolum = b
                        break
            else:
                m = TEST_BAS.search(t)
                if m:
                    aktif_test = int(m.group(1))
                elif baslik_benizer(t, anahtar):
                    # anahtar adina benzeyen tam konu basligi; parcali
                    # satirlarin ("ANLAM") konuyu bozmasini onler
                    aktif_konu = t
        esleme[(kitap, p["sayfa"])] = (
            aktif_bolum if tur == "mat" else (aktif_konu, aktif_test)
        )
    return esleme


KITALAR = [
    ("2022_8_Sinif_Dijitalpdf_Matematik_Sinerji_Soru_Bankasi.json",
     "mat", "MATEMATIK", "Sinerji Matematik"),
    ("8_Sinif_Sinerji_Soru_Bankasi_Turkce.json",
     "tr", "TURKCE", "Sinerji Türkçe"),
]


def anahtar_ozet(anahtar, tur):
    if tur == "mat":
        return sum(len(v) for v in anahtar.values())
    return sum(len(t) for v in anahtar.values() for t in v.values())


if __name__ == "__main__":
    tum = []
    for dosya, tur, ders, kitap in KITALAR:
        yol = os.path.join(OCR_DIR, dosya)
        if not os.path.exists(yol):
            print("eksik (ocr sürüyor olabilir):", dosya, file=sys.stderr)
            continue
        sayfalar = json.load(open(yol, encoding="utf-8"))
        print(f"== {kitap}: {len(sayfalar)} sayfa")
        anahtar = anahtar_ayristir(sayfalar, tur)
        print(f"   cevap anahtari: {len(anahtar)} grup / {anahtar_ozet(anahtar, tur)} cevap")
        esleme = sayfa_eslemesi_kur(sayfalar, tur, anahtar, kitap)
        sorular = sorulari_ayristir(sayfalar, tur, anahtar, ders, kitap, esleme)
        print(f"   soru: {len(sorular)}")
        for k, v in sorted(
            collections.Counter(s["konu"] for s in sorular).items(),
            key=lambda x: -x[1],
        ):
            print(f"     {k}: {v}")
        tum.extend(sorular)

    if tum:
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        with open(OUT, "w", encoding="utf-8") as f:
            json.dump(tum, f, ensure_ascii=False, indent=1)
        print(f"\ntoplam {len(tum)} soru -> {OUT}")
