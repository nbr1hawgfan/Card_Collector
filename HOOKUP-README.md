# Rookie Vault - Small Wins Update (v25)

This round: card hobby news, a no-login music panel, and sports expansion
(player watchlist + in-app box scores). Plus everything from v24 (Vault
Ledger, true black + red theme, scrolling ticker, CardSight filters, card
flip). No Supabase migration needed.

**Everything in this bundle is a ready-to-extract, drop-in replacement.**
`index.html` already has every panel, stylesheet, and script tag wired in —
you don't need to hand-edit anything. Just replace your existing files.

## Files in this bundle (replace all of these)

- `index.html` — music panel, hobby news panel, player watchlist, box score
  dialog all added; version tags bumped to v25
- `js/app.js` — Vault Ledger, CardSight caching + year/brand filters, card
  flip, photo shimmer (all from v24, unchanged this round)
- `js/sports-feed.js` — ticker + news, now with player watchlist and
  in-app box scores
- `js/music-feed.js` — **new** — Spotify playlist embeds
- `js/hobby-news.js` — **new** — card hobby news via RSS
- `js/cardsight-diagnostics.js` — unchanged, included for completeness
- `css/app.css` — true black + red dark theme (from v24, unchanged)
- `css/sports-feed.css` — ticker, Vault Ledger, flip/shimmer styles (v24,
  unchanged)
- `css/worlds.css` — **new** — music panel, hobby news, box score dialog
- `css/cardsight-diagnostics.css` — unchanged, included for completeness
- `sw.js` — bumped to v25, adds the new files to the app shell

Keep as-is (not in this bundle): `js/config.js`

## 1. Music panel — no login, no API key needed

This uses Spotify's public embed player, not the full API. That means:

- **What it does:** shows a real, native Spotify player for a playlist —
  play, pause, skip all work, right in the app.
- **What it doesn't do:** it is not "what Brenton is currently playing."
  That would need the full OAuth login flow we tabled earlier. This is a
  chosen playlist, not a live feed of his activity.
- Ships with two defaults I verified are real, current, non-country
  playlists: **Today's Top Hits** and **RapCaviar**. Both playlist IDs were
  confirmed live before I put them in the code.
- Brenton (or you) can add his own via the "Edit playlists" drawer — just
  paste any Spotify playlist link. No developer account, no API key.
- Tabs across the top switch between saved playlists; "Remove current"
  drops whichever one is showing (keeps at least one).

If you two want the full "what's actually playing right now" version
later, that's still the OAuth conversation from before — this doesn't
replace that, it's the lighter option that was on the table alongside it.

## 2. Card hobby news — real feeds, one honest caveat

Pulls real headlines from Cardboard Connection and Beckett's news feeds —
I checked both are live, current RSS feeds before wiring them in.

**The catch:** browsers block a static site from fetching another site's
raw RSS feed directly (no CORS). So this goes through a free relay service
(rss2json.com) that converts RSS to browser-friendly JSON. That's a
third-party dependency I don't control — if it ever goes down or changes
its terms, this panel breaks until a new relay URL is swapped into the
`RELAY` constant at the top of `js/hobby-news.js`. Everything else about
the feature stays the same; it's a one-line fix, not a rebuild.

This is the one piece in this whole update I couldn't fully verify end to
end from my side (I can't test browser CORS behavior from here) — worth
being the first thing you check after deploying.

## 3. Sports: player watchlist + in-app box scores

- **Player watchlist** — new field in the sports settings drawer, separate
  from team names. This does *not* filter live scores (a scoreboard only
  has team data, not rosters) — it's used to flag "trending" items in the
  news list and ticker, the same mechanism that already flags players in
  Brenton's collection. Now it also catches players he's watching but
  doesn't own yet.
- **In-app box scores** — tapping a score in the ticker used to open ESPN
  in a new tab. Now it opens a dialog right in the app with the linescore
  (period-by-period, when ESPN provides it) and top performers per team.
  ESPN's summary data shape varies by sport, so this is defensive — if a
  particular game doesn't have full detail, it shows what it has plus a
  "View full game on ESPN" link rather than erroring.

## 4. Dark mode: true black + red (from v24)

Background is genuine black (`#000000`), accent is vivid red (`#ff2b4d`),
and every card that already used the shared `--shadow` variable
automatically got the "floating" glow look — one variable change, applied
everywhere consistently. Light mode is untouched. "Needs price check" uses
orange instead of red so it stays visually distinct from the brand accent.

## 5. Scrolling ticker (from v24)

Merges three real streams: live scores (with a flash when a score actually
changes since the last check), card value moves pulled from the Vault
Ledger's own price-check history, and news headlines matching a player in
the collection or watchlist. Hover or focus to pause and read. Tapping a
score now opens the in-app box score (see above); tapping a card move opens
that card.

## 6. Vault Ledger replaces Trade (from v24)

Inventory-style view: total value, real week-over-week % (from an on-device
daily snapshot), sell candidates, and cards needing a price check. Per-card
up/down % grows from the existing "Save pricing research" button — nothing
fabricated, no live market feed invented. Table and card-grid views both
available.

## 7. CardSight: real year/brand filters (from v24)

Both the lookup form and the scan/catalog search send CardSight's real
`year` and `brand` params. If a narrowed search returns zero results, it
automatically retries with the old free-text-merged query first — a param
mismatch can't make results worse than before, only less narrowed until
confirmed correct.

## 8. Card detail flip animation (from v24)

Front/Back toggle does a quick rotateY flip instead of an instant swap.

## Before you commit

Test in roughly this order:

1. Load the app normally — confirm existing collection/photos still render.
2. Dark mode — true black, red accents, text still readable everywhere.
3. Home screen — confirm the ticker scrolls, and the new Music and Card
   Hobby News panels both load. **This is the one to check first if
   anything looks broken** — the hobby news relay is the single external
   dependency I couldn't test end-to-end myself.
4. Tap a score in the ticker — confirm the box score dialog opens with
   real data (or the graceful fallback message) instead of leaving the app.
5. Add a player to the watchlist in sports settings, save, and confirm it
   doesn't affect which scores show (only news/ticker highlighting).
6. Add a Spotify playlist link in the Music panel settings and confirm the
   new tab plays.
7. Open the Ledger tab — confirm the metric strip shows real numbers.
8. Save pricing research on a card twice and confirm a real % shows in the
   ledger row and ticker on the second save.
9. Run a CardSight lookup search with year + brand filled in — check for
   "(narrowed by year/brand)" in the result message.
10. Tap Front/Back on a card detail to see the flip.

## Suggested commit

`Add music panel and card hobby news, player watchlist + in-app box scores, true black/red theme, scrolling ticker, Vault Ledger, CardSight filters`
