-- Migration 005: Seed de conquistas + RLS policies
-- Executar no Supabase SQL Editor

-- ═══════════════════════════════════════════════════
-- 1. SEED: Conquistas iniciais
-- ═══════════════════════════════════════════════════

INSERT INTO public.achievements (title, description, emoji, condition_type, condition_value)
VALUES
  ('Primeiro Bar', 'Visitou seu primeiro bar', '🎉', 'bars_visited', 1),
  ('Nota Aprovada', 'Primeira nota fiscal aprovada', '✅', 'receipts_approved', 1),
  ('5 Bares', 'Visitou 5 bares diferentes', '⭐', 'bars_visited', 5),
  ('Top 10', 'Entrou no Top 10 do ranking', '🏆', 'ranking_top', 10),
  ('Rota Completa', 'Completou uma rota inteira', '🗺️', 'routes_completed', 1),
  ('Raiz de Verdade', 'Acumulou 5000 pontos', '👑', 'points_total', 5000)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 2. RLS: achievements (leitura pública, escrita admin)
-- ═══════════════════════════════════════════════════

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ver conquistas
CREATE POLICY "achievements_select_all"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

-- Apenas admins podem criar/editar/deletar conquistas
CREATE POLICY "achievements_insert_admin"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "achievements_update_admin"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "achievements_delete_admin"
  ON public.achievements FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════
-- 3. RLS: user_achievements (leitura própria, escrita admin)
-- ═══════════════════════════════════════════════════

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Usuário vê apenas suas próprias conquistas
CREATE POLICY "user_achievements_select_own"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin pode ver todas
CREATE POLICY "user_achievements_select_admin"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin pode atribuir conquistas
CREATE POLICY "user_achievements_insert_admin"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin pode revogar conquistas
CREATE POLICY "user_achievements_delete_admin"
  ON public.user_achievements FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════════
