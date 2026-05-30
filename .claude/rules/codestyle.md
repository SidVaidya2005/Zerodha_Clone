# Code style rules

How files are organized internally and what belongs where.

## Component size

**Components ≤ 150 LOC.** Crossing that line is the signal to extract — not a hard ban on the next line, but the threshold where you stop and look for one of:

- **Data** → `src/data/<name>.js` (see [[architecture]]).
- **Logic** → custom hook (`src/hooks/`) or pure util (`src/utils/`).
- **Markup** → subcomponent in `landing_page/components/` (frontend) or as a sibling in the same widget folder (dashboard).

Phase 5 brought every oversized file under this threshold; landing back over 150 LOC means you missed an extraction.

## Custom hooks own all side effects

All side-effecting `useEffect` calls — `fetch`, `setInterval`, `setTimeout`, `axios.post` — live in custom hooks under `src/hooks/`. Components call the hook and consume its return value. **Components do not call `setInterval` or `fetch` directly.**

Canonical examples:
- `useWatchlistPolling` owns the 15s `setInterval` and the `PROXY_URL/api/indian-stocks` fetch; `WatchList.js` only consumes `{ liveWatchlist }`.
- `useSubmitOrder` owns the axios POST + 900ms auto-close timer; `BuyActionWindow.js` only calls `submit(...)` and reads `toast`.
- `usePortfolioSummary` and `useHoldingsSummary` own their `useApiData` polling and totals math; the corresponding pages render values.

A component that imports `axios` or calls `setInterval` directly is the smell. Push the side effect into a hook.

## Pure functions go in `utils/`

Math without React or DOM dependencies: `portfolioUtils.js` (`getCurrentValue`, `getPnL`, `parseNumericPrice`, `formatPrice`). Validation helpers: `auth/validation.js` (`validateSignupForm`). Hooks consume utils; components consume hooks.

## Controllers as named function exports

`module.exports = { getAllHoldings, createOrder }` — never class methods (avoids `this`-binding bugs when a route does `r.get('/x', controller.method)`). The route file binds the function reference once and the express layer never re-binds.

## Backend CJS, frontend + dashboard ESM

Backend (`backend/`) and the dashboard proxy server (`dashboard/server.js`) use CommonJS: `require()` / `module.exports`. Everything under `frontend/src/` and `dashboard/src/` uses ES modules: `import` / `export`. **Do not mix within an app.** The root ESLint config has two override blocks ([[architecture]] mentions the split) to enforce this distinction at lint time.

## Reference

Folder placement: [[architecture]]. CSS specifics: [[uistyle]].
