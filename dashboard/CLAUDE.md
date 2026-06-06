# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and the shared conventions summarized below.

## Commands

```bash
npm run dev      # start both React app + proxy server (recommended)
npm start        # React app only (no live prices without proxy)
npm run server   # proxy server only (port 3001)
npm run build    # production build (ESLint plugin disabled)
npm test         # Jest + React Testing Library
npm run lint     # ESLint over src + server.js (uses the root .eslintrc.json)
npm run format   # prettier --write
```

CRA's webpack ESLint pass is disabled via `DISABLE_ESLINT_PLUGIN=true` in the `start`/`build` scripts. Run `npm run lint` explicitly before committing.

**Known lint warnings (don't "fix" without ask):** 1 `react-hooks/exhaustive-deps` in `hooks/useApiData.js` (intentional) + 1 unused `err` at `server.js:20`. Pre-existing and tolerated.

## Architecture

Two processes:

1. **React app** (`src/`) — the trading dashboard UI.
2. **Proxy server** (`server.js`) — Express on port 3001 wrapping Yahoo Finance for live NSE/BSE prices.

`npm run dev` starts both via `concurrently`.

### Source tree (role-grouped, NOT a flat `components/` folder)

```
src/
  index.js          imports ./styles/index.css, sets axios.defaults.withCredentials, captures the OAuth token from the URL fragment + adds a Bearer-header interceptor, wraps in UserProvider
  config.js         BACKEND_URL, PROXY_URL, FRONTEND_URL
  styles/           5-file CSS split — see uistyle rule
  layout/           Home, TopBar, Menu, Dashboard — frame chrome
  pages/            Summary, Holdings, Positions, Orders, Funds + HoldingsRow
  widgets/WatchList/  WatchList, WatchListItem, WatchListActions, AnalyticsModal
  modals/           BuyActionWindow
  charts/           DoughnutChart, BarChart  (note: typo "DoughnoutChart" is gone)
  hooks/            useApiData, useWatchlistPolling, useIndicesPolling,
                    usePortfolioSummary, useHoldingsSummary, useSubmitOrder,
                    useCurrentUser
  context/          BuyWindowContext (BuyActionWindow open/close + selected stock),
                    UserContext (UserProvider — auth gate; fetches /me)
  utils/            portfolioUtils (pure math)
  data/             watchlistSymbols, chartPalette
```

**Adding a flat `components/` folder back is a regression** — files belong in the folder matching their role.

### Hooks own side effects

Every `setInterval` / `fetch` / `axios.post` lives in a custom hook:

| Hook | Owns |
|---|---|
| `useApiData` | generic axios GET + loading/error state + optional polling interval. Used by Holdings, Positions, Orders. |
| `useWatchlistPolling` | 15s `setInterval` polling `PROXY_URL/api/indian-stocks`. Returns `{ liveWatchlist }`. |
| `useIndicesPolling` | 60s `setInterval` polling `PROXY_URL/api/indices`. Returns `{ nifty, sensex }` formatted for the TopBar tiles (falls back to a hardcoded snapshot + logs once if rate-limited). |
| `usePortfolioSummary` | Polls `/allHoldings` + `/allPositions`; returns totals (investment, currentValue, pnl, pnlPercent, marginsUsed, holdingsCount). |
| `useHoldingsSummary` | Polls `/allHoldings`; returns enriched rows + totals + best/worst performer. |
| `useSubmitOrder` | POSTs `/newOrder`; manages toast state + 900ms auto-close. |
| `useCurrentUser` | Reads `UserContext`; throws if used outside `<UserProvider>`. Returns `{ id, fullName, email }`. |

A component that calls `setInterval`, `fetch`, or `axios.post` directly is the smell — push it into a hook.

### Auth gate

`UserProvider` (in `context/UserContext.js`) wraps every route in `index.js`. On mount it `GET`s `${BACKEND_URL}/me`; on success it provides the user via context, on any failure it `window.location`s to `${FRONTEND_URL}/login` (which the frontend serves as a `<Navigate to="/" replace>` — the route must exist there or logged-out users 404). While the request is in flight it renders a `Loading…` placeholder — no route mounts until auth is resolved.

Auth carries two ways. On localhost the httpOnly cookie works, so `index.js` sets `axios.defaults.withCredentials = true` once at boot — do not pass it per-request, and do not introduce a `fetch` call that forgets `credentials: "include"`. In prod the dashboard and backend are on separate sites, so the cookie is blocked as third-party; instead the OAuth callback redirects here with `#token=<jwt>&nonce=<nonce>`, and `context/authToken.js` stores the token in `localStorage`. `index.js` captures it at boot (`captureTokenFromUrl()`) and an axios request interceptor attaches `Authorization: Bearer <token>` to **backend** requests only (guarded by `url.startsWith(BACKEND_URL)` so the price proxy is never touched). `Menu.js` logout must `clearToken()` — `/logout` only clears the cookie.

**Login-CSRF / session-fixation defense (`authToken.js`):** a bare `#token=` could be forged by anyone with a valid JWT, silently logging a victim in as the attacker. So login is nonce-bound. The flow starts at this app: a user arriving with `?login=start` triggers `startLoginIfRequested()` (called first in `index.js`, which then **skips rendering** since we're navigating away) — it mints a random `nonce`, stashes it in `sessionStorage`, and redirects to `${BACKEND_URL}/auth/google?nonce=<nonce>`. The nonce round-trips through the backend and comes back in the callback fragment; `captureTokenFromUrl()` accepts the token **only if** the echoed nonce matches the stashed one (single-use, constant-time compare) — otherwise the token is dropped and the gate bounces to login. An attacker can't read or predict another tab's `sessionStorage`, so forged links fail.

(Trade-off: a token in `localStorage` is XSS-readable; revisit if the apps ever share an apex domain — then the first-party cookie alone suffices and both the Bearer path and the nonce dance can go.)

`Menu.js` reads `user.fullName` via `useCurrentUser`, derives the avatar initials, and owns the Logout button — it POSTs `/logout`, then `window.location`s to `FRONTEND_URL` regardless of success (the user expects to leave the dashboard either way).

### Dashboard routes

| Path | Component |
|---|---|
| `/` | `pages/Summary` |
| `/orders` | `pages/Orders` |
| `/holdings` | `pages/Holdings` |
| `/positions` | `pages/Positions` |
| `/funds` | `pages/Funds` |

### Config (`src/config.js`)

Exports `BACKEND_URL`, `PROXY_URL`, and `FRONTEND_URL`. The first two fall back to `""` (same-origin) in production; `FRONTEND_URL` does not — it's where unauthenticated users are sent, so an empty value would be silently broken. Set `REACT_APP_BACKEND_URL`, `REACT_APP_PROXY_URL`, and `REACT_APP_FRONTEND_URL` explicitly in production. Missing values trigger a console warning.

### Styling

All styles in `src/styles/` as the 5-file split (same shape as frontend). The dashboard absorbed `modals/BuyActionWindow.css` into `styles/components.css` in Phase 4; per-component CSS files are not allowed. Match new selectors to the file that owns their role, and preserve the fixed `@import` cascade order.

### Proxy server (`server.js`)

Express on port 3001. Uses `yahoo-finance2` (v3+, requires explicit instantiation). For Indian stocks, tries `.NS` (NSE) first, falls back to `.BO` (BSE). No API key required.

| Endpoint | Description |
|---|---|
| `GET /api/indian-stocks?symbols=TCS,INFY` | Batch quote fetch — returns `{ symbol, data: { close, previousClose } }` per symbol |
| `GET /api/indices` | Nifty 50 (`^NSEI`) and Sensex (`^BSESN`) |
| `GET /api/market-status` | NSE open/closed status from IST time (weekdays 09:15–15:30) |

The proxy is CJS — `require()` / `module.exports`. It is linted by the backend ESLint override in the root `.eslintrc.json`, not the CRA preset.
