alter table public.rsvps
  add column if not exists companion_names text[] not null default '{}';
