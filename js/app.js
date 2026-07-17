import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createWorker } from "https://esm.sh/tesseract.js@7.0.0";
import * as CardSightSdk from "https://esm.sh/cardsightai@3.6.0";

const PHOTO_BUCKET = "card-photos";
const MAX_IMAGE_EDGE = 1800;
const JPEG_QUALITY = 0.82;
const SIGNED_URL_SECONDS = 3600;
const THEME_KEY = "rookie-vault-theme";
const LAST_BACKUP_KEY = "rookie-vault-last-backup";
const CARDSIGHT_KEY_STORAGE = "rookie-vault-cardsight-api-key";

const elements = {
  setupPanel: document.querySelector("#setupPanel"),
  authPanel: document.querySelector("#authPanel"),
  appPanel: document.querySelector("#appPanel"),
  homeView: document.querySelector("#homeView"),
  addView: document.querySelector("#addView"),
  collectionView: document.querySelector("#collectionView"),
  tradeView: document.querySelector("#tradeView"),
  scanView: document.querySelector("#scanView"),
  lookupCardForm: document.querySelector("#lookupCardForm"),
  lookupPlayerInput: document.querySelector("#lookupPlayerInput"),
  lookupYearInput: document.querySelector("#lookupYearInput"),
  lookupSportInput: document.querySelector("#lookupSportInput"),
  lookupBrandInput: document.querySelector("#lookupBrandInput"),
  lookupSearchButton: document.querySelector("#lookupSearchButton"),
  lookupSearchMessage: document.querySelector("#lookupSearchMessage"),
  lookupResults: document.querySelector("#lookupResults"),
  lookupResultsEmpty: document.querySelector("#lookupResultsEmpty"),
  lookupKeyStatus: document.querySelector("#lookupKeyStatus"),
  scanFrontInput: document.querySelector("#scanFrontInput"),
  scanBackInput: document.querySelector("#scanBackInput"),
  scanFrontPreview: document.querySelector("#scanFrontPreview"),
  scanBackPreview: document.querySelector("#scanBackPreview"),
  analyzeCardButton: document.querySelector("#analyzeCardButton"),
  resetScanButton: document.querySelector("#resetScanButton"),
  scanProgressWrap: document.querySelector("#scanProgressWrap"),
  scanProgressBar: document.querySelector("#scanProgressBar"),
  scanProgressText: document.querySelector("#scanProgressText"),
  scanPlaceholder: document.querySelector("#scanPlaceholder"),
  scanResults: document.querySelector("#scanResults"),
  scanConfidenceBadge: document.querySelector("#scanConfidenceBadge"),
  scanPlayerSuggestion: document.querySelector("#scanPlayerSuggestion"),
  scanYearSuggestion: document.querySelector("#scanYearSuggestion"),
  scanBrandSuggestion: document.querySelector("#scanBrandSuggestion"),
  scanSetSuggestion: document.querySelector("#scanSetSuggestion"),
  scanNumberSuggestion: document.querySelector("#scanNumberSuggestion"),
  scanSportSuggestion: document.querySelector("#scanSportSuggestion"),
  scanParallelSuggestion: document.querySelector("#scanParallelSuggestion"),
  scanValueSuggestion: document.querySelector("#scanValueSuggestion"),
  scanRookieSuggestion: document.querySelector("#scanRookieSuggestion"),
  duplicateWarning: document.querySelector("#duplicateWarning"),
  duplicateWarningText: document.querySelector("#duplicateWarningText"),
  increaseDuplicateButton: document.querySelector("#increaseDuplicateButton"),
  useScanSuggestionsButton: document.querySelector("#useScanSuggestionsButton"),
  scanPricingSearchButton: document.querySelector("#scanPricingSearchButton"),
  scanFrontText: document.querySelector("#scanFrontText"),
  scanBackText: document.querySelector("#scanBackText"),
  scanMessage: document.querySelector("#scanMessage"),
  cardSightStatusBadge: document.querySelector("#cardSightStatusBadge"),
  cardSightSettings: document.querySelector("#cardSightSettings"),
  cardSightApiKeyInput: document.querySelector("#cardSightApiKeyInput"),
  saveCardSightKeyButton: document.querySelector("#saveCardSightKeyButton"),
  clearCardSightKeyButton: document.querySelector("#clearCardSightKeyButton"),
  identifyWithCardSightButton: document.querySelector("#identifyWithCardSightButton"),
  cardSightSearchInput: document.querySelector("#cardSightSearchInput"),
  searchCardSightButton: document.querySelector("#searchCardSightButton"),
  cardSightMessage: document.querySelector("#cardSightMessage"),
  cardSightResults: document.querySelector("#cardSightResults"),
  homeAddButton: document.querySelector("#homeAddButton"),
  homeSetsButton: document.querySelector("#homeSetsButton"),
  homeShowButton: document.querySelector("#homeShowButton"),
  showView: document.querySelector("#showView"),
  exitShowModeButton: document.querySelector("#exitShowModeButton"),
  showModeFilters: document.querySelector("#showModeFilters"),
  showModeSearchInput: document.querySelector("#showModeSearchInput"),
  showModeGrid: document.querySelector("#showModeGrid"),
  showModeEmpty: document.querySelector("#showModeEmpty"),
  showTradeCount: document.querySelector("#showTradeCount"),
  showDuplicateCount: document.querySelector("#showDuplicateCount"),
  showWishlistCount: document.querySelector("#showWishlistCount"),
  showHighValueCount: document.querySelector("#showHighValueCount"),
  manageSetsButton: document.querySelector("#manageSetsButton"),
  homeSetProgressGrid: document.querySelector("#homeSetProgressGrid"),
  homeSetEmpty: document.querySelector("#homeSetEmpty"),
  setsView: document.querySelector("#setsView"),
  newSetGoalButton: document.querySelector("#newSetGoalButton"),
  setGoalForm: document.querySelector("#setGoalForm"),
  setGoalIdInput: document.querySelector("#setGoalIdInput"),
  setGoalNameInput: document.querySelector("#setGoalNameInput"),
  setGoalYearInput: document.querySelector("#setGoalYearInput"),
  setGoalBrandInput: document.querySelector("#setGoalBrandInput"),
  setGoalSetInput: document.querySelector("#setGoalSetInput"),
  setGoalTotalInput: document.querySelector("#setGoalTotalInput"),
  setGoalStartInput: document.querySelector("#setGoalStartInput"),
  saveSetGoalButton: document.querySelector("#saveSetGoalButton"),
  cancelSetGoalButton: document.querySelector("#cancelSetGoalButton"),
  setGoalMessage: document.querySelector("#setGoalMessage"),
  setGoalsGrid: document.querySelector("#setGoalsGrid"),
  setGoalsEmpty: document.querySelector("#setGoalsEmpty"),
  setDialog: document.querySelector("#setDialog"),
  closeSetDialogButton: document.querySelector("#closeSetDialogButton"),
  setDetailName: document.querySelector("#setDetailName"),
  setDetailMeta: document.querySelector("#setDetailMeta"),
  setDetailPercent: document.querySelector("#setDetailPercent"),
  setDetailOwned: document.querySelector("#setDetailOwned"),
  setDetailProgressBar: document.querySelector("#setDetailProgressBar"),
  missingCardsHeading: document.querySelector("#missingCardsHeading"),
  missingNumberGrid: document.querySelector("#missingNumberGrid"),
  ownedNumberGrid: document.querySelector("#ownedNumberGrid"),
  setCompleteMessage: document.querySelector("#setCompleteMessage"),
  addMissingCardButton: document.querySelector("#addMissingCardButton"),
  editSetGoalButton: document.querySelector("#editSetGoalButton"),
  deleteSetGoalButton: document.querySelector("#deleteSetGoalButton"),
  viewAllCardsButton: document.querySelector("#viewAllCardsButton"),
  recentCardsGrid: document.querySelector("#recentCardsGrid"),
  recentEmptyState: document.querySelector("#recentEmptyState"),
  exportCsvButton: document.querySelector("#exportCsvButton"),
  exportJsonButton: document.querySelector("#exportJsonButton"),
  exportSummaryButton: document.querySelector("#exportSummaryButton"),
  lastBackupText: document.querySelector("#lastBackupText"),
  backupMessage: document.querySelector("#backupMessage"),
  clearTradeButton: document.querySelector("#clearTradeButton"),
  myTradeTotal: document.querySelector("#myTradeTotal"),
  theirTradeTotal: document.querySelector("#theirTradeTotal"),
  myTradeCount: document.querySelector("#myTradeCount"),
  theirTradeCount: document.querySelector("#theirTradeCount"),
  tradeRating: document.querySelector("#tradeRating"),
  tradeDifference: document.querySelector("#tradeDifference"),
  tradeAdvice: document.querySelector("#tradeAdvice"),
  tradeSearchInput: document.querySelector("#tradeSearchInput"),
  tradeCollectionGrid: document.querySelector("#tradeCollectionGrid"),
  tradeCollectionEmpty: document.querySelector("#tradeCollectionEmpty"),
  otherTradeForm: document.querySelector("#otherTradeForm"),
  otherTradeNameInput: document.querySelector("#otherTradeNameInput"),
  otherTradeValueInput: document.querySelector("#otherTradeValueInput"),
  otherTradeQtyInput: document.querySelector("#otherTradeQtyInput"),
  otherTradeList: document.querySelector("#otherTradeList"),
  otherTradeEmpty: document.querySelector("#otherTradeEmpty"),
  authForm: document.querySelector("#authForm"),
  signupButton: document.querySelector("#signupButton"),
  logoutButton: document.querySelector("#logoutButton"),
  themeToggle: document.querySelector("#themeToggle"),
  themeIcon: document.querySelector("#themeIcon"),
  formEyebrow: document.querySelector("#formEyebrow"),
  formTitle: document.querySelector("#formTitle"),
  editNotice: document.querySelector("#editNotice"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  cancelEditButtonBottom: document.querySelector("#cancelEditButtonBottom"),
  authMessage: document.querySelector("#authMessage"),
  emailInput: document.querySelector("#emailInput"),
  passwordInput: document.querySelector("#passwordInput"),
  cardForm: document.querySelector("#cardForm"),
  saveCardButton: document.querySelector("#saveCardButton"),
  cardMessage: document.querySelector("#cardMessage"),
  searchInput: document.querySelector("#searchInput"),
  collectionTitle: document.querySelector("#collectionTitle"),
  activeViewButton: document.querySelector("#activeViewButton"),
  trashViewButton: document.querySelector("#trashViewButton"),
  trashCount: document.querySelector("#trashCount"),
  sportFilters: document.querySelector("#sportFilters"),
  statusFilters: document.querySelector("#statusFilters"),
  wishlistPriorityLabel: document.querySelector("#wishlistPriorityLabel"),
  wishlistPriorityInput: document.querySelector("#wishlistPriorityInput"),
  wishlistTargetLabel: document.querySelector("#wishlistTargetLabel"),
  wishlistTargetInput: document.querySelector("#wishlistTargetInput"),
  resultCount: document.querySelector("#resultCount"),
  cardsGrid: document.querySelector("#cardsGrid"),
  emptyState: document.querySelector("#emptyState"),
  totalCards: document.querySelector("#totalCards"),
  totalValue: document.querySelector("#totalValue"),
  tradeCount: document.querySelector("#tradeCount"),
  rookieCount: document.querySelector("#rookieCount"),
  autographCount: document.querySelector("#autographCount"),
  gradedCount: document.querySelector("#gradedCount"),
  numberedCount: document.querySelector("#numberedCount"),
  missingValueCount: document.querySelector("#missingValueCount"),
  missingPhotoCount: document.querySelector("#missingPhotoCount"),
  cardTemplate: document.querySelector("#cardTemplate"),
  frontPhotoInput: document.querySelector("#frontPhotoInput"),
  backPhotoInput: document.querySelector("#backPhotoInput"),
  frontPreview: document.querySelector("#frontPreview"),
  backPreview: document.querySelector("#backPreview"),
  rookieInput: document.querySelector("#rookieInput"),
  autographInput: document.querySelector("#autographInput"),
  memorabiliaInput: document.querySelector("#memorabiliaInput"),
  numberedInput: document.querySelector("#numberedInput"),
  numberedFields: document.querySelector("#numberedFields"),
  serialNumberInput: document.querySelector("#serialNumberInput"),
  printRunInput: document.querySelector("#printRunInput"),
  parallelInput: document.querySelector("#parallelInput"),
  quantityInput: document.querySelector("#quantityInput"),
  conditionInput: document.querySelector("#conditionInput"),
  gradingFields: document.querySelector("#gradingFields"),
  gradingCompanyInput: document.querySelector("#gradingCompanyInput"),
  gradeInput: document.querySelector("#gradeInput"),
  purchasePriceInput: document.querySelector("#purchasePriceInput"),
  purchaseDateInput: document.querySelector("#purchaseDateInput"),
  cardDialog: document.querySelector("#cardDialog"),
  closeDialogButton: document.querySelector("#closeDialogButton"),
  detailPhoto: document.querySelector("#detailPhoto"),
  detailPhotoPlaceholder: document.querySelector("#detailPhotoPlaceholder"),
  showFrontButton: document.querySelector("#showFrontButton"),
  showBackButton: document.querySelector("#showBackButton"),
  detailMeta: document.querySelector("#detailMeta"),
  detailPlayer: document.querySelector("#detailPlayer"),
  detailSet: document.querySelector("#detailSet"),
  detailValue: document.querySelector("#detailValue"),
  pricingSearchText: document.querySelector("#pricingSearchText"),
  copyPricingSearchButton: document.querySelector("#copyPricingSearchButton"),
  ebaySoldLink: document.querySelector("#ebaySoldLink"),
  ebayActiveLink: document.querySelector("#ebayActiveLink"),
  sportsCardsProLink: document.querySelector("#sportsCardsProLink"),
  googlePricingLink: document.querySelector("#googlePricingLink"),
  pricingUpdateForm: document.querySelector("#pricingUpdateForm"),
  pricingValueInput: document.querySelector("#pricingValueInput"),
  pricingSourceInput: document.querySelector("#pricingSourceInput"),
  pricingNotesInput: document.querySelector("#pricingNotesInput"),
  savePricingButton: document.querySelector("#savePricingButton"),
  pricingMessage: document.querySelector("#pricingMessage"),
  priceResearchDate: document.querySelector("#priceResearchDate"),
  detailSport: document.querySelector("#detailSport"),
  detailStatus: document.querySelector("#detailStatus"),
  detailWishlistPriority: document.querySelector("#detailWishlistPriority"),
  detailWishlistTarget: document.querySelector("#detailWishlistTarget"),
  detailBadges: document.querySelector("#detailBadges"),
  detailLocation: document.querySelector("#detailLocation"),
  detailParallel: document.querySelector("#detailParallel"),
  detailQuantity: document.querySelector("#detailQuantity"),
  detailPurchase: document.querySelector("#detailPurchase"),
  detailPriceResearch: document.querySelector("#detailPriceResearch"),
  detailNotes: document.querySelector("#detailNotes"),
  activeDetailActions: document.querySelector("#activeDetailActions"),
  trashDetailActions: document.querySelector("#trashDetailActions"),
  detailEditButton: document.querySelector("#detailEditButton"),
  detailDeleteButton: document.querySelector("#detailDeleteButton"),
  detailRestoreButton: document.querySelector("#detailRestoreButton"),
  detailPermanentDeleteButton: document.querySelector("#detailPermanentDeleteButton")
};

let supabase;
let cards = [];
let currentCollectionId = null;
let currentUserId = null;
let activeSport = "all";
let activeStatus = "all";
let previewObjectUrls = [];
let selectedCard = null;
let detailSide = "front";
let editingCard = null;
let collectionView = "active";
let activeAppView = "home";
let myTradeCardIds = new Set();
let otherTradeItems = [];
let scanPreviewUrls = [];
let scanDuplicateCard = null;
let scanOcrWorker = null;
let setGoals = [];
let selectedSetGoal = null;
let selectedMissingNumber = null;
let activeShowFilter = "trade";
let selectedCardSightCard = null;

applyInitialTheme();
init();

async function init() {
  registerServiceWorker();

  try {
    const config = await import("./config.js");
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase configuration.");
    }
    supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
  } catch (error) {
    console.error(error);
    elements.setupPanel.classList.remove("hidden");
    elements.authPanel.classList.add("hidden");
    return;
  }

  bindEvents();
  updateCollectorFieldVisibility();

  const { data, error } = await supabase.auth.getSession();
  if (error) console.error("Could not read session:", error);
  await showCorrectScreen(data?.session ?? null);

  supabase.auth.onAuthStateChange(async (_event, session) => {
    await showCorrectScreen(session);
  });
}

