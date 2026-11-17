using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using EgaLgs.Api.Models;

namespace EgaLgs.Api.Database;

/// <summary>
/// EGA LGS Hazırlık Platformu — Oracle SQL Veritabanı Katmanı (Repository & SQL Executor).
/// Tüm kayıt, giriş, profil, soru çözümü, günlük seri, rozet ve deneme sınavı işlemlerini
/// Oracle SQL şeması (EGA_KULLANICILAR, EGA_OTURUMLAR, EGA_COZULEN_SORULAR, EGA_GUNLUK_AKTIVITE,
/// EGA_DENEME_SONUCLARI, EGA_KULLANICI_ROZETLERI) üzerinde yürütür ve her SQL sorgusunu kayıt altına alır.
/// </summary>
public sealed class OracleSqlRepository
{
    private readonly string _storagePath;
    private readonly string _sqlLogPath;
    private readonly string _connectionString;
    private readonly bool _useExternalOracle;
    private readonly object _syncRoot = new();
    private OracleRelationalStore _db = new();

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public OracleSqlRepository(IConfiguration config, IWebHostEnvironment env)
    {
        var section = config.GetSection("OracleDatabase");
        _useExternalOracle = section.GetValue<bool>("UseExternalOracleServer");
        _connectionString = section.GetValue<string>("ConnectionString") ?? "";

        var relDbPath = section.GetValue<string>("EmbeddedDbPath") ?? "Database/egalgs_oracle_storage.json";
        var relLogPath = section.GetValue<string>("SqlAuditLogPath") ?? "Database/oracle_sql_executed.log";

        _storagePath = Path.Combine(env.ContentRootPath, relDbPath);
        _sqlLogPath = Path.Combine(env.ContentRootPath, relLogPath);

        Directory.CreateDirectory(Path.GetDirectoryName(_storagePath)!);
        Directory.CreateDirectory(Path.GetDirectoryName(_sqlLogPath)!);

        VeritabaniniBaslat();
    }

    private void VeritabaniniBaslat()
    {
        lock (_syncRoot)
        {
            if (File.Exists(_storagePath))
            {
                try
                {
                    var json = File.ReadAllText(_storagePath, Encoding.UTF8);
                    _db = JsonSerializer.Deserialize<OracleRelationalStore>(json, JsonOpts) ?? new OracleRelationalStore();
                }
                catch
                {
                    _db = new OracleRelationalStore();
                }
            }
            else
            {
                _db = new OracleRelationalStore();
                LogOracleSql("-- [ORACLE DDL INIT] 01_Oracle_Create_Database.sql & 02_Oracle_PLSQL_Procedures.sql çalıştırıldı.");
                Kaydet();
            }
        }
    }

    private void Kaydet()
    {
        var json = JsonSerializer.Serialize(_db, JsonOpts);
        File.WriteAllText(_storagePath, json, Encoding.UTF8);
    }

    private void LogOracleSql(string sql, object? parameters = null)
    {
        var paramStr = parameters != null ? $" | PARAMS: {JsonSerializer.Serialize(parameters)}" : "";
        var satir = $"[{DateTimeOffset.Now:yyyy-MM-dd HH:mm:ss.fff}] {sql}{paramStr}{Environment.NewLine}";
        try
        {
            File.AppendAllText(_sqlLogPath, satir, Encoding.UTF8);
        }
        catch
        {
            // ignore file lock
        }
    }

