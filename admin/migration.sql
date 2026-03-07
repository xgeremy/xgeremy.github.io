-- ═══════════════════════════════════════════════════════════════════
--  XGEREMY Studio OS — Supabase Migration
--  Ejecutar en: Supabase > SQL Editor > New query
-- ═══════════════════════════════════════════════════════════════════

-- ── appointments_v2 ──────────────────────────────────────────────
create table if not exists public.appointments_v2 (
  id          bigint       primary key,
  client      text         not null default '',
  date        text         not null default '',
  time        text         default '',
  dur         numeric      default 0,
  price       numeric      default 0,
  deposit     numeric      default 0,
  pts         integer      default 0,
  zone        text         default '',
  appt_desc   text         default '',
  type        text         default 'tattoo',
  status      text         default 'pending',
  created_at  timestamptz  default now()
);

-- ── sessions_v2 ───────────────────────────────────────────────────
create table if not exists public.sessions_v2 (
  id           bigint       primary key,
  client       text         default '',
  date         text         default '',
  hours        numeric      default 0,
  price        numeric      default 0,
  style        text         default 'Blackwork',
  zone         text         default '',
  sessnum      integer      default 1,
  pts          integer      default 0,
  session_desc text         default '',
  improve      text         default '',
  rating       integer      default 3,
  appt_id      bigint,
  created_at   timestamptz  default now()
);

-- ── habits_v2 ─────────────────────────────────────────────────────
create table if not exists public.habits_v2 (
  id          bigint       primary key,
  habit_key   text         default '',
  name        text         default '',
  cat         text         default 'salud',
  log_json    jsonb        default '{}',
  created_at  timestamptz  default now()
);

-- ── goals_v2 ──────────────────────────────────────────────────────
create table if not exists public.goals_v2 (
  id          bigint       primary key,
  title       text         default '',
  goal_desc   text         default '',
  pct         integer      default 0,
  due         text         default '',
  goal_type   text         default 'monthly',
  created_at  timestamptz  default now()
);

-- ── inventory_v2 ──────────────────────────────────────────────────
create table if not exists public.inventory_v2 (
  id          bigint       primary key,
  name        text         default '',
  cat         text         default 'otro',
  stock       numeric      default 0,
  min         integer      default 1,
  unit        text         default '',
  prov        text         default '',
  notes       text         default '',
  created_at  timestamptz  default now()
);

-- ── notion_pages_v2 ───────────────────────────────────────────────
create table if not exists public.notion_pages_v2 (
  id           bigint       primary key,
  page_key     text         default '',
  title        text         default '',
  content_html text         default '',
  created_at   timestamptz  default now()
);

-- ── RLS: activar en todas ─────────────────────────────────────────
alter table public.appointments_v2  enable row level security;
alter table public.sessions_v2      enable row level security;
alter table public.habits_v2        enable row level security;
alter table public.goals_v2         enable row level security;
alter table public.inventory_v2     enable row level security;
alter table public.notion_pages_v2  enable row level security;

-- ── Policies: admin autenticado puede hacer todo ──────────────────
do $$ begin
  -- appointments_v2
  if not exists (select 1 from pg_policies where tablename='appointments_v2' and policyname='admin_all') then
    create policy "admin_all" on public.appointments_v2 for all to authenticated using (true) with check (true);
  end if;
  -- sessions_v2
  if not exists (select 1 from pg_policies where tablename='sessions_v2' and policyname='admin_all') then
    create policy "admin_all" on public.sessions_v2 for all to authenticated using (true) with check (true);
  end if;
  -- habits_v2
  if not exists (select 1 from pg_policies where tablename='habits_v2' and policyname='admin_all') then
    create policy "admin_all" on public.habits_v2 for all to authenticated using (true) with check (true);
  end if;
  -- goals_v2
  if not exists (select 1 from pg_policies where tablename='goals_v2' and policyname='admin_all') then
    create policy "admin_all" on public.goals_v2 for all to authenticated using (true) with check (true);
  end if;
  -- inventory_v2
  if not exists (select 1 from pg_policies where tablename='inventory_v2' and policyname='admin_all') then
    create policy "admin_all" on public.inventory_v2 for all to authenticated using (true) with check (true);
  end if;
  -- notion_pages_v2
  if not exists (select 1 from pg_policies where tablename='notion_pages_v2' and policyname='admin_all') then
    create policy "admin_all" on public.notion_pages_v2 for all to authenticated using (true) with check (true);
  end if;
end $$;

-- ── Fin ───────────────────────────────────────────────────────────
-- Tablas creadas: appointments_v2, sessions_v2, habits_v2, goals_v2, inventory_v2, notion_pages_v2
