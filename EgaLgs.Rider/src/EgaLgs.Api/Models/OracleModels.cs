using System.Text.Json.Serialization;

namespace EgaLgs.Api.Models;

/// <summary>
/// EGA_KULLANICILAR tablosu varlık modeli (Oracle SQL).
/// </summary>
public sealed class EgaKullaniciRow
{
    public string KullaniciId { get; set; } = string.Empty;
    public string Ad { get; set; } = "Öğrenci";
    public string Soyad { get; set; } = string.Empty;
    public string Eposta { get; set; } = string.Empty;
    public string ParolaHash { get; set; } = string.Empty;
    public string ParolaTuz { get; set; } = string.Empty;
    public string? FotoClob { get; set; }
    public int HedefPuan { get; set; } = 450;
    public int HedefGunlukSoru { get; set; } = 40;
    public string? AktifGun { get; set; }
    public int SeriUzunluk { get; set; }
    public int EnUzunSeri { get; set; }
    public DateTimeOffset KayitTarihi { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset SonGirisTarihi { get; set; } = DateTimeOffset.UtcNow;
}

/// <summary>
/// EGA_OTURUMLAR tablosu varlık modeli.
/// </summary>
public sealed class EgaOturumRow
{
    public string OturumToken { get; set; } = string.Empty;
    public string KullaniciId { get; set; } = string.Empty;
    public DateTimeOffset OlusturulmaTarihi { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset GecerlilikTarihi { get; set; } = DateTimeOffset.UtcNow.AddDays(30);
    public bool AktifMi { get; set; } = true;
}

/// <summary>
/// EGA_COZULEN_SORULAR tablosu varlık modeli.
/// </summary>
public sealed class EgaCozulenSoruRow
{
    public string KullaniciId { get; set; } = string.Empty;
    public string SoruId { get; set; } = string.Empty;
    public int DogruAdet { get; set; }
    public int YanlisAdet { get; set; }
    public int BosAdet { get; set; }
    public long SonCozumUnix { get; set; }
}

/// <summary>
/// EGA_GUNLUK_AKTIVITE tablosu varlık modeli.
/// </summary>
public sealed class EgaGunlukAktiviteRow
{
    public string KullaniciId { get; set; } = string.Empty;
    public string TarihStr { get; set; } = string.Empty;
    public int CozulenSoru { get; set; }
    public int DogruSayisi { get; set; }
    public int YanlisSayisi { get; set; }
}

/// <summary>
/// EGA_DENEME_SONUCLARI tablosu varlık modeli.
/// </summary>
public sealed class EgaDenemeSonucRow
{
    public string DenemeSonucId { get; set; } = string.Empty;
    public string KullaniciId { get; set; } = string.Empty;
    public string DenemeAd { get; set; } = string.Empty;
    public string DenemeTur { get; set; } = "cikmis";
    public int ToplamSoru { get; set; }
    public int DogruSayisi { get; set; }
    public int YanlisSayisi { get; set; }
    public int BosSayisi { get; set; }
    public double NetSayisi { get; set; }
    public double LgsPuani { get; set; }
    public int SureSaniye { get; set; }
    public object? DerslerJson { get; set; }
    public string? BaslangicParam { get; set; }
    public string CozulmeTarihi { get; set; } = DateTimeOffset.UtcNow.ToString("O");
}

/// <summary>
/// EGA_KULLANICI_ROZETLERI tablosu varlık modeli.
/// </summary>
public sealed class EgaKullaniciRozetRow
{
    public string KullaniciId { get; set; } = string.Empty;
    public string RozetKodu { get; set; } = string.Empty;
    public DateTimeOffset KazanilmaTarihi { get; set; } = DateTimeOffset.UtcNow;
}

/// <summary>
/// Tüm Oracle tablolarının yerel diskteki ilişkisel yansıması (Oracle sunucusu kapalıyken de 100% çalışır).
/// </summary>
public sealed class OracleRelationalStore
{
    public List<EgaKullaniciRow> EgaKullanicilar { get; set; } = [];
    public List<EgaOturumRow> EgaOturumlar { get; set; } = [];
    public List<EgaCozulenSoruRow> EgaCozulenSorular { get; set; } = [];
    public List<EgaGunlukAktiviteRow> EgaGunlukAktivite { get; set; } = [];
    public List<EgaDenemeSonucRow> EgaDenemeSonuclari { get; set; } = [];
    public List<EgaKullaniciRozetRow> EgaKullaniciRozetleri { get; set; } = [];
}

// --- İSTEK / YANIT DTO MODELLERİ ---

public sealed class KayitIstekDto
{
    [JsonPropertyName("ad")] public string Ad { get; set; } = string.Empty;
    [JsonPropertyName("soyad")] public string Soyad { get; set; } = string.Empty;
    [JsonPropertyName("eposta")] public string Eposta { get; set; } = string.Empty;
    [JsonPropertyName("parola")] public string Parola { get; set; } = string.Empty;
    [JsonPropertyName("foto")] public string? Foto { get; set; }
    [JsonPropertyName("hedefPuan")] public int? HedefPuan { get; set; }
    [JsonPropertyName("hedefGunlukSoru")] public int? HedefGunlukSoru { get; set; }
}

public sealed class GirisIstekDto
{
    [JsonPropertyName("eposta")] public string Eposta { get; set; } = string.Empty;
    [JsonPropertyName("parola")] public string Parola { get; set; } = string.Empty;
}

public sealed class SoruIstatistikDto
{
    [JsonPropertyName("dogru")] public int Dogru { get; set; }
    [JsonPropertyName("yanlis")] public int Yanlis { get; set; }
    [JsonPropertyName("bos")] public int Bos { get; set; }
    [JsonPropertyName("enSon")] public long EnSon { get; set; }
}

public sealed class GunlukIstatistikDto
{
    [JsonPropertyName("cozulen")] public int Cozulen { get; set; }
    [JsonPropertyName("dogru")] public int Dogru { get; set; }
    [JsonPropertyName("yanlis")] public int Yanlis { get; set; }
}

public sealed class SenkronIstekDto
{
    [JsonPropertyName("kullaniciId")] public string KullaniciId { get; set; } = string.Empty;
    [JsonPropertyName("ad")] public string Ad { get; set; } = "Öğrenci";
    [JsonPropertyName("soyad")] public string Soyad { get; set; } = string.Empty;
    [JsonPropertyName("eposta")] public string Eposta { get; set; } = string.Empty;
    [JsonPropertyName("foto")] public string? Foto { get; set; }
    [JsonPropertyName("hedefPuan")] public int HedefPuan { get; set; } = 450;
    [JsonPropertyName("hedefGunlukSoru")] public int HedefGunlukSoru { get; set; } = 40;
    [JsonPropertyName("aktifGun")] public string? AktifGun { get; set; }
    [JsonPropertyName("uzunluk")] public int Uzunluk { get; set; }
    [JsonPropertyName("enUzun")] public int EnUzun { get; set; }
    [JsonPropertyName("rozetler")] public List<string>? Rozetler { get; set; }
    [JsonPropertyName("gunluk")] public Dictionary<string, GunlukIstatistikDto>? Gunluk { get; set; }
    [JsonPropertyName("sorular")] public Dictionary<string, SoruIstatistikDto>? Sorular { get; set; }
}

public sealed class DenemeKayitIstekDto
{
    [JsonPropertyName("id")] public string Id { get; set; } = string.Empty;
    [JsonPropertyName("kullaniciId")] public string KullaniciId { get; set; } = string.Empty;
    [JsonPropertyName("ad")] public string Ad { get; set; } = string.Empty;
    [JsonPropertyName("tur")] public string Tur { get; set; } = "cikmis";
    [JsonPropertyName("toplamSoru")] public int ToplamSoru { get; set; }
    [JsonPropertyName("dogru")] public int Dogru { get; set; }
    [JsonPropertyName("yanlis")] public int Yanlis { get; set; }
    [JsonPropertyName("bos")] public int Bos { get; set; }
    [JsonPropertyName("net")] public double Net { get; set; }
    [JsonPropertyName("puan")] public double Puan { get; set; }
    [JsonPropertyName("sure")] public int Sure { get; set; }
    [JsonPropertyName("dersler")] public object? Dersler { get; set; }
    [JsonPropertyName("baslangic")] public string? Baslangic { get; set; }
    [JsonPropertyName("tarih")] public string? Tarih { get; set; }
}
