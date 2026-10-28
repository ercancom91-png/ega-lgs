# LGS 8. Sınıf — Ücretsiz Çoktan Seçmeli Soru Kaynak Araştırması

**Tarih:** 28.10.2026
**Amaç:** Eldeki ~2.900 sorunun üzerine **~7.000 yeni soru** ekleyerek 6 derste toplam **~10.000** (ders başına ~1.667) çoktan seçmeli soruya ulaşmak.
**Kapsam:** Türkçe, Matematik, Fen Bilimleri, T.C. İnkılap Tarihi, Din Kültürü ve Ahlak Bilgisi, İngilizce.
**Yöntem:** Türkçe web araması → liste sayfaları → gerçek PDF URL'leri → 3–5 PDF'de rastgele doğrulama (HTTP 200 + metin katmanı + soru sayısı `pypdf` ile sayma). Büyük dosyalar depoya indirilmedi; yalnızca `/private/var/folders/.../T/opencode/lgsprobe` altında numune olarak incelendi.

---

## 0. ÖZET SONUÇ

| Ders | Yeni soru (tahmini) | Cevap anahtarı | Zorluk |
|---|---:|---|---|
| Türkçe | ~2.200 | ✅ tam | Kolay |
| Matematik | ~2.000 | ✅ tam | Kolay |
| Fen Bilimleri | ~2.250 | ✅ kısmi (QR) | Kolay |
| T.C. İnkılap Tarihi | ~2.100 | ✅ kısmi (QR) | Kolay |
| Din Kültürü | ~900 | ✅ kısmi | **Zor** |
| İngilizce | ~550 | ✅ kısmi | **En zor** |
| **TOPLAM** | **~10.000** | | |

- Hedefe **Türkçe / Matematik / Fen / İnkılap** dördü tek başına yeterince katkı veriyor (her biri 1.667 hedefini aşıyor).
- **İngilizce (~550)** ve **Din Kültürü (~900)** hedefin altında kalıyor → 2. turda bu ikisine öncelik verilmeli (bkz. §8).
- **Önemli müfredat uyarısı:** 2017-2018 Kazanım Kavrama Testleri ve 2020-21 Çalışma Fasikülleri **eski müfredata** aittir. Soru tipleri LGS ile uyumlu, ama kazanım etiketleri "Türkiye Yüzyılı Maarif Modeli" ile birebir örtüşmez. Etiketleme yaparken "müfredat yılı" alanı mutlaka tutulmalı.
- **HF/GitHub veri setleri düşük değerli:** `bezir/turkish_exam_instructions` (41.377 soru), `Holmeister/TurkishMMLU`, `malhajar/mmlu_tr-v0.2`, `yeniguno/turkish-university-entrance-exam-questions`, `bilalabic/awesome-turkish-datasets` — hepsi **üniversite/erişkin** düzeyi, LGS değil. Listeye alınmadı.

---

## 1. TÜRKÇE

