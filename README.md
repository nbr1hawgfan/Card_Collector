# Rookie Vault Navigation + OCR Tuning Fix

No Supabase migration is required.

Replace:

- `index.html`
- `css/app.css`
- `js/app.js`
- `sw.js`

Keep:

- `js/config.js`

## Fixes

- Only one bottom-navigation button is highlighted at a time
- Scan is no longer permanently styled as selected
- Active navigation now uses `aria-current`
- OCR tries both high-contrast and natural-color image processing
- Rookie Vault keeps the OCR result with the stronger useful-text score
- Expanded card-number patterns
- Added Score, Prestige, Heroes and Contenders recognition
- PWA cache version `rookie-vault-v14`

The extra OCR pass may take somewhat longer, but should improve difficult cards. OCR will still struggle with foil glare, highly stylized names, tiny text and sideways card designs.

Suggested commit:

`Fix navigation highlight and improve OCR accuracy`
