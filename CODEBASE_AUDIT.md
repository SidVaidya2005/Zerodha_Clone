# Codebase Audit — ZerodhaRebuild

_Scope:_ Whole repo — `backend/`, `dashboard/`, `frontend/`, `shared/`. Skipped `node_modules/`, build output, `*.test.js`, `backend/tests/`, CSS, and config/lock files.
_Files inspected:_ 104 source files in scope. All logic-bearing files (controllers, services, hooks, context, utils, pages, layout, widgets, charts, signup/auth) read in full; presentational landing-page components sampled and corroborated with `grep` for import patterns.
_Date:_ 2026-05-30

> **Overall:** this is a well-structured, recently-refactored codebase. Layering (routes → controllers → services → model), the dashboard role-grouped folders, and "side effects live in hooks" are all consistently followed. There is **no god file, no dumping ground, and no duplicate logic**. The findings below are a small, focused set of name/folder drift and one dead file — not a systemic problem.

## Top refactoring opportunities (prioritized)

1. **[High] Rename `frontend/.../support/CreateTicket.js` → `SupportFaq.js`** — the component creates no ticket; it renders an FAQ accordion + quick/featured links. The name actively lies. See [#createticket](#frontendsrclanding_pagesupportcreateticketjs).
2. **[High] Rename `dashboard/.../context/GeneralContext.js` → `BuyWindowContext.js`** — "General" hides that this is specifically the buy/sell order-window state (and it renders `BuyActionWindow`). See [#generalcontext](#dashboardsrccontextgeneralcontextjs).
3. **[Medium] Delete `dashboard/.../layout/Apps.js`** — dead placeholder (`<h1>Apps</h1>`); no importers found via grep. Easy win. See [#apps](#dashboardsrclayoutappsjs).
4. **[Medium] Rename folder `frontend/.../landing_page/signup/` → `auth/`** — it also contains `Login.js`, `LoginForm.js`, and login validation, so "signup" under-describes it. See [#signup-folder](#frontendsrclanding_pagesignup-folder).
5. **[Medium] Rename `dashboard/.../charts/VerticalGraph.js` → `BarChart.js`** — it renders a Chart.js `<Bar>`; the name is vague and inconsistent with its sibling `DoughnutChart.js`. See [#verticalgraph](#dashboardsrcchartsverticalgraphjs).
6. **[Low] Tidy `dashboard/.../utils/portfolioUtils.js`** — mild grab-bag: P&L math + CSS-class mapping + number formatting in one file. See [#portfolioutils](#dashboardsrcutilsportfolioutilsjs).
7. **[Low] Backend auth layering inconsistency** — `authController` queries `UserModel` directly while every other controller goes through a service. See [#auth-layering](#backendcontrollersauthcontrollerjs).

## Per-file findings

### `frontend/src/landing_page/support/CreateTicket.js`

- **Actual responsibility:** Renders the support help-center body — an FAQ accordion (`FAQ_GROUPS` via `FAQLinkColumn`) plus "featured" and "quick links" lists.
- **Why the name is wrong:** "CreateTicket" implies a ticket-submission form. There is no form, no submit handler, no ticket state — it's read-only FAQ browsing. (The only ticket reference is a `My tickets` link living in `support/Hero.js`.)
- **Suggested name:** `SupportFaq.js` (or `HelpTopics.js` / `FaqAccordion.js`).
- **Categories:** Misleading name.
- **Recommendation:** Rename the file + component. Update the import in `support/SupportPage.js`.
- **Risk:** Low — single consumer (`SupportPage`); internal component, no public API.

### `dashboard/src/context/GeneralContext.js`

- **Actual responsibility:** Holds buy/sell order-window state (`openBuyWindow`/`closeBuyWindow`, selected stock UID + price) and conditionally renders `<BuyActionWindow>`.
- **Why the name is wrong:** "General" describes nothing; the context is single-purpose (the buy window). Consumers (`useSubmitOrder`, `BuyActionWindow`, `WatchListActions`) only ever call `openBuyWindow`/`closeBuyWindow`.
- **Suggested name:** `BuyWindowContext.js` (export `BuyWindowProvider`). `OrderEntryContext` also works.
- **Categories:** Too generic; Misleading name; minor Mixed concerns (a context provider that also renders a concrete modal).
- **Recommendation:** Rename file, context, and `GeneralContextProvider`. Update 3 importers (`layout/Dashboard.js`, `hooks/useSubmitOrder.js`, `modals/BuyActionWindow.js`, `widgets/WatchList/WatchListActions.js`). Optionally lift the `<BuyActionWindow>` render out of the provider.
- **Risk:** Low–medium — 4 import sites, all internal; mechanical rename.

### `dashboard/src/layout/Apps.js`

- **Actual responsibility:** None. Returns `<h1>Apps</h1>`.
- **Why the name is wrong:** Not a naming problem — it's dead. `grep` for `Apps` imports across `dashboard/src` returns no consumers; it's not in any route.
- **Suggested name:** n/a.
- **Categories:** Dead / legacy / experimental.
- **Recommendation:** Delete. (If a future "Apps" screen is planned, it's faster to recreate than to carry a stub.)
- **Risk:** Low — confirmed no importers via grep; verify once more with `grep -rn "Apps" dashboard/src` before deleting.

### `frontend/src/landing_page/signup/` (folder)

- **Actual responsibility:** The whole auth surface — signup **and** login: `Signup.js`, `SignupForm.js`, `Login.js`, `LoginForm.js`, and `validation.js` (which exports both `validateSignupForm` and `validateLoginForm`).
- **Why the name is wrong:** The folder name says "signup" but half its contents are login. `index.js` routes both `/signup` and `/login` here.
- **Suggested name:** `auth/`.
- **Categories:** Wrong folder / misleading folder name.
- **Recommendation:** `git mv` the folder to `auth/`; update the 3 imports in `frontend/src/index.js`. `validation.js` is fine as-is once the folder reads "auth".
- **Risk:** Medium — touches import paths in `index.js`; `git mv` preserves history. Low logic risk.

### `dashboard/src/charts/VerticalGraph.js`

- **Actual responsibility:** A Chart.js bar chart wrapper (`<Bar>`), used by `Holdings.js`.
- **Why the name is wrong:** "VerticalGraph" is vague and asymmetric with the sibling `DoughnutChart.js`. It's a bar chart; say so. It also exports a module-level `options` with a hardcoded `title.text: "Holdings"`, baking a caller-specific label into a "generic" chart.
- **Suggested name:** `BarChart.js`.
- **Categories:** Too generic / inconsistent naming; minor Mixed concerns (Holdings-specific title in a reusable chart).
- **Recommendation:** Rename to `BarChart`; consider passing the chart title in via props instead of the exported `options` constant. Update the import in `pages/Holdings.js`.
- **Risk:** Low — one importer.

### `dashboard/src/utils/portfolioUtils.js`

- **Actual responsibility:** Three loosely-related groups: P&L math (`getCurrentValue`, `getPnL`), CSS-class mapping (`getProfitClass`/`getDayClass` → `"profit"`/`"loss"`), and number parse/format (`parseNumericPrice`, `formatPrice`, `formatPercent`).
- **Why the name is wrong:** Not badly — it's domain-prefixed, which is better than a bare `utils.js`. But the `Utils` suffix has started attracting unrelated helpers; the CSS-class functions are view concerns sitting next to pure math.
- **Suggested name:** Keep `portfolioMath.js` for `getCurrentValue`/`getPnL`; split number formatting into `priceFormat.js`; move `getProfitClass`/`getDayClass` next to where class names belong (or into the same `priceFormat`/a `classNames` helper).
- **Categories:** Too generic (mild); Dumping ground (early-stage); Mixed concerns.
- **Recommendation:** Optional, low priority. It's used at 11 sites, so only split if it keeps growing — today it's still coherent enough to leave. Flagged so it doesn't rot further.
- **Risk:** Medium if split (11 import sites); zero if left.

### `backend/controllers/authController.js`

- **Actual responsibility:** Signup/login/me/logout — correct for its name.
- **Why the name is wrong:** Name is fine; the **layering** is the issue. This controller imports and queries `UserModel` directly (`findOne`/`findById`/`create`), whereas `holdingsController`/`positionsController`/`ordersController` all go through a service. `authService` exists but only owns crypto/JWT primitives, not DB access.
- **Suggested name:** n/a (keep the name).
- **Categories:** Mixed concerns / inconsistent layering.
- **Recommendation:** Either add a thin `authService` DB seam (`findByEmail`, `findById`, `createUser`) for consistency, or consciously accept that single-collection reads may live in controllers and document it. Low urgency — the architecture rule only *requires* services for multi-collection mutations, so this is consistency polish, not a violation.
- **Risk:** Low.

## Architectural patterns

- **Thin service wrappers are a deliberate seam, applied unevenly.** `holdingsService.listHoldings` and `positionsService.listPositions` are one-line `Model.find({})` wrappers — technically "abstraction that doesn't earn its keep," but they're an intentional, consistent DB-access layer. The inconsistency is that **auth doesn't follow it** (see above). Pick one rule and apply it everywhere.
- **`PageHero` exists but only 2 of 5 page heroes use it.** `home/Hero.js` and `products/Hero.js` compose the shared `components/PageHero`; `about/Hero.js`, `pricing/Hero.js`, and `support/Hero.js` hand-roll their own hero markup. Not duplication of *logic*, but a shared abstraction that's bypassed 60% of the time — worth either widening `PageHero` to cover those cases or accepting they're bespoke. (Note: the repeated `Hero.js` filename across page folders is fine — it's a consistent folder-scoped convention, and the five files are genuinely different content.)
- **Chart naming is half-clear, half-vague.** `DoughnutChart` (clear) vs `VerticalGraph` (vague). Normalize to `DoughnutChart` + `BarChart`.

## Dead and legacy candidates

- **`dashboard/src/layout/Apps.js`** — placeholder returning `<h1>Apps</h1>`; no importers found via `grep -rn "Apps" dashboard/src`. Safe to delete after a final grep confirm.
- **`dashboard/src/charts/VerticalGraph.js` → exported `options`** — the module-level `export const options` appears to be consumed only internally by `VerticalGraph`. Not dead, but the export is unnecessary surface; make it module-local when renaming to `BarChart`. Verify with `grep -rn "from .*VerticalGraph" dashboard/src`.

_No other unused files surfaced. Hardcoded demo data (`pages/Funds.js` static figures, `data/watchlistSymbols.js`, seed scripts) is intentional and named appropriately._
