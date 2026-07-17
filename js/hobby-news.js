// Rookie Vault - Card hobby news panel
// Real RSS feeds from the sports card press. Browsers block a static site
// from fetching another site's raw RSS directly (no CORS on most RSS
// feeds), so this goes through rss2json.com's free relay. That relay is a
// third-party dependency - if it ever goes away, this panel needs a new
// relay swapped into FEEDS below, nothing else changes.

const RELAY = "https://api.rss2json.com/v1/api.json?rss_url=";

const FEEDS = [
  { url: "https://www.cardboardconnection.com/feed", label: "Cardboard Connection" },
  { url: "https://www.beckett.com/news/feed", label: "Beckett" }
];

const elements = {
  panel: document.querySelector("#hobbyNewsPanel"),
  list: document.querySelector("#hobbyNewsList"),
  message: document.querySelector("#hobbyNewsMessage"),
  refreshButton: document.querySelector("#refreshHobbyNewsButton")
};

export function initHobbyNews() {
  if (!elements.panel) return;

  elements.refreshButton?.addEventListener("click", loadHobbyNews);
  loadHobbyNews();
}

async function loadHobbyNews() {
  elements.message.textContent = "Loading hobby news...";
  elements.list.replaceChildren();

  const results = await Promise.allSettled(
    FEEDS.map(feed => fetchFeed(feed))
  );

  const items = results
    .filter(result => result.status === "fulfilled")
    .flatMap(result => result.value);

  const failedCount = results.filter(result => result.status === "rejected").length;

  if (!items.length) {
    elements.message.textContent =
      "Couldn't load hobby news right now (the relay service may be down). Try again shortly.";
    return;
  }

  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  renderNews(items.slice(0, 8));

  elements.message.textContent = failedCount
    ? `Showing what loaded (${failedCount} source${failedCount === 1 ? "" : "s"} didn't respond).`
    : "";
}

async function fetchFeed(feed) {
  const response = await fetch(`${RELAY}${encodeURIComponent(feed.url)}`);
  if (!response.ok) throw new Error(`Relay failed for ${feed.label}`);

  const data = await response.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) {
    throw new Error(`Feed parse failed for ${feed.label}`);
  }

  return data.items.map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    source: feed.label
  }));
}

function renderNews(items) {
  elements.list.replaceChildren();

  for (const item of items) {
    const anchor = document.createElement("a");
    anchor.className = "sports-feed-headline";
    anchor.href = item.link || "#";
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.innerHTML = `
      <span class="sports-feed-league">${escapeHtml(item.source)}</span>
      <span>${escapeHtml(item.title)}</span>
    `;
    elements.list.append(anchor);
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}
