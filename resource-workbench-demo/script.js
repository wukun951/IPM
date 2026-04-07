const appState = {
  language: "zh",
  activeCollection: "all",
  activeType: "all",
  activeTag: null,
  activeView: "cards",
  selectedResourceId: "res-prompt-system",
  graphGpuAccelerationEnabled: true,
  editorMode: "create",
  editingResourceId: null,
  collectionEditorMode: "create",
  editingCollectionId: null,
  workspaceSlotEditorMode: "create",
  editingWorkspaceSlotId: null,
  workspaceSlots: {
    context: ["res-profile-core", "res-brand-brief"],
    engine: ["res-prompt-system", "res-agent-playbook"],
    output: ["res-video-script-pack"],
  },
  customWorkspaceSlots: [],
};

const project = {
  id: "project-ip-studio",
  title: "AI 创作控制台",
  description:
    "把个人资料、知识结论、提示词系统、Agent 协同规则和脚本产出整合到一个可调用、可联动、可复用的工作空间里。",
};

const baseCollections = [
  {
    id: "all",
    name: "全部资源",
    summary: "浏览整个资源宇宙，适合全局搜索和随机召回。",
  },
  {
    id: "collection-profile",
    name: "个人资料库",
    summary: "人设、价值观、表达风格和项目背景。",
  },
  {
    id: "collection-knowledge",
    name: "知识资料库",
    summary: "从对话和实践中提炼出的稳定知识结论。",
  },
  {
    id: "collection-video",
    name: "视频提示词系统",
    summary: "视频提示词、镜头语言、脚本工程和产出模板。",
  },
  {
    id: "collection-agent",
    name: "Agent 协同知识库",
    summary: "角色分工、协作协议、上下文传递与复盘策略。",
  },
];

let collections = [...baseCollections];

const STORAGE_KEYS = {
  customResources: "resourceWorkbench.customResources.v1",
  customCollections: "resourceWorkbench.customCollections.v1",
  resourceOverrides: "resourceWorkbench.resourceOverrides.v1",
  uiState: "resourceWorkbench.uiState.v1",
  resourceMeta: "resourceWorkbench.resourceMeta.v1",
  searchPrefs: "resourceWorkbench.searchPrefs.v1",
  relationEdges: "resourceWorkbench.relationEdges.v1",
};

const baseResources = [
  {
    id: "res-profile-core",
    title: "个人设定主档",
    type: "profile",
    summary:
      "汇总你的角色定位、表达偏好、视觉品位、长期目标和内容边界，是所有生成任务的顶层上下文。",
    tags: ["人设", "长期资产", "上下文"],
    collections: ["collection-profile"],
    related: ["res-brand-brief", "res-prompt-system", "res-agent-playbook"],
    detail:
      "这张资源卡代表整个系统的人格原点。它不直接产出内容，但会持续影响所有脚本、提示词和协作规则的措辞、审美和目标导向。",
    preferredSlot: "context",
  },
  {
    id: "res-brand-brief",
    title: "内容品牌说明书",
    type: "knowledge",
    summary:
      "从多轮对话沉淀出的品牌语气、价值主张、受众感知和差异化策略，用于统一内容输出调性。",
    tags: ["品牌", "定位", "知识结论"],
    collections: ["collection-profile", "collection-knowledge"],
    related: ["res-profile-core", "res-video-script-pack", "res-workflow-review"],
    detail:
      "它把零散聊天中的判断收束成可执行的品牌语言规则，适合在任何内容任务开始前被自动注入。",
    preferredSlot: "context",
  },
  {
    id: "res-prompt-system",
    title: "视频提示词脚本工程系统",
    type: "prompt",
    summary:
      "把视频生成任务拆成角色、镜头、时长、画面状态、叙事层级的结构化模板，是当前工作台的核心引擎资源。",
    tags: ["提示词", "视频", "工程系统"],
    collections: ["collection-video"],
    related: ["res-video-script-pack", "res-brand-brief", "res-shot-language", "res-profile-core"],
    detail:
      "这张卡不是一句提示词，而是一整套可变量化的提示词工程框架。它适合作为引擎槽中的主驱动资源，连接上游上下文和下游输出。",
    preferredSlot: "engine",
  },
  {
    id: "res-video-script-pack",
    title: "短视频脚本模板包",
    type: "script",
    summary:
      "包含开场钩子、信息推进、转折、收束和 CTA 模板，可与提示词系统和品牌说明书组合生成成片脚本。",
    tags: ["脚本", "短视频", "输出"],
    collections: ["collection-video"],
    related: ["res-prompt-system", "res-shot-language", "res-workflow-review"],
    detail:
      "它承担最后一公里的落地作用。当前工作台里它更像输出层资源：吸收规则后转为面向视频创作的成品结构。",
    preferredSlot: "output",
  },
  {
    id: "res-shot-language",
    title: "镜头语言备忘录",
    type: "knowledge",
    summary:
      "收录运镜表达、景别切换、画面状态描述方式和常见误区，用于提升视频提示词的镜头质感。",
    tags: ["镜头", "术语", "知识资料"],
    collections: ["collection-video", "collection-knowledge"],
    related: ["res-prompt-system", "res-video-script-pack"],
    detail:
      "这是偏参考型资源，不一定总在工作台里，但一旦需要升级画面表达，它会快速成为局部图谱里的高频辅助节点。",
    preferredSlot: "engine",
  },
  {
    id: "res-agent-playbook",
    title: "Agent 协同作战手册",
    type: "agent_rule",
    summary:
      "定义研究、创作、审校、执行等 Agent 的职责边界、输入输出格式和上下文交接规范。",
    tags: ["Agent", "协作", "规则"],
    collections: ["collection-agent"],
    related: ["res-profile-core", "res-workflow-review", "res-prompt-system"],
    detail:
      "这张卡更偏系统规则层。它适合和提示词引擎并排存在，确保资源不是孤立调用，而是进入可协同的生产流程。",
    preferredSlot: "engine",
  },
  {
    id: "res-workflow-review",
    title: "项目复盘工作流",
    type: "workflow",
    summary:
      "把任务完成后的复盘拆成输入、决策、结果、偏差和可复用资产提炼五个阶段，让资源持续自我增殖。",
    tags: ["工作流", "复盘", "沉淀"],
    collections: ["collection-agent", "collection-knowledge"],
    related: ["res-agent-playbook", "res-brand-brief", "res-video-script-pack"],
    detail:
      "它连接的是系统长期成长能力。对你这个产品来说，复盘工作流会把临时聊天内容重新提炼成新的结构化资源。",
    preferredSlot: "output",
  },
];

const baseResourceBlueprints = baseResources.map((resource) => ({
  ...resource,
  tags: [...resource.tags],
  collections: [...resource.collections],
  related: [...resource.related],
}));

const DEFAULT_WORKSPACE_SLOT_DEFS = [
  { id: "context", label: "上下文槽", description: "项目背景 / 人设 / 约束" },
  { id: "engine", label: "引擎槽", description: "提示词模板 / 工作流 / Agent 规则" },
  { id: "output", label: "输出槽", description: "脚本 / 结构化知识 / 最终产物" },
];

const DEFAULT_SEARCH_PREFS = {
  sortMode: "relevance",
  includeRawContent: true,
  importParseMode: "light",
};

let resources = [...baseResources];
let resourceMeta = {};
let searchPrefs = { ...DEFAULT_SEARCH_PREFS };
let relationEdges = [];

