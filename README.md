# EGA · LGS Hazırlık Platformu

MEB'in **çıkmış LGS denemeleri (2018–2025)** ve ÖDSGM çalışma kitaplarından derlenen soru bankasıyla hazırlanan, **Supabase Auth** ve **Oracle Autonomous Database** senkronizasyon destekli profesyonel LGS hazırlık platformu.

## Özellikler

- **Çıkmış Denemeler (2018–2025)** — İki oturumlu (sözel 50/75 dk, sayısal 40/80 dk) gerçek sınav simülasyonu; orijinal kitapçıklardan aktarılmış soru görselleri, grafikler, tablolar ve şekilli şıklar; resmî puanlama formülü (ham puan = doğru − yanlış/3, katsayılar 4/1, TASP 100–500).
- **Görselli & Maddelendirilmiş Soru Düzeni** — 1.800+ resmi soru görseli (`public/gorseller/`) otomatik kırpılıp optimize edilmiş WebP formatında sorulara entegre edilmiştir. Maddelendirilmiş öncüller (`•`, `I, II, III`, `1. Adım`) alt alta, soru kökleri (`Buna göre...`) ise ayrı paragraf olarak sunulur.
- **Deneme Üret & Test Çöz** — Ders, konu, soru sayısı ve süre seçerek özel deneme veya konu testi kurma; anında geri bildirim ve çözüm.
- **MEB Çalışma Kitapları** — ÖDSGM kitaplarının ünite ve tema bazlı interaktif testleri.
- **Giriş Yap & Kayıt Ol (`/giris`)** — **Supabase Auth** ve **Oracle Database** (`db/supabase_schema.sql`, `db/oracle_schema.sql`) entegrasyonu ile kullanıcı kaydı, oturum açma, profil fotoğrafı yükleme ve bulut senkronizasyonu.
- **Profil, Hedefler & Rozetler (`/profil`)** —
  - **Profil Kartı & Fotoğraf:** Profil fotoğrafı yükleme/değiştirme/kaldırma (256×256 otomatik kırpma ve sıkıştırma).
  - **İnteraktif Hedef Seçimi:** Profil kartının hemen altında yer alan Hedefler bölümünde doğrudan **Hedef Puan (100–500)** ve **Günlük Soru Hedefi** seçimi.
  - **Rozetler & Denemelerim:** Kazanılan başarı rozetleri ve geçmiş deneme sonuçları.
  - **Hesap & Kimlik Ayarları:** Rozetler bölümünün altında yalnızca İsim, Soyisim, E-posta, Parola/Uygulama Kilidi ve Hesap Silme yönetimi.
- **Tam Responsive Tasarım** — Masaüstü, tablet ve mobil cihazlar için uyarlanmış esnek ızgara yapısı ve mobil çekmece menüsü.

## Veritabanı Kurulumu (Supabase & Oracle DB)

1. `.env.example` dosyasını `.env.local` olarak kopyalayın ve bağlantı bilgilerinizi girin:
   - `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase Auth & PostgreSQL)
   - `NEXT_PUBLIC_ORACLE_ORDS_URL`, `ORACLE_DB_USER`, `ORACLE_DB_PASSWORD`, `ORACLE_DB_CONNECT_STRING` (Oracle Autonomous Database)
2. Tablo ve prosedür şemalarını veritabanınızda çalıştırın:
   - Supabase SQL Editor: [`db/supabase_schema.sql`](file:///Users/ercan/Documents/Qoder/lgs-hazirlik/db/supabase_schema.sql)
   - Oracle SQL Developer / Autonomous DB Actions: [`db/oracle_schema.sql`](file:///Users/ercan/Documents/Qoder/lgs-hazirlik/db/oracle_schema.sql)

## Geliştirme ve Derleme

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Üretim derlemesi (out/)
```
