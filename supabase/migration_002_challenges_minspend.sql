-- Migration 002: Add challenges inside routes + minimum spend
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wzaaivrmmvardagxipiu/sql/new

-- 1. Add new columns to route_bars
ALTER TABLE public.route_bars ADD COLUMN IF NOT EXISTS minimum_spend numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.route_bars ADD COLUMN IF NOT EXISTS challenge_title text;
ALTER TABLE public.route_bars ADD COLUMN IF NOT EXISTS challenge_description text;
ALTER TABLE public.route_bars ADD COLUMN IF NOT EXISTS challenge_emoji text DEFAULT '🎯';
ALTER TABLE public.route_bars ADD COLUMN IF NOT EXISTS challenge_points integer NOT NULL DEFAULT 0;

-- 2. Add receipt_amount to route_bar_visits
ALTER TABLE public.route_bar_visits ADD COLUMN IF NOT EXISTS receipt_amount numeric(10,2);

-- 3. Create route_bar_challenge_completions table
CREATE TABLE IF NOT EXISTS public.route_bar_challenge_completions (
  id                    uuid primary key default extensions.uuid_generate_v4(),
  route_participation_id uuid not null references public.route_participations(id) on delete cascade,
  route_bar_id          uuid not null references public.route_bars(id) on delete cascade,
  completed_at          timestamptz not null default now(),
  proof_url             text,
  unique (route_participation_id, route_bar_id)
);

COMMENT ON TABLE public.route_bar_challenge_completions IS 'Registro de conclusão de desafios em bars da rota';

-- 4. Enable RLS on new table
ALTER TABLE public.route_bar_challenge_completions ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies for challenge completions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'route_bar_challenge_completions' AND policyname = 'route_bar_challenge_completions_select') THEN
    CREATE POLICY route_bar_challenge_completions_select ON public.route_bar_challenge_completions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'route_bar_challenge_completions' AND policyname = 'route_bar_challenge_completions_insert') THEN
    CREATE POLICY route_bar_challenge_completions_insert ON public.route_bar_challenge_completions FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.route_participations rp WHERE rp.id = route_participation_id AND rp.user_id = auth.uid())
    );
  END IF;
END $$;

-- 6. Update handle_new_user to include cpf and phone from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, cpf, phone)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'cpf',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
