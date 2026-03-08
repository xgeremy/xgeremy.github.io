-- Social cards table for cross-device sync
create table if not exists social_cards_v2 (
  id bigint primary key,
  title text not null default '',
  status text not null default 'todo',
  plat text not null default 'ig',
  fmt text default 'Reel',
  card_date date,
  idea text default '',
  script_text text default '',
  checklist_json jsonb default '[]'::jsonb
);

alter table social_cards_v2 enable row level security;

create policy "admin_all" on social_cards_v2
  for all using (auth.uid() = 'ac0023c2-9fc1-4f01-8e77-792cf8e34456'::uuid);
