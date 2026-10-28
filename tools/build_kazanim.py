"""Metin katmanli PDF test dosyalarindan soru ayristirir.

Kullanim:
    python3 tools/build_kazanim.py <pdf_or_klasor> [pdf_or_klasor ...]

Her kaynak icin manifest dosyasi (.json) veya ad takimi kullanilir:
    "8sinif_turkce_2024.pdf" -> ders = Turkce (dosya adindan)
    yanindaki "8sinif_turkce_2024.json" varsa:
        {"ders": "TURKCE", "kaynak": "MEB ODSGM", "yil": 2024, "konu": "..."}

Bulunan her soru icin 4 sik tam ve cevap anahtari eslesmeli.
Cikti: build/cikti/kazanim.json  (build_havuz.py bunu okur)
"""
import fitz, json, os, re, sys, glob, collections

ROOT = "/Users/ercan/Documents/Qoder/lgs-hazirlik"
CIKTI = os.path.join(ROOT, "build", "cikti")
OUT = os.path.join(CIKTI, "kazanim.json")

DERS_KALIP = [
    ("TURKCE", r"turk"),
    ("MATEMATIK", r"matemat|(^|[_\-\s])mat([_\-\.0-9]|$)"),
    ("FEN", r"fen ?bilim|(^|[_\-\s])fen([_\-\.0-9]|$)"),
    # MEB dosya adlarindaki bozuk kodlamalar: YnkYlap, YNKILAP, Ynk_32
    ("INKILAP", r"inkilap|ynk|t\.?c\.? ?ink|(^|[_\-\s])(ink|sos)([_\-\.0-9]|$)"),
    # DYN_K., Din_32
    ("DIN", r"din ?kultur|dkab|(^|[_\-\s])(din|dyn)([_\-\.0-9]|$)"),
    # YNGYLYZCE, Yngiliz, Yngilizce
    ("INGILIZCE", r"ingiliz|yng[ıi]liz|yngylyzce|yabanci ?dil"
                  r"|(^|[_\-\s])ing([_\-\.0-9]|$)"),
]

# cevap anahtari dosyalari soru dosyasi degildir
ANAHTAR_DOSYA = re.compile(r"(?i)(_ca\b|cevap[\s_-]?anahtar[a-zıİöü]*)\.pdf$")

# cevap anahtari: "CEVAP ANAHTARI", "Cevaplar", "CEVAPLAR" + "1-A 2-B" / "1. A"
CEVAP_BASLIK = re.compile(
    r"CEVAP\s*(ANAHTARI|LAR[Iİ])?|Cevap\s*(Anahtar[ıi]|lar[ıi])", re.I)
CEVAP_CIFT = re.compile(
    r"(?<![\d.])(\d{1,2})\s*[-.)]?\s*([A-Da-d])(?![a-zA-ZçğıöşüÇĞİÖŞÜ])")
# anahtar dosyasinin grup basliklari: "1. Tema", "2. Ünite", "Unit 3"
GRUP_BAS = re.compile(
    r"(?m)^\s*(?:"
    r"(\d+)\s*\.?\s*(?:Tema|[ÜU]nite|Unit|Konu)"
    r"|(?:Tema|[ÜU]nite|Unit|Konu)\s*(\d+)\s*\.?"
    r")", re.I)
# anahtar listesindeki test basliklari: "Test 12"
TEST_BAS = re.compile(r"(?m)^[ \t]*Test\s*(\d{1,2})\s*\.?[ \t]*$")

# "A) secenek", "A. secenek", "A - secenek"
SIK = re.compile(r"(?<![\w])([A-Da-d])\s*[\)\.\-:]\s+")
# soru numarasi: satir basinda "12. " veya "12) "
NUM = re.compile(r"(?m)^[ \t]*(\d{1,2})\s*[\.\)]\s+")
# test basligi -> konu adini verir
BASLIK = re.compile(
    r"(?i)^\s*(?:TEST\s*\d+|KAZAN[Iİ]M\s*TEST[Iİ]|KAVRAMA\s*TEST[Iİ]"
    r"|DE[ĞĞ]ERLEND[Iİ]RME\s*TEST[Iİ]|ÖLÇME\s*VE\s*DE[ĞĞ]ERLEND[Iİ]RME)"
    r"[\s:.\-–]*(\d+)?[\s:.\-–]*(.*)$")

