# Rookie Vault - Small Wins Update (v24)

Three small, additive changes. No Supabase migration needed.

**Everything in this bundle is a ready-to-extract, drop-in replacement.**
`index.html` already has the new panel, stylesheet, and script tags wired
in — you don't need to hand-edit anything. Just replace your existing files
with these.

## Files in this bundle (replace all of these)

- `index.html` (sports feed panel added, version tags bumped to v24)
- `js/app.js` (CardSight caching + real year/brand filters + card-flip animation + photo shimmer hook)
- `js/cardsight-diagnostics.js` (unchanged, included for completeness)
- `js/sports-feed.js` (new)
- `css/app.css` (unchanged, included for completeness)
- `css/cardsight-diagnostics.css` (unchanged, included for completeness)
- `css/sports-feed.css` (new)
- `sw.js` (bumped to v24, adds the two new files to the app shell)

Keep as-is (not in this bundle): `js/config.js`

## 1. CardSight: real year/brand filters + fewer wasted calls

Both the lookup form and the scan/catalog quick search now send CardSight's
actual `year` and `brand` params (per their API docs) instead of only
cramming them into the free-text `q`. This should return tighter, more
relevant results and use fewer of your free-tier calls per session.

**Built-in safety net:** if a narrowed search (with `year`/`brand` set)
comes back with zero results, the code automatically retries using the old
free-text-merged query before giving up. So if CardSight's filter values
turn out to need a different format than expected (e.g. a specific string
vs. a number for `year`), search still works exactly like it did before —
it just won't be as narrowed until that's sorted out. Nothing can break
silently; worst case it behaves like the previous version.

The results message tells you which path was used: results found "(narrowed
by year/brand)" means the dedicated filters worked.

On top of that, all `catalog.search` calls (narrowed or fallback) are cached
in memory for 5 minutes per exact param set, so repeating a search or
switching back to a previous view doesn't re-bill the API.

**Worth double-checking:** I used `year` and `brand` as the param names
based on what you said the docs show. If CardSight's docs use slightly
different casing or names (e.g. `cardYear`), it's a one-line fix in
`searchCardSightNarrowed` near the top of `app.js` — the fallback keeps it
safe in the meantime either way.

## 2. Card detail flip animation

Tapping "Front"/"Back" on a card's detail view now does a quick rotateY
flip (edge-on, swap the photo, rotate back) instead of an instant image
swap. It's CSS + a small JS timing change only — same buttons, same photo
element, no new markup needed. First time a card's dialog opens there's no
animation (avoids a flash before any photo has loaded).

## 3. Live scores + news feed

Already wired into `index.html` in this bundle: the panel sits on the Home
view between the welcome card and your stats grid, the stylesheet and
script tags are added, and `app.js` already imports and calls
`initSportsFeed()` on startup. Nothing to add by hand.

## Where the data comes from

ESPN's public site API (`site.api.espn.com`) — no key, no signup, no cost,
and it's CORS-friendly for browser calls, which is why the existing service
worker doesn't need changes to let it through (it already skips every
cross-origin request). Results are cached in memory for 10 minutes per
session so switching views doesn't refetch constantly.

If Brenton hasn't set favorite teams yet, the panel shows recent
league-wide games and top headlines across all four sports, so it's never
empty.

**Note:** this is ESPN's unofficial public API — reliable in practice but
undocumented, so they could change the response shape without notice. Fine
for a hobby app; just know it's not a formal, versioned API like CardSight.

## Device cleanup after deploying

Same as the v23 note: refresh once, close all tabs, reopen. Installed
home-screen icons should be removed and reinstalled once so the new service
worker takes over cleanly.

## Before you commit

Test in this order so a problem is easy to isolate:
1. Load the app normally, confirm existing collection/photos still render.
2. Run a CardSight lookup search with a year and brand filled in — check the
   result message for "(narrowed by year/brand)" to confirm the real params
   worked.
3. Open a card's detail view and tap Front/Back to see the flip.
4. Check the new "Live scores & news" panel on Home loads without errors
   (open browser dev tools console if it looks empty).

## Suggested commit

`Add CardSight year/brand filters with fallback, card flip animation, live scores/news feed`

