-- ============================================================================
-- EGA · LGS Hazırlık Platformu — Supabase (PostgreSQL) Veritabanı Şeması
-- ============================================================================

-- 1. Profiller Tablosu (auth.users ile 1-1 ilişkili)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ad TEXT NOT NULL DEFAULT 'Öğrenci',
  soyad TEXT NOT NULL DEFAULT '',
  eposta TEXT UNIQUE NOT NULL,
  foto_url TEXT,
  hedef_puan INTEGER NOT NULL DEFAULT 420 CHECK (hedef_puan BETWEEN 100 AND 500),
  hedef_gunluk_soru INTEGER NOT NULL DEFAULT 30 CHECK (hedef_gunluk_soru BETWEEN 1 AND 500),
  aktif_gun DATE,
  seri_uzunluk INTEGER NOT NULL DEFAULT 0,
  en_uzun_seri INTEGER NOT NULL DEFAULT 0,
  rozetler JSONB NOT NULL DEFAULT '[]'::jsonb,
  gunluk_istatistik JSONB NOT NULL DEFAULT '{}'::jsonb,
  soru_gecmisi JSONB NOT NULL DEFAULT '{}'::jsonb,
  olusturulma_tarihi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  guncellenme_tarihi TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Deneme Sonuçları Tablosu
CREATE TABLE IF NOT EXISTS public.exam_results (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deneme_ad TEXT NOT NULL,
  tur TEXT NOT NULL CHECK (tur IN ('cikmis', 'uretilmis')),
  toplam_soru INTEGER NOT NULL,
  dogru INTEGER NOT NULL,
  yanlis INTEGER NOT NULL,
  bos INTEGER NOT NULL,
  net NUMERIC(6,2) NOT NULL,
  puan NUMERIC(6,2) NOT NULL,
  sure_saniye INTEGER NOT NULL,
  ders_detay JSONB NOT NULL DEFAULT '[]'::jsonb,
  baslangic_param TEXT,
  cozulme_tarihi TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_results_user_id ON public.exam_results(user_id, cozulme_tarihi DESC);

-- 3. Row Level Security (RLS) Politikaları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profillerini oluşturabilir"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi denemelerini görebilir"
  ON public.exam_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi denemelerini ekleyebilir"
  ON public.exam_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Yeni Kayıt Trigger'ı (Supabase Auth -> public.profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, ad, soyad, eposta, foto_url, hedef_puan, hedef_gunluk_soru)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'ad', 'Öğrenci'),
    COALESCE(NEW.raw_user_meta_data->>'soyad', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'foto',
    COALESCE((NEW.raw_user_meta_data->>'hedefPuan')::INTEGER, 420),
    COALESCE((NEW.raw_user_meta_data->>'hedefGunlukSoru')::INTEGER, 30)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
