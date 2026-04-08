# Architecture Rules

These rules describe the structural patterns in this codebase. Follow them when adding new features or refactoring.

---

## Backend

**Single-file routing.** All Express routes live directly in `index.js`. There is no `routes/` folder or Express Router. Do not introduce a router layer unless the file grows unmanageable — keep new endpoints inline.

**Schema/model split.** Every Mongoose model follows a two-file pattern:
- `schemas/FooSchema.js` — defines and exports only the schema
- `model/FooModel.js` — imports the schema and exports the compiled model

Do not define schemas inline inside model files or merge them into one file.

**No service layer.** Business logic (e.g. the BUY/SELL order mutation across three collections) lives directly in route handlers. Do not extract it into service classes or helper modules.

**Cross-collection mutation pattern.** The `POST /newOrder` handler is the only place that writes to multiple collections in one request (Orders → Holdings ↔ Positions). If you add another multi-collection operation, follow the same pattern: save the primary record first, then update dependents, with individual `try/catch` at the route level.

**No authentication middleware.** Routes are currently open. Do not add per-route `auth` middleware without wiring it globally first — partial auth creates inconsistency.

---

## Frontend

**Flat page structure.** Each route has its own folder under `src/landing_page/`. Shared layout components (`Navbar`, `Footer`, `NotFound`) sit directly in `src/landing_page/` without a subfolder. Maintain this flat/shallow depth — do not nest pages more than one level deep.

**Theme managed at root.** `AppLayout` in `src/index.js` owns all theme state (`themeMode`, `activeTheme`). It writes `data-theme` to `<html>` and passes `theme` + `onToggleTheme` down to `Navbar`. Do not lift theme state into a context or Redux store — keep it in `AppLayout`.

**Single global CSS file.** All styles live in `src/index.css`. There are no per-component CSS files in the frontend. New styles go in `src/index.css`, scoped with descriptive class names prefixed with `app-` (e.g. `.app-cta-button`, `.app-pricing-table`).

**No axios in frontend.** The frontend does not use axios — use native `fetch` or `<a>` links for backend interaction. This is different from the dashboard which does use axios.

---

## Dashboard

**Two-process architecture.** The dashboard ships two independent servers:
- `src/` (React app via CRA) — the UI
- `server.js` (Express proxy) — wraps Yahoo Finance for live stock prices

Always run both together with `npm run dev`. The React app and the proxy server are deliberately kept separate — do not move Yahoo Finance calls into the backend.

**Context for modal state only.** `GeneralContext` exists solely to manage the `BuyActionWindow` open/close state and which stock is selected. Do not expand it to hold other state (e.g. user profile, theme, data). Create separate contexts if new cross-cutting state is needed.

**`useApiData` for all backend fetches.** Any component that fetches from the backend must use the `useApiData` hook (`src/hooks/useApiData.js`). It handles loading/error state and optional polling (`refreshIntervalMs`). Do not use raw `axios` or `fetch` inside components.

**`portfolioUtils` for financial calculations.** All P&L math goes through `src/components/portfolioUtils.js`. Do not inline financial formulas in components. If you add a new metric, add it as a named export there.

**Layout split is 68/32.** The dashboard uses a fixed `flex` split: content area is `flex: 0 0 68%`, watchlist sidebar is `flex: 0 0 32%`. This mirrors the topbar's `menu-container` / `indices-container` split. Preserve this ratio when adding layout sections.

**`WatchList` polls every 15 seconds.** The `setInterval` in `WatchList.js` fires `fetchIndianStocks` every 15000ms. Any new live-data component should follow the same `useEffect` + `setInterval` + `clearInterval` cleanup pattern — or use the `refreshIntervalMs` param on `useApiData`.

---

## Cross-App

**Three separate `package.json` files — no monorepo tooling.** Each app installs and runs independently. Do not add a root-level `package.json` or workspace config (`npm workspaces`, `turborepo`, etc.) without migrating all three apps.

**URL config is centralized per app.** Each app has a `src/config.js` that exports all base URLs. Never hardcode `localhost:3002` or other base URLs in component files — import from `config.js`.

**No shared component library.** Frontend and dashboard share no code. Duplication between them (e.g. CSS variable names) is intentional — they are deployed independently. Do not create a shared `packages/` directory without a clear migration plan.