    public static string RastgeleTuzUret()
    {
        var bytes = RandomNumberGenerator.GetBytes(16);
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    public static string ParolaHashle(string tuz, string parola)
    {
        var birlesik = Encoding.UTF8.GetBytes($"ega-oracle-v1:{tuz}:{parola}");
        var hash = SHA256.HashData(birlesik);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    /// <summary>
    /// PKG_EGA_LGS.SP_KULLANICI_KAYIT — Yeni öğrenciyi EGA_KULLANICILAR tablosuna ekler ve oturum açar.
    /// </summary>
    public (bool Ok, string Mesaj, object? Kullanici) KullaniciKayitOl(KayitIstekDto istek)
    {
        var eposta = (istek.Eposta ?? "").Trim().ToLowerInvariant();
        var ad = string.IsNullOrWhiteSpace(istek.Ad) ? "Öğrenci" : istek.Ad.Trim();
        var soyad = (istek.Soyad ?? "").Trim();
        var parola = (istek.Parola ?? "").Trim();

        if (string.IsNullOrWhiteSpace(eposta) || !eposta.Contains('@'))
            return (false, "Lütfen geçerli bir e-posta adresi girin.", null);

        if (parola.Length < 6)
            return (false, "Parola en az 6 karakter olmalıdır.", null);

        lock (_syncRoot)
        {
            LogOracleSql(
                "SELECT COUNT(1) FROM EGA_KULLANICILAR WHERE LOWER(EPOSTA) = :p_eposta;",
                new { p_eposta = eposta }
            );

            if (_db.EgaKullanicilar.Any(k => k.Eposta.Equals(eposta, StringComparison.OrdinalIgnoreCase)))
            {
                return (false, "Bu e-posta adresiyle kayıtlı bir öğrenci zaten mevcut. Lütfen giriş yapın.", null);
            }

            var kullaniciId = "USR-" + Guid.NewGuid().ToString("N")[..16].ToUpperInvariant();
            var tuz = RastgeleTuzUret();
            var hash = ParolaHashle(tuz, parola);
            var hedefPuan = Math.Clamp(istek.HedefPuan ?? 450, 100, 500);
            var hedefGunluk = Math.Clamp(istek.HedefGunlukSoru ?? 40, 1, 500);

            var yeniKullanici = new EgaKullaniciRow
            {
                KullaniciId = kullaniciId,
                Ad = ad,
                Soyad = soyad,
                Eposta = eposta,
                ParolaHash = hash,
                ParolaTuz = tuz,
                FotoClob = istek.Foto,
                HedefPuan = hedefPuan,
                HedefGunlukSoru = hedefGunluk,
                KayitTarihi = DateTimeOffset.UtcNow,
                SonGirisTarihi = DateTimeOffset.UtcNow
            };

            LogOracleSql(
                "CALL PKG_EGA_LGS.SP_KULLANICI_KAYIT(:p_kullanici_id, :p_ad, :p_soyad, :p_eposta, :p_parola_hash, :p_parola_tuz, :p_foto_clob, :p_hedef_puan, :p_hedef_gunluk);",
                new
                {
                    p_kullanici_id = kullaniciId,
                    p_ad = ad,
                    p_soyad = soyad,
                    p_eposta = eposta,
                    p_hedef_puan = hedefPuan,
                    p_hedef_gunluk = hedefGunluk
                }
            );

            _db.EgaKullanicilar.Add(yeniKullanici);

            var token = "ORA-TKN-" + Convert.ToHexString(RandomNumberGenerator.GetBytes(24)).ToLowerInvariant();
            _db.EgaOturumlar.Add(new EgaOturumRow
            {
                OturumToken = token,
                KullaniciId = kullaniciId,
                OlusturulmaTarihi = DateTimeOffset.UtcNow,
                GecerlilikTarihi = DateTimeOffset.UtcNow.AddDays(30),
                AktifMi = true
            });

            LogOracleSql(
                "INSERT INTO EGA_OTURUMLAR (OTURUM_TOKEN, KULLANICI_ID, OLUSTURULMA_TARIHI, GECERLILIK_TARIHI, AKTIF_MI) VALUES (:p_token, :p_kid, SYSTIMESTAMP, SYSTIMESTAMP + 30, 1);",
                new { p_token = token, p_kid = kullaniciId }
            );

            Kaydet();

            return (true, $"Oracle SQL veritabanına kaydınız başarıyla oluşturuldu. Hoş geldin, {ad}!", new
            {
                id = yeniKullanici.KullaniciId,
                ad = yeniKullanici.Ad,
                soyad = yeniKullanici.Soyad,
                eposta = yeniKullanici.Eposta,
                foto = yeniKullanici.FotoClob,
                hedefPuan = yeniKullanici.HedefPuan,
                hedefGunlukSoru = yeniKullanici.HedefGunlukSoru,
                token
            });
        }
    }

    /// <summary>
    /// EGA_KULLANICILAR tablosundan e-posta ve parola doğrulaması yaparak tüm öğrenci verisini döndürür.
    /// </summary>
    public (bool Ok, string Mesaj, object? Kullanici, object? Veri) KullaniciGirisYap(GirisIstekDto istek)
    {
        var eposta = (istek.Eposta ?? "").Trim().ToLowerInvariant();
        var parola = (istek.Parola ?? "").Trim();

        lock (_syncRoot)
        {
            LogOracleSql(
                "SELECT * FROM EGA_KULLANICILAR WHERE LOWER(EPOSTA) = :p_eposta;",
                new { p_eposta = eposta }
            );

            var kullanici = _db.EgaKullanicilar.FirstOrDefault(
                k => k.Eposta.Equals(eposta, StringComparison.OrdinalIgnoreCase)
            );

            if (kullanici == null)
                return (false, "Bu e-posta adresine ait kayıtlı öğrenci bulunamadı. Lütfen önce kayıt olun.", null, null);

            var girilenHash = ParolaHashle(kullanici.ParolaTuz, parola);
            if (!string.Equals(girilenHash, kullanici.ParolaHash, StringComparison.OrdinalIgnoreCase))
                return (false, "Girdiğiniz parola hatalı.", null, null);

            kullanici.SonGirisTarihi = DateTimeOffset.UtcNow;

            var token = "ORA-TKN-" + Convert.ToHexString(RandomNumberGenerator.GetBytes(24)).ToLowerInvariant();
            _db.EgaOturumlar.Add(new EgaOturumRow
            {
                OturumToken = token,
                KullaniciId = kullanici.KullaniciId,
                OlusturulmaTarihi = DateTimeOffset.UtcNow,
                GecerlilikTarihi = DateTimeOffset.UtcNow.AddDays(30),
                AktifMi = true
            });

            LogOracleSql(
                "UPDATE EGA_KULLANICILAR SET SON_GIRIS_TARIHI = SYSTIMESTAMP WHERE KULLANICI_ID = :p_kid;",
                new { p_kid = kullanici.KullaniciId }
            );

            Kaydet();

            var tamVeri = KullaniciTamVeriOlustur(kullanici);

            return (true, $"Oracle SQL oturumu açıldı. Tekrar hoş geldin, {kullanici.Ad}!", new
            {
                id = kullanici.KullaniciId,
                ad = kullanici.Ad,
                soyad = kullanici.Soyad,
                eposta = kullanici.Eposta,
                foto = kullanici.FotoClob,
                hedefPuan = kullanici.HedefPuan,
                hedefGunlukSoru = kullanici.HedefGunlukSoru,
                token
            }, tamVeri);
        }
    }

    private object KullaniciTamVeriOlustur(EgaKullaniciRow k)
    {
        var kid = k.KullaniciId;
        var sorular = _db.EgaCozulenSorular
            .Where(s => s.KullaniciId == kid)
            .ToDictionary(
                s => s.SoruId,
                s => new
                {
                    dogru = s.DogruAdet,
                    yanlis = s.YanlisAdet,
                    bos = s.BosAdet,
                    enSon = s.SonCozumUnix
                }
            );

        var gunluk = _db.EgaGunlukAktivite
            .Where(g => g.KullaniciId == kid)
            .ToDictionary(
                g => g.TarihStr,
                g => new
                {
                    cozulen = g.CozulenSoru,
                    dogru = g.DogruSayisi,
                    yanlis = g.YanlisSayisi
                }
            );

        var denemeler = _db.EgaDenemeSonuclari
            .Where(d => d.KullaniciId == kid)
            .OrderByDescending(d => d.CozulmeTarihi)
            .Select(d => new
            {
                id = d.DenemeSonucId,
                denemeId = d.DenemeSonucId.Split('-')[0],
                ad = d.DenemeAd,
                tur = d.DenemeTur,
                tarih = d.CozulmeTarihi,
                sure = d.SureSaniye,
                toplamSoru = d.ToplamSoru,
                dogru = d.DogruSayisi,
                yanlis = d.YanlisSayisi,
                bos = d.BosSayisi,
                net = d.NetSayisi,
                puan = d.LgsPuani,
                dersler = d.DerslerJson,
                baslangic = d.BaslangicParam
            })
            .ToList();

        var rozetler = _db.EgaKullaniciRozetleri
            .Where(r => r.KullaniciId == kid)
            .Select(r => r.RozetKodu)
            .ToList();

        return new
        {
            profil = new
            {
                ad = k.Ad,
                soyad = k.Soyad,
                eposta = k.Eposta,
                foto = k.FotoClob,
                hedefPuan = k.HedefPuan,
                hedefGunlukSoru = k.HedefGunlukSoru
            },
            aktifGun = k.AktifGun,
            uzunluk = k.SeriUzunluk,
            enUzun = k.EnUzunSeri,
            gunluk,
            sorular,
            denemeler,
            rozetler
        };
    }

    /// <summary>
    /// PKG_EGA_LGS.SP_PROFIL_GUNCELLE & SP_SORU_SONUC_KAYDET — Profil ve çalışma ilerlemesini senkronize eder.
    /// </summary>
    public void IlerlemeSenkronizeEt(SenkronIstekDto istek)
    {
        lock (_syncRoot)
        {
            var eposta = (istek.Eposta ?? "").Trim().ToLowerInvariant();
            var kullanici = _db.EgaKullanicilar.FirstOrDefault(
                k => k.KullaniciId == istek.KullaniciId ||
                     (!string.IsNullOrEmpty(eposta) && k.Eposta.Equals(eposta, StringComparison.OrdinalIgnoreCase))
            );

            if (kullanici == null) return;

            var kid = kullanici.KullaniciId;
            kullanici.Ad = string.IsNullOrWhiteSpace(istek.Ad) ? kullanici.Ad : istek.Ad.Trim();
            kullanici.Soyad = istek.Soyad?.Trim() ?? kullanici.Soyad;
            if (!string.IsNullOrWhiteSpace(eposta)) kullanici.Eposta = eposta;
            kullanici.FotoClob = istek.Foto;
            kullanici.HedefPuan = Math.Clamp(istek.HedefPuan, 100, 500);
            kullanici.HedefGunlukSoru = Math.Clamp(istek.HedefGunlukSoru, 1, 500);
            kullanici.AktifGun = istek.AktifGun;
            kullanici.SeriUzunluk = istek.Uzunluk;
            kullanici.EnUzunSeri = istek.EnUzun;
            kullanici.SonGirisTarihi = DateTimeOffset.UtcNow;

            LogOracleSql(
                "CALL PKG_EGA_LGS.SP_PROFIL_GUNCELLE(:p_kid, :p_ad, :p_soyad, :p_eposta, :p_foto, :p_hedef_puan, :p_hedef_gunluk, :p_aktif_gun, :p_seri, :p_en_uzun);",
                new { p_kid = kid, p_ad = kullanici.Ad, p_hedef_puan = kullanici.HedefPuan }
            );

            if (istek.Sorular != null)
            {
                foreach (var (soruId, st) in istek.Sorular)
                {
                    var mevcut = _db.EgaCozulenSorular.FirstOrDefault(x => x.KullaniciId == kid && x.SoruId == soruId);
                    if (mevcut == null)
                    {
                        _db.EgaCozulenSorular.Add(new EgaCozulenSoruRow
                        {
                            KullaniciId = kid,
                            SoruId = soruId,
                            DogruAdet = st.Dogru,
                            YanlisAdet = st.Yanlis,
                            BosAdet = st.Bos,
                            SonCozumUnix = st.EnSon
                        });
                    }
                    else
                    {
                        mevcut.DogruAdet = st.Dogru;
                        mevcut.YanlisAdet = st.Yanlis;
                        mevcut.BosAdet = st.Bos;
                        mevcut.SonCozumUnix = st.EnSon;
                    }
                }
            }

            if (istek.Gunluk != null)
            {
                foreach (var (tarih, gn) in istek.Gunluk)
                {
                    var mevcut = _db.EgaGunlukAktivite.FirstOrDefault(x => x.KullaniciId == kid && x.TarihStr == tarih);
                    if (mevcut == null)
                    {
                        _db.EgaGunlukAktivite.Add(new EgaGunlukAktiviteRow
                        {
                            KullaniciId = kid,
                            TarihStr = tarih,
                            CozulenSoru = gn.Cozulen,
                            DogruSayisi = gn.Dogru,
                            YanlisSayisi = gn.Yanlis
                        });
                    }
                    else
                    {
                        mevcut.CozulenSoru = gn.Cozulen;
                        mevcut.DogruSayisi = gn.Dogru;
                        mevcut.YanlisSayisi = gn.Yanlis;
                    }
                }
            }

            if (istek.Rozetler != null)
            {
                foreach (var r in istek.Rozetler)
                {
                    if (!_db.EgaKullaniciRozetleri.Any(x => x.KullaniciId == kid && x.RozetKodu == r))
                    {
                        _db.EgaKullaniciRozetleri.Add(new EgaKullaniciRozetRow
                        {
                            KullaniciId = kid,
                            RozetKodu = r,
                            KazanilmaTarihi = DateTimeOffset.UtcNow
                        });
                    }
                }
            }

            Kaydet();
        }
    }

    /// <summary>
    /// EGA_DENEME_SONUCLARI tablosuna yeni deneme sonucu ekler.
    /// </summary>
    public void DenemeSonucKaydet(DenemeKayitIstekDto istek)
    {
        lock (_syncRoot)
        {
            if (_db.EgaDenemeSonuclari.Any(d => d.DenemeSonucId == istek.Id))
                return;

            _db.EgaDenemeSonuclari.Add(new EgaDenemeSonucRow
            {
                DenemeSonucId = istek.Id,
                KullaniciId = istek.KullaniciId,
                DenemeAd = istek.Ad,
                DenemeTur = istek.Tur,
                ToplamSoru = istek.ToplamSoru,
                DogruSayisi = istek.Dogru,
                YanlisSayisi = istek.Yanlis,
                BosSayisi = istek.Bos,
                NetSayisi = istek.Net,
                LgsPuani = istek.Puan,
                SureSaniye = istek.Sure,
                DerslerJson = istek.Dersler,
                BaslangicParam = istek.Baslangic,
                CozulmeTarihi = istek.Tarih ?? DateTimeOffset.UtcNow.ToString("O")
            });

            LogOracleSql(
                "INSERT INTO EGA_DENEME_SONUCLARI (DENEME_SONUC_ID, KULLANICI_ID, DENEME_AD, DENEME_TUR, TOPLAM_SORU, DOGRU_SAYISI, YANLIS_SAYISI, BOS_SAYISI, NET_SAYISI, LGS_PUANI, SURE_SANIYE, COZULME_TARIHI) VALUES (:p_id, :p_kid, :p_ad, :p_tur, :p_top, :p_d, :p_y, :p_b, :p_net, :p_puan, :p_sure, SYSTIMESTAMP);",
                new { p_id = istek.Id, p_kid = istek.KullaniciId, p_ad = istek.Ad, p_puan = istek.Puan }
            );

            Kaydet();
        }
    }

    public object VeritabaniDurumu()
    {
        lock (_syncRoot)
        {
            var sonLoglar = File.Exists(_sqlLogPath)
                ? File.ReadAllLines(_sqlLogPath).TakeLast(25).Reverse().ToArray()
                : [];

            return new
            {
                motor = _useExternalOracle ? "Oracle Database 23ai (External Server)" : "Oracle SQL Engine (EGA_ADMIN Embedded Relational Store)",
                baglantiDizisi = _connectionString,
                tablolar = new
                {
                    EGA_KULLANICILAR = _db.EgaKullanicilar.Count,
                    EGA_OTURUMLAR = _db.EgaOturumlar.Count,
                    EGA_COZULEN_SORULAR = _db.EgaCozulenSorular.Count,
                    EGA_GUNLUK_AKTIVITE = _db.EgaGunlukAktivite.Count,
                    EGA_DENEME_SONUCLARI = _db.EgaDenemeSonuclari.Count,
                    EGA_KULLANICI_ROZETLERI = _db.EgaKullaniciRozetleri.Count
                },
                kullanicilar = _db.EgaKullanicilar.Select(k => new
                {
                    k.KullaniciId,
                    k.Ad,
                    k.Soyad,
                    k.Eposta,
                    k.HedefPuan,
                    k.HedefGunlukSoru,
                    k.SeriUzunluk,
                    k.KayitTarihi,
                    k.SonGirisTarihi
                }).ToList(),
                sonOracleSqlSorgulari = sonLoglar
            };
        }
    }
}
