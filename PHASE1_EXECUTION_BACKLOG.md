# ImproveMAX Phase 1 Execution Backlog

This backlog turns the next-phase plan into implementation-ready work items for the current codebase.

Primary implementation target:

- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\script.js`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\index.html`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\styles.css`

Secondary sync target after demo stabilizes:

- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\script.js`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\index.html`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\styles.css`

## Release Goal

Ship a stable "resource organization MVP" without breaking:

- card CRUD
- collection CRUD
- workspace slot CRUD
- drag/drop
- markdown import
- reader overlay
- graph views
- persistence
- zh/en toggle

## Workstream A: Search 2.0

## A1. Search model expansion

### Goal

Expand the current search from basic string matching into a derived multi-surface search model.

### Current anchors

- `getFilteredResources()`
- `getSearchTokens()`
- `matchesSearchTokens()`
- `buildResourceSearchFields()`
- `buildSearchSnippet()`
- `renderResourceGrid()`
- `renderDetail()`

### Planned changes

1. Include workspace slot labels and membership in search fields.
2. Separate search matching from display sorting.
3. Add search preference state:
   - default sort
   - whether to include raw content
   - whether to search only current collection or all visible data

### New storage

- `resourceWorkbench.searchPrefs.v1`

### Acceptance

- Searching by collection name, slot label, raw markdown content, and card title all works.
- Search snippets appear when query exists.
- Search highlight appears on card snippet and detail panel.

## A2. Search result toolbar

### Goal

Add visible controls for result ordering and search context.

### Current anchors

- `searchInput`
- `resource-browser__header`
- `renderMetrics()`

### Planned UI

Add a compact toolbar near the browser header with:

- sort selector
- match count
- clear search button
- optional toggle for raw-content search

### Acceptance

- Result count updates live.
- Sort changes do not break active filters.
- Toolbar labels go through the translation layer.

## A3. Focus and jump behavior

### Goal

Make search feel navigable, not just filter-based.

### Current anchors

- `selectedResourceId`
- `renderDetail()`
- `renderGraphSmooth()`
- `openResourceReader()`

### Planned changes

1. Selecting a filtered card should always focus detail and local graph.
2. Keyboard-friendly result navigation should be possible later.
3. Search state should survive refresh through `uiState`.

### Acceptance

- Clicking a result always updates card selection, detail panel, and graph.
- After refresh, the active query and selected resource remain coherent.

## Workstream B: Card Organization

## B1. Resource meta store

### Goal

Add lightweight organizational metadata without mutating the built-in resource structure.

### New storage

- `resourceWorkbench.resourceMeta.v1`

### Suggested fields

```json
{
  "res-id": {
    "pinned": false,
    "favorite": false,
    "lastViewedAt": null,
    "lastEditedAt": null,
    "lastUsedAt": null
  }
}
```

### Current anchors

- `saveUiState()`
- `saveCustomResources()`
- `loadUiState()`
- current add-to-workspace and edit flows

### Acceptance

- Meta persists across refresh.
- Missing meta records do not break old resources.

## B2. Pin and favorite controls

### Goal

Add obvious card organization actions.

### Current anchors

- `resourceCardTemplate`
- `renderResourceGrid()`
- `renderDetail()`

### Planned UI

1. Card-level actions:
   - pin
   - favorite
2. Detail-level actions:
   - pin
   - favorite

### Acceptance

- Toggling pin/favorite updates card ordering immediately.
- Actions are available from both card and detail surfaces.

## B3. Sort model

### Goal

Support useful ordering before manual drag sorting.

### Sort modes for Phase 1

- relevance
- pinned first
- favorites first
- recent edit
- recent use

### Deferred

- manual drag sort
- cross-view persistent manual ordering

### Acceptance

- Sorting is deterministic.
- Sorting works together with active search, collection, type, and tag filters.

## Workstream C: Typed Relation Editing MVP

## C1. Relation edge store

### Goal

Add explicit editable relations without breaking current `related: string[]`.

### New storage

- `resourceWorkbench.relationEdges.v1`

### Suggested shape

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

### Relation types for MVP

- `dependency`
- `similar`
- `upstream`
- `downstream`
- `reference`

