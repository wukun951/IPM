# ImproveMAX Next Phase Iteration Plan

## Scope

This plan applies only to the ImproveMAX product line:

- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\index.html`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\styles.css`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\script.js`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\index.html`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\styles.css`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\script.js`

This plan does not cover the old Prompt Assistant desktop app.

## Team Model

ImproveMAX adopts a fixed `7+2` agent roster:

### Core 7

1. Total Orchestrator Agent
2. Product Planning Agent
3. UX Diagnosis Agent
4. Information Architecture Agent
5. Frontend Architecture Agent
6. Interaction and Motion Agent
7. Verification and Regression Agent

### Optional 2

8. Graph and Visualization Agent
9. Import and Export Agent

## Activation Rule

Do not activate all `9` agents at once.

Recommended active set by current stage:

- Current stage: `Total Orchestrator + Product Planning + Information Architecture + Verification and Regression`
- Search-heavy work: add `UX Diagnosis`
- Graph-heavy work: replace one of the above with `Graph and Visualization`
- Import/export-heavy work: replace one of the above with `Import and Export`

## Current Product Baseline

The current implementation already supports:

- Resource cards: create, edit, delete
- Collections: create, edit, delete
- Workspace slots: create, edit, delete
- Drag cards into collections and workspace slots
- Markdown import as document cards
- Reader overlay for all cards
- Browser graph and local graph
- Collection and workspace export
- UI persistence through `localStorage`
- Chinese / English toggle

Important current anchors in `script.js`:

- `STORAGE_KEYS`
- `baseResources`
- `DEFAULT_WORKSPACE_SLOT_DEFS`
- `getFilteredResources()`
- `openResourceReader()`
- `importMarkdownFiles()`
- `exportCurrentCollection()`
- `exportCurrentWorkspace()`
- `saveUiState()`
- `saveCustomResources()`
- `saveCustomCollections()`
- `saveResourceOverrides()`
- `renderBrowserGraph()`
- `renderGraphSmooth()`

## Product Principle For This Phase

The next phase should improve organization and retrieval before adding heavier system layers.

That means:

1. Strengthen search.
2. Strengthen card organization.
3. Make relations explicit and editable.
4. Make export reliable and useful.
5. Add regression safety before expanding file types or project layers.

## Phase Breakdown

## Phase 1: Resource Organization MVP

This is the immediate implementation phase.

### Goals

- Make large resource sets searchable and manageable.
- Make card relationships explicit instead of mostly passive.
- Make export reliable enough for production use.
- Keep the current object model stable enough to avoid migration chaos.

### Included Features

1. Search 2.0
2. Card organization: pin, favorite, recency sorting
3. Typed relation editing MVP
4. Export polish
5. Regression baseline

### Explicitly Deferred From Phase 1

- Multi-project system
- Trash / undo / history
- Full graph editor
- PDF / DOCX deep parsing
- Large-scale architecture rewrite

## Phase 1.1: Search 2.0

### User-Facing Capabilities

- Unified search over:
  - title
  - tags
  - summary
  - detail
  - raw imported content
  - collection names
  - workspace slot names
- Result highlight
- Jump from result to card and detail panel
- Sort results by relevance, pinned, favorite, recent

### Data Strategy

Do not redesign the resource shape yet.

Use derived search fields built from existing resource fields plus workspace membership.

Recommended additions:

- `resourceWorkbench.searchPrefs.v1`
  - `sortMode`
  - `includeRawContent`
  - `scope`

This avoids mutating all existing resource records just to support search behavior.

### UI Entry Points

- Expand the existing top search field into a stronger search result state.
- Add a compact result toolbar near the resource browser:
  - sort selector
  - search scope hint
  - clear filters action
- Add visible search snippets on matching cards when query exists.

### Acceptance Criteria

- Search can find a resource by title, tag, detail text, imported markdown body, collection name, and slot membership.
- Matching terms are highlighted in at least card snippets and detail panel content.
- Clicking a search result focuses the card, detail panel, and graph consistently.
- Search state survives refresh if a query is active.

## Phase 1.2: Card Organization

### User-Facing Capabilities

- Pin card
- Favorite card
- Sort by:
  - pinned first
  - favorites first
  - recent edit
  - recent use
  - manual order inside current view later

### Data Strategy

Avoid bloating the base resource schema.

Recommended new storage key:

- `resourceWorkbench.resourceMeta.v1`

Suggested shape:

```json
{
  "res-id": {
    "pinned": true,
    "favorite": false,
    "lastViewedAt": "2026-03-27T10:30:00.000Z",
    "lastEditedAt": "2026-03-27T10:35:00.000Z",
    "lastUsedAt": "2026-03-27T10:38:00.000Z"
  }
}
```

Why separate storage:

- Compatible with existing resources and imported cards
- Avoids rewriting the built-in `baseResources`
- Allows gradual rollout

### UI Entry Points

- Card top area: pin and favorite actions
- Detail panel: same actions for clarity
- Result toolbar: sort selector

### Acceptance Criteria

- Pin and favorite persist across refresh.
- Recent view and recent use update from real actions, not just from card creation.
- Sorting is stable across cards and imported documents.
- Existing CRUD and drag/drop flows continue to work.

