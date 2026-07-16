# Rookie Vault Card Show Mode + Wishlist Upgrade

## First: run the migration

Run:

- `supabase/wishlist-enhancements-migration.sql`

in Supabase SQL Editor.

## Then replace

- `index.html`
- `css/app.css`
- `js/app.js`
- `sw.js`

Keep:

- `js/config.js`

## Adds

- Card Show Mode button on Home
- Full-screen show-floor interface
- Fast Trade, Duplicate, Wishlist, High Value, and All filters
- Large mobile-first card photos
- Fast search
- Wishlist priority: Low, Medium, High
- Wishlist target price
- Wishlist priority and target shown in card details
- Wishlist fields included in CSV/JSON backups
- PWA cache version `rookie-vault-v16`

High-value currently means an estimated value of $50 or more.

Suggested commit:

`Add card show mode and wishlist priorities`
