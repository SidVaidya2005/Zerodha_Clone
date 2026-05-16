# Contributing

Thanks for taking the time to contribute. This repo is a learning project — small, focused PRs land best.

## Setup

See the [README](README.md) for environment variables, install commands, and how to run each of the three apps. App-specific conventions are documented in each app's `CLAUDE.md`:

- [`backend/CLAUDE.md`](backend/CLAUDE.md) — Express layered structure.
- [`frontend/CLAUDE.md`](frontend/CLAUDE.md) — Marketing React app.
- [`dashboard/CLAUDE.md`](dashboard/CLAUDE.md) — Trading dashboard + Yahoo Finance proxy.

One-time after cloning, also run `npm install` at the **repo root** — root-level devDependencies hold the ESLint config that all three apps inherit from.

## Branch and commit conventions

- Branch off `main`. Name branches `<scope>/<short-description>` — e.g. `backend/add-pagination`, `dashboard/fix-watchlist-poll`.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat(dashboard): ...`, `fix(backend): ...`, `docs: ...`, `chore: ...`, `refactor: ...`, `test: ...`, `ci: ...`.
- Write descriptive commit bodies. The "why" matters more than the "what" — the diff already shows the what.
- Prefer creating new commits over `git commit --amend` once a commit is shared.

## Lint and format gates

Each app has its own gate — run them before pushing:

```bash
cd backend  && npm run lint && npm run format:check
cd frontend && npm run lint && npm run format:check
cd dashboard && npm run lint && npm run format:check
```

The root `.eslintrc.json` is the single source of truth for lint config (two override blocks: Node CJS for `backend/**` + `dashboard/server.js`, CRA `react-app` for `frontend/src/**` + `dashboard/src/**`). Lint runs from each app's directory and resolves the root config automatically.

`npm run build` no longer lints inline (CRA's webpack plugin is disabled via `DISABLE_ESLINT_PLUGIN=true` to avoid a `react-app` preset double-load). `npm run lint` is the gate.

## Architectural conventions

Three rule files in `.claude/rules/` summarize the structural rules — they apply to humans and AI contributors alike:

- [`architecture.md`](.claude/rules/architecture.md) — backend layers, CSS split, dashboard role-grouped folders, shared-token mirroring.
- [`codestyle.md`](.claude/rules/codestyle.md) — 150-LOC component threshold, hooks own side effects, named-function controllers, CJS vs ESM.
- [`uistyle.md`](.claude/rules/uistyle.md) — CSS selector routing, cascade order, dark-mode policy.

Read these before making structural changes. If your change conflicts with a rule, update the rule file in the same PR and call it out in the description.

## Pull requests

- One focused concern per PR. If you find unrelated cleanup along the way, file it separately.
- CI must pass (lint, format:check, build, tests once they exist).
- Tag `@SidVaidya2005` for review.
- For multi-phase work, prefer a series of small PRs over one large PR — the project follows a "phase-gate" workflow where each phase lands as its own commit and awaits review before the next phase begins.

## Reporting bugs and requesting features

- **Bugs:** open a GitHub issue with reproduction steps, expected vs actual behavior, and which app is affected.
- **Features:** open an issue describing the use case first. For large features, agree on the design before writing code.
- **Security issues:** see [SECURITY.md](SECURITY.md) — do not file public issues.
