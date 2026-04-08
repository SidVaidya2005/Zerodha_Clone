# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and environment variable setup.

## Commands

```bash
npm start        # dev server (CRA, port 3000)
npm run build    # production build
npm test         # run tests (Jest + React Testing Library)
npm test -- --testPathPattern=MyComponent   # run a single test file
```

## Architecture

Standard Create React App. Entry point is `src/index.js`, which renders `AppLayout` — a `BrowserRouter` wrapping a shared `Navbar` + `Footer` with page routes in between.

### Theme System

`AppLayout` in `src/index.js` manages a three-state theme (`"light"`, `"dark"`, `"system"`) persisted to `localStorage` under the key `"zerodha-theme-mode"`. The resolved theme is written as a `data-theme` attribute on `<html>`. CSS should use `[data-theme="dark"]` selectors. System theme listens for `prefers-color-scheme` media query changes.

### Routes

| Path | Component |
|---|---|
| `/` | `HomePage` |
| `/signup` | `Signup` |
| `/about` | `AboutPage` |
| `/product` | `ProductPage` |
| `/pricing` | `PricingPage` |
| `/support` | `SupportPage` |
| `*` | `NotFound` |

All pages live under `src/landing_page/`. Each route has its own subdirectory except `Navbar`, `Footer`, and `NotFound` which sit directly in `src/landing_page/`.

### API / Config

`src/config.js` exports two values:
- `BACKEND_URL` — defaults to `http://localhost:3002`; override via `REACT_APP_API_URL`
- `DASHBOARD_URL` — defaults to the hardcoded Render deployment URL; override via `REACT_APP_DASHBOARD_URL`

The frontend does not use axios — fetch or direct links are used for any backend interaction.
