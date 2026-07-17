// Rookie Vault - Live scores and news feed
// Uses ESPN's public site API (no key, no signup, no cost).
// Same pattern as CardSight: favorite teams are stored on-device only.
//
// The ticker merges three real, computed streams - nothing here is
// fabricated or simulated:
//   1. Live/recent scores from ESPN, with a flash when a score actually
//      changes between checks.
//   2. Card value moves, read from the Vault Ledger's own price-check
//      history via a small window bridge (js/app.js broadcasts it).
//   3. News headlines that happen to mention a player already in the
//      collection ("trending in your collection").

const TEAMS_KEY = "rookie-vault-favorite-teams";
const PLAYERS_KEY = "rookie-vault-favorite-players";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes - keep requests light

const LEAGUES = {
  baseball: { path: "baseball/mlb", label: "MLB" },
  football: { path: "football/nfl", label: "NFL" },
  basketball: { path: "basketball/nba", label: "NBA" },
  hockey: { path: "hockey/nhl", label: "NHL" }
};

const cache = new Map();
const previousScores = new Map(); // eventId -> "awayScore-homeScore" seen last check

let lastEvents = [];
let lastArticles = [];
let lastFavorites = [];

const elements = {
  panel: document.querySelector("#sportsFeedPanel"),
  settings: document.querySelector("#sportsFeedSettings"),
  settingsButton: document.querySelector("#sportsFeedSettingsButton"),
  teamsInput: document.querySelector("#sportsFeedTeamsInput"),
  playersInput: document.querySelector("#sportsFeedPlayersInput"),
  saveTeamsButton: document.querySelector("#saveSportsFeedTeamsButton"),
  refreshButton: document.querySelector("#refreshSportsFeedButton"),
  ticker: document.querySelector("#sportsFeedScores"),
  news: document.querySelector("#sportsFeedNews"),
  message: document.querySelector("#sportsFeedMessage"),
  boxScoreDialog: document.querySelector("#boxScoreDialog"),
  boxScoreTitle: document.querySelector("#boxScoreTitle"),
  boxScoreBody: document.querySelector("#boxScoreBody"),
  boxScoreClose: document.querySelector("#boxScoreClose"),
  boxScoreEspnLink: document.querySelector("#boxScoreEspnLink")
};

export function initSportsFeed() {
  if (!elements.panel) return;

  elements.teamsInput.value = getFavoriteTeams().join(", ");
  if (elements.playersInput) elements.playersInput.value = getFavoritePlayers().join(", ");

  elements.settingsButton?.addEventListener("click", () => {
    elements.settings.classList.toggle("hidden");
  });

  elements.saveTeamsButton?.addEventListener("click", () => {
    const teams = elements.teamsInput.value
      .split(",")
      .map(team => team.trim())
      .filter(Boolean);
    saveFavoriteTeams(teams);

    if (elements.playersInput) {
      const players = elements.playersInput.value
        .split(",")
        .map(player => player.trim())
        .filter(Boolean);
      saveFavoritePlayers(players);
    }

    elements.settings.classList.add("hidden");
    loadFeed();
  });

  elements.refreshButton?.addEventListener("click", () => loadFeed(true));

  elements.boxScoreClose?.addEventListener("click", () => elements.boxScoreDialog.close());
  elements.boxScoreDialog?.addEventListener("click", event => {
    if (event.target === elements.boxScoreDialog) elements.boxScoreDialog.close();
  });

  // Re-render the ticker (no re-fetch) whenever the Vault Ledger has fresh
  // card-value data, e.g. after saving pricing research on a card.
  window.addEventListener("rookie-vault-ledger-update", () => {
    renderTicker(lastEvents, lastArticles, lastFavorites);
  });

  loadFeed();
}

function getFavoritePlayers() {
  return (localStorage.getItem(PLAYERS_KEY) || "")
    .split(",")
    .map(player => player.trim())
    .filter(Boolean);
}

function saveFavoritePlayers(players) {
  localStorage.setItem(PLAYERS_KEY, players.join(", "));
}

