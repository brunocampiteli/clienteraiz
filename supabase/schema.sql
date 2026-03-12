-- ============================================================
-- Cliente Raiz — Schema completo Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ╔══════════════════════════════════════════════╗
-- ║  1. EXTENSÕES                                ║
-- ╚══════════════════════════════════════════════╝

create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "moddatetime" with schema extensions;

-- ╔══════════════════════════════════════════════╗
-- ║  2. ENUMS                                    ║
-- ╚══════════════════════════════════════════════╝

create type public.user_status as enum ('active', 'blocked');

create type public.user_role as enum ('user', 'admin');

create type public.receipt_status as enum (
  'pending',
  'pending_validation',
  'approved',
  'approved_auto',
  'rejected',
  'rejected_auto',
  'needs_review'
);

create type public.receipt_rejection_reason as enum (
  'DUPLICATE_ACCESS_KEY',
  'CNPJ_MISMATCH',
  'INVALID_OR_CANCELED',
  'PROVIDER_UNAVAILABLE',
  'UNREADABLE_QR'
);

create type public.checkin_status as enum ('pending', 'approved', 'rejected');

create type public.route_difficulty as enum ('fácil', 'médio', 'difícil');

create type public.route_participation_status as enum ('active', 'completed', 'abandoned');

create type public.notification_type as enum (
  'receipt_approved',
  'new_nearby_bar',
  'new_challenge',
  'push_notification',
  'checkin_approved',
  'checkin_rejected',
  'route_completed',
  'achievement_unlocked',
  'mission_completed'
);

-- ╔══════════════════════════════════════════════╗
-- ║  3. TABELAS                                  ║
-- ╚══════════════════════════════════════════════╝

-- ────────────────────────────────────────────────
-- 3.1  profiles (substitui auth.users metadata)
-- ────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text not null,
  email        text not null,
  cpf          text unique,
  phone        text,
  city         text,
  state        text,
  avatar_url   text,
  avatar_color text default '#2D6A4F',
  role         public.user_role not null default 'user',
  status       public.user_status not null default 'active',
  -- Gamification
  points_total       integer not null default 0,
  points_this_month  integer not null default 0,
  level              text not null default 'Raiz Bronze',
  level_progress     smallint not null default 0 check (level_progress between 0 and 100),
  next_level         text default 'Raiz Prata',
  next_level_points  integer not null default 2000,
  bars_visited       integer not null default 0,
  receipts_approved  integer not null default 0,
  -- Timestamps
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de cada usuário (tanto user quanto admin)';

