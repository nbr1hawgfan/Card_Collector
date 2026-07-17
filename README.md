# Rookie Vault Supabase Cache and Sync Fix

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

## Root cause fixed

The previous service worker intercepted every GET request, including:

- Supabase database requests
- Supabase authentication traffic
- Supabase Storage signed photo URLs
- CardSight API requests

Those responses could be cached and reused across refreshes. Signed photo URLs could also be cached after they expired.

## Changes

- Service worker now caches only same-origin Rookie Vault app files
- Supabase and CardSight requests always go directly to the network
- Signed photo URLs are never placed in the PWA cache
- Card database rows render immediately
- Photo URL creation runs separately in the background
- A slow or broken photo can no longer delay the entire collection
- Each photo-signing request has an eight-second timeout
- Removed the extra browser fetch that could incorrectly fail because of CORS
- Cache version bumped to v23

## Important device cleanup

After deploying:

1. Open the normal website URL in the browser.
2. Refresh once.
3. Close every Rookie Vault tab/window.
4. Reopen the website.
5. For installed home-screen PWAs, remove the old icon and install it again once.

The v23 service worker deletes earlier Rookie Vault caches during activation.

## Existing card photos

Edit the test card and upload the front/back photos one more time after v23 is active. They will no longer be stored behind an expired cached signed URL.

Suggested commit:

`Stop caching Supabase data and signed photo URLs`