MIN_METIN = 25
# sik uzunlugu siniri kisa tutulur: matematikte siklar tek rakam olabilir ("45")
MIN_SIK = 1

# sayfa basligi / altbilgisi artiklari
ARTIK = re.compile(
    r"(?m)^\s*(?:Di[ğg]er sayfaya ge[çc]i[çc]i[zz]\.?|Cevap k[âa]g[ıi]t[ıi] "
    r"u[çc]zerindeki kodlamalar[ıi].*|K[Iİ]TAP[ÇC]IK T[ÜU]R[ÜU].*"
    r"|SINAVLA [ÖO][ĞĞ]RENC[Iİ] ALACAK.*|[ÖO]DSGM.*|\([ÖO]DSGM\)"
    r"|\d+\s*/\s*\d+|Sayfa\s*\d+"
    # MEB kitap altbilgileri
    r"|MEB\s+\d{4}\s*[-–]\s*\d{4}.*"
    r"|Ölçme, De[ğg]erlendirme.*|ve S[ıi]nav Hizmetleri.*|Genel M[üu]d[üu]rl[üu][ğg][üu].*"
    r"|https?://odsgm\.meb\.gov\.tr.*"
    # NOT: 'Bu testin cevap anahtarına ulaşmak...' SATIRI SILINMEMELI —
    # bu cumle test sinirlarini belirler (qr_blokla), hizalama ona dayanir
    r"|Bu kitap[çc][ıi][kk] [Öo]l[çc]me.*)\s*$",
    re.I)
ARTIK_SATIR = re.compile(
    r"(?m)^\s*A\s+(?:MATEMAT[Iİ]K|FEN B[Iİ]L[Iİ]MLER[Iİ]|T[UÜ]RK[ÇC]E"
    r"|T\.?C\.?\s*[İI]NKILAP TARIHI|D[Iİ]N K[UÜ]LT[UÜ]R[ÜU]"
    r"|YABANCI D[Iİ]L)\s+\d+\s*$")
ARTIK_KELIME = re.compile(
    r"sayfaya ge[çc]|K[Iİ]TAP[ÇC]IK|kodlamalar[ıi]n[ıi]z[ıi]|SINAVLA [ÖO][ĞĞ]RENC[Iİ]",
    re.I)


def temizle(metin):
    metin = ARTIK_SATIR.sub("", metin)
    metin = ARTIK.sub("", metin)
    return metin



def ders_bul(ad):
    """Dosya adi ve ust klasorlerine bakarak ders kodunu bulur."""
    low = ad.lower()
    for ders, kalip in DERS_KALIP:
        if re.search(kalip, low):
            return ders
    return None


def parmakizi(metin):
    import unicodedata
    m = unicodedata.normalize("NFKD", metin).lower()
    m = re.sub(r"[^a-z0-9çğıöşü]", "", m, flags=re.I)
    m = re.sub(r"(a|ı|o|u|e|i|ö|ü){2,}", r"\1", m)
    return m[:160]


def cevap_anahtarini_bul(metin):
    """Her cevap anahtari icin (baslangic, {no: harf}, uzunluk) listesi."""
    sonuc = []
    for m in CEVAP_BASLIK.finditer(metin):
        parca = metin[m.end(): m.end() + 1500]
        ciftler = [(int(n), h.upper()) for n, h in CEVAP_CIFT.findall(parca)]
        # 1'den baslamak zorunda olmayan en uzun kesintisiz artan seriyi bul
        en_iyi, aktif = [], []
        for no, harf in ciftler:
            if aktif and no == aktif[-1][0] + 1:
                aktif.append((no, harf))
            else:
                if len(aktif) > len(en_iyi):
                    en_iyi = aktif
                aktif = [(no, harf)] if no == 1 else []
        if len(aktif) > len(en_iyi):
            en_iyi = aktif
        if len(en_iyi) >= 5:
            sonuc.append({"pos": m.end(), "harfler": dict(en_iyi),
                          "sayi": len(en_iyi)})
    return sonuc