const dom = {
  projectTitle: document.getElementById("projectTitle"),
  projectDescription: document.getElementById("projectDescription"),
  collectionList: document.getElementById("collectionList"),
  createCollectionBtn: document.getElementById("createCollectionBtn"),
  exportCollectionBtn: document.getElementById("exportCollectionBtn"),
  createCollectionPanel: document.getElementById("createCollectionPanel"),
  createCollectionTitle: document.getElementById("createCollectionTitle"),
  createCollectionSummary: document.getElementById("createCollectionSummary"),
  cancelCreateCollectionBtn: document.getElementById("cancelCreateCollectionBtn"),
  submitCreateCollectionBtn: document.getElementById("submitCreateCollectionBtn"),
  createWorkspaceSlotBtn: document.getElementById("createWorkspaceSlotBtn"),
  exportWorkspaceBtn: document.getElementById("exportWorkspaceBtn"),
  createWorkspaceSlotPanel: document.getElementById("createWorkspaceSlotPanel"),
  createWorkspaceSlotTitle: document.getElementById("createWorkspaceSlotTitle"),
  createWorkspaceSlotDescription: document.getElementById("createWorkspaceSlotDescription"),
  cancelCreateWorkspaceSlotBtn: document.getElementById("cancelCreateWorkspaceSlotBtn"),
  submitCreateWorkspaceSlotBtn: document.getElementById("submitCreateWorkspaceSlotBtn"),
  typeFilters: document.getElementById("typeFilters"),
  tagCloud: document.getElementById("tagCloud"),
  resourceGrid: document.getElementById("resourceGrid"),
  resourceBrowserPanel: document.getElementById("resourceBrowserPanel"),
  dropIndicator: document.getElementById("dropIndicator"),
  fileGhostCard: document.getElementById("fileGhostCard"),
  resourceMap: document.getElementById("resourceMap"),
  cardsView: document.getElementById("cardsView"),
  graphView: document.getElementById("graphView"),
  importFileBtn: document.getElementById("importFileBtn"),
  importFileInput: document.getElementById("importFileInput"),
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
  graphRelationTypeSelect: document.getElementById("graphRelationTypeSelect"),
  graphRelationModeBtn: document.getElementById("graphRelationModeBtn"),
  resultCountLabel: document.getElementById("resultCountLabel"),
  metricResources: document.getElementById("metricResources"),
  metricCollections: document.getElementById("metricCollections"),
  metricLinks: document.getElementById("metricLinks"),
  searchFieldLabel: document.getElementById("searchFieldLabel"),
  searchInput: document.getElementById("searchInput"),
  searchSortLabel: document.getElementById("searchSortLabel"),
  searchSortSelect: document.getElementById("searchSortSelect"),
  searchToolbarStatus: document.getElementById("searchToolbarStatus"),
  searchIncludeRawLabel: document.getElementById("searchIncludeRawLabel"),
  searchIncludeRawToggle: document.getElementById("searchIncludeRawToggle"),
  importParseModeLabel: document.getElementById("importParseModeLabel"),
  importParseModeSelect: document.getElementById("importParseModeSelect"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  actionFeedback: document.getElementById("actionFeedback"),
  shuffleFocusBtn: document.getElementById("shuffleFocusBtn"),
  settingsScrim: document.getElementById("settingsScrim"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsPopover: document.getElementById("settingsPopover"),
  settingsCloseBtn: document.getElementById("settingsCloseBtn"),
  settingsTitle: document.getElementById("settingsTitle"),
  settingsEyebrow: document.getElementById("settingsEyebrow"),
  settingsLanguageLabel: document.getElementById("settingsLanguageLabel"),
  settingsLanguageZhBtn: document.getElementById("settingsLanguageZhBtn"),
  settingsLanguageEnBtn: document.getElementById("settingsLanguageEnBtn"),
  settingsSearchBodyHint: document.getElementById("settingsSearchBodyHint"),
  settingsFileStorageLabel: document.getElementById("settingsFileStorageLabel"),
  settingsFileStorageHint: document.getElementById("settingsFileStorageHint"),
  settingsFileStoragePath: document.getElementById("settingsFileStoragePath"),
  settingsFileStorageBtn: document.getElementById("settingsFileStorageBtn"),
  settingsHardwareAccelerationLabel: document.getElementById("settingsHardwareAccelerationLabel"),
  settingsHardwareAccelerationHint: document.getElementById("settingsHardwareAccelerationHint"),
  settingsHardwareAccelerationToggle: document.getElementById("settingsHardwareAccelerationToggle"),
  resetWorkspaceBtn: document.getElementById("resetWorkspaceBtn"),
  readerOverlay: document.getElementById("readerOverlay"),
  readerBackdrop: document.getElementById("readerBackdrop"),
  closeReaderBtn: document.getElementById("closeReaderBtn"),
  readerEyebrow: document.getElementById("readerEyebrow"),
  readerTitle: document.getElementById("readerTitle"),
  readerMeta: document.getElementById("readerMeta"),
  readerContent: document.getElementById("readerContent"),
  exportPicker: document.getElementById("exportPicker"),
  exportPickerLabel: document.getElementById("exportPickerLabel"),
  workspaceLanes: document.getElementById("workspaceLanes"),
  cardTemplate: document.getElementById("resourceCardTemplate"),
};

const graphState = {
  browser: {
    glowCanvas: null,
    canvas: null,
    ctx: null,
    gl: null,
    glProgram: null,
    glBuffer: null,
    glPointData: [],
    gpuEnabled: false,
    gpuInitialized: false,
    gpuUnsupported: false,
    gpuPreference: true,
    gpuPointCapacity: 0,
    gpuColorCache: new Map(),
    nodes: new Map(),
    lines: new Map(),
    orderedLines: [],
    backgroundParticles: [],
    backgroundProjectedParticles: [],
    hoveredId: null,
    hoverHasNode: false,
    stars: [],
    rafId: 0,
    lastFrameTime: 0,
    selectedId: null,
    positions: new Map(),
    projectedPositions: new Map(),
    anchorPoints: new Map(),
    directMeta: new Map(),
    spherePhase: 0,
    sphereEpoch: 0,
    proximityFrameId: 0,
    pendingPointer: null,
  },
  local: {
    svg: null,
    nodes: new Map(),
    lines: new Map(),
    hoveredId: null,
    hoverHasNode: false,
    orbitLayer: null,
    proximityFrameId: 0,
    pendingPointer: null,
  },
};

const dragState = {
  active: false,
  overBrowser: false,
  depth: 0,
  resourceId: null,
  sourceRect: null,
  sourceTitle: "",
  sourceType: "",
  resetTimer: 0,
  hasUnsupportedItems: false,
  onlyUnsupportedItems: false,
  supportedFileCount: 0,
  linkCount: 0,
  unsupportedImportTypes: [],
};

const workspacePickerState = {
  resourceId: null,
  anchorEl: null,
  menuEl: null,
};

const exportPickerState = {
  scope: null,
  anchorEl: null,
};

const settingsState = {
  open: false,
};

const desktopFileStorageState = {
  available: false,
  currentDir: "",
  defaultDir: "",
  busy: false,
  initialized: false,
};

const graphPreviewState = {
  type: null,
  resourceId: null,
  timeoutId: null,
  panelEl: null,
};

const graphImageZoomState = {
  type: null,
  resourceId: null,
  timeoutId: null,
};

const graphPointerState = {
  browser: { x: 0, y: 0 },
  local: { x: 0, y: 0 },
};

const graphRelationState = {
  active: false,
};

const graphLegendState = {
  focusOnly: false,
  showSecondary: true,
  showWorkspace: true,
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
    settingsHardwareAccelerationLabel: "硬件加速",
    settingsHardwareAccelerationHint: "为图谱粒子与辉光启用 GPU / WebGL 加速；如果图谱视图卡顿，可以关闭。",
    settingsHardwareAccelerationUnavailable: "当前设备未提供 WebGL 加速，图谱会自动回退到标准渲染。",
    hardwareAccelerationEnabled: "图谱硬件加速已开启。",
    hardwareAccelerationDisabled: "图谱硬件加速已关闭。",
    languageToggle: "EN",
    settingsFileStorageLabel: "卡片文件存储",
    settingsFileStorageHint: "设置导入卡片文件的桌面存储目录，切换后会自动迁移旧文件。",
    settingsFileStorageButton: "选择文件夹",
    settingsFileStorageDesktopOnly: "仅桌面版可设置",
    settingsFileStorageUnavailable: "桌面文件存储当前不可用",
    settingsFileStorageDefaultPrefix: "当前目录",
    settingsFileStorageBusy: "正在处理...",
    importFileButton: "导入文件",
    settingsButton: "设置",
    settingsTitle: "设置",
    settingsEyebrow: "Workspace Controls",
    settingsClose: "关闭",
    settingsLanguage: "语言",
    settingsSearchBodyHint: "将导入文档正文纳入检索范围",
    searchFieldLabel: "搜索资源",
    searchToolbarPrefix: "检索模式",
    searchBodyOnShort: "正文检索",
    searchBodyOffShort: "仅结构化",
    resetWorkspace: "重置工作台",
    shuffleFocus: "随机召回",
    createCard: "新建卡片",
    cardsView: "卡牌视图",
    graphView: "图谱视图",
    cancel: "取消",
    saveCard: "保存卡片",
    saveEdit: "保存修改",
    createWorkspaceSlot: "新建槽位",
    saveWorkspaceSlot: "保存槽位",
    workspaceSlotNamePlaceholder: "比如：灵感暂存槽",
    workspaceSlotDescriptionPlaceholder: "一句话说明这个槽位主要放什么",
    createCollection: "新建合集",
    saveCollection: "保存合集",
    collectionNamePlaceholder: "比如：商业脚本库",
    collectionSummaryPlaceholder: "一句话说明这个专题集合主要装什么",
    searchPlaceholder: "搜索标题、摘要、标签、集合...",
    searchSortLabel: "排序",
    searchIncludeRaw: "搜索正文",
    importParseMode: "导入解析",
    importParseLight: "轻量解析",
    importParseSkip: "跳过解析",
    clearSearch: "清空搜索",
    titlePlaceholder: "比如：客户访谈知识卡",
    summaryPlaceholder: "一句话说明这张卡能解决什么问题",
    tagsPlaceholder: "用逗号分隔，例如：访谈, 品牌, 用户洞察",
    detailPlaceholder: "补充用途、使用方式，以及和哪些资源联动",
    quickWorkspace: "加入工作台",
    quickCopy: "模拟复制",
    quickCollection: "归入集合",
    detailEdit: "编辑卡片",
    detailDelete: "删除卡片",
    editCollection: "编辑合集",
    deleteCollection: "删除合集",
    editWorkspaceSlot: "编辑槽位",
    deleteWorkspaceSlot: "删除槽位",
    relatedResources: "关联资源",
    addRelation: "添加关联",
    noRelatedResources: "当前没有关联资源",
    chooseRelationTarget: "选择要关联的卡片",
    chooseRelationType: "选择关联类型",
    exportCollection: "导出合集",
    exportWorkspace: "导出工作台",
    exportCard: "导出卡片",
    exportFormat: "导出格式",
    exportMarkdown: "Markdown",
    exportJson: "JSON",
    exportTxt: "TXT",
    exportHtml: "HTML",
    exportCsv: "CSV",
    graphRelationMode: "连线模式",
    graphRelationModeExit: "退出连线",
    graphRelationModeHint: "已开启连线模式，点击另一个图谱节点即可建立关系。",
    graphFocusOnly: "只看焦点",
    currentFocus: "当前焦点",
    hoverFocus: "悬停焦点",
    relationCountShort: "关联",
    openReader: "展开阅读",
    closeReader: "关闭",
    readerEyebrow: "沉浸阅读",
    readerSummary: "摘要",
    readerDescription: "说明",
    readerTags: "标签",
    readerCollections: "归属集合",
    readerNoSummary: "暂无摘要",
    readerNoDetail: "暂无详细说明",
    readerNoTags: "暂无标签",
    readerNoCollections: "暂无集合",
    addToWorkspace: "加入工作台",
    chooseWorkspaceSlot: "选择加入位置",
    pinCard: "置顶",
    unpinCard: "取消置顶",
    favoriteCard: "收藏",
    unfavoriteCard: "取消收藏",
    pinnedBadge: "置顶",
    favoriteBadge: "收藏",
    searchNoResults: "没有匹配到资源，试试切换集合、清空标签，或者搜索别的关键词。",
    searchSortModes: {
      relevance: "相关性",
      pinned: "置顶优先",
      favorites: "收藏优先",
      recentEdited: "最近编辑",
      recentUsed: "最近使用",
      title: "标题排序",
    },
    graphPreview: "图谱预览",
    graphPreviewEmpty: "暂无更多详细信息",
    graphPreviewClickHint: "单击聚焦",
    graphPreviewDoubleClickHint: "双击阅读",
    documentSource: "文档来源",
    markdownSource: "Markdown 文档",
    textSource: "文本文档",
    pdfSource: "PDF 文档",
    docxSource: "Word 文档",
    imageSource: "图片资源",
    linkSource: "链接卡片",
    openOriginalFile: "打开原文件",
    importFilesTitle: "释放以导入文件资源",
    importFilesHint: "支持 Markdown、TXT、PDF、DOCX 和常见图片格式",
    fileResourcePreview: "文件资源预览",
    fileResourceGenerated: "释放后将生成资源卡",
    unsupportedFiles: "没有识别到可导入文件。",
    unsupportedFileTypes: "这些类型暂不支持导入：{types}",
    unsupportedDropTitle: "暂不支持导入这些文件",
    partialUnsupportedDropHint: "支持的文件会正常导入，不支持的类型会被跳过：{types}",
    importDropReady: "松手导入资源",
    importLinksTitle: "释放以导入链接卡片",
    importSuccess: "已导入 {count} 个文件资源。",
    importParseSummary: "解析结果：成功 {success}，跳过 {skipped}，失败/无文本 {failed}。",
    importLinksHint: "支持把网页链接直接拖进资源库",
    importLinkSuccess: "已导入 {count} 个链接卡片。",
    linkPreviewOpen: "打开原链接",
    fileStorageLoading: "正在读取卡片文件存储目录...",
    fileStorageUpdated: "卡片文件目录已更新到「{path}」。",
    fileStorageUpdatedNoFiles: "卡片文件目录已更新到「{path}」，当前没有需要迁移的旧文件。",
    fileStorageMigrationStarted: "正在迁移旧的卡片文件...",
    fileStorageMigrationSummary:
      "卡片文件已迁移 {moved} 个，跳过 {skipped} 个，失败 {failed} 个。当前目录：{path}",
    fileStorageMigrationFailed: "更新存储目录成功，但旧文件迁移失败，请稍后重试。",
    fileStorageStoreFailed: "文件已导入卡片，但写入桌面存储目录失败，本次先使用临时链接。",
    relationTypes: {
      dependency: "依赖",
      similar: "同类",
      upstream: "上游",
      downstream: "下游",
      reference: "参考",
      related: "关联",
    },
    types: {
      profile: "资料卡",
      knowledge: "知识卡",
      prompt: "提示卡",
      script: "脚本卡",
      workflow: "流程卡",
      agent_rule: "规则卡",
      all: "全部类型",
    },
  },
  en: {
    settingsHardwareAccelerationLabel: "Hardware Acceleration",
    settingsHardwareAccelerationHint: "Use GPU/WebGL for graph particles and glow. Turn it off if graph view stutters.",
    settingsHardwareAccelerationUnavailable: "WebGL acceleration is unavailable on this device, so the graph is using the standard renderer.",
    hardwareAccelerationEnabled: "Graph hardware acceleration is on.",
    hardwareAccelerationDisabled: "Graph hardware acceleration is off.",
    languageToggle: "中",
    settingsButton: "Settings",
    settingsFileStorageLabel: "Card File Storage",
    settingsFileStorageHint: "Choose the desktop folder for imported card files. Existing managed files move automatically.",
    settingsFileStorageButton: "Choose Folder",
    settingsFileStorageDesktopOnly: "Desktop shell only",
    settingsFileStorageUnavailable: "Desktop file storage unavailable",
    settingsFileStorageDefaultPrefix: "Current folder",
    settingsFileStorageBusy: "Working...",
    importFileButton: "Import Files",
    settingsTitle: "Settings",
    settingsEyebrow: "Workspace Controls",
    settingsClose: "Close",
    settingsLanguage: "Language",
    settingsSearchBodyHint: "Include imported document body in retrieval",
    searchFieldLabel: "Search Library",
    searchToolbarPrefix: "Retrieval",
    searchBodyOnShort: "Body Search",
    searchBodyOffShort: "Structured Only",
    resetWorkspace: "Reset",
    shuffleFocus: "Recall",
    createCard: "New Card",
    cardsView: "Cards",
    graphView: "Graph",
    cancel: "Cancel",
    saveCard: "Save",
    saveEdit: "Save Edit",
    createWorkspaceSlot: "New Slot",
    saveWorkspaceSlot: "Save Slot",
    workspaceSlotNamePlaceholder: "For example: Idea Holding Slot",
    workspaceSlotDescriptionPlaceholder: "Describe what this slot is for",
    createCollection: "New Group",
    saveCollection: "Save Group",
    collectionNamePlaceholder: "For example: Brand Script Library",
    collectionSummaryPlaceholder: "Describe what belongs in this collection",
    searchPlaceholder: "Search title, summary, tags, collections...",
    searchSortLabel: "Sort",
    searchIncludeRaw: "Search body",
    importParseMode: "Import Parse",
    importParseLight: "Light Parse",
    importParseSkip: "Skip Parse",
    clearSearch: "Clear search",
    titlePlaceholder: "For example: Customer Interview Card",
    summaryPlaceholder: "Describe what this card is useful for",
    tagsPlaceholder: "Comma separated, for example: interview, brand, insight",
    detailPlaceholder: "Add usage notes and related resources",
    quickWorkspace: "To Workspace",
    quickCopy: "Copy",
    quickCollection: "Collections",
    detailEdit: "Edit Card",
    detailDelete: "Delete Card",
    editCollection: "Edit Group",
    deleteCollection: "Delete Group",
    editWorkspaceSlot: "Edit Slot",
    deleteWorkspaceSlot: "Delete Slot",
    relatedResources: "Related Resources",
    addRelation: "Add Relation",
    noRelatedResources: "No related resources yet",
    chooseRelationTarget: "Choose a card to connect",
    chooseRelationType: "Choose relation type",
    exportCollection: "Export Group",
    exportWorkspace: "Export Workspace",
    exportCard: "Export Card",
    exportFormat: "Export Format",
    exportMarkdown: "Markdown",
    exportJson: "JSON",
    exportTxt: "TXT",
    exportHtml: "HTML",
    exportCsv: "CSV",
    graphRelationMode: "Link Mode",
    graphRelationModeExit: "Exit Link",
    graphRelationModeHint: "Link mode is on. Click another graph node to create a relation.",
    graphFocusOnly: "Focus Only",
    currentFocus: "Current Focus",
    hoverFocus: "Hover Focus",
    relationCountShort: "rel",
    openReader: "Open Reader",
    closeReader: "Close",
    readerEyebrow: "Reader",
    readerSummary: "Summary",
    readerDescription: "Details",
    readerTags: "Tags",
    readerCollections: "Collections",
    readerNoSummary: "No summary yet.",
    readerNoDetail: "No detailed notes yet.",
    readerNoTags: "No tags",
    readerNoCollections: "No collections",
    addToWorkspace: "To Workspace",
    chooseWorkspaceSlot: "Choose Slot",
    pinCard: "Pin",
    unpinCard: "Unpin",
    favoriteCard: "Favorite",
    unfavoriteCard: "Unfavorite",
    pinnedBadge: "Pinned",
    favoriteBadge: "Favorite",
    searchNoResults: "No resources matched. Try another keyword or loosen the filters.",
    searchSortModes: {
      relevance: "Relevance",
      pinned: "Pinned First",
      favorites: "Favorites First",
      recentEdited: "Recent Edit",
      recentUsed: "Recent Use",
      title: "Title",
    },
    graphPreview: "Graph Preview",
    graphPreviewEmpty: "No additional details yet",
    graphPreviewClickHint: "Click to focus",
    graphPreviewDoubleClickHint: "Double-click to read",
    documentSource: "Source",
    markdownSource: "Markdown Document",
    textSource: "Text Document",
    pdfSource: "PDF Document",
    docxSource: "Word Document",
    imageSource: "Image Asset",
    linkSource: "Link Card",
    openOriginalFile: "Open Original File",
    importFilesTitle: "Drop to import file resources",
    importFilesHint: "Supports Markdown, TXT, PDF, DOCX, and common image formats",
    fileResourcePreview: "File Resource Preview",
    fileResourceGenerated: "Drop to create resource cards",
    unsupportedFiles: "No supported files were detected.",
    unsupportedFileTypes: "These file types are not supported yet: {types}",
    unsupportedDropTitle: "These files are not supported",
    partialUnsupportedDropHint: "Supported files will import normally. Unsupported types will be skipped: {types}",
    importDropReady: "Release to import resources",
    importLinksTitle: "Drop to import link cards",
    importSuccess: "Imported {count} file resources.",
    importParseSummary: "Parse result: success {success}, skipped {skipped}, failed/empty {failed}.",
    importLinksHint: "You can also drag webpage links into the resource browser",
    importLinkSuccess: "Imported {count} link cards.",
    linkPreviewOpen: "Open original link",
    fileStorageLoading: "Loading the card file storage folder...",
    fileStorageUpdated: "Card file folder updated to \"{path}\".",
    fileStorageUpdatedNoFiles:
      "Card file folder updated to \"{path}\". There were no managed files to move yet.",
    fileStorageMigrationStarted: "Migrating existing managed card files...",
    fileStorageMigrationSummary:
      "Moved {moved} file(s), skipped {skipped}, failed {failed}. Current folder: {path}",
    fileStorageMigrationFailed:
      "The storage folder changed, but migrating older managed files did not finish successfully.",
    fileStorageStoreFailed:
      "The card imported successfully, but desktop storage failed. A temporary file link is being used for now.",
    relationTypes: {
      dependency: "Dependency",
      similar: "Similar",
      upstream: "Upstream",
      downstream: "Downstream",
      reference: "Reference",
      related: "Related",
    },
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

function getResourceById(id) {
  return resources.find((resource) => resource.id === id);
}

function getSelectedResource() {
  return getResourceById(appState.selectedResourceId) || resources[0];
}

function getDefaultResourceMeta() {
  return {
    pinned: false,
    favorite: false,
    lastViewedAt: null,
    lastEditedAt: null,
    lastUsedAt: null,
  };
}

function getResourceMeta(resourceId) {
  return {
    ...getDefaultResourceMeta(),
    ...(resourceMeta?.[resourceId] || {}),
  };
}

function ensureResourceMeta(resourceId) {
  if (!resourceId) return getDefaultResourceMeta();
  if (!resourceMeta[resourceId]) {
    resourceMeta[resourceId] = getDefaultResourceMeta();
  }
  return resourceMeta[resourceId];
}

function updateResourceMetaFlag(resourceId, key, value) {
  if (!resourceId) return;
  const meta = ensureResourceMeta(resourceId);
  meta[key] = value;
  meta.lastEditedAt = new Date().toISOString();
  saveResourceMeta();
}

function touchResourceMeta(resourceId, key) {
  if (!resourceId) return;
  const meta = ensureResourceMeta(resourceId);
  meta[key] = new Date().toISOString();
  saveResourceMeta();
}

function compareTimestampDesc(a, b) {
  const aTime = a ? new Date(a).getTime() : 0;
  const bTime = b ? new Date(b).getTime() : 0;
  return bTime - aTime;
}

function isCustomResource(resource) {
  return resource && resource.id.startsWith("res-custom-");
}

function isCustomCollection(collection) {
  return collection && collection.id.startsWith("collection-custom-");
}

function isDocumentResource(resource) {
  return resource && ["markdown-file", "txt-file", "pdf-file", "docx-file"].includes(resource.sourceType);
}

function isImageResource(resource) {
  return resource && resource.sourceType === "image-file";
}

function isLinkResource(resource) {
  return resource && resource.sourceType === "link-card";
}

function getSourceTypeLabel(resource) {
  const sourceType = resource?.sourceType || "";
  if (sourceType === "markdown-file") return t("markdownSource");
  if (sourceType === "txt-file") return t("textSource");
  if (sourceType === "pdf-file") return t("pdfSource");
  if (sourceType === "docx-file") return t("docxSource");
  if (sourceType === "image-file") return t("imageSource");
  if (sourceType === "link-card") return t("linkSource");
  return t(`types.${resource?.type}`) || typeMeta[resource?.type] || resource?.type || "";
}

function getSlotLabel(slotKey) {
  const slot = getWorkspaceSlotDefinitions().find((item) => item.id === slotKey);
  return slot?.label || slotKey;
}

function getSlotDescription(slotKey) {
  const slot = getWorkspaceSlotDefinitions().find((item) => item.id === slotKey);
  return slot?.description || "";
}

function getWorkspaceSlotDefinitions() {
  if (Array.isArray(appState.customWorkspaceSlots) && appState.customWorkspaceSlots.length) {
    return appState.customWorkspaceSlots;
  }
  return DEFAULT_WORKSPACE_SLOT_DEFS;
}

function getFallbackCollectionId(resource) {
  const candidates =
    resource.type === "profile"
      ? ["collection-profile", "collection-knowledge", "collection-video", "collection-agent"]
      : resource.type === "prompt" || resource.type === "script"
        ? ["collection-video", "collection-knowledge", "collection-profile", "collection-agent"]
        : resource.type === "agent_rule" || resource.type === "workflow"
          ? ["collection-agent", "collection-knowledge", "collection-video", "collection-profile"]
          : ["collection-knowledge", "collection-profile", "collection-video", "collection-agent"];

  const availableIds = new Set(collections.map((collection) => collection.id));
  return candidates.find((id) => availableIds.has(id)) || collections.find((collection) => collection.id !== "all")?.id || "all";
}

function ensureWorkspacePicker() {
  if (workspacePickerState.menuEl) return workspacePickerState.menuEl;

  const menu = document.createElement("div");
  menu.className = "workspace-slot-picker is-hidden";
  document.body.appendChild(menu);

  workspacePickerState.menuEl = menu;
  return menu;
}

function positionWorkspacePicker(anchorEl) {
  const menu = ensureWorkspacePicker();
  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + 10;
  const estimatedWidth = 176;
  const left = Math.min(
    window.innerWidth - estimatedWidth - 16,
    Math.max(16, rect.right - estimatedWidth),
  );
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function openWorkspacePicker(resourceId, anchorEl) {
  if (!resourceId || !anchorEl) return;
  const menu = ensureWorkspacePicker();
  if (
    workspacePickerState.resourceId === resourceId &&
    workspacePickerState.anchorEl === anchorEl &&
    !menu.classList.contains("is-hidden")
  ) {
    closeWorkspacePicker();
    return;
  }
  workspacePickerState.resourceId = resourceId;
  workspacePickerState.anchorEl = anchorEl;
  menu.innerHTML = `
    <div class="workspace-slot-picker__label">${t("chooseWorkspaceSlot")}</div>
    ${getWorkspaceSlotDefinitions()
      .map(
        (slot) => `
          <button class="workspace-slot-picker__item" data-slot="${slot.id}">
            <strong>${slot.label}</strong>
            <span>${slot.description || ""}</span>
          </button>
        `,
      )
      .join("")}
  `;
  menu.querySelectorAll("[data-slot]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const slotKey = button.dataset.slot;
      const selectedResourceId = workspacePickerState.resourceId;
      closeWorkspacePicker();
      addResourceToWorkspace(selectedResourceId, slotKey);
      const resource = getResourceById(selectedResourceId);
      if (resource) {
        dom.actionFeedback.textContent = `已把「${resource.title}」放入 ${getSlotLabel(slotKey)}。`;
      }
    });
  });
  positionWorkspacePicker(anchorEl);
  menu.classList.remove("is-hidden");
  requestAnimationFrame(() => menu.classList.add("is-visible"));
}

function closeWorkspacePicker() {
  const menu = workspacePickerState.menuEl;
  if (!menu) return;
  menu.classList.remove("is-visible");
  menu.classList.add("is-hidden");
  workspacePickerState.resourceId = null;
  workspacePickerState.anchorEl = null;
}

function positionExportPicker(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + 10;
  const estimatedWidth = 156;
  const left = Math.min(
    window.innerWidth - estimatedWidth - 16,
    Math.max(16, rect.right - estimatedWidth),
  );
  dom.exportPicker.style.left = `${left}px`;
  dom.exportPicker.style.top = `${top}px`;
}

function openExportPicker(scope, anchorEl) {
  if (!scope || !anchorEl) return;
  exportPickerState.scope = scope;
  exportPickerState.anchorEl = anchorEl;
  dom.exportPickerLabel.textContent = t("exportFormat");
  dom.exportPicker.querySelector('[data-format="markdown"]').textContent = t("exportMarkdown");
  dom.exportPicker.querySelector('[data-format="json"]').textContent = t("exportJson");
  dom.exportPicker.querySelector('[data-format="txt"]').textContent = t("exportTxt");
  dom.exportPicker.querySelector('[data-format="html"]').textContent = t("exportHtml");
  dom.exportPicker.querySelector('[data-format="csv"]').textContent = t("exportCsv");
  positionExportPicker(anchorEl);
  dom.exportPicker.classList.remove("is-hidden");
  requestAnimationFrame(() => dom.exportPicker.classList.add("is-visible"));
}

function closeExportPicker() {
  dom.exportPicker.classList.remove("is-visible");
  dom.exportPicker.classList.add("is-hidden");
  exportPickerState.scope = null;
  exportPickerState.anchorEl = null;
}

function bindExportPickerInteractions() {
  dom.exportPicker.querySelectorAll("[data-format]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const format = button.dataset.format;
      const scope = exportPickerState.scope;
      closeExportPicker();
      if (scope === "collection") {
        exportCurrentCollection(format);
      } else if (scope === "workspace") {
        exportCurrentWorkspace(format);
      } else if (scope === "resource") {
        exportCurrentResource(format);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (dom.exportPicker.classList.contains("is-hidden")) return;
    if (dom.exportPicker.contains(event.target)) return;
    if (exportPickerState.anchorEl?.contains?.(event.target)) return;
    closeExportPicker();
  });

  window.addEventListener("resize", () => {
    if (exportPickerState.scope && exportPickerState.anchorEl) {
      positionExportPicker(exportPickerState.anchorEl);
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (exportPickerState.scope && exportPickerState.anchorEl) {
        positionExportPicker(exportPickerState.anchorEl);
      }
    },
    true,
  );
}

function sanitizeFilename(value) {
  return String(value || "export")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatResourceExport(resource) {
  const meta = getResourceMeta(resource.id);
  return {
    id: resource.id,
    title: resource.title,
    type: resource.type,
    summary: resource.summary,
    detail: resource.detail,
    tags: resource.tags,
    collections: resource.collections.map((collectionId) => collections.find((item) => item.id === collectionId)?.name || collectionId),
    related: getRelationEntries(resource).map((entry) => ({
      title: getResourceById(entry.resourceId)?.title || entry.resourceId,
      type: entry.type || "related",
    })),
    rawContent: resource.rawContent || null,
    sourceUrl: resource.sourceUrl || null,
    previewUrl: resource.previewUrl || null,
    fileUrl: resource.fileUrl || null,
    meta,
  };
}

function buildResourceMarkdown(resource, headingLevel = "##") {
  const meta = getResourceMeta(resource.id);
  const collectionNames = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || collectionId)
    .join(" / ");
  const relatedNames = getRelationEntries(resource)
    .map((entry) => `${getResourceById(entry.resourceId)?.title || entry.resourceId} (${t(`relationTypes.${entry.type || "related"}`)})`)
    .join(" / ");
  const stateLabels = [
    meta.pinned ? t("pinnedBadge") : "",
    meta.favorite ? t("favoriteBadge") : "",
  ].filter(Boolean);
  const rawSection = resource.rawContent
    ? `\n### 原始文档\n\n\`\`\`markdown\n${resource.rawContent}\n\`\`\`\n`
    : "";
  return `${headingLevel} ${resource.title}

- 类型：${t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type}
- 标签：${resource.tags.join(" / ") || "无"}
- 状态：${stateLabels.join(" / ") || "无"}
- 归属集合：${collectionNames || "无"}
- 关联资源：${relatedNames || "无"}

### 摘要

${resource.summary || "无"}

### 详情

${resource.detail || "无"}
${rawSection}`;
}

function buildResourcePlainText(resource) {
  const meta = getResourceMeta(resource.id);
  const collectionNames = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || collectionId)
    .join(" / ");
  const relatedNames = getRelationEntries(resource)
    .map((entry) => `${getResourceById(entry.resourceId)?.title || entry.resourceId} (${t(`relationTypes.${entry.type || "related"}`)})`)
    .join(" / ");
  const stateLabels = [
    meta.pinned ? t("pinnedBadge") : "",
    meta.favorite ? t("favoriteBadge") : "",
  ].filter(Boolean);

  return `${resource.title}
Type: ${t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type}
Tags: ${resource.tags.join(" / ") || "None"}
State: ${stateLabels.join(" / ") || "None"}
Collections: ${collectionNames || "None"}
Relations: ${relatedNames || "None"}

Summary:
${resource.summary || "None"}

Detail:
${resource.detail || "None"}

${resource.rawContent ? `Raw Content:\n${resource.rawContent}` : ""}`.trim();
}

function escapeCsvValue(value) {
  const normalized = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${normalized.replace(/"/g, '""')}"`;
}

function buildResourceCsvRow(resource, extra = {}) {
  const meta = getResourceMeta(resource.id);
  const row = {
    ...extra,
    title: resource.title,
    type: t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type,
    summary: resource.summary || "",
    detail: resource.detail || "",
    tags: resource.tags.join(" | "),
    collections: resource.collections
      .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || collectionId)
      .join(" | "),
    relations: getRelationEntries(resource)
      .map((entry) => `${getResourceById(entry.resourceId)?.title || entry.resourceId} (${t(`relationTypes.${entry.type || "related"}`)})`)
      .join(" | "),
    pinned: meta.pinned ? "true" : "false",
    favorite: meta.favorite ? "true" : "false",
    sourceType: resource.sourceType || "",
    sourceUrl: resource.sourceUrl || "",
    fileName: resource.fileName || "",
  };
  return Object.values(row).map(escapeCsvValue).join(",");
}

function buildHtmlDocument(title, bodyMarkup) {
  return `<!DOCTYPE html>
<html lang="${appState.language === "en" ? "en" : "zh-CN"}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      body {
        font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        margin: 0;
        padding: 32px;
        color: #102033;
        background: #f4f8fc;
      }
      .page {
        max-width: 980px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 24px;
        padding: 28px 32px;
        box-shadow: 0 24px 60px rgba(16, 32, 51, 0.12);
      }
      h1, h2, h3 { color: #102033; }
      .meta {
        color: #49637f;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .card {
        border: 1px solid #dfe9f4;
        border-radius: 18px;
        padding: 18px 20px;
        margin-bottom: 16px;
        background: #fbfdff;
      }
      .pill-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
      .pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 6px 10px;
        background: #eef5ff;
        color: #2f5277;
        font-size: 12px;
      }
      .preview-image {
        width: 100%;
        max-height: 360px;
        object-fit: contain;
        border-radius: 16px;
        background: #0c1828;
      }
      .content {
        white-space: pre-wrap;
        line-height: 1.7;
        color: #23384f;
      }
      .divider {
        height: 1px;
        background: #e5edf6;
        margin: 22px 0;
      }
      a { color: #225fcb; }
    </style>
  </head>
  <body>
    <div class="page">
      ${bodyMarkup}
    </div>
  </body>
</html>`;
}

function buildResourceHtmlCard(resource, headingLevel = "h2") {
  const meta = getResourceMeta(resource.id);
  const collectionNames = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || collectionId);
  const relationNames = getRelationEntries(resource)
    .map((entry) => `${getResourceById(entry.resourceId)?.title || entry.resourceId} (${t(`relationTypes.${entry.type || "related"}`)})`);
  const stateLabels = [
    meta.pinned ? t("pinnedBadge") : "",
    meta.favorite ? t("favoriteBadge") : "",
  ].filter(Boolean);
  const imageMarkup = isImageResource(resource) && resource.previewUrl
    ? `<img class="preview-image" src="${resource.previewUrl}" alt="${escapeHtml(resource.title)}" />`
    : "";
  const linkMarkup = resource.sourceUrl
    ? `<p><a href="${resource.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(resource.sourceUrl)}</a></p>`
    : "";

  return `
    <article class="card">
      <${headingLevel}>${escapeHtml(resource.title)}</${headingLevel}>
      <div class="meta">${escapeHtml(t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type)}</div>
      ${imageMarkup}
      ${linkMarkup}
      <div class="pill-row">
        ${stateLabels.map((label) => `<span class="pill">${escapeHtml(label)}</span>`).join("")}
        ${resource.tags.map((tag) => `<span class="pill">#${escapeHtml(tag)}</span>`).join("")}
        ${collectionNames.map((name) => `<span class="pill">${escapeHtml(name)}</span>`).join("")}
      </div>
      <div class="content">${escapeHtml(resource.summary || "")}</div>
      ${resource.detail ? `<div class="divider"></div><div class="content">${escapeHtml(resource.detail)}</div>` : ""}
      ${relationNames.length ? `<div class="divider"></div><div class="content">Relations: ${escapeHtml(relationNames.join(" / "))}</div>` : ""}
    </article>`;
}

function exportCurrentResource(format) {
  const resource = getSelectedResource();
  if (!resource) return;
  const payload = {
    scope: "resource",
    exportedAt: new Date().toISOString(),
    resource: formatResourceExport(resource),
  };

  if (format === "json") {
    downloadTextFile(
      `${sanitizeFilename(resource.title)}.json`,
      JSON.stringify(payload, null, 2),
      "application/json;charset=utf-8",
    );
  } else if (format === "txt") {
    downloadTextFile(
      `${sanitizeFilename(resource.title)}.txt`,
      buildResourcePlainText(resource),
      "text/plain;charset=utf-8",
    );
  } else if (format === "html") {
    downloadTextFile(
      `${sanitizeFilename(resource.title)}.html`,
      buildHtmlDocument(resource.title, buildResourceHtmlCard(resource, "h1")),
      "text/html;charset=utf-8",
    );
  } else if (format === "csv") {
    const header = [
      "title",
      "type",
      "summary",
      "detail",
      "tags",
      "collections",
      "relations",
      "pinned",
      "favorite",
      "sourceType",
      "sourceUrl",
      "fileName",
    ].map(escapeCsvValue).join(",");
    downloadTextFile(
      `${sanitizeFilename(resource.title)}.csv`,
      `${header}\n${buildResourceCsvRow(resource)}`,
      "text/csv;charset=utf-8",
    );
  } else {
    const markdown = `# 卡片导出：${resource.title}

- 导出时间：${new Date().toLocaleString("zh-CN")}

${buildResourceMarkdown(resource)}
`;
    downloadTextFile(
      `${sanitizeFilename(resource.title)}.md`,
      markdown,
      "text/markdown;charset=utf-8",
    );
  }

  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Exported "${resource.title}" as ${format.toUpperCase()}.`
      : `已导出卡片「${resource.title}」${format.toUpperCase()}。`;
}

function exportCurrentCollection(format) {
  const filtered = getFilteredResources();
  const activeCollection = collections.find((item) => item.id === appState.activeCollection);
  const collectionName = activeCollection?.name || "全部资源";
  const payload = {
    scope: "collection",
    collectionId: appState.activeCollection,
    collectionName,
    exportedAt: new Date().toISOString(),
    filters: {
      activeType: appState.activeType,
      activeTag: appState.activeTag,
      search: dom.searchInput.value.trim(),
    },
    resources: filtered.map(formatResourceExport),
  };

  if (format === "json") {
    downloadTextFile(
      `${sanitizeFilename(collectionName)}-collection.json`,
      JSON.stringify(payload, null, 2),
      "application/json;charset=utf-8",
    );
  } else if (format === "txt") {
    const txt = `合集导出：${collectionName}

导出时间：${new Date().toLocaleString("zh-CN")}
当前类型筛选：${appState.activeType}
当前标签筛选：${appState.activeTag || "无"}
当前搜索：${dom.searchInput.value.trim() || "无"}
资源数量：${filtered.length}

${filtered.map((resource) => buildResourcePlainText(resource)).join("\n\n------------------------------\n\n")}`;
    downloadTextFile(
      `${sanitizeFilename(collectionName)}-collection.txt`,
      txt,
      "text/plain;charset=utf-8",
    );
  } else if (format === "html") {
    const html = buildHtmlDocument(
      `合集导出：${collectionName}`,
      `
        <h1>${escapeHtml(collectionName)}</h1>
        <div class="meta">Exported at ${escapeHtml(new Date().toLocaleString("zh-CN"))}</div>
        ${filtered.map((resource) => buildResourceHtmlCard(resource)).join("")}
      `,
    );
    downloadTextFile(
      `${sanitizeFilename(collectionName)}-collection.html`,
      html,
      "text/html;charset=utf-8",
    );
  } else if (format === "csv") {
    const header = [
      "title",
      "type",
      "summary",
      "detail",
      "tags",
      "collections",
      "relations",
      "pinned",
      "favorite",
      "sourceType",
      "sourceUrl",
      "fileName",
    ].map(escapeCsvValue).join(",");
    const csv = [header, ...filtered.map((resource) => buildResourceCsvRow(resource))].join("\n");
    downloadTextFile(
      `${sanitizeFilename(collectionName)}-collection.csv`,
      csv,
      "text/csv;charset=utf-8",
    );
  } else {
    const markdown = `# 合集导出：${collectionName}

- 导出时间：${new Date().toLocaleString("zh-CN")}
- 当前类型筛选：${appState.activeType}
- 当前标签筛选：${appState.activeTag || "无"}
- 当前搜索：${dom.searchInput.value.trim() || "无"}
- 资源数量：${filtered.length}

${filtered.map((resource) => buildResourceMarkdown(resource)).join("\n\n---\n\n")}
`;
    downloadTextFile(
      `${sanitizeFilename(collectionName)}-collection.md`,
      markdown,
      "text/markdown;charset=utf-8",
    );
  }

  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Exported collection "${collectionName}" as ${format.toUpperCase()}.`
      : `已导出合集「${collectionName}」${format.toUpperCase()}。`;
}

function exportCurrentWorkspace(format) {
  const slotDefinitions = getWorkspaceSlotDefinitions().map((slot) => ({
    id: slot.id,
    label: slot.label,
    description: slot.description,
    resources: (appState.workspaceSlots[slot.id] || []).map(getResourceById).filter(Boolean).map(formatResourceExport),
  }));
  const payload = {
    scope: "workspace",
    exportedAt: new Date().toISOString(),
    slots: slotDefinitions,
  };

  if (format === "json") {
    downloadTextFile(
      "workspace-export.json",
      JSON.stringify(payload, null, 2),
      "application/json;charset=utf-8",
    );
  } else if (format === "txt") {
    const txt = `工作台导出

导出时间：${new Date().toLocaleString("zh-CN")}
槽位数量：${slotDefinitions.length}

${slotDefinitions
  .map(
    (slot) => `${slot.label}
${slot.description || "无说明"}

${
  slot.resources.length
    ? slot.resources.map((resource) => buildResourcePlainText(resource)).join("\n\n------------------------------\n\n")
    : "当前槽位为空"
}`,
  )
  .join("\n\n==============================\n\n")}`;
    downloadTextFile("workspace-export.txt", txt, "text/plain;charset=utf-8");
  } else if (format === "html") {
    const html = buildHtmlDocument(
      "工作台导出",
      `
        <h1>工作台导出</h1>
        <div class="meta">Exported at ${escapeHtml(new Date().toLocaleString("zh-CN"))}</div>
        ${slotDefinitions
          .map(
            (slot) => `
              <section>
                <h2>${escapeHtml(slot.label)}</h2>
                <div class="meta">${escapeHtml(slot.description || "无说明")}</div>
                ${slot.resources.length ? slot.resources.map((resource) => buildResourceHtmlCard(resource, "h3")).join("") : '<div class="card">当前槽位为空</div>'}
              </section>
            `,
          )
          .join("")}
      `,
    );
    downloadTextFile("workspace-export.html", html, "text/html;charset=utf-8");
  } else if (format === "csv") {
    const header = [
      "slot",
      "title",
      "type",
      "summary",
      "detail",
      "tags",
      "collections",
      "relations",
      "pinned",
      "favorite",
      "sourceType",
      "sourceUrl",
      "fileName",
    ].map(escapeCsvValue).join(",");
    const rows = slotDefinitions.flatMap((slot) =>
      slot.resources.map((resource) =>
        buildResourceCsvRow(resource, {
          slot: slot.label,
        }),
      ),
    );
    downloadTextFile(
      "workspace-export.csv",
      [header, ...rows].join("\n"),
      "text/csv;charset=utf-8",
    );
  } else {
    const markdown = `# 工作台导出

- 导出时间：${new Date().toLocaleString("zh-CN")}
- 槽位数量：${slotDefinitions.length}

${slotDefinitions
  .map(
    (slot) => `## ${slot.label}

${slot.description || "无说明"}

${
  slot.resources.length
    ? slot.resources
        .map((resource) =>
          buildResourceMarkdown(
            {
              ...resource,
              collections: resource.collections.map((name) => collections.find((item) => item.name === name)?.id || name),
              related: [],
            },
            "###",
          ),
        )
        .join("\n\n")
    : "当前槽位为空"
}
`,
  )
  .join("\n\n---\n\n")}
`;
    downloadTextFile("workspace-export.md", markdown, "text/markdown;charset=utf-8");
  }

  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Exported workspace as ${format.toUpperCase()}.`
      : `已导出当前工作台 ${format.toUpperCase()}。`;
}

function normalizeMarkdownTextLine(line) {
  return String(line || "")
    .trim()
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\*\*(.+)\*\*$/, "$1")
    .replace(/^\*(.+)\*$/, "$1")
    .replace(/^`(.+)`$/, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1")
    .replace(/!\[(.*?)\]\((.+?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function isSkippableMarkdownLine(line) {
  const normalized = normalizeMarkdownTextLine(line);
  if (!normalized) return true;
  if (/^#{1,6}\s/.test(line)) return true;
  if (/^[-*]\s/.test(line)) return true;
  if (/^>\s*/.test(line)) return true;
  if (/^```/.test(line)) return true;
  if (/^<[^>]+>$/.test(normalized)) return true;
  if (/^[\s:：;；,，。.、|/\\\-_=+~`]+$/.test(normalized)) return true;
  if (/^(system|module|role|profile|task|input|output|metadata)\b/i.test(normalized)) return true;
  if (/^[A-Z0-9_]+(?:\s+[A-Z0-9_]+)*\s*=/.test(normalized)) return true;
  return false;
}

function extractMarkdownTitle(text, fallbackTitle = "Markdown 文档资源") {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    if (/^#{1,6}\s+/.test(trimmed)) {
      return normalizeMarkdownTextLine(trimmed).slice(0, 120) || fallbackTitle;
    }
    const normalized = normalizeMarkdownTextLine(trimmed);
    if (
      normalized &&
      !isSkippableMarkdownLine(trimmed) &&
      normalized.length <= 80 &&
      !/[。！？!?]/.test(normalized)
    ) {
      return normalized.slice(0, 120);
    }
  }
  return fallbackTitle;
}

function extractMarkdownSummary(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    if (isSkippableMarkdownLine(trimmed)) continue;
    const normalized = normalizeMarkdownTextLine(trimmed);
    if (normalized) {
      return normalized.slice(0, 160);
    }
  }
  return "Markdown 文档资源";
}

function extractTextSummary(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return (lines[0] || "Text document resource").slice(0, 120);
}

function formatFileSize(size) {
  if (!Number.isFinite(size)) return "Unknown";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function getTauriInvoke() {
  const candidates = [
    window.__TAURI__?.core?.invoke,
    window.__TAURI__?.invoke,
    window.__TAURI_INTERNALS__?.invoke,
  ];
  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function getTauriCurrentWindow() {
  const candidates = [
    window.__TAURI__?.window?.getCurrentWindow,
    window.__TAURI__?.webviewWindow?.getCurrentWebviewWindow,
    window.__TAURI__?.webviewWindow?.getCurrentWindow,
  ];
  const factory = candidates.find((candidate) => typeof candidate === "function");
  return factory ? factory() : null;
}

function isDesktopShell() {
  return Boolean(getTauriInvoke());
}

function isGraphHardwareAccelerationEnabled() {
  return appState.graphGpuAccelerationEnabled !== false;
}

async function invokeDesktopCommand(command, payload = {}) {
  const invoke = getTauriInvoke();
  if (!invoke) {
    throw new Error("Desktop shell unavailable.");
  }
  return invoke(command, payload);
}

function toLocalFileUrl(filePath) {
  if (!filePath || typeof filePath !== "string") return null;
  if (/^file:\/\//i.test(filePath)) return filePath;
  const normalizedPath = filePath.replace(/\\/g, "/");
  if (/^[a-z]:\//i.test(normalizedPath)) {
    return encodeURI(`file:///${normalizedPath}`);
  }
  return encodeURI(`file://${normalizedPath}`);
}

function normalizeStoredFileResource(resource) {
  if (!resource || typeof resource !== "object") return resource;
  if (resource.storedFilePath && !resource.fileUrl) {
    resource.fileUrl = toLocalFileUrl(resource.storedFilePath);
  } else if (resource.storedFilePath && resource.storageMode === "managed") {
    resource.fileUrl = toLocalFileUrl(resource.storedFilePath);
  }
  if (resource.storedFilePath && !resource.storageMode) {
    resource.storageMode = "managed";
  }
  return resource;
}

function inferMimeTypeFromPath(filePath) {
  const normalized = String(filePath || "").toLowerCase();
  if (/\.(md|markdown|mdown|mkd|mkdn)$/i.test(normalized)) return "text/markdown";
  if (/\.txt$/i.test(normalized)) return "text/plain";
  if (/\.pdf$/i.test(normalized)) return "application/pdf";
  if (/\.docx$/i.test(normalized)) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (/\.png$/i.test(normalized)) return "image/png";
  if (/\.jpe?g$/i.test(normalized)) return "image/jpeg";
  if (/\.gif$/i.test(normalized)) return "image/gif";
  if (/\.webp$/i.test(normalized)) return "image/webp";
  if (/\.bmp$/i.test(normalized)) return "image/bmp";
  if (/\.svg$/i.test(normalized)) return "image/svg+xml";
  return "";
}

function base64ToUint8Array(dataBase64) {
  const binary = window.atob(dataBase64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function hydrateDroppedDesktopFiles(records = []) {
  return records
    .map((record) => {
      if (!record?.fileName || !record?.dataBase64) return null;
      const bytes = base64ToUint8Array(record.dataBase64);
      return new File([bytes], record.fileName, {
        type: record.mimeType || inferMimeTypeFromPath(record.path || record.fileName),
        lastModified: Number(record.lastModifiedMs || Date.now()),
      });
    })
    .filter(Boolean);
}

let desktopNativeDropRegistered = false;
let desktopNativeDropUnlisten = null;

function getDesktopDropDescriptors(paths = []) {
  return paths
    .map((filePath) => {
      const normalizedPath = String(filePath || "");
      if (!normalizedPath) return null;
      const segments = normalizedPath.split(/[\\/]/);
      const fileName = segments[segments.length - 1] || normalizedPath;
      const mimeType = inferMimeTypeFromPath(normalizedPath);
      return {
        path: normalizedPath,
        fileName,
        mimeType,
        sourceType: inferImportType({ name: fileName, type: mimeType }) || inferImportTypeFromMime(mimeType),
      };
    })
    .filter(Boolean);
}

function buildDesktopDropSnapshot(paths = []) {
  const descriptors = getDesktopDropDescriptors(paths);
  const supportedDescriptors = descriptors.filter((descriptor) => descriptor.sourceType);
  const unsupportedTypes = [...new Set(
    descriptors
      .filter((descriptor) => !descriptor.sourceType)
      .map((descriptor) => {
        const match = descriptor.fileName.toLowerCase().match(/\.([^.]+)$/);
        return match ? `.${match[1]}` : "file";
      }),
  )];
  const firstDescriptor = descriptors[0] || null;

  return {
    supportedFileCount: supportedDescriptors.length,
    linkCount: 0,
    unsupportedTypes,
    hasSupportedPayload: supportedDescriptors.length > 0,
    firstLabel: firstDescriptor?.fileName || t("fileResourcePreview"),
    firstTypeLabel: firstDescriptor?.fileName?.split(".").pop()?.toUpperCase() || "FILE",
  };
}

function resolveDesktopDropPoint(payload) {
  const position = payload?.position || payload?.cursorPosition || payload?.cursor || payload;
  const x = Number(position?.x ?? position?.clientX ?? position?.left);
  const y = Number(position?.y ?? position?.clientY ?? position?.top);
  if (Number.isFinite(x) && Number.isFinite(y)) {
    return { x, y };
  }

  const panelRect = dom.resourceBrowserPanel?.getBoundingClientRect?.();
  if (panelRect) {
    return {
      x: panelRect.left + panelRect.width / 2,
      y: panelRect.top + Math.min(panelRect.height * 0.35, 220),
    };
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

async function handleDesktopNativeDrop(paths = []) {
  const snapshot = buildDesktopDropSnapshot(paths);
  resetDragImportState();
  setBrowserDropState(false);
  hideFileGhost();

  if (!snapshot.hasSupportedPayload) {
    showActionFeedback(
      snapshot.unsupportedTypes.length
        ? t("unsupportedFileTypes").replace("{types}", snapshot.unsupportedTypes.join(", "))
        : t("unsupportedFiles"),
    );
    return;
  }

  const records = await invokeDesktopCommand("read_dropped_files", { paths });
  const droppedFiles = hydrateDroppedDesktopFiles(records);
  if (!droppedFiles.length) {
    showActionFeedback(t("unsupportedFiles"));
    return;
  }

  await importFiles(droppedFiles);
}

async function bindDesktopNativeFileDrop() {
  if (!isDesktopShell() || desktopNativeDropRegistered) return;

  const currentWindow = getTauriCurrentWindow();
  if (!currentWindow || typeof currentWindow.onDragDropEvent !== "function") return;

  try {
    const maybeUnlisten = await currentWindow.onDragDropEvent(async (event) => {
      const payload = event?.payload || event || {};
      const eventType = payload?.type || event?.type || "";
      const paths = Array.isArray(payload?.paths) ? payload.paths : [];

      if (eventType === "enter" || eventType === "over") {
        const snapshot = buildDesktopDropSnapshot(paths);
        if (!snapshot.hasSupportedPayload && !snapshot.unsupportedTypes.length) return;
        const point = resolveDesktopDropPoint(payload);
        syncDragImportState(snapshot);
        dragState.depth = 1;
        dragState.active = true;
        setBrowserDropState(true);
        showFileGhost(snapshot.firstLabel, point.x, point.y, {
          typeLabel: snapshot.firstTypeLabel,
          isInvalid: dragState.onlyUnsupportedItems,
        });
        return;
      }

      if (eventType === "leave" || eventType === "cancel") {
        resetDragImportState();
        setBrowserDropState(false);
        hideFileGhost();
        return;
      }

      if (eventType === "drop") {
        await handleDesktopNativeDrop(paths);
      }
    });

    if (typeof maybeUnlisten === "function") {
      desktopNativeDropUnlisten = maybeUnlisten;
    }
    desktopNativeDropRegistered = true;
  } catch (error) {
    console.warn("Failed to bind desktop native file drop.", error);
    desktopNativeDropRegistered = false;
    desktopNativeDropUnlisten = null;
  }
}

async function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return window.btoa(binary);
}

let pdfJsPromise = null;
let tesseractWorkerPromise = null;

async function loadPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("./vendor/pdf.mjs").then((module) => {
      const pdfjs = module.default || module;
      if (pdfjs?.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = "./vendor/pdf.worker.mjs";
      }
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

async function loadTesseractWorker() {
  if (!window.Tesseract) {
    throw new Error("Tesseract not loaded");
  }
  if (!tesseractWorkerPromise) {
    tesseractWorkerPromise = window.Tesseract.createWorker(["chi_sim", "eng"], 1, {
      workerPath: "./vendor/tesseract.worker.min.js",
      corePath: "./vendor/tesseract-core-simd-lstm.wasm.js",
      langPath: "./vendor/tessdata",
      gzip: false,
    });
  }
  return tesseractWorkerPromise;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function persistImportedFileToDesktop(file) {
  if (!desktopFileStorageState.available || !isDesktopShell()) return null;
  const buffer = await file.arrayBuffer();
  const dataBase64 = await arrayBufferToBase64(buffer);
  return invokeDesktopCommand("store_imported_file", {
    fileName: file.name,
    dataBase64,
  });
}

function decodeXmlText(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<root>${text}</root>`, "application/xml");
  return doc.documentElement.textContent || "";
}

async function extractDocxText(file) {
  if (!window.JSZip) {
    throw new Error("JSZip not loaded");
  }
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) return "";
  const paragraphs = documentXml
    .split(/<\/w:p>/i)
    .map((chunk) => {
      const texts = [...chunk.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/gi)].map((match) => decodeXmlText(match[1]));
      return texts.join("").trim();
    })
    .filter(Boolean);
  return paragraphs.join("\n");
}

async function extractPdfText(file) {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data }).promise;
  const pages = [];
  const maxPages = Math.min(document.numPages, 20);
  for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const chunks = [];
    textContent.items.forEach((item) => {
      if (!("str" in item)) return;
      chunks.push(item.str);
      if (item.hasEOL) chunks.push("\n");
    });
    pages.push(chunks.join(" ").replace(/\s+\n/g, "\n").trim());
  }
  const directText = pages.filter(Boolean).join("\n\n").trim();
  if (directText) return directText;

  const worker = await loadTesseractWorker();
  const ocrTexts = [];
  const ocrPages = Math.min(document.numPages, 3);
  for (let pageNumber = 1; pageNumber <= ocrPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    const result = await worker.recognize(canvas);
    const text = result?.data?.text?.trim() || "";
    if (text) ocrTexts.push(text);
  }
  return ocrTexts.join("\n\n").trim();
}

function inferImportType(file) {
  const name = String(file?.name || "").toLowerCase();
  if (/\.(md|markdown|mdown|mkd|mkdn)$/i.test(name)) return "markdown-file";
  if (name.endsWith(".txt")) return "txt-file";
  if (name.endsWith(".pdf")) return "pdf-file";
  if (name.endsWith(".docx")) return "docx-file";
  if (/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/.test(name)) return "image-file";
  return inferImportTypeFromMime(file?.type || "");
}

function getUnsupportedImportTypes(fileList) {
  return [...new Set(
    [...(fileList || [])]
      .filter((file) => file && !inferImportType(file))
      .map((file) => {
        const fileName = String(file?.name || "");
        if (!fileName || (fileName.toLowerCase() === "file" && !(file?.type || "").trim())) {
          return null;
        }
        const match = fileName.toLowerCase().match(/\.([^.]+)$/);
        return match ? `.${match[1]}` : fileName;
      }),
  )];
}

function getUnsupportedImportTypesFromItems(items) {
  return [...new Set(
    [...(items || [])]
      .filter((item) => item && item.kind === "file")
      .map((item) => {
        const type = (item.type || "").toLowerCase();
        if (type === "application/pdf") return null;
        if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return null;
        if (type === "text/plain" || type === "text/markdown") return null;
        if (type.startsWith("image/")) return null;
        if (!type) return null;
        return type;
      })
      .filter(Boolean),
  )];
}

function inferImportTypeFromMime(mimeType) {
  const normalized = (mimeType || "").toLowerCase();
  if (!normalized) return null;
  if (
    normalized === "text/markdown" ||
    normalized === "text/x-markdown" ||
    normalized === "application/x-markdown"
  ) return "markdown-file";
  if (normalized === "text/plain") return "txt-file";
  if (normalized === "application/pdf") return "pdf-file";
  if (normalized === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx-file";
  if (normalized.startsWith("image/")) return "image-file";
  return null;
}

function extractImportFilesFromDataTransfer(dataTransfer) {
  const files = [...(dataTransfer?.files || [])].filter(Boolean);
  if (files.length) return files;
  return [...(dataTransfer?.items || [])]
    .filter((item) => item && item.kind === "file")
    .map((item) => item.getAsFile?.())
    .filter(Boolean);
}

function hasFileItems(items) {
  return [...(items || [])].some((item) => item && item.kind === "file");
}

function inferImportTypeFromItem(item) {
  if (!item || item.kind !== "file") return null;
  const file = item.getAsFile?.();
  return (file && inferImportType(file)) || inferImportTypeFromMime(item.type || "");
}

function getSupportedImportCountFromItems(items) {
  return [...(items || [])].filter((item) => inferImportTypeFromItem(item)).length;
}

function inspectImportPayload(dataTransfer) {
  const files = [...(dataTransfer?.files || [])].filter(Boolean);
  const items = [...(dataTransfer?.items || [])].filter(Boolean);
  const linkPayloads = extractLinkPayloads(dataTransfer);
  const containsFileItems = hasFileItems(items);
  const supportedFiles = files.filter((file) => inferImportType(file));
  const supportedFileCount = files.length ? supportedFiles.length : getSupportedImportCountFromItems(items);
  const unsupportedTypes = files.length
    ? getUnsupportedImportTypes(files)
    : getUnsupportedImportTypesFromItems(items);
  const firstLabel =
    files[0]?.name ||
    linkPayloads[0]?.title ||
    linkPayloads[0]?.url ||
    t("fileResourcePreview");
  const firstTypeLabel = files[0]?.name
    ? files[0].name.split(".").pop()?.toUpperCase() || "FILE"
    : linkPayloads.length
      ? "LINK"
      : "FILE";

  return {
    supportedFileCount,
    unsupportedTypes,
    linkPayloads,
    linkCount: linkPayloads.length,
    hasSupportedPayload:
      supportedFileCount > 0 ||
      linkPayloads.length > 0 ||
      (!files.length && containsFileItems && unsupportedTypes.length === 0),
    firstLabel,
    firstTypeLabel,
  };
}

function extractLinkPayloads(dataTransfer) {
  if (!dataTransfer) return [];
  const urls = [
    dataTransfer.getData?.("text/uri-list") || "",
    dataTransfer.getData?.("text/plain") || "",
  ]
    .join("\n")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => /^https?:\/\//i.test(item))
    .filter((item, index, arr) => arr.indexOf(item) === index);

  const html = dataTransfer.getData?.("text/html") || "";
  const plainText = (dataTransfer.getData?.("text/plain") || "").trim();
  let htmlAnchors = [];
  if (html) {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      htmlAnchors = [...doc.querySelectorAll("a[href]")].map((anchor) => ({
        href: anchor.getAttribute("href") || "",
        title: anchor.textContent?.trim() || anchor.getAttribute("title") || "",
      }));
    } catch {
      htmlAnchors = [];
    }
  }

  return urls.map((url) => {
    const matchedAnchor = htmlAnchors.find((anchor) => anchor.href === url) || htmlAnchors[0];
    const title = matchedAnchor?.title || (!/^https?:\/\//i.test(plainText) ? plainText : "") || buildLinkCardTitle(url);
    const summary =
      plainText &&
      !/^https?:\/\//i.test(plainText) &&
      plainText !== title
        ? plainText
        : title;
    return { url, title, summary };
  });
}

function buildLinkCardTitle(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "");
    const path = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "";
    return `${host}${path}`.slice(0, 120);
  } catch {
    return url.slice(0, 120);
  }
}

async function importLinks(payloads) {
  const validPayloads = (payloads || [])
    .filter((item) => item && /^https?:\/\//i.test(item.url))
    .filter((item, index, arr) => arr.findIndex((candidate) => candidate.url === item.url) === index);
  if (!validPayloads.length) return;

  const anchorId = appState.selectedResourceId;
  showActionFeedback(
    appState.language === "en"
      ? `Importing ${validPayloads.length} link card(s)...`
      : `正在导入 ${validPayloads.length} 个链接卡片...`,
  );
  validPayloads.forEach((item, index) => {
    const url = item.url;
    const id = `res-custom-link-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
    let hostLabel = url;
    try {
      const parsed = new URL(url);
      hostLabel = parsed.hostname.replace(/^www\./i, "");
    } catch {
      // Keep raw URL label.
    }
    resources.unshift({
      id,
      title: item.title || buildLinkCardTitle(url),
      type: "knowledge",
      summary: item.summary || hostLabel,
      tags: [appState.language === "en" ? "link" : "链接", "URL"],
      collections: [appState.activeCollection !== "all" ? appState.activeCollection : "collection-knowledge"],
      related: [anchorId].filter(Boolean),
      detail: url,
      preferredSlot: "context",
      sourceType: "link-card",
      sourceUrl: url,
    });
    touchResourceMeta(id, "lastEditedAt");
    touchResourceMeta(id, "lastUsedAt");
    touchResourceMeta(id, "lastViewedAt");
    if (anchorId) {
      const anchor = getResourceById(anchorId);
      if (anchor && !anchor.related.includes(id)) {
        anchor.related = [id, ...anchor.related];
      }
    }
    appState.selectedResourceId = id;
  });

  saveCustomResources();
  renderAll();
  showActionFeedback(t("importLinkSuccess").replace("{count}", String(validPayloads.length)));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMarkdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
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
    if (!inList) return;
    html += "</ul>";
    inList = false;
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
      const content = trimmed.replace(/^#{1,4}\s*/, "");
      html += `<h${level}>${renderInlineMarkdown(content)}</h${level}>`;
      return;
    }

    if (/^[-*]\s/.test(trimmed)) {
      flushParagraph();
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${renderInlineMarkdown(trimmed.replace(/^[-*]\s*/, ""))}</li>`;
      return;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      closeList();
      html += `<blockquote>${renderInlineMarkdown(trimmed.replace(/^>\s*/, ""))}</blockquote>`;
      return;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeList();
      html += "<hr />";
      return;
    }

    paragraph.push(renderInlineMarkdown(trimmed));
  });

  flushParagraph();
  closeList();
  if (inCode) html += "</code></pre>";
  return html;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSearchTokens() {
  return (dom.searchInput?.value || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizePlainText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[`#>*_\-\[\]\(\)!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchSortOptions() {
  return ["relevance", "pinned", "favorites", "recentEdited", "recentUsed", "title"];
}

function getWorkspaceMembershipSearchText(resource) {
  return Object.entries(appState.workspaceSlots)
    .filter(([, ids]) => ids.includes(resource.id))
    .map(([slotKey]) => {
      const slot = getWorkspaceSlotDefinitions().find((item) => item.id === slotKey);
      return [slot?.label || slotKey, slot?.description || ""].join(" ");
    })
    .join(" ");
}

function highlightText(text, tokens) {
  const source = String(text || "");
  if (!tokens.length || !source) return escapeHtml(source);

  const pattern = new RegExp(
    tokens
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join("|"),
    "gi",
  );

  let result = "";
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(source))) {
    result += escapeHtml(source.slice(lastIndex, match.index));
    result += `<mark class="search-mark">${escapeHtml(match[0])}</mark>`;
    lastIndex = match.index + match[0].length;
  }
  result += escapeHtml(source.slice(lastIndex));
  return result;
}

function buildResourceSearchFields(resource) {
  const collectionText = resource.collections
    .map((collectionId) => {
      const collection = collections.find((item) => item.id === collectionId);
      return collection ? `${collection.name} ${collection.summary || ""}` : "";
    })
    .join(" ");
  const workspaceText = getWorkspaceMembershipSearchText(resource);

  return [
    resource.title,
    resource.summary,
    resource.detail,
    resource.tags.join(" "),
    collectionText,
    workspaceText,
    searchPrefs.includeRawContent ? normalizePlainText(resource.rawContent || "") : "",
  ];
}

function matchesSearchTokens(resource, tokens) {
  if (!tokens.length) return true;
  const searchIndex = buildResourceSearchFields(resource).join(" ").toLowerCase();
  return tokens.every((token) => searchIndex.includes(token));
}

function buildSearchSnippet(resource, tokens) {
  if (!tokens.length) return "";

  const candidates = [
    normalizePlainText(resource.detail || ""),
    normalizePlainText(resource.summary || ""),
    normalizePlainText(
      resource.collections
        .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
        .join(" "),
    ),
    normalizePlainText(getWorkspaceMembershipSearchText(resource)),
  ].filter(Boolean);

  if (searchPrefs.includeRawContent) {
    candidates.unshift(normalizePlainText(resource.rawContent || ""));
  }

  const lowerTokens = tokens.map((token) => token.toLowerCase());
  for (const candidate of candidates) {
    const lowerCandidate = candidate.toLowerCase();
    const matchIndex = lowerTokens.reduce((minIndex, token) => {
      const index = lowerCandidate.indexOf(token);
      return index !== -1 && (minIndex === -1 || index < minIndex) ? index : minIndex;
    }, -1);
    if (matchIndex === -1) continue;

    const start = Math.max(0, matchIndex - 28);
    const end = Math.min(candidate.length, matchIndex + 88);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < candidate.length ? "..." : "";
    return `${prefix}${candidate.slice(start, end)}${suffix}`;
  }

  return "";
}

function getResourceSearchScore(resource, tokens) {
  if (!tokens.length) return 0;
  const title = resource.title.toLowerCase();
  const summary = (resource.summary || "").toLowerCase();
  const detail = (resource.detail || "").toLowerCase();
  const tags = resource.tags.map((tag) => tag.toLowerCase());
  const collectionText = resource.collections
    .map((collectionId) => {
      const collection = collections.find((item) => item.id === collectionId);
      return collection ? `${collection.name} ${collection.summary || ""}`.toLowerCase() : "";
    })
    .join(" ");
  const workspaceText = getWorkspaceMembershipSearchText(resource).toLowerCase();
  const rawText = searchPrefs.includeRawContent
    ? normalizePlainText(resource.rawContent || "").toLowerCase()
    : "";

  return tokens.reduce((score, token) => {
    if (title.includes(token)) score += 12;
    if (summary.includes(token)) score += 6;
    if (detail.includes(token)) score += 4;
    if (tags.some((tag) => tag.includes(token))) score += 8;
    if (collectionText.includes(token)) score += 4;
    if (workspaceText.includes(token)) score += 5;
    if (rawText && rawText.includes(token)) score += 3;
    return score;
  }, 0);
}

function compareResources(resourceA, resourceB, tokens) {
  const metaA = getResourceMeta(resourceA.id);
  const metaB = getResourceMeta(resourceB.id);
  const searchScoreDiff = getResourceSearchScore(resourceB, tokens) - getResourceSearchScore(resourceA, tokens);
  const titleDiff = resourceA.title.localeCompare(resourceB.title, "zh-Hans-CN");

  if (searchPrefs.sortMode === "relevance" && searchScoreDiff !== 0) return searchScoreDiff;
  if (searchPrefs.sortMode === "pinned" && metaA.pinned !== metaB.pinned) {
    return Number(metaB.pinned) - Number(metaA.pinned);
  }
  if (searchPrefs.sortMode === "favorites" && metaA.favorite !== metaB.favorite) {
    return Number(metaB.favorite) - Number(metaA.favorite);
  }
  if (searchPrefs.sortMode === "recentEdited") {
    const diff = compareTimestampDesc(metaA.lastEditedAt, metaB.lastEditedAt);
    if (diff !== 0) return diff;
  }
  if (searchPrefs.sortMode === "recentUsed") {
    const diff = compareTimestampDesc(metaA.lastUsedAt, metaB.lastUsedAt);
    if (diff !== 0) return diff;
  }
  if (searchPrefs.sortMode === "title" && titleDiff !== 0) return titleDiff;

  if (metaA.pinned !== metaB.pinned) return Number(metaB.pinned) - Number(metaA.pinned);
  if (metaA.favorite !== metaB.favorite) return Number(metaB.favorite) - Number(metaA.favorite);

  const recentUsedDiff = compareTimestampDesc(metaA.lastUsedAt, metaB.lastUsedAt);
  if (recentUsedDiff !== 0) return recentUsedDiff;

  const recentViewDiff = compareTimestampDesc(metaA.lastViewedAt, metaB.lastViewedAt);
  if (recentViewDiff !== 0) return recentViewDiff;

  if (searchPrefs.sortMode !== "title" && searchScoreDiff !== 0) return searchScoreDiff;
  return titleDiff;
}

function renderSearchToolbar() {
  if (!dom.searchSortSelect) return;
  dom.searchSortLabel.textContent = t("searchSortLabel");
  dom.searchIncludeRawLabel.textContent = t("searchIncludeRaw");
  dom.importParseModeLabel.textContent = t("importParseMode");
  if (dom.settingsSearchBodyHint) {
    dom.settingsSearchBodyHint.textContent = t("settingsSearchBodyHint");
  }
  dom.clearSearchBtn.textContent = t("clearSearch");
  if (dom.searchToolbarStatus) {
    dom.searchToolbarStatus.textContent = getSearchToolbarStatusText();
  }
  dom.searchSortSelect.innerHTML = getSearchSortOptions()
    .map(
      (mode) =>
        `<option value="${mode}" ${searchPrefs.sortMode === mode ? "selected" : ""}>${t(`searchSortModes.${mode}`)}</option>`,
    )
    .join("");
  dom.searchIncludeRawToggle.checked = Boolean(searchPrefs.includeRawContent);
  dom.importParseModeSelect.innerHTML = `
    <option value="light" ${searchPrefs.importParseMode === "light" ? "selected" : ""}>${t("importParseLight")}</option>
    <option value="skip" ${searchPrefs.importParseMode === "skip" ? "selected" : ""}>${t("importParseSkip")}</option>
  `;
}

function getRelationEntries(resource) {
  if (!resource) return [];
  const entries = new Map();
  (resource.related || []).forEach((id) => {
    if (id !== resource.id && getResourceById(id)) {
      entries.set(id, { resourceId: id, type: "related" });
    }
  });
  resources.forEach((item) => {
    if (item.id !== resource.id && item.related.includes(resource.id)) {
      entries.set(item.id, { resourceId: item.id, type: "related" });
    }
  });
  relationEdges.forEach((edge) => {
    if (edge.from === resource.id && edge.to !== resource.id && getResourceById(edge.to)) {
      entries.set(edge.to, { resourceId: edge.to, type: edge.type, direction: "outgoing" });
    } else if (edge.to === resource.id && edge.from !== resource.id && getResourceById(edge.from)) {
      entries.set(edge.from, { resourceId: edge.from, type: edge.type, direction: "incoming" });
    }
  });
  return [...entries.values()];
}

function getRelatedResourceIds(resource) {
  if (!resource) return [];
  return getRelationEntries(resource).map((entry) => entry.resourceId);
}

function getSharedCollectionIds(source, target) {
  if (!source || !target) return [];
  const sourceCollections = new Set((source.collections || []).filter((id) => id && id !== "all"));
  return (target.collections || []).filter((id) => sourceCollections.has(id));
}

function normalizeRelationToken(value) {
  return String(value || "").trim().toLowerCase();
}

function getSharedTagIds(source, target) {
  if (!source || !target) return [];
  const sourceTags = new Set((source.tags || []).map(normalizeRelationToken).filter(Boolean));
  return (target.tags || []).filter((tag) => sourceTags.has(normalizeRelationToken(tag)));
}

function getBrowserGraphPrimaryLinkMeta(selected, resource, workspaceIds = new Set()) {
  if (!selected || !resource || selected.id === resource.id) return null;
  const explicitRelation = getRelationBetween(selected.id, resource.id);
  const sharedCollections = getSharedCollectionIds(selected, resource);
  const sharedTags = getSharedTagIds(selected, resource);
  const resourceInWorkspace = workspaceIds.has(resource.id);
  const hasStructuralLink = Boolean(explicitRelation?.type || resourceInWorkspace || sharedCollections.length);
  const hasMeaningfulTagLink = sharedTags.length >= 2;

  let strength = 0;
  if (explicitRelation?.type) strength += 0.34;
  if (resourceInWorkspace) strength += 0.2;
  if (sharedCollections.length) strength += Math.min(0.28, sharedCollections.length * 0.18);
  if (sharedTags.length) strength += Math.min(0.24, sharedTags.length * 0.08);

  if (!hasStructuralLink && !hasMeaningfulTagLink) return null;
  if (strength <= 0) return null;

  const kinds = [];
  if (explicitRelation?.type) kinds.push("explicit");
  if (resourceInWorkspace) kinds.push("workspace");
  if (sharedCollections.length) kinds.push("collection");
  if (sharedTags.length) kinds.push("tag");

  const bucket = explicitRelation?.type
    ? "explicit"
    : sharedCollections.length
      ? "collection"
      : resourceInWorkspace
        ? "workspace"
        : "tag";

  return {
    bucket,
    relationType: explicitRelation?.type || (sharedCollections.length ? "collection" : "related"),
    explicitRelationType: explicitRelation?.type || null,
    priority: explicitRelation?.type ? 0 : sharedCollections.length ? 1 : resourceInWorkspace ? 2 : 3,
    sharedCollections,
    sharedTags,
    resourceInWorkspace,
    strength: Math.min(1, strength),
    kinds,
  };
}

function getBrowserGraphRelationTier(meta) {
  if (!meta) return 3;
  if (
    meta.explicitRelationType ||
    meta.resourceInWorkspace ||
    (meta.sharedCollections?.length ?? 0) > 0 ||
    (meta.strength ?? 0) >= 0.42
  ) {
    return 1;
  }
  return 2;
}

function hashString(value) {
  const input = String(value || "");
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getBrowserGraphHierarchy(selected, filtered) {
  const levelMap = new Map([[selected.id, 0]]);
  const workspaceIds = new Set(getWorkspaceResourceIds());
  const directMeta = new Map();
  filtered.forEach((resource) => {
    if (resource.id === selected.id) return;
    const meta = getBrowserGraphPrimaryLinkMeta(selected, resource, workspaceIds);
    if (!meta) return;
    directMeta.set(resource.id, meta);
  });
  const rankedIds = [...directMeta.keys()].sort((left, right) => {
    const leftMeta = directMeta.get(left);
    const rightMeta = directMeta.get(right);
    const priorityDiff = (leftMeta?.priority ?? 99) - (rightMeta?.priority ?? 99);
    if (priorityDiff !== 0) return priorityDiff;
    const strengthDiff = (rightMeta?.strength ?? 0) - (leftMeta?.strength ?? 0);
    if (Math.abs(strengthDiff) > 0.001) return strengthDiff;
    const leftResource = getResourceById(left);
    const rightResource = getResourceById(right);
    return (leftResource?.title || left).localeCompare(rightResource?.title || right, "zh-Hans-CN");
  });

  const directIds = [];
  const secondDegreeIds = [];
  rankedIds.forEach((resourceId) => {
    const tier = getBrowserGraphRelationTier(directMeta.get(resourceId));
    if (tier === 1) {
      directIds.push(resourceId);
      levelMap.set(resourceId, 1);
    } else {
      secondDegreeIds.push(resourceId);
      levelMap.set(resourceId, 2);
    }
  });

  return {
    levelMap,
    directMeta,
    directIds,
    secondDegreeIds,
    backgroundResources: filtered.filter((resource) => !levelMap.has(resource.id)),
  };
}

const BROWSER_GRAPH_SPHERE = {
  centerX: 50,
  centerY: 52,
  radiusX: 34,
  radiusY: 31,
  tiltX: -0.52,
  driftY: 0.42,
};

function buildBrowserGraphSphereVector(theta, phi, radius = 1) {
  const cosPhi = Math.cos(phi);
  return {
    x: Math.sin(theta) * cosPhi * radius,
    y: Math.sin(phi) * radius,
    z: Math.cos(theta) * cosPhi * radius,
  };
}

function rotateBrowserGraphVectorY(vector, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: vector.x * cos + vector.z * sin,
    y: vector.y,
    z: vector.z * cos - vector.x * sin,
  };
}

function rotateBrowserGraphVectorX(vector, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: vector.x,
    y: vector.y * cos - vector.z * sin,
    z: vector.z * cos + vector.y * sin,
  };
}

function buildBrowserGraphNodePositions(selectedId, directIds, secondDegreeIds, directMeta = new Map()) {
  const layout = new Map();
  layout.set(selectedId, {
    id: selectedId,
    level: 0,
    orbitMode: "core",
    phaseOffset: 0,
    drift: 0.2,
    baseScale: 1.2,
    baseOpacity: 1,
    labelOpacity: 1,
    labelScale: 1,
  });

  directIds.forEach((resourceId, index) => {
    const meta = directMeta.get(resourceId);
    const strength = Math.max(0, Math.min(1, meta?.strength ?? 0.5));
    const strongProgress = Math.max(0, Math.min(1, (strength - 0.35) / 0.45));
    const progress = (index + 0.5) / Math.max(directIds.length, 1);
    const orbit = progress * Math.PI * 2;
    const band = index % 2;
    layout.set(resourceId, {
      id: resourceId,
      level: 1,
      orbitMode: "orbit",
      orbitRadiusX: (band === 0 ? 24.5 : 28.2) - strongProgress * 9.6,
      orbitRadiusY: (band === 0 ? 14.8 : 17.2) - strongProgress * 5.4,
      orbitDepth: 0.48 + strongProgress * 0.28,
      orbitBiasY: (band === 0 ? -1.8 : 1.8) + (0.5 - strongProgress) * 1.2,
      spin: band === 0 ? 0.15 : -0.12,
      phaseOffset: orbit,
      drift: 0.28 + (index % 3) * 0.03,
      baseScale: 0.74 + strongProgress * 0.26,
      baseOpacity: 0.7 + strongProgress * 0.28,
      labelOpacity: 0.68 + strongProgress * 0.28,
      labelScale: 0.84 + strongProgress * 0.18,
    });
  });

  secondDegreeIds.forEach((resourceId, index) => {
    const meta = directMeta.get(resourceId);
    const strength = Math.max(0, Math.min(1, meta?.strength ?? 0.24));
    const progress = (index + 0.5) / Math.max(secondDegreeIds.length, 1);
    const orbit = progress * Math.PI * 2;
    const band = index % 3;
    layout.set(resourceId, {
      id: resourceId,
      level: 2,
      orbitMode: "orbit",
      orbitRadiusX: 35.8 + band * 5.2 + (0.3 - strength) * 8,
      orbitRadiusY: 22.4 + band * 3.2 + (0.3 - strength) * 4.2,
      orbitDepth: 0.28 - band * 0.04 + strength * 0.08,
      orbitBiasY: band === 1 ? -3.8 : band === 2 ? 3.8 : 1.3,
      spin: band === 0 ? 0.084 : band === 1 ? -0.064 : 0.052,
      phaseOffset: orbit + band * 0.5,
      drift: 0.18 + (index % 4) * 0.02,
      baseScale: 0.48 + strength * 0.24,
      baseOpacity: 0.28 + strength * 0.34,
      labelOpacity: 0.32 + strength * 0.36,
      labelScale: 0.7 + strength * 0.14,
    });
  });

  return layout;
}

function projectBrowserGraphSpherePoint(point, phase, timestamp = 0) {
  if (point.level === 0) {
    const pulse = 0.5 + Math.sin(timestamp * 0.00016) * 0.5;
    const x = BROWSER_GRAPH_SPHERE.centerX + Math.sin(timestamp * 0.00012) * 0.35;
    const y = BROWSER_GRAPH_SPHERE.centerY + Math.cos(timestamp * 0.0001) * 0.22;
    const depth = 1;
    return {
      x,
      y,
      depth,
      z: 1,
      scale: (point.baseScale ?? 1) * (1.02 + pulse * 0.02),
      opacity: point.baseOpacity ?? 1,
      blur: 0,
      lift: 0,
      labelOpacity: point.labelOpacity ?? 1,
      labelScale: point.labelScale ?? 1,
      brightness: 1.12 + pulse * 0.04,
    };
  }

  const orbitPhase = phase * (point.spin ?? 1) + (point.phaseOffset || 0);
  const depthWave = Math.sin(orbitPhase - Math.PI / 2);
  const depth = Math.max(0.08, Math.min(0.96, 0.5 + depthWave * (point.orbitDepth ?? 0.46)));
  const perspective = 0.78 + depth * 0.34;
  const x =
    BROWSER_GRAPH_SPHERE.centerX +
    Math.cos(orbitPhase) * (point.orbitRadiusX ?? 18) * perspective;
  const y =
    BROWSER_GRAPH_SPHERE.centerY +
    (point.orbitBiasY ?? 0) +
    Math.sin(orbitPhase) * (point.orbitRadiusY ?? 11) * (0.76 + depth * 0.26) +
    Math.sin(timestamp * 0.00011 * (point.drift || 1) + (point.phaseOffset || 0)) * BROWSER_GRAPH_SPHERE.driftY;

  const baseScale = point.baseScale ?? 1;
  const baseOpacity = point.baseOpacity ?? 1;
  const labelOpacity = point.labelOpacity ?? 1;
  const labelScale = point.labelScale ?? 1;

  return {
    x: Math.max(8, Math.min(92, x)),
    y: Math.max(10, Math.min(90, y)),
    depth,
    z: depthWave,
    scale: baseScale * (0.66 + depth * 0.5),
    opacity: Math.max(0.18, baseOpacity * (0.28 + depth * 0.78)),
    blur: Math.max(0, (1 - depth) * (point.level === 2 ? 1.2 : 0.7)),
    lift: (0.5 - depth) * 20,
    labelOpacity: Math.max(0.22, labelOpacity * (0.22 + depth * 0.86)),
    labelScale: labelScale * (0.92 + depth * 0.12),
    brightness: 0.84 + depth * 0.34,
  };
}

function projectBrowserGraphNodePositions(layout, timestamp = performance.now()) {
  const phase = timestamp * 0.00006;
  const positions = new Map();
  layout.forEach((point, id) => {
    positions.set(id, projectBrowserGraphSpherePoint(point, phase, timestamp));
  });
  return { phase, positions };
}

function relaxBrowserGraphProjectedPositions(layout, projectedPositions) {
  const entries = [...projectedPositions.entries()].map(([id, projected]) => ({
    id,
    projected: { ...projected },
    source: layout.get(id),
  }));

  const getSpacing = (left, right) => {
    const maxLevel = Math.max(left.source?.level ?? 2, right.source?.level ?? 2);
    if ((left.source?.level ?? 2) === 0 || (right.source?.level ?? 2) === 0) return 19.8;
    return maxLevel <= 1 ? 15.6 : 12.4;
  };

  for (let iteration = 0; iteration < 10; iteration += 1) {
    for (let index = 0; index < entries.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < entries.length; otherIndex += 1) {
        const left = entries[index];
        const right = entries[otherIndex];
        const dx = right.projected.x - left.projected.x;
        const dy = right.projected.y - left.projected.y;
        const distance = Math.max(0.001, Math.hypot(dx, dy));
        const minDistance = getSpacing(left, right);
        if (distance >= minDistance) continue;

        const push = (minDistance - distance) / 2;
        const normalX = dx / distance;
        const normalY = dy / distance;
        const leftWeight = (left.source?.level ?? 2) === 0 ? 0.18 : 1;
        const rightWeight = (right.source?.level ?? 2) === 0 ? 0.18 : 1;
        const totalWeight = leftWeight + rightWeight;
        const leftPush = (push * leftWeight) / totalWeight;
        const rightPush = (push * rightWeight) / totalWeight;

        left.projected.x = Math.max(10, Math.min(90, left.projected.x - normalX * leftPush));
        left.projected.y = Math.max(12, Math.min(88, left.projected.y - normalY * leftPush * 0.9));
        right.projected.x = Math.max(10, Math.min(90, right.projected.x + normalX * rightPush));
        right.projected.y = Math.max(12, Math.min(88, right.projected.y + normalY * rightPush * 0.9));
      }
    }
  }

  entries.forEach(({ id, projected }) => {
    projectedPositions.set(id, projected);
  });
}

function refineBrowserGraphLabelOpacity(layout, projectedPositions) {
  const entries = [...projectedPositions.entries()].map(([id, projected]) => ({
    id,
    projected,
    source: layout.get(id),
  }));

  entries.forEach((entry) => {
    const level = entry.source?.level ?? 2;
    if (level === 2) {
      entry.projected.labelOpacity *= 0.72;
    } else if (level === 1) {
      entry.projected.labelOpacity *= 0.96;
    }
    if (entry.projected.depth < 0.28) {
      entry.projected.labelOpacity *= level === 1 ? 0.78 : 0.48;
    }
  });

  for (let index = 0; index < entries.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < entries.length; otherIndex += 1) {
      const left = entries[index];
      const right = entries[otherIndex];
      const dx = right.projected.x - left.projected.x;
      const dy = right.projected.y - left.projected.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= 12.8) continue;

      const leftLevel = left.source?.level ?? 2;
      const rightLevel = right.source?.level ?? 2;
      const dimTarget =
        leftLevel !== rightLevel
          ? leftLevel > rightLevel
            ? left
            : right
          : (left.projected.depth ?? 0) >= (right.projected.depth ?? 0)
            ? right
            : left;
      dimTarget.projected.labelOpacity *= dimTarget.source?.level === 2 ? 0.12 : 0.62;
    }
  }

  entries.forEach((entry) => {
    if ((entry.source?.level ?? 2) === 1) {
      entry.projected.labelOpacity = Math.max(0.58, entry.projected.labelOpacity);
    }
  });
}

function buildBrowserGraphBackgroundParticles(backgroundResources) {
  return backgroundResources.slice(0, 140).map((resource, index) => {
    const hash = hashString(`${resource.id}:${index}`);
    const theta = Math.PI + ((((hash % 1000) / 1000) - 0.5) * 1.8);
    const phi = ((((hash >> 5) % 1000) / 1000) - 0.5) * 1.24;
    const tint = hash % 6;
    return {
      id: resource.id,
      vector: buildBrowserGraphSphereVector(theta, phi),
      spin: 0.16 + ((hash >> 9) % 12) * 0.018,
      phaseOffset: ((hash >> 12) % 628) / 100,
      radius: 0.36 + ((hash >> 7) % 5) * 0.14,
      alpha: 0.02 + ((hash >> 14) % 8) * 0.007,
      glowRadius: 2.8 + ((hash >> 18) % 6) * 0.8,
      trailRadius: 8 + ((hash >> 21) % 8) * 1.3,
      glow:
        tint === 0
          ? "rgba(170, 205, 255, 0.22)"
          : tint === 1
            ? "rgba(147, 255, 229, 0.18)"
            : tint === 2
              ? "rgba(255, 223, 167, 0.18)"
              : "rgba(255, 255, 255, 0.18)",
    };
  });
}

function applyBrowserGraphNodeProjection(cache, timestamp = performance.now()) {
  if (!cache.sphereEpoch) {
    cache.sphereEpoch = timestamp;
  }
  const relativeTimestamp = Math.max(0, timestamp - cache.sphereEpoch);
  const { phase, positions } = projectBrowserGraphNodePositions(cache.positions, relativeTimestamp);
  relaxBrowserGraphProjectedPositions(cache.positions, positions);
  refineBrowserGraphLabelOpacity(cache.positions, positions);
  cache.projectedPositions = positions;
  cache.spherePhase = phase;

  cache.nodes.forEach((node, id) => {
    const projected = positions.get(id);
    if (!projected) return;
    const projectedX = ((cache.canvasWidth || 0) * projected.x) / 100;
    const projectedY = ((cache.canvasHeight || 0) * projected.y) / 100;
    node.style.removeProperty("left");
    node.style.removeProperty("top");
    node.style.setProperty("--graph-node-x", `${projectedX.toFixed(2)}px`);
    node.style.setProperty("--graph-node-y", `${projectedY.toFixed(2)}px`);
    node.style.setProperty("--graph-node-scale", projected.scale.toFixed(3));
    node.style.setProperty("--graph-node-opacity", projected.opacity.toFixed(3));
    node.style.setProperty("--graph-node-blur", `${projected.blur.toFixed(2)}px`);
    node.style.setProperty("--graph-node-lift", `${projected.lift.toFixed(2)}px`);
    node.style.setProperty("--graph-label-opacity", projected.labelOpacity.toFixed(3));
    node.style.setProperty("--graph-label-scale", projected.labelScale.toFixed(3));
    node.style.setProperty("--graph-node-brightness", projected.brightness.toFixed(3));
    node.style.zIndex = `${6 + Math.round(projected.depth * 18)}`;
  });
}

function drawBrowserGraphSphereGuides(cache, timestamp) {
  const ctx = cache.ctx;
  if (!ctx) return;
  const width = cache.canvasWidth || 1;
  const height = cache.canvasHeight || 1;
  const selected = cache.projectedPositions.get(cache.selectedId) || {
    x: BROWSER_GRAPH_SPHERE.centerX,
    y: BROWSER_GRAPH_SPHERE.centerY,
  };
  const centerX = width * (selected.x / 100);
  const centerY = height * (selected.y / 100);
  const phase = cache.spherePhase || timestamp * 0.00006;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const shellGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.28);
  shellGlow.addColorStop(0, "rgba(188, 214, 255, 0.12)");
  shellGlow.addColorStop(0.54, "rgba(188, 214, 255, 0.038)");
  shellGlow.addColorStop(1, "rgba(188, 214, 255, 0)");
  ctx.fillStyle = shellGlow;
  ctx.fillRect(centerX - width * 0.26, centerY - height * 0.22, width * 0.52, height * 0.44);

  const drawEllipse = (rx, ry, rotation, alpha, lineWidth) => {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, rx, ry, rotation, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(236, 242, 252, 0.92)";
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const orbitSpecs = [
    { rx: width * 0.136, ry: height * 0.084, alpha: 0.102, rotation: phase * 0.2 - 0.22 },
    { rx: width * 0.114, ry: height * 0.066, alpha: 0.078, rotation: phase * -0.16 + 0.48 },
    { rx: width * 0.192, ry: height * 0.112, alpha: 0.058, rotation: phase * 0.12 + 0.18 },
    { rx: width * 0.218, ry: height * 0.126, alpha: 0.044, rotation: phase * -0.1 - 0.34 },
    { rx: width * 0.242, ry: height * 0.142, alpha: 0.034, rotation: phase * 0.08 + 0.72 },
  ];

  orbitSpecs.forEach((orbit, index) => {
    drawEllipse(orbit.rx, orbit.ry, orbit.rotation, orbit.alpha, index < 2 ? 0.7 : 0.54);
  });

  ctx.restore();
}

function buildRelationTypeOptionsMarkup(selectedType = "reference") {
  return ["dependency", "similar", "upstream", "downstream", "reference"]
    .map(
      (type) =>
        `<option value="${type}" ${type === selectedType ? "selected" : ""}>${t(`relationTypes.${type}`)}</option>`,
    )
    .join("");
}

function getRelationBetween(sourceId, targetId) {
  const explicitEdge = relationEdges.find(
    (edge) =>
      (edge.from === sourceId && edge.to === targetId) ||
      (edge.from === targetId && edge.to === sourceId),
  );
  if (explicitEdge) return explicitEdge;
  const source = getResourceById(sourceId);
  const target = getResourceById(targetId);
  if (source?.related.includes(targetId) || target?.related.includes(sourceId)) {
    return { from: sourceId, to: targetId, type: "related" };
  }
  return null;
}

function getGraphLineStyle(relationType, isPrimaryLink = false, isWorkspaceLink = false) {
  const type = relationType || "related";
  const baseStyles = {
    dependency: {
      stroke: "rgba(255, 171, 206, 0.24)",
      glow: "rgba(255, 171, 206, 0.26)",
      strokeWidth: isPrimaryLink ? "0.64" : "0.38",
      strokeDasharray: "1.4 10",
      particleStroke: "rgba(255, 182, 214, 0.72)",
      particleWidth: isPrimaryLink ? "0.9" : "0.65",
      particleDasharray: isPrimaryLink ? "0.01 7 0.01 15" : "0.01 9 0.01 18",
      particleDuration: isPrimaryLink ? "8.4" : "11.6",
    },
    similar: {
      stroke: "rgba(168, 212, 255, 0.22)",
      glow: "rgba(168, 212, 255, 0.24)",
      strokeWidth: isPrimaryLink ? "0.59" : "0.36",
      strokeDasharray: "1.1 9",
      particleStroke: "rgba(186, 223, 255, 0.68)",
      particleWidth: isPrimaryLink ? "0.85" : "0.62",
      particleDasharray: isPrimaryLink ? "0.01 8 0.01 16" : "0.01 10 0.01 19",
      particleDuration: isPrimaryLink ? "9.4" : "12.6",
    },
    upstream: {
      stroke: "rgba(147, 255, 229, 0.22)",
      glow: "rgba(147, 255, 229, 0.24)",
      strokeWidth: isPrimaryLink ? "0.57" : "0.35",
      strokeDasharray: "1 11",
      particleStroke: "rgba(167, 255, 234, 0.72)",
      particleWidth: isPrimaryLink ? "0.85" : "0.6",
      particleDasharray: isPrimaryLink ? "0.01 7 0.01 14" : "0.01 10 0.01 18",
      particleDuration: isPrimaryLink ? "8.8" : "11.8",
    },
    downstream: {
      stroke: "rgba(255, 223, 167, 0.23)",
      glow: "rgba(255, 223, 167, 0.24)",
      strokeWidth: isPrimaryLink ? "0.57" : "0.36",
      strokeDasharray: "1.6 12",
      particleStroke: "rgba(255, 232, 185, 0.72)",
      particleWidth: isPrimaryLink ? "0.83" : "0.62",
      particleDasharray: isPrimaryLink ? "0.01 8 0.01 15" : "0.01 11 0.01 20",
      particleDuration: isPrimaryLink ? "9.2" : "12.2",
    },
    reference: {
      stroke: "rgba(226, 238, 255, 0.14)",
      glow: "rgba(226, 238, 255, 0.18)",
      strokeWidth: isPrimaryLink ? "0.51" : "0.32",
      strokeDasharray: "1 14",
      particleStroke: "rgba(234, 242, 255, 0.58)",
      particleWidth: isPrimaryLink ? "0.77" : "0.54",
      particleDasharray: isPrimaryLink ? "0.01 10 0.01 18" : "0.01 12 0.01 22",
      particleDuration: isPrimaryLink ? "10.2" : "13.8",
    },
    collection: {
      stroke: "rgba(142, 196, 255, 0.22)",
      glow: "rgba(142, 196, 255, 0.24)",
      strokeWidth: isPrimaryLink ? "0.58" : "0.36",
      strokeDasharray: "1.2 12",
      particleStroke: "rgba(186, 222, 255, 0.68)",
      particleWidth: isPrimaryLink ? "0.82" : "0.58",
      particleDasharray: isPrimaryLink ? "0.01 8 0.01 16" : "0.01 10 0.01 20",
      particleDuration: isPrimaryLink ? "9.6" : "12.8",
    },
    related: {
      stroke: "rgba(154, 193, 255, 0.16)",
      glow: "rgba(154, 193, 255, 0.2)",
      strokeWidth: isPrimaryLink ? "0.52" : "0.33",
      strokeDasharray: "1 16",
      particleStroke: "rgba(171, 206, 255, 0.62)",
      particleWidth: isPrimaryLink ? "0.8" : "0.56",
      particleDasharray: isPrimaryLink ? "0.01 9 0.01 18" : "0.01 12 0.01 24",
      particleDuration: isPrimaryLink ? "9.8" : "13.2",
    },
  };
  const style = baseStyles[type] || baseStyles.related;
  if (isWorkspaceLink) {
    return {
      stroke: "rgba(255, 223, 167, 0.14)",
      glow: "rgba(255, 223, 167, 0.18)",
      strokeWidth: "0.31",
      strokeDasharray: "1 18",
      particleStroke: "rgba(255, 232, 185, 0.44)",
      particleWidth: "0.48",
      particleDasharray: "0.01 14 0.01 28",
      particleDuration: "15.6",
    };
  }
  return style;
}

function mixColorChannel(left, right, progress) {
  return Math.round(left + (right - left) * progress);
}

function rgbaString(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function getBrowserSemanticLineStyle(meta, isPrimaryLink = false, hierarchyLevel = 0) {
  const clamped = Math.max(0.08, Math.min(1, meta?.strength ?? 0.24));
  const colorProgress = Math.max(0, Math.min(1, (clamped - 0.08) / 0.92));
  const start = [112, 182, 255];
  const end = [171, 118, 255];
  const color = [
    mixColorChannel(start[0], end[0], colorProgress),
    mixColorChannel(start[1], end[1], colorProgress),
    mixColorChannel(start[2], end[2], colorProgress),
  ];
  const particleColor = [
    Math.min(255, color[0] + 24),
    Math.min(255, color[1] + 20),
    Math.min(255, color[2] + 18),
  ];
  const opacityScale = hierarchyLevel >= 1 ? 0.98 : 1;
  return {
    stroke: rgbaString(color, (isPrimaryLink ? 0.34 : 0.24) * opacityScale + colorProgress * 0.18),
    glow: rgbaString(color, (isPrimaryLink ? 0.22 : 0.15) * opacityScale + colorProgress * 0.1),
    strokeWidth: String((isPrimaryLink ? 0.68 : 0.46) + colorProgress * (isPrimaryLink ? 0.22 : 0.14)),
    strokeDasharray: isPrimaryLink ? "1.1 10" : "1 14",
    particleStroke: rgbaString(particleColor, (isPrimaryLink ? 0.88 : 0.62) * opacityScale + colorProgress * 0.14),
    particleWidth: String((isPrimaryLink ? 0.92 : 0.66) + colorProgress * 0.16),
    particleDasharray: isPrimaryLink ? "0.01 8 0.01 16" : "0.01 11 0.01 20",
    particleDuration: String((isPrimaryLink ? 10.2 : 13.4) - colorProgress * 2.1),
  };
}

function getRelationAccentClass(relationType) {
  return `accent-${relationType || "related"}`;
}

function buildGraphNodeBadges(resource) {
  const meta = getResourceMeta(resource.id);
  const badges = [];
  if (meta.pinned) badges.push(`<span class="graph-mini-badge">${t("pinnedBadge")}</span>`);
  if (meta.favorite) badges.push(`<span class="graph-mini-badge">${t("favoriteBadge")}</span>`);
  return badges.length ? `<div class="graph-node__badges">${badges.join("")}</div>` : "";
}

function buildGraphNodeOrbMarkup(resource, variant = "local") {
  const base = variant === "browser" ? "browser-graph-node" : "graph-node";
  if (isImageResource(resource) && resource.previewUrl) {
    return `
      <div class="${base}__orb">
        <img class="${base}__image" src="${resource.previewUrl}" alt="${escapeHtml(resource.title)}" />
      </div>
    `;
  }
  return `
    <div class="${base}__orb">
      <span class="${base}__dot"></span>
    </div>
  `;
}

function getImageAccent(resourceId) {
  const input = String(resourceId || "");
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 360;
  }
  const hue = (hash + 200) % 360;
  return {
    solid: `hsla(${hue}, 75%, 72%, 0.22)`,
    glow: `hsla(${hue}, 82%, 70%, 0.18)`,
    border: `hsla(${hue}, 74%, 76%, 0.32)`,
  };
}

function applyImageNodeAccent(node, resource) {
  if (!node) return;
  if (!isImageResource(resource)) {
    node.style.removeProperty("--image-accent");
    node.style.removeProperty("--image-glow");
    node.style.removeProperty("--image-border");
    return;
  }
  const accent = getImageAccent(resource.id);
  node.style.setProperty("--image-accent", accent.solid);
  node.style.setProperty("--image-glow", accent.glow);
  node.style.setProperty("--image-border", accent.border);
}

function buildBrowserGraphNodeMarkup(resource) {
  return `
    ${buildGraphNodeOrbMarkup(resource, "browser")}
    <div class="browser-graph-node__label">
      <strong>${resource.title}</strong>
    </div>
    ${buildGraphNodeBadges(resource).replace("graph-node__badges", "browser-graph-node__badges")}
  `;
}

function buildLocalGraphNodeMarkup(resource) {
  return `
    ${buildGraphNodeOrbMarkup(resource, "local")}
    <div class="graph-node__label">
      <strong>${resource.title}</strong>
    </div>
    ${buildGraphNodeBadges(resource)}
  `;
}

function getLocalGraphLabelConfig(nodeX, nodeY, center, variant) {
  const dx = nodeX - center.x;
  const dy = nodeY - center.y;
  if (variant === "primary") {
    return {
      offsetX: 0,
      offsetY: 28,
      scale: 1,
      anchorX: "-50%",
      anchorY: "0%",
      textAlign: "center",
      maxWidth: "152px",
    };
  }

  const isWorkspace = variant === "workspace";
  const scale = isWorkspace ? 0.9 : 0.96;
  const maxWidth = isWorkspace ? "96px" : "112px";

  if (dy < -10) {
    return {
      offsetX: 0,
      offsetY: isWorkspace ? -16 : -18,
      scale,
      anchorX: "-50%",
      anchorY: "-100%",
      textAlign: "center",
      maxWidth,
    };
  }

  if (dx < -8 && Math.abs(dy) <= 18) {
    return {
      offsetX: isWorkspace ? -14 : -16,
      offsetY: 0,
      scale,
      anchorX: "-100%",
      anchorY: "-50%",
      textAlign: "right",
      maxWidth,
    };
  }

  if (dx > 8 && Math.abs(dy) <= 18) {
    return {
      offsetX: isWorkspace ? 14 : 16,
      offsetY: 0,
      scale,
      anchorX: "0%",
      anchorY: "-50%",
      textAlign: "left",
      maxWidth,
    };
  }

  if (dy >= 0 && dx <= 0) {
    return {
      offsetX: isWorkspace ? -10 : -12,
      offsetY: isWorkspace ? 14 : 16,
      scale,
      anchorX: "-100%",
      anchorY: "0%",
      textAlign: "right",
      maxWidth,
    };
  }

  return {
    offsetX: isWorkspace ? 10 : 12,
    offsetY: isWorkspace ? 14 : 16,
    scale,
    anchorX: "0%",
    anchorY: "0%",
    textAlign: "left",
    maxWidth,
  };
}

function resolveLocalGraphLabelLayouts(activeNodes, center, stageWidth, stageHeight) {
  const layouts = new Map();
  const entries = [...activeNodes.entries()].map(([id, config]) => ({
    id,
    config,
    resource: getResourceById(id),
  }));

  entries.forEach(({ id, config, resource }) => {
    const base = getLocalGraphLabelConfig(config.x, config.y, center, config.variant);
    const text = resource?.title || "";
    const estimatedWidth = Math.min(
      parseInt(base.maxWidth, 10) || 116,
      Math.max(56, text.length * 11),
    );
    const estimatedHeight = config.variant === "primary" ? 26 : 22;
    layouts.set(id, {
      ...base,
      width: estimatedWidth,
      height: estimatedHeight,
      xPx: (config.x / 100) * stageWidth,
      yPx: (config.y / 100) * stageHeight,
      variant: config.variant,
    });
  });

  const getRect = (layout) => {
    const anchorX = layout.anchorX === "-100%" ? -1 : layout.anchorX === "0%" ? 0 : -0.5;
    const anchorY = layout.anchorY === "-100%" ? -1 : layout.anchorY === "0%" ? 0 : -0.5;
    const left = layout.xPx + layout.offsetX + anchorX * layout.width;
    const top = layout.yPx + layout.offsetY + anchorY * layout.height;
    return {
      left,
      top,
      right: left + layout.width,
      bottom: top + layout.height,
    };
  };

  for (let iteration = 0; iteration < 6; iteration += 1) {
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const a = layouts.get(entries[i].id);
        const b = layouts.get(entries[j].id);
        if (!a || !b) continue;
        if (a.variant === "primary" && b.variant === "primary") continue;
        const rectA = getRect(a);
        const rectB = getRect(b);
        const overlapX = Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left);
        const overlapY = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top);
        if (overlapX > 0 && overlapY > 0) {
          const shift = Math.max(8, overlapY + 6);
          const aWeight = a.variant === "workspace" ? 1.2 : a.variant === "primary" ? 0.4 : 1;
          const bWeight = b.variant === "workspace" ? 1.2 : b.variant === "primary" ? 0.4 : 1;
          const total = aWeight + bWeight;
          const direction = a.yPx <= b.yPx ? -1 : 1;
          a.offsetY += direction * shift * (aWeight / total);
          b.offsetY -= direction * shift * (bWeight / total);
        }
      }
    }
  }

  return layouts;
}

function ensureGraphHud(container) {
  let hud = container.querySelector(".graph-hud");
  if (!hud) {
    hud = document.createElement("div");
    hud.className = "graph-hud";
    container.appendChild(hud);
  }
  return hud;
}

function ensureGraphImageZoom(container) {
  let panel = container.querySelector(".graph-image-zoom");
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "graph-image-zoom is-hidden";
    container.appendChild(panel);
  }
  return panel;
}

function updateGraphHud(type, hoveredId) {
  const container = type === "browser" ? dom.resourceMap : dom.graphStage;
  if (!container) return;
  const hud = ensureGraphHud(container);
  const selected = getSelectedResource();
  const target = hoveredId ? getResourceById(hoveredId) : selected;
  hud.innerHTML = `
    <div class="graph-hud__title">${target?.title || ""}</div>
  `;
}

function positionGraphImageZoom(type, resourceId) {
  const container = type === "browser" ? dom.resourceMap : dom.graphStage;
  if (!container) return;
  const zoom = ensureGraphImageZoom(container);
  const node = graphState[type]?.nodes?.get(resourceId);
  if (!node) return;
  const nodeRect = node.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const panelWidth = 184;
  const panelHeight = 184;
  const pointer = graphPointerState[type];
  const gapX = 18;
  const gapY = 12;
  let left = pointer?.x
    ? pointer.x - containerRect.left + gapX
    : nodeRect.right - containerRect.left + gapX;
  let top = pointer?.y
    ? pointer.y - containerRect.top - panelHeight / 2 + gapY
    : nodeRect.top - containerRect.top + nodeRect.height / 2 - panelHeight / 2;
  if (left + panelWidth > containerRect.width - 12) {
    left = (pointer?.x
      ? pointer.x - containerRect.left - panelWidth - gapX
      : nodeRect.left - containerRect.left - panelWidth - gapX);
  }
  if (left < 12) {
    left = Math.max(12, Math.min(containerRect.width - panelWidth - 12, nodeRect.left - containerRect.left + nodeRect.width / 2 - panelWidth / 2));
  }
  top = Math.max(12, Math.min(containerRect.height - panelHeight - 12, top));
  zoom.style.left = `${left}px`;
  zoom.style.top = `${top}px`;
  if (pointer?.x && pointer?.y) {
    const offsetX = Math.max(-10, Math.min(10, (pointer.x - (nodeRect.left + nodeRect.width / 2)) * 0.06));
    const offsetY = Math.max(-8, Math.min(8, (pointer.y - (nodeRect.top + nodeRect.height / 2)) * 0.04));
    zoom.style.setProperty("--zoom-offset-x", `${offsetX}px`);
    zoom.style.setProperty("--zoom-offset-y", `${offsetY}px`);
  } else {
    zoom.style.setProperty("--zoom-offset-x", "0px");
    zoom.style.setProperty("--zoom-offset-y", "0px");
  }
}

function hideGraphImageZoom(type) {
  if (graphImageZoomState.timeoutId) {
    clearTimeout(graphImageZoomState.timeoutId);
    graphImageZoomState.timeoutId = null;
  }
  const container = type === "browser" ? dom.resourceMap : dom.graphStage;
  const zoom = container?.querySelector(".graph-image-zoom");
  if (zoom) {
    zoom.classList.remove("is-visible");
    zoom.classList.add("is-hidden");
  }
  graphImageZoomState.type = null;
  graphImageZoomState.resourceId = null;
}

function showGraphImageZoom(type, resourceId) {
  const resource = getResourceById(resourceId);
  const container = type === "browser" ? dom.resourceMap : dom.graphStage;
  if (!container || !isImageResource(resource) || !resource.previewUrl) {
    hideGraphImageZoom(type);
    return;
  }
  const zoom = ensureGraphImageZoom(container);
  graphImageZoomState.type = type;
  graphImageZoomState.resourceId = resourceId;
  zoom.innerHTML = `<img src="${resource.previewUrl}" alt="${escapeHtml(resource.title)}" />`;
  positionGraphImageZoom(type, resourceId);
  zoom.classList.remove("is-hidden");
  requestAnimationFrame(() => zoom.classList.add("is-visible"));
}

function scheduleGraphImageZoom(type, resourceId) {
  if (graphImageZoomState.timeoutId) {
    clearTimeout(graphImageZoomState.timeoutId);
    graphImageZoomState.timeoutId = null;
  }
  if (!resourceId || !isImageResource(getResourceById(resourceId))) {
    hideGraphImageZoom(type);
    return;
  }
  graphImageZoomState.type = type;
  graphImageZoomState.resourceId = resourceId;
  graphImageZoomState.timeoutId = setTimeout(() => {
    graphImageZoomState.timeoutId = null;
    showGraphImageZoom(type, resourceId);
  }, 180);
}

function applyGraphRelationModeUi() {
  if (!dom.graphRelationModeBtn || !dom.graphRelationTypeSelect) return;
  dom.graphRelationModeBtn.textContent = graphRelationState.active
    ? t("graphRelationModeExit")
    : appState.language === "en"
      ? "Link"
      : "连线";
  dom.graphRelationModeBtn.classList.toggle("is-active", graphRelationState.active);
  dom.graphStage?.classList.toggle("is-relation-mode", graphRelationState.active);
  dom.graphRelationTypeSelect.innerHTML = buildRelationTypeOptionsMarkup(
    dom.graphRelationTypeSelect.value || "reference",
  );
}

function renderGraphLegendButtons() {
  document.querySelectorAll("[data-legend-filter]").forEach((button) => {
    const key = button.dataset.legendFilter;
    const isActive =
      key === "primary"
        ? true
        : key === "secondary"
          ? graphLegendState.showSecondary
          : graphLegendState.showWorkspace;
    button.classList.toggle("is-active", isActive);
    button.classList.toggle("is-mode", key === "primary" && graphLegendState.focusOnly);
  });
}

function toggleGraphLegendFilter(filterKey) {
  if (filterKey === "primary") {
    graphLegendState.focusOnly = !graphLegendState.focusOnly;
    if (graphLegendState.focusOnly) {
      graphLegendState.showSecondary = false;
      graphLegendState.showWorkspace = false;
    } else {
      graphLegendState.showSecondary = true;
      graphLegendState.showWorkspace = true;
    }
  } else if (filterKey === "secondary") {
    graphLegendState.focusOnly = false;
    graphLegendState.showSecondary = !graphLegendState.showSecondary;
  } else if (filterKey === "workspace") {
    graphLegendState.focusOnly = false;
    graphLegendState.showWorkspace = !graphLegendState.showWorkspace;
  }
  renderGraphLegendButtons();
  renderGraphSmooth();
}

function toggleGraphRelationMode(forceValue) {
  graphRelationState.active =
    typeof forceValue === "boolean" ? forceValue : !graphRelationState.active;
  applyGraphRelationModeUi();
  dom.actionFeedback.textContent = graphRelationState.active ? t("graphRelationModeHint") : "";
}

function handleGraphNodeClick(resourceId, sourceEl) {
  const selected = getSelectedResource();
  if (
    graphRelationState.active &&
    selected &&
    selected.id &&
    selected.id !== resourceId
  ) {
    addResourceRelation(
      selected.id,
      resourceId,
      dom.graphRelationTypeSelect?.value || "reference",
    );
    toggleGraphRelationMode(false);
    return;
  }
  updateSelection(resourceId, sourceEl);
}

function ensureGraphPreviewPanel() {
  if (graphPreviewState.panelEl?.isConnected) return graphPreviewState.panelEl;
  const panel = document.createElement("aside");
  panel.className = "graph-preview-panel is-hidden";
  document.body.appendChild(panel);
  graphPreviewState.panelEl = panel;
  return panel;
}

function buildGraphPreviewMarkup(resource) {
  const meta = getResourceMeta(resource.id);
  const relation = graphPreviewState.resourceId
    ? getRelationBetween(getSelectedResource()?.id, resource.id)
    : null;
  const collectionNames = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");
  const searchTokens = getSearchTokens();
  const rawSnippet = buildSearchSnippet(resource, searchTokens);
  const detailSnippet = (resource.detail || resource.summary || normalizePlainText(resource.rawContent || "") || t("graphPreviewEmpty")).slice(0, 220);
  const previewText = isDocumentResource(resource)
    ? rawSnippet || normalizePlainText(resource.rawContent || "").slice(0, 220) || detailSnippet
    : rawSnippet || detailSnippet;
  const sourceLabel = isDocumentResource(resource)
    ? resource.fileName || t("markdownSource")
    : t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type;
  const badges = [
    meta.pinned ? `<span class="graph-mini-badge">${t("pinnedBadge")}</span>` : "",
    meta.favorite ? `<span class="graph-mini-badge">${t("favoriteBadge")}</span>` : "",
    relation ? `<span class="graph-mini-badge">${t(`relationTypes.${relation.type || "related"}`)}</span>` : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <div class="graph-preview-panel__eyebrow ${getRelationAccentClass(relation?.type)}">${t("graphPreview")}</div>
    <div class="graph-preview-panel__title">${escapeHtml(resource.title)}</div>
    <div class="graph-preview-panel__meta">
      ${(t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type)}
      ${collectionNames ? ` · ${escapeHtml(collectionNames)}` : ""}
    </div>
    ${
      isDocumentResource(resource)
        ? `<div class="graph-preview-panel__source ${getRelationAccentClass(relation?.type)}">${t("documentSource")} · ${escapeHtml(sourceLabel)}</div>`
        : ""
    }
    ${badges ? `<div class="graph-preview-panel__badges">${badges}</div>` : ""}
    <div class="graph-preview-panel__content">${highlightText(previewText, searchTokens)}</div>
    <div class="graph-preview-panel__hint">
      <span>${t("graphPreviewClickHint")}</span>
      <span>${t("graphPreviewDoubleClickHint")}</span>
    </div>
  `;
}

function positionGraphPreview(type, resourceId) {
  const panel = ensureGraphPreviewPanel();
  const node = graphState[type]?.nodes?.get(resourceId);
  const panelWidth = 320;
  const panelHeight = 220;
  const gap = 16;
  let left;
  let top;

  if (!node) {
    const pointer = graphPointerState[type];
    if (!pointer?.x || !pointer?.y) return;
    left = pointer.x + gap;
    top = pointer.y - panelHeight / 2;
  } else {
    const rect = node.getBoundingClientRect();
    left = rect.right + gap;
    top = rect.top + rect.height / 2 - panelHeight / 2;
    if (left + panelWidth > window.innerWidth - 16) {
      left = rect.left - panelWidth - gap;
    }
    if (left < 16) {
      left = Math.max(16, Math.min(window.innerWidth - panelWidth - 16, rect.left + rect.width / 2 - panelWidth / 2));
    }
  }
  if (left + panelWidth > window.innerWidth - 16) {
    left = Math.max(16, window.innerWidth - panelWidth - 16);
  }
  if (left < 16) left = 16;
  top = Math.max(16, Math.min(window.innerHeight - panelHeight - 16, top));
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function hideGraphPreview() {
  if (graphPreviewState.timeoutId) {
    clearTimeout(graphPreviewState.timeoutId);
    graphPreviewState.timeoutId = null;
  }
  if (graphPreviewState.panelEl) {
    graphPreviewState.panelEl.classList.remove("is-visible");
    graphPreviewState.panelEl.classList.add("is-hidden");
  }
  graphPreviewState.type = null;
  graphPreviewState.resourceId = null;
}

function showGraphPreview(type, resourceId) {
  const resource = getResourceById(resourceId);
  if (!resource) return;
  const panel = ensureGraphPreviewPanel();
  graphPreviewState.type = type;
  graphPreviewState.resourceId = resourceId;
  panel.innerHTML = buildGraphPreviewMarkup(resource);
  positionGraphPreview(type, resourceId);
  panel.classList.remove("is-hidden");
  requestAnimationFrame(() => panel.classList.add("is-visible"));
}

function scheduleGraphPreview(type, resourceId) {
  if (graphPreviewState.timeoutId) {
    clearTimeout(graphPreviewState.timeoutId);
    graphPreviewState.timeoutId = null;
  }
  if (!resourceId) {
    hideGraphPreview();
    return;
  }
  graphPreviewState.type = type;
  graphPreviewState.resourceId = resourceId;
  graphPreviewState.timeoutId = setTimeout(() => {
    graphPreviewState.timeoutId = null;
    showGraphPreview(type, resourceId);
  }, type === "browser" ? 220 : 320);
}

function t(path) {
  const active = translations[appState.language] || translations.zh;
  return path.split(".").reduce((acc, key) => acc?.[key], active) ?? path;
}

function getSearchToolbarStatusText() {
  const retrievalScope = searchPrefs.includeRawContent
    ? t("searchBodyOnShort")
    : t("searchBodyOffShort");
  const parseMode =
    searchPrefs.importParseMode === "skip" ? t("importParseSkip") : t("importParseLight");
  return `${t("searchToolbarPrefix")} · ${retrievalScope} · ${parseMode}`;
}

function updateSettingsPopoverMotionOrigin() {
  if (!dom.settingsBtn || !dom.settingsPopover) return;
  const buttonRect = dom.settingsBtn.getBoundingClientRect();
  const modalWidth = Math.min(430, Math.max(300, window.innerWidth - 36));
  const modalHeight = Math.min(560, Math.max(360, window.innerHeight - 80));
  const modalLeft = (window.innerWidth - modalWidth) / 2;
  const modalTop = (window.innerHeight - modalHeight) / 2;
  const originX = Math.max(28, Math.min(modalWidth - 28, buttonRect.left + buttonRect.width / 2 - modalLeft));
  const originY = Math.max(24, Math.min(modalHeight - 24, buttonRect.top + buttonRect.height / 2 - modalTop));
  dom.settingsPopover.style.setProperty("--settings-origin-x", `${originX}px`);
  dom.settingsPopover.style.setProperty("--settings-origin-y", `${originY}px`);
}

function setSettingsPopoverOpen(nextOpen) {
  settingsState.open = Boolean(nextOpen);
  updateSettingsPopoverMotionOrigin();
  if (dom.settingsPopover) {
    dom.settingsPopover.classList.toggle("is-hidden", !settingsState.open);
  }
  if (dom.settingsScrim) {
    dom.settingsScrim.classList.toggle("is-hidden", !settingsState.open);
    dom.settingsScrim.classList.toggle("is-visible", settingsState.open);
  }
  if (dom.settingsBtn) {
    dom.settingsBtn.classList.toggle("is-active", settingsState.open);
    dom.settingsBtn.setAttribute("aria-expanded", settingsState.open ? "true" : "false");
  }
}

function syncSettingsLanguageButtons() {
  if (!dom.settingsLanguageZhBtn || !dom.settingsLanguageEnBtn) return;
  const isZh = appState.language === "zh";
  dom.settingsLanguageZhBtn.classList.toggle("is-active", isZh);
  dom.settingsLanguageEnBtn.classList.toggle("is-active", !isZh);
  dom.settingsLanguageZhBtn.setAttribute("aria-pressed", isZh ? "true" : "false");
  dom.settingsLanguageEnBtn.setAttribute("aria-pressed", !isZh ? "true" : "false");
}

function getDesktopFileStorageDisplayPath() {
  if (desktopFileStorageState.available) {
    return `${t("settingsFileStorageDefaultPrefix")} · ${desktopFileStorageState.currentDir || desktopFileStorageState.defaultDir}`;
  }
  if (!desktopFileStorageState.initialized) {
    return t("fileStorageLoading");
  }
  return isDesktopShell()
    ? t("settingsFileStorageUnavailable")
    : t("settingsFileStorageDesktopOnly");
}

function renderDesktopFileStorageSettings() {
  if (dom.settingsFileStorageLabel) {
    dom.settingsFileStorageLabel.textContent = t("settingsFileStorageLabel");
  }
  if (dom.settingsFileStorageHint) {
    dom.settingsFileStorageHint.textContent = t("settingsFileStorageHint");
  }
  if (dom.settingsFileStoragePath) {
    dom.settingsFileStoragePath.textContent = getDesktopFileStorageDisplayPath();
    dom.settingsFileStoragePath.classList.toggle(
      "is-muted",
      !desktopFileStorageState.available,
    );
  }
  if (dom.settingsFileStorageBtn) {
    dom.settingsFileStorageBtn.textContent = desktopFileStorageState.busy
      ? t("settingsFileStorageBusy")
      : t("settingsFileStorageButton");
    dom.settingsFileStorageBtn.disabled =
      desktopFileStorageState.busy || !desktopFileStorageState.available;
  }
}

function renderGraphHardwareAccelerationSettings() {
  if (dom.settingsHardwareAccelerationLabel) {
    dom.settingsHardwareAccelerationLabel.textContent = t("settingsHardwareAccelerationLabel");
  }
  if (dom.settingsHardwareAccelerationHint) {
    const hint = graphState.browser.gpuUnsupported
      ? `${t("settingsHardwareAccelerationHint")} ${t("settingsHardwareAccelerationUnavailable")}`
      : t("settingsHardwareAccelerationHint");
    dom.settingsHardwareAccelerationHint.textContent = hint;
  }
  if (dom.settingsHardwareAccelerationToggle) {
    dom.settingsHardwareAccelerationToggle.checked = isGraphHardwareAccelerationEnabled();
  }
}

function setGraphHardwareAccelerationEnabled(enabled) {
  const nextEnabled = Boolean(enabled);
  if (appState.graphGpuAccelerationEnabled === nextEnabled) {
    renderGraphHardwareAccelerationSettings();
    return;
  }
  appState.graphGpuAccelerationEnabled = nextEnabled;
  if (!nextEnabled) {
    destroyBrowserGraphGpuRenderer(graphState.browser);
  } else {
    graphState.browser.gpuUnsupported = false;
  }
  renderGraphHardwareAccelerationSettings();
  saveUiState();
  if (appState.activeView === "graph") {
    renderBrowserGraph();
  }
  showActionFeedback(
    t(nextEnabled ? "hardwareAccelerationEnabled" : "hardwareAccelerationDisabled"),
  );
}

function applyDesktopFileStorageSettings(settings) {
  desktopFileStorageState.available = Boolean(settings?.available);
  desktopFileStorageState.currentDir = settings?.currentDir || "";
  desktopFileStorageState.defaultDir = settings?.defaultDir || "";
  desktopFileStorageState.initialized = true;
  renderDesktopFileStorageSettings();
}

async function initializeDesktopFileStorage() {
  if (!isDesktopShell()) {
    desktopFileStorageState.available = false;
    desktopFileStorageState.initialized = true;
    renderDesktopFileStorageSettings();
    return;
  }
  try {
    const settings = await invokeDesktopCommand("get_file_storage_settings");
    applyDesktopFileStorageSettings(settings);
  } catch {
    desktopFileStorageState.available = false;
    desktopFileStorageState.initialized = true;
    renderDesktopFileStorageSettings();
  }
}

async function migrateManagedResourcesToCurrentDirectory() {
  const managedResources = resources
    .filter(
      (resource) =>
        isCustomResource(resource) &&
        resource.storageMode === "managed" &&
        typeof resource.storedFilePath === "string" &&
        resource.storedFilePath.trim(),
    )
    .map((resource) => ({
      id: resource.id,
      storedFilePath: resource.storedFilePath,
      fileName: resource.fileName || resource.title,
    }));

  if (!managedResources.length) {
    showActionFeedback(
      t("fileStorageUpdatedNoFiles").replace(
        "{path}",
        desktopFileStorageState.currentDir || desktopFileStorageState.defaultDir,
      ),
    );
    return;
  }

  showActionFeedback(t("fileStorageMigrationStarted"));
  const result = await invokeDesktopCommand("migrate_managed_files", {
    resources: managedResources,
  });
  (result?.updatedResources || []).forEach((entry) => {
    const resource = getResourceById(entry.id);
    if (!resource) return;
    resource.storageMode = "managed";
    resource.storedFilePath = entry.storedFilePath;
    resource.fileUrl = entry.fileUrl || toLocalFileUrl(entry.storedFilePath);
  });
  saveCustomResources();
  renderAll();
  showActionFeedback(
    t("fileStorageMigrationSummary")
      .replace("{moved}", String(result?.movedCount ?? 0))
      .replace("{skipped}", String(result?.skippedCount ?? 0))
      .replace("{failed}", String(result?.failedCount ?? 0))
      .replace("{path}", desktopFileStorageState.currentDir || desktopFileStorageState.defaultDir),
  );
}

async function handleSelectDesktopFileStorageDirectory() {
  if (!desktopFileStorageState.available || desktopFileStorageState.busy) return;
  const previousDir = desktopFileStorageState.currentDir || desktopFileStorageState.defaultDir;
  desktopFileStorageState.busy = true;
  renderDesktopFileStorageSettings();
  try {
    const settings = await invokeDesktopCommand("pick_file_storage_directory");
    applyDesktopFileStorageSettings(settings);
    if (settings?.changed) {
      await migrateManagedResourcesToCurrentDirectory();
    } else if ((desktopFileStorageState.currentDir || desktopFileStorageState.defaultDir) !== previousDir) {
      showActionFeedback(
        t("fileStorageUpdated").replace(
          "{path}",
          desktopFileStorageState.currentDir || desktopFileStorageState.defaultDir,
        ),
      );
    }
  } catch {
    showActionFeedback(t("fileStorageMigrationFailed"));
  } finally {
    desktopFileStorageState.busy = false;
    renderDesktopFileStorageSettings();
  }
}

function setLanguage(nextLanguage) {
  if (nextLanguage !== "zh" && nextLanguage !== "en") return;
  if (appState.language === nextLanguage) {
    syncSettingsLanguageButtons();
    return;
  }
  appState.language = nextLanguage;
  applyLanguage();
  renderAll();
  saveUiState();
}

function loadCustomResources() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.customResources);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (resource) =>
          resource &&
          typeof resource.id === "string" &&
          typeof resource.title === "string" &&
          typeof resource.type === "string" &&
          Array.isArray(resource.tags) &&
          Array.isArray(resource.collections) &&
          Array.isArray(resource.related),
      )
      .map((resource) => normalizeStoredFileResource(resource));
  } catch {
    return [];
  }
}

function loadCustomCollections() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.customCollections);
    if (!raw) {
      return baseCollections.filter((collection) => collection.id !== "all");
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return baseCollections.filter((collection) => collection.id !== "all");
    const validCollections = parsed.filter(
      (collection) =>
        collection &&
        typeof collection.id === "string" &&
        typeof collection.name === "string" &&
        typeof collection.summary === "string",
    );
    if (validCollections.some((collection) => !isCustomCollection(collection))) {
      return validCollections;
    }
    return [...baseCollections.filter((collection) => collection.id !== "all"), ...validCollections];
  } catch {
    return baseCollections.filter((collection) => collection.id !== "all");
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

function loadResourceOverrides() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.resourceOverrides);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function loadResourceMeta() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.resourceMeta);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function loadSearchPrefs() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.searchPrefs);
    if (!raw) return { ...DEFAULT_SEARCH_PREFS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_SEARCH_PREFS };
    return {
      ...DEFAULT_SEARCH_PREFS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_SEARCH_PREFS };
  }
}

function loadRelationEdges() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.relationEdges);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (edge) =>
        edge &&
        typeof edge.id === "string" &&
        typeof edge.from === "string" &&
        typeof edge.to === "string" &&
        typeof edge.type === "string",
    );
  } catch {
    return [];
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
      graphGpuAccelerationEnabled: isGraphHardwareAccelerationEnabled(),
      workspaceSlots: appState.workspaceSlots,
      customWorkspaceSlots: appState.customWorkspaceSlots,
      searchValue: dom.searchInput?.value || "",
    };
    window.localStorage.setItem(STORAGE_KEYS.uiState, JSON.stringify(state));
  } catch {
    // Ignore demo storage failures.
  }
}

function saveResourceMeta() {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.resourceMeta,
      JSON.stringify(resourceMeta),
    );
  } catch {
    // Ignore storage failures in the demo environment.
  }
}

function saveSearchPrefs() {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.searchPrefs,
      JSON.stringify(searchPrefs),
    );
  } catch {
    // Ignore storage failures in the demo environment.
  }
}

function saveRelationEdges() {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.relationEdges,
      JSON.stringify(relationEdges),
    );
  } catch {
    // Ignore storage failures in the demo environment.
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

function saveCustomCollections() {
  try {
    const customCollections = collections.filter((collection) => collection.id !== "all");
    window.localStorage.setItem(
      STORAGE_KEYS.customCollections,
      JSON.stringify(customCollections),
    );
  } catch {
    // Ignore storage failures in the demo environment.
  }
}

function saveResourceOverrides() {
  try {
    const baseMap = new Map(baseResourceBlueprints.map((resource) => [resource.id, resource]));
    const overrides = {};

    resources.forEach((resource) => {
      if (isCustomResource(resource)) return;
      const base = baseMap.get(resource.id);
      if (!base) return;

      const currentCollections = [...resource.collections].sort();
      const baseCollectionsForResource = [...base.collections].sort();
      const currentRelated = [...resource.related].sort();
      const baseRelated = [...base.related].sort();
      const nextOverride = {};
      if (JSON.stringify(currentCollections) !== JSON.stringify(baseCollectionsForResource)) {
        nextOverride.collections = resource.collections;
      }
      if (JSON.stringify(currentRelated) !== JSON.stringify(baseRelated)) {
        nextOverride.related = resource.related;
      }
      if (Object.keys(nextOverride).length) {
        overrides[resource.id] = nextOverride;
      }
    });

    window.localStorage.setItem(STORAGE_KEYS.resourceOverrides, JSON.stringify(overrides));
  } catch {
    // Ignore storage failures in the demo environment.
  }
}

function applyResourceOverrides(resourceOverrides) {
  resources.forEach((resource) => {
    const override = resourceOverrides?.[resource.id];
    if (!override) return;
    if (Array.isArray(override.collections) && override.collections.length) {
      resource.collections = override.collections;
    }
    if (Array.isArray(override.related)) {
      resource.related = override.related;
    }
  });
}

function updateGhostCardPosition(clientX, clientY) {
  dom.fileGhostCard.style.left = `${clientX + 22}px`;
  dom.fileGhostCard.style.top = `${clientY + 18}px`;
}

function getUnsupportedImportMessage(unsupportedTypes = dragState.unsupportedImportTypes) {
  return unsupportedTypes.length
    ? t("unsupportedFileTypes").replace("{types}", unsupportedTypes.join(", "))
    : t("unsupportedFiles");
}

function syncDragImportState(snapshot) {
  dragState.supportedFileCount = snapshot?.supportedFileCount || 0;
  dragState.linkCount = snapshot?.linkCount || 0;
  dragState.unsupportedImportTypes = [...(snapshot?.unsupportedTypes || [])];
  dragState.hasUnsupportedItems = dragState.unsupportedImportTypes.length > 0;
  dragState.onlyUnsupportedItems = dragState.hasUnsupportedItems && !snapshot?.hasSupportedPayload;
}

function resetDragImportState() {
  dragState.active = false;
  dragState.depth = 0;
  dragState.hasUnsupportedItems = false;
  dragState.onlyUnsupportedItems = false;
  dragState.supportedFileCount = 0;
  dragState.linkCount = 0;
  dragState.unsupportedImportTypes = [];
}

function getDragPreviewMetaText() {
  if (dragState.onlyUnsupportedItems) return getUnsupportedImportMessage();
  if (dragState.hasUnsupportedItems) {
    return t("partialUnsupportedDropHint").replace("{types}", dragState.unsupportedImportTypes.join(", "));
  }
  if (dragState.linkCount && !dragState.supportedFileCount) return t("importLinksHint");
  return t("importDropReady");
}

function renderBrowserDropCopy() {
  const titleEl = dom.dropIndicator.querySelector("strong");
  const hintEl = dom.dropIndicator.querySelector("span");
  if (!titleEl || !hintEl) return;

  let title = t("importFilesTitle");
  let hint = t("importFilesHint");

  if (dragState.onlyUnsupportedItems) {
    title = t("unsupportedDropTitle");
    hint = getUnsupportedImportMessage();
  } else if (dragState.linkCount && !dragState.supportedFileCount) {
    title = t("importLinksTitle");
    hint = t("importLinksHint");
  } else if (dragState.hasUnsupportedItems) {
    hint = t("partialUnsupportedDropHint").replace("{types}", dragState.unsupportedImportTypes.join(", "));
  }

  titleEl.textContent = title;
  hintEl.textContent = hint;
  dom.dropIndicator.classList.toggle("is-invalid", dragState.onlyUnsupportedItems);
}

function showFileGhost(fileName, clientX, clientY, options = {}) {
  const typeLabel = options.typeLabel || fileName?.split(".").pop()?.toUpperCase() || "FILE";
  dom.fileGhostCard.querySelector(".file-ghost-card__type").textContent = typeLabel;
  dom.fileGhostCard.querySelector(".file-ghost-card__title").textContent = fileName || t("fileResourcePreview");
  dom.fileGhostCard.querySelector(".file-ghost-card__meta").textContent =
    options.metaText || getDragPreviewMetaText();
  dom.fileGhostCard.classList.toggle("is-invalid", Boolean(options.isInvalid ?? dragState.onlyUnsupportedItems));
  dom.fileGhostCard.classList.remove("is-hidden");
  updateGhostCardPosition(clientX, clientY);
}

function hideFileGhost() {
  dom.fileGhostCard.classList.add("is-hidden");
  dom.fileGhostCard.classList.remove("is-invalid");
}

function clearCollectionDropState() {
  document.querySelectorAll(".collection-item.is-drop-target").forEach((item) => {
    item.classList.remove("is-drop-target");
  });
}

function getDraggedResourceId(event) {
  return dragState.resourceId || event?.dataTransfer?.getData("text/plain") || "";
}

function cloneDragSourceSnapshot() {
  if (!dragState.sourceRect) return null;
  return {
    rect: { ...dragState.sourceRect },
    title: dragState.sourceTitle,
    type: dragState.sourceType,
  };
}

function clearDragResourceState() {
  if (dragState.resetTimer) {
    clearTimeout(dragState.resetTimer);
    dragState.resetTimer = 0;
  }
  dragState.resourceId = null;
  dragState.sourceRect = null;
  dragState.sourceTitle = "";
  dragState.sourceType = "";
}

function playCollectionAbsorb(sourceSnapshot, targetRect) {
  if (!sourceSnapshot?.rect || !targetRect) return;
  const sourceRect = sourceSnapshot.rect;

  const ghost = document.createElement("div");
  ghost.className = "collection-absorb-ghost";
  const ghostType = sourceSnapshot.type || "资源";
  const ghostTitle = sourceSnapshot.title || "资源卡";
  ghost.innerHTML = `
    <span class="collection-absorb-ghost__type">${dragState.sourceType || "资源"}</span>
    <strong class="collection-absorb-ghost__title">${dragState.sourceTitle || "资源卡"}</strong>
  `;

  const startLeft = sourceRect.left;
  const startTop = sourceRect.top;
  const startWidth = sourceRect.width;
  const startHeight = sourceRect.height;
  const endLeft = targetRect.left + targetRect.width * 0.16;
  const endTop = targetRect.top + targetRect.height * 0.2;

  ghost.style.left = `${startLeft}px`;
  ghost.style.top = `${startTop}px`;
  ghost.style.width = `${startWidth}px`;
  ghost.style.height = `${startHeight}px`;
  document.body.appendChild(ghost);

  requestAnimationFrame(() => {
    ghost.classList.add("is-animating");
    ghost.style.left = `${endLeft}px`;
    ghost.style.top = `${endTop}px`;
    ghost.style.width = `${Math.max(120, startWidth * 0.44)}px`;
    ghost.style.height = `${Math.max(72, startHeight * 0.4)}px`;
    ghost.style.opacity = "0";
    ghost.style.transform = "translate3d(0, 0, 0) scale(0.2) rotate(-8deg)";
  });

  window.setTimeout(() => {
    ghost.remove();
  }, 520);
}

function playCollectionAbsorbFeedback(sourceSnapshot, targetRect) {
  if (!sourceSnapshot?.rect || !targetRect) return;
  const sourceRect = sourceSnapshot.rect;
  const ghost = document.createElement("div");
  ghost.className = "collection-absorb-ghost";
  const ghostType = sourceSnapshot.type || "Resource";
  const ghostTitle = sourceSnapshot.title || "Resource Card";
  ghost.innerHTML = `
    <span class="collection-absorb-ghost__type">${ghostType}</span>
    <strong class="collection-absorb-ghost__title">${ghostTitle}</strong>
  `;

  const startLeft = sourceRect.left;
  const startTop = sourceRect.top;
  const startWidth = sourceRect.width;
  const startHeight = sourceRect.height;
  const endLeft = targetRect.left + targetRect.width * 0.14;
  const endTop = targetRect.top + targetRect.height * 0.18;
  const translateX = endLeft - startLeft;
  const translateY = endTop - startTop;
  const scaleX = Math.max(0.18, Math.min(0.44, targetRect.width / Math.max(startWidth, 1)));
  const scaleY = Math.max(0.18, Math.min(0.4, targetRect.height / Math.max(startHeight, 1)));

  ghost.style.left = `${startLeft}px`;
  ghost.style.top = `${startTop}px`;
  ghost.style.width = `${startWidth}px`;
  ghost.style.height = `${startHeight}px`;
  document.body.appendChild(ghost);

  const animation = ghost.animate(
    [
      {
        opacity: 0.96,
        transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
      },
      {
        opacity: 0.84,
        offset: 0.38,
        transform: `translate3d(${(translateX * 0.62).toFixed(2)}px, ${(translateY * 0.62).toFixed(2)}px, 0) scale(${(1 - (1 - scaleX) * 0.28).toFixed(3)}, ${(1 - (1 - scaleY) * 0.28).toFixed(3)}) rotate(-2deg)`,
      },
      {
        opacity: 0,
        transform: `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}) rotate(-7deg)`,
      },
    ],
    {
      duration: 460,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards",
    },
  );
  animation.addEventListener("finish", () => ghost.remove(), { once: true });
  animation.addEventListener("cancel", () => ghost.remove(), { once: true });
}

function animateCollectionPillRemoval(button) {
  const pill = button?.closest?.(".removable-collection-pill");
  if (!(pill instanceof HTMLElement) || pill.classList.contains("is-removing")) {
    return Promise.resolve();
  }
  pill.classList.add("is-removing");
  button.disabled = true;
  return new Promise((resolve) => {
    window.setTimeout(resolve, 180);
  });
}

function buildDetailCollectionPillsMarkup(resource) {
  if (!resource?.collections?.length) {
    return `<span class="muted">当前还没有归属任何合集。</span>`;
  }
  return resource.collections
    .map((collectionId) => {
      const collection = collections.find((item) => item.id === collectionId);
      if (!collection) return "";
      return `
        <span class="collection-pill removable-collection-pill">
          <span>${collection.name}</span>
          <button type="button" class="pill-remove-button" data-remove-collection="${collection.id}" aria-label="移出合集" title="移出合集">×</button>
        </span>
      `;
    })
    .join("");
}

function bindDetailCollectionRemovalButtons(resourceId) {
  if (!dom.detailPanel) return;
  const buttons = [...dom.detailPanel.querySelectorAll("[data-remove-collection]")];
  buttons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      await animateCollectionPillRemoval(button);
      removeResourceFromCollection(resourceId, button.dataset.removeCollection);
    });
  });
}

function patchDetailCollections(resourceId) {
  const selected = getSelectedResource();
  if (!selected || selected.id !== resourceId || !dom.detailPanel) return;
  const collectionList = dom.detailPanel.querySelector(".detail-collection-list");
  if (collectionList) {
    collectionList.innerHTML = buildDetailCollectionPillsMarkup(selected);
  }
  const detailCollectionSelect = dom.detailPanel.querySelector("#detailCollectionSelect");
  if (detailCollectionSelect) {
    detailCollectionSelect.innerHTML = buildCollectionOptionsMarkup(selected.collections[0]);
  }
  bindDetailCollectionRemovalButtons(resourceId);
}

function setBrowserDropState(active) {
  dragState.overBrowser = active;
  dom.cardsView.classList.toggle("is-file-dragging", active);
  dom.dropIndicator.classList.toggle("is-hidden", !active);
  renderBrowserDropCopy();
}

function renderGenericReaderHtml(resource) {
  const collectionsMarkup = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
    .filter(Boolean)
    .map((name) => `<span class="collection-pill">${name}</span>`)
    .join("");
  const tagsMarkup = resource.tags.map((tag) => `<span class="tag-pill">#${tag}</span>`).join("");
  const summary = resource.summary ? `<p>${escapeHtml(resource.summary)}</p>` : "";
  const detail = resource.detail
    ? resource.detail
        .split(/\n{2,}/)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
        .join("")
    : "";

  return `
    <section class="reader-section">
      <h3>${t("readerSummary")}</h3>
      ${summary || `<p>${t("readerNoSummary")}</p>`}
    </section>
    <section class="reader-section">
      <h3>${t("readerDescription")}</h3>
      ${detail || `<p>${t("readerNoDetail")}</p>`}
    </section>
    <section class="reader-section">
      <h3>${t("readerTags")}</h3>
      <div class="reader-pill-row">${tagsMarkup || `<span class="muted">${t("readerNoTags")}</span>`}</div>
    </section>
    <section class="reader-section">
      <h3>${t("readerCollections")}</h3>
      <div class="reader-pill-row">${collectionsMarkup || `<span class="muted">${t("readerNoCollections")}</span>`}</div>
    </section>
  `;
}

function renderImageReaderHtml(resource) {
  const preview = resource.previewUrl
    ? `<div class="reader-image-wrap"><img class="reader-image" src="${resource.previewUrl}" alt="${escapeHtml(resource.title)}" /></div>`
    : `<p>${t("graphPreviewEmpty")}</p>`;
  return `
    ${preview}
    ${renderGenericReaderHtml(resource)}
  `;
}

function renderLinkReaderHtml(resource) {
  const linkMarkup = resource.sourceUrl
    ? `<div class="reader-link-card"><a href="${resource.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(resource.sourceUrl)}</a></div>`
    : "";
  return `
    ${linkMarkup}
    ${renderGenericReaderHtml(resource)}
  `;
}

function renderDocumentFileReaderHtml(resource) {
  const fileMarkup = resource.fileUrl
    ? `
      <div class="reader-link-card">
        <a href="${resource.fileUrl}" target="_blank" rel="noreferrer">${t("openOriginalFile")}</a>
      </div>
    `
    : "";
  return `
    ${fileMarkup}
    ${renderGenericReaderHtml(resource)}
  `;
}

function openResourceReader(resource = getSelectedResource()) {
  if (!resource) return;
  touchResourceMeta(resource.id, "lastViewedAt");

  const selectionChanged = appState.selectedResourceId !== resource.id;
  appState.selectedResourceId = resource.id;
  if (selectionChanged) {
    syncCardSelectionState();
    if (appState.activeView === "graph") {
      renderBrowserGraph();
    }
    renderDetail();
    renderGraphSmooth();
    renderMetrics();
  }

  const collectionNames = resource.collections
    .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
    .filter(Boolean);
  const metaParts = isDocumentResource(resource)
    ? [resource.fileName || resource.title, getSourceTypeLabel(resource), ...collectionNames]
    : isLinkResource(resource)
      ? [resource.title, t("linkSource"), ...collectionNames]
    : [t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type, ...collectionNames];

  dom.readerEyebrow.textContent = t("readerEyebrow");
  dom.readerTitle.textContent = resource.title;
  dom.readerMeta.textContent = metaParts.filter(Boolean).join(" · ");
  dom.readerContent.innerHTML =
    resource.sourceType === "markdown-file"
      ? renderMarkdownToHtml(resource.rawContent || resource.detail || "")
      : resource.sourceType === "txt-file"
        ? renderMarkdownToHtml(`\`\`\`text\n${resource.rawContent || resource.detail || ""}\n\`\`\``)
        : resource.sourceType === "pdf-file" || resource.sourceType === "docx-file"
          ? renderDocumentFileReaderHtml(resource)
        : isImageResource(resource)
          ? renderImageReaderHtml(resource)
          : isLinkResource(resource)
            ? renderLinkReaderHtml(resource)
          : renderGenericReaderHtml(resource);
  dom.readerOverlay.classList.remove("is-hidden");
  saveUiState();
}

function closeReader() {
  dom.readerOverlay.classList.add("is-hidden");
}

function buildImportDuplicateSignature(sourceType, fileName, fileSize) {
  return [sourceType || "", String(fileName || "").toLowerCase(), String(fileSize || 0)].join("::");
}

function buildImportFingerprint(sourceType, fileName, fileSize, fileLastModified = 0) {
  return [
    sourceType || "",
    String(fileName || "").toLowerCase(),
    String(fileSize || 0),
    String(fileLastModified || 0),
  ].join("::");
}

function getExistingImportedFileKeys() {
  const exactFingerprints = new Set();
  const legacySignatures = new Set();
  resources.forEach((resource) => {
    if (!resource?.fileName || !resource?.sourceType) return;
    legacySignatures.add(
      buildImportDuplicateSignature(resource.sourceType, resource.fileName, resource.fileSize),
    );
    exactFingerprints.add(
      buildImportFingerprint(
        resource.sourceType,
        resource.fileName,
        resource.fileSize,
        resource.fileLastModified || 0,
      ),
    );
  });
  return { exactFingerprints, legacySignatures };
}

function getImportDuplicateMessage(duplicateCount) {
  if (duplicateCount <= 0) return "";
  return appState.language === "en"
    ? duplicateCount === 1
      ? "File already exists."
      : `Skipped ${duplicateCount} file(s) that already exist.`
    : duplicateCount === 1
      ? "文件已存在"
      : `已跳过 ${duplicateCount} 个已存在文件。`;
}

async function importFiles(fileList) {
  const unsupportedTypes = getUnsupportedImportTypes(fileList);
  const files = [...fileList].filter((file) => file && inferImportType(file));
  if (!files.length) {
    showActionFeedback(
      unsupportedTypes.length
        ? t("unsupportedFileTypes").replace("{types}", unsupportedTypes.join(", "))
        : t("unsupportedFiles"),
    );
    return;
  }

  const anchorId = appState.selectedResourceId;
  showActionFeedback(
    appState.language === "en"
      ? `Importing ${files.length} file resource(s)...`
      : `正在导入 ${files.length} 个文件资源...`,
  );
  let importedCount = 0;
  let parseSuccessCount = 0;
  let parseSkippedCount = 0;
  let parseFailedCount = 0;
  let storageFallbackCount = 0;
  let duplicateCount = 0;
  const existingFileKeys = getExistingImportedFileKeys();

  for (const [index, file] of files.entries()) {
    const sourceType = inferImportType(file);
    const duplicateSignature = buildImportDuplicateSignature(sourceType, file.name, file.size);
    const duplicateFingerprint = buildImportFingerprint(
      sourceType,
      file.name,
      file.size,
      file.lastModified || 0,
    );
    if (
      existingFileKeys.exactFingerprints.has(duplicateFingerprint) ||
      existingFileKeys.legacySignatures.has(duplicateSignature)
    ) {
      duplicateCount += 1;
      continue;
    }
    const id = `res-custom-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
    const title = file.name.replace(/\.[^.]+$/i, "");
    const collectionsForResource = [
      appState.activeCollection !== "all" ? appState.activeCollection : "collection-knowledge",
    ];

    const baseResource = {
      id,
      title,
      type: sourceType === "image-file" ? "profile" : "knowledge",
      summary: "",
      tags: [appState.language === "en" ? "document" : "文档"],
      collections: collectionsForResource,
      related: [anchorId].filter(Boolean),
      detail: "",
      fileName: file.name,
      sourceType,
      preferredSlot: "context",
      rawContent: null,
      mimeType: file.type || "",
      fileSize: file.size,
      fileLastModified: file.lastModified || 0,
      previewUrl: null,
      fileUrl: URL.createObjectURL(file),
      storedFilePath: null,
      storageMode: "temporary",
    };

    if (desktopFileStorageState.available) {
      try {
        const storedFile = await persistImportedFileToDesktop(file);
        if (storedFile?.storedFilePath) {
          baseResource.storedFilePath = storedFile.storedFilePath;
          baseResource.fileUrl = storedFile.fileUrl || toLocalFileUrl(storedFile.storedFilePath);
          baseResource.storageMode = "managed";
        }
      } catch {
        storageFallbackCount += 1;
      }
    }

    if (sourceType === "markdown-file") {
      const text = await file.text();
      baseResource.title = title;
      baseResource.summary = extractMarkdownSummary(text);
      baseResource.detail = baseResource.summary;
      baseResource.rawContent = text;
      baseResource.tags.push("Markdown");
    } else if (sourceType === "txt-file") {
      const text = await file.text();
      baseResource.summary = extractTextSummary(text);
      baseResource.detail = `${t("textSource")} · ${formatFileSize(file.size)}`;
      baseResource.rawContent = text;
      baseResource.tags.push("TXT");
    } else if (sourceType === "pdf-file") {
      let text = "";
      let parseState = "skipped";
      if (searchPrefs.importParseMode === "skip") {
        parseSkippedCount += 1;
      } else {
        try {
          text = await extractPdfText(file);
          parseState = text ? "success" : "failed";
        } catch {
          parseState = "failed";
        }
        if (parseState === "success") parseSuccessCount += 1;
        else parseFailedCount += 1;
      }
      baseResource.summary = text
        ? extractTextSummary(text)
        : appState.language === "en"
          ? searchPrefs.importParseMode === "skip"
            ? "Imported as a PDF resource card. You can open the original PDF directly."
            : "Imported as a PDF resource card. Text extraction did not succeed, but the original file is available."
          : searchPrefs.importParseMode === "skip"
            ? "已作为 PDF 资源卡导入，可直接打开原始 PDF 文件。"
            : "已作为 PDF 资源卡导入，文本提取未成功，但可以直接打开原始文件。";
      baseResource.detail =
        searchPrefs.importParseMode === "skip"
          ? `${t("pdfSource")} · ${formatFileSize(file.size)} · ${t("importParseSkip")}`
          : text
            ? `${t("pdfSource")} · ${formatFileSize(file.size)}`
            : `${t("pdfSource")} · ${formatFileSize(file.size)} · ${appState.language === "en" ? "No text layer or parse failed" : "无文本层或解析失败"}`;
      baseResource.rawContent = text || null;
      baseResource.tags.push("PDF");
    } else if (sourceType === "docx-file") {
      let text = "";
      let parseState = "skipped";
      if (searchPrefs.importParseMode === "skip") {
        parseSkippedCount += 1;
      } else {
        try {
          text = await extractDocxText(file);
          parseState = text ? "success" : "failed";
        } catch {
          parseState = "failed";
        }
        if (parseState === "success") parseSuccessCount += 1;
        else parseFailedCount += 1;
      }
      baseResource.summary = text
        ? extractTextSummary(text)
        : appState.language === "en"
          ? searchPrefs.importParseMode === "skip"
            ? "Imported as a DOCX resource card. You can open the original document directly."
            : "Imported as a DOCX resource card. Text extraction did not succeed, but the original file is available."
          : searchPrefs.importParseMode === "skip"
            ? "已作为 DOCX 资源卡导入，可直接打开原始文档。"
            : "已作为 DOCX 资源卡导入，文本提取未成功，但可以直接打开原始文件。";
      baseResource.detail =
        searchPrefs.importParseMode === "skip"
          ? `${t("docxSource")} · ${formatFileSize(file.size)} · ${t("importParseSkip")}`
          : text
            ? `${t("docxSource")} · ${formatFileSize(file.size)}`
            : `${t("docxSource")} · ${formatFileSize(file.size)} · ${appState.language === "en" ? "Parse failed" : "解析失败"}`;
      baseResource.rawContent = text || null;
      baseResource.tags.push("DOCX");
    } else if (sourceType === "image-file") {
      const previewUrl = await readFileAsDataUrl(file);
      baseResource.summary =
        appState.language === "en"
          ? "Imported as an image resource card."
          : "已作为图片资源卡导入。";
      baseResource.detail = `${t("imageSource")} · ${formatFileSize(file.size)}`;
      baseResource.previewUrl = previewUrl;
      baseResource.tags.push("Image");
    }

    resources.unshift(baseResource);
    touchResourceMeta(id, "lastEditedAt");
    touchResourceMeta(id, "lastUsedAt");
    touchResourceMeta(id, "lastViewedAt");

    if (anchorId) {
      const anchor = getResourceById(anchorId);
      if (anchor && !anchor.related.includes(id)) {
        anchor.related = [id, ...anchor.related];
      }
    }

    appState.selectedResourceId = id;
    importedCount += 1;
    existingFileKeys.legacySignatures.add(duplicateSignature);
    existingFileKeys.exactFingerprints.add(duplicateFingerprint);
  }

  if (!importedCount) {
    const duplicateMessage = getImportDuplicateMessage(duplicateCount);
    showActionFeedback(duplicateMessage || t("unsupportedFiles"));
    return;
  }

  saveCustomResources();
  renderAll();
  const parseSummary =
    parseSuccessCount || parseSkippedCount || parseFailedCount
      ? ` ${t("importParseSummary")
          .replace("{success}", String(parseSuccessCount))
          .replace("{skipped}", String(parseSkippedCount))
          .replace("{failed}", String(parseFailedCount))}`
      : "";
  const unsupportedSummary = unsupportedTypes.length
    ? ` ${t("unsupportedFileTypes").replace("{types}", unsupportedTypes.join(", "))}`
    : "";
  const storageSummary = storageFallbackCount ? ` ${t("fileStorageStoreFailed")}` : "";
  const duplicateSummary = duplicateCount ? ` ${getImportDuplicateMessage(duplicateCount)}` : "";
  showActionFeedback(
    `${t("importSuccess").replace("{count}", String(importedCount))}${duplicateSummary}${parseSummary}${unsupportedSummary}${storageSummary}`,
  );
}

function getAllTags() {
  return [...new Set(resources.flatMap((resource) => resource.tags))];
}

function triggerStageAnimation(element) {
  if (!element) return;
  if (element.__stageEnterFrame) {
    cancelAnimationFrame(element.__stageEnterFrame);
  }
  if (element.__stageEnterTimer) {
    clearTimeout(element.__stageEnterTimer);
  }
  element.classList.remove("is-entering");
  element.__stageEnterFrame = requestAnimationFrame(() => {
    element.classList.add("is-entering");
    element.__stageEnterFrame = null;
    element.__stageEnterTimer = window.setTimeout(() => {
      element.classList.remove("is-entering");
      element.__stageEnterTimer = null;
    }, 280);
  });
}

function getLineKey(a, b) {
  return [a, b].sort().join("__");
}

function ensureGraphSvg(container, cache) {
  if (!cache.svg || !cache.svg.isConnected) {
    cache.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cache.svg.setAttribute("viewBox", "0 0 100 100");
    cache.svg.setAttribute("preserveAspectRatio", "none");
    container.appendChild(cache.svg);
  }
  return cache.svg;
}

function getGraphArcControlPoint(from, to, center, curvature = 0.16) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.max(Math.hypot(dx, dy), 0.001);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const awayX = midX - center.x;
  const awayY = midY - center.y;
  const awayLength = Math.hypot(awayX, awayY);

  if (awayLength > 0.6) {
    return {
      x: midX + (awayX / awayLength) * distance * curvature,
      y: midY + (awayY / awayLength) * distance * curvature,
    };
  }

  const perpX = -dy / distance;
  const perpY = dx / distance;
  const side = to.x >= center.x ? 1 : -1;
  return {
    x: midX + perpX * distance * curvature * side,
    y: midY + perpY * distance * curvature * side,
  };
}

function buildGraphArcPath(from, to, center, curvature = 0.16) {
  const control = getGraphArcControlPoint(from, to, center, curvature);
  return `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`;
}

function updateGraphConnectionPath(path, from, to, relationType, center, isPrimary = false, isWorkspace = false) {
  const style = getGraphLineStyle(relationType, isPrimary, isWorkspace);
  const curvature = isWorkspace ? 0.24 : isPrimary ? 0.18 : 0.14;
  path.className.baseVal = `graph-line type-${relationType || "related"} ${isPrimary ? "is-primary-link" : ""}`.trim();
  path.setAttribute("d", buildGraphArcPath(from, to, center, curvature));
  path.setAttribute("stroke", style.stroke);
  path.setAttribute("stroke-width", style.strokeWidth);
  path.setAttribute("fill", "none");
  path.style.setProperty("--graph-line-glow", style.glow || style.stroke);
  if (style.strokeDasharray) {
    path.setAttribute("stroke-dasharray", style.strokeDasharray);
  } else {
    path.removeAttribute("stroke-dasharray");
  }
}

function destroyBrowserGraphGpuRenderer(cache) {
  if (cache.gl) {
    if (cache.glBuffer) cache.gl.deleteBuffer(cache.glBuffer);
    if (cache.glProgram) cache.gl.deleteProgram(cache.glProgram);
  }
  cache.gl = null;
  cache.glProgram = null;
  cache.glBuffer = null;
  cache.gpuEnabled = false;
  cache.gpuInitialized = false;
  cache.gpuPointCapacity = 0;
  cache.gpuColorCache.clear();
  cache.glPointData.length = 0;
  if (cache.glowCanvas?.isConnected) {
    cache.glowCanvas.remove();
  }
  cache.glowCanvas = null;
}

function createBrowserGraphGpuProgram(gl) {
  const vertexSource = `
    attribute vec2 a_position;
    attribute float a_size;
    attribute vec4 a_color;
    uniform vec2 u_resolution;
    varying vec4 v_color;

    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 clip = zeroToOne * 2.0 - 1.0;
      gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
      gl_PointSize = a_size;
      v_color = a_color;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
      vec2 point = gl_PointCoord - vec2(0.5);
      float distance = length(point);
      if (distance > 0.5) {
        discard;
      }
      float alpha = smoothstep(0.5, 0.0, distance);
      gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || "Shader compile failed");
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Program link failed");
  }

  program.aPosition = gl.getAttribLocation(program, "a_position");
  program.aSize = gl.getAttribLocation(program, "a_size");
  program.aColor = gl.getAttribLocation(program, "a_color");
  program.uResolution = gl.getUniformLocation(program, "u_resolution");
  return program;
}

