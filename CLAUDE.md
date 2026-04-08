# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zerodha-inspired trading platform clone with three independently-runnable apps sharing one MongoDB database. Each app has its own `CLAUDE.md` with specific guidance:

- [backend/CLAUDE.md](backend/CLAUDE.md) — Express REST API (port 3002)
- [frontend/CLAUDE.md](frontend/CLAUDE.md) — Public/marketing React app (port 3000)
- [dashboard/CLAUDE.md](dashboard/CLAUDE.md) — Trading dashboard React app (port 3001) + stock price proxy server (port 3001, same process)

## Running the Project

Each app runs in a separate terminal from its own directory:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start

# Terminal 3
cd dashboard && npm run dev    # starts both React app + proxy server
```

## System Architecture

```
frontend (React, port 3000)
    └── calls backend directly via REACT_APP_API_URL

dashboard (React, port 3000 in dev)
    ├── calls backend (port 3002) for holdings, positions, orders
    └── calls proxy server (port 3001) for live stock prices

proxy server (Express, port 3001) — dashboard/server.js
    └── fetches from Yahoo Finance (yahoo-finance2) for NSE/BSE quotes

backend (Express, port 3002)
    └── MongoDB via Mongoose
```

## Environment Variables

### `backend/.env`
```
PORT=3002
MONGO_URL=<mongodb connection string>
NODE_ENV=development
```

### `frontend/.env.local`
```
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_DASHBOARD_URL=http://localhost:3001
```

### `dashboard/.env.local`
```
REACT_APP_BACKEND_URL=http://localhost:3002
REACT_APP_PROXY_URL=http://localhost:3001
```

In production, both `REACT_APP_BACKEND_URL` and `REACT_APP_PROXY_URL` must be set explicitly — the dashboard falls back to same-origin (empty string) and logs a warning if they are missing.
