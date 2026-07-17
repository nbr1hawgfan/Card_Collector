# Rookie Vault - Small Wins Update (v24)

Five changes. The Trade tab is replaced by a Vault Ledger inventory view,
and dark mode is now true black with red accents. No Supabase migration
needed.

**Everything in this bundle is a ready-to-extract, drop-in replacement.**
`index.html` already has the ledger view, sports feed panel, and version
tags wired in — you don't need to hand-edit anything. Just replace your
existing files with these.

## Files in this bundle (replace all of these)

- `index.html` (Trade tab replaced with Vault Ledger, sports feed panel added, version tags bumped to v24)
- `js/app.js` (Vault Ledger, CardSight caching + real year/brand filters, card-flip animation, photo shimmer hook)
- `js/cardsight-diagnostics.js` (unchanged, included for completeness)
- `js/sports-feed.js` (new)
- `css/app.css` (unchanged, included for completeness)
- `css/cardsight-diagnostics.css` (unchanged, included for completeness)
- `css/sports-feed.css` (new — also holds the Vault Ledger and flip/shimmer styles)
- `sw.js` (bumped to v24, adds the two new files to the app shell)

Keep as-is (not in this bundle): `js/config.js`

## 1. Dark mode: true black + red

This completely replaces the old maroon dark theme — you asked to replace
it outright, not add a second option. Light mode (your maroon branding) is
untouched.

- Background is genuine black (`#000000`), not dark gray.
- Accent color is a vivid red (`#ff2b4d`) instead of the muted maroon.
- Cards, panels, and KPI tiles now use a shadow that includes a soft red
  glow, which is what gives them the "floating" look — this was a
  one-line change to the shared `--shadow` variable, so it applies
  automatically to every card that already used it (stats, panels,
  ledger rows, show-mode KPIs, collection cards).
- "Needs price check" (danger color) is now orange instead of red, so it
  reads as a distinct alert against the red brand accent instead of
  blending in.

Because the whole app already used CSS custom properties consistently,
this was genuinely a small, contained change — one variable block in
`css/app.css`, plus giving `.show-kpi` and the ledger rows a matching
border/shadow so they float too. Nothing else needed touching.

## 2. Sports ticker: now an actual scrolling ticker

The old score panel was a static stacked list. It's now a real, continuously
scrolling marquee (hover or focus on it to pause and read), and it merges
three things — all real, computed data, nothing simulated:

- **Live/recent scores**, same as before.
- **Card value moves** — pulled straight from the Vault Ledger's own
  price-check history (the same real data described below), so a card
  showing "▲ 9%" in the ledger will also show up in the ticker. Tapping
  one opens that card's detail dialog.
- **"In your vault" trending news** — headlines from ESPN that happen to
  mention a player already in the collection. This is a straightforward
  text match against player names already in the database, not a
  trending/buzz score from anywhere.

It also flashes briefly when a live score actually changes since the last
check (tracked in memory, compared on each refresh) — real change
detection, not a random animation. Tapping a score opens that league's
ESPN scoreboard; tapping a card-move item opens the card in the app.

## 3. Vault Ledger replaces Trade

The old two-sided trade calculator is gone. In its place, on the same nav
slot: an inventory view built around what you actually said you wanted —
value, status, and eBay research in one place, with your "loves an
inventory" instinct pointed at the collection instead of the warehouse.

**What's real vs. what's not**: I did not fabricate any live market-trend
data — there's no feed telling you "comps are up 9% today" because that
data doesn't exist anywhere in your stack yet. Everything shown is computed
from data you already have:

- **Total value** — sum of `estimated_value × quantity` across active cards.
- **This week** — a genuine week-over-week % change. The app now takes a
  daily snapshot of the total portfolio value in `localStorage` each time
  the ledger renders, and compares today's total to the snapshot closest to
  7 days ago. Shows "New" until there's at least a week of history — it
  will never show a made-up number.
- **Sell candidates** — real count of cards marked "For trade" or
  "Duplicate" (existing status field, just surfaced here).
- **Needs price check** — real count of cards with no `price_checked_at`,
  or one older than 30 days.
- **Per-row up/down %** — this one's opt-in and grows over time: every time
  you save pricing research on a card (the existing "Save pricing research"
  button in the card detail dialog), it now also records that value with a
  timestamp in `localStorage`. Once a card has two or more saved checks, the
  ledger shows the real % change between the last two. Cards with fewer
  than two checks show "—" instead of guessing.
- **Insights strip** — plain-language version of the same counts above
  (e.g. "3 duplicates ready to list on eBay"), not a separate data source.

**If you want true market-trend data later** (real eBay sold-price history
tracked over time, not just what you manually save), that's a bigger,
legitimate feature — it'd mean a small price-history table in Supabase and
either a scheduled job or CardSight's pricing endpoint called on a
schedule. Worth a separate conversation whenever you're ready; didn't want
to fake it in the meantime.

Table view and card-grid view are both there (toggle top-right) — table's
tighter for you on desktop, cards read better on Brenton's phone. Tapping
any row opens the existing card detail dialog, same as the collection view.
The $ icon opens an eBay sold-listings search for that exact card (reusing
your existing search-string builder); the ↗ icon opens the card detail.

## 4. CardSight: real year/brand filters + fewer wasted calls

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

## 5. Card detail flip animation

Tapping "Front"/"Back" on a card's detail view now does a quick rotateY
flip (edge-on, swap the photo, rotate back) instead of an instant image
swap. It's CSS + a small JS timing change only — same buttons, same photo
element, no new markup needed. First time a card's dialog opens there's no
animation (avoids a flash before any photo has loaded).

## 6. Live scores + news feed (base panel)

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
2. Switch to dark mode — confirm it's true black with red accents, and that
   text is still readable everywhere (KPI cards, ledger, forms).
3. Open the Ledger tab (bottom nav, replaces where Trade was). Confirm the
   metric strip shows real numbers and doesn't error in the console.
4. Check the ticker on Home — it should be scrolling continuously, and
   pause when you hover/focus it.
5. Save pricing research on a card twice (a few minutes apart is fine) and
   confirm the ledger row shows a real up/down % on the second save, and
   that it also appears in the ticker.
6. Run a CardSight lookup search with a year and brand filled in — check the
   result message for "(narrowed by year/brand)" to confirm the real params
   worked.
7. Open a card's detail view and tap Front/Back to see the flip.

## Suggested commit

`True black + red dark theme, scrolling ticker with real card moves, Vault Ledger replaces Trade, CardSight year/brand filters, card flip animation`

