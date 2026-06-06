# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zerodha-inspired trading platform clone with three independently-runnable apps sharing one MongoDB database. Each app has its own `CLAUDE.md` with specific guidance:

- [backend/CLAUDE.md](backend/CLAUDE.md) — Express REST API (port 3002), layered as `routes/` → `controllers/` → `services/`.
- [frontend/CLAUDE.md](frontend/CLAUDE.md) — Public/marketing React app (port 3000).
- [dashboard/CLAUDE.md](dashboard/CLAUDE.md) — Trading dashboard React app (port 3004) + Twelve Data proxy server (port 3001, same process via `npm run dev`).

## Conventions

Key conventions across the apps (each app's `CLAUDE.md` has the specifics):

- **Architecture** — backend layers (`routes/` → `controllers/` → `services/`), the 5-file CSS split, `src/data/` for hardcoded content, dashboard role-grouped folders, shared-token mirroring.
- **Code style** — 150-LOC component threshold, hooks own all side effects, named-function controller exports, backend CJS vs CRA ESM.
- **UI style** — CSS selector routing across the 5 files and a fixed `@import` cascade order. Light theme only — no dark mode (`data-theme` / `prefers-color-scheme`).

## Running the project

Each app runs in a separate terminal from its own directory:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start

# Terminal 3
cd dashboard && npm run dev    # starts both React app + proxy server
```

## System architecture

```
frontend (React, port 3000)
    └── calls backend directly

dashboard (React, port 3004 in dev)
    ├── calls backend (port 3002) for holdings, positions, orders
    └── calls proxy server (port 3001) for live stock prices

proxy server (Express, port 3001) — dashboard/server.js
    └── fetches from Twelve Data (requires TWELVEDATA_API_KEY) for NSE/BSE quotes

backend (Express, port 3002)
    └── routes → controllers → services → MongoDB (Mongoose)
```

## Tooling

Lint configuration lives in a single root `.eslintrc.json` with two override blocks (Node CJS for `backend/**` + `dashboard/server.js`; CRA `react-app` for `frontend/src/**` + `dashboard/src/**`). The root `package.json` holds `eslint` + `eslint-config-prettier` + `eslint-config-react-app` as devDependencies — run `npm install` at the repo root once after cloning.

CRA's build-time ESLint pass is disabled (`DISABLE_ESLINT_PLUGIN=true` in the `start`/`build` scripts) to avoid a `react-app` preset double-load. **`npm run lint` is the lint gate; `npm run build` no longer lints inline.** Run it explicitly in each app before committing.

## Design tokens

`shared/tokens.css` at the repo root is the canonical token reference. CRA can't `@import` outside `src/`, so each app keeps a byte-identical copy at `frontend/src/styles/tokens.css` and `dashboard/src/styles/tokens.css`. **Token changes update all three files in the same commit.** Sanity check: `diff shared/tokens.css <app>/src/styles/tokens.css` must exit 0.

## Environment variables

### `backend/.env`
```
PORT=3002
MONGO_URL=<mongodb connection string>
NODE_ENV=development
JWT_SECRET=<random string — e.g. `openssl rand -hex 32`>
GOOGLE_CLIENT_ID=<from Google Cloud Console — Web application OAuth client>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_REDIRECT_URI=http://localhost:3002/auth/google/callback
FRONTEND_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3004
```

`JWT_SECRET` is **required** — `authService` throws if unset. The three `GOOGLE_*` values are **required** for login — `googleAuthService` throws if any is unset, and `GOOGLE_REDIRECT_URI` must be registered verbatim in the Google Cloud Console and match the `/auth/google/callback` route. `FRONTEND_URL` + `DASHBOARD_URL` form the CORS allowlist for credentialed requests (cookies) and are also the post-OAuth redirect targets (dashboard on success, frontend `/login` on error); browsers reject wildcard origins for credentialed CORS.

### `frontend/.env.local`
```
REACT_APP_BACKEND_URL=http://localhost:3002
```

### `dashboard/.env.local`
```
REACT_APP_BACKEND_URL=http://localhost:3002
REACT_APP_PROXY_URL=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000
```

In production, all three `REACT_APP_*_URL` values must be set explicitly. `BACKEND_URL` and `PROXY_URL` fall back to same-origin (empty string); `FRONTEND_URL` does not — it's where unauthenticated users get bounced to `/login`, and an empty value silently breaks the auth gate. All three log a warning if missing.
