// Rookie Vault - Music panel
// Uses Spotify's public embed player - no login, no API key, no OAuth.
// This only shows whatever playlist is picked; it is not "what Brenton is
// currently playing" (that would need the full OAuth flow, tabled for now).

const PLAYLISTS_KEY = "rookie-vault-music-playlists";

const DEFAULT_PLAYLISTS = [
  { id: "37i9dQZF1DXcBWIGoYBM5M", label: "Today's Top Hits" },
  { id: "37i9dQZF1DX0XUsuxWHRQd", label: "RapCaviar" }
];

let activeIndex = 0;

const elements = {
  panel: document.querySelector("#musicFeedPanel"),
  tabs: document.querySelector("#musicFeedTabs"),
  frame: document.querySelector("#musicFeedFrame"),
  settingsButton: document.querySelector("#musicFeedSettingsButton"),
  settings: document.querySelector("#musicFeedSettings"),
  urlInput: document.querySelector("#musicFeedUrlInput"),
  labelInput: document.querySelector("#musicFeedLabelInput"),
  addButton: document.querySelector("#addMusicPlaylistButton"),
  removeButton: document.querySelector("#removeMusicPlaylistButton"),
  message: document.querySelector("#musicFeedMessage")
};

export function initMusicFeed() {
  if (!elements.panel) return;

  elements.settingsButton?.addEventListener("click", () => {
    elements.settings.classList.toggle("hidden");
  });

  elements.addButton?.addEventListener("click", addPlaylist);
  elements.removeButton?.addEventListener("click", removeActivePlaylist);

  renderTabs();
  renderFrame();
}

function getPlaylists() {
  try {
    const stored = JSON.parse(localStorage.getItem(PLAYLISTS_KEY) || "null");
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {
    // fall through to defaults
  }
  return DEFAULT_PLAYLISTS;
}

function savePlaylists(list) {
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(list));
}

function extractPlaylistId(input) {
  const trimmed = input.trim();

  // Accept a raw ID, a full open.spotify.com URL, or an embed URL.
  const match = trimmed.match(/playlist\/([a-zA-Z0-9]+)/);
  if (match) return match[1];

  if (/^[a-zA-Z0-9]{15,30}$/.test(trimmed)) return trimmed;

  return null;
}

function addPlaylist() {
  const id = extractPlaylistId(elements.urlInput.value || "");

  if (!id) {
    elements.message.textContent = "Paste a Spotify playlist link (or its ID).";
    return;
  }

  const label = elements.labelInput.value.trim() || "Playlist";
  const playlists = getPlaylists();
  playlists.push({ id, label });
  savePlaylists(playlists);

  elements.urlInput.value = "";
  elements.labelInput.value = "";
  activeIndex = playlists.length - 1;

  renderTabs();
  renderFrame();
  elements.message.textContent = `Added "${label}".`;
}

function removeActivePlaylist() {
  const playlists = getPlaylists();
  if (playlists.length <= 1) {
    elements.message.textContent = "Keep at least one playlist.";
    return;
  }

  playlists.splice(activeIndex, 1);
  savePlaylists(playlists);
  activeIndex = 0;

  renderTabs();
  renderFrame();
}

function renderTabs() {
  const playlists = getPlaylists();
  elements.tabs.replaceChildren();

  playlists.forEach((playlist, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "filter-chip" + (index === activeIndex ? " active" : "");
    tab.textContent = playlist.label;
    tab.addEventListener("click", () => {
      activeIndex = index;
      renderTabs();
      renderFrame();
    });
    elements.tabs.append(tab);
  });
}

function renderFrame() {
  const playlists = getPlaylists();
  const playlist = playlists[activeIndex] || playlists[0];
  if (!playlist) return;

  elements.frame.src =
    `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`;
}