// Players you're watching, plus everyone already in the collection - the
// combined pool used to flag "trending" news/ticker items. This does not
// filter live scores, since a scoreboard only has team-level data, not
// rosters.
function getWatchedPlayers() {
  const collectionPlayers = Array.isArray(window.rookieVaultCollectionPlayers)
    ? window.rookieVaultCollectionPlayers
    : [];
  return [...new Set([...collectionPlayers, ...getFavoritePlayers()])];
}

function getFavoriteTeams() {
  return (localStorage.getItem(TEAMS_KEY) || "")
    .split(",")
    .map(team => team.trim())
    .filter(Boolean);
}

function saveFavoriteTeams(teams) {
  localStorage.setItem(TEAMS_KEY, teams.join(", "));
}

async function cachedFetch(url, force) {
  const hit = cache.get(url);
  if (!force && hit && Date.now() - hit.time < CACHE_TTL_MS) {
    return hit.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (HTTP ${response.status})`);
  }

  const data = await response.json();
  cache.set(url, { time: Date.now(), data });
  return data;
}

async function loadFeed(force = false) {
  const favorites = getFavoriteTeams();

  elements.message.textContent = "Loading scores and news...";

  try {
    const [events, articles] = await Promise.all([
      loadScores(favorites, force),
      loadNews(favorites, force)
    ]);

    lastEvents = events;
    lastArticles = articles;
    lastFavorites = favorites;

    renderTicker(events, articles, favorites);
    renderNews(articles);

    elements.message.textContent = favorites.length
      ? `Showing results for: ${favorites.join(", ")}`
      : "Add favorite teams above to narrow this down.";
  } catch (error) {
    console.error("Sports feed failed:", error);
    elements.message.textContent =
      "Could not load scores or news right now. Try again in a moment.";
  }
}

async function loadScores(favorites, force) {
  const boards = await Promise.all(
    Object.entries(LEAGUES).map(async ([key, league]) => {
      try {
        const data = await cachedFetch(
          `https://site.api.espn.com/apis/site/v2/sports/${league.path}/scoreboard`,
          force
        );
        return (data?.events || []).map(event => summarizeEvent(event, league.label, key));
      } catch (error) {
        console.warn(`Scoreboard failed for ${league.label}:`, error);
        return [];
      }
    })
  );

  const events = boards.flat();
  const filtered = favorites.length
    ? events.filter(event => matchesFavorites(event, favorites))
    : events;

  filtered.sort((a, b) => Number(b.isLive) - Number(a.isLive));
  return filtered.slice(0, 8);
}

async function loadNews(favorites, force) {
  const feeds = await Promise.all(
    Object.entries(LEAGUES).map(async ([key, league]) => {
      try {
        const data = await cachedFetch(
          `https://site.api.espn.com/apis/site/v2/sports/${league.path}/news`,
          force
        );
        return (data?.articles || []).map(article => ({
          headline: article.headline,
          link: article.links?.web?.href || "",
          league: league.label
        }));
      } catch (error) {
        console.warn(`News failed for ${league.label}:`, error);
        return [];
      }
    })
  );

  const articles = feeds.flat();
  const filtered = favorites.length
    ? articles.filter(article =>
        favorites.some(team =>
          article.headline.toLowerCase().includes(team.toLowerCase())
        )
      )
    : articles;

  const pool = filtered.length ? filtered : articles;
  return pool.slice(0, 6);
}

function summarizeEvent(event, leagueLabel, leagueKey) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];
  const home = competitors.find(c => c.homeAway === "home");
  const away = competitors.find(c => c.homeAway === "away");

  const homeScore = home?.score ?? "";
  const awayScore = away?.score ?? "";
  const scoreKey = `${awayScore}-${homeScore}`;

  const previous = previousScores.get(event.id);
  const justUpdated = Boolean(previous && previous !== scoreKey);
  previousScores.set(event.id, scoreKey);

  return {
    id: event.id,
    league: leagueLabel,
    leagueKey,
    status: event.status?.type?.shortDetail || "",
    isLive: event.status?.type?.state === "in",
    justUpdated,
    home: {
      name: home?.team?.shortDisplayName || home?.team?.displayName || "TBD",
      score: homeScore
    },
    away: {
      name: away?.team?.shortDisplayName || away?.team?.displayName || "TBD",
      score: awayScore
    }
  };
}

function matchesFavorites(event, favorites) {
  const text = `${event.home.name} ${event.away.name}`.toLowerCase();
  return favorites.some(team => text.includes(team.toLowerCase()));
}

