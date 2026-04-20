-- Agro-Knowledge Gaming Assistant MVP – Strawberry Edition
-- Core schema for Supabase Postgres

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text,
  guest_label text,
  created_at timestamptz not null default now()
);

create table if not exists crops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists scenarios (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references crops(id) on delete cascade,
  title text not null,
  duration_days int not null check (duration_days > 0),
  summary text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists scenario_days (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references scenarios(id) on delete cascade,
  day_number int not null check (day_number > 0),
  outside_temp_level text not null check (outside_temp_level in ('low', 'normal', 'high')),
  sunlight_level text not null check (sunlight_level in ('low', 'normal', 'high')),
  disease_pressure_level text not null check (disease_pressure_level in ('low', 'normal', 'high')),
  created_at timestamptz not null default now(),
  unique (scenario_id, day_number)
);

create table if not exists play_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  scenario_id uuid not null references scenarios(id) on delete restrict,
  current_day int not null default 1,
  status text not null default 'active' check (status in ('active', 'completed')),
  current_crop_status text not null default 'Stable growth',
  total_score int not null default 0,
  simulation_state jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists daily_actions (
  id uuid primary key default gen_random_uuid(),
  play_session_id uuid not null references play_sessions(id) on delete cascade,
  day_number int not null check (day_number > 0),
  irrigation text not null check (irrigation in ('low', 'normal', 'high')),
  heating text not null check (heating in ('low', 'normal', 'high')),
  ventilation text not null check (ventilation in ('low', 'normal', 'high')),
  lighting text not null check (lighting in ('off', 'auto', 'on')),
  created_at timestamptz not null default now(),
  unique (play_session_id, day_number)
);

create table if not exists daily_results (
  id uuid primary key default gen_random_uuid(),
  play_session_id uuid not null references play_sessions(id) on delete cascade,
  day_number int not null check (day_number > 0),
  score_delta int not null,
  crop_status text not null,
  feedback_summary text not null,
  feedback jsonb not null default '{}'::jsonb,
  previous_state jsonb not null default '{}'::jsonb,
  next_state jsonb not null default '{}'::jsonb,
  deltas jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (play_session_id, day_number)
);

create table if not exists rule_sets (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references scenarios(id) on delete cascade,
  name text not null,
  version text not null,
  definition_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists quiz_items (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references scenarios(id) on delete cascade,
  image_url text not null,
  title text not null,
  answer_code text not null,
  explanation text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  choices jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  play_session_id uuid references play_sessions(id) on delete set null,
  quiz_item_id uuid not null references quiz_items(id) on delete cascade,
  selected_code text not null,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_scenario_days_scenario on scenario_days(scenario_id);
create index if not exists idx_play_sessions_user on play_sessions(user_id);
create index if not exists idx_daily_actions_session on daily_actions(play_session_id);
create index if not exists idx_daily_results_session on daily_results(play_session_id);
create index if not exists idx_quiz_attempts_user on quiz_attempts(user_id);
