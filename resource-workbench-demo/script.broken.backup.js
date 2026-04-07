const appState = {
  language: "zh",
  activeCollection: "all",
  activeType: "all",
  activeTag: null,
  activeView: "cards",
  selectedResourceId: "res-prompt-system",
  editorMode: "create",
  editingResourceId: null,
  workspaceSlots: {
    context: ["res-profile-core", "res-brand-brief"],
    engine: ["res-prompt-system", "res-agent-playbook"],
    output: ["res-video-script-pack"],
  },
};

const project = {
  id: "project-ip-studio",
  title: "AI Creation Console",
  description:
    "鎶婁釜浜鸿祫鏂欍€佺煡璇嗙粨璁恒€佹彁绀鸿瘝绯荤粺銆丄gent 鍗忓悓瑙勫垯鍜岃剼鏈骇鍑烘暣鍚堝埌涓€涓彲璋冪敤銆佸彲鑱斿姩銆佸彲澶嶇敤鐨勫伐浣滅┖闂撮噷銆?,
};

const collections = [
  {
    id: "all",
    name: "鍏ㄩ儴璧勬簮",
    summary: "娴忚鏁翠釜璧勬簮瀹囧畽锛岄€傚悎鍏ㄥ眬鎼滅储鍜岄殢鏈哄彫鍥炪€?,
  },
  {
    id: "collection-profile",
    name: "涓汉璧勬枡搴?,
    summary: "浜鸿銆佷环鍊艰銆佽〃杈鹃鏍煎拰椤圭洰鑳屾櫙銆?,
  },
  {
    id: "collection-knowledge",
    name: "鐭ヨ瘑璧勬枡搴?,
    summary: "浠庡璇濆拰瀹炶返涓彁鐐煎嚭鐨勭ǔ瀹氱煡璇嗙粨璁恒€?,
  },
  {
    id: "collection-video",
    name: "瑙嗛鎻愮ず璇嶇郴缁?,
    summary: "瑙嗛鎻愮ず璇嶃€侀暅澶磋瑷€銆佽剼鏈伐绋嬪拰浜у嚭妯℃澘銆?,
  },
  {
    id: "collection-agent",
    name: "Agent 鍗忓悓鐭ヨ瘑搴?,
    summary: "瑙掕壊鍒嗗伐銆佸崗浣滃崗璁€佷笂涓嬫枃浼犻€掍笌澶嶇洏绛栫暐銆?,
  },
];

const STORAGE_KEYS = {
  customResources: "resourceWorkbench.customResources.v1",
  uiState: "resourceWorkbench.uiState.v1",
};

