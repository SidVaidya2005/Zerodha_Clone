# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and environment variable setup, and `.claude/rules/architecture.md` for the layer responsibilities summarized below.

## Commands

```bash
npm run dev            # nodemon, auto-restarts on change
npm start              # without nodemon
npm test               # jest + supertest against an in-memory MongoDB (mongodb-memory-server)
npm run test:watch     # jest --watch
npm run seed:holdings  # wipe + reseed the holdings collection
npm run seed:positions # wipe + reseed the positions collection
npm run lint           # eslint over the backend (uses the root .eslintrc.json)
npm run format         # prettier --write
```

## Architecture

`index.js` is process startup only (~21 LOC): dotenv → mongoose connect → `buildApp()` → `app.listen`. The express wiring lives in `app.js`, which exports `buildApp()` (express + cors + body-parser + routes). The split exists so tests can `require("../app")` and hand `buildApp()` to supertest without binding a port. Business logic lives in the layers below:

```
routes/        path → controller mapping (one file per resource)
controllers/   parse input, call service, format response
services/      multi-document / multi-collection mutations
middleware/    express middleware (requireAuth)
model/         mongoose.model('Name', schema)
schemas/       schema definitions imported by model/
seed/          seedHoldings.js, seedPositions.js
tests/         supertest specs (holdings, orders, positions, auth) + setup.js (spawns mongodb-memory-server)
```

**Adding an inline route handler in `index.js` or `app.js` is a regression** — the layering keeps both files small and noise-free, and keeps `buildApp()` test-friendly.

### Data models

| Model            | Key fields                                                                              |
| ---------------- | --------------------------------------------------------------------------------------- |
| `HoldingsModel`  | `name`, `qty`, `avg`, `price`, `net` (string %), `day` (string %)                       |
| `PositionsModel` | `product`, `name`, `qty`, `avg`, `price`, `net`, `day`, `isLoss`                        |
| `OrdersModel`    | `name`, `qty`, `price`, `mode` (`"BUY"` or `"SELL"`), `createdAt` (auto via timestamps) |
| `UserModel`      | `fullName`, `email` (lowercase, unique), `phoneNumber`, `passwordHash`, `createdAt`     |

### API endpoints

| Method | Path            | Controller                                                 |
| ------ | --------------- | ---------------------------------------------------------- |
| GET    | `/allHoldings`  | `holdingsController.getAllHoldings`                        |
| GET    | `/allPositions` | `positionsController.getAllPositions`                      |
| GET    | `/allOrders`    | `ordersController.getAllOrders` (sorted newest-first)      |
| POST   | `/newOrder`     | `ordersController.createOrder` → `orderService.placeOrder` |
| POST   | `/signup`       | `authController.signup` — 201 + cookie, 409 if email taken |
| POST   | `/login`        | `authController.login` — 200 + cookie, 401 on bad creds    |
| GET    | `/me`           | `authController.me` (behind `requireAuth`) — 200 / 401     |
| POST   | `/logout`       | `authController.logout` — 204 + clears the cookie          |

Holdings / positions / orders endpoints are **not** behind `requireAuth` — the dashboard gates access at the React layer, the backend serves global demo data. If those become user-scoped later, add `requireAuth` to their route registrations.

### Cross-collection mutation lives in `orderService`

`POST /newOrder` saves to `OrdersModel` in the controller, then delegates to `orderService.placeOrder({ name, qty, price, mode })`. The service owns the three-collection side effects:

- **BUY** → `applyBuyEffects`: upserts `HoldingsModel`. If the stock exists, recalculates a weighted average: `(oldAvg * oldQty + price * qty) / totalQty`. Otherwise creates a new record.
- **SELL** → `applySellEffects`: upserts `PositionsModel` (adds qty), then decrements `HoldingsModel.qty`. If remaining qty ≤ 0, the holdings record is deleted.

`net` and `day` percentage strings on Holdings/Positions are static — set at creation time, never recalculated on subsequent updates.

**New cross-collection logic belongs in a service, not a controller.** Controllers that touch more than one collection are the smell.

### Auth

JWT in an httpOnly cookie named `auth`. `authService` owns the four primitives — `hashPassword` / `verifyPassword` (bcryptjs, 10 rounds) and `signToken` / `verifyToken` (jsonwebtoken, 7-day expiry). Token payload is `{ sub: userId, name: fullName }`.

Cookie shape (set by `authController` via `res.cookie("auth", token, ...)`):

- Dev (`NODE_ENV!=="production"`): `httpOnly; sameSite=lax; secure=false; path=/; maxAge=7d`
- Prod: `httpOnly; sameSite=none; secure=true; ...` — required for cross-site cookies on HTTPS

No domain is set, so the cookie is host-scoped. On localhost that means all three apps share it across ports (cookies ignore port). In prod the frontend, dashboard, and backend must share an apex domain OR all live behind one reverse proxy for the cookie to be sent.

`middleware/requireAuth.js` reads `req.cookies.auth`, verifies, attaches `req.user = { id, fullName }`, or returns 401. Apply it per-route, not globally — most existing endpoints stay public.

**Stateless JWT caveat**: `POST /logout` only clears the cookie. A stolen token remains valid until the 7-day expiry. If true revocation is needed, add a token denylist or switch to server-side sessions.

CORS in `app.js` builds an explicit allowlist from `FRONTEND_URL` + `DASHBOARD_URL` env vars (falls back to `localhost:3000` + `localhost:3004` in dev) with `credentials: true`. Wildcard origins are not allowed by browsers when cookies are involved.

`JWT_SECRET` is **required** at runtime — `authService` throws if it's unset. Tests in `tests/auth.test.js` set it inline.

### Controller export shape

Named function exports only: `module.exports = { getAllHoldings, ... }`. No class methods — `r.get('/x', controller.method)` would break `this` binding.

### Seeding

Both seed scripts call `deleteMany({})` before inserting, so they reset the collection completely. Requires `MONGO_URL` in `.env`. Running them in production would be catastrophic — keep them out of any deploy pipeline.