def numara_zinciri(metin, bitis, en_az=5):
    """bitis oncesinde 1,2,3... seklinde artan soru numaralari bulur."""
    konumlar = collections.defaultdict(list)
    for m in NUM.finditer(metin, 0, bitis):
        konumlar[int(m.group(1))].append(m.start())
    if 1 not in konumlar:
        return []
    zincir = []
    for n in range(1, 200):
        if n not in konumlar:
            break
        # onceki konumdan sonra gelen ilk "n." konumu
        onceki = zincir[-1] if zincir else -1
        aday = [k for k in konumlar[n] if k > onceki]
        if not aday:
            break
        zincir.append(aday[0])
    return zincir if len(zincir) >= en_az else []


def anahtar_gruplari(metin):
    """Grup baslikli anahtar dosyasini {grupNo: {soruNo: harf}} olarak dondurur."""
    baslar = list(GRUP_BAS.finditer(metin))
    gruplar = {}
    for i, m in enumerate(baslar):
        no_grup = int(m.group(1) or m.group(2))
        son = baslar[i + 1].start() if i + 1 < len(baslar) else len(metin)
        parca = metin[m.end():son]
        harfler = {}
        for no, h in CEVAP_CIFT.findall(parca):
            n = int(no)
            if n not in harfler:
                harfler[n] = h.upper()
        if len(harfler) >= 5 and no_grup not in gruplar:
            gruplar[no_grup] = harfler
    return gruplar


def siklari_ayir(parca):
    """Bir soru metni icindeki A/B/C/D siklarini dondurur."""
    bulgular = [(m.start(), m.group(1).upper()) for m in SIK.finditer(parca)]
    sonuc, sira = {}, list("ABCD")
    for i, (pos, harf) in enumerate(bulgular):
        if harf != sira[len(sonuc)]:
            continue
        bitis = bulgular[i + 1][0] if i + 1 < len(bulgular) else len(parca)
        deger = parca[pos + 2:bitis].strip(" \t\n\r-–·•")
        deger = " ".join(deger.split())
        if deger:
            sonuc[harf] = deger
        if len(sonuc) == 4:
            break
    return sonuc


YONERGE = re.compile(
    r"(?i)sorular[ıi]|soruda|sorular[ıi]?n[ıi]?z|sorular[ıi]nda"
    r"|cevaplay[ıi]n|işaretley|isaretley|boş bırak|bos birak"
    r"|aşağıdak|asagidak|yukarıdak|yukaridak|verilen|şekilde|sekilde"
    r"|ifadeyi|kelime ya da|hangisi|hangileri|göre|cevap anahtar")


# sayfa mobilyasi / form satiri: konu adi olamaz
MOBILYA = re.compile(
    r"(?i)(^|\W)(test|s[ıi]n[ıi]f|süre|s.?[üu]re|soyad|numara|kavrama"
    r"|kitap[çc][ıi]k|meb|yan[ıi][tş]|cevap\s+k[âa][gğ]|okul\s*no"
    r"|kazan[ıi]m|ad[ıi]?\s*soyad|genel\s*m[üu]d[üu]rl[üu]|t\.?c\.?)($|\W)")


def gecerli_konu(s):
    """Satir bir konu BASLIGI mi?

    Elenenler: sik satirlari ('A) ...'), soru yonergeleri
    ('1-12. sorularda boş bırakılan...'), sayfa mobilyasi
    ('KAZANIM KAVRAMA TESTİ', 'Adı Soyadı Sınıf No', '8. SINIF FEN...'),
    madde isaretleri ve uzun cumleler. Boylece KONU listesine hicbir zaman
    soru metni ya da secenek metni girmis olmaz."""
    if not (3 <= len(s) <= 60):
        return False
    if len(s.split()) > 6:                       # konu adi cumle olamaz
        return False
    if re.match(r"^[A-Da-d]\s*[\)\.\-:]", s):    # secenek satiri
        return False
    if re.match(r"^\d+[\s\-–.)]*\d", s):         # "1-12.", "1 - 5."
        return False
    if re.search(r"[•●▪◇★]|_{3,}|\.{4,}", s):    # madde isareti / dolum
        return False
    if re.search(r"\d\.\d|sayfa|©|www\.", s, re.I):
        return False
    if YONERGE.search(s):                        # yonerge cumlesi
        return False
    if re.search(r"(?i)ad[ıi]\s*.*soyad|s[ıi]n[ıi]f\s*no|[:.:]$|\.{2,}", s):
        return False                             # form satiri / nokta ile bitis
    if MOBILYA.search(s):                        # sayfa basligi artiklari
        return False
    return True