| # | Kaynak | URL | Tahmini soru | Metin katmanı | Cevap anahtarı |
|---|---|---|---:|---|---|
| T1 | ODSGM Ünitelendirilmiş Örnek Sorular (2021-22, 8 tema) | Liste: `https://odsgm.meb.gov.tr/www/8-sinif-turkce-unitelendirilmis-ornek-sorular/icerik/678`<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/turk/1.pdf` … `8.pdf` (+ `turk_ca.pdf`) | **324** (doğrulanmış: cevap anahtarı dosyası 324 giriş) | ✅ | ✅ ayrı `*_ca.pdf` |
| T2 | ODSGM 8. Sınıf Çalışma Fasikülleri (Türkçe 30 dosya) | `https://odsgm.meb.gov.tr/www/8-sinif-calisma-fasikulleri/icerik/568`<br>Örnek: `https://cdn.eba.gov.tr/icerik/2020/10/8_1_turk_adana.pdf`<br>`https://cdn.eba.gov.tr/icerik/2021/01/odsgm/8_4_turk_eskisehir.pdf`<br>`https://cdn.eba.gov.tr/yardimcikaynaklar/2022/01/odsgm/fasikul/2021/8/8_1_turk_ankara.pdf` | **~1.200** (30 dosya × ~40; ölçülen örnek: Adana 1. Tema = 55 soru/29 sayfa) | ✅ | ✅ fasikül içi |
| T3 | 2017-2018 MEB Türkçe Kazanım Kavrama Testleri (tek dosyada ~40 test) | `https://kurguluyorum.com/wp-content/uploads/2020/05/2017-2018-8.Sinif-TURKCE-Kazanim-Testleri.pdf` | **~480** (40 test × 12) | ✅ | ⚠️ QR + `https://gultepeimamhatip.meb.k12.tr/meb_iys_dosyalar/34/13/750430/dosyalar/2018_11/06195319_8.-SINIF-TYRKYE-CEVAP-ANAHTARLARI.pdf` (Test 1–26, ~310 soru) |
| T4 | Tekirdağ ÖDM Konu Tarama Testleri (1. + 2. Paket) | `https://tekirdagodm.meb.gov.tr/www/icerik/170`<br>`https://tekirdagodm.meb.gov.tr/www/icerik/171` | **~120** (6 test) | ✅ | ✅ paket içinde ayrı anahtar PDF'i |
| T5 | Ankara Yayıncılık ücretsiz tam LGS deneme | `https://ankarayayincilik.com.tr/uploads/f/G1UZpnkfBbTo.pdf`<br>Aynası: `https://bingolarge.meb.gov.tr/.../23133758_LGS_1_Ankara_YayYnlarY_8._SYnYf.pdf` | ~20 | ✅ | ✅ |
| T6 | Tudem "tadımlık" örnek PDF | `https://tudem.com/images/tadimlik/a7d168s02tu3_u01_turkce_kospdf.pdf` | ~15-25 | ✅ | ✅ |

**Türkçe toplam (yeni): ≈ 2.160 soru**

---

## 2. MATEMATİK

| # | Kaynak | URL | Tahmini soru | Metin katmanı | Cevap anahtarı |
|---|---|---|---:|---|---|
| M1 | ODSGM Ünitelendirilmiş Örnek Sorular (6 ünite) | Liste: `https://odsgm.meb.gov.tr/www/8-sinif-matematik-unitelendirilmis-ornek-sorular/icerik/677`<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/mat/1.pdf` … `6.pdf` (+ `mat_ca.pdf`) | **335** (doğrulanmış) | ✅ | ✅ |
| M2 | ODSGM Çalışma Fasikülleri (Matematik 28 dosya) | `https://odsgm.meb.gov.tr/www/8-sinif-calisma-fasikulleri/icerik/568`<br>Örnek: `https://cdn.eba.gov.tr/icerik/2020/11/unite2/8_2_mat_*.pdf` (2020-21, ünite 1-6) | **~1.120** (28 × ~40) | ✅ | ✅ |
| M3 | 2017-2018 MEB Matematik Kazanım Testleri (tek dosya) | `https://alayurtoo.meb.k12.tr/.../26144339_EBA_2017_-_2018_TYM_MATEMATYK_TESTLERY.pdf` | **~480** | ✅ | ⚠️ QR |
| M4 | matematiktek.com — 40 MEB kazanım testi (Google Drive) | `https://matematiktek.com/8-sinif-meb-kazanim-testleri` | **~480** (⚠️ M3 ile büyük ölçüde aynı set olabilir) | ✅ | ✅ (sayfa üzerinde) |
| M5 | efsanematematik.com — kazanım/kavrama testleri arşivi | `https://efsanematematik.com/8-sinif-meb-kazanim-kavrama-testleri` | ~100-200 (Drive bağlantıları) | ✅ | ✅ |
| M6 | Tekirdağ ÖDM KTT | `icerik/170` + `icerik/171` | ~120 | ✅ | ✅ |
| M7 | Ankara Yayıncılık deneme + Tudem tadımlık | (T5/T6 ile aynı) | ~35 | ✅ | ✅ |