-- ────────────────────────────────────────────────
-- 3.2  bars
-- ────────────────────────────────────────────────
create table public.bars (
  id               uuid primary key default extensions.uuid_generate_v4(),
  name             text not null,
  legal_name       text,
  cnpj             text unique,
  city             text not null,
  state            text not null default 'SP',
  neighborhood     text,
  address          text,
  cep              text,
  image_url        text,
  minimum_spend    numeric(10, 2) not null default 0,
  opening_hours    text,
  rules            text,
  rating           numeric(2, 1) default 0 check (rating between 0 and 5),
  category         text,
  active           boolean not null default true,
  -- Timestamps
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.bars is 'Bares parceiros cadastrados';

-- ────────────────────────────────────────────────
-- 3.3  bar_prizes (prêmios disponíveis em cada bar)
-- ────────────────────────────────────────────────
create table public.bar_prizes (
  id       uuid primary key default extensions.uuid_generate_v4(),
  bar_id   uuid not null references public.bars(id) on delete cascade,
  name     text not null,
  points   integer not null default 0,
  active   boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.bar_prizes is 'Prêmios resgatáveis em cada bar (pontos → item)';

-- ────────────────────────────────────────────────
-- 3.4  receipts (notas fiscais)
-- ────────────────────────────────────────────────
create table public.receipts (
  id            uuid primary key default extensions.uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  bar_id        uuid not null references public.bars(id) on delete cascade,
  amount        numeric(10, 2) not null default 0,
  points        integer not null default 0,
  status        public.receipt_status not null default 'pending',
  rejection_reason public.receipt_rejection_reason,
  access_key    text,
  bar_cnpj      text,
  issuer_cnpj   text,
  image_url     text,
  reviewed_by   uuid references public.profiles(id),
  reviewed_at   timestamptz,
  -- Timestamps
  date          timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.receipts is 'Notas fiscais enviadas pelos usuários';
create index idx_receipts_user on public.receipts(user_id);
create index idx_receipts_bar on public.receipts(bar_id);
create index idx_receipts_status on public.receipts(status);
create unique index idx_receipts_access_key on public.receipts(access_key) where access_key is not null;

-- ────────────────────────────────────────────────
-- 3.5  checkins (check-ins via Instagram)
-- ────────────────────────────────────────────────
create table public.checkins (
  id                uuid primary key default extensions.uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  bar_id            uuid not null references public.bars(id) on delete cascade,
  image_url         text not null,
  instagram_handle  text,
  status            public.checkin_status not null default 'pending',
  points            integer not null default 30,
  rejection_reason  text,
  reviewed_by       uuid references public.profiles(id),
  reviewed_at       timestamptz,
  -- Timestamps
  date              timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.checkins is 'Check-ins via upload de print do Instagram';
create index idx_checkins_user on public.checkins(user_id);
create index idx_checkins_bar on public.checkins(bar_id);
create index idx_checkins_status on public.checkins(status);

-- ────────────────────────────────────────────────
-- 3.6  challenges (desafios semanais)
-- ────────────────────────────────────────────────
create table public.challenges (
  id                 uuid primary key default extensions.uuid_generate_v4(),
  title              text not null,
  description        text,
  week               text not null,             -- formato: '2026-W04'
  applies_to_all_bars boolean not null default true,
  reward_name        text,
  ranking_points     integer not null default 0,
  active             boolean not null default true,
  -- Timestamps
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.challenges is 'Desafios semanais com recompensas';

-- ────────────────────────────────────────────────
-- 3.7  challenge_bars (M:N — quais bares participam do desafio)
-- ────────────────────────────────────────────────
create table public.challenge_bars (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  bar_id       uuid not null references public.bars(id) on delete cascade,
  primary key (challenge_id, bar_id)
);

-- ────────────────────────────────────────────────
-- 3.8  challenge_participations (progresso do user no desafio)
-- ────────────────────────────────────────────────
create table public.challenge_participations (
  id            uuid primary key default extensions.uuid_generate_v4(),
  challenge_id  uuid not null references public.challenges(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  completed     boolean not null default false,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  unique (challenge_id, user_id)
);

-- ────────────────────────────────────────────────
-- 3.9  routes (rotas gamificadas)
-- ────────────────────────────────────────────────
create table public.routes (
  id                 uuid primary key default extensions.uuid_generate_v4(),
  name               text not null,
  description        text,
  emoji              text default '🍺',
  difficulty         public.route_difficulty not null default 'fácil',
  duration_days      integer not null default 7,
  start_date         date,
  deadline           date,
  prize              text,
  prize_emoji        text default '🏆',
  bonus_points       integer not null default 0,
  active             boolean not null default true,
  -- Counters (desnormalizados para performance)
  participants_count integer not null default 0,
  completed_count    integer not null default 0,
  -- Timestamps
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.routes is 'Rotas de bares gamificadas';

-- ────────────────────────────────────────────────
-- 3.10  route_bars (bares de cada rota, com ordem)
-- ────────────────────────────────────────────────
create table public.route_bars (
  id         uuid primary key default extensions.uuid_generate_v4(),
  route_id   uuid not null references public.routes(id) on delete cascade,
  bar_id     uuid not null references public.bars(id) on delete cascade,
  position   smallint not null default 0,
  points     integer not null default 0,
  minimum_spend  numeric(10,2) not null default 0, -- consumo mínimo em R$
  -- Desafio opcional neste bar (dentro da rota)
  challenge_title       text,
  challenge_description text,
  challenge_emoji       text default '🎯',
  challenge_points      integer not null default 0
);

comment on table public.route_bars is 'Bares de cada rota, com posição, pontos, consumo mínimo e desafio opcional';
create index idx_route_bars_route on public.route_bars(route_id);

-- ────────────────────────────────────────────────
-- 3.11  route_participations (progresso do user na rota)
-- ────────────────────────────────────────────────
create table public.route_participations (
  id           uuid primary key default extensions.uuid_generate_v4(),
  route_id     uuid not null references public.routes(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  status       public.route_participation_status not null default 'active',
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  unique (route_id, user_id)
);

create index idx_route_participations_user on public.route_participations(user_id);

-- ────────────────────────────────────────────────
-- 3.12  route_bar_visits (quais bares da rota o user visitou)
-- ────────────────────────────────────────────────
create table public.route_bar_visits (
  id                    uuid primary key default extensions.uuid_generate_v4(),
  route_participation_id uuid not null references public.route_participations(id) on delete cascade,
  route_bar_id          uuid not null references public.route_bars(id) on delete cascade,
  visited_at            timestamptz not null default now(),
  receipt_amount        numeric(10,2), -- valor da nota fiscal (para validar consumo mínimo)
  unique (route_participation_id, route_bar_id)
);

-- ────────────────────────────────────────────────
-- 3.12b  route_bar_challenge_completions (conclusão de desafios de bar)
-- ────────────────────────────────────────────────
create table public.route_bar_challenge_completions (
  id                    uuid primary key default extensions.uuid_generate_v4(),
  route_participation_id uuid not null references public.route_participations(id) on delete cascade,
  route_bar_id          uuid not null references public.route_bars(id) on delete cascade,
  completed_at          timestamptz not null default now(),
  proof_url             text, -- foto ou evidência do desafio
  unique (route_participation_id, route_bar_id)
);

comment on table public.route_bar_challenge_completions is 'Registro de conclusão de desafios em bars da rota';

-- ────────────────────────────────────────────────
-- 3.13  prizes (prêmios mensais do ranking)
-- ────────────────────────────────────────────────
create table public.prizes (
  id         uuid primary key default extensions.uuid_generate_v4(),
  name       text not null,
  period     text not null,    -- formato: '2026-01'
  top_rank   smallint check (top_rank between 1 and 10),
  image_url  text,
  created_at timestamptz not null default now()
);

comment on table public.prizes is 'Prêmios mensais para os melhores do ranking';
create index idx_prizes_period on public.prizes(period);

-- ────────────────────────────────────────────────
-- 3.14  prize_redemptions (resgates de prêmios)
-- ────────────────────────────────────────────────
create table public.prize_redemptions (
  id         uuid primary key default extensions.uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  prize_id   uuid references public.prizes(id) on delete set null,
  bar_prize_id uuid references public.bar_prizes(id) on delete set null,
  points_spent integer not null default 0,
  redeemed_at timestamptz not null default now(),
  check (prize_id is not null or bar_prize_id is not null)
);

comment on table public.prize_redemptions is 'Histórico de resgates de prêmios';

-- ────────────────────────────────────────────────
-- 3.15  missions (missões / caça ao tesouro)
-- ────────────────────────────────────────────────
create table public.missions (
  id          uuid primary key default extensions.uuid_generate_v4(),
  title       text not null,
  description text,
  emoji       text default '🎯',
  total       integer not null default 1,
  reward      text,
  reward_points integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.missions is 'Missões de engajamento (caça ao tesouro)';

-- ────────────────────────────────────────────────
-- 3.16  user_missions (progresso do user nas missões)
-- ────────────────────────────────────────────────
create table public.user_missions (
  id           uuid primary key default extensions.uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  mission_id   uuid not null references public.missions(id) on delete cascade,
  progress     integer not null default 0,
  completed    boolean not null default false,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, mission_id)
);

-- ────────────────────────────────────────────────
-- 3.17  achievements (conquistas / badges)
-- ────────────────────────────────────────────────
create table public.achievements (
  id          uuid primary key default extensions.uuid_generate_v4(),
  title       text not null,
  description text,
  emoji       text default '🏆',
  -- Condições automáticas (opcional — para desbloqueio via trigger)
  condition_type  text,   -- ex: 'bars_visited', 'points_total', 'receipts_approved'
  condition_value integer, -- ex: 5, 5000, 10
  created_at  timestamptz not null default now()
);

comment on table public.achievements is 'Badges / conquistas desbloqueáveis';

-- ────────────────────────────────────────────────
-- 3.18  user_achievements (conquistas desbloqueadas)
-- ────────────────────────────────────────────────
create table public.user_achievements (
  id             uuid primary key default extensions.uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at    timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- ────────────────────────────────────────────────
-- 3.19  points_history (extrato de pontos)
-- ────────────────────────────────────────────────
create table public.points_history (
  id         uuid primary key default extensions.uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  bar_id     uuid references public.bars(id) on delete set null,
  points     integer not null,
  source     text not null default 'receipt',  -- 'receipt', 'checkin', 'route_bonus', 'challenge', 'mission', 'manual'
  source_id  uuid,                              -- id do receipt, checkin, etc
  status     text not null default 'approved', -- 'pending', 'approved', 'rejected'
  date       timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.points_history is 'Histórico / extrato de pontos do usuário';
create index idx_points_history_user on public.points_history(user_id);
create index idx_points_history_date on public.points_history(date desc);

-- ────────────────────────────────────────────────
-- 3.20  notifications (notificações in-app)
-- ────────────────────────────────────────────────
create table public.notifications (
  id         uuid primary key default extensions.uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       public.notification_type not null,
  title      text not null,
  body       text,
  href       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'Notificações in-app para cada usuário';
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id) where read_at is null;

-- ────────────────────────────────────────────────
-- 3.21  push_subscriptions (Web Push)
-- ────────────────────────────────────────────────
create table public.push_subscriptions (
  id         uuid primary key default extensions.uuid_generate_v4(),
  user_id    uuid references public.profiles(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

comment on table public.push_subscriptions is 'Subscriptions Web Push (VAPID)';
create index idx_push_subs_user on public.push_subscriptions(user_id);

-- ────────────────────────────────────────────────
-- 3.22  ranking_snapshots (foto mensal do ranking)
-- ────────────────────────────────────────────────
create table public.ranking_snapshots (
  id         uuid primary key default extensions.uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  period     text not null,    -- '2026-01'
  position   integer not null,
  points     integer not null default 0,
  bars_visited integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, period)
);

comment on table public.ranking_snapshots is 'Snapshot mensal do ranking para histórico';
create index idx_ranking_period on public.ranking_snapshots(period, position);

-- ╔══════════════════════════════════════════════╗
-- ║  4. TRIGGERS — updated_at automático         ║
-- ╚══════════════════════════════════════════════╝

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function extensions.moddatetime(updated_at);

create trigger handle_bars_updated_at
  before update on public.bars
  for each row execute function extensions.moddatetime(updated_at);

create trigger handle_receipts_updated_at
  before update on public.receipts
  for each row execute function extensions.moddatetime(updated_at);

create trigger handle_checkins_updated_at
  before update on public.checkins
  for each row execute function extensions.moddatetime(updated_at);

create trigger handle_challenges_updated_at
  before update on public.challenges
  for each row execute function extensions.moddatetime(updated_at);

create trigger handle_routes_updated_at
  before update on public.routes
  for each row execute function extensions.moddatetime(updated_at);

create trigger handle_user_missions_updated_at
  before update on public.user_missions
  for each row execute function extensions.moddatetime(updated_at);

-- ╔══════════════════════════════════════════════╗
-- ║  5. FUNCTIONS — Helpers                       ║
-- ╚══════════════════════════════════════════════╝

-- Função para criar perfil automaticamente ao cadastrar no Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, cpf, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'cpf',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Função para calcular pontos de receipt com base no valor
create or replace function public.calculate_receipt_points(
  p_amount numeric,
  p_minimum_spend numeric
)
returns integer as $$
begin
  if p_amount < p_minimum_spend then
    return 0;
  end if;
  -- 1 ponto a cada R$1 gasto acima do mínimo + bônus base
  return greatest(0, floor(p_amount)::integer);
end;
$$ language plpgsql immutable;

-- Função para recalcular pontos do mês do usuário
create or replace function public.recalculate_user_monthly_points(p_user_id uuid)
returns void as $$
declare
  v_month_start timestamptz;
  v_points integer;
begin
  v_month_start := date_trunc('month', now());

  select coalesce(sum(points), 0) into v_points
  from public.points_history
  where user_id = p_user_id
    and status = 'approved'
    and date >= v_month_start;

  update public.profiles
  set points_this_month = v_points
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- Função para atualizar contadores ao aprovar receipt
create or replace function public.on_receipt_approved()
returns trigger as $$
begin
  if new.status in ('approved', 'approved_auto') and old.status not in ('approved', 'approved_auto') then
    -- Registrar pontos no histórico
    insert into public.points_history (user_id, bar_id, points, source, source_id, status, date)
    values (new.user_id, new.bar_id, new.points, 'receipt', new.id, 'approved', new.date);

    -- Atualizar totais do usuário
    update public.profiles
    set points_total = points_total + new.points,
        receipts_approved = receipts_approved + 1
    where id = new.user_id;

    -- Recalcular pontos do mês
    perform public.recalculate_user_monthly_points(new.user_id);

    -- Criar notificação
    insert into public.notifications (user_id, type, title, body, href)
    values (
      new.user_id,
      'receipt_approved',
      'Nota fiscal aprovada! 🎉',
      format('Você ganhou +%s pontos pela nota no valor de R$ %s.', new.points, new.amount),
      '/app/points'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trigger_receipt_approved
  after update on public.receipts
  for each row execute function public.on_receipt_approved();

-- Função para atualizar contadores ao aprovar checkin
create or replace function public.on_checkin_approved()
returns trigger as $$
begin
  if new.status = 'approved' and old.status != 'approved' then
    -- Registrar pontos no histórico
    insert into public.points_history (user_id, bar_id, points, source, source_id, status, date)
    values (new.user_id, new.bar_id, new.points, 'checkin', new.id, 'approved', new.date);

    -- Atualizar totais do usuário
    update public.profiles
    set points_total = points_total + new.points
    where id = new.user_id;

    -- Recalcular pontos do mês
    perform public.recalculate_user_monthly_points(new.user_id);

    -- Criar notificação
    insert into public.notifications (user_id, type, title, body, href)
    values (
      new.user_id,
      'checkin_approved',
      'Check-in aprovado! 📸',
      format('Você ganhou +%s pontos bônus pelo check-in.', new.points),
      '/app/checkin'
    );
  end if;

  -- Notificação de rejeição
  if new.status = 'rejected' and old.status != 'rejected' then
    insert into public.notifications (user_id, type, title, body, href)
    values (
      new.user_id,
      'checkin_rejected',
      'Check-in não aprovado',
      coalesce(new.rejection_reason, 'O check-in foi rejeitado. Tente novamente.'),
      '/app/checkin'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger trigger_checkin_status_change
  after update on public.checkins
  for each row execute function public.on_checkin_approved();

-- ╔══════════════════════════════════════════════╗
-- ║  6. ROW LEVEL SECURITY (RLS)                 ║
-- ╚══════════════════════════════════════════════╝

alter table public.profiles enable row level security;
alter table public.bars enable row level security;
alter table public.bar_prizes enable row level security;
alter table public.receipts enable row level security;
alter table public.checkins enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_bars enable row level security;
alter table public.challenge_participations enable row level security;
alter table public.routes enable row level security;
alter table public.route_bars enable row level security;
alter table public.route_participations enable row level security;
alter table public.route_bar_visits enable row level security;
alter table public.prizes enable row level security;
alter table public.prize_redemptions enable row level security;
alter table public.missions enable row level security;
alter table public.user_missions enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.points_history enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.ranking_snapshots enable row level security;

-- Helper: checa se o user autenticado é admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ── profiles ──
create policy "Usuário vê próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin vê todos os perfis"
  on public.profiles for select
  using (public.is_admin());

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admin atualiza qualquer perfil"
  on public.profiles for update
  using (public.is_admin());

-- ── bars ──
create policy "Todos veem bares ativos"
  on public.bars for select
  using (active = true);

create policy "Admin vê todos os bares"
  on public.bars for select
  using (public.is_admin());

create policy "Admin gerencia bares"
  on public.bars for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── bar_prizes ──
create policy "Todos veem prêmios de bares"
  on public.bar_prizes for select
  using (true);

create policy "Admin gerencia prêmios de bares"
  on public.bar_prizes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── receipts ──
create policy "Usuário vê próprias notas"
  on public.receipts for select
  using (auth.uid() = user_id);

create policy "Usuário envia nota"
  on public.receipts for insert
  with check (auth.uid() = user_id);

create policy "Admin vê todas as notas"
  on public.receipts for select
  using (public.is_admin());

create policy "Admin atualiza notas"
  on public.receipts for update
  using (public.is_admin());

-- ── checkins ──
create policy "Usuário vê próprios checkins"
  on public.checkins for select
  using (auth.uid() = user_id);

create policy "Usuário envia checkin"
  on public.checkins for insert
  with check (auth.uid() = user_id);

create policy "Admin vê todos os checkins"
  on public.checkins for select
  using (public.is_admin());

create policy "Admin atualiza checkins"
  on public.checkins for update
  using (public.is_admin());

-- ── challenges ──
create policy "Todos veem desafios ativos"
  on public.challenges for select
  using (active = true);

create policy "Admin gerencia desafios"
  on public.challenges for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── challenge_bars ──
create policy "Todos veem bares de desafios"
  on public.challenge_bars for select
  using (true);

create policy "Admin gerencia bares de desafios"
  on public.challenge_bars for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── challenge_participations ──
create policy "Usuário vê próprias participações"
  on public.challenge_participations for select
  using (auth.uid() = user_id);

create policy "Usuário participa de desafio"
  on public.challenge_participations for insert
  with check (auth.uid() = user_id);

create policy "Admin vê todas participações"
  on public.challenge_participations for select
  using (public.is_admin());

-- ── routes ──
create policy "Todos veem rotas ativas"
  on public.routes for select
  using (active = true);

create policy "Admin gerencia rotas"
  on public.routes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── route_bars ──
create policy "Todos veem bares de rotas"
  on public.route_bars for select
  using (true);

create policy "Admin gerencia bares de rotas"
  on public.route_bars for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── route_participations ──
create policy "Usuário vê próprias participações em rotas"
  on public.route_participations for select
  using (auth.uid() = user_id);

create policy "Usuário participa de rota"
  on public.route_participations for insert
  with check (auth.uid() = user_id);

create policy "Admin vê participações em rotas"
  on public.route_participations for select
  using (public.is_admin());

-- ── route_bar_visits ──
create policy "Usuário vê próprias visitas"
  on public.route_bar_visits for select
  using (
    exists (
      select 1 from public.route_participations rp
      where rp.id = route_participation_id and rp.user_id = auth.uid()
    )
  );

create policy "Usuário registra visita"
  on public.route_bar_visits for insert
  with check (
    exists (
      select 1 from public.route_participations rp
      where rp.id = route_participation_id and rp.user_id = auth.uid()
    )
  );

-- ── prizes ──
create policy "Todos veem prêmios"
  on public.prizes for select
  using (true);

create policy "Admin gerencia prêmios"
  on public.prizes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── prize_redemptions ──
create policy "Usuário vê próprios resgates"
  on public.prize_redemptions for select
  using (auth.uid() = user_id);

create policy "Usuário resgata prêmio"
  on public.prize_redemptions for insert
  with check (auth.uid() = user_id);

create policy "Admin vê todos os resgates"
  on public.prize_redemptions for select
  using (public.is_admin());

-- ── missions ──
create policy "Todos veem missões ativas"
  on public.missions for select
  using (active = true);

create policy "Admin gerencia missões"
  on public.missions for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── user_missions ──
create policy "Usuário vê próprias missões"
  on public.user_missions for select
  using (auth.uid() = user_id);

create policy "Usuário atualiza próprias missões"
  on public.user_missions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admin vê todas as missões"
  on public.user_missions for select
  using (public.is_admin());

-- ── achievements ──
create policy "Todos veem conquistas"
  on public.achievements for select
  using (true);

create policy "Admin gerencia conquistas"
  on public.achievements for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── user_achievements ──
create policy "Usuário vê próprias conquistas"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Admin vê conquistas de todos"
  on public.user_achievements for select
  using (public.is_admin());

-- ── points_history ──
create policy "Usuário vê próprio extrato"
  on public.points_history for select
  using (auth.uid() = user_id);

create policy "Admin vê todos os extratos"
  on public.points_history for select
  using (public.is_admin());

-- ── notifications ──
create policy "Usuário vê próprias notificações"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Usuário marca notificação como lida"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admin cria notificações"
  on public.notifications for insert
  with check (public.is_admin());

-- ── push_subscriptions ──
create policy "Usuário gerencia próprios push"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admin vê todas as subscriptions"
  on public.push_subscriptions for select
  using (public.is_admin());

-- ── ranking_snapshots ──
create policy "Todos veem ranking"
  on public.ranking_snapshots for select
  using (true);

create policy "Admin gerencia ranking"
  on public.ranking_snapshots for all
  using (public.is_admin())
  with check (public.is_admin());

-- ╔══════════════════════════════════════════════╗
-- ║  7. STORAGE BUCKETS                           ║
-- ╚══════════════════════════════════════════════╝

-- Bucket para imagens de notas fiscais
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  5242880,  -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) on conflict (id) do nothing;

-- Bucket para imagens de check-ins (prints do Instagram)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'checkins',
  'checkins',
  false,
  5242880,  -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) on conflict (id) do nothing;

-- Bucket para imagens de bares
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bars',
  'bars',
  true,
  10485760,  -- 10MB
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- Storage policies: receipts
create policy "Usuário faz upload de receipts"
  on storage.objects for insert
  with check (
    bucket_id = 'receipts'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Usuário vê próprios receipts"
  on storage.objects for select
  using (
    bucket_id = 'receipts'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Admin vê todos os receipts"
  on storage.objects for select
  using (
    bucket_id = 'receipts'
    and public.is_admin()
  );

-- Storage policies: checkins
create policy "Usuário faz upload de checkins"
  on storage.objects for insert
  with check (
    bucket_id = 'checkins'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Usuário vê próprios checkins storage"
  on storage.objects for select
  using (
    bucket_id = 'checkins'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Admin vê todos os checkins storage"
  on storage.objects for select
  using (
    bucket_id = 'checkins'
    and public.is_admin()
  );

-- Storage policies: bars (público)
create policy "Todos veem imagens de bares"
  on storage.objects for select
  using (bucket_id = 'bars');

create policy "Admin faz upload de imagens de bares"
  on storage.objects for insert
  with check (
    bucket_id = 'bars'
    and public.is_admin()
  );

-- ╔══════════════════════════════════════════════╗
-- ║  8. VIEWS (helpers para queries comuns)       ║
-- ╚══════════════════════════════════════════════╝

-- View do ranking mensal atual (calculado em tempo real)
create or replace view public.current_ranking as
  select
    row_number() over (order by p.points_this_month desc) as position,
    p.id as user_id,
    p.name as user_name,
    p.avatar_color,
    p.points_this_month as points,
    p.bars_visited
  from public.profiles p
  where p.role = 'user' and p.status = 'active'
  order by p.points_this_month desc;

-- View de estatísticas admin
create or replace view public.admin_stats as
  select
    (select count(*) from public.profiles where role = 'user') as total_users,
    (select count(*) from public.profiles where role = 'user' and status = 'active') as active_users,
    (select count(*) from public.bars where active = true) as active_bars,
    (select count(*) from public.receipts where status = 'pending') as pending_receipts,
    (select count(*) from public.checkins where status = 'pending') as pending_checkins,
    (select coalesce(sum(amount), 0) from public.receipts where status in ('approved', 'approved_auto')) as total_revenue;

-- ╔══════════════════════════════════════════════╗
-- ║  FIM DO SCHEMA                                ║
-- ╚══════════════════════════════════════════════╝