def konu_cikar(metin, soru_pos):
    """Soru 1'den onceki satirlardan konu basligini yakalar.

    Once 'Test 26 — Fotosentez' gibi baslikli adaya bakilir, sonra soruya
    EN YAKIN gecerli satira gecilir (eski mantikta uzaktaki satir kazaniyordu
    ve baska bir testin basligi etiket olabiliyordu)."""
    oncesi = metin[max(0, soru_pos - 900): soru_pos]
    satirlar = [s.strip() for s in oncesi.splitlines() if s.strip()]
    ters = list(reversed(satirlar[-12:]))
    for s in ters:                               # 1) baslikli aday en guclu
        m = BASLIK.match(s)
        if m and m.group(2).strip() and gecerli_konu(m.group(2).strip()):
            return m.group(2).strip()[:70]
    for s in ters:                               # 2) soruya en yakin gecerli
        if gecerli_konu(s):
            return s[:70]
    return ""


def metin_oku(yol):
    try:
        doc = fitz.open(yol)
    except Exception as e:
        print(f"  ! acilamadi: {e}")
        return None
    metin = temizle("\n".join(p.get_text("text") for p in doc))
    doc.close()
    return metin


def dis_anahtar_bul(yol):
    """Ayni klasordeki *_ca.pdf gibi ayri anahtar dosyasindan harfleri alir."""
    klasor = os.path.dirname(yol)
    stem = os.path.splitext(os.path.basename(yol))[0]
    adaylar = [os.path.join(klasor, f"{stem}_ca.pdf"),
               os.path.join(klasor, stem.split("_")[0] + "_ca.pdf"),
               os.path.join(klasor, "cevap_anahtari.pdf"),
               os.path.join(klasor, "cevapanahtari.pdf")]
    for a in adaylar:
        if not os.path.exists(a):
            continue
        km = metin_oku(a)
        if not km:
            continue
        gruplar = anahtar_gruplari(km)
        if not gruplar:
            # "Test 1 / Test 2 ..." baslikli tek dosyada anahtar (Gültepe)
            gruplar, _ = master_anahtar_bul(km)
        if gruplar:
            m = (re.search(r"TEST[-_ ]?(\d+)", stem, re.I)
                 or re.search(r"(\d+)\s*$", stem))
            if m and int(m.group(1)) in gruplar:
                return gruplar[int(m.group(1))]
            return gruplar[min(gruplar)]
        duz = {}
        for n, h in CEVAP_CIFT.findall(km):
            duz.setdefault(int(n), h.upper())
        if len(duz) >= 5:
            return duz
    return None


def master_anahtar_bul(metin):
    """Belge sonundaki 'Test 1 / Test 2 ...' anahtar listesini okur.

    (anahtarlar, anahtar_baslangici) dondurur: ikincisi, anahtar listesinin
    basladigi konumdur; boylece soru bolgesi sorunsuz sinirlanabilir
    (kapak sayfasindaki 'Test 1' yazisi aldatmaz)."""
    baslar = list(TEST_BAS.finditer(metin))
    if len(baslar) < 3:
        return {}, len(metin)
    # anahtar listesi kesintisizdir: yan yana duran basliklari grupla
    grup, en_iyi = [], []
    for i, m in enumerate(baslar):
        if grup and m.start() - baslar[i - 1].start() > 400:
            if len(en_iyi) < len(grup):
                en_iyi = grup
            grup = []
        grup.append(m)
    if len(en_iyi) < len(grup):
        en_iyi = grup
    if not en_iyi:
        return {}, len(metin)

    anahtar = {}
    for i, m in enumerate(en_iyi):
        no_test = int(m.group(1))
        son = en_iyi[i + 1].start() if i + 1 < len(en_iyi) else len(metin)
        harfler = {}
        for no, h in CEVAP_CIFT.findall(metin[m.end():son]):
            n = int(no)
            if n not in harfler:
                harfler[n] = h.upper()
        if len(harfler) >= 5:
            anahtar[no_test] = harfler
    return anahtar, en_iyi[0].start()