**Matematik toplam (yeni): ≈ 2.000 soru** (M3/M4 çakışması giderilirse ~1.600)

---

## 3. FEN BİLİMLERİ

| # | Kaynak | URL | Tahmini soru | Metin katmanı | Cevap anahtarı |
|---|---|---|---:|---|---|
| F1 | ODSGM Ünitelendirilmiş Örnek Sorular (7 ünite) | Liste: `https://odsgm.meb.gov.tr/www/8-sinif-fen-bilimleri-unitelendirilmis-ornek-sorular/icerik/676`<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/fen/1.pdf` … `7.pdf` (+ `fen_ca.pdf`) | **324** (doğrulanmış) | ✅ | ✅ |
| F2 | ODSGM Çalışma Fasikülleri (Fen 33 dosya — en fazla) | `https://odsgm.meb.gov.tr/www/8-sinif-calisma-fasikulleri/icerik/568`<br>Örnek: `https://cdn.eba.gov.tr/icerik/2020/10/8_1_fen_*.pdf` | **~1.320** (33 × ~40) | ✅ | ✅ |
| F3 | 2017-2018 MEB Fen Kazanım Kavrama Testleri (tek dosya, 81 sayfa / 40 test) | `https://karacam.meb.k12.tr/meb_iys_dosyalar/61/06/744592/dosyalar/2020_04/` (klasörde Fen dosyası; doğrulandı) | **~480** (40 × 12) | ✅ | ⚠️ QR |
| F4 | kimyadenizi.com — ÖDSGM kazanım testleri dizini | `https://www.kimyadenizi.com/genel/kazanim` | ~100-200 (indirme bağlantıları) | ✅ | ✅ |
| F5 | Tekirdağ ÖDM KTT + Ankara deneme + Tudem | (T4/T5/T6) | ~140 | ✅ | ✅ |

**Fen Bilimleri toplam (yeni): ≈ 2.250 soru**

---

## 4. T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK

| # | Kaynak | URL | Tahmini soru | Metin katmanı | Cevap anahtarı |
|---|---|---|---:|---|---|
| İ1 | ODSGM Ünitelendirilmiş Örnek Sorular (6 ünite) | Liste: `https://odsgm.meb.gov.tr/www/8-sinif-tc-inkilap-tarihi-unitelendirilmis-ornek-sorular/icerik/675`<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/ink/1.pdf` … `6.pdf` (+ `ink_ca.pdf`) | **160** (doğrulanmış: cevap anahtarı 33+46+39+27+9+6) | ✅ | ✅ |
| İ2 | ODSGM Çalışma Fasikülleri (İnkılap 28 dosya) | `https://odsgm.meb.gov.tr/www/8-sinif-calisma-fasikulleri/icerik/568`<br>Örnek: `https://cdn.eba.gov.tr/icerik/2020/11/unite2/8_2_sos_antalya.pdf` (`sos` = İnkılap) | **~1.040** (28 × ~37; ölçülen örnek: Çanakkale 3. Ünite = 37 soru/30 sayfa) | ✅ | ✅ |
| İ3 | 2017-2018 MEB İnkılap Kazanım Testleri (tek dosya) | `https://karacam.meb.k12.tr/meb_iys_dosyalar/61/06/744592/dosyalar/2020_04/10161409_2017-2018_8.SYnYf_YNKILAP_KazanYm_Testleri.pdf` | **~480** (40 × 12) | ✅ | ⚠️ QR |
| İ4 | 2016-2017 MEB İnkılap Kazanım Testleri (32 test, farklı yıl → çakışma az) | `https://karacam.meb.k12.tr/meb_iys_dosyalar/61/06/744592/dosyalar/2020_04/` (2016-2017 İnkılap dosyası) | **~384** | ✅ | ⚠️ QR |
| İ5 | denizliodm — Kazanım Tarama Testi (Aralık 2020) | `https://denizliodm.meb.gov.tr/.../12182148_Kazanim_tarama_testi_aralik2020.pdf` | ~40-60 | ✅ | ✅ |
| İ6 | Tekirdağ ÖDM KTT + Ankara deneme + Tudem | (T4/T5/T6) | ~140 | ✅ | ✅ |

