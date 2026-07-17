// Rookie Vault - Live scores and news feed
// Uses ESPN's public site API (no key, no signup, no cost).
// Same pattern as CardSight: favorite teams are stored on-device only.

const TEAMS_KEY = "rookie-vault-favorite-teams";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes - keep requests light

const LEAGUES = {
  baseball: { path: "baseball/mlb", label: "MLB" },
  football: { path: "football/nfl", label: "NFL" },
  basketball: { path: "basketball/nba", label: "NBA" },
  hockey: { path: "hockey/nhl", label: "NHL" }
};

const cache = new Map();

const elements = {
  panel: document.querySelector("#sportsFeedPanel"),
  settings: document.querySelector("#sportsFeedSettings"),
  settingsButton: document.querySelector("#sportsFeedSettingsButton"),
  teamsInput: document.querySelector("#sportsFeedTeamsInput"),
  saveTeamsButton: document.querySelector("#saveSportsFeedTeamsButton"),
  refreshButton: document.querySelector("#refreshSportsFeedButton"),
  scores: document.querySelector("#sportsFeedScores"),
  news: document.querySelector("#sportsFeedNews"),
  message: document.querySelector("#sportsFeedMessage")
};

export function initSportsFeed() {
  if (!elements.panel) return;

  elements.teamsInput.value = getFavoriteTeams().join(", ");

  elements.settingsButton?.addEventListener("click", () => {
    elements.settings.classList.toggle("hidden");
  });

  elements.saveTeamsButton?.addEventListener("click", () => {
    const teams = elements.teamsInput.value
      .split(",")
      .map(team => team.trim())
      .filter(Boolean);
    saveFavoriteTeams(teams);
    elements.settings.classList.add("hidden");
    loadFeed();
  });

  elements.refreshButton?.addEventListener("click", () => loadFeed(true));

  loadFeed();
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
  elements.scores.replaceChildren();
  elements.news.replaceChildren();

  try {
    const [scores, news] = await Promise.all([
      loadScores(favorites, force),
      loadNews(favorites, force)
    ]);

    renderScores(scores, favorites);
    renderNews(news);

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
        return (data?.events || []).map(event => summarizeEvent(event, league.label));
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

function summarizeEvent(event, leagueLabel) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];
  const home = competitors.find(c => c.homeAway === "home");
  const away = competitors.find(c => c.homeAway === "away");

  return {
    id: event.id,
    league: leagueLabel,
    status: event.status?.type?.shortDetail || "",
    isLive: event.status?.type?.state === "in",
    home: {
      name: home?.team?.shortDisplayName || home?.team?.displayName || "TBD",
      score: home?.score ?? ""
    },
    away: {
      name: away?.team?.shortDisplayName || away?.team?.displayName || "TBD",
      score: away?.score ?? ""
    }
  };
}

function matchesFavorites(event, favorites) {
  const text = `${event.home.name} ${event.away.name}`.toLowerCase();
  return favorites.some(team => text.includes(team.toLowerCase()));
}

function renderScores(events, favorites) {
  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "muted small";
    empty.textContent = favorites.length
      ? "No games found today for your favorite teams."
      : "No games found today.";
    elements.scores.append(empty);
    return;
  }

  for (const event of events) {
    const row = document.createElement("article");
    row.className = "sports-feed-score";

    const league = document.createElement("span");
    league.className = "sports-feed-league";
    league.textContent = event.league;

    const matchup = document.createElement("div");
    matchup.className = "sports-feed-matchup";
    matchup.innerHTML = `
      <span>${escapeHtml(event.away.name)} <strong>${escapeHtml(String(event.away.score))}</strong></span>
      <span>${escapeHtml(event.home.name)} <strong>${escapeHtml(String(event.home.score))}</strong></span>
    `;

    const status = document.createElement("span");
    status.className = event.isLive
      ? "sports-feed-status live"
      : "sports-feed-status";
    status.textContent = event.status;

    row.append(league, matchup, status);
    elements.scores.append(row);
  }
}

function renderNews(articles) {
  if (!articles.length) {
    const empty = document.createElement("p");
    empty.className = "muted small";
    empty.textContent = "No headlines available right now.";
    elements.news.append(empty);
    return;
  }

  for (const article of articles) {
    const item = document.createElement("a");
    item.className = "sports-feed-headline";
    item.href = article.link || "#";
    item.target = "_blank";
    item.rel = "noopener";
    item.innerHTML = `
      <span class="sports-feed-league">${escapeHtml(article.league)}</span>
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