function initializeBrowserGraphGpuRenderer(cache) {
  if (!cache.glowCanvas) return false;
  try {
    const gl =
      cache.glowCanvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      }) || cache.glowCanvas.getContext("experimental-webgl");
    if (!gl) {
      cache.gpuUnsupported = true;
      destroyBrowserGraphGpuRenderer(cache);
      renderGraphHardwareAccelerationSettings();
      return false;
    }
    const program = createBrowserGraphGpuProgram(gl);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    cache.gl = gl;
    cache.glProgram = program;
    cache.glBuffer = buffer;
    cache.gpuEnabled = true;
    cache.gpuInitialized = true;
    renderGraphHardwareAccelerationSettings();
    return true;
  } catch (error) {
    console.warn("Browser graph WebGL fallback:", error);
    cache.gpuUnsupported = true;
    destroyBrowserGraphGpuRenderer(cache);
    renderGraphHardwareAccelerationSettings();
    return false;
  }
}

function ensureBrowserGraphGlowCanvas(container, cache) {
  if (!cache.gpuPreference) return null;
  if (cache.gpuUnsupported) return null;
  if (!cache.glowCanvas || !cache.glowCanvas.isConnected) {
    const canvas = document.createElement("canvas");
    canvas.className = "browser-graph__glow-canvas";
    canvas.setAttribute("aria-hidden", "true");
    container.prepend(canvas);
    cache.glowCanvas = canvas;
    cache.gpuInitialized = false;
  }
  if (!cache.gpuInitialized) {
    initializeBrowserGraphGpuRenderer(cache);
  }
  return cache.glowCanvas;
}