function bindEvents() {
  elements.authForm.addEventListener("submit", signIn);

  document.querySelector(".bottom-nav").addEventListener("click", event => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    navigateTo(button.dataset.view);
  });

  elements.homeAddButton.addEventListener("click", () => navigateTo("add"));
  elements.homeSetsButton.addEventListener("click", () => navigateTo("sets"));
  elements.homeShowButton.addEventListener("click", enterCardShowMode);
  elements.manageSetsButton.addEventListener("click", () => navigateTo("sets"));
  elements.viewAllCardsButton.addEventListener("click", () => navigateTo("collection"));
  elements.exportCsvButton.addEventListener("click", exportCollectionCsv);
  elements.exportJsonButton.addEventListener("click", exportCollectionJson);
  elements.exportSummaryButton.addEventListener("click", exportCollectionSummary);
  elements.clearTradeButton.addEventListener("click", clearTrade);
  elements.tradeSearchInput.addEventListener("input", renderTradeBuilder);
  elements.otherTradeForm.addEventListener("submit", addOtherTradeItem);
  elements.lookupCardForm.addEventListener("submit", searchCardSightForNewCard);
  elements.scanFrontInput.addEventListener("change", () => previewScanPhoto(elements.scanFrontInput, elements.scanFrontPreview));
  elements.scanBackInput.addEventListener("change", () => previewScanPhoto(elements.scanBackInput, elements.scanBackPreview));
  elements.analyzeCardButton.addEventListener("click", analyzeScannedCard);
  elements.resetScanButton.addEventListener("click", resetScanAssistant);
  elements.useScanSuggestionsButton.addEventListener("click", applyScanSuggestions);
  elements.scanPricingSearchButton.addEventListener("click", openScanPricingSearch);
  elements.increaseDuplicateButton.addEventListener("click", increaseDuplicateQuantity);
  elements.saveCardSightKeyButton.addEventListener("click", saveCardSightKey);
  elements.clearCardSightKeyButton.addEventListener("click", clearCardSightKey);
  elements.identifyWithCardSightButton.addEventListener("click", identifyWithCardSight);
  elements.searchCardSightButton.addEventListener("click", () => searchCardSightCatalog(elements.cardSightSearchInput.value));
  elements.cardSightSearchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchCardSightCatalog(elements.cardSightSearchInput.value);
    }
  });
  elements.newSetGoalButton.addEventListener("click", () => openSetGoalForm());
  elements.cancelSetGoalButton.addEventListener("click", closeSetGoalForm);
  elements.setGoalForm.addEventListener("submit", saveSetGoal);
  elements.closeSetDialogButton.addEventListener("click", closeSetDialog);
  elements.editSetGoalButton.addEventListener("click", editSelectedSetGoal);
  elements.deleteSetGoalButton.addEventListener("click", deleteSelectedSetGoal);
  elements.addMissingCardButton.addEventListener("click", addSelectedMissingCard);
  elements.setDialog.addEventListener("click", event => {
    if (event.target === elements.setDialog) closeSetDialog();
  });
  elements.exitShowModeButton.addEventListener("click", exitCardShowMode);
  elements.showModeSearchInput.addEventListener("input", renderCardShowMode);
  elements.showModeFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-show-filter]");
    if (!button) return;
    activeShowFilter = button.dataset.showFilter;
    setActiveChip(elements.showModeFilters, button);
    renderCardShowMode();
  });
  updateLastBackupDisplay();
  updateWishlistFields();
  updateCardSightStatus();
  elements.signupButton.addEventListener("click", signUp);
  elements.logoutButton.addEventListener("click", signOut);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.cardForm.addEventListener("submit", saveCard);
  elements.activeViewButton.addEventListener("click", () => switchCollectionView("active"));
  elements.trashViewButton.addEventListener("click", () => switchCollectionView("trash"));
  elements.cancelEditButton.addEventListener("click", cancelEdit);
  elements.cancelEditButtonBottom.addEventListener("click", cancelEdit);
  elements.searchInput.addEventListener("input", renderCards);

  elements.sportFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-sport]");
    if (!button) return;
    activeSport = button.dataset.sport;
    setActiveChip(elements.sportFilters, button);
    renderCards();
  });

  document.querySelector("#statusInput").addEventListener("change", updateWishlistFields);

  elements.statusFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-status]");
    if (!button) return;
    activeStatus = button.dataset.status;
    setActiveChip(elements.statusFilters, button);
    renderCards();
  });

  elements.frontPhotoInput.addEventListener("change", () =>
    previewSelectedPhoto(elements.frontPhotoInput, elements.frontPreview)
  );

  elements.backPhotoInput.addEventListener("change", () =>
    previewSelectedPhoto(elements.backPhotoInput, elements.backPreview)
  );

  elements.numberedInput.addEventListener("change", updateCollectorFieldVisibility);
  elements.conditionInput.addEventListener("change", updateCollectorFieldVisibility);

  elements.closeDialogButton.addEventListener("click", closeCardDialog);
  elements.showFrontButton.addEventListener("click", () => setDetailSide("front"));
  elements.showBackButton.addEventListener("click", () => setDetailSide("back"));
  elements.detailEditButton.addEventListener("click", beginEditSelectedCard);
  elements.detailDeleteButton.addEventListener("click", deleteSelectedCard);
  elements.detailRestoreButton.addEventListener("click", restoreSelectedCard);
  elements.detailPermanentDeleteButton.addEventListener("click", permanentlyDeleteSelectedCard);
  elements.copyPricingSearchButton.addEventListener("click", copyPricingSearch);
  elements.pricingUpdateForm.addEventListener("submit", savePricingResearch);

  elements.cardDialog.addEventListener("click", event => {
    if (event.target === elements.cardDialog) closeCardDialog();
  });
}

function applyInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved || "dark";
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  elements.themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  elements.themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#171317" : "#541923");
}

function setActiveChip(container, activeButton) {
  for (const button of container.querySelectorAll(".filter-chip")) {
    button.classList.toggle("active", button === activeButton);
  }
}

async function showCorrectScreen(session) {
  const signedIn = Boolean(session?.user);
  currentUserId = session?.user?.id ?? null;

  elements.authPanel.classList.toggle("hidden", signedIn);
  elements.appPanel.classList.toggle("hidden", !signedIn);
  elements.logoutButton.classList.toggle("hidden", !signedIn);

  if (signedIn) {
    await loadCurrentCollection();
    await loadCards();
    await loadSetGoals();
  } else {
    currentCollectionId = null;
    cards = [];
    renderCards();
  }
}

async function loadCurrentCollection() {
  const { data, error } = await supabase
    .from("collection_members")
    .select("collection_id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Collection loading failed:", error);
    setCardMessage("Could not open your collection.");
    currentCollectionId = null;
    return;
  }

  currentCollectionId = data?.collection_id ?? null;
  if (!currentCollectionId) setCardMessage("No collection was found for this account.");
}

async function signIn(event) {
  event.preventDefault();
  setAuthMessage("Signing in...");

  const { error } = await supabase.auth.signInWithPassword({
    email: elements.emailInput.value.trim(),
    password: elements.passwordInput.value
  });

  if (error) {
    console.error("Sign-in failed:", error);
    setAuthMessage(error.message);
    return;
  }

  elements.authForm.reset();
  setAuthMessage("");
}

async function signUp() {
  setAuthMessage("Creating account...");

  const { error } = await supabase.auth.signUp({
    email: elements.emailInput.value.trim(),
    password: elements.passwordInput.value
  });

  if (error) {
    console.error("Sign-up failed:", error);
    setAuthMessage(error.message);
    return;
  }

  setAuthMessage("Account created. Check email if confirmation is enabled, then sign in.");
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Sign-out failed:", error);
}

async function loadCards() {
  if (!currentCollectionId) {
    cards = [];
    renderCards();
    return;
  }

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("collection_id", currentCollectionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Card loading failed:", error);
    setCardMessage("Could not load the collection.");
    return;
  }

  cards = data ?? [];
  await attachSignedPhotoUrls(cards);
  renderCards();
  if (activeAppView === "trade") renderTradeBuilder();
}

async function attachSignedPhotoUrls(cardRows) {
  await Promise.all(cardRows.map(async card => {
    card.front_photo_url = null;
    card.back_photo_url = null;

    if (card.front_photo_path) {
      card.front_photo_url = await createSignedPhotoUrl(card.front_photo_path);
    }

    if (card.back_photo_path) {
      card.back_photo_url = await createSignedPhotoUrl(card.back_photo_path);
    }
  }));
}

async function createSignedPhotoUrl(path) {
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(path, SIGNED_URL_SECONDS);

  if (error) {
    console.error(`Could not sign photo URL for ${path}:`, error);
    return null;
  }

  return data?.signedUrl ?? null;
}