// ---- In-app box score (keeps him from ever leaving the app) ----

async function openBoxScore(event) {
  if (!elements.boxScoreDialog) return;

  elements.boxScoreTitle.textContent = `${event.away.name} @ ${event.home.name}`;
  elements.boxScoreBody.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "muted small";
  loading.textContent = "Loading box score...";
  elements.boxScoreBody.append(loading);

  const espnPath = LEAGUES[event.leagueKey]?.path;
  elements.boxScoreEspnLink.href = espnPath
    ? `https://www.espn.com/${espnPath.split("/")[1]}/game/_/gameId/${event.id}`
    : "#";

  elements.boxScoreDialog.showModal();

  if (!espnPath) return;

  try {
    const data = await cachedFetch(
      `https://site.api.espn.com/apis/site/v2/sports/${espnPath}/summary?event=${event.id}`,
      false
    );
    renderBoxScore(data, event);
  } catch (error) {
    console.warn("Box score failed:", error);
    elements.boxScoreBody.replaceChildren();
    const failed = document.createElement("p");
    failed.className = "muted small";
    failed.textContent = "Couldn't load the box score. Try the ESPN link below.";
    elements.boxScoreBody.append(failed);
  }
}

function renderBoxScore(data, event) {
  elements.boxScoreBody.replaceChildren();

  const summary = document.createElement("p");
  summary.className = "box-score-line";
  summary.textContent =
    `${event.away.name} ${event.away.score} – ${event.home.name} ${event.home.score} · ${event.status}`;
  elements.boxScoreBody.append(summary);

  // Linescore by period, when ESPN provides it. Shape varies by sport, so
  // this is defensive and simply skips anything it doesn't recognize.
  const competitors = data?.header?.competitions?.[0]?.competitors || [];
  if (competitors.length && competitors.every(c => Array.isArray(c.linescores))) {
    const table = document.createElement("table");
    table.className = "box-score-table";

    const periods = competitors[0].linescores.length;
    const head = document.createElement("tr");
    head.innerHTML =
      "<th></th>" +
      Array.from({ length: periods }, (_, i) => `<th>${i + 1}</th>`).join("") +
      "<th>T</th>";
    table.append(head);

    for (const competitor of competitors) {
      const row = document.createElement("tr");
      const name = competitor.team?.shortDisplayName || competitor.team?.abbreviation || "";
      const cells = competitor.linescores.map(period => `<td>${period.displayValue ?? "-"}</td>`).join("");
      row.innerHTML = `<td class="box-score-team">${escapeHtml(name)}</td>${cells}<td><strong>${escapeHtml(String(competitor.score ?? ""))}</strong></td>`;
      table.append(row);
    }

    elements.boxScoreBody.append(table);
  }

  // Top performer per team, when ESPN provides leaders.
  const leaders = data?.leaders || [];
  if (leaders.length) {
    const leaderWrap = document.createElement("div");
    leaderWrap.className = "box-score-leaders";

    for (const teamLeaders of leaders) {
      const topCategory = teamLeaders.leaders?.[0];
      const topAthlete = topCategory?.leaders?.[0];
      if (!topAthlete) continue;

      const line = document.createElement("p");
      line.className = "box-score-leader-line";
      line.textContent =
        `${teamLeaders.team?.shortDisplayName || ""}: ${topAthlete.athlete?.displayName || "—"} — ${topCategory.displayName || ""} ${topAthlete.displayValue || ""}`;
      leaderWrap.append(line);
    }

    if (leaderWrap.childElementCount) {
      elements.boxScoreBody.append(leaderWrap);
    }
  }

  if (elements.boxScoreBody.childElementCount <= 1) {
    const note = document.createElement("p");
    note.className = "muted small";
    note.textContent = "Full box score details aren't available for this game yet.";
    elements.boxScoreBody.append(note);
  }
}

// ---- Ticker: scores + real card value moves + trending news, merged ----

