# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and environment variable setup, and `.claude/rules/architecture.md` for the layer responsibilities summarized below.

## Commands

```bash
npm run dev            # nodemon, auto-restarts on change
npm start              # without nodemon
npm run seed:holdings  # wipe + reseed the holdings collection
npm run seed:positions # wipe + reseed the positions collection
npm run lint           # eslint over the backend (uses the root .eslintrc.json)
npm run format         # prettier --write
```

## Architecture

`index.js` is wiring only (target ≤35 LOC; currently 31): dotenv → express → cors → body-parser → mongoose connect → `app.use(require('./routes/X'))` → `app.listen`. Business logic lives in the three layers below:

```
routes/        path → controller mapping (one file per resource)
controllers/   parse input, call service, format response
services/      multi-document / multi-collection mutations
model/         mongoose.model('Name', schema)
schemas/       schema definitions imported by model/
seed/          seedHoldings.js, seedPositions.js
```

**Adding an inline route handler in `index.js` is a regression** — the entire point of the layering is that the bisectable history of `index.js` stays small and noise-free.

### Data models

| Model            | Key fields                                                                              |
| ---------------- | --------------------------------------------------------------------------------------- |
| `HoldingsModel`  | `name`, `qty`, `avg`, `price`, `net` (string %), `day` (string %)                       |
| `PositionsModel` | `product`, `name`, `qty`, `avg`, `price`, `net`, `day`, `isLoss`                        |
| `OrdersModel`    | `name`, `qty`, `price`, `mode` (`"BUY"` or `"SELL"`), `createdAt` (auto via timestamps) |

### API endpoints

| Method | Path            | Controller                                                 |
| ------ | --------------- | ---------------------------------------------------------- |
| GET    | `/allHoldings`  | `holdingsController.getAllHoldings`                        |
| GET    | `/allPositions` | `positionsController.getAllPositions`                      |
| GET    | `/allOrders`    | `ordersController.getAllOrders` (sorted newest-first)      |
| POST   | `/newOrder`     | `ordersController.createOrder` → `orderService.placeOrder` |

### Cross-collection mutation lives in `orderService`

`POST /newOrder` saves to `OrdersModel` in the controller, then delegates to `orderService.placeOrder({ name, qty, price, mode })`. The service owns the three-collection side effects:

- **BUY** → `applyBuyEffects`: upserts `HoldingsModel`. If the stock exists, recalculates a weighted average: `(oldAvg * oldQty + price * qty) / totalQty`. Otherwise creates a new record.
- **SELL** → `applySellEffects`: upserts `PositionsModel` (adds qty), then decrements `HoldingsModel.qty`. If remaining qty ≤ 0, the holdings record is deleted.

`net` and `day` percentage strings on Holdings/Positions are static — set at creation time, never recalculated on subsequent updates.

**New cross-collection logic belongs in a service, not a controller.** Controllers that touch more than one collection are the smell.

### Controller export shape

Named function exports only: `module.exports = { getAllHoldings, ... }`. No class methods — `r.get('/x', controller.method)` would break `this` binding.

### Seeding

Both seed scripts call `deleteMany({})` before inserting, so they reset the collection completely. Requires `MONGO_URL` in `.env`. Running them in production would be catastrophic — keep them out of any deploy pipeline.
