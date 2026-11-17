using EgaLgs.Api.Database;
using EgaLgs.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<OracleSqlRepository>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (args.Contains("--self-test"))
{
    var repo = app.Services.GetRequiredService<OracleSqlRepository>();
    var (regOk, regMsg, _) = repo.KullaniciKayitOl(new KayitIstekDto
    {
        Ad = "Test",
        Soyad = "Öğrenci",
        Eposta = $"test_{Guid.NewGuid():N}@egalgs.com",
        Parola = "Parola123!",
        HedefPuan = 480,
        HedefGunlukSoru = 45
    });
    Console.WriteLine($"[SELF-TEST] Register: {regOk} - {regMsg}");
    if (!regOk) Environment.Exit(1);
    Console.WriteLine("[SELF-TEST] Oracle SQL Repository verified successfully!");
    return;
}

app.UseCors();

// Statik ön yüz dosyalarını (wwwroot) sun
app.UseDefaultFiles();
app.UseStaticFiles();

// ============================================================================
// ORACLE SQL REST API UÇ NOKTALARI (/api/...)
// ============================================================================

app.MapGet("/api/health", (OracleSqlRepository repo) =>
{
    return Results.Ok(repo.VeritabaniDurumu());
});

app.MapPost("/api/auth/send-code", (OtpGonderIstekDto istek, OracleSqlRepository repo) =>
{
    var (ok, mesaj, kod) = repo.DogrulamaKoduGonder(istek);
    if (!ok)
        return Results.BadRequest(new { ok = false, mesaj });
    return Results.Ok(new { ok = true, mesaj, kod, smtpGonderildi = false });
});

app.MapPost("/api/auth/register", (KayitIstekDto istek, OracleSqlRepository repo) =>
{
    var (ok, mesaj, kullanici) = repo.KullaniciKayitOl(istek);
    if (!ok)
        return Results.BadRequest(new { ok = false, mesaj });
    return Results.Ok(new { ok = true, mesaj, kullanici });
});

app.MapPost("/api/auth/login", (GirisIstekDto istek, OracleSqlRepository repo) =>
{
    var (ok, mesaj, kullanici, veri) = repo.KullaniciGirisYap(istek);
    if (!ok)
        return Results.BadRequest(new { ok = false, mesaj });
    return Results.Ok(new { ok = true, mesaj, kullanici, veri });
});

app.MapPost("/api/progress/sync", (SenkronIstekDto istek, OracleSqlRepository repo) =>
{
    repo.IlerlemeSenkronizeEt(istek);
    return Results.Ok(new { ok = true, mesaj = "Oracle SQL senkronizasyonu tamamlandı." });
});

app.MapPost("/api/exams", (DenemeKayitIstekDto istek, OracleSqlRepository repo) =>
{
    repo.DenemeSonucKaydet(istek);
    return Results.Ok(new { ok = true, mesaj = "Deneme sonucu EGA_DENEME_SONUCLARI tablosuna kaydedildi." });
});

// Canlı Oracle SQL Veritabanı Konsolu (/api/oracle-console)
app.MapGet("/api/oracle-console", (OracleSqlRepository repo) =>
{
    var durumJson = System.Text.Json.JsonSerializer.Serialize(repo.VeritabaniDurumu(), new System.Text.Json.JsonSerializerOptions
    {
        WriteIndented = true
    });
    var html = $$"""
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8" />
      <title>EGA · Oracle SQL Veritabanı Yönetim Konsolu (Rider)</title>
      <style>
        body { background:#08080a; color:#f3f3f4; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 32px; margin: 0; }
        .head { display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #ffd400; padding-bottom:16px; margin-bottom:24px; }
        .badge { background:#ffd400; color:#08080a; padding:6px 12px; font-weight:800; font-size:13px; }
        a.btn { background:#ffd400; color:#08080a; padding:10px 16px; text-decoration:none; font-weight:800; }
        pre { background:#121215; border:1px solid #2a2a30; padding:20px; overflow-x:auto; font-size:13px; line-height:1.6; color:#3ddc97; }
      </style>
    </head>
    <body>
      <div class="head">
        <div>
          <span class="badge">ORACLE SQL · EGA_ADMIN SCHEMA</span>
          <h1 style="margin:10px 0 0;font-size:24px;">EGA LGS Hazırlık — Canlı Oracle SQL Veritabanı Konsolu</h1>
        </div>
        <a class="btn" href="/">← Uygulamaya Dön</a>
      </div>
      <p>Aşağıda <code>EGA_KULLANICILAR</code>, <code>EGA_OTURUMLAR</code>, <code>EGA_COZULEN_SORULAR</code>, <code>EGA_GUNLUK_AKTIVITE</code>, <code>EGA_DENEME_SONUCLARI</code> ve <code>EGA_KULLANICI_ROZETLERI</code> tablolarının anlık durumu ve yürütülen son Oracle SQL sorguları yer almaktadır:</p>
      <pre>{{System.Net.WebUtility.HtmlEncode(durumJson)}}</pre>
    </body>
    </html>
    """;
    return Results.Content(html, "text/html; charset=utf-8");
});

app.Run();
