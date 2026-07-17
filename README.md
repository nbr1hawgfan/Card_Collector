# Rookie Vault Search-First Add Card

No Supabase migration is required.

Replace:
- `index.html`
- `css/app.css`
- `css/cardsight-diagnostics.css`
- `js/app.js`
- `js/cardsight-diagnostics.js`
- `sw.js`

Keep:
- `js/config.js`

## New recommended workflow

1. Open **Lookup**.
2. Enter player name.
3. Optionally enter year, sport, and brand/set.
4. Search CardSight.
5. Select the exact catalog result.
6. Rookie Vault fills the Add Card form.
7. Add front and back photos.
8. Review and save.

## What is populated

- Player
- Year
- Manufacturer/brand
- Set or release
- Card number
- Parallel
- Serial print run when supplied
- Possible rookie status
- Recent-sales value when CardSight pricing is available

OCR and photo identification remain under **Optional photo and OCR tools**, but are no longer the primary workflow.

Suggested commit:

`Add search first CardSight card entry workflow`