def devamli_blokla(metin, blok_uz, blok_sayisi, bas=0):
    """1..N tekrarlarini BLOK BLOK toplar; her blok kendi test anahtariyla eslesir."""
    konumlar = list(NUM.finditer(metin, bas))
    bloklar, aktif, beklenen = [], [], 1
    for m in konumlar:
        if bloklar and len(bloklar) >= blok_sayisi:
            break
        n = int(m.group(1))
        if n != beklenen:
            continue
        if aktif and m.start() - aktif[-1] > 30000:
            # soru metni arasinda sik kaynagi; yarim bloku iptal et
            # (esik yuksek tutulur: fen sorulari uzun deney metinleri icerebilir)
            aktif = []
            beklenen = 1
            if n != 1:
                continue
        aktif.append(m.start())
        beklenen = beklenen % blok_uz + 1
        if beklenen == 1:
            bloklar.append(aktif)
            aktif = []
    return bloklar


QR_CUMLE = re.compile(
    r"(?i)cevap\s*anahtar[ıi]n[ıia]?\s*ula[şs]mak")


def qr_blokla(metin):
    """Her testin sayfa basliginda gecen 'cevap anahtarına ulaşmak için...'
    cumlesini sinir kabul eder. Bu cumle kitapta tam olarak test sayisi kadar
    bulunur (testin 2. sayfasi), bu yuzden anahtarla HATASIZ eslesme saglar.
    Testin 1. sorusu cumlesin gerisinde aranir."""
    baslar = []
    for m in QR_CUMLE.finditer(metin):
        s = m.start()
        oncesi = max(0, s - 9000)
        bulunan = None
        for n in NUM.finditer(metin, oncesi, s):
            if int(n.group(1)) == 1:
                bulunan = n.start()
        if bulunan is not None and bulunan not in baslar:
            baslar.append(bulunan)
    return sorted(baslar)


# soru bolgesindeki test basligi: satir "Test", sonraki satir test numarasi
TEST_NO_BASLIK = re.compile(r"(?m)^[ \t]*Test[ \t]*\r?$\r?\n[ \t]*(\d{1,2})[ \t]*\r?$")


def baslik_listesi(metin):
    """[(konum, testNo)] — soru bolgesindeki 'Test\\nN' basliklari."""
    return [(m.start(), int(m.group(1)))
            for m in TEST_NO_BASLIK.finditer(metin)]


def baslik_blokla(metin):
    """{testNo: soru1 konumu} — soru bolgesindeki 'Test\\nN' basliklarini
    kullanir. Her basligin ardindaki ilk '1.' o testin baslangicidir ve
    arama bir sonraki baslikla sinirlanir. Boylece blok -> anahtar satiri
    eslesmesi KESIN olur (sayi kaymasi imkansizdir)."""
    bas = baslik_listesi(metin)
    sonuc = {}
    for i, (p, no) in enumerate(bas):
        sinir = bas[i + 1][0] if i + 1 < len(bas) else min(len(metin), p + 9000)
        for s in NUM.finditer(metin, p, sinir):
            if int(s.group(1)) == 1:
                sonuc.setdefault(no, s.start())
                break
    return sonuc


