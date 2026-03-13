-- Migration 004: Pontos somente via rotas e desafios
-- Check-ins e notas fiscais servem APENAS como comprovação de visita
-- Executar no Supabase SQL Editor

-- ═══════════════════════════════════════════════════
-- 1. CHECKINS: Remover coluna points (não dá mais pontos)
-- ═══════════════════════════════════════════════════

ALTER TABLE checkins DROP COLUMN IF EXISTS points;

-- ═══════════════════════════════════════════════════
-- 2. POINTS_HISTORY: Atualizar source possíveis
-- ═══════════════════════════════════════════════════

-- Agora source será: 'route_bar', 'challenge', 'route_bonus', 'manual'
-- Adicionar coluna route_id e description para melhor rastreio
ALTER TABLE points_history ADD COLUMN IF NOT EXISTS route_id uuid REFERENCES public.routes(id) ON DELETE SET NULL;
ALTER TABLE points_history ADD COLUMN IF NOT EXISTS description text;

-- ═══════════════════════════════════════════════════
-- 3. TRIGGER: Check-in aprovado NÃO dá mais pontos
-- ═══════════════════════════════════════════════════

-- Recriar trigger de checkin: apenas registra visita na rota, sem dar pontos
CREATE OR REPLACE FUNCTION public.on_checkin_approved()
RETURNS trigger AS $$
BEGIN
  IF new.status = 'approved' AND old.status != 'approved' THEN
    -- NÃO insere pontos no histórico (pontos vêm só de rotas)
    -- Apenas notifica o usuário
    INSERT INTO public.notifications (user_id, type, title, body, href)
    VALUES (
      new.user_id,
      'checkin_approved',
      'Check-in aprovado! 📸',
      'Seu check-in foi aprovado e validado como comprovação de visita.',
      '/app/checkin'
    );
  END IF;

  -- Notificação de rejeição (mantém igual)
  IF new.status = 'rejected' AND old.status != 'rejected' THEN
    INSERT INTO public.notifications (user_id, type, title, body, href)
    VALUES (
      new.user_id,
      'checkin_rejected',
      'Check-in não aprovado 😕',
      COALESCE('Motivo: ' || new.rejection_reason, 'O admin não aprovou seu check-in.'),
      '/app/checkin'
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════
-- 4. TRIGGER: Receipt aprovado NÃO dá mais pontos
--    Apenas incrementa receipts_approved e notifica
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.on_receipt_approved()
RETURNS trigger AS $$
BEGIN
  IF new.status IN ('approved', 'approved_auto') AND old.status NOT IN ('approved', 'approved_auto') THEN
    -- NÃO insere pontos no histórico (pontos vêm só de rotas)
    -- Apenas incrementa contador de notas aprovadas
    UPDATE public.profiles
    SET receipts_approved = receipts_approved + 1
    WHERE id = new.user_id;

    -- Notifica o usuário
    INSERT INTO public.notifications (user_id, type, title, body, href)
    VALUES (
      new.user_id,
      'receipt_approved',
      'Nota fiscal aprovada! 🎉',
      FORMAT('Sua nota no valor de R$ %s foi aprovada como comprovação de visita.', new.amount),
      '/app/points'
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════
-- 5. NOVA FUNÇÃO: Registrar pontos de visita em rota
--    Chamada quando bar_visit é registrado em rota ativa
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.register_route_bar_points(
  p_user_id uuid,
  p_bar_id uuid,
  p_route_id uuid,
  p_points integer,
  p_description text DEFAULT 'Visita ao bar na rota'
)
RETURNS void AS $$
BEGIN
  -- Inserir pontos no histórico
  INSERT INTO public.points_history (user_id, bar_id, route_id, points, source, description, status, date)
  VALUES (p_user_id, p_bar_id, p_route_id, p_points, 'route_bar', p_description, 'approved', now());

  -- Atualizar totais
  UPDATE public.profiles
  SET points_total = points_total + p_points
  WHERE id = p_user_id;

  PERFORM public.recalculate_user_monthly_points(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════
-- 6. NOVA FUNÇÃO: Registrar pontos de desafio
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.register_challenge_points(
  p_user_id uuid,
  p_bar_id uuid,
  p_route_id uuid,
  p_points integer,
  p_description text DEFAULT 'Desafio completado'
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.points_history (user_id, bar_id, route_id, points, source, description, status, date)
  VALUES (p_user_id, p_bar_id, p_route_id, p_points, 'challenge', p_description, 'approved', now());

  UPDATE public.profiles
  SET points_total = points_total + p_points
  WHERE id = p_user_id;

  PERFORM public.recalculate_user_monthly_points(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════
-- 7. NOVA FUNÇÃO: Registrar bônus de conclusão de rota
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.register_route_bonus_points(
  p_user_id uuid,
  p_route_id uuid,
  p_points integer,
  p_description text DEFAULT 'Bônus: rota completa!'
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.points_history (user_id, route_id, points, source, description, status, date)
  VALUES (p_user_id, p_route_id, p_points, 'route_bonus', p_description, 'approved', now());

  UPDATE public.profiles
  SET points_total = points_total + p_points
  WHERE id = p_user_id;

  PERFORM public.recalculate_user_monthly_points(p_user_id);

  -- Notificação de rota completa
  INSERT INTO public.notifications (user_id, type, title, body, href)
  VALUES (
    p_user_id,
    'route_completed',
    'Rota completa! 🏆',
    FORMAT('Você ganhou +%s pontos bônus por completar a rota!', p_points),
    '/app/routes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════════
