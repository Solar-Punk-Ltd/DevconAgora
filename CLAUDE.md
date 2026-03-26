# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 5173

# Build
npm run build        # TypeScript type-check + Vite production build
npm run preview      # Preview production build locally
npm run clean        # Remove ./dist

# Code quality (lint enforces max-warnings 0 — zero warnings allowed)
npm run lint         # ESLint check on .ts/.tsx files
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier format entire codebase
npm run format:check # Validate Prettier formatting
```

There is no test runner configured.

## Environment Setup

Copy `.env.sample` to `.env` and populate:
- `BEE_API_URL` — Swarm Bee node endpoint
- `FEED_OWNER_ADDRESS` — Owner address of the public Swarm feed containing conference data
- `STAMP` — Postage stamp for uploads
- `SWARM_ID_IFRAME_ORIGIN` — Origin of the Swarm-ID iframe (e.g. `http://localhost:5174`)
- `SWARM_ID_IFRAME_PROXY_PATH` — Path to the iframe proxy
- `ENV` — Environment suffix used to differentiate feed topics
- `BASE_URL` — Deployment base path (affects router basename)

Set `SWARM=true` to switch from `BrowserRouter` to `HashRouter` (required for Swarm deployment).

## Architecture

### What This Is

A decentralized PWA for Devcon conference attendees. Data (agenda, comments, user profiles) lives on **Ethereum Swarm** — a censorship-resistant distributed storage network — rather than a centralized backend. There is no traditional REST API.

### Tech Stack

React 19 + TypeScript (strict) + Vite, React Router DOM 7, SCSS, `@ethersphere/bee-js` (Swarm Bee SDK), `@solarpunkltd/swarm-comment-js` (comment system), `ethers` 6 for crypto keys, and a local monorepo dependency `swarm-id`.

### State Management

Two React Contexts wrap the entire app (`src/App.tsx`):

- **`GlobalStateContext`** (`src/contexts/global.tsx`) — sessions (agenda), spaces (discussion categories), preloaded comments (`loadedTalks`, `loadedSpaces`), activity counts, personal notes, UI filters (day/category).
- **`UserContext`** (`src/contexts/user.tsx`) — authentication, Swarm-ID client lifecycle, crypto keys, upload capability (`canUpload` requires a valid postage stamp).

All data fetching goes through custom hooks that populate these contexts — there is no Redux, Zustand, or similar library.

### Authentication (Two Modes — Active Migration)

The app is mid-migration from a legacy auth system to **Swarm-ID**:

- **Legacy**: Generates a local keypair stored in session storage; `username` set manually.
- **Phase 2 (current)**: `SwarmIdClient` is initialized via an iFrame proxy (`SWARM_ID_IFRAME_ORIGIN`). When `isSwarmEnabled` is true, user identity comes from the Swarm-ID client. Keys are **not** directly exposed to the app.
- **Phase 3/4 (upcoming)**: Full migration — all Bee SDK calls replaced with `SwarmIdClient` equivalents.

The adapter in `src/utils/swarmId.ts` mirrors the `src/utils/bee.ts` interface so callers can conditionally use either backend. Hooks check `isSwarmEnabled` to pick the right code path.

### Data Flow

1. **Session data**: `useSessionData` hook polls a Swarm feed every 5 minutes, parses Pretalx-format JSON, stores as `Map<string, Session[]>` keyed by day in global state.
2. **Comments**: `useSwarmComment` wraps `@solarpunkltd/swarm-comment-js`. `usePreload` eagerly loads comments for current-time-slot sessions (max 15) and all spaces. Comment events (`MESSAGE_RECEIVED`, `MESSAGE_UPLOADED`, `ERROR`) update `loadedTalks`/`loadedSpaces` in global state.
3. **Notes**: `useNotes` hook persists personal notes locally; stored in global `notes` state.

### Routing

`src/router.tsx` defines all routes. Router type is conditionally `BrowserRouter` or `HashRouter` based on the `SWARM` env var. `useRouteProtection` guards pages that require authentication/onboarding completion.

### Key Paths

| Path | Purpose |
|------|---------|
| `src/contexts/` | Global state + user auth — start here for data model |
| `src/hooks/` | All data fetching and business logic |
| `src/utils/bee.ts` | Direct Bee SDK interaction (legacy) |
| `src/utils/swarmId.ts` | SwarmIdClient adapter (new path) |
| `src/types/` | Core TypeScript interfaces (Session, Space, TalkComments, etc.) |
| `src/constants/` | Routes, categories, app-wide config values |

### TypeScript

Strict mode is fully enabled including `noUnusedLocals` and `noUnusedParameters`. Path alias `@/*` maps to `src/*`. ESLint enforces zero warnings — the build will fail if any linting warnings exist.
