-- ============================================================================
-- EGA · LGS Hazırlık Platformu — Oracle Autonomous Database (19c / 23ai) Şeması
-- ============================================================================

-- 1. Kullanıcılar ve Profiller Tablosu
CREATE TABLE EGA_PROFILLER (
    KULLANICI_ID        VARCHAR2(64)    PRIMARY KEY,
    AD                  VARCHAR2(100)   DEFAULT 'Öğrenci' NOT NULL,
    SOYAD               VARCHAR2(100)   DEFAULT '',
    EPOSTA              VARCHAR2(255)   UNIQUE NOT NULL,
    PAROLA_HASH         VARCHAR2(128),
    PAROLA_TUZ          VARCHAR2(64),
    FOTO_CLOB           CLOB,
    HEDEF_PUAN          NUMBER(3)       DEFAULT 420 CHECK (HEDEF_PUAN BETWEEN 100 AND 500),
    HEDEF_GUNLUK_SORU   NUMBER(4)       DEFAULT 30 CHECK (HEDEF_GUNLUK_SORU BETWEEN 1 AND 500),
    AKTIF_GUN           VARCHAR2(10),
    SERI_UZUNLUK        NUMBER(5)       DEFAULT 0,
    EN_UZUN_SERI        NUMBER(5)       DEFAULT 0,
    ROZETLER_JSON       CLOB             CHECK (ROZETLER_JSON IS JSON),
    GUNLUK_JSON         CLOB             CHECK (GUNLUK_JSON IS JSON),
    SORULAR_JSON        CLOB             CHECK (SORULAR_JSON IS JSON),
    OLUSTURULMA_TARIHI  TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    GUNCELLENME_TARIHI  TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX IDX_EGA_PROFILLER_EPOSTA ON EGA_PROFILLER(LOWER(EPOSTA));

-- 2. Deneme Sonuçları Tablosu
CREATE TABLE EGA_DENEME_SONUCLARI (
    DENEME_SONUC_ID     VARCHAR2(80)    PRIMARY KEY,
    KULLANICI_ID        VARCHAR2(64)    NOT NULL,
    DENEME_AD           VARCHAR2(200)   NOT NULL,
    DENEME_TUR          VARCHAR2(20)    DEFAULT 'cikmis' NOT NULL,
    TOPLAM_SORU         NUMBER(4)       NOT NULL,
    DOGRU_SAYISI        NUMBER(4)       NOT NULL,
    YANLIS_SAYISI       NUMBER(4)       NOT NULL,
    BOS_SAYISI          NUMBER(4)       NOT NULL,
    NET_SAYISI          NUMBER(6,2)     NOT NULL,
    LGS_PUANI           NUMBER(6,2)     NOT NULL,
    SURE_SANIYE         NUMBER(8)       NOT NULL,
    DERSLER_JSON        CLOB            CHECK (DERSLER_JSON IS JSON),
    BASLANGIC_PARAM     VARCHAR2(500),
    COZULME_TARIHI      TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT FK_EGA_DENEME_KULLANICI FOREIGN KEY (KULLANICI_ID)
        REFERENCES EGA_PROFILLER(KULLANICI_ID) ON DELETE CASCADE
);

CREATE INDEX IDX_EGA_DENEME_KULLANICI ON EGA_DENEME_SONUCLARI(KULLANICI_ID, COZULME_TARIHI DESC);

-- 3. Çözülen Sorular Analitik Tablosu
CREATE TABLE EGA_COZULEN_SORULAR (
    KULLANICI_ID        VARCHAR2(64)    NOT NULL,
    SORU_ID             VARCHAR2(120)   NOT NULL,
    DOGRU_ADET          NUMBER(5)       DEFAULT 0 NOT NULL,
    YANLIS_ADET         NUMBER(5)       DEFAULT 0 NOT NULL,
    BOS_ADET            NUMBER(5)       DEFAULT 0 NOT NULL,
    SON_COZUM_ZAMANI    NUMBER(15)      NOT NULL,
    CONSTRAINT PK_EGA_COZULEN PRIMARY KEY (KULLANICI_ID, SORU_ID),
    CONSTRAINT FK_EGA_COZULEN_KULLANICI FOREIGN KEY (KULLANICI_ID)
        REFERENCES EGA_PROFILLER(KULLANICI_ID) ON DELETE CASCADE
);

-- 4. Profil Senkronizasyon (MERGE / UPSERT) Prosedürü
CREATE OR REPLACE PROCEDURE EGA_PROFIL_SENKRONIZE_ET (
    p_kullanici_id      IN VARCHAR2,
    p_ad                IN VARCHAR2,
    p_soyad             IN VARCHAR2,
    p_eposta            IN VARCHAR2,
    p_foto_clob         IN CLOB,
    p_hedef_puan        IN NUMBER,
    p_hedef_gunluk      IN NUMBER,
    p_aktif_gun         IN VARCHAR2,
    p_seri_uzunluk      IN NUMBER,
    p_en_uzun_seri      IN NUMBER,
    p_rozetler_json     IN CLOB,
    p_gunluk_json       IN CLOB,
    p_sorular_json      IN CLOB
) AS
BEGIN
    MERGE INTO EGA_PROFILLER t
    USING (SELECT p_kullanici_id AS id FROM DUAL) s
    ON (t.KULLANICI_ID = s.id)
    WHEN MATCHED THEN
        UPDATE SET
            t.AD = p_ad,
            t.SOYAD = p_soyad,
            t.EPOSTA = p_eposta,
            t.FOTO_CLOB = p_foto_clob,
            t.HEDEF_PUAN = p_hedef_puan,
            t.HEDEF_GUNLUK_SORU = p_hedef_gunluk,
            t.AKTIF_GUN = p_aktif_gun,
            t.SERI_UZUNLUK = p_seri_uzunluk,
            t.EN_UZUN_SERI = p_en_uzun_seri,
            t.ROZETLER_JSON = p_rozetler_json,
            t.GUNLUK_JSON = p_gunluk_json,
            t.SORULAR_JSON = p_sorular_json,
            t.GUNCELLENME_TARIHI = SYSTIMESTAMP
    WHEN NOT MATCHED THEN
        INSERT (
            KULLANICI_ID, AD, SOYAD, EPOSTA, FOTO_CLOB,
            HEDEF_PUAN, HEDEF_GUNLUK_SORU, AKTIF_GUN,
            SERI_UZUNLUK, EN_UZUN_SERI, ROZETLER_JSON,
            GUNLUK_JSON, SORULAR_JSON
        ) VALUES (
            p_kullanici_id, p_ad, p_soyad, p_eposta, p_foto_clob,
            p_hedef_puan, p_hedef_gunluk, p_aktif_gun,
            p_seri_uzunluk, p_en_uzun_seri, p_rozetler_json,
            p_gunluk_json, p_sorular_json
        );
    COMMIT;
END;
/