def blok_blok_ayristir(metin, anahtar, ders, konu_varyat, yil, yol, bas):
    """Master anahtarli kitaplarda test test soru cikarir (MEB KKT)."""
    blok_uz = len(anahtar[min(anahtar)])
    numaralar = sorted(anahtar)

    # 1) tercih edilen yol: test sinirlari QR cumlesiyle kesinlesir
    sinirlar = qr_blokla(metin)
    if len(sinirlar) == len(numaralar):
        sorular = []
        for b, ilk in enumerate(sinirlar):
            son = (sinirlar[b + 1] if b + 1 < len(sinirlar) else len(metin))
            sorular += blok_ayristir(metin, ilk, son, anahtar[numaralar[b]],
                                     ders, konu_varyat, yil, yol,
                                     konu_ek=konu_cikar(metin, ilk))
        return sorular

    # 2) 'Test\\nN' basliklari: her testin numarasi kesin bilinir (derleme
    #    kitaplari). Boylece anahtar satiriyla hizalama hatasiz olur.
    harita = baslik_blokla(metin)
    if harita:
        basliklar = baslik_listesi(metin)
        sinirlar = sorted((p, no) for no, p in harita.items()
                          if no in anahtar)
        sorular = []
        for i, (p, no) in enumerate(sinirlar):
            # blok, siradaki FARKLI numarali baslikta biter; boylece bir
            # test diger testin sorularini yutamaz (yanlis cevap riski yok)
            son = len(metin)
            for hp, hn in basliklar:
                if hp > p and hn != no:
                    son = hp
                    break
            sorular += blok_ayristir(metin, p, son, anahtar[no],
                                     ders, konu_varyat, yil, yol,
                                     konu_ek=konu_cikar(metin, p))
        if sorular:
            return sorular

    # 3) yedek: 1..N tekrarlarindan blok kur — yalnizca TUM testler
    #    bulundugunda kullanilir; aksi halde anahtar kayar ve yanlis cevap
    #    uretilirdi, bu yuzde kitap atlanir.
    bloklar = devamli_blokla(metin, blok_uz, len(anahtar), bas)
    if not bloklar or len(bloklar) != len(numaralar):
        return []
    sorular = []
    for b, blok in enumerate(bloklar):
        ilk = blok[0]
        son = bloklar[b + 1][0] if b + 1 < len(bloklar) else len(metin)
        sorular += blok_ayristir(metin, ilk, son, anahtar[numaralar[b]],
                                 ders, konu_varyat, yil, yol,
                                 konu_ek=konu_cikar(metin, ilk))
    return sorular


def blok_ayristir(metin, bas, bitis, harfler, ders, konu_varyat, yil, yol,
                   konu_ek=None):
    """[bas, bitis) araligindaki sorulari verilen cevap anahtariyla cikarir."""
    parca = metin[bas:bitis]
    zincir = numara_zinciri(parca, len(parca), en_az=min(5, len(harfler)))
    if not zincir:
        return []
    if abs(len(zincir) - len(harfler)) > 2:
        return []
    konu_baslik = konu_ek or konu_cikar(parca, zincir[0])

    sorular = []
    for i, pos in enumerate(zincir):
        no = i + 1
        harf = harfler.get(no)
        if not harf:
            continue
        son = zincir[i + 1] if i + 1 < len(zincir) else len(parca)
        ik = parca[pos:son]
        secenekler = siklari_ayir(ik)
        if not all(secenekler.get(h) for h in "ABCD"):
            continue
        # soru metni = ilk sik isareti onune kadar, numara on eki temizlenir
        ilk = SIK.search(ik)
        metin_soru = ik[: ilk.start()] if ilk else ik
        metin_soru = " ".join(metin_soru.split())
        metin_soru = re.sub(r"^\d{1,3}\s*[.)]\s*", "", metin_soru)
        if len(metin_soru) < MIN_METIN:
            continue
        # sayfa artigi sizzan sorulari atla
        if ARTIK_KELIME.search(metin_soru) or ARTIK_KELIME.search(
                " ".join(secenekler.values())):
            continue
        if min(len(secenekler[h]) for h in "ABCD") < MIN_SIK:
            continue
        sorular.append({
            "no": no,
            "metin": metin_soru,
            "secenekler": secenekler,
            "ders": ders,
            "konu": konu_varyat or konu_baslik,
            "kitap": os.path.basename(yol),
            "dogru": harf,
            "yil": yil,
        })
    return sorular


