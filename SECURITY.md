# Security Policy

## Reporting a Vulnerability

If you discover a security issue, please report it privately:

- Open a [GitHub Security Advisory](https://github.com/SidVaidya2005/ZerodhaRebuild/security/advisories/new) (preferred), or
- Email <siddarthvaidya2005@gmail.com> with the subject `SECURITY: <short description>`.

**Do not file a public issue or PR for security bugs.** This is a learning project — there is no formal SLA, but reports are reviewed as soon as possible.

When reporting, include:

- The affected component (`backend`, `frontend`, `dashboard`, or the `dashboard/server.js` proxy).
- Steps to reproduce.
- Impact (data exposure, RCE, auth bypass, etc.).
- Suggested fix if you have one.

## Supported Versions

This project is pre-1.0. Only the latest commit on `main` is supported. Older commits, branches, and forks receive no security updates.

| Version  | Supported          |
| -------- | ------------------ |
| `main`   | :white_check_mark: |
| Anything else | :x:           |

## Scope

In-scope:

- The three Node/Express + React apps in this repo.
- The Yahoo Finance proxy server (`dashboard/server.js`).
- Sample data + seed scripts.

Out of scope:

- Third-party services (MongoDB Atlas, Yahoo Finance, Alpha Vantage). Report those to the respective vendors.
- Issues that require an attacker to already control the user's machine or the database directly.

## How transitive dependency alerts are handled

The two frontend apps (`frontend/` and `dashboard/`) build through Create React App (`react-scripts@5.0.1`), which is unmaintained and pins a number of transitive dependencies to versions GitHub flags with security advisories. Where the upstream fix is available behind a clean dependency override, we apply it. Where the override risks breaking the build chain, we dismiss the alert and track a longer-term migration plan here.

Backend has no open transitive alerts.

### Currently overridden transitive dependencies

These are forced to fixed versions via the `overrides` field in `frontend/package.json` and `dashboard/package.json`. The override applies to every nested copy in the dep tree.

| Package | Forced version | Original vulnerable nested path |
| --- | --- | --- |
| `underscore` | `^1.13.8` | `jsonpath` |
| `serialize-javascript` | `^7.0.5` | `css-minimizer-webpack-plugin`, `rollup-plugin-terser` |
| `postcss` | `^8.4.31` | `resolve-url-loader/node_modules/postcss@7.0.39` |
| `nth-check` | `^2.0.1` | `svgo/node_modules/nth-check@1.0.2` |

When a Dependabot alert reopens on any of these packages, bumping the right-hand-side of the override is the normal fix.

### Known accepted risks (dismissed Dependabot alerts)

The following transitive deps are pinned by `react-scripts@5.0.1` and have **no clean fix path** short of replacing CRA. All are dev-time, build-time, or test-time only — they do **not** ship in the production bundle. We have dismissed these alerts as `tolerable_risk` rather than force a multi-major upgrade that would break `npm start` / `npm test` / `npm run build`.

| Package | Reached via | Why pinned | Practical exposure |
| --- | --- | --- | --- |
| `webpack-dev-server` (4.x) | `react-scripts` | CRA's dev-server config is incompatible with v5 | `npm start` only; never in build output |
| `uuid` (8.x) | `sockjs` → `webpack-dev-server` → `react-scripts` | sockjs uses the v8 callback API | Dev-server only |
| `@tootallnate/once` (1.x) | `http-proxy-agent@4` → `react-scripts` | `http-proxy-agent` v4 pins the v1 API; v5 of the agent is the upstream fix | Dev tooling (proxy chain) only |

Last reviewed: 2026-05-23. If a new alert appears on a package in this table, re-verify the rationale before re-dismissing.

## Migration tracker

The eventual fix for the dismissed alerts above is to replace `react-scripts` with a maintained bundler. Recommended target: **Vite**. Migration covers `frontend/` and `dashboard/` separately and removes the entire CRA-rooted vulnerable dep tree in one stroke.

This work is not yet scheduled. Open a tracking issue and link it here when planning starts.