async function saveCard(event) {
  event.preventDefault();

  if (!currentCollectionId || !currentUserId) {
    setCardMessage("Your collection is not ready yet. Sign out and sign back in.");
    return;
  }

  setSavingState(true);
  setCardMessage(editingCard ? "Updating card..." : "Preparing card...");

  const uploadedPaths = [];
  const oldPathsToDelete = [];

  try {
    let frontPhotoPath = editingCard?.front_photo_path ?? null;
    let backPhotoPath = editingCard?.back_photo_path ?? null;

    const frontFile = elements.frontPhotoInput.files?.[0];
    const backFile = elements.backPhotoInput.files?.[0];

    if (frontFile) {
      setCardMessage("Uploading front photo...");
      const newFrontPath = await uploadCardPhoto(frontFile);
      uploadedPaths.push(newFrontPath);

      if (frontPhotoPath) oldPathsToDelete.push(frontPhotoPath);
      frontPhotoPath = newFrontPath;
    }

    if (backFile) {
      setCardMessage("Uploading back photo...");
      const newBackPath = await uploadCardPhoto(backFile);
      uploadedPaths.push(newBackPath);

      if (backPhotoPath) oldPathsToDelete.push(backPhotoPath);
      backPhotoPath = newBackPath;
    }

    const payload = {
      collection_id: currentCollectionId,
      player_name: valueOf("#playerInput"),
      sport: valueOf("#sportInput"),
      card_year: numberOrNull(valueOf("#yearInput")),
      brand: valueOf("#brandInput") || null,
      set_name: valueOf("#setInput") || null,
      card_number: valueOf("#cardNumberInput") || null,
      estimated_value: numberOrNull(valueOf("#valueInput")) ?? 0,
      status: valueOf("#statusInput"),
      wishlist_priority:
        valueOf("#statusInput") === "want"
          ? elements.wishlistPriorityInput.value
          : null,
      wishlist_target_price:
        valueOf("#statusInput") === "want"
          ? numberOrNull(elements.wishlistTargetInput.value)
          : null,
      storage_location: valueOf("#locationInput") || null,
      notes: valueOf("#notesInput") || null,
      is_rookie: elements.rookieInput.checked,
      is_autograph: elements.autographInput.checked,
      is_memorabilia: elements.memorabiliaInput.checked,
      is_numbered: elements.numberedInput.checked,
      serial_number: numberOrNull(elements.serialNumberInput.value),
      print_run: numberOrNull(elements.printRunInput.value),
      parallel_name: elements.parallelInput.value.trim() || null,
      quantity: Math.max(1, numberOrNull(elements.quantityInput.value) || 1),
      card_condition: elements.conditionInput.value,
      grading_company:
        elements.conditionInput.value === "graded"
          ? elements.gradingCompanyInput.value || null
          : null,
      grade:
        elements.conditionInput.value === "graded"
          ? elements.gradeInput.value.trim() || null
          : null,
      purchase_price: numberOrNull(elements.purchasePriceInput.value),
      purchase_date: elements.purchaseDateInput.value || null,
      front_photo_path: frontPhotoPath,
      back_photo_path: backPhotoPath
    };

    let error;
    let savedCard = null;

    if (editingCard) {
      setCardMessage("Updating card...");
      const result = await supabase
        .from("cards")
        .update(payload)
        .eq("id", editingCard.id)
        .eq("collection_id", currentCollectionId)
        .select("*")
        .single();

      error = result.error;
      savedCard = result.data;
    } else {
      setCardMessage("Saving card...");
      const result = await supabase
        .from("cards")
        .insert(payload)
        .select("*")
        .single();

      error = result.error;
      savedCard = result.data;
    }

    if (error) throw error;

    if (!savedCard?.id) {
      throw new Error(
        "The database did not return the saved card. The save could not be verified."
      );
    }

    console.info("Rookie Vault verified database save:", {
      id: savedCard.id,
      player_name: savedCard.player_name,
      collection_id: savedCard.collection_id,
      status: savedCard.status,
      created_at: savedCard.created_at
    });

    if (oldPathsToDelete.length) {
      const { error: cleanupError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .remove(oldPathsToDelete);

      if (cleanupError) {
        console.error("Old photo cleanup failed:", cleanupError);
      }
    }

    const wasEditing = Boolean(editingCard);
    const savedCardId = savedCard.id;

    resetCardForm();
    await loadCards();

    const verifiedCard = cards.find(card => card.id === savedCardId);

    if (!verifiedCard) {
      throw new Error(
        "The card was saved, but it did not appear when the collection reloaded. Please refresh once and check again."
      );
    }

    clearCollectionFilters();
    navigateTo("collection");

    setCardMessage(
      wasEditing
        ? `${verifiedCard.player_name} was updated and verified in the collection.`
        : `${verifiedCard.player_name} was saved and verified in the collection.`
    );

    window.setTimeout(() => {
      openCardDialog(verifiedCard);
    }, 250);
  } catch (error) {
    console.error("Card save failed:", error);
    setCardMessage(error?.message || "Could not save the card.");

    if (uploadedPaths.length) {
      const { error: cleanupError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .remove(uploadedPaths);

      if (cleanupError) {
        console.error("Could not clean up new photos:", cleanupError);
      }
    }
  } finally {
    setSavingState(false);
  }
}

async function uploadCardPhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error("Photo must be an image.");

  const compressedBlob = await resizeImage(file, MAX_IMAGE_EDGE, JPEG_QUALITY);
  const path = `${currentUserId}/${currentCollectionId}/${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, compressedBlob, {
      cacheControl: "3600",
      contentType: "image/jpeg",
      upsert: false
    });

  if (error) throw error;
  return path;
}

async function resizeImage(file, maxEdge, quality) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) return reject(new Error("Could not prepare the photo."));
      resolve(blob);
    }, "image/jpeg", quality);
  });
}

function previewSelectedPhoto(input, imageElement) {
  const file = input.files?.[0];

  if (!file) {
    imageElement.removeAttribute("src");
    imageElement.classList.add("hidden");
    return;
  }

  if (!file.type.startsWith("image/")) {
    input.value = "";
    setCardMessage("Please choose an image file.");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  previewObjectUrls.push(objectUrl);
  imageElement.src = objectUrl;
  imageElement.classList.remove("hidden");
}








function updateWishlistFields() {
  const isWishlist = document.querySelector("#statusInput").value === "want";
  elements.wishlistPriorityLabel.classList.toggle("hidden", !isWishlist);
  elements.wishlistTargetLabel.classList.toggle("hidden", !isWishlist);
}

function enterCardShowMode() {
  document.body.classList.add("show-mode-active");
  navigateTo("show");
}

function exitCardShowMode() {
  document.body.classList.remove("show-mode-active");
  navigateTo("home");
}

function renderCardShowMode() {
  const activeCards = cards.filter(card => !card.deleted_at);
  const query = elements.showModeSearchInput.value.trim().toLowerCase();

  elements.showTradeCount.textContent =
    activeCards.filter(card => card.status === "trade").length;
  elements.showDuplicateCount.textContent =
    activeCards.filter(card =>
      card.status === "duplicate" || Number(card.quantity || 1) > 1
    ).length;
  elements.showWishlistCount.textContent =
    activeCards.filter(card => card.status === "want").length;
  elements.showHighValueCount.textContent =
    activeCards.filter(card => Number(card.estimated_value || 0) >= 50).length;

  const filtered = activeCards.filter(card => {
    const matchesFilter =
      activeShowFilter === "all" ||
      (activeShowFilter === "trade" && card.status === "trade") ||
      (activeShowFilter === "duplicate" &&
        (card.status === "duplicate" || Number(card.quantity || 1) > 1)) ||
      (activeShowFilter === "want" && card.status === "want") ||
      (activeShowFilter === "high-value" &&
        Number(card.estimated_value || 0) >= 50);

    const haystack = [
      card.player_name,
      card.card_year,
      card.brand,
      card.set_name,
      card.card_number,
      card.parallel_name,
      card.sport,
      card.status,
      card.grading_company,
      card.grade
    ].filter(Boolean).join(" ").toLowerCase();

    return matchesFilter && haystack.includes(query);
  });

  elements.showModeGrid.replaceChildren();

  for (const card of filtered) {
    const article = document.createElement("article");
    article.className = "show-card";
    article.tabIndex = 0;
    article.setAttribute("role", "button");

    const photo = document.createElement("div");
    photo.className = "show-card-photo";

    if (card.front_photo_url) {
      const image = document.createElement("img");
      image.src = card.front_photo_url;
      image.alt = `Front of ${card.player_name}`;
      photo.append(image);
    } else {
      photo.textContent = "No photo";
    }

    const info = document.createElement("div");
    info.className = "show-card-info";

    const title = document.createElement("h3");
    title.textContent = card.player_name;

    const meta = document.createElement("div");
    meta.className = "show-card-meta";
    meta.textContent = [
      card.card_year,
      card.brand,
      card.set_name,
      card.card_number ? `#${card.card_number}` : null
    ].filter(Boolean).join(" • ");

    const footer = document.createElement("div");
    footer.className = "show-card-footer";

    const status = document.createElement("span");
    status.textContent = titleCase(card.status || "keep");

    const value = document.createElement("span");
    value.textContent = currency(
      Number(card.estimated_value || 0) *
      Math.max(1, Number(card.quantity || 1))
    );

    footer.append(status, value);
    info.append(title, meta);

    if (card.status === "want") {
      const priority = document.createElement("span");
      priority.className =
        `show-priority ${card.wishlist_priority || "medium"}`;
      priority.textContent =
        `${titleCase(card.wishlist_priority || "medium")} priority` +
        (card.wishlist_target_price !== null && card.wishlist_target_price !== undefined
          ? ` • target ${currency(card.wishlist_target_price)}`
          : "");
      info.append(priority);
    }

    info.append(footer);
    article.append(photo, info);

    article.addEventListener("click", () => openCardDialog(card));
    article.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCardDialog(card);
      }
    });

    elements.showModeGrid.append(article);
  }

  elements.showModeEmpty.classList.toggle("hidden", filtered.length > 0);
}

async function loadSetGoals() {
  if (!currentCollectionId) {
    setGoals = [];
    renderSetGoals();
    renderHomeSetProgress();
    return;
  }

  const { data, error } = await supabase
    .from("set_goals")
    .select("*")
    .eq("collection_id", currentCollectionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Set goals loading failed:", error);
    elements.setGoalMessage.textContent = "Could not load set goals.";
    return;
  }

  setGoals = data || [];
  renderSetGoals();
  renderHomeSetProgress();
}

function calculateSetProgress(goal) {
  const ownedNumbers = new Set();

  for (const card of cards) {
    if (card.deleted_at) continue;

    const matchesYear = String(card.card_year || "") === String(goal.card_year);
    const matchesBrand =
      normalizeMatchText(card.brand) === normalizeMatchText(goal.brand);
    const matchesSet =
      normalizeMatchText(card.set_name) === normalizeMatchText(goal.set_name);

    if (!matchesYear || !matchesBrand || !matchesSet) continue;

    const parsedNumber = parseNumericCardNumber(card.card_number);
    if (parsedNumber === null) continue;

    const start = Number(goal.start_number || 1);
    const end = start + Number(goal.total_cards || 0) - 1;

    if (parsedNumber >= start && parsedNumber <= end) {
      ownedNumbers.add(parsedNumber);
    }
  }

  const start = Number(goal.start_number || 1);
  const total = Number(goal.total_cards || 0);
  const allNumbers = Array.from({ length: total }, (_, index) => start + index);
  const missingNumbers = allNumbers.filter(number => !ownedNumbers.has(number));
  const percent = total > 0
    ? Math.round((ownedNumbers.size / total) * 100)
    : 0;

  return {
    ownedNumbers: [...ownedNumbers].sort((a, b) => a - b),
    missingNumbers,
    ownedCount: ownedNumbers.size,
    total,
    percent
  };
}

function parseNumericCardNumber(value) {
  const match = String(value || "").match(/(\d{1,5})/);
  return match ? Number(match[1]) : null;
}

function renderHomeSetProgress() {
  elements.homeSetProgressGrid.replaceChildren();

  for (const goal of setGoals.slice(0, 3)) {
    const progress = calculateSetProgress(goal);
    const article = buildSetGoalCard(goal, progress, true);
    elements.homeSetProgressGrid.append(article);
  }

  elements.homeSetEmpty.classList.toggle("hidden", setGoals.length > 0);
}

function renderSetGoals() {
  elements.setGoalsGrid.replaceChildren();

  for (const goal of setGoals) {
    const progress = calculateSetProgress(goal);
    elements.setGoalsGrid.append(buildSetGoalCard(goal, progress, false));
  }

  elements.setGoalsEmpty.classList.toggle("hidden", setGoals.length > 0);
}

function buildSetGoalCard(goal, progress, compact) {
  const article = document.createElement("article");
  article.className = compact ? "home-set-card" : "set-goal-card";

  if (progress.percent === 100) {
    article.classList.add("complete");
  }

  const title = document.createElement("h3");
  title.textContent = goal.name;

  const meta = document.createElement("p");
  meta.textContent = `${goal.card_year} • ${goal.brand} • ${goal.set_name}`;

  const track = document.createElement("div");
  track.className = "mini-progress-track";

  const bar = document.createElement("div");
  bar.className = "mini-progress-bar";
  bar.style.width = `${progress.percent}%`;
  track.append(bar);

  const footer = document.createElement("div");
  footer.className = compact ? "home-set-footer" : "set-goal-footer";

  const owned = document.createElement("span");
  owned.textContent = `${progress.ownedCount} / ${progress.total}`;

  const percent = document.createElement("span");
  percent.textContent = `${progress.percent}%`;

  footer.append(owned, percent);
  article.append(title, meta, track, footer);
  article.tabIndex = 0;
  article.setAttribute("role", "button");

  article.addEventListener("click", () => openSetDialog(goal));
  article.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSetDialog(goal);
    }
  });

  return article;
}

function openSetGoalForm(goal = null) {
  elements.setGoalForm.classList.remove("hidden");
  elements.setGoalMessage.textContent = "";

  if (goal) {
    elements.setGoalIdInput.value = goal.id;
    elements.setGoalNameInput.value = goal.name;
    elements.setGoalYearInput.value = goal.card_year;
    elements.setGoalBrandInput.value = goal.brand;
    elements.setGoalSetInput.value = goal.set_name;
    elements.setGoalTotalInput.value = goal.total_cards;
    elements.setGoalStartInput.value = goal.start_number || 1;
    elements.saveSetGoalButton.textContent = "Update set goal";
  } else {
    elements.setGoalForm.reset();
    elements.setGoalIdInput.value = "";
    elements.setGoalStartInput.value = "1";
    elements.saveSetGoalButton.textContent = "Save set goal";
  }

  elements.setGoalForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeSetGoalForm() {
  elements.setGoalForm.reset();
  elements.setGoalIdInput.value = "";
  elements.setGoalStartInput.value = "1";
  elements.setGoalForm.classList.add("hidden");
  elements.setGoalMessage.textContent = "";
}

async function saveSetGoal(event) {
  event.preventDefault();

  const id = elements.setGoalIdInput.value;
  const payload = {
    collection_id: currentCollectionId,
    name: elements.setGoalNameInput.value.trim(),
    card_year: Number(elements.setGoalYearInput.value),
    brand: elements.setGoalBrandInput.value.trim(),
    set_name: elements.setGoalSetInput.value.trim(),
    total_cards: Number(elements.setGoalTotalInput.value),
    start_number: Number(elements.setGoalStartInput.value || 1)
  };

  elements.saveSetGoalButton.disabled = true;
  elements.saveSetGoalButton.textContent = id ? "Updating..." : "Saving...";

  let error;

  if (id) {
    ({ error } = await supabase
      .from("set_goals")
      .update(payload)
      .eq("id", id)
      .eq("collection_id", currentCollectionId));
  } else {
    ({ error } = await supabase.from("set_goals").insert(payload));
  }

  elements.saveSetGoalButton.disabled = false;

  if (error) {
    console.error("Set goal save failed:", error);
    elements.setGoalMessage.textContent = error.message || "Could not save set goal.";
    elements.saveSetGoalButton.textContent = id ? "Update set goal" : "Save set goal";
    return;
  }

  closeSetGoalForm();
  await loadSetGoals();
  elements.setGoalMessage.textContent = id
    ? "Set goal updated."
    : "Set goal created.";
}

function openSetDialog(goal) {
  selectedSetGoal = goal;
  selectedMissingNumber = null;

  const progress = calculateSetProgress(goal);

  elements.setDetailName.textContent = goal.name;
  elements.setDetailMeta.textContent =
    `${goal.card_year} • ${goal.brand} • ${goal.set_name} • ` +
    `${goal.total_cards} cards`;
  elements.setDetailPercent.textContent = `${progress.percent}%`;
  elements.setDetailOwned.textContent =
    `${progress.ownedCount} / ${progress.total}`;
  elements.setDetailProgressBar.style.width = `${progress.percent}%`;
  elements.missingCardsHeading.textContent =
    `${progress.missingNumbers.length} missing`;

  renderNumberGrid(
    elements.missingNumberGrid,
    progress.missingNumbers,
    true
  );

  renderNumberGrid(
    elements.ownedNumberGrid,
    progress.ownedNumbers,
    false
  );

  elements.setCompleteMessage.classList.toggle(
    "hidden",
    progress.missingNumbers.length > 0
  );

  elements.addMissingCardButton.disabled =
    progress.missingNumbers.length === 0;

  if (progress.missingNumbers.length > 0) {
    selectedMissingNumber = progress.missingNumbers[0];
    highlightSelectedMissingNumber();
  }

  elements.setDialog.showModal();
}

function renderNumberGrid(container, numbers, selectable) {
  container.replaceChildren();

  for (const number of numbers) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "number-chip";
    chip.textContent = String(number);

    if (!selectable) {
      chip.disabled = true;
    } else {
      chip.addEventListener("click", () => {
        selectedMissingNumber = number;
        highlightSelectedMissingNumber();
      });
    }

    container.append(chip);
  }
}

function highlightSelectedMissingNumber() {
  for (const chip of elements.missingNumberGrid.querySelectorAll(".number-chip")) {
    chip.classList.toggle(
      "selected",
      Number(chip.textContent) === Number(selectedMissingNumber)
    );
  }
}

function closeSetDialog() {
  if (elements.setDialog.open) {
    elements.setDialog.close();
  }

  selectedSetGoal = null;
  selectedMissingNumber = null;
}

function editSelectedSetGoal() {
  if (!selectedSetGoal) return;
  const goal = selectedSetGoal;
  closeSetDialog();
  navigateTo("sets");
  openSetGoalForm(goal);
}