def pdf_isle(yol, ders, konu_varyat, yil):
    """Tek PDF'ten ayristirilan sorulari dondurur."""
    metin = metin_oku(yol)
    if not metin:
        return []
    if len(metin) < 2000:
        print(f"  ! metin cok az, taranmis olabilir: {os.path.basename(yol)}")

    # 1) ayri anahtar dosyasi varsa (ODSGM ünitelendirilmiş setleri)
    dis = dis_anahtar_bul(yol)
    if dis:
        cikti = blok_ayristir(metin, 0, len(metin), dis, ders, konu_varyat,
                                yil, yol)
        if cikti:
            return cikti

    # 2) belge sonundaki master anahtar listesi (MEB kazanım kavrama testleri)
    master, master_bas = master_anahtar_bul(metin)
    if len(master) >= 3:
        cikti = blok_blok_ayristir(metin[:master_bas], master, ders,
                                   konu_varyat, yil, yol, 0)
        if cikti:
            return cikti

    # 3) dosya icindeki cevap anahtari
    anahtarlar = cevap_anahtarini_bul(metin)
    if not anahtarlar:
        print(f"  ! cevap anahtari bulunamadi ({os.path.basename(yol)})")
        return []
    sorular = []
    onceki = 0
    for anahtar in anahtarlar:
        # her anahtar kendi testine ait; arama penceresi onceki anahtardan
        # bu anahtara kadar olan dilimle sinirlanir
        sorular += blok_ayristir(metin, onceki, anahtar["pos"],
                                 anahtar["harfler"], ders, konu_varyat, yil, yol)
        onceki = anahtar["pos"]
    return sorular


def kaynak_coz(path):
    """Dosya adindan, ust klasorlerden ve manifestten ders/konu/yil cozer."""
    ad = os.path.basename(path)
    manifest = os.path.splitext(path)[0] + ".json"
    veri = {}
    if os.path.exists(manifest):
        veri = json.load(open(manifest, encoding="utf-8"))
    ders = veri.get("ders")
    if not ders:
        parcalar = os.path.normpath(path).split(os.sep)
        for a in [ad] + parcalar[-4:-1]:
            ders = ders_bul(a)
            if ders:
                break
    yil = veri.get("yil")
    if not yil:
        m = re.search(r"(?<!\d)(20[01]\d)(?!\d)", ad)   # 2015-2016, 2016-2017
        if m:
            yil = int(m.group(1))
    return ders, veri.get("konu"), yil


def main(yollar):
    hepsi, sayim = [], collections.Counter()
    for y in yollar:
        dosyalar = sorted(glob.glob(y)) if any(c in y for c in "*?[") \
            else ([y] if os.path.isfile(y) else
                  sorted(glob.glob(os.path.join(y, "**", "*.pdf"), recursive=True)))
        for pdf in dosyalar:
            if ANAHTAR_DOSYA.search(pdf):
                continue
            ders, konu, yil = kaynak_coz(pdf)
            if not ders:
                print(f"  ? ders tespit edilemedi, atlandi: {os.path.basename(pdf)}")
                continue
            cikti = pdf_isle(pdf, ders, konu, yil)
            print(f"  + {os.path.basename(pdf)} -> {len(cikti)} soru ({ders})")
            hepsi.extend(cikti)
            sayim[ders] += len(cikti)

    os.makedirs(CIKTI, exist_ok=True)
    mevcut = []
    if os.path.exists(OUT):
        mevcut = json.load(open(OUT, encoding="utf-8"))
    gorulen = {(p["metin"], p["dogru"]) for p in mevcut}
    eklenen = [s for s in hepsi if (s["metin"], s["dogru"]) not in gorulen]
    json.dump(mevcut + eklenen, open(OUT, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"\n{len(hepsi)} ayristirildi -> {len(eklenen)} yeni eklendi "
          f"(toplam {len(mevcut) + len(eklenen)})")
    for d, n in sayim.most_common():
        print(f"  {d:11s} {n}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1:])


