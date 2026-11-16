# EGA · LGS Hazırlık Platformu

MEB'in **çıkmış LGS denemeleri** ve ÖDSGM çalışma kitaplarından derlenen soru bankasıyla
hazırlanan ücretsiz, tamamen istemci tarafında çalışan bir LGS hazırlık uygulaması.

## Özellikler

- **Çıkmış Denemeler** — 2018–2025 arası MEB LGS sorularıyla iki oturumlu (sözel 50/75 dk,
  sayısal 40/80 dk) gerçek sınav simülasyonu; resmî puanlama formülü (ham puan = doğru − yanlış/3,
  katsayılar 4/1, TASP 100–500).
- **Deneme Üret** — ders, soru sayısı ve süre seçerek özel deneme kurmak.
- **Test Çöz** — konu bazlı soru havuzundan dilediğin testi kurmak; çözüm ve anında geri bildirim.
- **Rastgele Soru** — tek tıkla karışık soru çözmek.
- **MEB Çalışma Kitapları** — ÖDSGM kitapları konu konu tarandı; konuların testlerini açmak.
- **Profil & Ayarlar** — ad/hedef ayarları, ilerleme özeti, rozetler, gün serisi ve
  **Denemelerim** (çözülen denemeler; istediğini tekrar açabilirsin).
- **Uygulama kilidi** — profil kodun (SHA-256 ile özetlenir); her yeni oturumda tekrar sorulur.
- **Hesabı sil** — tüm yerel veriyi kalıcı olarak kaldırır (geri yükleme yok).

Tüm veri **yalnızca kullandığında tarayıcının yerel hafızasında** tutulur; hiçbir sunucuya
gönderilmez.

## Teknoloji

- Next.js 14 (App Router) + React 18 + TypeScript
- Statik site üretimi (`next build` → `out/`); Pages/Vercel/Netlify gibi her statik
  barındırıcıda çalışır
- Soru bankası ve denemeler: `lib/soruHavuzu.ts`, `lib/exams.ts` (gerçek kaynaklardan üretildi)

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ klasörüne statik site üretir
```

## Dağıtım (GitHub Pages)

Repo ana dala push edildiğinde `.github/workflows/publish.yml` siteyi derleyip
GitHub Pages'e dağıtır:

```
https://<kullanici>.github.io/ega-lgs/
```

Siteyi repoya bağlayarak herkesin erişebileceği canlı bir adresi otomatik elde edersin.

## Kaynak ve uyarı

Sorular MEB'in yayımladığı çıkmış LGS sorularından ve ÖDSGM kitaplarından temin edilmiştir;
telif hakkı sahiplerine aittir. Puanlamada kullanılan formüller tahmini değerdir ve
resmî bir kesinlik taşımaz.
