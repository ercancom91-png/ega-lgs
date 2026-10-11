# EGA · LGS Hazırlık Platformu

**EGA**, MEB çıkmış LGS kitapçıkları, MEB çalışma kitapları ve seçilmiş soru
bankalarıyla beslenen ücretsiz bir LGS hazırlık platformudur. Raunt / ASTRA AI
tarzı modüller, 2026 MEB "Sınav kılavuzu"ndaki gerçek sınav yapısıyla çalışan
deneme simülasyonu ve katsayılı MEB puanlama modeli içerir.

## Modüller

| Modül | Yol | İçerik |
|---|---|---|
| Ana Sayfa | `/` | Havuz özeti, sınav yapısı, rozetler |
| Çıkmış Denemeler | `/denemeler/` | 2018–2025 gerçek MEB kitapçıkları, iki oturum |
| Üretilmiş Denemeler | `/uretilmis/` | Havuzdan üretilen denemeler |
| Soru Bankası | `/banka/` | Ders/konu/zorluk filtreli test kurulumu |
| Rastgele Soru | `/rastgele/` | Tek soru pratik modu |
| MEB Çalışma Kitapları | `/meb/` | Ünite/tema testleri (konu filtresi) |
| İstatistik | `/istatistik/` | Net/istatistik özeti, motivasyon |

## Sınav yapısı (2026 MEB kılavuzu)

- **1. Oturum** 09.30 · Sözel · 50 soru · 75 dakika
  (Türkçe 24, İnkılap 10, Din 10, İngilizce 6)
- **2. Oturum** 11.30 · Sayısal · 40 soru · 80 dakika
  (Matematik 20, Fen 20)
- Oturumlar arası resmî ara (10.45–11.30); simülasyonda mola ekranı gösterilir.

### Puanlama

```
ham puan (HP) = doğru − (yanlış ÷ 3)
SP = ((HP − μ) / σ) × 10 + 50          (ders bazlı yaklaşık μ/σ)
ASP = SP × katsayı                       (Türkçe/Mat/Fen 4, diğerleri 1)
TASP = 100–500 aralığına doğrusal normalize
```

Değerler yaklaşık ve "yaklaşık" etiketiyle gösterilir (`lib/scoring.ts`).

## Veri kaynakları

Kaynak dosyalar `~/Desktop/LGS/` altında:

- `Çıkmış/` — 2018–2025 MEB LGS kitapçıkları (metin katmanı + cevap anahtarı
  ayrıştırıcısı `tools/cevap_anahtari.py`, 720/720 anahtar)
- `MEB/` — MEB çalışma kitabı PDF'leri (`tools/build_meb.py`)
- `Sorular/` — taranmış Sinerji soru bankaları (OCR: `tools/ocr_sorular.py`,
  ayrıştırma: `tools/build_sorular.py`)

### Boru hattı (pipeline)

```bash
python3 tools/cevap_anahtari.py     # kitapçık cevap anahtarları -> build/cikti/anahtarlar.json
python3 tools/build_cikmis.py       # çıkmış sorular           -> build/cikti/cikmis.json
python3 tools/build_meb.py          # MEB çalışma kitabı sorular-> build/cikti/meb.json
python3 tools/ocr_sorular.py        # taranmış PDF -> OCR       -> build/ocr_sorular/*.json
python3 tools/build_sorular.py      # OCR -> sorular            -> build/cikti/sorular.json
python3 tools/build_havuz.py        # hepsini birleştir         -> lib/soruHavuzu.ts
npm run build                       # statik site (out/)
```

Not: `lib/soruHavuzu.ts` içindeki veri, TypeScript birleşik tip sınırını
aşmamak için JSON string olarak gömülür ve çalışma anında `JSON.parse`
edilir — dosyayı elle düzenlemeyin, her zaman `build_havuz.py` ile üretin.

## Geliştirme

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # statik dışa aktarım -> out/
cd out && python3 -m http.server 4321   # önizleme
```

## Dağıtım

GitHub Actions (`.github/workflows/deploy.yml`) her `main` push'unda
`npm run build` çalıştırıp `out/` içeriğini GitHub Pages'e yayınlar.
Repo ayarlarından Pages → Source: **GitHub Actions** seçilmelidir.

Alt dizin tabanlı yayın için (ör. `kullanici.github.io/proje`):

```bash
NEXT_PUBLIC_BASE_PATH=/proje npm run build
```

## Lisans ve kullanım

Eğitim amaçlı kişisel/sınıf içi kullanım içindir. Çıkmış MEB soruları
MEB'e, soru bankası içeriklerinin telif hakkı yayıncılarına aittir;
kaynak belirtilerek çalışmalarda atıf yapılması önerilir.