function resizeBrowserGraphSurfaceCanvas(canvas, width, height, pixelRatio) {
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function parseBrowserGraphGpuColor(cache, color) {
  if (!color) return [1, 1, 1, 1];
  const cached = cache.gpuColorCache.get(color);
  if (cached) return cached;
  const match = color.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    const fallback = [1, 1, 1, 1];
    cache.gpuColorCache.set(color, fallback);
    return fallback;
  }
  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  const parsed = [
    (parts[0] || 255) / 255,
    (parts[1] || 255) / 255,
    (parts[2] || 255) / 255,
    parts.length > 3 ? Math.max(0, Math.min(1, parts[3])) : 1,
  ];
  cache.gpuColorCache.set(color, parsed);
  return parsed;
}

function clearBrowserGraphGpuFrame(cache) {
  cache.glPointData.length = 0;
  if (!cache.gpuEnabled || !cache.gl || !cache.glowCanvas) return;
  const gl = cache.gl;
  gl.viewport(0, 0, cache.glowCanvas.width || 1, cache.glowCanvas.height || 1);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function queueBrowserGraphGpuPoint(cache, x, y, size, color, alpha = 1) {
  if (!cache.gpuEnabled) return false;
  const rgba = parseBrowserGraphGpuColor(cache, color);
  cache.glPointData.push(
    x,
    y,
    size,
    rgba[0],
    rgba[1],
    rgba[2],
    Math.max(0, Math.min(1, rgba[3] * alpha)),
  );
  return true;
}

function flushBrowserGraphGpuPoints(cache) {
  if (!cache.gpuEnabled || !cache.gl || !cache.glProgram || !cache.glBuffer) return;
  const gl = cache.gl;
  const program = cache.glProgram;
  const pointCount = Math.floor(cache.glPointData.length / 7);
  if (!pointCount) return;
  const data = new Float32Array(cache.glPointData);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, cache.glBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
  gl.enableVertexAttribArray(program.aPosition);
  gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(program.aSize);
  gl.vertexAttribPointer(program.aSize, 1, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(program.aColor);
  gl.vertexAttribPointer(program.aColor, 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.uniform2f(program.uResolution, cache.canvasWidth || 1, cache.canvasHeight || 1);
  gl.drawArrays(gl.POINTS, 0, pointCount);
}

function ensureBrowserGraphCanvas(container, cache) {
  if (cache.svg?.isConnected) {
    cache.svg.remove();
  }
  container.querySelectorAll("svg").forEach((element) => element.remove());
  cache.svg = null;

  ensureBrowserGraphGlowCanvas(container, cache);
  if (!cache.canvas || !cache.canvas.isConnected) {
    const canvas = document.createElement("canvas");
    canvas.className = "browser-graph__canvas";
    canvas.setAttribute("aria-hidden", "true");
    container.prepend(canvas);
    cache.canvas = canvas;
    cache.ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    cache.lastFrameTime = 0;
  }

  resizeBrowserGraphCanvas(container, cache);
  if (!cache.stars.length) {
    seedBrowserGraphStars(cache, cache.canvasWidth || 1, cache.canvasHeight || 1);
  }
  return cache.canvas;
}

function resizeBrowserGraphCanvas(container, cache) {
  if (!cache.canvas || !cache.ctx) return;
  const rect = container.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
  if (
    cache.canvasWidth === width &&
    cache.canvasHeight === height &&
    cache.pixelRatio === pixelRatio
  ) {
    return;
  }

  cache.canvasWidth = width;
  cache.canvasHeight = height;
  cache.pixelRatio = pixelRatio;
  if (cache.glowCanvas) {
    resizeBrowserGraphSurfaceCanvas(cache.glowCanvas, width, height, pixelRatio);
  }
  resizeBrowserGraphSurfaceCanvas(cache.canvas, width, height, pixelRatio);
  cache.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  seedBrowserGraphStars(cache, width, height);
}

function seedBrowserGraphStars(cache, width, height) {
  const starCount = Math.max(24, Math.min(96, Math.round((width * height) / 18000)));
  cache.stars = Array.from({ length: starCount }, () => {
    const tint = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.55 + Math.random() * 1.2,
      alpha: 0.08 + Math.random() * 0.22,
      speed: 0.3 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      color:
        tint > 0.76
          ? "rgba(178, 214, 255, 0.9)"
          : tint < 0.16
            ? "rgba(255, 233, 197, 0.88)"
            : "rgba(244, 248, 255, 0.92)",
    };
  });
}

function getQuadraticPoint(from, control, to, t) {
  const inverse = 1 - t;
  return {
    x: inverse * inverse * from.x + 2 * inverse * t * control.x + t * t * to.x,
    y: inverse * inverse * from.y + 2 * inverse * t * control.y + t * t * to.y,
  };
}

function toBrowserCanvasPoint(point, cache) {
  return {
    x: (point.x / 100) * (cache.canvasWidth || 1),
    y: (point.y / 100) * (cache.canvasHeight || 1),
  };
}

function refreshBrowserGraphAnchors(cache) {
  const anchorPoints = new Map();
  const containerRect = dom.resourceMap?.getBoundingClientRect?.() || null;
  cache.projectedPositions.forEach((projected, id) => {
    const node = cache.nodes.get(id);
    const orb = node?.querySelector?.(".browser-graph-node__orb");
    if (containerRect && orb instanceof HTMLElement) {
      const orbRect = orb.getBoundingClientRect();
      anchorPoints.set(id, {
        x: orbRect.left - containerRect.left + orbRect.width / 2,
        y: orbRect.top - containerRect.top + orbRect.height / 2,
      });
      return;
    }
    anchorPoints.set(id, toBrowserCanvasPoint(projected, cache));
  });
  cache.anchorPoints = anchorPoints;
}

function buildBrowserGraphOrderedLines(cache) {
  return [...cache.lines.values()].sort((a, b) => {
    if ((a.hierarchyLevel ?? 0) !== (b.hierarchyLevel ?? 0)) {
      return (a.hierarchyLevel ?? 0) - (b.hierarchyLevel ?? 0);
    }
    if (Boolean(a.isPrimary) !== Boolean(b.isPrimary)) {
      return Number(b.isPrimary) - Number(a.isPrimary);
    }
    return String(a.key || "").localeCompare(String(b.key || ""));
  });
}

function syncBrowserGraphLine(
  cache,
  lineKey,
  fromId,
  toId,
  from,
  to,
  relationType,
  center,
  isPrimary = false,
  isWorkspace = false,
  hierarchyLevel = 0,
  styleOverride = null,
) {
  const style = styleOverride || getGraphLineStyle(relationType, isPrimary, isWorkspace);
  const curvature = isWorkspace ? 0.22 : isPrimary ? 0.17 : 0.13;
  const control = getGraphArcControlPoint(from, to, center, curvature);
  const fromDistance = Math.hypot(from.x - center.x, from.y - center.y);
  const toDistance = Math.hypot(to.x - center.x, to.y - center.y);
  const outwardDirection = fromDistance <= toDistance ? 1 : -1;
  const particleCount = hierarchyLevel >= 2 ? 1 : isPrimary ? 3 : 2;
  const baseDuration = Number(style.particleDuration || "12");
  const phaseSeed = (hashString(lineKey) % 1000) / 1000;
  let line = cache.lines.get(lineKey);

  if (!line) {
    line = { key: lineKey, particles: [] };
    cache.lines.set(lineKey, line);
  }

  while (line.particles.length < particleCount) {
    const index = line.particles.length;
    line.particles.push({
      offset: (phaseSeed + index / Math.max(particleCount, 1)) % 1,
      speed: 1 / (baseDuration * 2.85 * (1 + index * 0.15)),
      radius: Math.max(0.48, (isPrimary ? 0.96 : 0.68) - index * 0.1),
      alpha: Math.max(0.18, (isPrimary ? 0.72 : 0.44) - index * 0.08),
    });
  }
  if (line.particles.length > particleCount) {
    line.particles.length = particleCount;
  }

  Object.assign(line, {
    fromId,
    toId,
    from,
    to,
    control,
    relationType,
    style,
    isPrimary,
    isWorkspace,
    hierarchyLevel,
    outwardDirection,
    focused: Boolean(cache.hoveredId) && (fromId === cache.hoveredId || toId === cache.hoveredId),
    dim: Boolean(cache.hoveredId) && !(fromId === cache.hoveredId || toId === cache.hoveredId),
  });
}

function drawBrowserGraphBackdrop(cache, timestamp) {
  const ctx = cache.ctx;
  if (!ctx) return;
  const width = cache.canvasWidth || 1;
  const height = cache.canvasHeight || 1;

  const centerGlow = ctx.createRadialGradient(
    width * 0.52,
    height * 0.5,
    0,
    width * 0.52,
    height * 0.5,
    Math.min(width, height) * 0.34,
  );
  centerGlow.addColorStop(0, "rgba(149, 186, 255, 0.11)");
  centerGlow.addColorStop(0.5, "rgba(149, 186, 255, 0.035)");
  centerGlow.addColorStop(1, "rgba(149, 186, 255, 0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  drawBrowserGraphSphereGuides(cache, timestamp);

  const useGpu = cache.gpuEnabled;
  cache.stars.forEach((star) => {
    const twinkle = 0.42 + 0.58 * (0.5 + Math.sin(timestamp * 0.001 * star.speed + star.phase) * 0.5);
    if (useGpu) {
      queueBrowserGraphGpuPoint(cache, star.x, star.y, Math.max(2, star.radius * 4.6), star.color, star.alpha * twinkle);
      return;
    }
    ctx.globalAlpha = star.alpha * twinkle;
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  const phase = cache.spherePhase || timestamp * 0.00016;
  const particles = cache.backgroundParticles
    .map((particle) => ({
      particle,
      projected: projectBrowserGraphSpherePoint(particle, phase, timestamp),
    }))
    .sort((left, right) => left.projected.depth - right.projected.depth);

  cache.backgroundProjectedParticles = [];

  particles.forEach(({ particle, projected }) => {
    const x = (projected.x / 100) * width;
    const y = (projected.y / 100) * height;
    const hiddenStrength = Math.max(0.08, 0.62 - projected.depth);
    const radius = particle.radius * (0.86 + hiddenStrength * 0.9);
    cache.backgroundProjectedParticles.push({
      id: particle.id,
      x,
      y,
      depth: projected.depth,
      radius: Math.max(8, radius * 8.5),
    });

    if (useGpu) {
      queueBrowserGraphGpuPoint(
        cache,
        x,
        y,
        particle.trailRadius * (2.2 + hiddenStrength * 1.8),
        particle.glow,
        particle.alpha * hiddenStrength * 0.26,
      );
      queueBrowserGraphGpuPoint(
        cache,
        x,
        y,
        Math.max(2.4, radius * 3.6),
        "rgba(236, 242, 250, 0.96)",
        particle.alpha * hiddenStrength * 0.82,
      );
      queueBrowserGraphGpuPoint(
        cache,
        x,
        y,
        particle.glowRadius * (2 + hiddenStrength * 1.4),
        particle.glow,
        particle.alpha * hiddenStrength * 0.18,
      );
      return;
    }

    ctx.globalAlpha = particle.alpha * hiddenStrength * 0.54;
    ctx.fillStyle = particle.glow;
    ctx.beginPath();
    ctx.arc(x, y, particle.trailRadius * (0.72 + hiddenStrength), 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = particle.alpha * hiddenStrength * 0.8;
    ctx.fillStyle = "rgba(236, 242, 250, 0.96)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = particle.alpha * hiddenStrength * 0.32;
    ctx.fillStyle = particle.glow;
    ctx.beginPath();
    ctx.arc(x, y, particle.glowRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawBrowserGraphFrame(timestamp) {
  const cache = graphState.browser;
  if (!cache.canvas || !cache.ctx || !cache.canvas.isConnected || appState.activeView !== "graph") {
    stopBrowserGraphAnimation(cache);
    return;
  }
  cache.lastFrameTime = timestamp;

  resizeBrowserGraphCanvas(dom.resourceMap, cache);
  clearBrowserGraphGpuFrame(cache);
  const ctx = cache.ctx;
  const width = cache.canvasWidth || 1;
  const height = cache.canvasHeight || 1;
  ctx.clearRect(0, 0, width, height);
  applyBrowserGraphNodeProjection(cache, timestamp);
  drawBrowserGraphBackdrop(cache, timestamp);

  const lines = cache.orderedLines?.length ? cache.orderedLines : buildBrowserGraphOrderedLines(cache);
  refreshBrowserGraphAnchors(cache);

  lines.forEach((line) => {
    const fromProjection = cache.projectedPositions.get(line.fromId) || line.from;
    const toProjection = cache.projectedPositions.get(line.toId) || line.to;
    const from = cache.anchorPoints.get(line.fromId) || toBrowserCanvasPoint(fromProjection, cache);
    const to = cache.anchorPoints.get(line.toId) || toBrowserCanvasPoint(toProjection, cache);
    const averageDepth = ((fromProjection?.depth ?? 0.5) + (toProjection?.depth ?? 0.5)) / 2;
    const control = getGraphArcControlPoint(
      from,
      to,
      { x: width * (BROWSER_GRAPH_SPHERE.centerX / 100), y: height * (BROWSER_GRAPH_SPHERE.centerY / 100) },
      (line.isPrimary ? 0.17 : 0.12) * (0.82 + averageDepth * 0.42),
    );
    const emphasis = !cache.hoveredId ? 1 : line.focused ? 1 : 0.14;
    const hierarchyEmphasis =
      line.hierarchyLevel <= 0 ? 1 : line.hierarchyLevel === 1 ? 0.74 : 0.42;
    const depthEmphasis = 0.42 + averageDepth * 0.92;
    const lineAlpha = (line.isPrimary ? 0.68 : 0.42) * hierarchyEmphasis * emphasis * depthEmphasis;
    const mistAlpha = (line.isPrimary ? 0.16 : 0.09) * hierarchyEmphasis * emphasis * depthEmphasis;
    const lineWidth = Math.max(
      0.24,
      (Number(line.style.strokeWidth) || 0.36) *
        1.24 *
        (0.78 + averageDepth * 0.58) *
        (line.hierarchyLevel >= 2 ? 0.82 : line.hierarchyLevel === 1 ? 0.92 : 1),
    );

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(control.x, control.y, to.x, to.y);
    ctx.strokeStyle = line.style.glow || "rgba(240, 245, 252, 0.88)";
    ctx.globalAlpha = mistAlpha;
    ctx.lineWidth = lineWidth * (line.isPrimary ? 3.4 : 2.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(control.x, control.y, to.x, to.y);
    ctx.strokeStyle = line.style.stroke || "rgba(231, 238, 246, 0.94)";
    ctx.globalAlpha = lineAlpha;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  });

  lines.forEach((line) => {
    const fromProjection = cache.projectedPositions.get(line.fromId) || line.from;
    const toProjection = cache.projectedPositions.get(line.toId) || line.to;
    const from = cache.anchorPoints.get(line.fromId) || toBrowserCanvasPoint(fromProjection, cache);
    const to = cache.anchorPoints.get(line.toId) || toBrowserCanvasPoint(toProjection, cache);
    const averageDepth = ((fromProjection?.depth ?? 0.5) + (toProjection?.depth ?? 0.5)) / 2;
    const control = getGraphArcControlPoint(
      from,
      to,
      { x: width * (BROWSER_GRAPH_SPHERE.centerX / 100), y: height * (BROWSER_GRAPH_SPHERE.centerY / 100) },
      (line.isPrimary ? 0.17 : 0.12) * (0.82 + averageDepth * 0.42),
    );
    const emphasis = !cache.hoveredId ? 1 : line.focused ? 1 : 0.14;
    const hierarchyEmphasis =
      line.hierarchyLevel <= 0 ? 1 : line.hierarchyLevel === 1 ? 0.66 : 0.3;
    const particleAlpha = (line.isPrimary ? 0.96 : 0.72) * hierarchyEmphasis * emphasis * (0.42 + averageDepth * 0.9);

    ctx.save();
    line.particles.forEach((particle, index) => {
      let progress = (((timestamp / 1000) * particle.speed) + particle.offset) % 1;
      if (line.outwardDirection < 0) {
        progress = 1 - progress;
      }
      const point = getQuadraticPoint(from, control, to, progress);
      const radius =
        particle.radius *
        (line.isPrimary ? 0.94 : 0.82) *
        (0.72 + averageDepth * 0.44) *
        (line.hierarchyLevel >= 2 ? 0.72 : line.hierarchyLevel === 1 ? 0.84 : 1);

      ctx.globalAlpha = particleAlpha * particle.alpha;
      ctx.fillStyle = line.style.particleStroke || "rgba(188, 220, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = particleAlpha * particle.alpha * 0.52;
      ctx.fillStyle = "rgba(250, 252, 255, 0.92)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, Math.max(0.32, radius * 0.42), 0, Math.PI * 2);
      ctx.fill();

      if (index === 0 && line.isPrimary) {
        ctx.globalAlpha = particleAlpha * 0.12;
        ctx.fillStyle = line.style.glow || line.style.particleStroke || "rgba(188, 220, 255, 0.24)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  });

  flushBrowserGraphGpuPoints(cache);
  cache.rafId = window.requestAnimationFrame(drawBrowserGraphFrame);
}

function startBrowserGraphAnimation(cache) {
  if (!cache.canvas || !cache.ctx) return;
  if (cache.rafId) return;
  cache.lastFrameTime = 0;
  cache.rafId = window.requestAnimationFrame(drawBrowserGraphFrame);
}

function stopBrowserGraphAnimation(cache) {
  if (cache.rafId) {
    window.cancelAnimationFrame(cache.rafId);
    cache.rafId = 0;
  }
  clearBrowserGraphGpuFrame(cache);
}

function ensureGraphOrbitLayer(container, cache) {
  if (!cache.orbitLayer || !cache.orbitLayer.isConnected) {
    const layer = document.createElement("div");
    layer.className = "graph-orbit-layer";
    container.appendChild(layer);
    cache.orbitLayer = layer;
  }
  return cache.orbitLayer;
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
  const processPointer = (pointer) => {
    if (!pointer) return;
    const cache = graphState[type];
    const containerRect = container.getBoundingClientRect();
    const localX = pointer.clientX - containerRect.left;
    const localY = pointer.clientY - containerRect.top;
    let nearestId = null;
    let nearestDistance = Infinity;
    cache.nodes.forEach((node, id) => {
      let cx;
      let cy;
      if (type === "browser") {
        const anchor =
          cache.anchorPoints.get(id) ||
          (cache.projectedPositions.get(id) ? toBrowserCanvasPoint(cache.projectedPositions.get(id), cache) : null);
        if (!anchor) return;
        cx = anchor.x;
        cy = anchor.y;
      } else {
        const rect = node.getBoundingClientRect();
        cx = rect.left - containerRect.left + rect.width / 2;
        cy = rect.top - containerRect.top + rect.height / 2;
      }
      const distance = Math.hypot(localX - cx, localY - cy);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestId = id;
      }
    });
    let hoverTargetId = nearestId;
    const hoverIsNode = Boolean(nearestId && nearestDistance < 180);

    if (type === "browser" && !hoverIsNode) {
      let nearestBackground = null;
      let nearestBackgroundDistance = Infinity;
      (cache.backgroundProjectedParticles || []).forEach((particle) => {
        const distance = Math.hypot(localX - particle.x, localY - particle.y);
        if (distance < nearestBackgroundDistance) {
          nearestBackgroundDistance = distance;
          nearestBackground = particle;
        }
      });
      if (
        nearestBackground &&
        nearestBackgroundDistance < Math.max(16, nearestBackground.radius)
      ) {
        hoverTargetId = nearestBackground.id;
      } else {
        hoverTargetId = null;
      }
    }

    if (hoverIsNode && nearestId) {
      const node = cache.nodes.get(nearestId);
      if (node) {
        let cx;
        let cy;
        if (type === "browser") {
          const anchor =
            cache.anchorPoints.get(nearestId) ||
            (cache.projectedPositions.get(nearestId)
              ? toBrowserCanvasPoint(cache.projectedPositions.get(nearestId), cache)
              : null);
          if (!anchor) {
            setGraphHover(type, null);
            return;
          }
          cx = anchor.x;
          cy = anchor.y;
        } else {
          const rect = node.getBoundingClientRect();
          cx = rect.left - containerRect.left + rect.width / 2;
          cy = rect.top - containerRect.top + rect.height / 2;
        }
        const shiftX = Math.max(-26, Math.min(26, (localX - cx) * 0.26));
        const shiftY = Math.max(-26, Math.min(26, (localY - cy) * 0.26));
        const nodeShiftX = Math.max(-8, Math.min(8, (localX - cx) * 0.08));
        const nodeShiftY = Math.max(-8, Math.min(8, (localY - cy) * 0.08));
        node.style.setProperty("--hover-orb-shift-x", `${shiftX}px`);
        node.style.setProperty("--hover-orb-shift-y", `${shiftY}px`);
        node.style.setProperty("--hover-shift-x", `${nodeShiftX}px`);
        node.style.setProperty("--hover-shift-y", `${nodeShiftY}px`);
      }
    }
    setGraphHover(type, hoverTargetId);
  };

  container.addEventListener("mousemove", (event) => {
    graphPointerState[type] = { x: event.clientX, y: event.clientY };
    const cache = graphState[type];
    cache.pendingPointer = { clientX: event.clientX, clientY: event.clientY };
    if (cache.proximityFrameId) return;
    cache.proximityFrameId = requestAnimationFrame(() => {
      cache.proximityFrameId = 0;
      const pointer = cache.pendingPointer;
      cache.pendingPointer = null;
      processPointer(pointer);
    });
  });
  container.addEventListener("mouseleave", () => {
    const cache = graphState[type];
    cache.pendingPointer = null;
    if (cache.proximityFrameId) {
      cancelAnimationFrame(cache.proximityFrameId);
      cache.proximityFrameId = 0;
    }
    cache.nodes.forEach((node) => {
      node.style.setProperty("--hover-shift-x", "0px");
      node.style.setProperty("--hover-shift-y", "0px");
      node.style.setProperty("--hover-orb-shift-x", "0px");
      node.style.setProperty("--hover-orb-shift-y", "0px");
    });
    setGraphHover(type, null);
  });
}

function setGraphHover(type, hoveredId) {
  const cache = graphState[type];
  const previousHoveredId = cache.hoveredId;
  const container = type === "browser" ? dom.resourceMap : dom.graphStage;
  const hoverHasNode = Boolean(hoveredId && cache.nodes?.has?.(hoveredId));
  const sameHoverState = previousHoveredId === hoveredId && cache.hoverHasNode === hoverHasNode;
  cache.hoveredId = hoveredId;
  cache.hoverHasNode = hoverHasNode;
  if (sameHoverState) {
    if (hoveredId && graphPreviewState.panelEl && graphPreviewState.panelEl.classList.contains("is-visible")) {
      positionGraphPreview(type, hoveredId);
      if (hoverHasNode && graphImageZoomState.resourceId === hoveredId) {
        positionGraphImageZoom(type, hoveredId);
      }
    }
    return;
  }
  container.classList.toggle("is-hovering", hoverHasNode);
  container.classList.toggle("is-image-hover", Boolean(hoveredId && hoverHasNode && isImageResource(getResourceById(hoveredId))));
  updateGraphHud(type, hoveredId);
  if (hoveredId !== previousHoveredId) {
    if (hoveredId) {
      scheduleGraphPreview(type, hoveredId);
      if (hoverHasNode) {
        scheduleGraphImageZoom(type, hoveredId);
      } else {
        hideGraphImageZoom(type);
      }
    } else {
      hideGraphPreview();
      hideGraphImageZoom(type);
    }
  } else if (hoveredId && graphPreviewState.panelEl && graphPreviewState.panelEl.classList.contains("is-visible")) {
    positionGraphPreview(type, hoveredId);
    if (hoverHasNode && graphImageZoomState.resourceId === hoveredId) {
      positionGraphImageZoom(type, hoveredId);
    }
  }
  const connectedIds = new Set();
  if (hoverHasNode) {
    cache.lines.forEach((line) => {
      if (line.fromId === hoveredId) connectedIds.add(line.toId);
      else if (line.toId === hoveredId) connectedIds.add(line.fromId);
    });
  }
  cache.nodes.forEach((node, id) => {
    const focused = id === hoveredId;
    const linked = hoverHasNode && connectedIds.has(id);
    node.classList.toggle("is-focused", focused || linked);
    node.classList.toggle("is-dim", hoverHasNode && !focused && !linked);
    if (!focused) {
      node.style.setProperty("--hover-shift-x", "0px");
      node.style.setProperty("--hover-shift-y", "0px");
      node.style.setProperty("--hover-orb-shift-x", "0px");
      node.style.setProperty("--hover-orb-shift-y", "0px");
    }
  });
  cache.lines.forEach((line, key) => {
    if (!hoverHasNode) {
      if (type === "browser") {
        line.focused = false;
        line.dim = false;
      } else {
        line.classList.remove("is-focused", "is-dim");
      }
      return;
    }
    const isConnected =
      type === "browser"
        ? line.fromId === hoveredId || line.toId === hoveredId
        : key.includes(hoveredId);
    if (type === "browser") {
      line.focused = isConnected;
      line.dim = !isConnected;
    } else {
      line.classList.toggle("is-focused", isConnected);
      line.classList.toggle("is-dim", !isConnected);
    }
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
  if (dom.searchFieldLabel) dom.searchFieldLabel.textContent = t("searchFieldLabel");
  if (dom.settingsBtn) dom.settingsBtn.textContent = t("settingsButton");
  if (dom.settingsTitle) dom.settingsTitle.textContent = t("settingsTitle");
  if (dom.settingsEyebrow) dom.settingsEyebrow.textContent = t("settingsEyebrow");
  if (dom.settingsCloseBtn) dom.settingsCloseBtn.textContent = t("settingsClose");
  if (dom.settingsLanguageLabel) dom.settingsLanguageLabel.textContent = t("settingsLanguage");
  if (dom.settingsPopover) dom.settingsPopover.setAttribute("aria-label", t("settingsTitle"));
  dom.resetWorkspaceBtn.textContent = t("resetWorkspace");
  dom.shuffleFocusBtn.textContent = t("shuffleFocus");
  dom.createCardBtn.textContent = t("createCard");
  if (dom.importFileBtn) dom.importFileBtn.textContent = t("importFileButton");
  dom.createWorkspaceSlotBtn.textContent = t("createWorkspaceSlot");
  dom.createCollectionBtn.textContent = t("createCollection");
  dom.cardsViewBtn.textContent = t("cardsView");
  dom.graphViewBtn.textContent = t("graphView");
  dom.cancelCreateCardBtn.textContent = t("cancel");
  dom.submitCreateCardBtn.textContent =
    appState.editorMode === "edit" ? t("saveEdit") : t("saveCard");
  dom.cancelCreateCollectionBtn.textContent = t("cancel");
  dom.submitCreateCollectionBtn.textContent = t("saveCollection");
  dom.cancelCreateWorkspaceSlotBtn.textContent = t("cancel");
  dom.submitCreateWorkspaceSlotBtn.textContent = t("saveWorkspaceSlot");
  dom.searchInput.placeholder = t("searchPlaceholder");
  dom.createTitle.placeholder = t("titlePlaceholder");
  dom.createSummary.placeholder = t("summaryPlaceholder");
  dom.createTags.placeholder = t("tagsPlaceholder");
  dom.createDetail.placeholder = t("detailPlaceholder");
  dom.createCollectionTitle.placeholder = t("collectionNamePlaceholder");
  dom.createCollectionSummary.placeholder = t("collectionSummaryPlaceholder");
  dom.createWorkspaceSlotTitle.placeholder = t("workspaceSlotNamePlaceholder");
  dom.createWorkspaceSlotDescription.placeholder = t("workspaceSlotDescriptionPlaceholder");
  syncSettingsLanguageButtons();
  renderDesktopFileStorageSettings();
  renderGraphHardwareAccelerationSettings();
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
  dom.closeReaderBtn.textContent = t("closeReader");
  dom.readerEyebrow.textContent = t("readerEyebrow");
  renderBrowserDropCopy();
  dom.fileGhostCard.querySelector(".file-ghost-card__title").textContent = t("fileResourcePreview");
  dom.fileGhostCard.querySelector(".file-ghost-card__meta").textContent =
    dragState.active ? getDragPreviewMetaText() : t("fileResourceGenerated");
  renderSearchToolbar();
  if (graphPreviewState.type && graphPreviewState.resourceId && graphPreviewState.panelEl?.classList.contains("is-visible")) {
    showGraphPreview(graphPreviewState.type, graphPreviewState.resourceId);
  }
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

function resetCreateCollectionForm() {
  dom.createCollectionTitle.value = "";
  dom.createCollectionSummary.value = "";
  appState.collectionEditorMode = "create";
  appState.editingCollectionId = null;
  dom.submitCreateCollectionBtn.textContent = t("saveCollection");
}

function resetCreateWorkspaceSlotForm() {
  dom.createWorkspaceSlotTitle.value = "";
  dom.createWorkspaceSlotDescription.value = "";
  appState.workspaceSlotEditorMode = "create";
  appState.editingWorkspaceSlotId = null;
  dom.submitCreateWorkspaceSlotBtn.textContent = t("saveWorkspaceSlot");
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

function toggleCreateCollectionPanel(forceOpen) {
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : dom.createCollectionPanel.classList.contains("is-hidden");
  dom.createCollectionPanel.classList.toggle("is-hidden", !shouldOpen);
  if (shouldOpen) {
    triggerStageAnimation(dom.createCollectionPanel);
    dom.createCollectionTitle.focus();
  }
}

function toggleCreateWorkspaceSlotPanel(forceOpen) {
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : dom.createWorkspaceSlotPanel.classList.contains("is-hidden");
  dom.createWorkspaceSlotPanel.classList.toggle("is-hidden", !shouldOpen);
  if (shouldOpen) {
    triggerStageAnimation(dom.createWorkspaceSlotPanel);
    dom.createWorkspaceSlotTitle.focus();
  }
}

function openEditCollectionPanel(collection) {
  if (!collection || collection.id === "all") return;
  appState.collectionEditorMode = "edit";
  appState.editingCollectionId = collection.id;
  dom.createCollectionTitle.value = collection.name;
  dom.createCollectionSummary.value = collection.summary;
  dom.submitCreateCollectionBtn.textContent = t("saveEdit");
  toggleCreateCollectionPanel(true);
}

function openEditWorkspaceSlotPanel(slot) {
  if (!slot?.id) return;
  appState.workspaceSlotEditorMode = "edit";
  appState.editingWorkspaceSlotId = slot.id;
  dom.createWorkspaceSlotTitle.value = slot.label;
  dom.createWorkspaceSlotDescription.value = slot.description || "";
  dom.submitCreateWorkspaceSlotBtn.textContent = t("saveEdit");
  toggleCreateWorkspaceSlotPanel(true);
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
  const searchTokens = getSearchTokens();

  return resources
    .filter((resource) => {
      const matchesCollection =
        appState.activeCollection === "all" ||
        resource.collections.includes(appState.activeCollection);
      const matchesType =
        appState.activeType === "all" || resource.type === appState.activeType;
      const matchesTag =
        !appState.activeTag || resource.tags.includes(appState.activeTag);
      const matchesSearch = matchesSearchTokens(resource, searchTokens);
      return matchesCollection && matchesType && matchesTag && matchesSearch;
    })
    .sort((resourceA, resourceB) => compareResources(resourceA, resourceB, searchTokens));
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
    const item = document.createElement("article");
    item.className = `collection-item ${appState.activeCollection === collection.id ? "is-active" : ""}`;
    item.tabIndex = 0;
    const actionMarkup = collection.id !== "all"
      ? `
          <div class="collection-item__actions">
            <button class="collection-action-button" data-action="edit" type="button" title="${t("editCollection")}" aria-label="${t("editCollection")}">改</button>
            <button class="collection-action-button danger" data-action="delete" type="button" title="${t("deleteCollection")}" aria-label="${t("deleteCollection")}">删</button>
          </div>
        `
      : "";
    item.innerHTML = `
      ${actionMarkup}
      <strong>${collection.name}</strong>
      <p>${collection.summary}</p>
    `;
    item.addEventListener("click", () => {
      appState.activeCollection = collection.id;
      renderAll();
      saveUiState();
    });
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest(".collection-action-button")) return;
      event.preventDefault();
      appState.activeCollection = collection.id;
      renderAll();
      saveUiState();
    });
    if (collection.id !== "all") {
      item.addEventListener("dragenter", (event) => {
        const resourceId = getDraggedResourceId(event);
        if (!resourceId) return;
        event.preventDefault();
        clearCollectionDropState();
        item.classList.add("is-drop-target");
      });
      item.addEventListener("dragover", (event) => {
        const resourceId = getDraggedResourceId(event);
        if (!resourceId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (!item.classList.contains("is-drop-target")) {
          clearCollectionDropState();
          item.classList.add("is-drop-target");
        }
      });
      item.addEventListener("dragleave", (event) => {
        if (item.contains(event.relatedTarget)) return;
        item.classList.remove("is-drop-target");
      });
      item.addEventListener("drop", (event) => {
        event.preventDefault();
        item.classList.remove("is-drop-target");
        const resourceId = getDraggedResourceId(event);
        const sourceRect = dragState.sourceRect ? { ...dragState.sourceRect } : null;
        addResourceToCollection(resourceId, collection.id, item.getBoundingClientRect(), sourceRect);
      });
    }
    const editBtn = item.querySelector('[data-action="edit"]');
    const deleteBtn = item.querySelector('[data-action="delete"]');
    if (editBtn) {
      editBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        openEditCollectionPanel(collection);
      });
    }
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteCustomCollection(collection.id);
      });
    }
    dom.collectionList.appendChild(item);
  });
}

function createCustomCollection() {
  const name = dom.createCollectionTitle.value.trim();
  const summary = dom.createCollectionSummary.value.trim();

  if (!name || !summary) {
    dom.actionFeedback.textContent =
      appState.language === "en"
        ? "Please complete the collection name and summary."
        : "请补全合集名称和合集说明。";
    return;
  }

  const normalized = name.toLowerCase();
  const existing = collections.find(
    (collection) =>
      collection.name.trim().toLowerCase() === normalized &&
      collection.id !== appState.editingCollectionId,
  );
  if (existing) {
    appState.activeCollection = existing.id;
    resetCreateCollectionForm();
    toggleCreateCollectionPanel(false);
    renderAll();
    dom.actionFeedback.textContent =
      appState.language === "en"
        ? `Collection "${existing.name}" already exists and is now selected.`
        : `合集「${existing.name}」已经存在，已为你切换过去。`;
    saveUiState();
    return;
  }

  const isEdit = appState.collectionEditorMode === "edit" && appState.editingCollectionId;
  let collection;
  if (isEdit) {
    collection = collections.find((item) => item.id === appState.editingCollectionId);
    if (!collection) return;
    collection.name = name;
    collection.summary = summary;
  } else {
    collection = {
      id: `collection-custom-${Date.now()}`,
      name,
      summary,
    };
    collections.push(collection);
  }
  populateCreateCollectionOptions();
  resetCreateCollectionForm();
  toggleCreateCollectionPanel(false);
  appState.activeCollection = collection.id;
  saveCustomCollections();
  renderAll();
  dom.actionFeedback.textContent =
    isEdit
      ? appState.language === "en"
        ? `Updated collection "${collection.name}".`
        : `已更新合集「${collection.name}」。`
      : appState.language === "en"
        ? `New collection "${collection.name}" created.`
        : `已创建新合集「${collection.name}」。`;
  saveUiState();
}

function deleteCustomCollection(collectionId) {
  const collection = collections.find((item) => item.id === collectionId);
  if (!collection || collection.id === "all") return;

  collections = collections.filter((item) => item.id !== collectionId);
  resources.forEach((resource) => {
    resource.collections = resource.collections.filter((id) => id !== collectionId);
    if (!resource.collections.length) {
      resource.collections = [getFallbackCollectionId(resource)];
    }
  });

  if (appState.activeCollection === collectionId) {
    appState.activeCollection = "all";
  }
  if (appState.editingCollectionId === collectionId) {
    resetCreateCollectionForm();
    toggleCreateCollectionPanel(false);
  }

  saveCustomCollections();
  saveCustomResources();
  saveResourceOverrides();
  populateCreateCollectionOptions();
  renderAll();
  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Deleted collection "${collection.name}".`
      : `已删除合集「${collection.name}」。`;
  saveUiState();
}

function createWorkspaceSlot() {
  const label = dom.createWorkspaceSlotTitle.value.trim();
  const description = dom.createWorkspaceSlotDescription.value.trim();

  if (!label) {
    dom.actionFeedback.textContent =
      appState.language === "en" ? "Please enter a slot name." : "请先输入槽位名称。";
    return;
  }

  const existingSlot = getWorkspaceSlotDefinitions().find(
    (slot) =>
      slot.label.trim().toLowerCase() === label.toLowerCase() &&
      slot.id !== appState.editingWorkspaceSlotId,
  );
  if (existingSlot) {
    dom.actionFeedback.textContent =
      appState.language === "en"
        ? `Slot "${existingSlot.label}" already exists.`
        : `槽位「${existingSlot.label}」已经存在。`;
    return;
  }

  const isEdit = appState.workspaceSlotEditorMode === "edit" && appState.editingWorkspaceSlotId;
  let slotId = appState.editingWorkspaceSlotId;
  if (isEdit) {
    const slot = appState.customWorkspaceSlots.find((item) => item.id === slotId);
    if (!slot) return;
    slot.label = label;
    slot.description = description;
  } else {
    slotId = `custom-slot-${Date.now()}`;
    appState.customWorkspaceSlots.push({
      id: slotId,
      label,
      description,
    });
    appState.workspaceSlots[slotId] = [];
  }
  resetCreateWorkspaceSlotForm();
  toggleCreateWorkspaceSlotPanel(false);
  renderWorkspace();
  if (workspacePickerState.resourceId && workspacePickerState.anchorEl) {
    openWorkspacePicker(workspacePickerState.resourceId, workspacePickerState.anchorEl);
  }
  saveUiState();
  dom.actionFeedback.textContent =
    isEdit
      ? appState.language === "en"
        ? `Updated slot "${label}".`
        : `已更新工作台槽位「${label}」。`
      : appState.language === "en"
        ? `Created slot "${label}".`
        : `已创建工作台槽位「${label}」。`;
}

function deleteWorkspaceSlot(slotId) {
  const slot = appState.customWorkspaceSlots.find((item) => item.id === slotId);
  if (!slot) return;
  if (appState.customWorkspaceSlots.length <= 1) {
    dom.actionFeedback.textContent =
      appState.language === "en"
        ? "Keep at least one workspace slot."
        : "至少保留一个工作台槽位。";
    return;
  }

  appState.customWorkspaceSlots = appState.customWorkspaceSlots.filter((item) => item.id !== slotId);
  delete appState.workspaceSlots[slotId];

  if (appState.editingWorkspaceSlotId === slotId) {
    resetCreateWorkspaceSlotForm();
    toggleCreateWorkspaceSlotPanel(false);
  }
  if (workspacePickerState.menuEl && !workspacePickerState.menuEl.classList.contains("is-hidden")) {
    closeWorkspacePicker();
  }

  renderWorkspace();
  saveUiState();
  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Deleted slot "${slot.label}".`
      : `已删除工作台槽位「${slot.label}」。`;
}

function buildCollectionOptionsMarkup(selectedId) {
  return collections
    .filter((collection) => collection.id !== "all")
    .map(
      (collection) =>
        `<option value="${collection.id}" ${collection.id === selectedId ? "selected" : ""}>${collection.name}</option>`,
    )
    .join("");
}

function updateResourceCollection(resourceId, collectionId) {
  const target = getResourceById(resourceId);
  if (!target || !collectionId) return;
  target.collections = [collectionId];
  touchResourceMeta(target.id, "lastEditedAt");
  scheduleCollectionUiCommit(
    appState.language === "en"
      ? `Updated collection for "${target.title}".`
      : `已更新「${target.title}」的归属合集。`,
    60,
    target.id,
  );
  return;
  saveCustomResources();
  saveResourceOverrides();
  renderAll();
  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Updated collection for "${target.title}".`
      : `已更新「${target.title}」的归属合集。`;
  saveUiState();
}

function removeResourceFromCollection(resourceId, collectionId) {
  const target = getResourceById(resourceId);
  const collection = collections.find((item) => item.id === collectionId);
  if (!target || !collection) return;

  target.collections = target.collections.filter((id) => id !== collectionId);
  touchResourceMeta(target.id, "lastEditedAt");
  scheduleCollectionUiCommit(
    appState.language === "en"
      ? `Removed "${target.title}" from "${collection.name}".`
      : `已把「${target.title}」移出「${collection.name}」。`,
    40,
    target.id,
  );
  return;
  saveCustomResources();
  saveResourceOverrides();
  renderAll();
  showActionFeedback(
    appState.language === "en"
      ? `Removed "${target.title}" from "${collection.name}".`
      : `已把「${target.title}」移出「${collection.name}」。`,
  );
  saveUiState();
}

function addResourceToCollection(resourceId, collectionId, targetRect, sourceRect = null) {
  const target = getResourceById(resourceId);
  const collection = collections.find((item) => item.id === collectionId);
  if (!target || !collection || collection.id === "all") return;

  const alreadyInCollection = target.collections.includes(collectionId);
  if (alreadyInCollection) {
    dom.actionFeedback.textContent =
      appState.language === "en"
        ? `"${target.title}" is already in "${collection.name}".`
        : `「${target.title}」已经在「${collection.name}」里了。`;
    return;
  }

  target.collections = [...new Set([...target.collections, collectionId])];
  touchResourceMeta(target.id, "lastEditedAt");
  const sourceSnapshot = sourceRect
    ? {
        rect: sourceRect,
        title: dragState.sourceTitle || target.title,
        type: dragState.sourceType || t(`types.${target.type}`) || typeMeta[target.type] || target.type,
      }
    : cloneDragSourceSnapshot();
  playCollectionAbsorbFeedback(sourceSnapshot, targetRect);
  scheduleCollectionUiCommit(
    appState.language === "en"
      ? `Added "${target.title}" to "${collection.name}".`
      : `已把「${target.title}」归入「${collection.name}」。`,
    120,
    target.id,
  );
  return;
  saveCustomResources();
  saveResourceOverrides();
  renderAll();
  showActionFeedback(
    appState.language === "en"
      ? `Added "${target.title}" to "${collection.name}".`
      : `已把「${target.title}」归入「${collection.name}」。`,
  );
  saveUiState();
}

function buildRelationOptionsMarkup(selectedId) {
  return resources
    .filter((resource) => resource.id !== selectedId)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"))
    .map((resource) => `<option value="${resource.id}">${resource.title}</option>`)
    .join("");
}

function addResourceRelation(sourceId, targetId, relationTypeOverride) {
  const source = getResourceById(sourceId);
  const target = getResourceById(targetId);
  if (!source || !target || sourceId === targetId) return;
  const relationType =
    relationTypeOverride ||
    document.getElementById("detailRelationTypeSelect")?.value ||
    "reference";
  if (!source.related.includes(targetId)) {
    source.related = [...source.related, targetId];
  }
  if (!target.related.includes(sourceId)) {
    target.related = [...target.related, sourceId];
  }
  const existingEdge = relationEdges.find(
    (edge) =>
      (edge.from === sourceId && edge.to === targetId) ||
      (edge.from === targetId && edge.to === sourceId),
  );
  if (existingEdge) {
    existingEdge.from = sourceId;
    existingEdge.to = targetId;
    existingEdge.type = relationType;
  } else {
    relationEdges.push({
      id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      from: sourceId,
      to: targetId,
      type: relationType,
      createdAt: new Date().toISOString(),
    });
  }
  touchResourceMeta(source.id, "lastEditedAt");
  touchResourceMeta(target.id, "lastEditedAt");
  saveRelationEdges();
  saveCustomResources();
  saveResourceOverrides();
  renderAll();
  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Connected "${source.title}" with "${target.title}" as ${t(`relationTypes.${relationType}`).toLowerCase()}.`
      : `已建立「${source.title}」与「${target.title}」的${t(`relationTypes.${relationType}`)}关系。`;
  saveUiState();
}

function removeResourceRelation(sourceId, targetId) {
  const source = getResourceById(sourceId);
  const target = getResourceById(targetId);
  if (!source || !target) return;
  source.related = source.related.filter((id) => id !== targetId);
  target.related = target.related.filter((id) => id !== sourceId);
  relationEdges = relationEdges.filter(
    (edge) =>
      !(
        (edge.from === sourceId && edge.to === targetId) ||
        (edge.from === targetId && edge.to === sourceId)
      ),
  );
  touchResourceMeta(source.id, "lastEditedAt");
  touchResourceMeta(target.id, "lastEditedAt");
  saveRelationEdges();
  saveCustomResources();
  saveResourceOverrides();
  renderAll();
  dom.actionFeedback.textContent =
    appState.language === "en"
      ? `Removed relation between "${source.title}" and "${target.title}".`
      : `已移除「${source.title}」与「${target.title}」的关联。`;
  saveUiState();
}

function toggleResourcePinned(resourceId) {
  const resource = getResourceById(resourceId);
  if (!resource) return;
  const nextValue = !getResourceMeta(resourceId).pinned;
  updateResourceMetaFlag(resourceId, "pinned", nextValue);
  renderAll();
  dom.actionFeedback.textContent =
    nextValue
      ? appState.language === "en"
        ? `Pinned "${resource.title}".`
        : `已置顶「${resource.title}」。`
      : appState.language === "en"
        ? `Unpinned "${resource.title}".`
        : `已取消置顶「${resource.title}」。`;
}

function toggleResourceFavorite(resourceId) {
  const resource = getResourceById(resourceId);
  if (!resource) return;
  const nextValue = !getResourceMeta(resourceId).favorite;
  updateResourceMetaFlag(resourceId, "favorite", nextValue);
  renderAll();
  dom.actionFeedback.textContent =
    nextValue
      ? appState.language === "en"
        ? `Favorited "${resource.title}".`
        : `已收藏「${resource.title}」。`
      : appState.language === "en"
        ? `Removed "${resource.title}" from favorites.`
        : `已取消收藏「${resource.title}」。`;
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
  const slotDefinitions = getWorkspaceSlotDefinitions();
  const slot =
    (targetSlot && appState.workspaceSlots[targetSlot] ? targetSlot : null) ||
    (resource.preferredSlot && appState.workspaceSlots[resource.preferredSlot] ? resource.preferredSlot : null) ||
    slotDefinitions[0]?.id;
  if (!slot) return;
  const slotItems = appState.workspaceSlots[slot];
  if (!slotItems.includes(resourceId)) {
    slotItems.push(resourceId);
  }
  touchResourceMeta(resourceId, "lastUsedAt");
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
    dom.actionFeedback.textContent = "请至少补全标题、摘要、详情和集合。";
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
    touchResourceMeta(target.id, "lastEditedAt");
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
    touchResourceMeta(id, "lastEditedAt");
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
      ? `已更新卡片「${title}」。`
      : `已创建新卡片「${title}」，现在可以继续拖入工作台。`;
  saveUiState();
}

function deleteCustomCard(resourceId) {
  const index = resources.findIndex((resource) => resource.id === resourceId);
  if (index === -1) return;
  const [removed] = resources.splice(index, 1);
  delete resourceMeta[resourceId];
  relationEdges = relationEdges.filter((edge) => edge.from !== resourceId && edge.to !== resourceId);
  saveResourceMeta();
  saveRelationEdges();
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
  dom.actionFeedback.textContent = `已删除卡片「${removed.title}」。`;
  saveUiState();
}

let cardHoverFrame = null;
let actionFeedbackHideTimeout = null;
let actionFeedbackCleanupTimeout = null;
let collectionUiCommitTimer = null;
let collectionPersistenceHandle = null;

function cancelCollectionPersistenceHandle() {
  if (!collectionPersistenceHandle) return;
  if (typeof collectionPersistenceHandle === "number") {
    clearTimeout(collectionPersistenceHandle);
  } else if (typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(collectionPersistenceHandle);
  }
  collectionPersistenceHandle = null;
}

function scheduleCollectionPersistence() {
  cancelCollectionPersistenceHandle();
  const persist = () => {
    collectionPersistenceHandle = null;
    saveCustomResources();
    saveResourceOverrides();
    saveUiState();
  };
  if (typeof window.requestIdleCallback === "function") {
    collectionPersistenceHandle = window.requestIdleCallback(persist, { timeout: 900 });
  } else {
    collectionPersistenceHandle = window.setTimeout(persist, 180);
  }
}

function showActionFeedback(message) {
  if (!dom.actionFeedback) return;
  if (!message) {
    if (actionFeedbackHideTimeout) {
      clearTimeout(actionFeedbackHideTimeout);
      actionFeedbackHideTimeout = null;
    }
    if (actionFeedbackCleanupTimeout) {
      clearTimeout(actionFeedbackCleanupTimeout);
      actionFeedbackCleanupTimeout = null;
    }
    dom.actionFeedback.classList.remove("is-visible");
    actionFeedbackCleanupTimeout = window.setTimeout(() => {
      dom.actionFeedback.classList.add("is-hidden");
    }, 520);
    return;
  }
  if (actionFeedbackHideTimeout) {
    clearTimeout(actionFeedbackHideTimeout);
    actionFeedbackHideTimeout = null;
  }
  if (actionFeedbackCleanupTimeout) {
    clearTimeout(actionFeedbackCleanupTimeout);
    actionFeedbackCleanupTimeout = null;
  }
  dom.actionFeedback.classList.remove("is-hidden");
  dom.actionFeedback.textContent = message;
  requestAnimationFrame(() => dom.actionFeedback.classList.add("is-visible"));
  actionFeedbackHideTimeout = window.setTimeout(() => {
    dom.actionFeedback.classList.remove("is-visible");
    actionFeedbackCleanupTimeout = window.setTimeout(() => {
      dom.actionFeedback.classList.add("is-hidden");
      actionFeedbackCleanupTimeout = null;
    }, 560);
  }, 2200);
}

function scheduleCollectionUiCommit(message, delay = 0, resourceId = null) {
  if (collectionUiCommitTimer) {
    clearTimeout(collectionUiCommitTimer);
    collectionUiCommitTimer = null;
  }
  collectionUiCommitTimer = window.setTimeout(() => {
    collectionUiCommitTimer = null;
    refreshCollectionMutationUi(resourceId);
    showActionFeedback(message);
    scheduleCollectionPersistence();
  }, Math.max(0, delay));
}

function bindActionFeedbackObserver() {
  if (!dom.actionFeedback) return;
  const observer = new MutationObserver(() => {
    const message = (dom.actionFeedback.textContent || "").trim();
    if (!message) return;
    showActionFeedback(message);
  });
  observer.observe(dom.actionFeedback, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

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

function bindReaderInteractions() {
  dom.readerBackdrop.addEventListener("click", closeReader);
  dom.closeReaderBtn.addEventListener("click", closeReader);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.readerOverlay.classList.contains("is-hidden")) {
      closeReader();
    }
  });
}

function bindWorkspacePickerInteractions() {
  ensureWorkspacePicker();

  document.addEventListener("click", (event) => {
    const menu = workspacePickerState.menuEl;
    if (!menu || menu.classList.contains("is-hidden")) return;
    if (menu.contains(event.target)) return;
    if (workspacePickerState.anchorEl?.contains?.(event.target)) return;
    closeWorkspacePicker();
  });

  window.addEventListener("resize", () => {
    if (workspacePickerState.resourceId && workspacePickerState.anchorEl) {
      positionWorkspacePicker(workspacePickerState.anchorEl);
    }
  });

  window.addEventListener("scroll", () => {
    if (workspacePickerState.resourceId && workspacePickerState.anchorEl) {
      positionWorkspacePicker(workspacePickerState.anchorEl);
    }
  }, true);
}

function bindGraphPreviewInteractions() {
  window.addEventListener("resize", () => {
    if (graphPreviewState.type && graphPreviewState.resourceId && graphPreviewState.panelEl?.classList.contains("is-visible")) {
      positionGraphPreview(graphPreviewState.type, graphPreviewState.resourceId);
    }
    if (graphImageZoomState.type && graphImageZoomState.resourceId) {
      positionGraphImageZoom(graphImageZoomState.type, graphImageZoomState.resourceId);
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (graphPreviewState.type && graphPreviewState.resourceId && graphPreviewState.panelEl?.classList.contains("is-visible")) {
        positionGraphPreview(graphPreviewState.type, graphPreviewState.resourceId);
      }
      if (graphImageZoomState.type && graphImageZoomState.resourceId) {
        positionGraphImageZoom(graphImageZoomState.type, graphImageZoomState.resourceId);
      }
    },
    true,
  );
}

function bindFileImport() {
  const panel = dom.resourceBrowserPanel;
  if (!panel) return;

  if (dom.importFileBtn && dom.importFileInput) {
    dom.importFileBtn.addEventListener("click", () => {
      dom.importFileInput.click();
    });

    dom.importFileInput.addEventListener("change", async (event) => {
      const files = [...(event.target?.files || [])].filter(Boolean);
      if (files.length) {
        await importFiles(files);
      }
      event.target.value = "";
    });
  }

  panel.addEventListener("dragenter", (event) => {
    const snapshot = inspectImportPayload(event.dataTransfer);
    const hasFile = [...(event.dataTransfer?.items || [])].some((item) => item.kind === "file");
    if (!hasFile && !snapshot.linkCount) return;
    syncDragImportState(snapshot);
    dragState.depth += 1;
    dragState.active = true;
    setBrowserDropState(true);
    showFileGhost(snapshot.firstLabel, event.clientX, event.clientY, {
      typeLabel: snapshot.firstTypeLabel,
      isInvalid: dragState.onlyUnsupportedItems,
    });
  });

  panel.addEventListener("dragover", (event) => {
    const snapshot = inspectImportPayload(event.dataTransfer);
    if (!dragState.active && !snapshot.hasSupportedPayload && !snapshot.unsupportedTypes.length) return;
    event.preventDefault();
    syncDragImportState(snapshot);
    event.dataTransfer.dropEffect = dragState.onlyUnsupportedItems ? "none" : "copy";
    setBrowserDropState(true);
    if (snapshot.firstLabel) {
      showFileGhost(snapshot.firstLabel, event.clientX, event.clientY, {
        typeLabel: snapshot.firstTypeLabel,
        isInvalid: dragState.onlyUnsupportedItems,
      });
    } else {
      updateGhostCardPosition(event.clientX, event.clientY);
    }
  });

  panel.addEventListener("dragleave", () => {
    if (!dragState.active) return;
    dragState.depth = Math.max(0, dragState.depth - 1);
    if (dragState.depth > 0) return;
    resetDragImportState();
    setBrowserDropState(false);
    hideFileGhost();
  });

  panel.addEventListener("drop", async (event) => {
    const snapshot = inspectImportPayload(event.dataTransfer);
    const linkPayloads = extractLinkPayloads(event.dataTransfer);
    const droppedFiles = extractImportFilesFromDataTransfer(event.dataTransfer);
    const containsFileItems = hasFileItems(event.dataTransfer?.items || []);
    const unsupportedTypes = droppedFiles.length
      ? getUnsupportedImportTypes(droppedFiles)
      : getUnsupportedImportTypesFromItems(event.dataTransfer?.items || []);
    if (
      !dragState.active &&
      !droppedFiles.length &&
      !linkPayloads.length &&
      !getSupportedImportCountFromItems(event.dataTransfer?.items || []) &&
      !containsFileItems
    ) return;
    event.preventDefault();
    syncDragImportState(snapshot);
    resetDragImportState();
    setBrowserDropState(false);
    hideFileGhost();
    if (droppedFiles.length) {
      await importFiles(droppedFiles);
    } else if (linkPayloads.length) {
      await importLinks(linkPayloads);
    } else if (unsupportedTypes.length) {
      showActionFeedback(t("unsupportedFileTypes").replace("{types}", unsupportedTypes.join(", ")));
    }
  });
}

function renderResourceGrid() {
  const filtered = getFilteredResources();
  const searchTokens = getSearchTokens();
  dom.resourceGrid.innerHTML = "";
  dom.resultCountLabel.textContent =
    appState.language === "en" ? `${filtered.length} resource cards` : `共 ${filtered.length} 张资源卡`;

  filtered.forEach((resource) => {
    const meta = getResourceMeta(resource.id);
    const card = dom.cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.resourceId = resource.id;
    card.classList.toggle("is-selected", resource.id === appState.selectedResourceId);
    card.classList.toggle("is-document", isDocumentResource(resource));
    card.classList.toggle("is-image-resource", isImageResource(resource));
    card.classList.toggle("is-link-resource", isLinkResource(resource));
    card.querySelector(".resource-card__type").textContent = t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type;
    card.querySelector(".resource-card__title").innerHTML = highlightText(resource.title, searchTokens);
    card.querySelector(".resource-card__summary").innerHTML = highlightText(resource.summary, searchTokens);
    const cardBody = card.querySelector(".resource-card__body");

    if (isImageResource(resource) && resource.previewUrl) {
      const thumb = document.createElement("div");
      thumb.className = "resource-card__thumbnail";
      thumb.innerHTML = `<img src="${resource.previewUrl}" alt="${escapeHtml(resource.title)}" />`;
      cardBody.classList.add("resource-card__body--with-thumb");
      cardBody.prepend(thumb);
    } else if (isLinkResource(resource)) {
      const linkMeta = document.createElement("div");
      linkMeta.className = "resource-card__link-meta";
      linkMeta.textContent = resource.sourceUrl || resource.detail || "";
      card.querySelector(".resource-card__summary").before(linkMeta);
    }

    const snippet = buildSearchSnippet(resource, searchTokens);
    if (snippet && snippet !== normalizePlainText(resource.summary || "")) {
      const snippetNode = document.createElement("p");
      snippetNode.className = "resource-card__snippet";
      snippetNode.innerHTML = highlightText(snippet, searchTokens);
      card.querySelector(".resource-card__summary").after(snippetNode);
    }

    if (meta.pinned || meta.favorite) {
      const badgeRow = document.createElement("div");
      badgeRow.className = "resource-badge-row";
      if (meta.pinned) {
        const badge = document.createElement("span");
        badge.className = "resource-state-pill";
        badge.textContent = t("pinnedBadge");
        badgeRow.appendChild(badge);
      }
      if (meta.favorite) {
        const badge = document.createElement("span");
        badge.className = "resource-state-pill";
        badge.textContent = t("favoriteBadge");
        badgeRow.appendChild(badge);
      }
      card.querySelector(".resource-card__summary").after(badgeRow);
    }

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
      clearDragResourceState();
      event.dataTransfer.setData("text/plain", resource.id);
      event.dataTransfer.effectAllowed = "move";
      appState.selectedResourceId = resource.id;
      dragState.resourceId = resource.id;
      const rect = card.getBoundingClientRect();
      dragState.sourceRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
      dragState.sourceTitle = resource.title;
      dragState.sourceType = t(`types.${resource.type}`) || typeMeta[resource.type] || resource.type;
    });

    card.addEventListener("dragend", () => {
      clearCollectionDropState();
      dragState.resetTimer = window.setTimeout(() => {
        clearDragResourceState();
      }, 140);
    });

    const addButton = card.querySelector(".add-button");
    const pinButton = card.querySelector(".pin-button");
    const favoriteButton = card.querySelector(".favorite-button");

    addButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openWorkspacePicker(resource.id, event.currentTarget);
    });
    pinButton.classList.toggle("is-active", meta.pinned);
    pinButton.textContent = meta.pinned ? t("pinnedBadge") : t("pinCard");
    pinButton.title = meta.pinned ? t("unpinCard") : t("pinCard");
    pinButton.setAttribute("aria-label", meta.pinned ? t("unpinCard") : t("pinCard"));
    pinButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleResourcePinned(resource.id);
    });
    favoriteButton.classList.toggle("is-active", meta.favorite);
    favoriteButton.textContent = meta.favorite ? t("favoriteBadge") : t("favoriteCard");
    favoriteButton.title = meta.favorite ? t("unfavoriteCard") : t("favoriteCard");
    favoriteButton.setAttribute("aria-label", meta.favorite ? t("unfavoriteCard") : t("favoriteCard"));
    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleResourceFavorite(resource.id);
    });

    dom.resourceGrid.appendChild(card);
  });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "state-empty";
    empty.textContent = t("searchNoResults");
    dom.resourceGrid.appendChild(empty);
  }
  applyLanguage();
}

function renderBrowserGraph() {
  const filtered = getFilteredResources();
  const cache = graphState.browser;
  cache.gpuPreference = isGraphHardwareAccelerationEnabled();
  if (!cache.gpuPreference) {
    destroyBrowserGraphGpuRenderer(cache);
  }

  if (!filtered.length) {
    stopBrowserGraphAnimation(cache);
    destroyBrowserGraphGpuRenderer(cache);
    dom.resourceMap.innerHTML =
      '<div class="browser-graph-empty">当前筛选条件下没有资源可以构成图谱，试着放宽集合、类型或标签筛选。</div>';
    cache.canvas = null;
    cache.ctx = null;
    cache.backgroundParticles = [];
    cache.backgroundProjectedParticles = [];
    cache.orderedLines = [];
    cache.nodes.clear();
    cache.lines.clear();
    cache.positions.clear();
    cache.projectedPositions.clear();
    cache.anchorPoints.clear();
    cache.directMeta = new Map();
    cache.selectedId = null;
    return;
  }

  dom.resourceMap.querySelector(".browser-graph-empty")?.remove();
  ensureBrowserGraphCanvas(dom.resourceMap, cache);
  ensureGraphHud(dom.resourceMap);

  const selected = filtered.find((item) => item.id === appState.selectedResourceId) || filtered[0];
  const hierarchy = getBrowserGraphHierarchy(selected, filtered);
  const positions = buildBrowserGraphNodePositions(
    selected.id,
    hierarchy.directIds,
    hierarchy.secondDegreeIds,
    hierarchy.directMeta,
  );
  cache.positions = positions;
  cache.directMeta = hierarchy.directMeta;
  cache.sphereEpoch = performance.now();
  applyBrowserGraphNodeProjection(cache, cache.sphereEpoch);
  cache.backgroundParticles = buildBrowserGraphBackgroundParticles(hierarchy.backgroundResources);

  const activeLineKeys = new Set();
  const activeResources = [selected.id, ...hierarchy.directIds]
    .map(getResourceById)
    .filter(Boolean);
  const activeNodeIds = new Set(activeResources.map((resource) => resource.id));

  [...hierarchy.directIds, ...hierarchy.secondDegreeIds].forEach((targetId) => {
    const meta = hierarchy.directMeta.get(targetId);
    const target = getResourceById(targetId);
    const from = cache.projectedPositions.get(selected.id);
    const to = cache.projectedPositions.get(targetId);
    if (!meta || !target || !from || !to) return;
    const hierarchyLevel = hierarchy.levelMap.get(targetId) ?? 1;
    const lineKey = getLineKey(selected.id, targetId);
    activeLineKeys.add(lineKey);
    syncBrowserGraphLine(
      cache,
      lineKey,
      selected.id,
      targetId,
      from,
      to,
      meta.relationType,
      { x: BROWSER_GRAPH_SPHERE.centerX, y: BROWSER_GRAPH_SPHERE.centerY },
      hierarchyLevel === 1,
      false,
      hierarchyLevel,
      getBrowserSemanticLineStyle(meta, hierarchyLevel === 1, hierarchyLevel),
    );
  });

  activeResources.forEach((resource) => {
    let node = cache.nodes.get(resource.id);
    const isSelected = resource.id === selected.id;
    const hierarchyLevel = hierarchy.levelMap.get(resource.id) ?? 3;
    const isLinked = hierarchyLevel === 1;
    const isSecondaryTier = hierarchyLevel === 2;
    const primaryMeta = hierarchy.directMeta.get(resource.id) || null;
    const projected = cache.projectedPositions.get(resource.id);
    if (!node) {
      node = document.createElement("button");
      node.className = "browser-graph-node";
      node.addEventListener("click", () => handleGraphNodeClick(resource.id, node));
      node.addEventListener("dblclick", (event) => {
        event.stopPropagation();
        openResourceReader(resource);
      });
      cache.nodes.set(resource.id, node);
      dom.resourceMap.appendChild(node);
    }
    node.classList.toggle("is-selected", isSelected);
    node.classList.toggle("is-linked", isLinked);
    node.classList.toggle("is-secondary-tier", isSecondaryTier);
    node.classList.toggle("workspace", primaryMeta?.bucket === "workspace");
    node.classList.toggle("collection", primaryMeta?.bucket === "collection");
    node.classList.toggle("tag-related", primaryMeta?.bucket === "tag");
    node.classList.toggle("is-image-node", isImageResource(resource));
    applyImageNodeAccent(node, resource);
    node.innerHTML = buildBrowserGraphNodeMarkup(resource);
    if (projected) {
      const projectedX = ((cache.canvasWidth || 0) * projected.x) / 100;
      const projectedY = ((cache.canvasHeight || 0) * projected.y) / 100;
      node.style.removeProperty("left");
      node.style.removeProperty("top");
      node.style.setProperty("--graph-node-x", `${projectedX.toFixed(2)}px`);
      node.style.setProperty("--graph-node-y", `${projectedY.toFixed(2)}px`);
      node.style.setProperty("--graph-node-scale", projected.scale.toFixed(3));
      node.style.setProperty("--graph-node-opacity", projected.opacity.toFixed(3));
      node.style.setProperty("--graph-node-blur", `${projected.blur.toFixed(2)}px`);
      node.style.setProperty("--graph-node-lift", `${projected.lift.toFixed(2)}px`);
      node.style.setProperty("--graph-label-opacity", projected.labelOpacity.toFixed(3));
      node.style.setProperty("--graph-label-scale", projected.labelScale.toFixed(3));
      node.style.setProperty("--graph-node-brightness", projected.brightness.toFixed(3));
      node.style.zIndex = `${6 + Math.round(projected.depth * 18)}`;
    }
  });

  [...cache.nodes.keys()].forEach((id) => {
    if (!activeNodeIds.has(id)) {
      cache.nodes.get(id)?.remove();
      cache.nodes.delete(id);
    }
  });

  [...cache.lines.keys()].forEach((key) => {
    if (!activeLineKeys.has(key)) {
      cache.lines.delete(key);
    }
  });
  cache.orderedLines = buildBrowserGraphOrderedLines(cache);
  cache.selectedId = selected.id;
  if (cache.hoveredId && !filtered.some((resource) => resource.id === cache.hoveredId)) {
    cache.hoveredId = null;
  }
  triggerStageAnimation(dom.resourceMap);
  setGraphHover("browser", cache.hoveredId);
  startBrowserGraphAnimation(cache);
}

function renderBrowserView() {
  const graphMode = appState.activeView === "graph";
  dom.cardsView.classList.toggle("is-hidden", graphMode);
  dom.graphView.classList.toggle("is-hidden", !graphMode);
  dom.cardsViewBtn.classList.toggle("is-active", !graphMode);
  dom.graphViewBtn.classList.toggle("is-active", graphMode);

  if (graphMode) {
    dom.resultCountLabel.textContent =
      appState.language === "en"
        ? `${getFilteredResources().length} graph nodes`
        : `图谱内 ${getFilteredResources().length} 个节点`;
    renderBrowserGraph();
  } else {
    setGraphHover("browser", null);
    stopBrowserGraphAnimation(graphState.browser);
    triggerStageAnimation(dom.cardsView);
  }
}

function renderWorkspaceSlot(slotKey, host) {
  host.innerHTML = "";
  const items = appState.workspaceSlots[slotKey].map(getResourceById).filter(Boolean);

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-slot";
    empty.textContent = "把相关资源拖进来，或者先在资源卡上点“加入工作台”。";
    host.appendChild(empty);
  } else {
    items.forEach((resource) => {
      const chip = document.createElement("div");
      chip.className = "slot-chip";
      chip.innerHTML = `
        <span>${resource.title}</span>
        <button title="移除">×</button>
      `;
      chip.addEventListener("click", () => {
        updateSelection(resource.id);
      });
      chip.addEventListener("dblclick", (event) => {
        event.stopPropagation();
        openResourceReader(resource);
      });
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
      dom.actionFeedback.textContent = `已把「${resource.title}」放入 ${getSlotLabel(slotKey)}。`;
    }
  });
}

