# Zerodha Clone — Repo Restructure Plan

## Context

The repo (backend + frontend + dashboard) has grown into a working but increasingly hard-to-navigate state:

- **Backend** — 137 LOC `index.js` holds all 4 routes plus the 75-LOC `POST /newOrder` business logic that mutates three collections inline.
- **Frontend** — 793-LOC monolithic `src/index.css`; hardcoded content (footer links, team, FAQ, products, nav items) embedded in components; `Footer.js` (127 LOC), `SignupForm.js` (164 LOC), `CreateTicket.js` (173 LOC) mix data + logic + UI.
- **Dashboard** — 1189-LOC `src/index.css`; flat 14-file `components/` folder; `WatchList.js` (292 LOC) mixes polling, state, charting, and UI; `Summary.js` (140 LOC) and `Holdings.js` (164 LOC) compute portfolio math inline.

Goal: a layered, discoverable codebase with smaller files and clear separation of concerns, **behavior unchanged**. The user has deleted the prior `.claude/rules/` constraints; fresh rule files matching the new structure will be authored from scratch.

User-chosen direction:
- Scope: all three apps
- Aggressive — write fresh architectural rules describing the new structure
- CSS: themed split (`tokens.css`, `layout.css`, `components.css`, `utilities.css`, `dark-mode.css`)
- Backend: `routes/` + `controllers/` + `services/`
- Cross-app: share design tokens only (mirrored, not imported, because CRA can't reach outside `src/`)
- Additional: consolidate tooling configs at repo root (single ESLint config for frontend+dashboard, root `.prettierrc` already exists)

Current state of `.claude/`:
- `.claude/rules/` directory does not exist (deleted).
- Root `CLAUDE.md` still references `.claude/rules/` — stale.
- Per-app `CLAUDE.md` files still describe the old structure — need rewrite.

---

## Execution Protocol — IMPORTANT

**Each phase requires the user's explicit permission before the next phase begins.**

After every phase, I will:
1. Report what was changed (files moved, files created, commits made).
2. Run the phase's Verification checklist and report results.
3. **Stop and wait for the user to say "go ahead" (or equivalent) before starting the next phase.**

If a phase fails verification, I will not proceed — I will surface the failure and wait for direction.

The user may also choose to pause indefinitely between phases, skip a phase, or reorder phases. Default behavior: stop after each phase.

---

## Target Directory Structure (end state)

### Backend
```
backend/
  index.js                # express init + mongoose connect + route mounting only (~35 LOC)
  routes/                 # holdings.js  orders.js  positions.js
  controllers/            # holdingsController.js  ordersController.js  positionsController.js
  services/               # orderService.js  holdingsService.js  positionsService.js
  model/                  # unchanged
  schemas/                # unchanged
  seed/                   # seedHoldings.js, seedPositions.js (moved from root)
```

### Frontend
```
frontend/src/
  index.js                # imports ./styles/index.css
  config.js
  styles/                 # index.css + tokens, layout, components, utilities, dark-mode
  data/                   # navItems.js footerLinks.js teamMembers.js universeItems.js faqLinks.js
  landing_page/
    shared/               # Navbar, Footer, NotFound, OpenAccount
    components/           # PageHero, FeatureBlock, SignupCTAButton, PricingTable,
                          # FormField, FooterColumn, FAQLinkColumn,
                          # TeamMemberCard, UniverseTile  (new components added in Phase 5)
    home/  about/  products/  pricing/  support/
    signup/               # Signup.js, SignupForm.js, validation.js (new)
```

### Dashboard
```
dashboard/
  server.js               # unchanged
  src/
    index.js  config.js
    styles/               # same 5-file split as frontend
    layout/               # Home, TopBar, Menu, Dashboard, Apps
    pages/                # Summary, Holdings, Positions, Orders, Funds
    widgets/WatchList/    # WatchList, WatchListItem, WatchListActions, AnalyticsModal
    modals/               # BuyActionWindow
    charts/               # DoughnutChart (renamed from DoughnoutChart), VerticalGraph
    hooks/                # useApiData, useWatchlistPolling, usePortfolioSummary, useSubmitOrder
    context/              # GeneralContext
    utils/                # portfolioUtils
    data/                 # watchlistSymbols, chartPalette
```

### Repo root
```
shared/tokens.css         # canonical design-tokens reference (mirrored into each app)
.eslintrc.json            # root ESLint config with per-app overrides (new)
.prettierrc               # already exists
```

---

# PHASE 1 — Backend Restructure ✅ COMPLETE

**Status:** Done on 2026-05-13. Commits `9760058`, `92fa4ef`, `dafba60` on `main`. `index.js` is now 31 LOC. Lint clean; all layered modules `require()` cleanly. End-to-end DB verification (seed scripts, `curl /allHoldings|/allPositions|/allOrders`, BUY/SELL flow, 400 on bad name) deferred to the user since MongoDB wasn't available in the session.

**Goal:** Replace the 137-LOC monolithic `backend/index.js` with a layered `routes/` → `controllers/` → `services/` structure. Behavior unchanged.

### Steps
1. **Move seed scripts**
   - `git mv backend/seedHoldings.js backend/seed/seedHoldings.js`
   - `git mv backend/seedPositions.js backend/seed/seedPositions.js`
   - Update `backend/package.json` scripts: `seed:holdings` → `node seed/seedHoldings.js`; same for positions.
2. **Create layer files** (verbatim code lift from `index.js`):
   - `routes/holdings.js` — `r.get('/allHoldings', holdingsController.getAllHoldings)`
   - `routes/orders.js` — `r.get('/allOrders', ...); r.post('/newOrder', ordersController.createOrder)`
   - `routes/positions.js` — `r.get('/allPositions', ...)`
   - `controllers/holdingsController.js` — `getAllHoldings(req,res)` → calls `holdingsService.listHoldings()` and returns JSON. Same try/catch/log/500 shape as today.
   - `controllers/positionsController.js` — same shape with `listPositions()`.
   - `controllers/ordersController.js` — `getAllOrders` (sorted `-createdAt`) and `createOrder` (parses + validates input, saves Order, delegates to `orderService.placeOrder`).
   - `services/orderService.js` — `placeOrder({name,qty,price,mode})`; `applyBuyEffects` (weighted-avg upsert on Holdings); `applySellEffects` (Positions upsert + Holdings decrement/delete). Math identical to current inline code.
   - `services/holdingsService.js` — `listHoldings() => HoldingsModel.find({})`.
   - `services/positionsService.js` — `listPositions() => PositionsModel.find({})`.
3. **Rewrite `index.js`** to only do: dotenv, express, cors, body-parser, mongoose connect, `app.use(require('./routes/holdings'))` etc., `app.listen(PORT)`. Target ≤35 LOC.

### Verification

**Preconditions:** Local MongoDB running and reachable; `backend/.env` has a valid `MONGO_URL`. The backend `process.exit(1)`s on Mongo connect failure, so this is non-optional.

- `npm run seed:holdings` and `npm run seed:positions` succeed.
- `curl localhost:3002/allHoldings` returns expected shape; same for `/allPositions`, `/allOrders`.
- BUY: `curl -X POST localhost:3002/newOrder -H 'Content-Type: application/json' -d '{"name":"TCS","qty":5,"price":3500,"mode":"BUY"}'`; re-query holdings → qty increased, weighted-avg correct.
- SELL on same name: qty decrements; exact-qty sell deletes the holding; position upserted.
- Invalid `{"name":123}` → 400.

### Commits
One per step (3 commits total) so a broken endpoint is bisectable.

### 🛑 STOP — Await user approval before proceeding to Phase 2

---

# PHASE 2 — Dashboard File Moves & Typo Fix ✅ COMPLETE

**Status:** Done on 2026-05-13. Commits `5945c9b` (moves + import rewires) and `8b6649c` (DoughnutChart rename) on `main`. `dashboard/src/components/` is gone; 17 files redistributed across `layout/`, `pages/`, `widgets/WatchList/`, `modals/`, `charts/`, `context/`, `utils/`.

**Verification status:**
- ✅ `npm run lint` clean (only the pre-existing `useApiData` warning).
- ✅ `npm run build` compiles end-to-end — every import in the module graph resolves.
- ✅ `npm run dev` starts cleanly: proxy on 3001 boots (after `ALPHA_VANTAGE_API_KEY` was supplied — see commit `733b514` which adds it to `.env.example`), React on 3000 compiles successfully.
- ✅ All five routes return HTTP 200 from the dev server.
- ⚠️ Browser-rendered DOM not verified — no Chrome binary in the session.
- ⚠️ Live TopBar indices / WatchList polling not visually verified — Alpha Vantage free tier returns no data for the queried Indian symbols. Proxy endpoint shape is valid; pre-existing data-availability gap, not a Phase 2 regression.
- ⚠️ BuyActionWindow flow not verified — needs backend (3002) + MongoDB, neither running in the session.

Code-level verification is complete. Behavioral verification of TopBar/WatchList/BuyActionWindow needs the user to run with live infra.

**Goal:** Flat 14-file `dashboard/src/components/` becomes role-grouped folders. Fix the `DoughnoutChart` typo. No code edits beyond import paths.

### Steps
1. **Create folders** under `dashboard/src/`: `layout/`, `pages/`, `widgets/WatchList/`, `modals/`, `charts/`, `context/`, `utils/`. (`hooks/` already exists with `useApiData.js` and stays put — new hooks added in Phase 5 land in the same folder.)
2. **Move files** (use `git mv` so history is preserved):
   - `components/Home.js` → `layout/Home.js`
   - `components/TopBar.js` → `layout/TopBar.js`
   - `components/Menu.js` → `layout/Menu.js`
   - `components/Dashboard.js` → `layout/Dashboard.js`
   - `components/Apps.js` → `layout/Apps.js`
   - `components/Summary.js` → `pages/Summary.js`
   - `components/Holdings.js` → `pages/Holdings.js`
   - `components/Positions.js` → `pages/Positions.js`
   - `components/Orders.js` → `pages/Orders.js`
   - `components/Funds.js` → `pages/Funds.js`
   - `components/WatchList.js` → `widgets/WatchList/WatchList.js`
   - `components/BuyActionWindow.js` → `modals/BuyActionWindow.js`
   - `components/BuyActionWindow.css` → `modals/BuyActionWindow.css` (intermediate home; absorbed into `styles/components.css` and deleted in Phase 4)
   - `components/VerticalGraph.js` → `charts/VerticalGraph.js`
   - `components/DoughnoutChart.js` → `charts/DoughnutChart.js` **(rename to fix typo)**
   - `components/GeneralContext.js` → `context/GeneralContext.js`
   - `components/portfolioUtils.js` → `utils/portfolioUtils.js`
3. **Update imports** across `src/` to point at the new paths. Grep for `from "../components/X"` and `from "./X"` patterns. The `DoughnoutChart` typo has exactly one importer today (`WatchList.js`) — confirm with `grep -r "DoughnoutChart" dashboard/src`.

### Verification
- `npm run dev` starts cleanly.
- Visit each route: Summary, Orders, Holdings, Positions, Funds.
- TopBar indices, WatchList polling, BuyActionWindow modal all still work.
- `npm run lint` clean.

### Commits
One commit for the moves + import updates. Keep `DoughnutChart` rename as a separate commit so `git log --follow` works on it.

### 🛑 STOP — Await user approval before proceeding to Phase 3

---

# PHASE 3 — Frontend File Moves ✅ COMPLETE

**Status:** Done on 2026-05-13. Commit `4ec5fa8` on `main`. `Navbar.js`, `Footer.js`, `NotFound.js`, `OpenAccount.js` moved from `frontend/src/landing_page/` into `frontend/src/landing_page/shared/` via `git mv` (all four rename-detected). Three import sites updated: `src/index.js` (Navbar/Footer/NotFound) and `home/HomePage.js` + `pricing/PricingPage.js` (OpenAccount). `OpenAccount.js`'s own internal `./components/...` imports fixed up to `../components/...` since it moved one level deeper.

**Verification status:**
- ✅ `npm run lint` — 0 errors, 7 pre-existing `jsx-a11y/alt-text` warnings (none in moved files).
- ✅ `npm run build` — webpack compiles end-to-end; every import in the module graph resolves.
- ✅ `npm start` (on port 3010 since 3000 was occupied by a leftover server) — dev server compiled with only the pre-existing warning.
- ✅ All 7 routes return HTTP 200 from the dev server: `/`, `/about`, `/product`, `/pricing`, `/signup`, `/support`, `/xyz` (NotFound).
- ✅ `OpenAccount` confirmed not orphaned — imported by both `HomePage.js` and `PricingPage.js`.
- ⚠️ Browser-rendered DOM not verified — no Chrome binary in the session.
- ⚠️ Dark-mode toggle per route not visually verified — same reason.

Code-level verification is complete. Behavioral verification (visual DOM + dark mode on each route) needs the user to run with a browser.

**Goal:** Move shared layout pieces into `landing_page/shared/`. No code edits beyond import paths.

### Steps
1. Create `frontend/src/landing_page/shared/`.
2. `git mv` four files:
   - `Navbar.js`, `Footer.js`, `NotFound.js`, `OpenAccount.js` → `shared/`
3. Update imports — `src/index.js` and any per-page imports. `grep -r "landing_page/Navbar" frontend/src` to find them.
4. Confirm `OpenAccount.js` is not orphaned — it should be referenced from `signup/Signup.js`. If genuinely unused, defer deletion to a later cleanup; do not delete here.

### Verification
- `npm start` clean.
- Visit `/`, `/about`, `/product`, `/pricing`, `/signup`, `/support`, `/xyz` (NotFound).
- Toggle dark mode on every route.
- **Port note:** `frontend` and `dashboard` both default to port 3000. Run them in separate sessions, or start one with `PORT=3001 npm start`. They cannot both run simultaneously without an override.

### Commits
One commit (small surface).

### 🛑 STOP — Await user approval before proceeding to Phase 4

---

# PHASE 4 — CSS Split (both apps)

**Goal:** Split the two monolithic `index.css` files into the 5-file themed structure. Absorb `BuyActionWindow.css` into the dashboard split.

### CSS file responsibilities (both apps)
- **tokens.css** — `:root { --app-* }` + `[data-theme="dark"] { --app-* }` token block only.
- **layout.css** — `body`, page wrappers, grid/flex shells (frontend: `.app-navbar`, footer grid, hero grids; dashboard: `.dashboard-container`, `.menu-container`, `.topbar-container`, `.watchlist-container`, page outer wrappers).
- **components.css** — buttons, cards, modals, tables, forms, the absorbed `BuyActionWindow.css` rules under `.buy-action-window`.
- **utilities.css** — `.dark-invert`, `.profit`, `.loss`, `.up`, `.down`, text/spacing helpers.
- **dark-mode.css** — every `[data-theme="dark"] .x` selector outside `tokens.css`. **Must load last** so its selectors win specificity ties.

`styles/index.css` is exactly:
```css
@import "./tokens.css";
@import "./layout.css";
@import "./components.css";
@import "./utilities.css";
@import "./dark-mode.css";
```

### Steps
1. **Frontend split**
   - Create `frontend/src/styles/` with the 5 files + `index.css`.
   - Cut selectors from `frontend/src/index.css` into the right target file.
   - Change `frontend/src/index.js` import to `./styles/index.css`.
   - Delete the old `frontend/src/index.css`.
2. **Dashboard split**
   - Same procedure with `dashboard/src/index.css`.
   - Cut `dashboard/src/modals/BuyActionWindow.css` into `styles/components.css` under `.buy-action-window` selectors.
   - Delete `BuyActionWindow.css` and any import of it.

### Verification
- Visual diff every frontend route in light + dark mode.
- Visual diff every dashboard route in light + dark mode.
- BuyActionWindow modal styling identical pre/post.
- No console warnings about missing CSS.
- **Port note:** `frontend` and `dashboard` both default to port 3000. Verify them in separate sessions or override with `PORT=3001 npm start` for one of them.

### Commits
Two commits — one per app.

### 🛑 STOP — Await user approval before proceeding to Phase 5

---

# PHASE 5 — Big-File Splits

**Goal:** Bring oversized files under 150 LOC by extracting data, hooks, and subcomponents. Behavior identical.

Order matters — start with the easy ones (data extraction only) so the harder ones (hook extraction) build on patterns already in place. **One component per commit, smoke test each.**

### 5.1 Frontend data extractions
| Component | Extract |
|---|---|
| `Footer.js` (127 LOC) | `data/footerLinks.js` (`FOOTER_COLUMNS`) + `landing_page/components/FooterColumn.js` |
| `Navbar.js` (76 LOC) | `data/navItems.js` (`NAV_ITEMS`) |
| `support/CreateTicket.js` (173 LOC) | `data/faqLinks.js` (`FAQ_GROUPS`) + `landing_page/components/FAQLinkColumn.js` |
| `about/Team.js` (67 LOC) | `data/teamMembers.js` + `landing_page/components/TeamMemberCard.js` |
| `products/Universe.js` (63 LOC) | `data/universeItems.js` + `landing_page/components/UniverseTile.js` |

### 5.2 Frontend signup form
- `signup/SignupForm.js` (164 LOC):
  - Extract pure validation to `signup/validation.js` (`validateSignupForm(values) => {errors, isValid}` + helpers `isValidEmail`, `isValidPhone`, `isStrongPassword`).
  - Extract `<FormField>` to `landing_page/components/FormField.js`.
  - Form keeps state + submit handler. Network payload + DOM identical.

### 5.3 Dashboard hooks + WatchList
- `pages/Summary.js` (140 LOC):
  - Extract totals math to `hooks/usePortfolioSummary.js` returning `{investment, currentValue, pnl, pnlPercent, marginsUsed, holdingsCount}`.
  - Optionally extract two `.section` blocks into `pages/SummaryEquitySection.js` and `pages/SummaryHoldingsSection.js`.
- `widgets/WatchList/WatchList.js` (292 LOC):
  - `data/watchlistSymbols.js` — `INITIAL_WATCHLIST` constant.
  - `data/chartPalette.js` — `BACKGROUND_COLORS`, `BORDER_COLORS` palette.
  - `hooks/useWatchlistPolling.js` — owns `useEffect` + fetch from `PROXY_URL/api/indian-stocks` + 15s `setInterval` + cleanup. Returns `{liveWatchlist}`.
  - Extract `WatchListItem.js`, `WatchListActions.js`, `AnalyticsModal.js` as siblings.
  - `WatchList.js` body: hook call + state for analytics modal + `useMemo` chart data + JSX. ≤80 LOC.
- `pages/Holdings.js` (164 LOC):
  - Extract row component to `pages/HoldingsRow.js`.
  - Optional: `hooks/useHoldingsSummary.js` if totals are heavy.
- `modals/BuyActionWindow.js` (113 LOC):
  - Extract `hooks/useSubmitOrder.js` returning `{submit, isSubmitting, success}`. Hook does the POST + 900ms auto-close.
  - `BuyActionWindow.js` keeps JSX only.

### Verification (per commit)
- After each split: smoke test the affected page/component.
- WatchList specifically: leave tab open 30s, confirm `/api/indian-stocks` poll fires at t≈0, 15s, 30s in DevTools Network.
- BuyActionWindow: submit a BUY and a SELL, confirm modal closes ~900ms after success, confirm backend mutated the right collections.
- SignupForm: empty, invalid, valid paths identical to pre-split.

### Commits
~10 commits (one per file split).

### 🛑 STOP — Await user approval before proceeding to Phase 6

---

# PHASE 6 — Shared Tokens

**Goal:** Establish `/shared/tokens.css` as the canonical reference for the token block that both apps mirror.

### Steps
1. Create `shared/tokens.css` at repo root containing the full `:root { --app-* }` block + `[data-theme="dark"] { --app-* }` block. Dashboard's richer set (including `--app-profit`, `--app-loss`) is canonical.
2. **All three files (`shared/tokens.css`, `frontend/src/styles/tokens.css`, `dashboard/src/styles/tokens.css`) are byte-identical.** Frontend may carry tokens it does not currently use; that is intentional and harmless — keeps verification trivial.
3. Add a header comment in `shared/tokens.css`: "Canonical design tokens. CRA cannot import this file, so each app keeps a byte-identical copy. Token changes must update all three files in the same commit."
4. Sanity check: `diff shared/tokens.css frontend/src/styles/tokens.css` exits 0. Same for dashboard.

### Verification
- `diff` exits 0 for both `frontend/src/styles/tokens.css` and `dashboard/src/styles/tokens.css` against `shared/tokens.css`.
- No build change needed; this file is reference only.

### Commits
One commit.

### 🛑 STOP — Await user approval before proceeding to Phase 7

---

# PHASE 7 — Tooling Consolidation

**Goal:** One root ESLint config with per-app overrides. Keep root `.prettierrc` as already exists.

### Steps
1. Create `.eslintrc.json` at repo root with:
   - `root: true`
   - Shared defaults (Prettier integration, base rules)
   - `overrides:` block for `backend/**/*.js` — Node CJS env, `eslint:recommended`, current backend rules from `backend/.eslintrc.json`.
   - `overrides:` block for `frontend/**/*.js` and `dashboard/**/*.js` — CRA's `react-app` + `react-app/jest` + `prettier`.
2. Delete `backend/.eslintrc.json` (absorbed into root).
3. Delete `eslintConfig` blocks in `frontend/package.json` and `dashboard/package.json`.
4. Keep `backend/.eslintignore` and `.prettierignore` as-is.
5. **Confirm CRA picks up the root config.** Run `cd frontend && npm start` and watch for ESLint warnings about a missing config; same for `dashboard`. `react-scripts` ESLint integration can be finicky when `eslintConfig` is removed from `package.json` — verify it walks up to the root `.eslintrc.json` cleanly (no duplicate `root: true` surprises).
6. No `.github/workflows/` exists today. If CI is added later, ensure lint jobs `cd` into each app (or pass `--config` pointing at the root) so the lint step doesn't drift.

### Verification
- `cd backend && npm run lint` — zero new errors.
- `cd frontend && npm run lint` — zero new errors.
- `cd dashboard && npm run lint` — zero new errors.
- `npm run format:check` clean in each.

### Commits
One commit.

### 🛑 STOP — Await user approval before proceeding to Phase 8

---

# PHASE 8 — Fresh Rules + CLAUDE.md Updates

**Goal:** Document the new structure for future Claude sessions. Author the three rule files from scratch; rewrite all four `CLAUDE.md` files.

### Steps
1. **Create `.claude/rules/architecture.md`** with content from this plan's Phase descriptions:
   - Backend: `routes/` → `controllers/` → `services/` → `model/`. Controllers thin; services own multi-collection mutations. Inline route handlers in `index.js` not allowed.
   - Frontend + dashboard: `src/styles/` with the 5-file split. No monolithic `index.css`.
   - Hardcoded UI content lives in `src/data/`, not in components.
   - Dashboard components grouped by role (`layout/`, `pages/`, `widgets/`, `modals/`, `charts/`, `hooks/`, `context/`, `utils/`, `data/`). No flat `components/`.
   - Design tokens mirrored across apps via `/shared/tokens.css`. Token changes must touch all three copies in the same commit.
2. **Create `.claude/rules/codestyle.md`**:
   - Components ≤ 150 LOC. Cross that → extract data, logic (hooks/utils), subcomponents.
   - Custom hooks own all side-effecting `useEffect`s (fetch, setInterval). Components do not call `setInterval` directly.
   - Controllers exported as named functions only (no class methods).
   - Backend CJS, frontend + dashboard ESM. Do not mix within an app.
3. **Create `.claude/rules/uistyle.md`**:
   - Document the CSS selector-routing rules (which file owns which selectors).
   - Document the `dark-mode.css` last-load requirement.
   - Document `[data-theme="dark"]` policy (not `prefers-color-scheme`).
4. **Rewrite `CLAUDE.md`** (root): remove stale "no service layer / no router layer" claims; point at the new rule files; describe the new directory layout.
5. **Rewrite `backend/CLAUDE.md`**: describe routes/controllers/services structure + cross-collection mutation pattern living in `orderService`.
6. **Rewrite `frontend/CLAUDE.md`**: describe `styles/` split, `data/` extractions, `shared/` folder.
7. **Rewrite `dashboard/CLAUDE.md`**: describe role-grouped folders, hook patterns, `widgets/WatchList/` composition.

### Verification
- `find dashboard/src/components -type f` returns empty (flat folder is gone).
- `find backend -maxdepth 2 -name "*.js" -path "*/routes/*" -o -path "*/controllers/*" -o -path "*/services/*" | wc -l` is ≥ 9.
- `wc -l backend/index.js` ≤ 35.
- `ls frontend/src/styles/` lists exactly: `tokens.css`, `layout.css`, `components.css`, `utilities.css`, `dark-mode.css`, `index.css`. Same for `dashboard/src/styles/`.
- `grep -r "DoughnoutChart" dashboard/src` returns empty (typo fully cleaned).
- Cross-reference each rule file against the actual code state.
- Optional sanity check: fresh Claude session asked "where do new dashboard pages go?" answers `pages/` — confirms rewritten CLAUDE.md files read correctly.

### Commits
One commit per rule file + one for all CLAUDE.md rewrites (4 commits total).

### 🛑 STOP — Final phase complete. Report results and await user's final review.

---

## Cross-Cutting Notes

### Reusable utilities to preserve (do not rewrite)
- `dashboard/src/utils/portfolioUtils.js` — `getCurrentValue`, `getPnL`, `getProfitClass`, `getDayClass`, `parseNumericPrice`, `formatPrice`, `formatPercent`
- `dashboard/src/hooks/useApiData.js` — fetch + polling hook used everywhere (folder already exists)

### Testing posture
No automated test suite exists today — zero Jest/spec/test files across backend, frontend, or dashboard beyond CRA defaults. **All verification in this plan is manual.** If a test suite is added mid-restructure, add a "run tests" step to Phases 4 and 5 (highest blast-radius phases).

### Risks
1. **CRA can't `@import` outside `src/`** → tokens are duplicated, not imported. Mitigation: Phase 6 documents the same-commit policy.
2. **CSS specificity shifts when splitting** → `dark-mode.css` must load last; visual diff both themes after Phase 4.
3. **WatchList polling regression** → extract the hook in one atomic commit; verify ≥2 polls fire in 30s via DevTools Network.
4. **Controller `this` binding** → named function exports only (codestyle rule).
5. **Missed import paths after moves** → one move per commit, `grep -r "from \".*components/X\""` after each, `npm start` smoke test before commit.
6. **`OpenAccount.js` orphan check** → confirm references before/after move; leave in `shared/` if uncertain.
7. **`DoughnoutChart` → `DoughnutChart` rename** → exactly one importer today (`WatchList.js`); easy to forget — grep before commit.

### Phase Dependencies
- Phases 1–3 are independent and could run in any order (or in parallel as separate branches).
- Phase 4 (CSS) is independent of 1–3.
- Phase 5 (big-file splits) depends on Phase 2 (dashboard moves) for path stability — wait for Phase 2 to land first.
- Phase 6 (shared tokens) depends on Phase 4 (so the tokens file exists in each app first).
- Phase 7 (tooling) is independent — could run any time.
- Phase 8 (docs) **must run last** so it describes the actual end state.

### Final Verification (after all phases)
- All three apps start cleanly (`npm run dev` / `npm start`).
- All routes render in both light + dark mode.
- BUY + SELL flow end-to-end (dashboard → backend → DB).
- WatchList polls every 15s.
- TopBar indices update every 5s.
- `npm run lint` + `npm run format:check` clean in each app.
- `git log --follow` works for renamed files (`DoughnutChart.js` etc.) thanks to `git mv`.
