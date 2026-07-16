-- Rookie Vault Wishlist Enhancements
-- Run once in Supabase SQL Editor.

alter table public.cards
  add column if not exists wishlist_priority text,
  add column if not exists wishlist_target_price numeric(12,2);

alter table public.cards
  drop constraint if exists cards_wishlist_priority_check;

alter table public.cards
  add constraint cards_wishlist_priority_check
  check (
    wishlist_priority is null
    or wishlist_priority in ('low', 'medium', 'high')
  );

alter table public.cards
  drop constraint if exists cards_wishlist_target_price_check;

alter table public.cards
  add constraint cards_wishlist_target_price_check
  check (
    wishlist_target_price is null
    or wishlist_target_price >= 0
  );