**İnkılap toplam (yeni): ≈ 2.100 soru**

---

## 5. DİN KÜLTÜRÜ VE AHLAK BİLGİSİ ⚠️ (kısa)

| # | Kaynak | URL | Tahmini soru | Metin katmanı | Cevap anahtarı |
|---|---|---|---:|---|---|
| D1 | ODSGM Ünitelendirilmiş Örnek Sorular (5 ünite) | Liste: `https://odsgm.meb.gov.tr/www/8-sinif-din-kulturu-ve-ahlak-bilgisi-unitelendirilmis-ornek-sorular/icerik/674`<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/dkab/1.pdf` … `5.pdf` (+ `dkab_ca.pdf`) | **160** (doğrulanmış) | ✅ | ✅ |
| D2 | 2017-2018 MEB Din Kültürü Kazanım Testleri (tek dosya, ~40 test) | `https://karacam.meb.k12.tr/meb_iys_dosyalar/61/06/744592/dosyalar/2020_04/10161329_2017-2018_8.SYnYf_DYN_K._KazanYm_Testleri.pdf` | **~480** (40 × 12) | ✅ | ⚠️ QR |
| D3 | Gültepe İmam Hatip — 20 test **+ tek dosyada cevap anahtarı** | Liste: `https://gultepeimamhatip.meb.k12.tr/tema/dosyadetay.php?KATEGORINO=2217077&git=1` (ve `git=2`)<br>Örnek test: `https://gultepeimamhatip.meb.k12.tr/meb_iys_dosyalar/34/13/750430/dosyalar/2018_11/06204325_TEST-1-Kaza-ve-Kader-1-Yndir.pdf`<br>Anahtar: `.../06203458_8.-SINIF-DYN-KYLTYRY-VE-AHLAK-BYLGYSY-CEVAP-ANAHTARLARI.pdf` | **240** (20 test × 12, anahtarla **tam eşleşti**) — D2 ile kısmen aynı set | ✅ | ✅ **Test 1–20** |
| D4 | mikailokumus.com — kazanım başına Din testleri | `https://mikailokumus.com/indir/din-kulturu-ve-ahlak-bilgisi-8-sinif-1-unite-kazanim-testleri` (ünite 2-5 de var) | ~150-300 (kazanım başına 1 soru/genel) | ✅ | ✅ |
| D5 | Tekirdağ ÖDM KTT + Ankara deneme + Tudem + Editör örnek kitap | (T4/T5/T6)<br>`https://www.editoryayinevi.net/ornek_kitapicerikleri/8-sinif-surec-odakli-din-kulturu-soru-bankasi-25/8-sinif-surec-odakli-din-kulturu-soru-bankasi-25.pdf` | ~160 | ✅ | ✅/⚠️ |

**Din Kültürü toplam (yeni): ≈ 900-1.100 soru** (çakışmalar giderilirse ~900)

---

## 6. İNGİLİZCE ⚠️ (en kısa)

