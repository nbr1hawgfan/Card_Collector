# Rookie Vault Save Visibility Fix

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

## Fixes

- Insert/update now uses `.select("*").single()` so Supabase must return the saved row
- Save is treated as successful only when a card ID is returned
- Collection reload verifies the exact saved card is present
- Old search, sport, status, and Trash filters are cleared after saving
- Rookie Vault navigates directly to Collection
- The newly saved card opens automatically
- Success messages are no longer erased by `loadCards()`
- Clear error shown when a database save or reload cannot be verified
- PWA cache version v21

Suggested commit:

`Verify saved cards and reveal them in collection`
