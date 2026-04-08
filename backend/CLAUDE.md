# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and environment variable setup.

## Commands

```bash
npm run dev            # start with nodemon (auto-restarts on change)
npm start              # start without nodemon
npm run seed:holdings  # wipe + reseed the holdings collection
npm run seed:positions # wipe + reseed the positions collection
```

## Architecture

All application logic lives in a single file: `index.js`. There is no router layer — routes are defined inline. The `model/` directory exports Mongoose models; `schemas/` contains the schema definitions they import.

### Data Models

| Model | Key fields |
|---|---|
| `HoldingsModel` | `name`, `qty`, `avg`, `price`, `net` (string %), `day` (string %) |
| `PositionsModel` | `product`, `name`, `qty`, `avg`, `price`, `net`, `day`, `isLoss` |
| `OrdersModel` | `name`, `qty`, `price`, `mode` (`"BUY"` or `"SELL"`), `createdAt` (auto via timestamps) |

### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/allHoldings` | Returns all documents from `HoldingsModel` |
| GET | `/allPositions` | Returns all documents from `PositionsModel` |
| GET | `/allOrders` | Returns orders sorted newest-first |
| POST | `/newOrder` | Places an order and mutates holdings/positions |

### Order Logic (critical — spans three collections)

`POST /newOrder` accepts `{ name, qty, price, mode }` and does the following after saving to `OrdersModel`:

- **BUY**: upserts `HoldingsModel`. If the stock exists, recalculates a weighted average price (`(oldAvg * oldQty + price * qty) / totalQty`). If not, creates a new record.
- **SELL**: upserts `PositionsModel` (adds qty), then decrements `HoldingsModel` qty. If remaining qty ≤ 0, the holdings record is deleted.

`net` and `day` percentage strings on Holdings/Positions are static strings stored at creation time — they are not recalculated on subsequent updates.

### Seeding

Both seed scripts (`seedHoldings.js`, `seedPositions.js`) call `deleteMany({})` before inserting, so they reset the collection completely. Requires `MONGO_URL` in `.env`.