const baseResources = [
  {
    id: "res-profile-core",
    title: "涓汉璁惧畾涓绘。",
    type: "profile",
    summary:
      "姹囨€讳綘鐨勮鑹插畾浣嶃€佽〃杈惧亸濂姐€佽瑙夊搧浣嶃€侀暱鏈熺洰鏍囧拰鍐呭杈圭晫锛屾槸鎵€鏈夌敓鎴愪换鍔＄殑椤跺眰涓婁笅鏂囥€?,
    tags: ["浜鸿", "闀挎湡璧勪骇", "涓婁笅鏂?],
    collections: ["collection-profile"],
    related: ["res-brand-brief", "res-prompt-system", "res-agent-playbook"],
    detail:
      "杩欏紶璧勬簮鍗′唬琛ㄦ暣涓郴缁熺殑浜烘牸鍘熺偣銆傚畠涓嶇洿鎺ヤ骇鍑哄唴瀹癸紝浣嗕細鎸佺画褰卞搷鎵€鏈夎剼鏈€佹彁绀鸿瘝鍜屽崗浣滆鍒欑殑鎺緸銆佸缇庡拰鐩爣瀵煎悜銆?,
    preferredSlot: "context",
  },
  {
    id: "res-brand-brief",
    title: "鍐呭鍝佺墝璇存槑涔?,
    type: "knowledge",
    summary:
      "浠庡杞璇濇矇娣€鍑虹殑鍝佺墝璇皵銆佷环鍊间富寮犮€佸彈浼楁劅鐭ュ拰宸紓鍖栫瓥鐣ワ紝鐢ㄤ簬缁熶竴鍐呭杈撳嚭璋冩€с€?,
    tags: ["鍝佺墝", "瀹氫綅", "鐭ヨ瘑缁撹"],
    collections: ["collection-profile", "collection-knowledge"],
    related: ["res-profile-core", "res-video-script-pack", "res-workflow-review"],
    detail:
      "瀹冩妸闆舵暎鑱婂ぉ涓殑鍒ゆ柇鏀舵潫鎴愬彲鎵ц鐨勫搧鐗岃瑷€瑙勫垯锛岄€傚悎鍦ㄤ换浣曞唴瀹逛换鍔″紑濮嬪墠琚嚜鍔ㄦ敞鍏ャ€?,
    preferredSlot: "context",
  },
  {
    id: "res-prompt-system",
    title: "瑙嗛鎻愮ず璇嶈剼鏈伐绋嬬郴缁?,
    type: "prompt",
    summary:
      "鎶婅棰戠敓鎴愪换鍔℃媶鎴愯鑹层€侀暅澶淬€佹椂闀裤€佺敾闈㈢姸鎬併€佸彊浜嬪眰绾х殑缁撴瀯鍖栨ā鏉匡紝鏄綋鍓嶅伐浣滃彴鐨勬牳蹇冨紩鎿庤祫婧愩€?,
    tags: ["鎻愮ず璇?, "瑙嗛", "宸ョ▼绯荤粺"],
    collections: ["collection-video"],
    related: ["res-video-script-pack", "res-brand-brief", "res-shot-language", "res-profile-core"],
    detail:
      "杩欏紶鍗′笉鏄竴鍙ユ彁绀鸿瘝锛岃€屾槸涓€鏁村鍙彉閲忓寲鐨勬彁绀鸿瘝宸ョ▼妗嗘灦銆傚畠閫傚悎浣滀负寮曟搸妲戒腑鐨勪富椹卞姩璧勬簮锛岃繛鎺ヤ笂娓镐笂涓嬫枃鍜屼笅娓歌緭鍑恒€?,
    preferredSlot: "engine",
  },
  {
    id: "res-video-script-pack",
    title: "鐭棰戣剼鏈ā鏉垮寘",
    type: "script",
    summary:
      "鍖呭惈寮€鍦洪挬瀛愩€佷俊鎭帹杩涖€佽浆鎶樸€佹敹鏉熷拰 CTA 妯℃澘锛屽彲涓庢彁绀鸿瘝绯荤粺鍜屽搧鐗岃鏄庝功缁勫悎鐢熸垚鎴愮墖鑴氭湰銆?,
    tags: ["鑴氭湰", "鐭棰?, "杈撳嚭"],
    collections: ["collection-video"],
    related: ["res-prompt-system", "res-shot-language", "res-workflow-review"],
    detail:
      "瀹冩壙鎷呮渶鍚庝竴鍏噷鐨勮惤鍦颁綔鐢ㄣ€傚綋鍓嶅伐浣滃彴閲屽畠鏇村儚杈撳嚭灞傝祫婧愶細鍚告敹瑙勫垯鍚庤浆涓洪潰鍚戣棰戝垱浣滅殑鎴愬搧缁撴瀯銆?,
    preferredSlot: "output",
  },
  {
    id: "res-shot-language",
    title: "闀滃ご璇█澶囧繕褰?,
    type: "knowledge",
    summary:
      "鏀跺綍杩愰暅琛ㄨ揪銆佹櫙鍒垏鎹€佺敾闈㈢姸鎬佹弿杩版柟寮忓拰甯歌璇尯锛岀敤浜庢彁鍗囪棰戞彁绀鸿瘝鐨勯暅澶磋川鎰熴€?,
    tags: ["闀滃ご", "鏈", "鐭ヨ瘑璧勬枡"],
    collections: ["collection-video", "collection-knowledge"],
    related: ["res-prompt-system", "res-video-script-pack"],
    detail:
      "杩欐槸鍋忓弬鑰冨瀷璧勬簮锛屼笉涓€瀹氭€诲湪宸ヤ綔鍙伴噷锛屼絾涓€鏃﹂渶瑕佸崌绾х敾闈㈣〃杈撅紝瀹冧細蹇€熸垚涓哄眬閮ㄥ浘璋遍噷鐨勯珮棰戣緟鍔╄妭鐐广€?,
    preferredSlot: "engine",
  },
  {
    id: "res-agent-playbook",
    title: "Agent 鍗忓悓浣滄垬鎵嬪唽",
    type: "agent_rule",
    summary:
      "瀹氫箟鐮旂┒銆佸垱浣溿€佸鏍°€佹墽琛岀瓑 Agent 鐨勮亴璐ｈ竟鐣屻€佽緭鍏ヨ緭鍑烘牸寮忓拰涓婁笅鏂囦氦鎺ヨ鑼冦€?,
    tags: ["Agent", "鍗忎綔", "瑙勫垯"],
    collections: ["collection-agent"],
    related: ["res-profile-core", "res-workflow-review", "res-prompt-system"],
    detail:
      "杩欏紶鍗℃洿鍋忕郴缁熻鍒欏眰銆傚畠閫傚悎鍜屾彁绀鸿瘝寮曟搸骞舵帓瀛樺湪锛岀‘淇濊祫婧愪笉鏄绔嬭皟鐢紝鑰屾槸杩涘叆鍙崗鍚岀殑鐢熶骇娴佺▼銆?,
    preferredSlot: "engine",
  },
  {
    id: "res-workflow-review",
    title: "椤圭洰澶嶇洏宸ヤ綔娴?,
    type: "workflow",
    summary:
      "鎶婁换鍔″畬鎴愬悗鐨勫鐩樻媶鎴愯緭鍏ャ€佸喅绛栥€佺粨鏋溿€佸亸宸拰鍙鐢ㄨ祫浜ф彁鐐间簲涓樁娈碉紝璁╄祫婧愭寔缁嚜鎴戝娈栥€?,
    tags: ["宸ヤ綔娴?, "澶嶇洏", "娌夋穩"],
    collections: ["collection-agent", "collection-knowledge"],
    related: ["res-agent-playbook", "res-brand-brief", "res-video-script-pack"],
    detail:
      "瀹冭繛鎺ョ殑鏄郴缁熼暱鏈熸垚闀胯兘鍔涖€傚浣犺繖涓骇鍝佹潵璇达紝澶嶇洏宸ヤ綔娴佷細鎶婁复鏃惰亰澶╁唴瀹归噸鏂版彁鐐兼垚鏂扮殑缁撴瀯鍖栬祫婧愩€?,
    preferredSlot: "output",
  },
];

let resources = [...baseResources];

const dom = {
  projectTitle: document.getElementById("projectTitle"),
  projectDescription: document.getElementById("projectDescription"),
  collectionList: document.getElementById("collectionList"),
  typeFilters: document.getElementById("typeFilters"),
  tagCloud: document.getElementById("tagCloud"),
  resourceGrid: document.getElementById("resourceGrid"),
  resourceBrowserPanel: document.getElementById("resourceBrowserPanel"),
  dropIndicator: document.getElementById("dropIndicator"),
  fileGhostCard: document.getElementById("fileGhostCard"),
  resourceMap: document.getElementById("resourceMap"),
  cardsView: document.getElementById("cardsView"),
  graphView: document.getElementById("graphView"),
  cardsViewBtn: document.getElementById("cardsViewBtn"),
  graphViewBtn: document.getElementById("graphViewBtn"),
  createCardBtn: document.getElementById("createCardBtn"),
  createCardPanel: document.getElementById("createCardPanel"),
  createTitle: document.getElementById("createTitle"),
  createType: document.getElementById("createType"),
  createSummary: document.getElementById("createSummary"),
  createTags: document.getElementById("createTags"),
  createCollection: document.getElementById("createCollection"),
  createDetail: document.getElementById("createDetail"),
  cancelCreateCardBtn: document.getElementById("cancelCreateCardBtn"),
  submitCreateCardBtn: document.getElementById("submitCreateCardBtn"),
  detailPanel: document.getElementById("detailPanel"),
  detailTypeBadge: document.getElementById("detailTypeBadge"),
  graphStage: document.getElementById("graphStage"),
  resultCountLabel: document.getElementById("resultCountLabel"),
  metricResources: document.getElementById("metricResources"),
  metricCollections: document.getElementById("metricCollections"),
  metricLinks: document.getElementById("metricLinks"),
  searchInput: document.getElementById("searchInput"),
  actionFeedback: document.getElementById("actionFeedback"),
  shuffleFocusBtn: document.getElementById("shuffleFocusBtn"),
  resetWorkspaceBtn: document.getElementById("resetWorkspaceBtn"),
  languageToggleBtn: document.getElementById("languageToggleBtn"),
  readerOverlay: document.getElementById("readerOverlay"),
  readerBackdrop: document.getElementById("readerBackdrop"),
  closeReaderBtn: document.getElementById("closeReaderBtn"),
  readerTitle: document.getElementById("readerTitle"),
  readerMeta: document.getElementById("readerMeta"),
  readerContent: document.getElementById("readerContent"),
  slotContext: document.getElementById("slot-context"),
  slotEngine: document.getElementById("slot-engine"),
  slotOutput: document.getElementById("slot-output"),
  cardTemplate: document.getElementById("resourceCardTemplate"),
};

const graphState = {
  browser: {
    svg: null,
    nodes: new Map(),
    lines: new Map(),
    hoveredId: null,
  },
  local: {
    svg: null,
    nodes: new Map(),
    lines: new Map(),
    hoveredId: null,
  },
};

const dragState = {
  active: false,
  overBrowser: false,
};

const typeMeta = {
  profile: "Profile",
  knowledge: "Knowledge",
  prompt: "Prompt",
  script: "Script",
  workflow: "Workflow",
  agent_rule: "Agent Rule",
};

const translations = {
  zh: {
    languageToggle: "EN",
    resetWorkspace: "閲嶇疆宸ヤ綔鍙?,
    shuffleFocus: "闅忔満鍙洖",
    createCard: "鏂板缓鍗＄墖",
    cardsView: "鍗＄墝瑙嗗浘",
    graphView: "鍥捐氨瑙嗗浘",
    cancel: "鍙栨秷",
    saveCard: "淇濆瓨鍗＄墖",
    saveEdit: "淇濆瓨淇敼",
    searchPlaceholder: "鎼滅储鏍囬銆佹憳瑕併€佹爣绛俱€侀泦鍚?..",
    titlePlaceholder: "姣斿锛氬鎴疯璋堢煡璇嗗崱",
    summaryPlaceholder: "涓€鍙ヨ瘽璇存槑杩欏紶鍗¤兘瑙ｅ喅浠€涔堥棶棰?,
    tagsPlaceholder: "鐢ㄩ€楀彿鍒嗛殧锛屼緥濡傦細璁胯皥, 鍝佺墝, 鐢ㄦ埛娲炲療",
    detailPlaceholder: "琛ュ厖鐢ㄩ€斻€佸缓璁斁鍦ㄥ摢涓Ы浣嶏紝浠ュ強鍜屽摢浜涜祫婧愯仈鍔?,
    quickWorkspace: "鍔犲叆宸ヤ綔鍙?,
    quickCopy: "妯℃嫙澶嶅埗",
    quickCollection: "褰掑叆闆嗗悎",
    detailEdit: "缂栬緫鍗＄墖",
    detailDelete: "鍒犻櫎鍗＄墖",
    openReader: "灞曞紑闃呰",
    addToWorkspace: "鍔犲叆宸ヤ綔鍙?,
    types: {
      profile: "璧勬枡鍗?,
      knowledge: "鐭ヨ瘑鍗?,
      prompt: "鎻愮ず鍗?,
      script: "鑴氭湰鍗?,
      workflow: "娴佺▼鍗?,
      agent_rule: "瑙勫垯鍗?,
      all: "鍏ㄩ儴绫诲瀷",
    },
  },
  en: {
    languageToggle: "涓?,
    resetWorkspace: "Reset",
    shuffleFocus: "Recall",
    createCard: "New Card",
    cardsView: "Cards",
    graphView: "Graph",
    cancel: "Cancel",
    saveCard: "Save",
    saveEdit: "Save Edit",
    searchPlaceholder: "Search title, summary, tags, collections...",
    titlePlaceholder: "For example: Customer Interview Card",
    summaryPlaceholder: "Describe what this card is useful for",
    tagsPlaceholder: "Comma separated, for example: interview, brand, insight",
    detailPlaceholder: "Add usage notes, suggested slot, and related resources",
    quickWorkspace: "To Workspace",
    quickCopy: "Copy",
    quickCollection: "Collections",
    detailEdit: "Edit Card",
    detailDelete: "Delete Card",
    openReader: "Open Reader",
    addToWorkspace: "To Workspace",
    types: {
      profile: "Profile",
      knowledge: "Knowledge",
      prompt: "Prompt",
      script: "Script",
      workflow: "Workflow",
      agent_rule: "Agent Rule",
      all: "All Types",
    },
  },
};

const slotLabels = {
  context: "涓婁笅鏂囨Ы",
  engine: "寮曟搸妲?,
  output: "杈撳嚭妲?,
};

function getResourceById(id) {
  return resources.find((resource) => resource.id === id);
}

function getSelectedResource() {
  return getResourceById(appState.selectedResourceId) || resources[0];
}

function isCustomResource(resource) {
  return resource && resource.id.startsWith("res-custom-");
}

function isDocumentResource(resource) {
  return resource && resource.sourceType === "markdown-file";
}

function extractMarkdownSummary(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .filter((line) => !line.startsWith("- "))
    .filter((line) => !line.startsWith("* "));

  return (lines[0] || "Markdown 鏂囨。璧勬簮").slice(0, 120);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMarkdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inList = false;
  let inCode = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html += `<p>${paragraph.join(" ")}</p>`;
    paragraph = [];
  };

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph();
      closeList();
      if (!inCode) {
        inCode = true;
        html += "<pre><code>";
      } else {
        inCode = false;
        html += "</code></pre>";
      }
      return;
    }

    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      return;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    if (/^#{1,4}\s/.test(trimmed)) {
      flushParagraph();
      closeList();
      const level = trimmed.match(/^#+/)[0].length;
      html += `<h${level}>${trimmed.replace(/^#{1,4}\s*/, "")}</h${level}>`;
      return;
    }

    if (/^[-*]\s/.test(trimmed)) {
      flushParagraph();
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${trimmed.replace(/^[-*]\s*/, "")}</li>`;
      return;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      closeList();
      html += `<blockquote>${trimmed.replace(/^>\s*/, "")}</blockquote>`;
      return;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeList();
      html += "<hr />";
      return;
    }

    const inline = escapeHtml(trimmed)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

    paragraph.push(inline);
  });

  flushParagraph();
  closeList();
  if (inCode) html += "</code></pre>";
  return html;
}

function t(path) {
  const active = translations[appState.language] || translations.zh;
  return path.split(".").reduce((acc, key) => acc?.[key], active) ?? path;
}

function loadCustomResources() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.customResources);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (resource) =>
        resource &&
        typeof resource.id === "string" &&
        typeof resource.title === "string" &&
        typeof resource.type === "string" &&
        Array.isArray(resource.tags) &&
        Array.isArray(resource.collections) &&
        Array.isArray(resource.related),
    );
  } catch {
    return [];
  }
}

function loadUiState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.uiState);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveUiState() {
  try {
    const state = {
      language: appState.language,
      activeCollection: appState.activeCollection,
      activeType: appState.activeType,
      activeTag: appState.activeTag,
      activeView: appState.activeView,
      selectedResourceId: appState.selectedResourceId,
      workspaceSlots: appState.workspaceSlots,
      searchValue: dom.searchInput?.value || "",
    };
    window.localStorage.setItem(STORAGE_KEYS.uiState, JSON.stringify(state));
  } catch {
    // Ignore demo storage failures.
  }
}

function saveCustomResources() {
  try {
    const customResources = resources.filter(isCustomResource);
    window.localStorage.setItem(
      STORAGE_KEYS.customResources,
      JSON.stringify(customResources),
    );
  } catch {
    // Ignore storage failures in the demo environment.
  }
}

function updateGhostCardPosition(clientX, clientY) {
  dom.fileGhostCard.style.left = `${clientX + 22}px`;
  dom.fileGhostCard.style.top = `${clientY + 18}px`;
}

function showFileGhost(fileName, clientX, clientY) {
  dom.fileGhostCard.querySelector(".file-ghost-card__title").textContent = fileName;
  dom.fileGhostCard.classList.remove("is-hidden");
  updateGhostCardPosition(clientX, clientY);
}

function hideFileGhost() {
  dom.fileGhostCard.classList.add("is-hidden");
}

function setBrowserDropState(active) {
  dragState.overBrowser = active;
  dom.cardsView.classList.toggle("is-file-dragging", active);
  dom.dropIndicator.classList.toggle("is-hidden", !active);
}

function renderGenericReaderHtml(resource) {
  const collectionsMarkup = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
    .filter(Boolean)
    .map((name) => `<span class="collection-pill">${name}</span>`)
    .join("");
  const tagsMarkup = resource.tags
    .map((tag) => `<span class="tag-pill">#${tag}</span>`)
    .join("");
  const summary = resource.summary ? `<p>${resource.summary}</p>` : "";
  const detail = resource.detail
    ? resource.detail
        .split(/\n{2,}/)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
        .join("")
    : "";

  return `
    <section class="reader-section">
      <h3>摘要</h3>
      ${summary || "<p>暂无摘要</p>"}
    </section>
    <section class="reader-section">
      <h3>说明</h3>
      ${detail || "<p>暂无详细说明</p>"}
    </section>
    <section class="reader-section">
      <h3>标签</h3>
      <div class="reader-pill-row">${tagsMarkup || "<span class=\"muted\">暂无标签</span>"}</div>
    </section>
    <section class="reader-section">
      <h3>归属集合</h3>
      <div class="reader-pill-row">${collectionsMarkup || "<span class=\"muted\">暂无集合</span>"}</div>
    </section>
  `;
}

function openResourceReader(resource) {
  const collectionNames = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
    .filter(Boolean)
    .join(" / ");
  dom.readerTitle.textContent = resource.title;
  dom.readerMeta.textContent = isDocumentResource(resource)
    ? `${resource.fileName || resource.title} · Markdown · ${collectionNames}`
    : `${t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type} · ${collectionNames}`;
  dom.readerContent.innerHTML = isDocumentResource(resource)
    ? renderMarkdownToHtml(resource.rawContent || resource.detail || "")
    : renderGenericReaderHtml(resource);
  dom.readerOverlay.classList.remove("is-hidden");
}

function closeReader() {
  dom.readerOverlay.classList.add("is-hidden");
}

async function importMarkdownFiles(fileList) {
  const files = [...fileList].filter((file) => file.name.toLowerCase().endsWith(".md"));
  if (!files.length) {
    dom.actionFeedback.textContent = "褰撳墠鍙敮鎸佹嫋鍏?.md 鏂囨。銆?;
    return;
  }

  for (const file of files) {
    const text = await file.text();
    const id = `res-custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const titleFromHeading = text.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const title = titleFromHeading || file.name.replace(/\.md$/i, "");
    const summary = extractMarkdownSummary(text);
    resources.unshift({
      id,
      title,
      type: "knowledge",
      summary,
      tags: ["鏂囨。", "Markdown"],
      collections: [appState.activeCollection !== "all" ? appState.activeCollection : "collection-knowledge"],
      related: [appState.selectedResourceId].filter(Boolean),
      detail: summary,
      rawContent: text,
      fileName: file.name,
      sourceType: "markdown-file",
      preferredSlot: "context",
    });
    appState.selectedResourceId = id;
  }

  saveCustomResources();
  renderAll();
  dom.actionFeedback.textContent = `宸插惛鏀?${files.length} 浠?Markdown 鏂囨。锛屽苟鐢熸垚鏂囨。鍗°€俙;
}

function getAllTags() {
  return [...new Set(resources.flatMap((resource) => resource.tags))];
}

function triggerStageAnimation(element) {
  if (!element) return;
  element.classList.remove("is-entering");
  void element.offsetWidth;
  element.classList.add("is-entering");
}

function getLineKey(a, b) {
  return [a, b].sort().join("__");
}

function ensureGraphSvg(container, cache) {
  if (!cache.svg || !cache.svg.isConnected) {
    cache.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.appendChild(cache.svg);
  }
  return cache.svg;
}

function playFocusGhost(resource, sourceRect) {
  const detailTarget = dom.detailPanel.querySelector(".detail-block");
  if (!detailTarget || !sourceRect) return;
  const targetRect = detailTarget.getBoundingClientRect();
  const ghost = document.createElement("div");
  ghost.className = "focus-ghost";
  ghost.innerHTML = `
    <strong>${resource.title}</strong>
    <span>${typeMeta[resource.type] || resource.type}</span>
  `;
  ghost.style.left = `${sourceRect.left}px`;
  ghost.style.top = `${sourceRect.top}px`;
  ghost.style.width = `${sourceRect.width}px`;
  ghost.style.height = `${sourceRect.height}px`;
  document.body.appendChild(ghost);

  const deltaX = targetRect.left - sourceRect.left;
  const deltaY = targetRect.top - sourceRect.top;
  const scaleX = Math.max(targetRect.width / sourceRect.width, 0.72);
  const scaleY = Math.max(targetRect.height / sourceRect.height, 0.72);

  const animation = ghost.animate(
    [
      {
        transform: "translate3d(0, 0, 0) scale(1)",
        opacity: 0.92,
        filter: "blur(0px)",
      },
      {
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
        opacity: 0,
        filter: "blur(10px)",
      },
    ],
    {
      duration: 520,
      easing: "cubic-bezier(.22,1,.36,1)",
    },
  );

  animation.onfinish = () => ghost.remove();
}

function bindGraphProximity(container, type) {
  if (!container) return;
  container.addEventListener("mousemove", (event) => {
    const cache = graphState[type];
    let nearestId = null;
    let nearestDistance = Infinity;
    cache.nodes.forEach((node, id) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestId = id;
      }
    });
    setGraphHover(type, nearestDistance < 180 ? nearestId : null);
  });
  container.addEventListener("mouseleave", () => setGraphHover(type, null));
}

function setGraphHover(type, hoveredId) {
  const cache = graphState[type];
  cache.hoveredId = hoveredId;
  const container = type === "browser" ? dom.resourceMap : dom.graphStage;
  container.classList.toggle("is-hovering", Boolean(hoveredId));
  cache.nodes.forEach((node, id) => {
    const focused = id === hoveredId;
    const linked =
      hoveredId &&
      (getResourceById(hoveredId)?.related.includes(id) ||
        getResourceById(id)?.related.includes(hoveredId));
    node.classList.toggle("is-focused", focused || linked);
    node.classList.toggle("is-dim", Boolean(hoveredId) && !focused && !linked);
  });
  cache.lines.forEach((line, key) => {
    if (!hoveredId) {
      line.classList.remove("is-focused", "is-dim");
      return;
    }
    const isConnected = key.includes(hoveredId);
    line.classList.toggle("is-focused", isConnected);
    line.classList.toggle("is-dim", !isConnected);
  });
}

function populateCreateCollectionOptions() {
  if (!dom.createCollection) return;
  dom.createCollection.innerHTML = collections
    .filter((collection) => collection.id !== "all")
    .map((collection) => `<option value="${collection.id}">${collection.name}</option>`)
    .join("");
}

function applyLanguage() {
  document.documentElement.lang = appState.language === "en" ? "en" : "zh-CN";
  dom.languageToggleBtn.textContent = t("languageToggle");
  dom.resetWorkspaceBtn.textContent = t("resetWorkspace");
  dom.shuffleFocusBtn.textContent = t("shuffleFocus");
  dom.createCardBtn.textContent = t("createCard");
  dom.cardsViewBtn.textContent = t("cardsView");
  dom.graphViewBtn.textContent = t("graphView");
  dom.cancelCreateCardBtn.textContent = t("cancel");
  dom.submitCreateCardBtn.textContent =
    appState.editorMode === "edit" ? t("saveEdit") : t("saveCard");
  dom.searchInput.placeholder = t("searchPlaceholder");
  dom.createTitle.placeholder = t("titlePlaceholder");
  dom.createSummary.placeholder = t("summaryPlaceholder");
  dom.createTags.placeholder = t("tagsPlaceholder");
  dom.createDetail.placeholder = t("detailPlaceholder");
  document
    .querySelectorAll('.quick-action[data-action="workspace"]')
    .forEach((button) => (button.textContent = t("quickWorkspace")));
  document
    .querySelectorAll('.quick-action[data-action="copy"]')
    .forEach((button) => (button.textContent = t("quickCopy")));
  document
    .querySelectorAll('.quick-action[data-action="collection"]')
    .forEach((button) => (button.textContent = t("quickCollection")));
  document.querySelectorAll(".add-button").forEach((button) => {
    button.textContent = t("addToWorkspace");
  });
}

function resetCreateCardForm() {
  dom.createTitle.value = "";
  dom.createType.value = "knowledge";
  dom.createSummary.value = "";
  dom.createTags.value = "";
  dom.createDetail.value = "";
  dom.createCollection.selectedIndex = 0;
  appState.editorMode = "create";
  appState.editingResourceId = null;
  if (dom.submitCreateCardBtn) dom.submitCreateCardBtn.textContent = t("saveCard");
}

function toggleCreateCardPanel(forceOpen) {
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : dom.createCardPanel.classList.contains("is-hidden");
  dom.createCardPanel.classList.toggle("is-hidden", !shouldOpen);
  if (shouldOpen) {
    triggerStageAnimation(dom.createCardPanel);
    dom.createTitle.focus();
  }
}

function openEditCardPanel(resource) {
  if (!isCustomResource(resource)) return;
  appState.editorMode = "edit";
  appState.editingResourceId = resource.id;
  dom.createTitle.value = resource.title;
  dom.createType.value = resource.type;
  dom.createSummary.value = resource.summary;
  dom.createTags.value = resource.tags.join(", ");
  dom.createDetail.value = resource.detail;
  dom.createCollection.value = resource.collections[0] || "collection-profile";
  dom.submitCreateCardBtn.textContent = t("saveEdit");
  toggleCreateCardPanel(true);
}

function getFilteredResources() {
  const searchTerm = dom.searchInput.value.trim().toLowerCase();

  return resources.filter((resource) => {
    const matchesCollection =
      appState.activeCollection === "all" ||
      resource.collections.includes(appState.activeCollection);
    const matchesType =
      appState.activeType === "all" || resource.type === appState.activeType;
    const matchesTag =
      !appState.activeTag || resource.tags.includes(appState.activeTag);
    const searchIndex = [
      resource.title,
      resource.summary,
      resource.detail,
      resource.tags.join(" "),
      resource.collections
        .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
        .join(" "),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchTerm || searchIndex.includes(searchTerm);
    return matchesCollection && matchesType && matchesTag && matchesSearch;
  });
}

function getWorkspaceResourceIds() {
  return Object.values(appState.workspaceSlots).flat();
}

function renderProject() {
  dom.projectTitle.textContent = project.title;
  dom.projectDescription.textContent = project.description;
}

function renderCollections() {
  dom.collectionList.innerHTML = "";
  collections.forEach((collection) => {
    const item = document.createElement("button");
    item.className = `collection-item ${appState.activeCollection === collection.id ? "is-active" : ""}`;
    item.innerHTML = `
      <strong>${collection.name}</strong>
      <p>${collection.summary}</p>
    `;
    item.addEventListener("click", () => {
      appState.activeCollection = collection.id;
      renderAll();
      saveUiState();
    });
    dom.collectionList.appendChild(item);
  });
}

function renderTypeFilters() {
  const types = ["all", ...new Set(resources.map((resource) => resource.type))];
  dom.typeFilters.innerHTML = "";

  types.forEach((type) => {
    const chip = document.createElement("button");
    chip.className = `chip ${appState.activeType === type ? "is-active" : ""}`;
    chip.textContent = type === "all" ? t("types.all") : t(`types.${type}`) || typeMeta[type] || type;
    chip.addEventListener("click", () => {
      appState.activeType = type;
      renderAll();
      saveUiState();
    });
    dom.typeFilters.appendChild(chip);
  });
}

function renderTagCloud() {
  dom.tagCloud.innerHTML = "";
  getAllTags().forEach((tag) => {
    const chip = document.createElement("button");
    chip.className = `tag-filter ${appState.activeTag === tag ? "is-active" : ""}`;
    chip.textContent = `# ${tag}`;
    chip.addEventListener("click", () => {
      appState.activeTag = appState.activeTag === tag ? null : tag;
      renderAll();
      saveUiState();
    });
    dom.tagCloud.appendChild(chip);
  });
}

function addResourceToWorkspace(resourceId, targetSlot) {
  const resource = getResourceById(resourceId);
  if (!resource) return;
  const slot = targetSlot || resource.preferredSlot || "context";
  const slotItems = appState.workspaceSlots[slot];
  if (!slotItems.includes(resourceId)) {
    slotItems.push(resourceId);
  }
  updateSelection(resourceId);
  renderWorkspace();
  saveUiState();
}

function removeResourceFromWorkspace(slot, resourceId) {
  appState.workspaceSlots[slot] = appState.workspaceSlots[slot].filter((id) => id !== resourceId);
  renderWorkspace();
  renderGraphSmooth();
  renderMetrics();
  saveUiState();
}

function createCustomCard() {
  const title = dom.createTitle.value.trim();
  const summary = dom.createSummary.value.trim();
  const detail = dom.createDetail.value.trim();
  const collectionId = dom.createCollection.value;
  if (!title || !summary || !detail || !collectionId) {
    dom.actionFeedback.textContent = "璇疯嚦灏戣ˉ鍏ㄦ爣棰樸€佹憳瑕併€佽鎯呭拰闆嗗悎銆?;
    return;
  }

  const tags = dom.createTags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const wasEdit = appState.editorMode === "edit";
  if (appState.editorMode === "edit" && appState.editingResourceId) {
    const target = getResourceById(appState.editingResourceId);
    if (!target) return;
    target.title = title;
    target.type = dom.createType.value;
    target.summary = summary;
    target.tags = tags;
    target.collections = [collectionId];
    target.detail = detail;
    appState.selectedResourceId = target.id;
  } else {
    const id = `res-custom-${Date.now()}`;
    resources.unshift({
      id,
      title,
      type: dom.createType.value,
      summary,
      tags,
      collections: [collectionId],
      related: [appState.selectedResourceId].filter(Boolean),
      detail,
      preferredSlot: "context",
    });
    appState.selectedResourceId = id;
  }

  appState.activeCollection = "all";
  appState.activeType = "all";
  appState.activeTag = null;
  resetCreateCardForm();
  toggleCreateCardPanel(false);
  saveCustomResources();
  renderAll();
  dom.actionFeedback.textContent =
    wasEdit
      ? `宸叉洿鏂板崱鐗囥€?{title}銆嶃€俙
      : `宸插垱寤烘柊鍗＄墖銆?{title}銆嶏紝鐜板湪鍙互缁х画鎷栧叆宸ヤ綔鍙般€俙;
  saveUiState();
}

function deleteCustomCard(resourceId) {
  const index = resources.findIndex((resource) => resource.id === resourceId);
  if (index === -1) return;
  const [removed] = resources.splice(index, 1);
  Object.keys(appState.workspaceSlots).forEach((slotKey) => {
    appState.workspaceSlots[slotKey] = appState.workspaceSlots[slotKey].filter((id) => id !== resourceId);
  });
  resources.forEach((resource) => {
    resource.related = resource.related.filter((id) => id !== resourceId);
  });
  if (appState.selectedResourceId === resourceId) {
    appState.selectedResourceId = resources[0]?.id || null;
  }
  if (appState.editingResourceId === resourceId) {
    resetCreateCardForm();
    toggleCreateCardPanel(false);
  }
  saveCustomResources();
  renderAll();
  dom.actionFeedback.textContent = `宸插垹闄ゅ崱鐗囥€?{removed.title}銆嶃€俙;
  saveUiState();
}

let cardHoverFrame = null;

function clearCardProximityState() {
  document.querySelectorAll(".resource-card.is-proximity-floating").forEach((card) => {
    card.classList.remove("is-proximity-floating");
  });
}

function bindCardProximity() {
  if (!dom.resourceGrid) return;
  dom.resourceGrid.addEventListener("mousemove", (event) => {
    if (cardHoverFrame) cancelAnimationFrame(cardHoverFrame);
    cardHoverFrame = requestAnimationFrame(() => {
      const cards = [...dom.resourceGrid.querySelectorAll(".resource-card")];
      let nearestCard = null;
      let nearestDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestCard = card;
        }
      });

      clearCardProximityState();
      if (nearestCard && nearestDistance < 180) {
        nearestCard.classList.add("is-proximity-floating");
      }
    });
  });

  dom.resourceGrid.addEventListener("mouseleave", () => {
    if (cardHoverFrame) cancelAnimationFrame(cardHoverFrame);
    clearCardProximityState();
  });
}

function bindMarkdownImport() {
  const panel = dom.resourceBrowserPanel;
  if (!panel) return;

  panel.addEventListener("dragenter", (event) => {
    const hasFile = [...(event.dataTransfer?.items || [])].some((item) => item.kind === "file");
    if (!hasFile) return;
    dragState.active = true;
    setBrowserDropState(true);
    const firstFile = event.dataTransfer?.files?.[0];
    showFileGhost(firstFile?.name || "Markdown 鏂囨。", event.clientX, event.clientY);
  });

  panel.addEventListener("dragover", (event) => {
    if (!dragState.active) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setBrowserDropState(true);
    const firstFile = event.dataTransfer?.files?.[0];
    if (firstFile) {
      showFileGhost(firstFile.name, event.clientX, event.clientY);
    } else {
      updateGhostCardPosition(event.clientX, event.clientY);
    }
  });

  panel.addEventListener("dragleave", (event) => {
    if (!dragState.active) return;
    if (panel.contains(event.relatedTarget)) return;
    dragState.active = false;
    setBrowserDropState(false);
    hideFileGhost();
  });

  panel.addEventListener("drop", async (event) => {
    event.preventDefault();
    dragState.active = false;
    setBrowserDropState(false);
    hideFileGhost();
    await importMarkdownFiles(event.dataTransfer?.files || []);
  });

  dom.readerBackdrop.addEventListener("click", closeReader);
  dom.closeReaderBtn.addEventListener("click", closeReader);
}

function renderResourceGrid() {
  const filtered = getFilteredResources();
  dom.resourceGrid.innerHTML = "";
  dom.resultCountLabel.textContent = `鍏?${filtered.length} 寮犺祫婧愬崱`;

  filtered.forEach((resource) => {
    const card = dom.cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.resourceId = resource.id;
    card.classList.toggle("is-selected", resource.id === appState.selectedResourceId);
    card.classList.toggle("is-document", isDocumentResource(resource));
    if (resource.id === appState.selectedResourceId && isDocumentResource(resource)) {
      card.classList.add("is-materializing");
    }
    card.querySelector(".resource-card__type").textContent = t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type;
    card.querySelector(".resource-card__title").textContent = resource.title;
    card.querySelector(".resource-card__summary").textContent = resource.summary;

    const tagRow = card.querySelector(".tag-row");
    resource.tags.slice(0, 3).forEach((tag) => {
      const tagPill = document.createElement("span");
      tagPill.className = "tag-pill";
      tagPill.textContent = `#${tag}`;
      tagRow.appendChild(tagPill);
    });

    const collectionRow = card.querySelector(".collection-row");
    resource.collections.forEach((collectionId) => {
      const collection = collections.find((item) => item.id === collectionId);
      if (!collection) return;
      const pill = document.createElement("span");
      pill.className = "collection-pill";
      pill.textContent = collection.name;
      collectionRow.appendChild(pill);
    });

    card.addEventListener("click", () => {
      updateSelection(resource.id, card);
    });

    card.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      openResourceReader(resource);
    });

    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", resource.id);
      event.dataTransfer.effectAllowed = "move";
      appState.selectedResourceId = resource.id;
    });

    card.querySelector(".add-button").addEventListener("click", (event) => {
      event.stopPropagation();
      addResourceToWorkspace(resource.id);
      dom.actionFeedback.textContent = `宸叉妸銆?{resource.title}銆嶅姞鍏?${slotLabels[resource.preferredSlot] || "宸ヤ綔鍙?}銆俙;
    });

    dom.resourceGrid.appendChild(card);
  });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "state-empty";
    empty.textContent = "娌℃湁鍖归厤鍒拌祫婧愶紝璇曡瘯鍒囨崲闆嗗悎銆佹竻绌烘爣绛撅紝鎴栬€呮悳绱㈠埆鐨勫叧閿瘝銆?;
    dom.resourceGrid.appendChild(empty);
  }
  applyLanguage();
}

function renderBrowserGraph() {
  const filtered = getFilteredResources();
  const cache = graphState.browser;
  const svg = ensureGraphSvg(dom.resourceMap, cache);

  if (!filtered.length) {
    dom.resourceMap.innerHTML =
      '<div class="browser-graph-empty">褰撳墠绛涢€夋潯浠朵笅娌℃湁璧勬簮鍙互鏋勬垚鍥捐氨锛岃瘯鐫€鏀惧闆嗗悎銆佺被鍨嬫垨鏍囩绛涢€夈€?/div>';
    cache.nodes.clear();
    cache.lines.clear();
    cache.svg = null;
    return;
  }

  const selected = filtered.find((item) => item.id === appState.selectedResourceId) || filtered[0];
  const selectedIndex = filtered.findIndex((item) => item.id === selected.id);
  if (selectedIndex > 0) {
    filtered.splice(selectedIndex, 1);
    filtered.unshift(selected);
  }

  const positions = new Map();
  positions.set(selected.id, { x: 50, y: 50 });

  const others = filtered.slice(1);
  others.forEach((resource, index) => {
    const angle = (-90 + (360 / Math.max(others.length, 1)) * index) * (Math.PI / 180);
    const radiusX = others.length > 4 ? 34 : 28;
    const radiusY = others.length > 4 ? 37 : 30;
    positions.set(resource.id, {
      x: 50 + Math.cos(angle) * radiusX,
      y: 50 + Math.sin(angle) * radiusY,
    });
  });

  const activeLineKeys = new Set();
  filtered.forEach((resource) => {
    resource.related
      .filter((targetId) => positions.has(targetId))
      .forEach((targetId) => {
        if (resource.id > targetId) return;
        const lineKey = getLineKey(resource.id, targetId);
        activeLineKeys.add(lineKey);
        let line = cache.lines.get(lineKey);
        if (!line) {
          line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.classList.add("graph-line");
          line.style.transition = "all 280ms cubic-bezier(.22,1,.36,1)";
          cache.lines.set(lineKey, line);
          svg.appendChild(line);
        }
        const from = positions.get(resource.id);
        const to = positions.get(targetId);
        line.setAttribute("x1", `${from.x}%`);
        line.setAttribute("y1", `${from.y}%`);
        line.setAttribute("x2", `${to.x}%`);
        line.setAttribute("y2", `${to.y}%`);
        line.setAttribute(
          "stroke",
          resource.id === selected.id || targetId === selected.id
            ? "rgba(141, 184, 255, 0.42)"
            : "rgba(255,255,255,0.1)",
        );
        line.setAttribute("stroke-width", resource.id === selected.id || targetId === selected.id ? "1.6" : "1");
      });
  });

  const activeNodeIds = new Set();
  filtered.forEach((resource) => {
    activeNodeIds.add(resource.id);
    let node = cache.nodes.get(resource.id);
    const isSelected = resource.id === selected.id;
    const isLinked = selected.related.includes(resource.id);
    if (!node) {
      node = document.createElement("button");
      node.className = "browser-graph-node";
      node.addEventListener("mouseenter", () => setGraphHover("browser", resource.id));
      node.addEventListener("mouseleave", () => setGraphHover("browser", null));
      node.addEventListener("click", () => updateSelection(resource.id, node));
      cache.nodes.set(resource.id, node);
      dom.resourceMap.appendChild(node);
    }
    node.classList.toggle("is-selected", isSelected);
    node.classList.toggle("is-linked", isLinked);
    node.style.left = `${positions.get(resource.id).x}%`;
    node.style.top = `${positions.get(resource.id).y}%`;
    node.innerHTML = `
      <strong>${resource.title}</strong>
      <span>${t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type}</span>
    `;
  });

  [...cache.nodes.keys()].forEach((id) => {
    if (!activeNodeIds.has(id)) {
      cache.nodes.get(id)?.remove();
      cache.nodes.delete(id);
    }
  });

  [...cache.lines.keys()].forEach((key) => {
    if (!activeLineKeys.has(key)) {
      cache.lines.get(key)?.remove();
      cache.lines.delete(key);
    }
  });

  triggerStageAnimation(dom.resourceMap);
  setGraphHover("browser", cache.hoveredId);
}

function renderBrowserView() {
  const graphMode = appState.activeView === "graph";
  dom.cardsView.classList.toggle("is-hidden", graphMode);
  dom.graphView.classList.toggle("is-hidden", !graphMode);
  dom.cardsViewBtn.classList.toggle("is-active", !graphMode);
  dom.graphViewBtn.classList.toggle("is-active", graphMode);

  if (graphMode) {
    dom.resultCountLabel.textContent = `鍥捐氨鍐?${getFilteredResources().length} 涓妭鐐筦;
    renderBrowserGraph();
  } else {
    triggerStageAnimation(dom.cardsView);
  }
}

