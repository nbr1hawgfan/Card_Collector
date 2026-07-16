# Rookie Vault Collector Details Upgrade

## First: run the database migration

In Supabase SQL Editor, run:

`supabase/collector-details-migration.sql`

## Then replace these files

- `index.html`
- `css/app.css`
- `js/app.js`
- `sw.js`

Keep:

- `js/config.js`

## Adds

- Rookie card flag
- Autograph flag
- Patch / memorabilia flag
- Serial numbered cards
- Serial number and print run
- Parallel / variation
- Quantity
- Raw or graded status
- PSA, BGS, SGC, CGC or Other grading company
- Grade
- Purchase price
- Purchase date
- Collector badges on collection cards
- Collector badges in full card details
- Dashboard counts for rookie, autograph, graded and numbered cards
- Collection health counts for missing values and missing front photos
- Full edit support for all new fields
- PWA cache version `rookie-vault-v9`

Suggested commit:

`Add collector fields badges and statistics`