function renderWorkspace() {
  dom.workspaceLanes.innerHTML = "";

  getWorkspaceSlotDefinitions().forEach((slot) => {
    const article = document.createElement("article");
    article.className = "workspace-slot";
    article.dataset.slot = slot.id;
    const actionMarkup = getWorkspaceSlotDefinitions().length > 0
      ? `
          <div class="workspace-slot__actions">
            <button class="collection-action-button" data-action="edit-slot" type="button" title="${t("editWorkspaceSlot")}" aria-label="${t("editWorkspaceSlot")}">改</button>
            <button class="collection-action-button danger" data-action="delete-slot" type="button" title="${t("deleteWorkspaceSlot")}" aria-label="${t("deleteWorkspaceSlot")}">删</button>
          </div>
        `
      : "";
    article.innerHTML = `
      <header>
        <div class="workspace-slot__header-main">
          <span>${slot.label}</span>
          <small>${slot.description || "把相关资源拖进来，形成新的工作流层。"}</small>
        </div>
        ${actionMarkup}
      </header>
      <div class="slot-body"></div>
    `;
    dom.workspaceLanes.appendChild(article);
    const editBtn = article.querySelector('[data-action="edit-slot"]');
    const deleteBtn = article.querySelector('[data-action="delete-slot"]');
    if (editBtn) {
      editBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        openEditWorkspaceSlotPanel(slot);
      });
    }
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteWorkspaceSlot(slot.id);
      });
    }
    renderWorkspaceSlot(slot.id, article.querySelector(".slot-body"));
  });
}