| # | Kaynak | URL | Tahmini soru | Metin katmanı | Cevap anahtarı |
|---|---|---|---:|---|---|
| İNG1 | ODSGM Ünitelendirilmiş Örnek Sorular (10 ünite) | Liste: `https://odsgm.meb.gov.tr/www/8-sinif-ingilizce-unitelendirilmis-ornek-sorular/icerik/673`<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/ing/1.pdf` … `10.pdf` (+ `ing_ca.pdf`) | **159** (doğrulanmış) | ✅ | ✅ |
| İNG2 | Gültepe İmam Hatip — MEB 2017-18 İngilizce KKT, **19 test + tek dosyada cevap anahtarı** | Liste: `https://gultepeimamhatip.meb.k12.tr/tema/dosyadetay.php?KATEGORINO=2217083&git=1` (ve `git=2`)<br>Örnek: `https://gultepeimamhatip.meb.k12.tr/meb_iys_dosyalar/34/13/750430/dosyalar/2018_11/08204843_TEST-1-Friendship-1-Yndir.pdf`<br>Anahtar: `.../08204020_8.-SINIF-YNGYLYZCE-CEVAP-ANAHTARLARI.pdf` (Test 1–19) | **228** (19 × 12, anahtarla doğrulandı) | ✅ | ✅ **Test 1–19** |
| İNG3 | Yalova Cumhuriyet Ortaokulu — 27 test (17'si canlı) | Liste: `https://yalovacumhuriyetortaokulu.meb.k12.tr/icerikler/8sinifingilizcedersikazanimtestleri_4989103.html`<br>Dosya tabanı: `https://yalovacumhuriyetortaokulu.meb.k12.tr/meb_iys_dosyalar/77/01/714438/dosyalar/2018_05/`<br>(81–817 → HTTP 200; 818–827 → 404) | **~204** (17 × 12) — **İNG2 ile birebir aynı dosyalar** (metin özeti hash eşleşti), tekrar sayılmamalı | ✅ | ⚠️ anahtarı İNG2 dosyası kullanılır |
| İNG4 | Tekirdağ ÖDM KTT (İngilizce 6 test) | `icerik/170` + `icerik/171` | **~120** | ✅ | ✅ |
| İNG5 | Ankara Yayıncılık deneme + Tudem tadımlık | (T5/T6) | ~35 | ✅ | ✅ |
| İNG6 | kursunkalem.com dizini (indirme bağlantıları) | `http://www.kursunkalem.com/kazanim-testleri/8-sinif/ingilizce` | ~0-100 (yönlendirici) | ✅ | ✅ |
| İNG7 | ODSGM kurslar cevap anahtarı (farklı set, ünite bazlı) | `https://odsgm.meb.gov.tr/kurslar/pdf/cvp/kt_637061483407909184.pdf` | anahtar (ünitelendirilmiş set için) | ✅ | ✅ |

**İngilizce toplam (yeni): ≈ 550 soru** (çakışmasız)

---

## 7. ORTAK / DİĞER KAYNAKLAR

| Kaynak | URL | Not |
|---|---|---|
| **ODSGM 8. Sınıf Kazanım Kavrama Testleri hub** | `https://odsgm.meb.gov.tr/www/8sinif-kazanim-kavrama-testleri/icerik/1654` | 6 dersin hepsi bu sayfada; ana "kapı" |
| **ODSGM Çalışma Fasikülleri** | `https://odsgm.meb.gov.tr/www/8-sinif-calisma-fasikulleri/icerik/568` | 119 PDF, ~4.700 soru (Türkçe/Mat/Fen/İnk) |
| **Tekirdağ ÖDM KTT 1. Paket** | `https://tekirdagodm.meb.gov.tr/www/icerik/170` (18 test + `27204237_8.Sinif_1.PaketKTTCevapAnahtarlari.pdf`) | ⚠️ TLS sertifika sorunu → `curl -sk`; AJAX uç noktası 403 |
| **Tekirdağ ÖDM KTT 2. Paket** | `https://tekirdagodm.meb.gov.tr/www/icerik/171` (21 PDF + `28063025...CevapAnahtari.pdf`) | tüm 6 ders |
| **Ankara Yayıncılık tam LGS deneme** | `https://ankarayayincilik.com.tr/uploads/f/G1UZpnkfBbTo.pdf` (11.3 MB) | tüm 6 ders, ~90 soru |
| **MEBİ (yeni nesil)** | `https://mebi.eba.gov.tr` (listeleme `/qr-exam-list`) | LGS denemeleri + konu pekiştirme testleri; **oturum/scraper gerekebilir** → en yüksek potansiyelli yenilikçi kaynak |
| **Tudem tadımlık** | `https://tudem.com/images/tadimlik/` (örn. `a7d168s02tu3_u01_turkce_kospdf.pdf`) | 6 ders için örnek bölümler |
| matematiktek / efsanematematik / kimyadenizi / turkceailesi / klasikhoca / copurhoca | bkz. ilgili bölümler | Google Drive/EBa yönlendiricileri |

---

## 8. EN İYİ KAYNAKLAR — Top 10 (en yüksek getiri)

| Sıra | Kaynak | URL | Getiri | Neden |
|---:|---|---|---:|---|
| 1 | **ODSGM Çalışma Fasikülleri (119 PDF)** | `https://odsgm.meb.gov.tr/www/8-sinif-calisma-fasikulleri/icerik/568` | **~4.700 soru** | Tek tıklama, 4 ders, metin katmanı + iç cevap anahtarı |
| 2 | **ODSGM Ünitelendirilmiş Örnek Sorular (6 ders)** | `https://odsgm.meb.gov.tr/www/8sinif-kazanim-kavrama-testleri/icerik/1654` → alt sayfalar 673-678<br>PDF: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/{turk,mat,fen,ink,dkab,ing}/N.pdf` | **1.462 soru** | **Tek kaynakta 6 ders + ayrı cevap anahtarı dosyaları** (doğrulanmış sayılar) |
| 3 | **karacam.meb.k12.tr 2017-18 MEB KKT paketleri** (Fen/İnkılap/Din) | `https://karacam.meb.k12.tr/meb_iys_dosyalar/61/06/744592/dosyalar/2020_04/` | **~1.440 soru** | 3 dersin 40'ar testi tek klasörde, metin katmanı tam |
| 4 | **kurguluyorum.com Türkçe KKT (40 test)** | `https://kurguluyorum.com/wp-content/uploads/2020/05/2017-2018-8.Sinif-TURKCE-Kazanim-Testleri.pdf` | **~480 soru** | Tek dosya, doğrudan indirilebilir, metin katmanı tam |
| 5 | **alayurtoo.meb.k12.tr Matematik KKT (40 test)** | `https://alayurtoo.meb.k12.tr/.../26144339_EBA_2017_-_2018_TYM_MATEMATYK_TESTLERY.pdf` | **~480 soru** | Matematik'te en büyük tek dosya |
| 6 | **Tekirdağ ÖDM Konu Tarama Testleri (2 paket)** | `https://tekirdagodm.meb.gov.tr/www/icerik/170` + `/icerik/171` | **~720 soru** | **6 ders + ayrı cevap anahtarı PDF'leri** (18+21 test) |
| 7 | **Gültepe İmam Hatip — İngilizce 19 test + anahtar** | `https://gultepeimamhatip.meb.k12.tr/tema/dosyadetay.php?KATEGORINO=2217083&git=1` | **228 soru** | **İngilizce'de tek başına en büyük doğrulanmış kaynak** |
| 8 | **Gültepe İmam Hatip — Din Kültürü 20 test + anahtar** | `https://gultepeimamhatip.meb.k12.tr/tema/dosyadetay.php?KATEGORINO=2217077&git=1` (ve `git=2`) | **240 soru** | Din'de **tam cevap anahtarı** ile en güvenilir paket |
| 9 | **Gültepe — Türkçe cevap anahtarı (Test 1–26)** | `https://gultepeimamhatip.meb.k12.tr/meb_iys_dosyalar/34/13/750430/dosyalar/2018_11/06195319_8.-SINIF-TYRKYE-CEVAP-ANAHTARLARI.pdf` | anahtar (≈310 soru) | QR'lı Türkçe testlerin anahtarını toplu çözer |
| 10 | **Ankara Yayıncılık ücretsiz tam LGS deneme** | `https://ankarayayincilik.com.tr/uploads/f/G1UZpnkfBbTo.pdf` | ~90 soru | Tek dosyada **6 dersin tamamı** + anahtar; deneme modülü için ideal |

*Yedek:* **Yalova Cumhuriyet Ortaokulu İngilizce** (`https://yalovacumhuriyetortaokulu.meb.k12.tr/icerikler/8sinifingilizcedersikazanimtestleri_4989103.html`) — 17 canlı dosya, ama Gültepe ile aynı dosyalar.

---

## 9. EN ZOR DERSLER VE 2. TUR ÖNERİLERİ

1. **İngilizce (~550 / hedef 1.667) — en kritik açık (~1.100 soru):**
   - MEBİ `mebi.eba.gov.tr/qr-exam-list` içindeki İngilizce konu pekiştirme testleri ve LGS denemelerini çekmeye çalış (oturum gerekebilir).
   - ÖDSGM **kurslar** altındaki ünite testleri: `https://odsgm.meb.gov.tr/kurslar/` (örn. `pdf/cvp/kt_637061483407909184.pdf` anahtarı → ilgili soru PDF'leri de aynı dizinde).
   - 2017-18 İngilizce KKT'nin **20-27. testleri** başka okul aynalarında aranmalı (Yalova'da 818-827 404).
   - Yayıncı örnekleri: Tudem, Apotemi, Palme, Doğa, Ankara (ücretsiz "içerik" bölümleri).
2. **Din Kültürü (~900 / hedef 1.667) — açık ~750 soru:**
   - `mikailokumus.com` (kazanım başına testler) tüm üniteler için taranmalı.
   - `gultepeimamhatip.meb.k12.tr` diğer kategori sayfaları (7. sınıf dışı, 8. sınıf diğer üniteler) ve `kursunkalem.com` dizini.
   - MEBİ Din denemeleri; `turkceailesi.net`, `klasikhoca.com`, `copurhoca.com` arşivleri.
   - EBA `yardimcikaynaklar` altında 2023-24/2024-25 yılı Din kazanım testleri taranmalı (şu an yalnızca 2022 dizini doğrulandı).

---

## 10. TEKNİK NOTLAR (pipeline için)

- **Doğrulanan metin katmanı:** Tüm MEB/ODSGM PDF'leri `pypdf` ile sorunsuz metin veriyor (`pdftotext` kurulu değil). Uyarı: `fontTools is required...` — önemsiz, extraksiyon çalışıyor.
- **Cevap anahtarı sayımı:** Soru sayısı tahmin etmek yerine `*_ca.pdf` anahtar dosyalarındaki girişler sayıldı (Türkçe 324, Mat 335, Fen 324, Din 160, İngilizce 159, İnkılap 160).
- **URL kalıpları:**
  - Ünitelendirilmiş örnek sorular: `https://cdn.eba.gov.tr/yardimcikaynaklar/2022/11/kt/8kt/{turk|mat|fen|ink|dkab|ing}/{N}.pdf`, anahtar aynı dizinde `{tur|mat|fen|ink|dkab|ing}_ca.pdf`.
  - Fasiküller: `https://cdn.eba.gov.tr/icerik/2020/10/8_{ünite}_{turk|mat|fen|sos}_{il}.pdf`, `.../icerik/2020/11/unite2/...`, `.../icerik/2021/01/odsgm/...`, `.../yardimcikaynaklar/2022/01/odsgm/fasikul/2021/8/...` (`sos` @8. sınıf = İnkılap).
- **Erişim sorunları:**
  - `tekirdagodm.meb.gov.tr` → TLS sertifika hatası, `curl -sk`; `/www/icerik_listele_ajax.php` 403 → `icerik/170` ve `icerik/171` doğrudan.
  - Bazı `meb.k12.tr` hostları `webfetch` ile açılmıyor → shell `curl -sk`.
  - `mebi.eba.gov.tr` → muhtemelen oturum gerektiriyor.
- **Lisans:** MEB/ODSGM içerikleri kamuya açık eğitim materyalidir (ticari olmayan hazırlık uygulaması için uygun); yayıncı örnekleri "tadımlık/örnek" bölüm kapsamındadır. Yine de uygulamada kaynak atfı (ÖDSGM/MEB) tutulması önerilir.
- **Çakışma denetimi:** 2017-18 KKT seti farklı sitelerde (kurguluyorum / karacam / alayurtoo / Gültepe / Yalova / matematiktek) **aynı MEB dosyalarının kopyaları** olarak tekrar edebilir → indirme öncesi dosya hash'i ile tekilleştirin (Yalova ↔ Gültepe İngilizce eşleşmesi hash ile kanıtlandı).
