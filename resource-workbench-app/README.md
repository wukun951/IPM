# Resource Workbench Desktop

This folder wraps the current `resource-workbench-demo` frontend into a Tauri desktop shell.

## Prerequisites

- Node.js 20+
- Rust toolchain with Cargo
  - Install from [https://rustup.rs](https://rustup.rs)

## First Run

1. Open a terminal in this folder.
2. Install frontend dev tooling:

```powershell
npm install
```

3. Start the desktop shell in development mode:

```powershell
npm run tauri:dev
```

## Build

```powershell
npm run tauri:build
```

## Structure

- `ui/`: current static frontend assets
- `src-tauri/`: Rust desktop shell