### Compatibility rule

Graph and detail views should merge:

- existing static `related`
- reverse static relation
- explicit typed edges

### Acceptance

- Old cards still render with no migration.
- New typed edges persist and load correctly.

## C2. Relation management UI

### Goal

Allow users to manage relations from the detail panel first.

### Current anchors

- `renderDetail()`
- selected resource state
- graph rerender functions

### Planned UI

Inside the detail panel:

- relation section
- add relation button
- target selector or action flow
- type badge
- remove relation action

### Acceptance

- Relation add/remove works without refresh.
- New relations appear in both detail and graph views.

## C3. Graph relation reflection

### Goal

Show explicit relations consistently in browser graph and local graph.

### Current anchors

- `renderBrowserGraph()`
- `renderGraphSmooth()`
- `getRelatedResourceIds()`

### Planned changes

1. Extend relation resolution helpers.
2. Make graph edge styling relation-aware later.
3. Keep layout logic untouched in this phase unless necessary.

### Acceptance

- Typed relations appear as graph connections.
- Graph does not regress in hover, focus, or stage animation behavior.

## Workstream D: Export Polish

## D1. Single-card export

### Goal

Add export for one selected resource.

### Current anchors

- `exportCurrentCollection()`
- `exportCurrentWorkspace()`
- `buildResourceMarkdown()`
- `formatResourceExport()`

### Planned changes

1. Add `exportCurrentResource(format)`.
2. Add action in detail panel.
3. Include imported raw markdown when available.

### Acceptance

- Single-card export works in Markdown and JSON.
- Exported file is readable without app context.

## D2. Metadata and relation export

### Goal

Make export capture the new organization layer.

### Included payload

- pin / favorite
- source type
- file name
- typed relations
- current collection names

### Acceptance

- Collection and workspace exports include new metadata cleanly.
- Export remains compatible for old resources with no meta.

## Workstream E: Regression Baseline

## E1. Manual regression checklist

### Goal

Create a repeatable checklist before deeper implementation starts.

### Required paths

1. Create card
2. Edit card
3. Delete card
4. Create collection
5. Edit collection
6. Delete collection
7. Create workspace slot
8. Add to workspace
9. Drag into collection
10. Remove from workspace
11. Import markdown
12. Open reader
13. Switch graph/cards view
14. Search and focus result
15. Export card
16. Export collection
17. Export workspace
18. Add relation
19. Refresh and validate persistence
20. Toggle zh/en

## E2. Playwright promotion candidates

Convert these first after UI settles:

1. card CRUD
2. markdown import
3. relation add/remove
4. export actions
5. persistence after refresh

## Suggested Sprint Cut

## Sprint 1A

Build the safest foundation first:

1. Search model expansion
2. Search result toolbar
3. Resource meta store
4. Pin / favorite actions
5. Manual regression checklist

## Sprint 1B

Then add the riskier but still Phase 1-safe features:

1. Typed relation edge store
2. Detail-panel relation editing
3. Graph relation reflection
4. Single-card export
5. Metadata-aware collection/workspace export

## Deferred Tickets

These should not enter the current sprint:

- multi-select batch management
- txt/pdf/docx/image/link import expansion
- manual card order drag sorting
- editable graph layout persistence
- multi-project workspace system
- undo / trash / history

## File Ownership Recommendation

If work is split among agents, use this ownership pattern:

1. Search and organization
   - `resource-workbench-demo/script.js`
   - `resource-workbench-demo/index.html`
   - `resource-workbench-demo/styles.css`
2. Relation and graph reflection
   - `resource-workbench-demo/script.js`
   - `resource-workbench-demo/styles.css`
3. Export and regression
   - `resource-workbench-demo/script.js`
   - validation docs or tests added nearby
4. Desktop-shell sync after demo stabilization
   - `resource-workbench-app/ui/*`

## Immediate Next Action

Start implementation with this sequence:

1. add `searchPrefs` and `resourceMeta` storage
2. wire pin / favorite / recency
3. upgrade search display and sorting
4. add `relationEdges` storage
5. expose relation editing in detail panel
6. add single-card export
7. run regression pass
