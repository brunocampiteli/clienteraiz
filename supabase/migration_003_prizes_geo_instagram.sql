-- Migration 003: Premios Top N + Geolocalizacao + Instagram
-- Executar no Supabase SQL Editor

-- ═══════════════════════════════════════════════════
-- 1. PRIZES: Expandir para Top N configuravel
-- ═══════════════════════════════════════════════════

-- Remover constraint antiga (top_rank entre 1-10)
ALTER TABLE prizes DROP CONSTRAINT IF EXISTS prizes_top_rank_check;

-- Adicionar constraint mais flexivel (1-50)
ALTER TABLE prizes ADD CONSTRAINT prizes_top_rank_check CHECK (top_rank BETWEEN 1 AND 50);

-- Adicionar campos de descricao e emoji
ALTER TABLE prizes ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE prizes ADD COLUMN IF NOT EXISTS emoji text DEFAULT '🏆';

-- ═══════════════════════════════════════════════════
-- 2. BARS: Instagram e coordenadas GPS
-- ═══════════════════════════════════════════════════

ALTER TABLE bars ADD COLUMN IF NOT EXISTS instagram_handle text;
ALTER TABLE bars ADD COLUMN IF NOT EXISTS latitude numeric(10, 7);
ALTER TABLE bars ADD COLUMN IF NOT EXISTS longitude numeric(10, 7);

-- ═══════════════════════════════════════════════════
-- 3. CHECKINS: Dados de geolocalizacao do usuario
-- ═══════════════════════════════════════════════════

ALTER TABLE checkins ADD COLUMN IF NOT EXISTS user_latitude numeric(10, 7);
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS user_longitude numeric(10, 7);
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS gps_match_status text CHECK (gps_match_status IN ('match', 'no_match', 'unavailable'));
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS distance_meters numeric(10, 2);

-- ═══════════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════════