function renderDetail(options = {}) {
  const { animate = true } = options;
  const selected = getSelectedResource();
  const selectedMeta = getResourceMeta(selected.id);
  const searchTokens = getSearchTokens();
  const relationEntries = getRelationEntries(selected);
  const actionParts = [
    `<button class="ghost-button compact-button" id="openReaderBtn">${t("openReader")}</button>`,
    `<button class="ghost-button compact-button" id="detailAddWorkspaceBtn">${t("addToWorkspace")}</button>`,
    `<button class="ghost-button compact-button" id="detailExportCardBtn">${t("exportCard")}</button>`,
    `<button class="ghost-button compact-button" id="detailPinBtn">${selectedMeta.pinned ? t("unpinCard") : t("pinCard")}</button>`,
    `<button class="ghost-button compact-button" id="detailFavoriteBtn">${selectedMeta.favorite ? t("unfavoriteCard") : t("favoriteCard")}</button>`,
  ];
  const stateMarkup = selectedMeta.pinned || selectedMeta.favorite
    ? `
      <div class="detail-state-row">
        ${selectedMeta.pinned ? `<span class="resource-state-pill">${t("pinnedBadge")}</span>` : ""}
        ${selectedMeta.favorite ? `<span class="resource-state-pill">${t("favoriteBadge")}</span>` : ""}
      </div>
    `
    : `<span class="muted">${appState.language === "en" ? "No card state flags yet." : "当前还没有置顶或收藏标记。"}</span>`;
  const collectionPillsMarkup = selected.collections.length
    ? selected.collections
        .map((collectionId) => {
          const collection = collections.find((item) => item.id === collectionId);
          if (!collection) return "";
          return `
            <span class="collection-pill removable-collection-pill">
              <span>${collection.name}</span>
              <button type="button" class="pill-remove-button" data-remove-collection="${collection.id}" aria-label="移出合集" title="移出合集">×</button>
            </span>
          `;
        })
        .join("")
    : `<span class="muted">当前未归入任何合集</span>`;
  const collectionMarkup = `
    <div class="detail-collection-stack">
      <div class="detail-collection-list">${collectionPillsMarkup}</div>
      ${
        isCustomResource(selected)
          ? `
            <select class="detail-collection-select" id="detailCollectionSelect">
              ${buildCollectionOptionsMarkup(selected.collections[0])}
            </select>
          `
          : ""
      }
    </div>
  `;
  const relationMarkup = `
    <div class="detail-relation-stack">
      <div class="detail-relation-list">
        ${
          relationEntries.length
            ? relationEntries
                .map((entry) => {
                  const resource = getResourceById(entry.resourceId);
                  if (!resource) return "";
                  return `
                    <span class="tag-pill removable-relation-pill">
                      <span>${resource.title}</span>
                      <span class="relation-type-pill">${t(`relationTypes.${entry.type || "related"}`)}</span>
                      <button type="button" class="pill-remove-button" data-remove-relation="${resource.id}" aria-label="移除关联" title="移除关联">×</button>
                    </span>
                  `;
                })
                .join("")
            : `<span class="muted">${t("noRelatedResources")}</span>`
        }
      </div>
      <div class="detail-relation-controls">
        <select class="detail-collection-select" id="detailRelationSelect">
          <option value="">${t("chooseRelationTarget")}</option>
          ${buildRelationOptionsMarkup(selected.id)}
        </select>
        <select class="detail-collection-select" id="detailRelationTypeSelect">
          ${buildRelationTypeOptionsMarkup("reference")}
        </select>
        <button class="ghost-button compact-button" id="detailAddRelationBtn">${t("addRelation")}</button>
      </div>
    </div>
  `;
  if (isCustomResource(selected)) {
    actionParts.push(`<button class="ghost-button compact-button" id="editCustomCardBtn">${t("detailEdit")}</button>`);
    actionParts.push(
      `<button class="ghost-button compact-button danger-button" id="deleteCustomCardBtn">${t("detailDelete")}</button>`,
    );
  }
  const actionMarkup = `<div class="detail-actions">${actionParts.join("")}</div>`;
  dom.detailTypeBadge.textContent = t(`types.${selected.type}`) || typeMeta[selected.type] || selected.type;
  dom.detailPanel.innerHTML = `
    <article class="detail-block">
      <h2>${highlightText(selected.title, searchTokens)}</h2>
      <p>${highlightText(selected.summary || "", searchTokens)}</p>
      <p>${highlightText(selected.detail || "", searchTokens)}</p>
      ${actionMarkup}
      <div class="detail-meta">
        <div class="detail-meta-row">
          <span>${appState.language === "en" ? "Card State" : "卡片状态"}</span>
          ${stateMarkup}
        </div>
        <div class="detail-meta-row">
          <span>标签</span>
          ${selected.tags.map((tag) => `<span class="tag-pill">#${tag}</span>`).join("")}
        </div>
        <div class="detail-meta-row">
          <span>归属集合</span>
          ${collectionMarkup}
        </div>
        <div class="detail-meta-row detail-meta-row--stack">
          <span>${t("relatedResources")}</span>
          ${relationMarkup}
        </div>
      </div>
    </article>
  `;
  const readerBtn = document.getElementById("openReaderBtn");
  const detailAddWorkspaceBtn = document.getElementById("detailAddWorkspaceBtn");
  const detailExportCardBtn = document.getElementById("detailExportCardBtn");
  const detailPinBtn = document.getElementById("detailPinBtn");
  const detailFavoriteBtn = document.getElementById("detailFavoriteBtn");
  const detailCollectionSelect = document.getElementById("detailCollectionSelect");
  const detailRelationSelect = document.getElementById("detailRelationSelect");
  const detailRelationTypeSelect = document.getElementById("detailRelationTypeSelect");
  const detailAddRelationBtn = document.getElementById("detailAddRelationBtn");
  const removeCollectionButtons = [...document.querySelectorAll("[data-remove-collection]")];
  const removeRelationButtons = [...document.querySelectorAll("[data-remove-relation]")];
  const editBtn = document.getElementById("editCustomCardBtn");
  const deleteBtn = document.getElementById("deleteCustomCardBtn");
  if (readerBtn) readerBtn.addEventListener("click", () => openResourceReader(selected));
  if (detailAddWorkspaceBtn) {
    detailAddWorkspaceBtn.addEventListener("click", (event) => {
      openWorkspacePicker(selected.id, event.currentTarget);
    });
  }
  if (detailExportCardBtn) {
    detailExportCardBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openExportPicker("resource", event.currentTarget);
    });
  }
  if (detailPinBtn) detailPinBtn.addEventListener("click", () => toggleResourcePinned(selected.id));
  if (detailFavoriteBtn) detailFavoriteBtn.addEventListener("click", () => toggleResourceFavorite(selected.id));
  if (detailCollectionSelect) {
    detailCollectionSelect.addEventListener("change", (event) => {
      updateResourceCollection(selected.id, event.target.value);
    });
  }
  if (detailAddRelationBtn) {
    detailAddRelationBtn.addEventListener("click", () => {
      const targetId = detailRelationSelect?.value;
      if (!targetId) return;
      if (!detailRelationTypeSelect?.value) return;
      addResourceRelation(selected.id, targetId);
    });
  }
  removeCollectionButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      await animateCollectionPillRemoval(button);
      removeResourceFromCollection(selected.id, button.dataset.removeCollection);
    });
  });
  removeRelationButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeResourceRelation(selected.id, button.dataset.removeRelation);
    });
  });
  if (editBtn) editBtn.addEventListener("click", () => openEditCardPanel(selected));
  if (deleteBtn) deleteBtn.addEventListener("click", () => deleteCustomCard(selected.id));
  if (animate) {
    triggerStageAnimation(dom.detailPanel);
  }
}

function renderGraph() {
  const selected = getSelectedResource();
  const relatedResources = getRelatedResourceIds(selected).map(getResourceById).filter(Boolean);
  const workspaceIds = new Set(getWorkspaceResourceIds());

  dom.graphStage.innerHTML = "";

  if (!selected) {
    dom.graphStage.innerHTML = `<div class="state-empty">选择一张资源卡后，这里会显示围绕它展开的局部图谱。</div>`;
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
    .filter((resource) => workspaceIds.has(resource.id) && resource.id !== selected.id && !getRelatedResourceIds(selected).includes(resource.id))
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

  dom.graphStage.classList.toggle("is-image-focus-mode", isImageResource(selected));
  dom.graphStage.querySelector(".state-empty")?.remove();
  const svg = ensureGraphSvg(dom.graphStage, cache);
  const orbitLayer = ensureGraphOrbitLayer(dom.graphStage, cache);
  ensureGraphHud(dom.graphStage);

  const center = { x: 50, y: 52 };
  const safeTop = 26;
  const safeBottom = 72;
  const related = graphLegendState.showSecondary
    ? getRelatedResourceIds(selected).map(getResourceById).filter(Boolean)
    : [];
  const activeNodes = new Map([[selected.id, { x: center.x, y: center.y, variant: "primary" }]]);

  orbitLayer.innerHTML = `
    <div class="graph-orbit-ring graph-orbit-ring--inner" style="left:${center.x}%;top:${center.y}%;"></div>
    <div class="graph-orbit-ring graph-orbit-ring--outer" style="left:${center.x}%;top:${center.y}%;"></div>
  `;

  const relatedRadiusX = 28 + Math.min(related.length * 1.8, 10);
  const relatedRadiusY = 21 + Math.min(related.length * 1.4, 8);

  related.forEach((resource, index) => {
    const angle = (-90 + (360 / Math.max(related.length, 1)) * index) * (Math.PI / 180);
    const x = center.x + Math.cos(angle) * relatedRadiusX;
    const rawY = center.y + Math.sin(angle) * relatedRadiusY;
    const y = Math.max(safeTop, Math.min(safeBottom, rawY));
    activeNodes.set(resource.id, {
      x,
      y,
      variant: workspaceIds.has(resource.id) ? "workspace" : "secondary",
      angle,
    });
  });

  const workspaceExtras = graphLegendState.showWorkspace
    ? resources
        .filter((resource) => workspaceIds.has(resource.id) && resource.id !== selected.id && !getRelatedResourceIds(selected).includes(resource.id))
        .slice(0, 3)
    : [];

  workspaceExtras.forEach((resource, index) => {
    const orbitAngles = [150, 30, 210];
    const angle = (orbitAngles[index] || (150 - index * 70)) * (Math.PI / 180);
    const x = center.x + Math.cos(angle) * 40;
    const y = Math.max(safeTop, Math.min(78, center.y + Math.sin(angle) * 30));
    activeNodes.set(resource.id, { x, y, variant: "workspace", angle });
  });

  const stageRect = dom.graphStage.getBoundingClientRect();
  const labelLayouts = resolveLocalGraphLabelLayouts(
    activeNodes,
    center,
    Math.max(stageRect.width, 320),
    Math.max(stageRect.height, 420),
  );

  activeNodes.forEach((config, id) => {
    let node = cache.nodes.get(id);
    const resource = getResourceById(id);
    if (!node) {
      node = document.createElement("button");
      node.className = "graph-node";
      node.addEventListener("mouseenter", () => setGraphHover("local", id));
      node.addEventListener("mouseleave", () => setGraphHover("local", null));
      node.addEventListener("click", () => handleGraphNodeClick(id, node));
      node.addEventListener("dblclick", (event) => {
        event.stopPropagation();
        openResourceReader(resource);
      });
      cache.nodes.set(id, node);
      dom.graphStage.appendChild(node);
    }
    node.className = `graph-node ${config.variant}`;
    node.classList.toggle("is-image-node", isImageResource(resource));
    applyImageNodeAccent(node, resource);
    node.style.left = `${config.x}%`;
    node.style.top = `${config.y}%`;
    const labelConfig = labelLayouts.get(id) || getLocalGraphLabelConfig(config.x, config.y, center, config.variant);
    node.style.setProperty("--label-offset-x", `${labelConfig.offsetX}px`);
    node.style.setProperty("--label-offset-y", `${labelConfig.offsetY}px`);
    node.style.setProperty("--label-scale", String(labelConfig.scale));
    node.style.setProperty("--label-anchor-x", labelConfig.anchorX);
    node.style.setProperty("--label-anchor-y", labelConfig.anchorY);
    node.style.setProperty("--label-text-align", labelConfig.textAlign);
    node.style.setProperty("--label-max-width", labelConfig.maxWidth);
    node.innerHTML = buildLocalGraphNodeMarkup(resource);
  });

  [...cache.nodes.keys()].forEach((id) => {
    if (!activeNodes.has(id)) {
      cache.nodes.get(id)?.remove();
      cache.nodes.delete(id);
    }
  });

  [...cache.lines.keys()].forEach((key) => {
    cache.lines.get(key)?.remove();
    cache.lines.delete(key);
  });

  setGraphHover("local", cache.hoveredId);
}

function syncCardSelectionState() {
  document.querySelectorAll(".resource-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.resourceId === appState.selectedResourceId);
  });
}

function updateSelection(resourceId, sourceEl) {
  if (!resourceId) return;
  touchResourceMeta(resourceId, "lastViewedAt");
  if (resourceId === appState.selectedResourceId) return;
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
  dom.metricLinks.textContent = String(getRelatedResourceIds(selected).length).padStart(2, "0");
}

function bindQuickActions() {
  document.querySelectorAll(".quick-action").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = getSelectedResource();
      const action = button.dataset.action;
      if (!selected) return;

      if (action === "workspace") {
        openWorkspacePicker(selected.id, button);
      } else if (action === "copy") {
        dom.actionFeedback.textContent = `模拟复制：${selected.title} 已准备发送给其他 AI。`;
      } else if (action === "collection") {
        const collectionNames = selected.collections
          .map((collectionId) => collections.find((item) => item.id === collectionId)?.name || "")
          .filter(Boolean)
          .join(" / ");
        dom.actionFeedback.textContent = `「${selected.title}」当前归属：${collectionNames}。`;
      }
    });
  });
}

function bindTopbarActions() {
  dom.searchInput.addEventListener("input", () => {
    renderAll();
    saveUiState();
  });
  dom.searchSortSelect.addEventListener("change", (event) => {
    searchPrefs.sortMode = event.target.value;
    saveSearchPrefs();
    renderAll();
  });
  dom.searchIncludeRawToggle.addEventListener("change", (event) => {
    searchPrefs.includeRawContent = event.target.checked;
    saveSearchPrefs();
    renderSearchToolbar();
    renderAll();
  });
  dom.importParseModeSelect.addEventListener("change", (event) => {
    searchPrefs.importParseMode = event.target.value;
    saveSearchPrefs();
    renderSearchToolbar();
  });
  dom.clearSearchBtn.addEventListener("click", () => {
    dom.searchInput.value = "";
    renderAll();
    saveUiState();
  });

  if (dom.settingsBtn && dom.settingsPopover) {
    dom.settingsBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      setSettingsPopoverOpen(!settingsState.open);
    });

    dom.settingsPopover.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    dom.settingsScrim?.addEventListener("click", () => {
      setSettingsPopoverOpen(false);
    });

    dom.settingsCloseBtn?.addEventListener("click", () => {
      setSettingsPopoverOpen(false);
    });

    dom.settingsLanguageZhBtn?.addEventListener("click", () => {
      setLanguage("zh");
    });

    dom.settingsLanguageEnBtn?.addEventListener("click", () => {
      setLanguage("en");
    });

    dom.settingsFileStorageBtn?.addEventListener("click", () => {
      handleSelectDesktopFileStorageDirectory();
    });

    dom.settingsHardwareAccelerationToggle?.addEventListener("change", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLInputElement)) return;
      setGraphHardwareAccelerationEnabled(target.checked);
    });

    document.addEventListener("click", (event) => {
      if (!settingsState.open) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (dom.settingsPopover.contains(target) || dom.settingsBtn.contains(target)) return;
      setSettingsPopoverOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && settingsState.open) {
        setSettingsPopoverOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (settingsState.open) {
        updateSettingsPopoverMotionOrigin();
      }
    });
  }

  dom.createCardBtn.addEventListener("click", () => {
    toggleCreateCardPanel();
  });

  dom.createCollectionBtn.addEventListener("click", () => {
    toggleCreateCollectionPanel();
  });

  dom.createWorkspaceSlotBtn.addEventListener("click", () => {
    toggleCreateWorkspaceSlotPanel();
  });

  dom.cancelCreateCardBtn.addEventListener("click", () => {
    resetCreateCardForm();
    toggleCreateCardPanel(false);
  });

  dom.cancelCreateCollectionBtn.addEventListener("click", () => {
    resetCreateCollectionForm();
    toggleCreateCollectionPanel(false);
  });

  dom.cancelCreateWorkspaceSlotBtn.addEventListener("click", () => {
    resetCreateWorkspaceSlotForm();
    toggleCreateWorkspaceSlotPanel(false);
  });

  dom.submitCreateCardBtn.addEventListener("click", createCustomCard);
  dom.submitCreateCollectionBtn.addEventListener("click", createCustomCollection);
  dom.submitCreateWorkspaceSlotBtn.addEventListener("click", createWorkspaceSlot);

  dom.cardsViewBtn.addEventListener("click", () => {
    appState.activeView = "cards";
    renderBrowserView();
    dom.resultCountLabel.textContent =
      appState.language === "en"
        ? `${getFilteredResources().length} resource cards`
        : `共 ${getFilteredResources().length} 张资源卡`;
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
    dom.actionFeedback.textContent = `已随机聚焦资源「${next.title}」。`;
    saveUiState();
  });

  dom.resetWorkspaceBtn.addEventListener("click", () => {
    appState.activeCollection = "all";
    appState.activeType = "all";
    appState.activeTag = null;
    dom.searchInput.value = "";
    const baseAssignments = {
      context: ["res-profile-core", "res-brand-brief"],
      engine: ["res-prompt-system", "res-agent-playbook"],
      output: ["res-video-script-pack"],
    };
    appState.workspaceSlots = {};
    getWorkspaceSlotDefinitions().forEach((slot) => {
      appState.workspaceSlots[slot.id] = [...(baseAssignments[slot.id] || [])];
    });
    appState.selectedResourceId = "res-prompt-system";
    setSettingsPopoverOpen(false);
    renderAll();
    dom.actionFeedback.textContent = "已恢复默认工作台编排。";
    saveUiState();
  });

  if (dom.graphRelationModeBtn) {
    dom.graphRelationModeBtn.addEventListener("click", () => {
      toggleGraphRelationMode();
    });
  }

  if (dom.graphRelationTypeSelect) {
    dom.graphRelationTypeSelect.innerHTML = buildRelationTypeOptionsMarkup("reference");
    dom.graphRelationTypeSelect.addEventListener("change", () => {
      if (graphRelationState.active) {
        dom.actionFeedback.textContent = t("graphRelationModeHint");
      }
    });
  }

  document.querySelectorAll("[data-legend-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleGraphLegendFilter(button.dataset.legendFilter);
    });
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

function patchResourceCardCollections(resourceId) {
  const resource = getResourceById(resourceId);
  if (!resource || !dom.resourceGrid) return;
  const cards = [...dom.resourceGrid.querySelectorAll(".resource-card")];
  const card = cards.find((entry) => entry.dataset.resourceId === resourceId);
  if (!card) return;
  const collectionRow = card.querySelector(".collection-row");
  if (!collectionRow) return;
  collectionRow.innerHTML = "";
  resource.collections.forEach((collectionId) => {
    const collection = collections.find((item) => item.id === collectionId);
    if (!collection) return;
    const pill = document.createElement("span");
    pill.className = "collection-pill";
    pill.textContent = collection.name;
    collectionRow.appendChild(pill);
  });
}

function refreshCollectionMutationUi(resourceId = null) {
  const previousSelectedId = appState.selectedResourceId;
  const filtered = getFilteredResources();
  if (filtered.length && !filtered.some((resource) => resource.id === appState.selectedResourceId)) {
    appState.selectedResourceId = filtered[0].id;
  }
  const selectionChanged = previousSelectedId !== appState.selectedResourceId;
  const browserScrollTop = dom.cardsView?.scrollTop ?? 0;
  const collectionScrollTop = dom.collectionList?.scrollTop ?? 0;
  const detailScrollTop = dom.detailPanel?.scrollTop ?? 0;
  const listMembershipCouldChange = appState.activeCollection !== "all";

  if (listMembershipCouldChange) {
    renderResourceGrid();
    if (appState.activeView === "graph" && selectionChanged) {
      renderBrowserGraph();
    }
    renderMetrics();
  } else if (resourceId) {
    patchResourceCardCollections(resourceId);
    syncCardSelectionState();
  }
  if (selectionChanged) {
    renderDetail({ animate: false });
    renderGraphSmooth();
    if (!listMembershipCouldChange) {
      renderMetrics();
    }
  } else if (resourceId) {
    patchDetailCollections(resourceId);
  }
  dom.detailPanel?.classList.remove("is-entering");
  dom.graphStage?.classList.remove("is-entering");

  if (dom.cardsView) dom.cardsView.scrollTop = browserScrollTop;
  if (dom.collectionList) dom.collectionList.scrollTop = collectionScrollTop;
  if (dom.detailPanel) dom.detailPanel.scrollTop = detailScrollTop;
}

async function init() {
  const savedUiState = loadUiState();
  const resourceOverrides = loadResourceOverrides();
  resourceMeta = loadResourceMeta();
  searchPrefs = loadSearchPrefs();
  relationEdges = loadRelationEdges();
  collections = [baseCollections[0], ...loadCustomCollections()];
  if (savedUiState) {
    appState.language = savedUiState.language || appState.language;
    appState.activeCollection = savedUiState.activeCollection || appState.activeCollection;
    appState.activeType = savedUiState.activeType || appState.activeType;
    appState.activeTag = savedUiState.activeTag ?? appState.activeTag;
    appState.activeView = savedUiState.activeView || appState.activeView;
    appState.selectedResourceId = savedUiState.selectedResourceId || appState.selectedResourceId;
    appState.graphGpuAccelerationEnabled =
      savedUiState.graphGpuAccelerationEnabled !== false;
    if (savedUiState.workspaceSlots) {
      appState.workspaceSlots = savedUiState.workspaceSlots;
    }
    if (Array.isArray(savedUiState.customWorkspaceSlots)) {
      const savedDefinitions = savedUiState.customWorkspaceSlots.filter(
        (slot) =>
          slot &&
          typeof slot.id === "string" &&
          typeof slot.label === "string" &&
          typeof slot.description === "string",
      );
      if (savedDefinitions.some((slot) => !slot.id.startsWith("custom-slot-"))) {
        appState.customWorkspaceSlots = savedDefinitions;
      } else {
        appState.customWorkspaceSlots = [
          ...DEFAULT_WORKSPACE_SLOT_DEFS.map((slot) => ({ ...slot })),
          ...savedDefinitions,
        ];
      }
    }
  }
  if (!appState.customWorkspaceSlots.length) {
    appState.customWorkspaceSlots = DEFAULT_WORKSPACE_SLOT_DEFS.map((slot) => ({ ...slot }));
  }
  appState.customWorkspaceSlots.forEach((slot) => {
    if (!appState.workspaceSlots[slot.id]) {
      appState.workspaceSlots[slot.id] = [];
    }
  });
  resources = [
    ...baseResourceBlueprints.map((resource) => ({
      ...resource,
      tags: [...resource.tags],
      collections: [...resource.collections],
      related: [...resource.related],
    })),
    ...loadCustomResources(),
  ];
  applyResourceOverrides(resourceOverrides);
  populateCreateCollectionOptions();
  resetCreateCardForm();
  resetCreateCollectionForm();
  resetCreateWorkspaceSlotForm();
  dom.createCardPanel.classList.add("is-hidden");
  dom.createCollectionPanel.classList.add("is-hidden");
  dom.createWorkspaceSlotPanel.classList.add("is-hidden");
  if (savedUiState?.searchValue) {
    dom.searchInput.value = savedUiState.searchValue;
  }
  renderProject();
  bindQuickActions();
  bindTopbarActions();
  bindGraphProximity(dom.resourceMap, "browser");
  bindGraphProximity(dom.graphStage, "local");
  bindCardProximity();
  bindReaderInteractions();
  bindWorkspacePickerInteractions();
  bindGraphPreviewInteractions();
  bindExportPickerInteractions();
  bindFileImport();
  await bindDesktopNativeFileDrop();
  await initializeDesktopFileStorage();
  applyLanguage();
  renderSearchToolbar();
  applyGraphRelationModeUi();
  renderGraphLegendButtons();
  renderAll();
}

init().catch((error) => {
  console.error(error);
});
