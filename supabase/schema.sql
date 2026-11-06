-- ==============================================================================
-- LA BRUJA — Supabase PostgreSQL Database Schema
-- Cosmic Agave Rituals & Astrological Spirits Monograph
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. User Profiles Table (Linked with Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  birth_date DATE,
  birth_time TIME,
  birthplace TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  time_zone TEXT DEFAULT 'America/Mexico_City',
  legal_drinking_age_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  ritual_terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.profiles IS 'Stores client profile, verified birth coordinates, and compliance flags for LA BRUJA users.';

-- ==============================================================================
-- 3. Automatic Profile Creation Trigger on Supabase Auth Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    birth_date,
    birthplace,
    legal_drinking_age_confirmed,
    ritual_terms_accepted
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    (new.raw_user_meta_data->>'birth_date')::DATE,
    new.raw_user_meta_data->>'birthplace',
    COALESCE((new.raw_user_meta_data->>'legal_drinking_age_confirmed')::BOOLEAN, TRUE),
    COALESCE((new.raw_user_meta_data->>'ritual_terms_accepted')::BOOLEAN, TRUE)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute upon auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- 4. Agave Varietals Monograph Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.agaves (
  id TEXT PRIMARY KEY,
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  maturity_years INTEGER NOT NULL,
  terroir_origin TEXT NOT NULL,
  flavor_profile TEXT NOT NULL,
  archetype_title TEXT NOT NULL,
  personality_description TEXT NOT NULL,
  agave_lore TEXT NOT NULL,
  occasion_and_ritual TEXT NOT NULL,
  element TEXT NOT NULL CHECK (element IN ('Water', 'Earth', 'Fire', 'Air')),
  solar_house_affinity TEXT NOT NULL,
  astrological_energy TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.agaves IS 'Curated catalog of artisanal agave varietals and celestial monograph data.';

-- ==============================================================================
-- 5. Verified Partner Palenque Bottles Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.partner_bottles (
  id TEXT PRIMARY KEY,
  agave_id TEXT NOT NULL REFERENCES public.agaves(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  bottle_name TEXT NOT NULL,
  abv TEXT NOT NULL,
  msrp TEXT NOT NULL,
  palenque_location TEXT NOT NULL,
  maestro_mezcalero TEXT NOT NULL,
  distillation_type TEXT NOT NULL,
  harvest_age TEXT NOT NULL,
  verified_notes TEXT NOT NULL,
  image_url TEXT,
  retailer_url TEXT NOT NULL,
  sponsorship_disclosure TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.partner_bottles IS 'Verified artisanal bottles independently matched to celestial archetypes.';

-- ==============================================================================
-- 6. User Daily Readings Archival Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lunar_phase_key TEXT NOT NULL,
  lunar_phase_name TEXT NOT NULL,
  illumination_pct INTEGER NOT NULL CHECK (illumination_pct BETWEEN 0 AND 100),
  solar_house TEXT NOT NULL,
  solar_sign TEXT NOT NULL,
  agave_id TEXT NOT NULL REFERENCES public.agaves(id) ON DELETE RESTRICT,
  engine_signal_note TEXT,
  astrological_tension TEXT,
  botanical_counterpart TEXT,
  ritual_guidance TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_readings_user ON public.user_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_readings_date ON public.user_readings(reading_date);

-- ==============================================================================
-- 7. User Favorite Agaves / Bottles Collection
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agave_id TEXT NOT NULL REFERENCES public.agaves(id) ON DELETE CASCADE,
  bottle_id TEXT REFERENCES public.partner_bottles(id) ON DELETE CASCADE,
  tasting_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, agave_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);

-- ==============================================================================
-- 8. Beta Signups & Twilight Dispatch Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.beta_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  legal_drinking_age_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'dispatched')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_bottles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own record only
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Agaves Catalog: Publicly readable by all users (anonymous and authenticated)
DROP POLICY IF EXISTS "Public can view agaves" ON public.agaves;
CREATE POLICY "Public can view agaves"
  ON public.agaves FOR SELECT
  USING (true);

-- Partner Bottles: Publicly readable by all users
DROP POLICY IF EXISTS "Public can view partner bottles" ON public.partner_bottles;
CREATE POLICY "Public can view partner bottles"
  ON public.partner_bottles FOR SELECT
  USING (true);

-- User Readings: Only accessible by the reading owner
DROP POLICY IF EXISTS "Users can view own readings" ON public.user_readings;
CREATE POLICY "Users can view own readings"
  ON public.user_readings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own readings" ON public.user_readings;
CREATE POLICY "Users can insert own readings"
  ON public.user_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own readings" ON public.user_readings;
CREATE POLICY "Users can delete own readings"
  ON public.user_readings FOR DELETE
  USING (auth.uid() = user_id);

-- User Favorites: Only accessible by the favorite owner
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;
CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Beta Subscribers: Allow anyone (even unauthenticated visitors) to sign up
DROP POLICY IF EXISTS "Anyone can subscribe to beta" ON public.beta_subscribers;
CREATE POLICY "Anyone can subscribe to beta"
  ON public.beta_subscribers FOR INSERT
  WITH CHECK (true);


-- ==============================================================================
-- 10. Seed Initial Agave Catalog & Verified Partner Bottlings
-- ==============================================================================
INSERT INTO public.agaves (
  id, common_name, scientific_name, maturity_years, terroir_origin,
  flavor_profile, archetype_title, personality_description, agave_lore,
  occasion_and_ritual, element, solar_house_affinity, astrological_energy
) VALUES 
(
  'espadin',
  'Espadín Joven',
  'Agave Angustifolia Haw',
  8,
  'San Dionisio Ocotepec, Oaxaca (High-Elevation Sierra)',
  'Bright citrus peel, green herbs, gentle mesquite smoke, minerality, and roasted agave sweetness.',
  'The Catalyst',
  'Sharp, communicative, clarifying, and bold. Pierces nocturnal inertia with focused momentum.',
  'Agave Angustifolia, harvested at 8 years under high-elevation sun in San Dionisio Ocotepec. Conical copper distillation.',
  'Sunset aperitivo, vibrant dinner conversation, grounding toast before twilight yields to dark Scorpio stars.',
  'Water',
  '8th House (Fixed Water • Depth)',
  'A BRIGHT, FORWARD-MOVING NIGHT (Waxing Gibbous in Scorpio • Mercury Triplicity)'
),
(
  'tobala',
  'Tobalá Silvestre',
  'Agave Potatorum',
  12,
  'Sola de Vega, Oaxaca (Oak & Pine High Canopies)',
  'Wild mountain strawberries, crushed rose petals, wet stone, cedar smoke, and delicate sweet botanical honey.',
  'The Mystic',
  'Introspective, intuitive, lyrical, and subtle. Cultivates dreamwork and contemplative evening clarity.',
  'Small wild rosette agave gathered by hand from shade-rich pine and oak canyons at 2,200 meters. Ancestral clay pot distillation with local spring water.',
  'Late-night poetry, intimate fireside reverie, or post-prandial contemplation beneath illuminated skies.',
  'Water',
  '12th House (Mutable Water • Transcendence)',
  'A TRANSCENDENT, ETHEREAL MOOD (Full Moon in Pisces • Neptune Trine)'
),
(
  'tepeztate',
  'Tepeztate Ancestral',
  'Agave Marmorata',
  25,
  'Santa Catarina Minas & Sierra Sur (Limestone Cliffs)',
  'Jalapeño pepper, intense wet gravel minerality, high mountain lavender, fresh green rain, and sharp white spice.',
  'The Ancient Grounder',
  'Stoic, enduring, luminous, and commanding. Carries a quarter-century of solar patience into a single copita.',
  'Grows horizontally on almost vertical limestone cliff faces for 25 to 30 years before blooming. Harvested with mountain ropes.',
  'Celebration of major life milestones, solstices, and solemn covenants requiring unwavering grounded resolve.',
  'Earth',
  '10th House (Cardinal Earth • Longevity & Mastery)',
  'AN UNYIELDING, MONUMENTAL TRANSIT (Saturn Sextile Pluto • Capricorn Stability)'
),
(
  'arroqueno',
  'Arroqueño',
  'Agave Americana var. Oaxacensis',
  20,
  'Miahuatlán de Porfirio Díaz, Oaxaca (Semi-Arid Valleys)',
  'Dark Dutch cocoa, roasted green bell pepper, candied tropical fruit, soft leather, and warm river stone.',
  'The Sovereign',
  'Generous, expansive, warm, and hospitable. Opens hearts and elevates celebratory feasts.',
  'Magnificent colossal agave whose piñas often exceed 400 kilograms after 20 years of sun absorption. Ancestor to modern cultivated species.',
  'Grand feasts, celebratory reunions with cherished friends, and welcoming newcomers into the circle.',
  'Fire',
  '5th House (Fixed Fire • Joy & Vitality)',
  'AN EXPANSIVE, FESTIVE CURRENT (Jupiter Trine Sun • Leo Brilliance)'
),
(
  'madrecuixe',
  'Madrecuixe',
  'Agave Karwinskii',
  15,
  'San Luis del Río, Oaxaca (Cactus & Dry Scrub Foothills)',
  'Wet graphite, freshly turned loam, cut lemongrass, green tobacco leaf, and crisp botanical minerality.',
  'The Architect',
  'Disciplined, structured, sharp, and purposeful. Aligns scattered mental chatter into focused creative output.',
  'Tall tree-like succulent with an elongated trunk resembling a desert palm. Fibrous core demands intense physical roasting and machete chopping.',
  'Late-afternoon brainstorming, artistic composition, or transitioning from daytime labor into contemplative nightcraft.',
  'Air',
  '3rd House (Mutable Air • Intellect & Precision)',
  'A CLEAR-HEADED, ANALYTICAL SKY (Mercury Conjunct Uranus • Gemini Acuity)'
),
(
  'jabali',
  'Jabalí Ancestral',
  'Agave Convallis',
  14,
  'Sierra Sur, Oaxaca (Dry Rocky Escarpments)',
  'Effervescent white grapefruit, wild starfruit, flint sparks, sweet churned butter, and black volcanic pepper.',
  'The Alchemist',
  'Wildly unpredictable, intensely magnetic, and fiercely expressive. Breaks stagnation with electrical momentum.',
  'Named after the wild boar ("jabalí") for its ferocity. High saponin content causes foaming during fermentation that can overflow stills unless tamed by master craft.',
  'Spontaneous late-night revelations, adventurous gatherings, and honoring unexpected transformations.',
  'Fire',
  '1st House (Cardinal Fire • Unvarnished Will)',
  'AN ELECTRIC, UNRESTRAINED FORCE (Aries Rising • Mars Square Uranus)'
),
(
  'sierra_negra',
  'Sierra Negra',
  'Agave Americana var.',
  25,
  'San Baltazar Chichicapam, Oaxaca',
  'Ripe blackberries, black truffle, sweet cigar smoke, dark molasses, and smooth volcanic basalt.',
  'The Philosopher',
  'Profound, meditative, slow-blooming, and deeply resonant. Inspires long, unhurried dialogue.',
  'An endangered wild relative of Espadín that requires 20 to 25 years to mature in secluded shaded ravines. Produces miniscule yields.',
  'Midnight unhurried conversations with lifelong companions, sealing enduring pacts, and quiet listening.',
  'Earth',
  '9th House (Mutable Fire/Earth • Higher Wisdom)',
  'A DEEP, CONTEMPLATIVE CONJUNCTION (Jupiter Sextile Saturn • Sagittarian Horizon)'
)
ON CONFLICT (id) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  scientific_name = EXCLUDED.scientific_name,
  flavor_profile = EXCLUDED.flavor_profile,
  personality_description = EXCLUDED.personality_description,
  agave_lore = EXCLUDED.agave_lore,
  occasion_and_ritual = EXCLUDED.occasion_and_ritual;

-- Partner Bottlings Seed
INSERT INTO public.partner_bottles (
  id, agave_id, brand, bottle_name, abv, msrp, palenque_location,
  maestro_mezcalero, distillation_type, harvest_age, verified_notes,
  retailer_url, sponsorship_disclosure
) VALUES
(
  'rey-campero-espadin',
  'espadin',
  'Rey Campero',
  'Rey Campero Espadín Joven (48% ABV)',
  '48.0%',
  '$58 MSRP',
  'Candelaria Yegolé, Sierra Sur, Oaxaca',
  'Rómulo Sánchez Parada',
  'Double distilled in copper pot stills',
  '8 to 10 years cultivated agave',
  'Calculated via Scorpio solar transit and active lunar phase for balanced terrestrial grounding. $58 MSRP supplied by brand.',
  'https://www.reycampero.com',
  'Sponsored Partner Recommendation • Verified Palenque. Commercial terms agreed via independent brand allocation.'
),
(
  'mezcal-vago-tobala',
  'tobala',
  'Mezcal Vago',
  'Mezcal Vago Tobalá en Barro (49.4% ABV)',
  '49.4%',
  '$135 MSRP',
  'Sola de Vega, Oaxaca',
  'Tío Rey (Salomón Rey Rodriguez)',
  'Ancestral hand-mashed in stone canoes, distilled in olla de barro (clay pots)',
  '12 to 14 years wild harvested',
  'Distilled using pre-Hispanic clay pots which soften acidity and amplify earthy botanical complexity.',
  'https://www.mezcalvago.com',
  'Sponsored Partner Recommendation • Ancestral Clay Verified. Commercial terms agreed independently.'
),
(
  'real-minero-tepeztate',
  'tepeztate',
  'Real Minero',
  'Real Minero Tepeztate Ancestral (51.2% ABV)',
  '51.2%',
  '$190 MSRP',
  'Santa Catarina Minas, Oaxaca',
  'Graciela Ángeles Carreño & Family',
  'Ancestral clay pot with reed condensers, ground by wooden mallet',
  '25 to 30 years wild agave',
  'One of the most revered ancestral distilleries in the Americas, operating continuous family tradition for four generations.',
  'https://www.realminero.com.mx',
  'Sponsored Partner Recommendation • Certified Ancestral Batch. Independent allocation.'
),
(
  'cinco-sentidos-arroqueno',
  'arroqueno',
  'Cinco Sentidos',
  '5 Sentidos Arroqueño de Miahuatlán (47.8% ABV)',
  '47.8%',
  '$120 MSRP',
  'Miahuatlán, Oaxaca',
  'Atenógenes García',
  'Single batch copper refrescadera with ambient wild yeast',
  '18 to 20 years',
  'Selected for its extraordinary balance of floral cocoa warmth and refreshing vegetal green notes.',
  'https://www.actaval.com',
  'Sponsored Partner Recommendation • Verified Single Palenquero Allocation.'
),
(
  'lalocura-madrecuixe',
  'madrecuixe',
  'Lalocura',
  'Lalocura Madrecuixe en Barro (48.6% ABV)',
  '48.6%',
  '$140 MSRP',
  'Santa Catarina Minas, Oaxaca',
  'Eduardo "Lalo" Ángeles',
  'Ancestral clay pot distillation, hand mashed with wooden club',
  '14 to 16 years semi-wild agave',
  'Legendary fifth-generation maestro crafting benchmark minerality and vegetal structure in Minas clay.',
  'https://www.lalocura.mx',
  'Sponsored Partner Recommendation • Certified Artisanal/Ancestral.'
),
(
  'rey-campero-jabali',
  'jabali',
  'Rey Campero',
  'Rey Campero Jabalí (48.8% ABV)',
  '48.8%',
  '$115 MSRP',
  'Candelaria Yegolé, Oaxaca',
  'Rómulo Sánchez Parada',
  'Triple distilled in copper pot stills',
  '12 to 15 years wild',
  'One of the rarest and most difficult agaves to distill in all of Mexico, producing singular aromatic intensity.',
  'https://www.reycampero.com',
  'Sponsored Partner Recommendation • Wild Harvest Allocation.'
),
(
  'real-minero-sierra-negra',
  'sierra_negra',
  'Real Minero',
  'Real Minero Sierra Negra Ancestral (50.8% ABV)',
  '50.8%',
  '$198 MSRP',
  'Santa Catarina Minas, Oaxaca',
  'Graciela Ángeles Carreño',
  'Ancestral clay pot, hand pounded with wooden mallets',
  '22 to 25 years wild agave',
  'Extremely scarce heirloom agave protected through family-led reforestation initiatives.',
  'https://www.realminero.com.mx',
  'Sponsored Partner Recommendation • Rare Cultivar Guarantee.'
)
ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  bottle_name = EXCLUDED.bottle_name,
  msrp = EXCLUDED.msrp,
  verified_notes = EXCLUDED.verified_notes,
  retailer_url = EXCLUDED.retailer_url;
