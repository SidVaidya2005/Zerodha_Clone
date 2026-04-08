# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and environment variable setup.

## Commands

```bash
npm run dev      # start both React app + proxy server concurrently (recommended)
npm start        # React app only (no live stock prices without proxy)
npm run server   # proxy server only (port 3001)
npm run build    # production build
npm test         # run tests
npm test -- --testPathPattern=MyComponent   # run a single test file
```

## Architecture

This app has two processes:

1. **React app** (`src/`) — the trading dashboard UI
2. **Proxy server** (`server.js`) — an Express server that wraps Yahoo Finance for live NSE/BSE prices

Both are started together by `npm run dev` via `concurrently`.

### Config (`src/config.js`)

Exports `BACKEND_URL` and `PROXY_URL`. In production, both fall back to `""` (same-origin) if env vars are missing, with a console warning. Always set `REACT_APP_BACKEND_URL` and `REACT_APP_PROXY_URL` in production deployments.

### Component Structure (`src/components/`)

The dashboard layout is split into a main content area and a persistent sidebar:

- **`Dashboard.js`** — top-level route container; renders content routes on the left, `<WatchList>` wrapped in `<GeneralContextProvider>` on the right
- **`GeneralContext.js`** — React context that manages the `BuyActionWindow` modal state (open/close, selected stock name and price). Any component that needs to trigger a buy/sell order must consume this context.
- **`BuyActionWindow.js`** — order form rendered inside `GeneralContext`. POSTs to `BACKEND_URL/newOrder` via axios. Closes automatically 900ms after a successful order.
- **`WatchList.js`** — polls `PROXY_URL/api/indian-stocks` every 15 seconds for live prices. Passes stock name and price into `GeneralContext.openBuyWindow` when Buy/Sell is clicked.

### Shared Utilities

- **`src/hooks/useApiData.js`** — custom hook wrapping axios GET with loading/error state. Accepts an optional `refreshIntervalMs` for polling. Used by `Holdings`, `Positions`, `Orders` to fetch from the backend.
- **`src/components/portfolioUtils.js`** — pure functions for portfolio math: `getCurrentValue`, `getPnL`, `getProfitClass`, `getDayClass`.

### Dashboard Routes

| Path | Component |
|---|---|
| `/` | `Summary` |
| `/orders` | `Orders` |
| `/holdings` | `Holdings` |
| `/positions` | `Positions` |
| `/funds` | `Funds` |

### Proxy Server (`server.js`)

Express app on port 3001. Uses `yahoo-finance2` (v3+, requires explicit instantiation). For Indian stocks, tries the `.NS` (NSE) suffix first, then falls back to `.BO` (BSE).

| Endpoint | Description |
|---|---|
| `GET /api/indian-stocks?symbols=TCS,INFY` | Batch quote fetch — returns `{ symbol, data: { close, previousClose } }` per symbol |
| `GET /api/indices` | Returns Nifty 50 (`^NSEI`) and Sensex (`^BSESN`) quotes |
| `GET /api/market-status` | Computes NSE open/closed status from IST time (weekdays 09:15–15:30) |