function renderWorkspaceSlot(slotKey, host) {
  host.innerHTML = "";
  const items = appState.workspaceSlots[slotKey].map(getResourceById).filter(Boolean);

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-slot";
    empty.textContent = "鎶婄浉鍏宠祫婧愭嫋杩涙潵锛屾垨鑰呭厛鍦ㄨ祫婧愬崱涓婄偣鈥滃姞鍏ュ伐浣滃彴鈥濄€?;
    host.appendChild(empty);
  } else {
    items.forEach((resource) => {
      const chip = document.createElement("div");
      chip.className = "slot-chip";
      chip.innerHTML = `
        <span>${resource.title}</span>
        <button title="绉婚櫎">脳</button>
      `;
      chip.addEventListener("click", () => {
        updateSelection(resource.id);
      });
      chip.addEventListener("dblclick", () => removeResourceFromWorkspace(slotKey, resource.id));
      chip.querySelector("button").addEventListener("click", (event) => {
        event.stopPropagation();
        removeResourceFromWorkspace(slotKey, resource.id);
      });
      host.appendChild(chip);
    });
  }

  const slotContainer = host.closest(".workspace-slot");
  slotContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
    slotContainer.classList.add("is-over");
  });
  slotContainer.addEventListener("dragleave", () => slotContainer.classList.remove("is-over"));
  slotContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    slotContainer.classList.remove("is-over");
    const resourceId = event.dataTransfer.getData("text/plain");
    addResourceToWorkspace(resourceId, slotKey);
    const resource = getResourceById(resourceId);
    if (resource) {
      dom.actionFeedback.textContent = `宸叉妸銆?{resource.title}銆嶆斁鍏?${slotLabels[slotKey]}銆俙;
    }
  });
}

function renderWorkspace() {
  renderWorkspaceSlot("context", dom.slotContext);
  renderWorkspaceSlot("engine", dom.slotEngine);
  renderWorkspaceSlot("output", dom.slotOutput);
}

function renderDetail() {
  const selected = getSelectedResource();
  const actionParts = [];
  actionParts.push(`      <button class="ghost-button compact-button" id="openReaderBtn">${t("openReader")}</button>`,);
  if (isCustomResource(selected)) {
    actionParts.push(
      `<button class="ghost-button compact-button" id="editCustomCardBtn">${t("detailEdit")}</button>`,
      `<button class="ghost-button compact-button danger-button" id="deleteCustomCardBtn">${t("detailDelete")}</button>`,
    );
  }
  const actionMarkup = actionParts.length
    ? `<div class="detail-actions">${actionParts.join("")}</div>`
    : "";
  dom.detailTypeBadge.textContent = t(`types.${selected.type}`) || typeMeta[selected.type] || selected.type;
  dom.detailPanel.innerHTML = `
    <article class="detail-block">
      <h2>${selected.title}</h2>
      <p>${selected.detail}</p>
      ${actionMarkup}
      <div class="detail-meta">
        <div class="detail-meta-row">
          <span>寤鸿浣嶇疆</span>
          <strong>${slotLabels[selected.preferredSlot]}</strong>
        </div>
        <div class="detail-meta-row">
          <span>鏍囩</span>
          ${selected.tags.map((tag) => `<span class="tag-pill">#${tag}</span>`).join("")}
        </div>
        <div class="detail-meta-row">
          <span>褰掑睘闆嗗悎</span>
          ${selected.collections
            .map((collectionId) => {
              const collection = collections.find((item) => item.id === collectionId);
              return collection ? `<span class="collection-pill">${collection.name}</span>` : "";
            })
            .join("")}
        </div>
      </div>
    </article>
  `;
  const readerBtn = document.getElementById("openReaderBtn");
  const editBtn = document.getElementById("editCustomCardBtn");
  const deleteBtn = document.getElementById("deleteCustomCardBtn");
  if (readerBtn) readerBtn.addEventListener("click", () => openResourceReader(selected));
  if (editBtn) editBtn.addEventListener("click", () => openEditCardPanel(selected));
  if (deleteBtn) deleteBtn.addEventListener("click", () => deleteCustomCard(selected.id));
  triggerStageAnimation(dom.detailPanel);
}

function renderGraph() {
  const selected = getSelectedResource();
  const relatedResources = selected.related.map(getResourceById).filter(Boolean);
  const workspaceIds = new Set(getWorkspaceResourceIds());

  dom.graphStage.innerHTML = "";

  if (!selected) {
    dom.graphStage.innerHTML = `<div class="state-empty">閫夋嫨涓€寮犺祫婧愬崱鍚庯紝杩欓噷浼氭樉绀哄洿缁曞畠灞曞紑鐨勫眬閮ㄥ浘璋便€?/div>`;
    return;
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  dom.graphStage.appendChild(svg);

  const center = { x: 50, y: 48 };
  const relatedPositions = relatedResources.map((resource, index) => {
    const angle = (-90 + (360 / Math.max(relatedResources.length, 1)) * index) * (Math.PI / 180);
    return {
      resource,
      x: 50 + Math.cos(angle) * 32,
      y: 48 + Math.sin(angle) * 30,
    };
  });

  relatedPositions.forEach(({ x, y }) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${center.x}%`);
    line.setAttribute("y1", `${center.y}%`);
    line.setAttribute("x2", `${x}%`);
    line.setAttribute("y2", `${y}%`);
    line.setAttribute("stroke", "rgba(116, 180, 255, 0.3)");
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-dasharray", "5 7");
    svg.appendChild(line);
  });

  const workspaceExtras = resources
    .filter((resource) => workspaceIds.has(resource.id) && resource.id !== selected.id && !selected.related.includes(resource.id))
    .slice(0, 2);

  createGraphNode(selected, center.x, center.y, "primary");
  relatedPositions.forEach(({ resource, x, y }) => {
    createGraphNode(resource, x, y, workspaceIds.has(resource.id) ? "workspace" : "secondary");
  });

  workspaceExtras.forEach((resource, index) => {
    const x = 18 + index * 64;
    const y = 84;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${center.x}%`);
    line.setAttribute("y1", `${center.y}%`);
    line.setAttribute("x2", `${x}%`);
    line.setAttribute("y2", `${y}%`);
    line.setAttribute("stroke", "rgba(255, 207, 117, 0.22)");
    line.setAttribute("stroke-width", "1.5");
    svg.appendChild(line);
    createGraphNode(resource, x, y, "workspace");
  });

  triggerStageAnimation(dom.graphStage);
}

function createGraphNode(resource, x, y, variant) {
  const node = document.createElement("button");
  node.className = `graph-node ${variant}`;
  node.style.left = `${x}%`;
  node.style.top = `${y}%`;
  node.innerHTML = `<span>${resource.title}</span>`;
  node.addEventListener("click", () => {
    updateSelection(resource.id);
  });
  dom.graphStage.appendChild(node);
}

function renderGraphSmooth() {
  const selected = getSelectedResource();
  const cache = graphState.local;
  const workspaceIds = new Set(getWorkspaceResourceIds());

  if (!selected) return;

  dom.graphStage.querySelector(".state-empty")?.remove();
  const svg = ensureGraphSvg(dom.graphStage, cache);

  const center = { x: 50, y: 48 };
  const related = selected.related.map(getResourceById).filter(Boolean);
  const activeNodes = new Map([[selected.id, { x: center.x, y: center.y, variant: "primary" }]]);
  const activeLineKeys = new Set();

  related.forEach((resource, index) => {
    const angle = (-90 + (360 / Math.max(related.length, 1)) * index) * (Math.PI / 180);
    const x = 50 + Math.cos(angle) * 32;
    const y = 48 + Math.sin(angle) * 30;
    activeNodes.set(resource.id, {
      x,
      y,
      variant: workspaceIds.has(resource.id) ? "workspace" : "secondary",
    });
    const lineKey = getLineKey(selected.id, resource.id);
    activeLineKeys.add(lineKey);
    let line = cache.lines.get(lineKey);
    if (!line) {
      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.classList.add("graph-line");
      line.style.transition = "all 320ms cubic-bezier(.22,1,.36,1)";
      cache.lines.set(lineKey, line);
      svg.appendChild(line);
    }
    line.setAttribute("x1", `${center.x}%`);
    line.setAttribute("y1", `${center.y}%`);
    line.setAttribute("x2", `${x}%`);
    line.setAttribute("y2", `${y}%`);
    line.setAttribute("stroke", "rgba(116, 180, 255, 0.3)");
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-dasharray", "5 7");
  });

  const workspaceExtras = resources
    .filter((resource) => workspaceIds.has(resource.id) && resource.id !== selected.id && !selected.related.includes(resource.id))
    .slice(0, 2);

  workspaceExtras.forEach((resource, index) => {
    const x = 18 + index * 64;
    const y = 84;
    activeNodes.set(resource.id, { x, y, variant: "workspace" });
    const lineKey = getLineKey(selected.id, resource.id);
    activeLineKeys.add(lineKey);
    let line = cache.lines.get(lineKey);
    if (!line) {
      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.classList.add("graph-line");
      line.style.transition = "all 320ms cubic-bezier(.22,1,.36,1)";
      cache.lines.set(lineKey, line);
      svg.appendChild(line);
    }
    line.setAttribute("x1", `${center.x}%`);
    line.setAttribute("y1", `${center.y}%`);
    line.setAttribute("x2", `${x}%`);
    line.setAttribute("y2", `${y}%`);
    line.setAttribute("stroke", "rgba(255, 207, 117, 0.22)");
    line.setAttribute("stroke-width", "1.5");
  });

  activeNodes.forEach((config, id) => {
    let node = cache.nodes.get(id);
    const resource = getResourceById(id);
    if (!node) {
      node = document.createElement("button");
      node.className = "graph-node";
      node.addEventListener("mouseenter", () => setGraphHover("local", id));
      node.addEventListener("mouseleave", () => setGraphHover("local", null));
      node.addEventListener("click", () => updateSelection(id, node));
      cache.nodes.set(id, node);
      dom.graphStage.appendChild(node);
    }
    node.className = `graph-node ${config.variant}`;
    node.style.left = `${config.x}%`;
    node.style.top = `${config.y}%`;
    node.innerHTML = `<span>${resource.title}</span>`;
  });

  [...cache.nodes.keys()].forEach((id) => {
    if (!activeNodes.has(id)) {
      cache.nodes.get(id)?.remove();
      cache.nodes.delete(id);
    }
  });

  [...cache.lines.keys()].forEach((key) => {
    if (!activeLineKeys.has(key)) {
      cache.lines.get(key)?.remove();
      cache.lines.delete(key);
    }
  });

  setGraphHover("local", cache.hoveredId);
}

function syncCardSelectionState() {
  document.querySelectorAll(".resource-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.resourceId === appState.selectedResourceId);
  });
}

function updateSelection(resourceId, sourceEl) {
  if (!resourceId || resourceId === appState.selectedResourceId) return;
  const sourceRect = sourceEl?.getBoundingClientRect?.();
  const resource = getResourceById(resourceId);
  appState.selectedResourceId = resourceId;
  syncCardSelectionState();
  if (appState.activeView === "graph") {
    renderBrowserGraph();
  }
  renderDetail();
  renderGraphSmooth();
  renderMetrics();
  if (sourceRect && resource) {
    requestAnimationFrame(() => playFocusGhost(resource, sourceRect));
  }
  saveUiState();
}

function renderMetrics() {
  const filtered = getFilteredResources();
  const selected = getSelectedResource();
  const activeCollectionCount =
    appState.activeCollection === "all"
      ? collections.length - 1
      : new Set(filtered.flatMap((resource) => resource.collections)).size;

  dom.metricResources.textContent = filtered.length.toString().padStart(2, "0");
  dom.metricCollections.textContent = String(activeCollectionCount).padStart(2, "0");
  dom.metricLinks.textContent = String(selected.related.length).padStart(2, "0");
}

function bindQuickActions() {
  document.querySelectorAll(".quick-action").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = getSelectedResource();
      const action = button.dataset.action;
      if (!selected) return;

      if (action === "workspace") {
        addResourceToWorkspace(selected.id);
        dom.actionFeedback.textContent = `宸插皢銆?{selected.title}銆嶅姞鍏ュ伐浣滃彴銆俙;
      } else if (action === "copy") {
        dom.actionFeedback.textContent = `妯℃嫙澶嶅埗锛?{selected.title} 宸插噯澶囧彂閫佺粰鍏朵粬 AI銆俙;
      } else if (action === "collection") {
        const collectionNames = selected.collections
          .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
          .filter(Boolean)
          .join(" / ");
        dom.actionFeedback.textContent = `銆?{selected.title}銆嶅綋鍓嶅綊灞烇細${collectionNames}銆俙;
      }
    });
  });
}

