# Architecture rules

Project layout and responsibilities for the three apps (`backend/`, `frontend/`, `dashboard/`). Every file should fit one of the buckets below. Adding a file in a location that doesn't match these rules is a smell — fix the structure or update this file.

## Backend layers

`backend/index.js` is wiring only: dotenv → express → cors → body-parser → mongoose connect → `app.use(require('./routes/X'))` → `app.listen`. Target ≤35 LOC. Adding business logic, controllers, or inline route handlers here is a regression.

| Layer | Responsibility |
|---|---|
| `routes/` | Path-to-controller mapping. No logic. One file per resource (`holdings.js`, `orders.js`, `positions.js`). |
| `controllers/` | Parse + validate input, call services, format response. Same `try/catch/log/500` shape across all endpoints. |
| `services/` | All multi-document or multi-collection mutations live here. `orderService.placeOrder` is the canonical example — it owns BUY/SELL effects across Orders + Holdings + Positions. |
| `model/` | `mongoose.model('Name', schema)` exports. |
| `schemas/` | Schema definitions imported by `model/`. |
| `seed/` | Standalone scripts. `npm run seed:holdings` and `npm run seed:positions` `deleteMany({})` first, then insert. |

A controller calling another controller is wrong — that means shared logic belongs in a service.

## Frontend / dashboard styles

Both apps follow the same 5-file CSS split in `src/styles/`:

```
src/styles/
  index.css       # @import the other 5 in fixed order
  tokens.css      # :root + [data-theme="dark"] var blocks only
  layout.css      # body, page wrappers, grid/flex shells
  components.css  # buttons, cards, modals, tables, forms
  utilities.css   # .dark-invert, .profit, .loss, helpers
  dark-mode.css   # every non-token [data-theme="dark"] selector
```

`src/index.js` imports `./styles/index.css` only. Per-component CSS files are not allowed — Phase 4 absorbed the dashboard's `BuyActionWindow.css` for this reason. Selector-routing details live in [[uistyle]].

## Hardcoded UI content lives in `src/data/`

Arrays of nav items, footer columns, FAQ groups, team members, partner tiles, watchlist symbols, chart palettes — all in `src/data/<name>.js` as `export const NAME_IN_SCREAMING_SNAKE`. Components import the array and render. Embedding the array in the component file is a regression.

When a component renders an array of similar things, the row markup also gets extracted to `landing_page/components/<Name>Card.js` (frontend) or a sibling component (dashboard).

## Dashboard role-grouped folders

`dashboard/src/components/` no longer exists. Each file is grouped by what it does:

| Folder | Contents |
|---|---|
| `layout/` | `Home`, `TopBar`, `Menu`, `Dashboard` — frame chrome. |
| `pages/` | One per route (`Summary`, `Holdings`, `Positions`, `Orders`, `Funds`) plus row components (`HoldingsRow`). |
| `widgets/<Name>/` | Self-contained widgets composed of multiple files. `widgets/WatchList/` holds `WatchList`, `WatchListItem`, `WatchListActions`, `AnalyticsModal`. |
| `modals/` | Floating overlays (`BuyActionWindow`). |
| `charts/` | Chart.js wrappers (`DoughnutChart`, `BarChart`). |
| `hooks/` | Custom hooks. See [[codestyle]] for what belongs here. |
| `context/` | React context providers (`BuyWindowContext`). |
| `utils/` | Pure functions (`portfolioUtils`). |
| `data/` | Hardcoded arrays/palettes. |

Adding a flat `components/` folder back is a regression.

## Shared design tokens

`shared/tokens.css` at the repo root is the canonical token set. CRA can't `@import` files outside `src/`, so each app keeps a byte-identical copy at `<app>/src/styles/tokens.css`. **Token changes must update all three files (canonical + both copies) in the same commit.** A `diff` against the canonical file must exit 0 for both apps.

## Reference

Layered file conventions: [[codestyle]]. CSS specifics: [[uistyle]].