## Phase 1.3: Typed Relation Editing MVP

### User-Facing Capabilities

- Manually link two cards
- Set relation type:
  - `dependency`
  - `similar`
  - `upstream`
  - `downstream`
  - `reference`
- Remove a relation
- Reflect explicit relations in detail panel and graph

### Data Strategy

Do not replace the current `related: string[]` immediately.

Recommended new storage key:

- `resourceWorkbench.relationEdges.v1`

Suggested edge shape:

```json
[
  {
    "id": "edge-001",
    "from": "res-a",
    "to": "res-b",
    "type": "reference",
    "createdAt": "2026-03-27T10:40:00.000Z"
  }
]
```

Compatibility rule:

- Existing `related` arrays remain valid.
- Graph rendering should merge:
  - static `related`
  - reverse `related`
  - explicit typed edges

This keeps current data working while enabling richer relations.

### UI Entry Points

- Detail panel:
  - `Add relation` action
  - relation list with type badges and remove action
- Optional fast path:
  - from selected card to another visible card via action menu

### Acceptance Criteria

- User can add and remove relations without refreshing.
- Graph updates after relation edits.
- Explicit typed relations persist across refresh.
- Older resources without typed relations still render correctly.

## Phase 1.4: Export Polish

Export already exists, so the goal is consistency and production readiness.

### Included Work

- Keep single collection export
- Keep workspace export
- Add single-card export
- Make relation and metadata export consistent
- Make imported markdown content export cleanly

### Data Strategy

Reuse current export functions.

Expand export payload to include:

- meta flags: pin, favorite, recency
- typed relations
- source type
- file name for imported resources

### Acceptance Criteria

- Single resource export works in Markdown and JSON.
- Collection export includes typed relations and card metadata.
- Workspace export preserves slot grouping.
- Exported markdown is readable without app context.

## Phase 1.5: Regression Baseline

No phase should ship without a regression floor.

### Minimum Smoke Paths

1. Create card
2. Edit card
3. Delete card
4. Create collection
5. Edit collection
6. Delete collection
7. Create workspace slot
8. Add card to workspace
9. Drag card into collection
10. Remove card from workspace
11. Import markdown
12. Open reader
13. Switch card / graph views
14. Search and focus result
15. Refresh and confirm persistence
16. Toggle zh/en
17. Export card / collection / workspace
18. Add typed relation and verify graph update

### Tooling Direction

- Start with a manual regression checklist if needed.
- Promote the stable paths into Playwright once UI surfaces stop shifting.

## Phase 2: Scale-Up Management

Only start after Phase 1 is stable.

### Included Features

1. Batch management
   - multi-select
   - batch add to collection
   - batch add to workspace
   - batch tag operations
2. Expanded file resources
   - `txt`
   - `pdf`
   - `docx`
   - images
   - link cards
3. Search enhancement
   - stronger filters
   - better result grouping
   - result-side actions

### Warning

Do not combine `batch selection` and `deep architecture refactor` in the same iteration.

## Phase 3: Project System Layer

Only start after the organization layer feels reliable.

### Included Features

1. Editable graph
   - drag and pin nodes
   - manual line creation
   - saved graph layout
2. Multi-project workbench
   - multiple projects
   - per-project workspaces
   - per-project resource subsets
   - project notes / status / timeline
3. Safety layer
   - undo
   - trash
   - edit history

## Recommended Implementation Order

Follow this order to reduce breakage:

1. Search result model and search UI state
2. Resource meta storage for pin / favorite / recency
3. Single-card export using current resource shape
4. Typed relation edge store
5. Graph merge logic for typed relations
6. Regression smoke coverage
7. Batch operations
8. Expanded file imports
9. Editable graph
10. Multi-project layer
11. Trash / history / undo

## Risks To Avoid

1. Do not redesign all entities before Search 2.0 ships.
2. Do not make graph editable before the relation model is stable.
3. Do not mutate current localStorage structures without a fallback path.
4. Do not combine drag/drop redesign with batch management in one pass.
5. Do not spread bilingual text changes outside the translation layer.
6. Do not rewrite `script.js` before feature behavior is validated.

## Compatibility Rules

Every new capability in Phase 1 should prefer additive storage over destructive migration.

Recommended new keys:

- `resourceWorkbench.searchPrefs.v1`
- `resourceWorkbench.resourceMeta.v1`
- `resourceWorkbench.relationEdges.v1`

Current keys that must remain readable:

- `resourceWorkbench.customResources.v1`
- `resourceWorkbench.customCollections.v1`
- `resourceWorkbench.resourceOverrides.v1`
- `resourceWorkbench.uiState.v1`

## Definition Of Done For Phase 1

Phase 1 is complete only if all of the following are true:

1. Search can find and highlight real content across current resource surfaces.
2. Pin and favorite are implemented and persisted.
3. Typed relations can be added, removed, persisted, and shown in graph/detail views.
4. Single-card export is added and collection/workspace export remains stable.
5. Existing CRUD, import, drag/drop, reader, graph, and bilingual flows still work after refresh.
6. There is a written regression checklist and at least a minimum repeatable validation pass.
