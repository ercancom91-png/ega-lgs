-- ============================================================================
-- EGA · LGS HAZIRLIK PLATFORMU
-- ORACLE PL/SQL PAKET VE SAKLI YORDAMLARI (STORED PROCEDURES)
-- ============================================================================

CREATE OR REPLACE PACKAGE PKG_EGA_LGS AS
    PROCEDURE SP_KULLANICI_KAYIT (
        p_kullanici_id      IN VARCHAR2,
        p_ad                IN VARCHAR2,
        p_soyad             IN VARCHAR2,
        p_eposta            IN VARCHAR2,
        p_parola_hash       IN VARCHAR2,
        p_parola_tuz        IN VARCHAR2,
        p_foto_clob         IN CLOB,
        p_hedef_puan        IN NUMBER,
        p_hedef_gunluk      IN NUMBER
    );

    PROCEDURE SP_PROFIL_GUNCELLE (
        p_kullanici_id      IN VARCHAR2,
        p_ad                IN VARCHAR2,
        p_soyad             IN VARCHAR2,
        p_eposta            IN VARCHAR2,
        p_foto_clob         IN CLOB,
        p_hedef_puan        IN NUMBER,
        p_hedef_gunluk      IN NUMBER,
        p_aktif_gun         IN VARCHAR2,
        p_seri_uzunluk      IN NUMBER,
        p_en_uzun_seri      IN NUMBER
    );

    PROCEDURE SP_SORU_SONUC_KAYDET (
        p_kullanici_id      IN VARCHAR2,
        p_soru_id           IN VARCHAR2,
        p_dogru             IN NUMBER,
        p_yanlis            IN NUMBER,
        p_bos               IN NUMBER,
        p_son_cozum_unix    IN NUMBER
    );
END PKG_EGA_LGS;
/

CREATE OR REPLACE PACKAGE BODY PKG_EGA_LGS AS

    PROCEDURE SP_KULLANICI_KAYIT (
        p_kullanici_id      IN VARCHAR2,
        p_ad                IN VARCHAR2,
        p_soyad             IN VARCHAR2,
        p_eposta            IN VARCHAR2,
        p_parola_hash       IN VARCHAR2,
        p_parola_tuz        IN VARCHAR2,
        p_foto_clob         IN CLOB,
        p_hedef_puan        IN NUMBER,
        p_hedef_gunluk      IN NUMBER
    ) IS
    BEGIN
        INSERT INTO EGA_KULLANICILAR (
            KULLANICI_ID, AD, SOYAD, EPOSTA, PAROLA_HASH, PAROLA_TUZ,
            FOTO_CLOB, HEDEF_PUAN, HEDEF_GUNLUK_SORU, KAYIT_TARIHI, SON_GIRIS_TARIHI
        ) VALUES (
            p_kullanici_id, p_ad, p_soyad, LOWER(TRIM(p_eposta)), p_parola_hash, p_parola_tuz,
            p_foto_clob, p_hedef_puan, p_hedef_gunluk, SYSTIMESTAMP, SYSTIMESTAMP
        );
        COMMIT;
    END SP_KULLANICI_KAYIT;

    PROCEDURE SP_PROFIL_GUNCELLE (
        p_kullanici_id      IN VARCHAR2,
        p_ad                IN VARCHAR2,
        p_soyad             IN VARCHAR2,
        p_eposta            IN VARCHAR2,
        p_foto_clob         IN CLOB,
        p_hedef_puan        IN NUMBER,
        p_hedef_gunluk      IN NUMBER,
        p_aktif_gun         IN VARCHAR2,
        p_seri_uzunluk      IN NUMBER,
        p_en_uzun_seri      IN NUMBER
    ) IS
    BEGIN
        UPDATE EGA_KULLANICILAR
        SET AD = p_ad,
            SOYAD = p_soyad,
            EPOSTA = LOWER(TRIM(p_eposta)),
            FOTO_CLOB = p_foto_clob,
            HEDEF_PUAN = p_hedef_puan,
            HEDEF_GUNLUK_SORU = p_hedef_gunluk,
            AKTIF_GUN = p_aktif_gun,
            SERI_UZUNLUK = p_seri_uzunluk,
            EN_UZUN_SERI = p_en_uzun_seri,
            SON_GIRIS_TARIHI = SYSTIMESTAMP
        WHERE KULLANICI_ID = p_kullanici_id;
        COMMIT;
    END SP_PROFIL_GUNCELLE;

    PROCEDURE SP_SORU_SONUC_KAYDET (
        p_kullanici_id      IN VARCHAR2,
        p_soru_id           IN VARCHAR2,
        p_dogru             IN NUMBER,
        p_yanlis            IN NUMBER,
        p_bos               IN NUMBER,
        p_son_cozum_unix    IN NUMBER
    ) IS
    BEGIN
        MERGE INTO EGA_COZULEN_SORULAR t
        USING (SELECT p_kullanici_id AS kid, p_soru_id AS sid FROM DUAL) s
        ON (t.KULLANICI_ID = s.kid AND t.SORU_ID = s.sid)
        WHEN MATCHED THEN
            UPDATE SET
                t.DOGRU_ADET = p_dogru,
                t.YANLIS_ADET = p_yanlis,
                t.BOS_ADET = p_bos,
                t.SON_COZUM_UNIX = p_son_cozum_unix
        WHEN NOT MATCHED THEN
            INSERT (KULLANICI_ID, SORU_ID, DOGRU_ADET, YANLIS_ADET, BOS_ADET, SON_COZUM_UNIX)
            VALUES (p_kullanici_id, p_soru_id, p_dogru, p_yanlis, p_bos, p_son_cozum_unix);
        COMMIT;
    END SP_SORU_SONUC_KAYDET;

END PKG_EGA_LGS;
/
