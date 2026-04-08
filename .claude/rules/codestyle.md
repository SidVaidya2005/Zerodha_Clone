# Code Style Rules

These rules describe the actual patterns used across this codebase. Follow them when writing new code.

---

## General (all apps)

**CommonJS in backend, ES modules in frontend/dashboard.** `backend/` uses `require`/`module.exports`. `frontend/` and `dashboard/` use `import`/`export`. Never mix within an app.

**No TypeScript.** All three apps are plain JavaScript. Do not add `.ts`/`.tsx` files or `tsconfig.json`.

**No linter config.** There is no `.eslintrc` beyond what CRA ships. Do not add custom lint rules without discussing first.

---

## Backend

**Inline async/await with try/catch per route.** Every route handler is an `async` function with its own `try { ... } catch (error) { console.error(...); res.status(500).send(...) }`. Do not use a shared error handler middleware or `next(err)` pattern.

**Input sanitization is minimal and inline.** Validation (e.g. `typeof name !== "string"`, `name.trim()`, `Number(qty)`) happens directly at the top of the route handler. Do not add `express-validator` or Joi schemas.

**Destructure from `req.body` immediately.** Route handlers destructure all expected fields in the first line: `const { name, qty, price, mode } = req.body;`.

**Models are imported by name at top of file.** All models are required at the top of `index.js` with destructuring: `const { HoldingsModel } = require("./model/HoldingsModel");`. Follow the same pattern for new models.

**Seed scripts are standalone, self-contained scripts.** Each seed file connects to MongoDB, runs `deleteMany` + `insertMany`, and calls `mongoose.connection.close()` in a `finally` block. They must be runnable with `node seedFoo.js` and must not import from other seed files.

---

## Frontend

**Functional components only.** No class components anywhere in the codebase. All components are arrow functions assigned to `const`.

**Named exports for utilities, default exports for components.** Page components and layout components use `export default`. Utility functions use named exports (`export function foo()`).

**State at the lowest level that works.** Theme state lives in `AppLayout` (root) because it's needed by `Navbar` and applied to `<html>`. All other state is component-local. Do not reach for context unless state is truly cross-cutting.

**Theme-aware code uses `data-theme` attribute.** Dark mode CSS uses `[data-theme="dark"] .my-class { }` selectors. Do not use `prefers-color-scheme` media queries in CSS — the JS-driven `data-theme` attribute takes precedence.

**`localStorage` key is `"zerodha-theme-mode"`.** The theme persistence key is hardcoded in `src/index.js`. Do not create a separate constant file for it.

---

## Dashboard

**React hooks for all side effects.** Data fetching, polling, and timers always use `useEffect` with proper cleanup (`return () => clearInterval(...)`, `return () => clearTimeout(...)`). The `useApiData` hook encapsulates the fetch+interval pattern.

**`useMemo` for derived data.** Any value computed from `props` or state that feeds a chart or table (e.g. `holdingsWithPnL`, `data` for Chart.js) is memoized with `useMemo`. Do not compute these inline in JSX.

**Context is consumed via `useContext`, not a wrapper HOC.** Components that need `GeneralContext` call `const generalContext = useContext(GeneralContext)` directly. Do not create a `withGeneralContext` HOC.

**MUI components are imported individually.** Icons and components are tree-shaken via named imports: `import { Tooltip, Grow } from "@mui/material"`. Do not use barrel imports like `import * as MUI from "@mui/material"`.

**Axios for all dashboard API calls.** The dashboard uses `axios` (not fetch) for backend requests. `WatchList.js` is an exception — it uses native `fetch` for the proxy server. Follow the existing pattern per file rather than mixing in new code.

**Proxy server (`server.js`) uses CommonJS.** Although the dashboard React app uses ES modules, `server.js` is a Node script using `require`/`module.exports`. Do not add `"type": "module"` to `dashboard/package.json`.

**Yahoo Finance symbol resolution order: NSE → BSE.** When fetching quotes, always try `${symbol}.NS` first and fall back to `${symbol}.BO`. Maintain this order in any new proxy endpoint.

---

## Naming Conventions

| Context | Convention | Example |
|---|---|---|
| React components | PascalCase | `BuyActionWindow`, `WatchList` |
| Hooks | camelCase prefixed with `use` | `useApiData` |
| CSS classes | kebab-case, `app-` prefix for global frontend styles | `.app-cta-button`, `.watchlist-container` |
| Mongoose models | PascalCase + `Model` suffix | `HoldingsModel` |
| Mongoose schemas | PascalCase + `Schema` suffix | `HoldingsSchema` |
| Env vars | `REACT_APP_` prefix in React apps | `REACT_APP_BACKEND_URL` |
| Config exports | `SCREAMING_SNAKE_CASE` | `BACKEND_URL`, `PROXY_URL` |
