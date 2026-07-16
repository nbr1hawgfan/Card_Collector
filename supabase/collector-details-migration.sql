-- Rookie Vault collector details migration
-- Run once in Supabase SQL Editor.

alter table public.cards
  add column if not exists is_rookie boolean not null default false,
  add column if not exists is_autograph boolean not null default false,
  add column if not exists is_memorabilia boolean not null default false,
  add column if not exists is_numbered boolean not null default false,
  add column if not exists serial_number integer,
  add column if not exists print_run integer,
  add column if not exists parallel_name text,
  add column if not exists quantity integer not null default 1,
  add column if not exists card_condition text not null default 'raw',
  add column if not exists grading_company text,
  add column if not exists grade text,
  add column if not exists purchase_price numeric(12,2),
  add column if not exists purchase_date date;

alter table public.cards
  drop constraint if exists cards_quantity_check;

alter table public.cards
  add constraint cards_quantity_check
  check (quantity >= 1);

alter table public.cards
  drop constraint if exists cards_card_condition_check;

alter table public.cards
  add constraint cards_card_condition_check
  check (card_condition in ('raw', 'graded'));

alter table public.cards
  drop constraint if exists cards_serial_number_check;

alter table public.cards
  add constraint cards_serial_number_check
  check (serial_number is null or serial_number >= 0);

alter table public.cards
  drop constraint if exists cards_print_run_check;

alter table public.cards
  add constraint cards_print_run_check
  check (print_run is null or print_run > 0);

alter table public.cards
  drop constraint if exists cards_purchase_price_check;

alter table public.cards
  add constraint cards_purchase_price_check
  check (purchase_price is null or purchase_price >= 0);