async function deleteSelectedSetGoal() {
  if (!selectedSetGoal) return;

  const confirmed = window.confirm(
    `Delete the set goal "${selectedSetGoal.name}"? Cards will not be deleted.`
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("set_goals")
    .delete()
    .eq("id", selectedSetGoal.id)
    .eq("collection_id", currentCollectionId);

  if (error) {
    console.error("Set goal delete failed:", error);
    elements.setGoalMessage.textContent = "Could not delete set goal.";
    return;
  }

  closeSetDialog();
  await loadSetGoals();
}

function addSelectedMissingCard() {
  if (!selectedSetGoal || selectedMissingNumber === null) return;

  document.querySelector("#yearInput").value = selectedSetGoal.card_year;
  document.querySelector("#brandInput").value = selectedSetGoal.brand;
  document.querySelector("#setInput").value = selectedSetGoal.set_name;
  document.querySelector("#cardNumberInput").value = selectedMissingNumber;

  closeSetDialog();
  navigateTo("add");
  setCardMessage(
    `Adding missing card #${selectedMissingNumber} for ${selectedSetGoal?.name || "set goal"}.`
  );
}


function getCardSightApiKey(){return localStorage.getItem(CARDSIGHT_KEY_STORAGE)||""}
function createCardSightClient(){const apiKey=getCardSightApiKey();if(!apiKey)throw new Error("Add a CardSight API key first.");return new CardSightSdk.CardSightAI({apiKey})}
function updateCardSightStatus(){
  const key = getCardSightApiKey();
  elements.cardSightStatusBadge.textContent = key ? "API key saved" : "API key not set";
  elements.cardSightApiKeyInput.value = key;

  if (elements.lookupKeyStatus) {
    elements.lookupKeyStatus.textContent = key
      ? "CardSight ready"
      : "CardSight key required";
  }
}
function saveCardSightKey(){const key=elements.cardSightApiKeyInput.value.trim();if(!key){elements.cardSightMessage.textContent="Paste an API key first.";return}localStorage.setItem(CARDSIGHT_KEY_STORAGE,key);updateCardSightStatus();elements.cardSightSettings.open=false;elements.cardSightMessage.textContent="CardSight key saved on this device."}
function clearCardSightKey(){localStorage.removeItem(CARDSIGHT_KEY_STORAGE);elements.cardSightApiKeyInput.value="";elements.cardSightResults.replaceChildren();selectedCardSightCard=null;updateCardSightStatus();elements.cardSightMessage.textContent="CardSight key removed."}
function requireCardSightKey(){if(getCardSightApiKey())return true;elements.cardSightSettings.open=true;elements.cardSightMessage.textContent="Add a CardSight API key first.";elements.cardSightApiKeyInput.focus();return false}


async function searchCardSightForNewCard(event) {
  event.preventDefault();

  if (!requireCardSightKey()) {
    elements.lookupSearchMessage.textContent =
      "Open CardSight API settings below and save the API key first.";
    return;
  }

  const player = elements.lookupPlayerInput.value.trim();
  const year = elements.lookupYearInput.value.trim();
  const sport = elements.lookupSportInput.value;
  const brand = elements.lookupBrandInput.value.trim();

  if (!player) {
    elements.lookupSearchMessage.textContent =
      "Enter a player name before searching.";
    elements.lookupPlayerInput.focus();
    return;
  }

  const query = [year, brand, player]
    .filter(Boolean)
    .join(" ");

  elements.lookupSearchButton.disabled = true;
  elements.lookupSearchButton.textContent = "Searching...";
  elements.lookupSearchMessage.textContent =
    `Searching CardSight for “${query}”...`;
  elements.lookupResults.replaceChildren();
  elements.lookupResultsEmpty.classList.add("hidden");

  try {
    const client = createCardSightClient();

    const params = {
      q: query,
      type: "card",
      take: 30
    };

    if (sport) {
      params.segment = sport;
    }

    const response = await client.catalog.search(params);
    let results =
      response?.data?.results ||
      (Array.isArray(response?.data) ? response.data : []);

    results = rankLookupResults(results, {
      player,
      year,
      brand
    });

    if (!results.length) {
      elements.lookupResultsEmpty.classList.remove("hidden");
      elements.lookupSearchMessage.textContent =
        "No results were returned. Try only the player name, remove the year, or use a shorter brand/set name.";
      return;
    }

    renderLookupResults(results);
    elements.lookupSearchMessage.textContent =
      `${results.length} possible card${results.length === 1 ? "" : "s"} found. Choose the exact match.`;
  } catch (error) {
    console.error("Search-first CardSight lookup failed:", error);
    elements.lookupSearchMessage.textContent =
      explainLookupError(error);
  } finally {
    elements.lookupSearchButton.disabled = false;
    elements.lookupSearchButton.textContent = "Search CardSight";
  }
}

function rankLookupResults(results, search) {
  const playerText = normalizeLookupText(search.player);
  const brandText = normalizeLookupText(search.brand);
  const yearText = String(search.year || "");

  return [...results]
    .map(item => {
      const searchable = normalizeLookupText([
        item.name,
        item.year,
        item.manufacturer,
        item.releaseName,
        item.setName,
        item.number,
        item.parallel?.name
      ].filter(Boolean).join(" "));

      let score = 0;

      if (playerText && searchable.includes(playerText)) score += 30;
      if (yearText && String(item.year || "") === yearText) score += 20;
      if (brandText && searchable.includes(brandText)) score += 15;
      if (item.id) score += 8;
      if (item.number) score += 4;
      if (item.manufacturer) score += 2;

      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
}

function normalizeLookupText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderLookupResults(results) {
  elements.lookupResults.replaceChildren();

  for (const item of results) {
    const article = document.createElement("article");
    article.className = "lookup-result-card";

    const main = document.createElement("div");
    main.className = "lookup-result-main";

    const title = document.createElement("strong");
    title.textContent = CardSightSdk.formatCardDisplay
      ? CardSightSdk.formatCardDisplay(item)
      : [
          getCardSightYear(item),
          getCardSightBrand(item),
          getCardSightPlayer(item)
        ].filter(Boolean).join(" ");

    const details = document.createElement("span");
    const resultSet = getCardSightSet(item);
    const resultNumber = getCardSightNumber(item);
    const resultParallel = getCardSightParallelName(item);
    const resultPrintRun = getCardSightPrintRun(item);

    details.textContent = [
      resultSet,
      resultNumber ? `#${resultNumber}` : null,
      resultParallel,
      resultPrintRun
        ? `numbered /${resultPrintRun}`
        : null
    ].filter(Boolean).join(" • ") || "Open the match to review full details.";

    const badges = document.createElement("div");
    badges.className = "lookup-result-badges";

    if (item.id) {
      badges.append(buildLookupBadge("Exact catalog card"));
    }

    if (item.year) {
      badges.append(buildLookupBadge(String(item.year)));
    }

    if (item.manufacturer) {
      badges.append(buildLookupBadge(item.manufacturer));
    }

    main.append(title, details, badges);

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "button";
    selectButton.textContent = "Select card";
    selectButton.addEventListener("click", () =>
      selectLookupCardForAdd(item)
    );

    article.append(main, selectButton);
    elements.lookupResults.append(article);
  }
}

function buildLookupBadge(text) {
  const badge = document.createElement("span");
  badge.className = "lookup-result-badge";
  badge.textContent = text;
  return badge;
}

async function selectLookupCardForAdd(item) {
  elements.lookupSearchMessage.textContent =
    "Loading full card details and recent pricing...";

  try {
    const client = createCardSightClient();
    let fullCard = null;

    if (item.id) {
      try {
        const response = await client.catalog.cards.get(item.id);
        fullCard = response?.data || null;
      } catch (error) {
        console.warn(
          "Full card record was unavailable; using the search result.",
          error
        );
      }
    }

    // Important: search results and full card records do not always use
    // the same property names. Keep the search result and merge the full
    // response over it rather than replacing the search result entirely.
    const card = mergeCardSightCardData(item, fullCard);

    resetCardForm();
    populateAddFormFromCardSight(card);

    if (card.id) {
      const estimate = await getCardSightPricingEstimate(card.id);

      if (estimate !== null) {
        document.querySelector("#valueInput").value =
          estimate.toFixed(2);
      }
    }

    navigateTo("add");

    const player =
      getCardSightPlayer(card) ||
      elements.lookupPlayerInput.value.trim() ||
      "selected card";

    setCardMessage(
      `${player} was populated from CardSight. Review the details, then take or choose the front and back photos before saving.`
    );

    window.setTimeout(() => {
      document
        .querySelector(".photo-fieldset")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
    }, 350);
  } catch (error) {
    console.error("Could not select CardSight result:", error);
    elements.lookupSearchMessage.textContent =
      explainLookupError(error);
  }
}

function mergeCardSightCardData(searchItem, fullCard) {
  if (!fullCard) return { ...searchItem };

  return {
    ...searchItem,
    ...fullCard,

    // Preserve useful search-result values when full details omit them.
    id: fullCard.id || searchItem.id,
    name:
      fullCard.name ||
      fullCard.playerName ||
      fullCard.player?.name ||
      searchItem.name ||
      searchItem.playerName ||
      searchItem.player?.name,

    year:
      fullCard.year ??
      fullCard.cardYear ??
      fullCard.releaseYear ??
      fullCard.release?.year ??
      searchItem.year ??
      searchItem.cardYear ??
      searchItem.releaseYear ??
      searchItem.release?.year,

    manufacturer:
      fullCard.manufacturer ||
      fullCard.brand ||
      fullCard.manufacturerName ||
      fullCard.release?.manufacturer ||
      fullCard.release?.brand ||
      searchItem.manufacturer ||
      searchItem.brand ||
      searchItem.manufacturerName ||
      searchItem.release?.manufacturer ||
      searchItem.release?.brand,

    releaseName:
      fullCard.releaseName ||
      fullCard.release?.name ||
      fullCard.productName ||
      searchItem.releaseName ||
      searchItem.release?.name ||
      searchItem.productName,

    setName:
      fullCard.setName ||
      fullCard.set?.name ||
      fullCard.subsetName ||
      searchItem.setName ||
      searchItem.set?.name ||
      searchItem.subsetName,

    number:
      fullCard.number ||
      fullCard.cardNumber ||
      fullCard.card_no ||
      searchItem.number ||
      searchItem.cardNumber ||
      searchItem.card_no,

    parallel: mergeCardSightParallel(
      searchItem.parallel,
      fullCard.parallel,
      searchItem,
      fullCard
    ),

    fields: [
      ...(Array.isArray(searchItem.fields) ? searchItem.fields : []),
      ...(Array.isArray(fullCard.fields) ? fullCard.fields : [])
    ]
  };
}

function mergeCardSightParallel(searchParallel, fullParallel, searchItem, fullCard) {
  const searchName =
    searchParallel?.name ||
    searchItem.parallelName ||
    searchItem.variant ||
    searchItem.variation ||
    searchItem.parallel;

  const fullName =
    fullParallel?.name ||
    fullCard.parallelName ||
    fullCard.variant ||
    fullCard.variation ||
    fullCard.parallel;

  const numberedTo =
    fullParallel?.numberedTo ??
    fullParallel?.printRun ??
    fullCard.numberedTo ??
    fullCard.printRun ??
    fullCard.serialNumberedTo ??
    searchParallel?.numberedTo ??
    searchParallel?.printRun ??
    searchItem.numberedTo ??
    searchItem.printRun ??
    searchItem.serialNumberedTo ??
    null;

  const name =
    typeof fullName === "string"
      ? fullName
      : typeof searchName === "string"
        ? searchName
        : fullParallel?.name ||
          searchParallel?.name ||
          "";

  return {
    ...(typeof searchParallel === "object" && searchParallel
      ? searchParallel
      : {}),
    ...(typeof fullParallel === "object" && fullParallel
      ? fullParallel
      : {}),
    name,
    numberedTo
  };
}

function getCardSightPlayer(card) {
  return (
    card.name ||
    card.playerName ||
    card.player?.name ||
    getCardSightField(card, [
      "player",
      "player name",
      "athlete",
      "athlete name",
      "subject"
    ]) ||
    ""
  );
}

function getCardSightYear(card) {
  return (
    card.year ??
    card.cardYear ??
    card.releaseYear ??
    card.release?.year ??
    getCardSightField(card, [
      "year",
      "card year",
      "release year"
    ]) ??
    ""
  );
}

function getCardSightBrand(card) {
  return (
    card.manufacturer ||
    card.brand ||
    card.manufacturerName ||
    card.release?.manufacturer ||
    card.release?.brand ||
    getCardSightField(card, [
      "manufacturer",
      "brand",
      "company"
    ]) ||
    ""
  );
}

function getCardSightSet(card) {
  return (
    card.setName ||
    card.set?.name ||
    card.releaseName ||
    card.release?.name ||
    card.productName ||
    getCardSightField(card, [
      "set",
      "set name",
      "release",
      "release name",
      "product"
    ]) ||
    ""
  );
}

function getCardSightNumber(card) {
  return (
    card.number ||
    card.cardNumber ||
    card.card_no ||
    getCardSightField(card, [
      "number",
      "card number",
      "card no",
      "card #"
    ]) ||
    ""
  );
}

function getCardSightParallelName(card) {
  const direct =
    card.parallel?.name ||
    card.parallelName ||
    card.variant ||
    card.variation;

  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  return (
    getCardSightField(card, [
      "parallel",
      "parallel name",
      "variant",
      "variation"
    ]) ||
    ""
  );
}

function getCardSightPrintRun(card) {
  const direct =
    card.parallel?.numberedTo ??
    card.parallel?.printRun ??
    card.numberedTo ??
    card.printRun ??
    card.serialNumberedTo;

  if (direct !== null && direct !== undefined && direct !== "") {
    const parsed = Number(direct);
    return Number.isFinite(parsed) ? parsed : "";
  }

  const fieldValue = getCardSightField(card, [
    "numbered to",
    "print run",
    "serial numbered to",
    "serial number"
  ]);

  if (!fieldValue) return "";

  const match = String(fieldValue).match(/\/?\s*(\d{1,6})\b/);
  return match ? Number(match[1]) : "";
}

function getCardSightField(card, keys) {
  const wanted = keys.map(key => normalizeLookupText(key));
  const fields = Array.isArray(card?.fields)
    ? card.fields
    : [];

  for (const field of fields) {
    const fieldKey = normalizeLookupText(
      field?.key ||
      field?.name ||
      field?.label ||
      ""
    );

    if (wanted.includes(fieldKey)) {
      return (
        field?.value ??
        field?.text ??
        field?.displayValue ??
        ""
      );
    }
  }

  return "";
}

function populateAddFormFromCardSight(card) {
  const player = getCardSightPlayer(card);
  const year = getCardSightYear(card);
  const brand = getCardSightBrand(card);
  const setName = getCardSightSet(card);
  const cardNumber = getCardSightNumber(card);
  const parallelName = getCardSightParallelName(card);
  const printRun = getCardSightPrintRun(card);

  document.querySelector("#playerInput").value = player;
  document.querySelector("#yearInput").value = year;
  document.querySelector("#brandInput").value = brand;
  document.querySelector("#setInput").value = setName;
  document.querySelector("#cardNumberInput").value = cardNumber;

  const selectedSport = elements.lookupSportInput.value;

  if (selectedSport) {
    document.querySelector("#sportInput").value =
      titleCase(selectedSport);
  }

  elements.parallelInput.value = parallelName;

  if (printRun) {
    elements.numberedInput.checked = true;
    elements.printRunInput.value = printRun;
  }

  const rookieText = [
    player,
    setName,
    card.releaseName,
    parallelName,
    JSON.stringify(card.fields || "")
  ].filter(Boolean).join(" ");

  elements.rookieInput.checked =
    /\b(RC|ROOKIE)\b/i.test(rookieText);

  updateCollectorFieldVisibility();
}

async function getCardSightPricingEstimate(cardId) {
  try {
    const response = await createCardSightClient().pricing.get(
      cardId,
      {
        period: "1y",
        listing_type: "both"
      }
    );

    return estimateCardSightValue(response?.data);
  } catch (error) {
    console.warn("CardSight pricing lookup was unavailable.", error);
    return null;
  }
}

function explainLookupError(error) {
  const status =
    error?.status ||
    error?.response?.status ||
    null;

  if (status === 401 || status === 403) {
    return "CardSight rejected the saved API key. Run diagnostics or save a current key.";
  }

  if (status === 429) {
    return "The CardSight usage or rate limit has been reached.";
  }

  return error?.message
    ? `CardSight search failed: ${error.message}`
    : "CardSight search failed. Try a shorter search.";
}

async function identifyWithCardSight(){
  if(!requireCardSightKey())return;
  const front=elements.scanFrontInput.files?.[0];
  if(!front){elements.cardSightMessage.textContent="Add a front photo first.";return}
  elements.identifyWithCardSightButton.disabled=true;elements.identifyWithCardSightButton.textContent="Identifying...";elements.cardSightResults.replaceChildren();
  try{
    const client=createCardSightClient();
    const chosen=String(elements.scanSportSuggestion.value||"Baseball").toLowerCase();
    const sports=["baseball","football","basketball","hockey"];
    const order=sports.includes(chosen)?[chosen,...sports.filter(s=>s!==chosen)]:sports;
    let detection=null,segment=null;
    for(const sport of order){
      elements.cardSightMessage.textContent=`Checking ${titleCase(sport)}...`;
      const result=await client.identify.cardBySegment(sport,front);
      const found=CardSightSdk.getHighestConfidenceDetection?CardSightSdk.getHighestConfidenceDetection(result.data):result.data?.detections?.[0];
      if(found?.card?.id||found?.card?.setId){detection=found;segment=sport;break}
    }
    if(!detection){elements.cardSightMessage.textContent="No usable CardSight match. Try catalog search or a clearer photo.";return}
    selectedCardSightCard=detection.card;applyCardSightCardToSuggestions(detection.card,segment);
    elements.scanConfidenceBadge.textContent=`CardSight ${detection.confidence||"match"}`;
    renderCardSightCandidates([detection.card],detection.card.id?"Photo match":"Set-level match");
    elements.cardSightMessage.textContent=detection.card.id?"Exact CardSight match applied. Review every field.":"Set matched; complete the missing card details.";
    if(detection.card.id)await fillCardSightPricing(detection.card.id);
  }catch(error){console.error(error);elements.cardSightMessage.textContent=error?.message||"CardSight identification failed."}
  finally{elements.identifyWithCardSightButton.disabled=false;elements.identifyWithCardSightButton.textContent="Identify front photo"}
}

async function searchCardSightCatalog(query){
  if(!requireCardSightKey())return;
  const q=String(query||"").trim()||buildScanSearchText();
  if(!q){elements.cardSightMessage.textContent="Enter a player/card description or run OCR first.";return}
  elements.searchCardSightButton.disabled=true;elements.searchCardSightButton.textContent="Searching...";elements.cardSightResults.replaceChildren();
  try{
    const client=createCardSightClient(),sport=String(elements.scanSportSuggestion.value||"").toLowerCase();
    const params={q,type:"card",take:12};if(["baseball","football","basketball","hockey"].includes(sport))params.segment=sport;
    const response=await client.catalog.search(params);
    const results=response?.data?.results||(Array.isArray(response?.data)?response.data:[]);
    if(!results.length){elements.cardSightMessage.textContent="No catalog matches. Try fewer words.";return}
    renderCardSightCandidates(results,"Catalog result");elements.cardSightMessage.textContent=`${results.length} possible match${results.length===1?"":"es"} found.`;
  }catch(error){console.error(error);elements.cardSightMessage.textContent=error?.message||"Catalog search failed."}
  finally{elements.searchCardSightButton.disabled=false;elements.searchCardSightButton.textContent="Search catalog"}
}

function renderCardSightCandidates(items,label){
  elements.cardSightResults.replaceChildren();
  for(const item of items){
    const article=document.createElement("article");article.className="cardsight-result";
    const info=document.createElement("div"),title=document.createElement("strong"),meta=document.createElement("span");
    title.textContent=CardSightSdk.formatCardDisplay?CardSightSdk.formatCardDisplay(item):[item.year,item.manufacturer,item.releaseName,item.setName,item.name,item.number?`#${item.number}`:null].filter(Boolean).join(" ");
    meta.textContent=[label,item.parallel?.name,item.parallel?.numberedTo?`/${item.parallel.numberedTo}`:null].filter(Boolean).join(" • ");
    info.append(title,meta);
    const button=document.createElement("button");button.type="button";button.className="button button-secondary";button.textContent="Use match";button.addEventListener("click",()=>selectCardSightCatalogCard(item));
    article.append(info,button);elements.cardSightResults.append(article);
  }
}

async function selectCardSightCatalogCard(item){
  elements.cardSightMessage.textContent="Loading full card details...";
  try{
    let card=item;const client=createCardSightClient();
    if(item.id){try{const full=await client.catalog.cards.get(item.id);if(full?.data)card=full.data}catch(error){console.warn(error)}}
    selectedCardSightCard=card;applyCardSightCardToSuggestions(card);elements.scanConfidenceBadge.textContent="CardSight catalog match";elements.cardSightMessage.textContent="Catalog details applied. Review before saving.";if(card.id)await fillCardSightPricing(card.id);
  }catch(error){console.error(error);elements.cardSightMessage.textContent=error?.message||"Could not load that card."}
}

function applyCardSightCardToSuggestions(card,sportSegment=null){
  if(card.name)elements.scanPlayerSuggestion.value=card.name;if(card.year)elements.scanYearSuggestion.value=card.year;if(card.manufacturer)elements.scanBrandSuggestion.value=card.manufacturer;
  const setValue=card.setName||card.releaseName||"";if(setValue)elements.scanSetSuggestion.value=setValue;if(card.number)elements.scanNumberSuggestion.value=card.number;
  if(card.parallel?.name)elements.scanParallelSuggestion.value=card.parallel.numberedTo?`${card.parallel.name} /${card.parallel.numberedTo}`:card.parallel.name;
  if(sportSegment)elements.scanSportSuggestion.value=titleCase(sportSegment);
  const rookieText=[card.name,card.setName,card.releaseName].filter(Boolean).join(" ");if(/\b(RC|ROOKIE)\b/i.test(rookieText))elements.scanRookieSuggestion.checked=true;
  scanDuplicateCard=findPossibleDuplicate({player:elements.scanPlayerSuggestion.value,year:elements.scanYearSuggestion.value,cardNumber:elements.scanNumberSuggestion.value});updateDuplicateWarning();
  elements.scanResults.classList.remove("hidden");elements.scanPlaceholder.classList.add("hidden");
}

async function fillCardSightPricing(cardId){
  elements.cardSightMessage.textContent="Looking up recent sales...";
  try{
    const response=await createCardSightClient().pricing.get(cardId,{period:"1y",listing_type:"both"});
    const estimate=estimateCardSightValue(response?.data);
    if(estimate===null){elements.cardSightMessage.textContent="Card matched, but no usable recent-sales estimate was returned.";return}
    elements.scanValueSuggestion.value=estimate.toFixed(2);elements.cardSightMessage.textContent=`Suggested value ${currency(estimate)} added from recent sales. Review before saving.`;
  }catch(error){console.warn(error);elements.cardSightMessage.textContent="Card matched. Pricing was unavailable; use the existing research links."}
}
function estimateCardSightValue(data){
  if(!data)return null;const prices=(data.raw?.records||data.records||[]).map(r=>Number(r.price)).filter(Number.isFinite);
  if(prices.length)return robustPriceAverage(prices);
  const graded=[];for(const company of data.graded||[])for(const grade of company.grades||[])for(const record of grade.records||[]){const price=Number(record.price);if(Number.isFinite(price))graded.push(price)}
  return graded.length?robustPriceAverage(graded):null;
}
function robustPriceAverage(prices){const sorted=[...prices].sort((a,b)=>a-b),trimmed=sorted.length>=5?sorted.slice(1,-1):sorted;return trimmed.reduce((s,p)=>s+p,0)/trimmed.length}

function previewScanPhoto(input, preview) {
  const file = input.files?.[0];
  if (!file) { preview.removeAttribute("src"); preview.classList.add("hidden"); return; }
  if (!file.type.startsWith("image/")) { input.value=""; elements.scanMessage.textContent="Please choose an image file."; return; }
  const url=URL.createObjectURL(file); scanPreviewUrls.push(url); preview.src=url; preview.classList.remove("hidden");
}

async function analyzeScannedCard() {
  const front=elements.scanFrontInput.files?.[0], back=elements.scanBackInput.files?.[0];
  if (!front && !back) { elements.scanMessage.textContent="Add at least one card photo."; return; }
  elements.analyzeCardButton.disabled=true; elements.analyzeCardButton.textContent="Analyzing...";
  elements.scanProgressWrap.classList.remove("hidden"); elements.scanResults.classList.add("hidden"); elements.scanPlaceholder.classList.add("hidden");
  setScanProgress(2,"Loading text-recognition engine...");
  try {
    scanOcrWorker=await createWorker("eng",1,{logger:m=>{if(m.status==="recognizing text")setScanProgress(15+Math.round((m.progress||0)*70),`Reading card text... ${Math.round((m.progress||0)*100)}%`)}});
    let frontText="",backText="";
    if(front){setScanProgress(10,"Preparing front photo...");frontText = await recognizeBestText(front, "front")}
    if(back){setScanProgress(front?55:10,"Preparing back photo...");backText = await recognizeBestText(back, "back")}
    setScanProgress(94,"Building suggestions...");
    populateScanSuggestions(parseCardText(frontText,backText),frontText,backText);
    setScanProgress(100,"Analysis complete."); setTimeout(()=>elements.scanProgressWrap.classList.add("hidden"),700);
  } catch(error) {
    console.error("Scan failed:",error); elements.scanMessage.textContent="Scan failed. Try a closer photo with less glare.";
    elements.scanPlaceholder.classList.remove("hidden"); elements.scanProgressWrap.classList.add("hidden");
  } finally {
    if(scanOcrWorker){await scanOcrWorker.terminate().catch(()=>{});scanOcrWorker=null}
    elements.analyzeCardButton.disabled=false;elements.analyzeCardButton.textContent="Analyze card";
  }
}

async function prepareOcrImage(file, mode = "contrast") {
  const bitmap = await createImageBitmap(file);
  const max = 1800;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (mode === "contrast") {
    ctx.filter = "grayscale(1) contrast(1.45) brightness(1.08)";
  } else {
    ctx.filter = "contrast(1.12) saturate(.85)";
  }

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas;
}


async function recognizeBestText(file, label) {
  const variants = [
    ["contrast", "high contrast"],
    ["natural", "natural color"]
  ];

  let best = { text: "", score: -1 };

  for (let index = 0; index < variants.length; index += 1) {
    const [mode, description] = variants[index];
    setScanProgress(
      12 + index * 30,
      `Reading ${label} using ${description}...`
    );

    const image = await prepareOcrImage(file, mode);
    const result = await scanOcrWorker.recognize(image);
    const text = result.data.text || "";
    const score = scoreOcrText(text);

    if (score > best.score) {
      best = { text, score };
    }
  }

  return best.text;
}

function scoreOcrText(text) {
  const normalized = String(text || "");
  let score = normalized.replace(/\s/g, "").length * 0.05;

  if (/\b(19[5-9]\d|20[0-3]\d)\b/.test(normalized)) score += 8;
  if (/\b(TOPPS|PANINI|BOWMAN|UPPER\s+DECK|DONRUSS|FLEER|LEAF)\b/i.test(normalized)) score += 8;
  if (/(?:CARD\s*(?:NO|NUMBER|#)?\.?\s*|NO\.?\s*|#\s*)[A-Z]{0,4}-?\d{1,4}/i.test(normalized)) score += 10;
  if (/\b(RC|ROOKIE)\b/i.test(normalized)) score += 3;
  if (normalized.split(/\s+/).filter(Boolean).length >= 8) score += 5;

  return score;
}

function parseCardText(frontText,backText) {
  const text=`${frontText}\n${backText}`.replace(/\r/g,"\n"), upper=text.toUpperCase();
  const lines=text.split("\n").map(x=>x.replace(/\s+/g," ").trim()).filter(x=>x.length>=2);
  const years=[...text.matchAll(/\b(19[5-9]\d|20[0-3]\d)\b/g)].map(m=>+m[1]).filter(y=>y<=new Date().getFullYear()+1);
  const year=years.length?Math.max(...years):"";
  const find=(pairs)=>pairs.find(([,r])=>r.test(text))?.[0]||"";
  const brand=find([["Topps",/\bTOPPS\b/i],["Panini",/\bPANINI\b/i],["Upper Deck",/\bUPPER\s+DECK\b/i],["Bowman",/\bBOWMAN\b/i],["Donruss",/\bDONRUSS\b/i],["Fleer",/\bFLEER\b/i],["Leaf",/\bLEAF\b/i],["Score",/\bSCORE\b/i],["Prestige",/\bPRESTIGE\b/i]]);
  const setName=find([["Chrome",/\bCHROME\b/i],["Prizm",/\bPRIZM\b/i],["Mosaic",/\bMOSAIC\b/i],["Select",/\bSELECT\b/i],["Heritage",/\bHERITAGE\b/i],["Optic",/\bOPTIC\b/i],["Stadium Club",/\bSTADIUM\s+CLUB\b/i],["Series 1",/\bSERIES\s+1\b/i],["Series 2",/\bSERIES\s+2\b/i],["Prestige",/\bPRESTIGE\b/i],["Heroes",/\bHEROES\b/i],["Contenders",/\bCONTENDERS\b/i]]);
  const numberPatterns = [
    /(?:CARD\s*(?:NO|NUMBER|#)?\.?\s*|NO\.?\s*|#\s*)([A-Z]{0,5}-?\d{1,5})\b/i,
    /\b(?:CARD\s*)?([A-Z]{1,5}-\d{1,5})\b/i,
    /\b([A-Z]{0,3}\d{1,4})\s*\/\s*\d{1,4}\b/i
  ];
  let num = "";
  for (const pattern of numberPatterns) {
    const match = text.match(pattern);
    if (match) {
      num = match[1];
      break;
    }
  }
  const parallel=find([["Silver",/\bSILVER\b/i],["Gold",/\bGOLD\b/i],["Refractor",/\bREFRACTOR\b/i],["Holo",/\bHOLO\b/i],["Blue",/\bBLUE\b/i],["Red",/\bRED\b/i],["Green",/\bGREEN\b/i],["Purple",/\bPURPLE\b/i]]);
  const sport=detectSport(upper), rookie=/\b(RC|ROOKIE)\b/i.test(text);
  const reject=/TOPPS|PANINI|BOWMAN|CHROME|PRIZM|MOSAIC|SELECT|BASEBALL|BASKETBALL|FOOTBALL|HOCKEY|SOCCER|ROOKIE|CARD|COPYRIGHT|AUTHENTIC/i;
  const candidates=lines.filter(x=>/^[A-Za-z][A-Za-z .'-]{4,35}$/.test(x)&&!reject.test(x)&&!/\b(19|20)\d{2}\b/.test(x))
    .map(x=>({x,s:(x.split(" ").length>=2&&x.split(" ").length<=4?3:0)+(frontText.toUpperCase().includes(x.toUpperCase())?2:0)+(x===x.toUpperCase()?1:0)})).sort((a,b)=>b.s-a.s);
  const player=(candidates[0]?.x||"").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
  const points=(player?3:0)+(year?2:0)+(brand?2:0)+(setName?1:0)+(num?2:0);
  return {player,year,brand,setName,cardNumber:num,sport,parallel,rookie,confidence:points>=8?"High confidence":points>=5?"Medium confidence":"Low confidence"};
}

function detectSport(t) {
  if(/BASEBALL|MLB|PITCHER|BATTING/.test(t))return"Baseball";
  if(/BASKETBALL|NBA|REBOUNDS|GUARD/.test(t))return"Basketball";
  if(/FOOTBALL|NFL|QUARTERBACK|TOUCHDOWN/.test(t))return"Football";
  if(/HOCKEY|NHL|GOALTENDER/.test(t))return"Hockey";
  if(/SOCCER|FIFA|MIDFIELDER|STRIKER/.test(t))return"Soccer";
  return"Other";
}

function populateScanSuggestions(s,frontText,backText) {
  elements.scanPlayerSuggestion.value=s.player;elements.scanYearSuggestion.value=s.year;elements.scanBrandSuggestion.value=s.brand;elements.scanSetSuggestion.value=s.setName;
  elements.scanNumberSuggestion.value=s.cardNumber;elements.scanSportSuggestion.value=s.sport;elements.scanParallelSuggestion.value=s.parallel;elements.scanRookieSuggestion.checked=s.rookie;
  elements.scanFrontText.textContent=frontText.trim()||"No front text read.";elements.scanBackText.textContent=backText.trim()||"No back text read.";elements.scanConfidenceBadge.textContent=s.confidence;
  scanDuplicateCard=findPossibleDuplicate(s);updateDuplicateWarning();elements.scanResults.classList.remove("hidden");elements.scanPlaceholder.classList.add("hidden");
}

function findPossibleDuplicate(s) {
  const p=normalizeMatchText(s.player),n=normalizeMatchText(s.cardNumber),y=String(s.year||"");if(!p)return null;
  return cards.find(c=>!c.deleted_at&&normalizeMatchText(c.player_name)===p&&(!y||String(c.card_year||"")===y)&&(!n||normalizeMatchText(c.card_number)===n))||null;
}
function normalizeMatchText(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]/g,"")}
function updateDuplicateWarning(){elements.duplicateWarning.classList.toggle("hidden",!scanDuplicateCard);if(scanDuplicateCard)elements.duplicateWarningText.textContent=`${scanDuplicateCard.player_name} is already saved with quantity ${scanDuplicateCard.quantity||1}${scanDuplicateCard.storage_location?` in ${scanDuplicateCard.storage_location}`:""}.`}

async function increaseDuplicateQuantity() {
  if(!scanDuplicateCard)return;const quantity=Math.max(1,+scanDuplicateCard.quantity||1)+1;
  const {data,error}=await supabase.from("cards").update({quantity}).eq("id",scanDuplicateCard.id).eq("collection_id",currentCollectionId).select("*").single();
  if(error){elements.scanMessage.textContent="Could not increase quantity.";return}
  const i=cards.findIndex(c=>c.id===data.id);cards[i]={...data,front_photo_url:scanDuplicateCard.front_photo_url,back_photo_url:scanDuplicateCard.back_photo_url};scanDuplicateCard=cards[i];updateDuplicateWarning();renderCards();elements.scanMessage.textContent=`Quantity increased to ${quantity}.`;
}

function applyScanSuggestions() {
  document.querySelector("#playerInput").value=elements.scanPlayerSuggestion.value.trim();document.querySelector("#yearInput").value=elements.scanYearSuggestion.value.trim();
  document.querySelector("#brandInput").value=elements.scanBrandSuggestion.value.trim();document.querySelector("#setInput").value=elements.scanSetSuggestion.value.trim();
  document.querySelector("#cardNumberInput").value=elements.scanNumberSuggestion.value.trim();document.querySelector("#sportInput").value=elements.scanSportSuggestion.value;
  elements.parallelInput.value=elements.scanParallelSuggestion.value.trim();elements.rookieInput.checked=elements.scanRookieSuggestion.checked;if(elements.scanValueSuggestion.value!==""){document.querySelector("#valueInput").value=elements.scanValueSuggestion.value;}
  transferScanFile(elements.scanFrontInput,elements.frontPhotoInput,elements.frontPreview);transferScanFile(elements.scanBackInput,elements.backPhotoInput,elements.backPreview);
  navigateTo("add");setCardMessage("Scan suggestions applied. Review every field before saving.");
}
function transferScanFile(source,target,preview){const file=source.files?.[0];if(!file)return;const dt=new DataTransfer();dt.items.add(file);target.files=dt.files;previewSelectedPhoto(target,preview)}
function openScanPricingSearch(){const q=[elements.scanYearSuggestion.value,elements.scanBrandSuggestion.value,elements.scanSetSuggestion.value,elements.scanPlayerSuggestion.value,elements.scanNumberSuggestion.value?`#${elements.scanNumberSuggestion.value}`:"",elements.scanParallelSuggestion.value,elements.scanRookieSuggestion.checked?"rookie RC":""].filter(Boolean).join(" ");if(!q){elements.scanMessage.textContent="Not enough details to search.";return}window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&LH_Complete=1&LH_Sold=1`,"_blank","noopener,noreferrer")}
function resetScanAssistant(){elements.scanFrontInput.value="";elements.scanBackInput.value="";scanPreviewUrls.forEach(URL.revokeObjectURL);scanPreviewUrls=[];[elements.scanFrontPreview,elements.scanBackPreview].forEach(p=>{p.removeAttribute("src");p.classList.add("hidden")});[elements.scanPlayerSuggestion,elements.scanYearSuggestion,elements.scanBrandSuggestion,elements.scanSetSuggestion,elements.scanNumberSuggestion,elements.scanParallelSuggestion,elements.scanValueSuggestion].forEach(i=>i.value="");elements.scanSportSuggestion.value="Other";elements.scanRookieSuggestion.checked=false;elements.scanResults.classList.add("hidden");elements.scanPlaceholder.classList.remove("hidden");elements.scanProgressWrap.classList.add("hidden");elements.scanMessage.textContent="";elements.cardSightMessage.textContent="";elements.cardSightResults.replaceChildren();elements.cardSightSearchInput.value="";selectedCardSightCard=null;scanDuplicateCard=null;updateDuplicateWarning()}
function setScanProgress(p,m){elements.scanProgressBar.style.width=`${Math.max(0,Math.min(100,p))}%`;elements.scanProgressText.textContent=m}

function renderTradeBuilder() {
  const activeCards = cards.filter(card => !card.deleted_at);
  const query = elements.tradeSearchInput.value.trim().toLowerCase();

  const filtered = activeCards.filter(card => {
    const haystack = [
      card.player_name,
      card.sport,
      card.brand,
      card.set_name,
      card.card_number,
      card.parallel_name,
      card.grade,
      card.grading_company
    ].filter(Boolean).join(" ").toLowerCase();

    return haystack.includes(query);
  });

  elements.tradeCollectionGrid.replaceChildren();

  for (const card of filtered) {
    const selected = myTradeCardIds.has(card.id);

    const article = document.createElement("article");
    article.className = `trade-select-card${selected ? " selected" : ""}`;

    const thumb = document.createElement("div");
    thumb.className = "trade-thumb";

    if (card.front_photo_url) {
      const image = document.createElement("img");
      image.src = card.front_photo_url;
      image.alt = `Front of ${card.player_name}`;
      thumb.append(image);
    } else {
      thumb.textContent = "No photo";
    }

    const info = document.createElement("div");
    info.className = "trade-select-info";

    const name = document.createElement("strong");
    name.textContent = card.player_name;

    const meta = document.createElement("span");
    meta.textContent = [
      card.card_year,
      card.brand,
      card.set_name,
      card.card_number ? `#${card.card_number}` : null
    ].filter(Boolean).join(" • ");

    info.append(name, meta);

    const actions = document.createElement("div");
    actions.className = "trade-select-actions";

    const value = document.createElement("strong");
    value.textContent = currency(tradeCardTotal(card));

    const button = document.createElement("button");
    button.className = "trade-toggle-button";
    button.type = "button";
    button.textContent = selected ? "Remove" : "Add";
    button.addEventListener("click", () => toggleMyTradeCard(card.id));

    actions.append(value, button);
    article.append(thumb, info, actions);
    elements.tradeCollectionGrid.append(article);
  }

  elements.tradeCollectionEmpty.classList.toggle("hidden", filtered.length > 0);
  renderOtherTradeItems();
  updateTradeSummary();
}

function toggleMyTradeCard(cardId) {
  if (myTradeCardIds.has(cardId)) {
    myTradeCardIds.delete(cardId);
  } else {
    myTradeCardIds.add(cardId);
  }

  renderTradeBuilder();
}

function addOtherTradeItem(event) {
  event.preventDefault();

  const name = elements.otherTradeNameInput.value.trim();
  const value = Number(elements.otherTradeValueInput.value || 0);
  const quantity = Math.max(1, Number(elements.otherTradeQtyInput.value || 1));

  if (!name || !Number.isFinite(value) || value < 0) return;

  otherTradeItems.push({
    id: crypto.randomUUID(),
    name,
    value,
    quantity
  });

  elements.otherTradeForm.reset();
  elements.otherTradeQtyInput.value = "1";
  renderTradeBuilder();
}

function renderOtherTradeItems() {
  elements.otherTradeList.replaceChildren();

  for (const item of otherTradeItems) {
    const article = document.createElement("article");
    article.className = "other-trade-item";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name;

    const meta = document.createElement("span");
    meta.textContent = `${item.quantity} × ${currency(item.value)}`;

    info.append(name, meta);

    const total = document.createElement("strong");
    total.textContent = currency(item.value * item.quantity);

    const remove = document.createElement("button");
    remove.className = "remove-trade-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      otherTradeItems = otherTradeItems.filter(entry => entry.id !== item.id);
      renderTradeBuilder();
    });

    article.append(info, total, remove);
    elements.otherTradeList.append(article);
  }

  elements.otherTradeEmpty.classList.toggle("hidden", otherTradeItems.length > 0);
}

function updateTradeSummary() {
  const myCards = cards.filter(
    card => !card.deleted_at && myTradeCardIds.has(card.id)
  );

  const myTotal = myCards.reduce(
    (sum, card) => sum + tradeCardTotal(card),
    0
  );

  const theirTotal = otherTradeItems.reduce(
    (sum, item) => sum + item.value * item.quantity,
    0
  );

  const difference = theirTotal - myTotal;
  const absoluteDifference = Math.abs(difference);
  const comparisonBase = Math.max(myTotal, theirTotal, 1);
  const percentDifference = absoluteDifference / comparisonBase;

  elements.myTradeTotal.textContent = currency(myTotal);
  elements.theirTradeTotal.textContent = currency(theirTotal);
  elements.myTradeCount.textContent = countLabel(
    myCards.reduce((sum, card) => sum + Math.max(1, Number(card.quantity || 1)), 0)
  );
  elements.theirTradeCount.textContent = countLabel(
    otherTradeItems.reduce((sum, item) => sum + item.quantity, 0)
  );

  elements.tradeDifference.textContent =
    `${currency(absoluteDifference)} difference`;

  if (myTotal <= 0 || theirTotal <= 0) {
    elements.tradeRating.textContent = "Add cards";
    elements.tradeAdvice.textContent =
      "Add at least one valued card to each side before judging the trade.";
    return;
  }

  if (percentDifference <= 0.05) {
    elements.tradeRating.textContent = "Very fair";
    elements.tradeAdvice.textContent =
      "The estimated values are within about 5%. Review condition, rarity, demand, and personal preference before agreeing.";
  } else if (percentDifference <= 0.12) {
    elements.tradeRating.textContent = "Close trade";
    elements.tradeAdvice.textContent =
      difference > 0
        ? "The other side is slightly higher by estimated value. This may be favorable for Brenton, but verify grades and recent sales."
        : "Brenton's side is slightly higher by estimated value. A small additional card or cash could balance the trade.";
  } else if (percentDifference <= 0.25) {
    elements.tradeRating.textContent = "Uneven";
    elements.tradeAdvice.textContent =
      difference > 0
        ? "The other side is meaningfully higher by estimated value. Double-check that all incoming cards and conditions are entered correctly."
        : "Brenton's side is meaningfully higher by estimated value. Consider asking for another card or cash.";
  } else {
    elements.tradeRating.textContent = "Very uneven";
    elements.tradeAdvice.textContent =
      difference > 0
        ? "The other side is far higher by estimated value. This may indicate missing information or a highly favorable offer."
        : "Brenton's side is far higher by estimated value. Do not proceed without reviewing recent comparable sales and condition.";
  }
}

function tradeCardTotal(card) {
  return Number(card.estimated_value || 0) *
    Math.max(1, Number(card.quantity || 1));
}

function countLabel(count) {
  return `${count} ${count === 1 ? "card" : "cards"}`;
}

function clearTrade() {
  myTradeCardIds.clear();
  otherTradeItems = [];
  elements.tradeSearchInput.value = "";
  elements.otherTradeForm.reset();
  elements.otherTradeQtyInput.value = "1";
  renderTradeBuilder();
}

function exportCollectionCsv() {
  try {
    const activeCards = cards.filter(card => !card.deleted_at);

    const columns = [
      ["Player", "player_name"],
      ["Sport", "sport"],
      ["Year", "card_year"],
      ["Brand", "brand"],
      ["Set", "set_name"],
      ["Card Number", "card_number"],
      ["Parallel", "parallel_name"],
      ["Rookie", "is_rookie"],
      ["Autograph", "is_autograph"],
      ["Patch or Memorabilia", "is_memorabilia"],
      ["Serial Numbered", "is_numbered"],
      ["Serial Number", "serial_number"],
      ["Print Run", "print_run"],
      ["Condition", "card_condition"],
      ["Grading Company", "grading_company"],
      ["Grade", "grade"],
      ["Quantity", "quantity"],
      ["Status", "status"],
      ["Wishlist Priority", "wishlist_priority"],
      ["Wishlist Target Price", "wishlist_target_price"],
      ["Estimated Value", "estimated_value"],
      ["Purchase Price", "purchase_price"],
      ["Purchase Date", "purchase_date"],
      ["Price Source", "price_source"],
      ["Price Checked", "price_checked_at"],
      ["Price Notes", "price_notes"],
      ["Storage Location", "storage_location"],
      ["Notes", "notes"],
      ["Front Photo Path", "front_photo_path"],
      ["Back Photo Path", "back_photo_path"],
      ["Created", "created_at"],
      ["Updated", "updated_at"]
    ];

    const rows = [
      columns.map(([label]) => csvCell(label)).join(","),
      ...activeCards.map(card =>
        columns.map(([, key]) => csvCell(csvValue(card[key]))).join(",")
      )
    ];

    downloadTextFile(
      buildBackupFilename("collection", "csv"),
      "\ufeff" + rows.join("\r\n"),
      "text/csv;charset=utf-8"
    );

    recordBackup("CSV collection downloaded.");
  } catch (error) {
    console.error("CSV export failed:", error);
    setBackupMessage("Could not create the CSV backup.");
  }
}

function exportCollectionJson() {
  try {
    const activeCards = cards.filter(card => !card.deleted_at);
    const trashedCards = cards.filter(card => card.deleted_at);

    const backup = {
      app: "Rookie Vault",
      format_version: 1,
      exported_at: new Date().toISOString(),
      collection_id: currentCollectionId,
      summary: buildCollectionSummaryObject(activeCards, trashedCards),
      active_cards: activeCards.map(cleanCardForBackup),
      trashed_cards: trashedCards.map(cleanCardForBackup)
    };

    downloadTextFile(
      buildBackupFilename("complete-backup", "json"),
      JSON.stringify(backup, null, 2),
      "application/json;charset=utf-8"
    );

    recordBackup("Complete JSON backup downloaded.");
  } catch (error) {
    console.error("JSON export failed:", error);
    setBackupMessage("Could not create the JSON backup.");
  }
}

function exportCollectionSummary() {
  try {
    const activeCards = cards.filter(card => !card.deleted_at);
    const trashedCards = cards.filter(card => card.deleted_at);
    const summary = buildCollectionSummaryObject(activeCards, trashedCards);

    const lines = [
      "ROOKIE VAULT COLLECTION SUMMARY",
      "================================",
      `Generated: ${new Date().toLocaleString("en-US")}`,
      "",
      "COLLECTION TOTALS",
      `Active cards: ${summary.active_cards}`,
      `Total quantity: ${summary.total_quantity}`,
      `Estimated value: ${currency(summary.estimated_value)}`,
      `Purchase cost recorded: ${currency(summary.purchase_cost)}`,
      `For trade: ${summary.for_trade}`,
      `Wishlist: ${summary.wishlist}`,
      `Trash: ${summary.trashed_cards}`,
      "",
      "COLLECTOR HIGHLIGHTS",
      `Rookie cards: ${summary.rookie_cards}`,
      `Autographs: ${summary.autographs}`,
      `Patch / memorabilia: ${summary.memorabilia_cards}`,
      `Numbered cards: ${summary.numbered_cards}`,
      `Graded cards: ${summary.graded_cards}`,
      `Cards missing a value: ${summary.missing_values}`,
      `Cards missing a front photo: ${summary.missing_front_photos}`,
      "",
      "BY SPORT",
      ...Object.entries(summary.by_sport)
        .sort((a, b) => b[1].cards - a[1].cards)
        .map(([sport, data]) =>
          `${sport}: ${data.cards} cards, quantity ${data.quantity}, ${currency(data.value)}`
        ),
      "",
      "BY STATUS",
      ...Object.entries(summary.by_status)
        .sort((a, b) => b[1] - a[1])
        .map(([status, count]) => `${titleCase(status)}: ${count}`),
      "",
      "Generated by Rookie Vault"
    ];

    downloadTextFile(
      buildBackupFilename("summary", "txt"),
      lines.join("\r\n"),
      "text/plain;charset=utf-8"
    );

    recordBackup("Collection summary downloaded.");
  } catch (error) {
    console.error("Summary export failed:", error);
    setBackupMessage("Could not create the collection summary.");
  }
}

function buildCollectionSummaryObject(activeCards, trashedCards) {
  const bySport = {};
  const byStatus = {};

  for (const card of activeCards) {
    const sport = card.sport || "Other";
    const quantity = Math.max(1, Number(card.quantity || 1));
    const value = Number(card.estimated_value || 0) * quantity;

    if (!bySport[sport]) {
      bySport[sport] = { cards: 0, quantity: 0, value: 0 };
    }

    bySport[sport].cards += 1;
    bySport[sport].quantity += quantity;
    bySport[sport].value += value;

    const status = card.status || "keep";
    byStatus[status] = (byStatus[status] || 0) + 1;
  }

  return {
    active_cards: activeCards.length,
    total_quantity: activeCards.reduce(
      (sum, card) => sum + Math.max(1, Number(card.quantity || 1)),
      0
    ),
    estimated_value: activeCards.reduce(
      (sum, card) =>
        sum +
        Number(card.estimated_value || 0) *
          Math.max(1, Number(card.quantity || 1)),
      0
    ),
    purchase_cost: activeCards.reduce(
      (sum, card) =>
        sum +
        Number(card.purchase_price || 0) *
          Math.max(1, Number(card.quantity || 1)),
      0
    ),
    for_trade: activeCards.filter(card => card.status === "trade").length,
    wishlist: activeCards.filter(card => card.status === "want").length,
    trashed_cards: trashedCards.length,
    rookie_cards: activeCards.filter(card => card.is_rookie).length,
    autographs: activeCards.filter(card => card.is_autograph).length,
    memorabilia_cards: activeCards.filter(card => card.is_memorabilia).length,
    numbered_cards: activeCards.filter(card => card.is_numbered).length,
    graded_cards: activeCards.filter(card => card.card_condition === "graded").length,
    missing_values: activeCards.filter(
      card => Number(card.estimated_value || 0) <= 0
    ).length,
    missing_front_photos: activeCards.filter(
      card => !card.front_photo_path
    ).length,
    by_sport: bySport,
    by_status: byStatus
  };
}

function cleanCardForBackup(card) {
  const {
    front_photo_url,
    back_photo_url,
    ...databaseFields
  } = card;

  return databaseFields;
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function csvValue(value) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value ?? "";
}

function buildBackupFilename(label, extension) {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replaceAll(":", "-");

  return `rookie-vault-${label}-${stamp}.${extension}`;
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function recordBackup(message) {
  const now = new Date().toISOString();
  localStorage.setItem(LAST_BACKUP_KEY, now);
  updateLastBackupDisplay();
  setBackupMessage(message);
}

function updateLastBackupDisplay() {
  const stored = localStorage.getItem(LAST_BACKUP_KEY);

  if (!stored) {
    elements.lastBackupText.textContent = "Never";
    return;
  }

  const date = new Date(stored);

  if (Number.isNaN(date.getTime())) {
    elements.lastBackupText.textContent = "Unknown";
    return;
  }

  elements.lastBackupText.textContent = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function setBackupMessage(message) {
  elements.backupMessage.textContent = message;
}

function titleCase(value) {
  return String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, character => character.toUpperCase());
}

function navigateTo(view) {
  activeAppView = view;

  const showHome = view === "home";
  const showAdd = view === "add";
  const showCollection = view === "collection" || view === "trash";
  const showTrade = view === "trade";
  const showScan = view === "scan";
  const showSets = view === "sets";
  const showCardShow = view === "show";

  elements.homeView.classList.toggle("hidden", !showHome);
  elements.addView.classList.toggle("hidden", !showAdd);
  elements.collectionView.classList.toggle("hidden", !showCollection);
  elements.tradeView.classList.toggle("hidden", !showTrade);
  elements.scanView.classList.toggle("hidden", !showScan);
  elements.setsView.classList.toggle("hidden", !showSets);
  elements.showView.classList.toggle("hidden", !showCardShow);

  for (const button of document.querySelectorAll(".nav-button")) {
    const isActive = button.dataset.view === view;
    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  }

  if (view === "collection") {
    switchCollectionView("active");
  }

  if (view === "trash") {
    switchCollectionView("trash");
  }

  if (view === "trade") {
    renderTradeBuilder();
  }

  if (view === "sets") {
    renderSetGoals();
  }

  if (view === "show") {
    renderCardShowMode();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderRecentCards(activeCards) {
  const recent = activeCards.slice(0, 4);
  elements.recentCardsGrid.replaceChildren();

  for (const card of recent) {
    const article = document.createElement("article");
    article.className = "recent-card";
    article.tabIndex = 0;
    article.setAttribute("role", "button");

    const photoWrap = document.createElement("div");
    photoWrap.className = "recent-card-photo";

    if (card.front_photo_url) {
      const image = document.createElement("img");
      image.src = card.front_photo_url;
      image.alt = `Front of ${card.player_name} card`;
      photoWrap.append(image);
    } else {
      photoWrap.textContent = "No photo";
    }

    const info = document.createElement("div");
    info.className = "recent-card-info";

    const name = document.createElement("strong");
    name.textContent = card.player_name;

    const meta = document.createElement("span");
    meta.textContent = [card.card_year, card.brand].filter(Boolean).join(" • ");

    info.append(name, meta);
    article.append(photoWrap, info);

    article.addEventListener("click", () => openCardDialog(card));
    article.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCardDialog(card);
      }
    });

    elements.recentCardsGrid.append(article);
  }

  elements.recentEmptyState.classList.toggle("hidden", recent.length > 0);
}


function clearCollectionFilters() {
  collectionView = "active";
  activeSport = "all";
  activeStatus = "all";

  elements.searchInput.value = "";

  const allSportButton =
    elements.sportFilters.querySelector('[data-sport="all"]');
  const allStatusButton =
    elements.statusFilters.querySelector('[data-status="all"]');

  if (allSportButton) {
    setActiveChip(elements.sportFilters, allSportButton);
  }

  if (allStatusButton) {
    setActiveChip(elements.statusFilters, allStatusButton);
  }

  elements.activeViewButton.classList.add("active");
  elements.trashViewButton.classList.remove("active");
  elements.collectionTitle.textContent = "Your cards";
}

function switchCollectionView(view) {
  collectionView = view;

  elements.activeViewButton.classList.toggle("active", view === "active");
  elements.trashViewButton.classList.toggle("active", view === "trash");
  elements.collectionTitle.textContent = view === "active" ? "Your cards" : "Trash";

  if (view === "trash") {
    activeSport = "all";
    activeStatus = "all";

    const firstSport = elements.sportFilters.querySelector('[data-sport="all"]');
    const firstStatus = elements.statusFilters.querySelector('[data-status="all"]');
    setActiveChip(elements.sportFilters, firstSport);
    setActiveChip(elements.statusFilters, firstStatus);
  }

  renderCards();
}

function getFilteredCards() {
  const query = elements.searchInput.value.trim().toLowerCase();

  return cards.filter(card => {
    const isDeleted = Boolean(card.deleted_at);
    const matchesView =
      collectionView === "trash" ? isDeleted : !isDeleted;

    const matchesSport =
      collectionView === "trash" ||
      activeSport === "all" ||
      String(card.sport || "").toLowerCase() === activeSport.toLowerCase();

    const matchesStatus =
      collectionView === "trash" ||
      activeStatus === "all" ||
      String(card.status || "").toLowerCase() === activeStatus.toLowerCase();

    const haystack = [
      card.player_name,
      card.sport,
      card.brand,
      card.set_name,
      card.card_number,
      card.storage_location,
      card.status,
      card.card_year,
      card.notes
    ].filter(Boolean).join(" ").toLowerCase();

    return matchesView && matchesSport && matchesStatus && haystack.includes(query);
  });
}

function renderCards() {
  const filtered = getFilteredCards();
  elements.cardsGrid.replaceChildren();

  for (const card of filtered) {
    const fragment = elements.cardTemplate.content.cloneNode(true);
    const cardElement = fragment.querySelector(".collection-card");
    const photo = fragment.querySelector(".card-photo");

    if (card.deleted_at) {
      cardElement.classList.add("is-deleted");
    }
    const placeholder = fragment.querySelector(".card-photo-placeholder");

    if (card.front_photo_url) {
      photo.src = card.front_photo_url;
      photo.alt = `Front of ${card.player_name} card`;
      photo.classList.remove("hidden");
      placeholder.classList.add("hidden");
    }

    fragment.querySelector(".card-meta").textContent =
      [card.card_year, card.brand].filter(Boolean).join(" • ");
    fragment.querySelector(".card-player").textContent = card.player_name;
    fragment.querySelector(".card-value").textContent = currency(card.estimated_value);
    fragment.querySelector(".card-details").textContent =
      [card.set_name, card.card_number ? `#${card.card_number}` : null]
        .filter(Boolean).join(" • ") || "No set details";
    fragment.querySelector(".card-location").textContent =
      card.storage_location ? `Stored: ${card.storage_location}` : "";
    fragment.querySelector(".card-sport").textContent = card.sport || "Other";
    fragment.querySelector(".card-status").textContent =
      String(card.status || "keep").replace("-", " ");

    renderCollectorBadges(
      fragment.querySelector(".collector-badges"),
      card
    );

    cardElement.addEventListener("click", () => openCardDialog(card));
    cardElement.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCardDialog(card);
      }
    });

    elements.cardsGrid.append(fragment);
  }

  const noun = filtered.length === 1 ? "card" : "cards";
  elements.resultCount.textContent = `${filtered.length} ${noun} shown`;
  elements.emptyState.classList.toggle("hidden", filtered.length > 0);

  const activeCards = cards.filter(card => !card.deleted_at);
  const deletedCards = cards.filter(card => card.deleted_at);

  elements.totalCards.textContent = activeCards.length;
  elements.totalValue.textContent = currency(
    activeCards.reduce(
      (sum, card) =>
        sum +
        Number(card.estimated_value || 0) *
          Math.max(1, Number(card.quantity || 1)),
      0
    )
  );
  elements.tradeCount.textContent =
    activeCards.filter(card => card.status === "trade").length;
  elements.trashCount.textContent = deletedCards.length;
  elements.rookieCount.textContent =
    activeCards.filter(card => card.is_rookie).length;
  elements.autographCount.textContent =
    activeCards.filter(card => card.is_autograph).length;
  elements.gradedCount.textContent =
    activeCards.filter(card => card.card_condition === "graded").length;
  elements.numberedCount.textContent =
    activeCards.filter(card => card.is_numbered).length;
  elements.missingValueCount.textContent =
    activeCards.filter(card => Number(card.estimated_value || 0) <= 0).length;
  elements.missingPhotoCount.textContent =
    activeCards.filter(card => !card.front_photo_path).length;
  renderRecentCards(activeCards);
  renderHomeSetProgress();

  elements.sportFilters.classList.toggle("hidden", collectionView === "trash");
  elements.statusFilters.classList.toggle("hidden", collectionView === "trash");
  for (const section of document.querySelectorAll(".filter-section")) {
    section.classList.toggle("hidden", collectionView === "trash");
  }
}

function openCardDialog(card) {
  selectedCard = card;
  detailSide = "front";

  elements.detailMeta.textContent =
    [card.card_year, card.brand].filter(Boolean).join(" • ");
  elements.detailPlayer.textContent = card.player_name;
  elements.detailSet.textContent =
    [card.set_name, card.card_number ? `#${card.card_number}` : null]
      .filter(Boolean).join(" • ") || "No set details";
  elements.detailValue.textContent = currency(card.estimated_value);
  elements.detailSport.textContent = card.sport || "Other";
  elements.detailStatus.textContent = String(card.status || "keep").replace("-", " ");
  elements.detailWishlistPriority.textContent =
    card.status === "want"
      ? titleCase(card.wishlist_priority || "medium")
      : "Not a wishlist card";
  elements.detailWishlistTarget.textContent =
    card.status === "want" && card.wishlist_target_price !== null && card.wishlist_target_price !== undefined
      ? currency(card.wishlist_target_price)
      : "Not set";
  renderCollectorBadges(elements.detailBadges, card);
  elements.detailLocation.textContent = card.storage_location || "Not specified";
  elements.detailParallel.textContent = card.parallel_name || "None";
  elements.detailQuantity.textContent = String(card.quantity || 1);
  elements.detailPurchase.textContent = formatPurchase(card);
  elements.detailPriceResearch.textContent = formatPriceResearch(card);
  elements.detailNotes.textContent = card.notes || "No notes";
  populatePricingResearch(card);

  const isDeleted = Boolean(card.deleted_at);
  elements.activeDetailActions.classList.toggle("hidden", isDeleted);
  elements.trashDetailActions.classList.toggle("hidden", !isDeleted);

  setDetailSide("front");
  elements.cardDialog.showModal();
}

function closeCardDialog() {
  if (elements.cardDialog.open) elements.cardDialog.close();
  selectedCard = null;
}

function setDetailSide(side) {
  detailSide = side;

  elements.showFrontButton.classList.toggle("active", side === "front");
  elements.showBackButton.classList.toggle("active", side === "back");

  const url =
    side === "front"
      ? selectedCard?.front_photo_url
      : selectedCard?.back_photo_url;

  if (url) {
    elements.detailPhoto.src = url;
    elements.detailPhoto.alt =
      `${side === "front" ? "Front" : "Back"} of ${selectedCard.player_name} card`;
    elements.detailPhoto.classList.remove("hidden");
    elements.detailPhotoPlaceholder.classList.add("hidden");
  } else {
    elements.detailPhoto.removeAttribute("src");
    elements.detailPhoto.classList.add("hidden");
    elements.detailPhotoPlaceholder.textContent =
      `No ${side} photo available`;
    elements.detailPhotoPlaceholder.classList.remove("hidden");
  }
}



function populatePricingResearch(card) {
  const searchText = buildPricingSearch(card);
  const encoded = encodeURIComponent(searchText);

  elements.pricingSearchText.value = searchText;
  elements.pricingValueInput.value = Number(card.estimated_value || 0).toFixed(2);
  elements.pricingSourceInput.value = card.price_source || "";
  elements.pricingNotesInput.value = card.price_notes || "";

  elements.ebaySoldLink.href =
    `https://www.ebay.com/sch/i.html?_nkw=${encoded}&LH_Complete=1&LH_Sold=1`;
  elements.ebayActiveLink.href =
    `https://www.ebay.com/sch/i.html?_nkw=${encoded}`;
  elements.sportsCardsProLink.href =
    `https://www.sportscardspro.com/search-products?q=${encoded}`;
  elements.googlePricingLink.href =
    `https://www.google.com/search?q=${encodeURIComponent(searchText + " sports card sold price")}`;

  elements.priceResearchDate.textContent =
    card.price_checked_at
      ? `Checked ${formatShortDate(card.price_checked_at)}`
      : "Never checked";

  elements.pricingMessage.textContent = "";
}

function buildPricingSearch(card) {
  const parts = [
    card.card_year,
    card.brand,
    card.set_name,
    card.player_name,
    card.card_number ? `#${card.card_number}` : null,
    card.parallel_name,
    card.is_rookie ? "rookie RC" : null,
    card.is_autograph ? "autograph auto" : null,
    card.is_memorabilia ? "patch memorabilia" : null,
    card.is_numbered && card.print_run ? `/${card.print_run}` : null,
    card.card_condition === "graded"
      ? [card.grading_company, card.grade].filter(Boolean).join(" ")
      : "raw"
  ];

  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

async function copyPricingSearch() {
  const text = elements.pricingSearchText.value;

  try {
    await navigator.clipboard.writeText(text);
    elements.pricingMessage.textContent = "Search copied.";
  } catch (error) {
    console.error("Clipboard failed:", error);
    elements.pricingSearchText.select();
    document.execCommand("copy");
    elements.pricingMessage.textContent = "Search copied.";
  }
}

async function savePricingResearch(event) {
  event.preventDefault();
  if (!selectedCard) return;

  const value = Number(elements.pricingValueInput.value || 0);

  if (!Number.isFinite(value) || value < 0) {
    elements.pricingMessage.textContent = "Enter a valid estimated value.";
    return;
  }

  elements.savePricingButton.disabled = true;
  elements.savePricingButton.textContent = "Saving...";
  elements.pricingMessage.textContent = "Saving pricing research...";

  const checkedAt = new Date().toISOString();
  const payload = {
    estimated_value: value,
    price_source: elements.pricingSourceInput.value || null,
    price_notes: elements.pricingNotesInput.value.trim() || null,
    price_checked_at: checkedAt
  };

  const { data, error } = await supabase
    .from("cards")
    .update(payload)
    .eq("id", selectedCard.id)
    .eq("collection_id", currentCollectionId)
    .select("*")
    .single();

  elements.savePricingButton.disabled = false;
  elements.savePricingButton.textContent = "Save pricing research";

  if (error) {
    console.error("Pricing save failed:", error);
    elements.pricingMessage.textContent = error.message || "Could not save pricing research.";
    return;
  }

  const cardIndex = cards.findIndex(card => card.id === selectedCard.id);
  const retainedUrls = {
    front_photo_url: selectedCard.front_photo_url,
    back_photo_url: selectedCard.back_photo_url
  };

  selectedCard = { ...data, ...retainedUrls };

  if (cardIndex >= 0) {
    cards[cardIndex] = selectedCard;
  }

  elements.detailValue.textContent = currency(value);
  elements.detailPriceResearch.textContent = formatPriceResearch(selectedCard);
  elements.priceResearchDate.textContent = `Checked ${formatShortDate(checkedAt)}`;
  elements.pricingMessage.textContent = "Pricing research saved.";

  renderCards();
  if (activeAppView === "trade") renderTradeBuilder();
}

function formatPriceResearch(card) {
  const parts = [];

  if (card.price_source) {
    parts.push(card.price_source);
  }

  if (card.price_checked_at) {
    parts.push(`checked ${formatShortDate(card.price_checked_at)}`);
  }

  if (card.price_notes) {
    parts.push(card.price_notes);
  }

  return parts.length ? parts.join(" • ") : "Not researched yet";
}

function formatShortDate(value) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "unknown date";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function beginEditSelectedCard() {
  if (!selectedCard) return;

  editingCard = selectedCard;

  document.querySelector("#playerInput").value = selectedCard.player_name || "";
  document.querySelector("#sportInput").value = selectedCard.sport || "Other";
  document.querySelector("#yearInput").value = selectedCard.card_year ?? "";
  document.querySelector("#brandInput").value = selectedCard.brand || "";
  document.querySelector("#setInput").value = selectedCard.set_name || "";
  document.querySelector("#cardNumberInput").value = selectedCard.card_number || "";
  document.querySelector("#valueInput").value = selectedCard.estimated_value ?? 0;
  document.querySelector("#statusInput").value = selectedCard.status || "keep";
  elements.wishlistPriorityInput.value = selectedCard.wishlist_priority || "medium";
  elements.wishlistTargetInput.value = selectedCard.wishlist_target_price ?? "";
  updateWishlistFields();
  document.querySelector("#locationInput").value = selectedCard.storage_location || "";
  document.querySelector("#notesInput").value = selectedCard.notes || "";

  elements.rookieInput.checked = Boolean(selectedCard.is_rookie);
  elements.autographInput.checked = Boolean(selectedCard.is_autograph);
  elements.memorabiliaInput.checked = Boolean(selectedCard.is_memorabilia);
  elements.numberedInput.checked = Boolean(selectedCard.is_numbered);
  elements.serialNumberInput.value = selectedCard.serial_number ?? "";
  elements.printRunInput.value = selectedCard.print_run ?? "";
  elements.parallelInput.value = selectedCard.parallel_name || "";
  elements.quantityInput.value = selectedCard.quantity ?? 1;
  elements.conditionInput.value = selectedCard.card_condition || "raw";
  elements.gradingCompanyInput.value = selectedCard.grading_company || "";
  elements.gradeInput.value = selectedCard.grade || "";
  elements.purchasePriceInput.value = selectedCard.purchase_price ?? "";
  elements.purchaseDateInput.value = selectedCard.purchase_date || "";
  updateCollectorFieldVisibility();

  showExistingPreview(
    elements.frontPreview,
    selectedCard.front_photo_url,
    "Current front photo"
  );

  showExistingPreview(
    elements.backPreview,
    selectedCard.back_photo_url,
    "Current back photo"
  );

  elements.formEyebrow.textContent = "Update collection";
  elements.formTitle.textContent = `Edit ${selectedCard.player_name}`;
  elements.editNotice.classList.remove("hidden");
  elements.cancelEditButton.classList.remove("hidden");
  elements.cancelEditButtonBottom.classList.remove("hidden");
  elements.saveCardButton.textContent = "Update card";

  closeCardDialog();
  navigateTo("add");

  elements.cardForm.closest(".panel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  setCardMessage("Choose a new front or back photo only when you want to replace the current one.");
}

function showExistingPreview(imageElement, url, altText) {
  if (!url) {
    imageElement.removeAttribute("src");
    imageElement.classList.add("hidden");
    return;
  }

  imageElement.src = url;
  imageElement.alt = altText;
  imageElement.classList.remove("hidden");
}

function cancelEdit() {
  resetCardForm();
  setCardMessage("Edit cancelled.");
}

async function deleteSelectedCard() {
  if (!selectedCard) return;
  if (!window.confirm("Move this card to the trash?")) return;

  const { error } = await supabase
    .from("cards")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", selectedCard.id);

  if (error) {
    console.error("Card delete failed:", error);
    setCardMessage("Could not remove the card.");
    return;
  }

  closeCardDialog();
  await loadCards();
}


async function restoreSelectedCard() {
  if (!selectedCard) return;

  const { error } = await supabase
    .from("cards")
    .update({ deleted_at: null })
    .eq("id", selectedCard.id)
    .eq("collection_id", currentCollectionId);

  if (error) {
    console.error("Card restore failed:", error);
    setCardMessage("Could not restore the card.");
    return;
  }

  closeCardDialog();
  await loadCards();
  setCardMessage("Card restored to the collection.");
}

async function permanentlyDeleteSelectedCard() {
  if (!selectedCard) return;

  const confirmed = window.confirm(
    "Permanently delete this card and its photos? This cannot be undone."
  );
  if (!confirmed) return;

  const photoPaths = [
    selectedCard.front_photo_path,
    selectedCard.back_photo_path
  ].filter(Boolean);

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", selectedCard.id)
    .eq("collection_id", currentCollectionId);

  if (error) {
    console.error("Permanent delete failed:", error);
    setCardMessage("Could not permanently delete the card.");
    return;
  }

  if (photoPaths.length) {
    const { error: storageError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove(photoPaths);

    if (storageError) {
      console.error("Photo cleanup failed:", storageError);
    }
  }

  closeCardDialog();
  await loadCards();
  setCardMessage("Card permanently deleted.");
}


function updateCollectorFieldVisibility() {
  elements.numberedFields.classList.toggle(
    "hidden",
    !elements.numberedInput.checked
  );

  elements.gradingFields.classList.toggle(
    "hidden",
    elements.conditionInput.value !== "graded"
  );
}

function renderCollectorBadges(container, card) {
  container.replaceChildren();

  const badges = [];

  if (card.is_rookie) badges.push(["RC", false]);
  if (card.is_autograph) badges.push(["AUTO", false]);
  if (card.is_memorabilia) badges.push(["PATCH", false]);

  if (card.is_numbered) {
    const serialText =
      card.serial_number && card.print_run
        ? `${card.serial_number}/${card.print_run}`
        : card.print_run
          ? `/${card.print_run}`
          : "NUMBERED";
    badges.push([serialText, false]);
  }

  if (card.card_condition === "graded") {
    const gradeText = [card.grading_company, card.grade]
      .filter(Boolean)
      .join(" ");
    badges.push([gradeText || "GRADED", false]);
  }

  if (card.parallel_name) {
    badges.push([card.parallel_name, true]);
  }

  for (const [label, alternate] of badges) {
    const badge = document.createElement("span");
    badge.className = `collector-badge${alternate ? " alt" : ""}`;
    badge.textContent = label;
    container.append(badge);
  }
}

function formatPurchase(card) {
  const parts = [];

  if (card.purchase_price !== null && card.purchase_price !== undefined) {
    parts.push(currency(card.purchase_price));
  }

  if (card.purchase_date) {
    const parsed = new Date(`${card.purchase_date}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      parts.push(
        parsed.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      );
    }
  }

  return parts.length ? parts.join(" • ") : "Not recorded";
}

function resetCardForm() {
  elements.cardForm.reset();

  for (const url of previewObjectUrls) URL.revokeObjectURL(url);
  previewObjectUrls = [];

  for (const preview of [elements.frontPreview, elements.backPreview]) {
    preview.removeAttribute("src");
    preview.classList.add("hidden");
  }

  editingCard = null;
  elements.formEyebrow.textContent = "Add to collection";
  elements.formTitle.textContent = "New card";
  elements.editNotice.classList.add("hidden");
  elements.cancelEditButton.classList.add("hidden");
  elements.cancelEditButtonBottom.classList.add("hidden");
  elements.saveCardButton.textContent = "Save card";
  elements.quantityInput.value = "1";
  elements.conditionInput.value = "raw";
  elements.wishlistPriorityInput.value = "medium";
  elements.wishlistTargetInput.value = "";
  updateCollectorFieldVisibility();
  updateWishlistFields();
}

function setSavingState(isSaving) {
  elements.saveCardButton.disabled = isSaving;

  if (isSaving) {
    elements.saveCardButton.textContent = editingCard ? "Updating..." : "Saving...";
  } else {
    elements.saveCardButton.textContent = editingCard ? "Update card" : "Save card";
  }
}

function valueOf(selector) {
  return document.querySelector(selector).value.trim();
}

function numberOrNull(value) {
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
}

function setAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function setCardMessage(message) {
  elements.cardMessage.textContent = message;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(error => {
        console.error("Service worker registration failed:", error);
      });
    });
  }
}