function renderTicker(events, articles, favorites) {
  const items = buildTickerItems(events, articles);

  elements.ticker.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "muted small";
    empty.textContent = favorites.length
      ? "No games found today for your favorite teams."
      : "No games found today.";
    elements.ticker.append(empty);
    return;
  }

  const track = document.createElement("div");
  track.className = "rv-ticker-track";
  // Slower for more items, but never painfully slow or too fast.
  const duration = Math.min(60, Math.max(14, items.length * 2.4));
  track.style.animationDuration = `${duration}s`;

  // Render the item list twice back-to-back so the CSS marquee loop is
  // seamless. The second copy is hidden from assistive tech.
  track.append(buildTickerRow(items, false));
  track.append(buildTickerRow(items, true));

  elements.ticker.append(track);
}

function buildTickerItems(events, articles) {
  const items = [];

  for (const event of events) {
    items.push({
      type: "score",
      justUpdated: event.justUpdated,
      onClick: () => openBoxScore(event),
      render: () => {
        const wrap = document.createElement("span");
        wrap.className = "rv-ticker-item";
        if (event.isLive) wrap.classList.add("live");
        if (event.justUpdated) wrap.classList.add("flash");
        wrap.innerHTML = `
          ${event.isLive ? '<span class="rv-ticker-live-dot">●</span>' : ""}
          <span class="rv-ticker-league">${escapeHtml(event.league)}</span>
          <span>${escapeHtml(event.away.name)} ${escapeHtml(String(event.away.score))} – ${escapeHtml(event.home.name)} ${escapeHtml(String(event.home.score))}</span>
          <span class="rv-ticker-status">${escapeHtml(event.status)}</span>
        `;
        return wrap;
      }
    });
  }

  const cardMoves = Array.isArray(window.rookieVaultCardMoves)
    ? window.rookieVaultCardMoves
    : [];

  for (const move of cardMoves) {
    items.push({
      type: "move",
      onClick: () => window.rookieVaultOpenCard?.(move.id),
      render: () => {
        const wrap = document.createElement("span");
        wrap.className = "rv-ticker-item move";
        const up = move.change > 0;
        wrap.innerHTML = `
          <span class="rv-ticker-league">Vault</span>
          <span>${escapeHtml(move.label)}</span>
          <span class="${up ? "rv-ticker-up" : "rv-ticker-down"}">${up ? "▲" : "▼"} ${Math.abs(move.change).toFixed(0)}%</span>
        `;
        return wrap;
      }
    });
  }

  const collectionPlayers = getWatchedPlayers();

  if (collectionPlayers.length) {
    const trending = articles
      .filter(article =>
        collectionPlayers.some(player =>
          article.headline.toLowerCase().includes(player.toLowerCase())
        )
      )
      .slice(0, 2);

    for (const article of trending) {
      items.push({
        type: "trending",
        onClick: () => {
          if (article.link) window.open(article.link, "_blank", "noopener,noreferrer");
        },
        render: () => {
          const wrap = document.createElement("span");
          wrap.className = "rv-ticker-item trending";
          wrap.innerHTML = `
            <span class="rv-ticker-league">🔥 In your vault</span>
            <span>${escapeHtml(article.headline)}</span>
          `;
          return wrap;
        }
      });
    }
  }

  return items;
}

function buildTickerRow(items, hidden) {
  const row = document.createElement("div");
  row.className = "rv-ticker-row";
  if (hidden) row.setAttribute("aria-hidden", "true");

  for (const item of items) {
    const element = item.render();
    element.setAttribute("role", "button");
    element.tabIndex = hidden ? -1 : 0;
    element.addEventListener("click", item.onClick);
    row.append(element);
  }

  return row;
}

function renderNews(articles) {
  elements.news.replaceChildren();

  if (!articles.length) {
    const empty = document.createElement("p");
    empty.className = "muted small";
    empty.textContent = "No headlines available right now.";
    elements.news.append(empty);
    return;
  }

  const collectionPlayers = getWatchedPlayers();

  for (const article of articles) {
    const isTrending = collectionPlayers.some(player =>
      article.headline.toLowerCase().includes(player.toLowerCase())
    );

    const item = document.createElement("a");
    item.className = "sports-feed-headline";
    item.href = article.link || "#";
    item.target = "_blank";
    item.rel = "noopener";
    item.innerHTML = `
      <span class="sports-feed-league">${isTrending ? "🔥 " : ""}${escapeHtml(article.league)}</span>
      <span>${escapeHtml(article.headline)}</span>
    `;
    elements.news.append(item);
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