function bindTopbarActions() {
  dom.searchInput.addEventListener("input", () => {
    renderAll();
    saveUiState();
  });

  dom.languageToggleBtn.addEventListener("click", () => {
    appState.language = appState.language === "zh" ? "en" : "zh";
    applyLanguage();
    renderAll();
    saveUiState();
  });

  dom.createCardBtn.addEventListener("click", () => {
    toggleCreateCardPanel();
  });

  dom.cancelCreateCardBtn.addEventListener("click", () => {
    resetCreateCardForm();
    toggleCreateCardPanel(false);
  });

  dom.submitCreateCardBtn.addEventListener("click", createCustomCard);

  dom.cardsViewBtn.addEventListener("click", () => {
    appState.activeView = "cards";
    renderBrowserView();
    dom.resultCountLabel.textContent = `鍏?${getFilteredResources().length} 寮犺祫婧愬崱`;
    saveUiState();
  });

  dom.graphViewBtn.addEventListener("click", () => {
    appState.activeView = "graph";
    renderBrowserView();
    saveUiState();
  });

  dom.shuffleFocusBtn.addEventListener("click", () => {
    const filtered = getFilteredResources();
    if (!filtered.length) return;
    const next = filtered[Math.floor(Math.random() * filtered.length)];
    appState.selectedResourceId = next.id;
    renderAll();
    dom.actionFeedback.textContent = `宸查殢鏈鸿仛鐒﹁祫婧愩€?{next.title}銆嶃€俙;
    saveUiState();
  });

  dom.resetWorkspaceBtn.addEventListener("click", () => {
    appState.activeCollection = "all";
    appState.activeType = "all";
    appState.activeTag = null;
    dom.searchInput.value = "";
    appState.workspaceSlots = {
      context: ["res-profile-core", "res-brand-brief"],
      engine: ["res-prompt-system", "res-agent-playbook"],
      output: ["res-video-script-pack"],
    };
    appState.selectedResourceId = "res-prompt-system";
    renderAll();
    dom.actionFeedback.textContent = "宸叉仮澶嶉粯璁ゅ伐浣滃彴缂栨帓銆?;
    saveUiState();
  });
}

function renderAll() {
  const filtered = getFilteredResources();
  if (filtered.length && !filtered.some((resource) => resource.id === appState.selectedResourceId)) {
    appState.selectedResourceId = filtered[0].id;
  }
  renderCollections();
  renderTypeFilters();
  renderTagCloud();
  renderResourceGrid();
  renderBrowserView();
  renderWorkspace();
  renderDetail();
  renderGraphSmooth();
  renderMetrics();
}

function init() {
  const savedUiState = loadUiState();
  if (savedUiState) {
    appState.language = savedUiState.language || appState.language;
    appState.activeCollection = savedUiState.activeCollection || appState.activeCollection;
    appState.activeType = savedUiState.activeType || appState.activeType;
    appState.activeTag = savedUiState.activeTag ?? appState.activeTag;
    appState.activeView = savedUiState.activeView || appState.activeView;
    appState.selectedResourceId = savedUiState.selectedResourceId || appState.selectedResourceId;
    if (savedUiState.workspaceSlots) {
      appState.workspaceSlots = savedUiState.workspaceSlots;
    }
  }
  resources = [...baseResources, ...loadCustomResources()];
  populateCreateCollectionOptions();
  resetCreateCardForm();
  dom.createCardPanel.classList.add("is-hidden");
  if (savedUiState?.searchValue) {
    dom.searchInput.value = savedUiState.searchValue;
  }
  renderProject();
  bindQuickActions();
  bindTopbarActions();
  bindGraphProximity(dom.resourceMap, "browser");
  bindGraphProximity(dom.graphStage, "local");
  bindCardProximity();
  bindMarkdownImport();
  applyLanguage();
  renderAll();
}

init();


