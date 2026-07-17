# Rookie Vault CardSight Mapping Fix

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

- Preserves the original search-result data when full CardSight details are loaded
- Merges search results and full card records instead of replacing one with the other
- Reads alternate CardSight field names and nested objects
- Correctly maps year from year, cardYear, releaseYear, or release.year
- Correctly maps brand from manufacturer, brand, manufacturerName, or release data
- Correctly maps set/release names
- Correctly maps card number aliases
- Correctly maps parallel/variant/variation fields
- Correctly maps numbered-to / print-run fields
- Falls back to structured `fields` metadata when direct properties are absent
- Uses the same mapping logic for result display and Add Card population
- PWA cache version v20

Suggested commit:

`Fix CardSight year brand and parallel mapping`
