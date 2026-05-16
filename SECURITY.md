# Security Policy

## Reporting a Vulnerability

If you discover a security issue, please report it privately:

- Open a [GitHub Security Advisory](https://github.com/SidVaidya2005/Zerodha_Clone/security/advisories/new) (preferred), or
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
