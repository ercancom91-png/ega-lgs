# EGA · LGS Hazırlık — JetBrains Rider & Oracle SQL Projesi (`EgaLgs.sln`)

Bu klasör, **EGA LGS Hazırlık Platformu**'nun **JetBrains Rider** üzerinde çalışan bağımsız C# / ASP.NET Core & **Oracle SQL** tam yığın (full-stack) projesidir.

## Mimari ve Özellikler

1. **Salt Görüntüleme (Misafir) Koruması & Sayfa Değişmeden Açılan Üyelik Modalı:**
   - Kayıt olmayan / giriş yapmayan kullanıcılar yalnızca sayfaları görüntüleyebilir.
   - Herhangi bir soruya, teste, denemeye, konuya veya ayara tıklandığında **bulunduğu sayfa değişmeden** ekranda **Giriş Yap / Ücretsiz Kayıt Ol** modal penceresi açılır.
2. **Oracle SQL Veritabanı Altyapısı (`src/EgaLgs.Api/Database/`):**
   - [`01_Oracle_Create_Database.sql`](file:///Users/ercan/Documents/Qoder/lgs-hazirlik/EgaLgs.Rider/src/EgaLgs.Api/Database/01_Oracle_Create_Database.sql): `EGA_KULLANICILAR`, `EGA_OTURUMLAR`, `EGA_SORU_HAVUZU`, `EGA_COZULEN_SORULAR`, `EGA_GUNLUK_AKTIVITE`, `EGA_DENEME_SONUCLARI` ve `EGA_KULLANICI_ROZETLERI` tablolarını, indekslerini ve kısıtlarını oluşturur.
   - [`02_Oracle_PLSQL_Procedures.sql`](file:///Users/ercan/Documents/Qoder/lgs-hazirlik/EgaLgs.Rider/src/EgaLgs.Api/Database/02_Oracle_PLSQL_Procedures.sql): `PKG_EGA_LGS` paketi ve `SP_KULLANICI_KAYIT`, `SP_PROFIL_GUNCELLE`, `SP_SORU_SONUC_KAYDET` saklı yordamlarını içerir.
   - [`OracleSqlRepository.cs`](file:///Users/ercan/Documents/Qoder/lgs-hazirlik/EgaLgs.Rider/src/EgaLgs.Api/Database/OracleSqlRepository.cs): Oracle sunucusu bağlıyken doğrudan Oracle üzerinde, bağlı değilken ise yerel gömülü ilişkisel Oracle tabloları (`Database/egalgs_oracle_storage.json`) üzerinde çalışır ve çalıştırılan her Oracle SQL komutunu `Database/oracle_sql_executed.log` dosyasına yazar.

## Rider'da Çalıştırma

1. JetBrains Rider'da [`EgaLgs.sln`](file:///Users/ercan/Documents/Qoder/lgs-hazirlik/EgaLgs.Rider/EgaLgs.sln) dosyasını açın.
2. Sağ üstteki **`EgaLgs.Api (Oracle SQL + Web)`** profilini seçip yeşil **Run (▶)** butonuna basın.
3. Tarayıcıda otomatik olarak açılan adresler:
   - **Uygulama:** `http://localhost:5180`
   - **Canlı Oracle SQL Veritabanı Konsolu:** `http://localhost:5180/api/oracle-console`
   - **API Sağlık & Tablo Durumu (JSON):** `http://localhost:5180/api/health`

## Harici Oracle Database 23ai Kurulumu (İsteğe Bağlı)

Bilgisayarınızda Docker / OrbStack kuruluysa tek komutla yerel Oracle 23ai Free sunucusunu ayağa kaldırabilirsiniz:

```bash
docker compose -f docker-compose.oracle.yml up -d
```
 ardından `src/EgaLgs.Api/appsettings.json` içindeki `"UseExternalOracleServer": true` ayarını aktif edebilirsiniz.
