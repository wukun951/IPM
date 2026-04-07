# ImproveMAX Product Optimization Agent Group

## Purpose

This agent group is for improving the ImproveMAX product itself, not for building in-product multi-agent features.

Product target:
- Resource workbench
- Card system
- Collections
- Workspace slots
- Graph views
- Markdown import and reader
- Interaction polish

Code focus:
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\index.html`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\styles.css`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-demo\script.js`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\index.html`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\styles.css`
- `E:\AIGC\promptagent\ImproveMAX\resource-workbench-app\ui\script.js`

## Core Agents

### 1. Total Orchestrator Agent
- Role: break down goals, decide which agents to activate, merge outputs
- Focus: task routing, phase planning, risk tracking, final synthesis

### 2. Product Planning Agent
- Role: decide priority, scope, MVP boundaries
- Focus: what to build now vs later, avoid feature drift

### 3. Information Architecture Agent
- Role: keep cards, collections, workspace, graph, search, export coherent
- Focus: object model, field structure, page hierarchy

### 4. UX Diagnosis Agent
- Role: identify friction, confusion, heavy flows
- Focus: real usage pain points, mental load, discoverability

### 5. Interaction and Motion Agent
- Role: improve drag, hover, transitions, graph feel, micro-feedback
- Focus: responsiveness, delight, visual clarity in motion

### 6. Frontend Architecture Agent
- Role: control technical debt and structure
- Focus: state boundaries, rendering boundaries, future modularization

### 7. Verification and Regression Agent
- Role: verify user flows and prevent regressions
- Focus: smoke paths, persistence checks, drag/drop checks, editing/deletion checks

## Optional Agents

### Graph and Visualization Agent
- Focus: graph editing, node layout, performance, readability

### Import and Export Agent
- Focus: md/pdf/docx/link import and collection/workspace export

## Operating Rule

Do not spawn all agents with full thread context.

Use this pattern instead:
1. Summarize the current task in 5-12 lines.
2. Activate only 2-3 agents relevant to the task.
3. Pass the summary plus exact file paths.
4. Avoid `fork_context=true` unless absolutely required.
5. Prefer short, role-specific prompts over full history.

## Recommended Activation Patterns

### For feature prioritization
- Total Orchestrator Agent
- Product Planning Agent
- UX Diagnosis Agent

### For structural redesign
- Total Orchestrator Agent
- Information Architecture Agent
- Frontend Architecture Agent

### For interaction polishing
- Total Orchestrator Agent
- Interaction and Motion Agent
- UX Diagnosis Agent

### For implementation with safety
- Total Orchestrator Agent
- Frontend Architecture Agent
- Verification and Regression Agent

### For graph improvements
- Total Orchestrator Agent
- Graph and Visualization Agent
- Verification and Regression Agent

### For import/export pipeline
- Total Orchestrator Agent
- Import and Export Agent
- Frontend Architecture Agent

## Immediate Working Principle

For this thread, because history is long, use lean task briefs.

Recommended brief template:

```text
Task:
Current goal:
Files in scope:
What already exists:
What must not break:
Expected output:
```

## Current Product State Snapshot

- Cards: create, edit, delete
- Collections: create, edit, delete
- Workspace slots: create, edit, delete
- Add cards to selected workspace slot
- Drag cards into collections
- Remove card from collection
- Markdown import to document cards
- Reader overlay for all cards
- Browser graph and local graph
- UI persistence across refresh
- Chinese/English toggle

## Caution

- `script.js` is large and mixed-responsibility
- Persistence and drag/drop regress easily
- Interaction changes should always be followed by regression verification
