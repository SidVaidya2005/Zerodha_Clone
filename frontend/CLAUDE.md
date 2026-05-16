# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and `.claude/rules/{architecture,codestyle,uistyle}.md` for the conventions summarized below.

## Commands

```bash
npm start        # CRA dev server, port 3000 (ESLint plugin disabled — see lint below)
npm run build    # production build (ESLint plugin disabled)
npm test         # Jest + React Testing Library
npm test -- --testPathPattern=MyComponent   # single file
npm run lint     # ESLint over src/ (uses the root .eslintrc.json) — THIS is the lint gate
npm run format   # prettier --write
```

CRA's webpack ESLint pass is disabled via `DISABLE_ESLINT_PLUGIN=true` in the `start`/`build` scripts. Run `npm run lint` explicitly before committing.

## Architecture

Standard Create React App. `src/index.js` mounts `AppLayout` — a `BrowserRouter` wrapping shared `Navbar` + `Footer` with page routes between them.

### Source tree

```
src/
  index.js          imports ./styles/index.css and mounts AppLayout
  config.js         BACKEND_URL, DASHBOARD_URL (env-overridable)
  styles/           5-file CSS split — see uistyle rule
  data/             hardcoded UI content: footerLinks, navItems, faqLinks,
                    teamMembers, universeItems
  landing_page/
    shared/         Navbar, Footer, NotFound, OpenAccount
    components/     reusable subcomponents: PageHero, FeatureBlock,
                    PricingTable, SignupCTAButton, FormField,
                    FooterColumn, FAQLinkColumn, TeamMemberCard,
                    UniverseTile
    home/  about/  products/  pricing/  support/
    signup/         Signup.js, SignupForm.js, validation.js
```

### Theme system

`AppLayout` manages a three-state theme (`"light"`, `"dark"`, `"system"`) persisted to `localStorage` under `"zerodha-theme-mode"`. The resolved theme is written as a `data-theme` attribute on `<html>`. CSS uses `[data-theme="dark"]` selectors only — never `prefers-color-scheme` media queries. The "system" setting at the JS layer reads `prefers-color-scheme` and writes the resolved value.

### Routes

| Path | Component |
|---|---|
| `/` | `home/HomePage` |
| `/signup` | `signup/Signup` |
| `/about` | `about/AboutPage` |
| `/product` | `products/ProductsPage` |
| `/pricing` | `pricing/PricingPage` |
| `/support` | `support/SupportPage` |
| `*` | `shared/NotFound` |

### Config

`src/config.js` exports:
- `BACKEND_URL` — defaults to `http://localhost:3002`; override via `REACT_APP_BACKEND_URL`
- `DASHBOARD_URL` — defaults to the hardcoded Render deployment URL; override via `REACT_APP_DASHBOARD_URL`

The frontend does not use axios — fetch and direct links handle any network calls (notably the signup form redirect to the dashboard).

### Styling

All styles live in `src/styles/` as the 5-file split. **No per-component CSS files** — adding one is a regression. Selector-routing rules and the cascade order are in `.claude/rules/uistyle.md`.

**Bootstrap**: loaded via CDN in `public/index.html` — it is NOT in `package.json`. Do not run `npm install bootstrap`.

**Responsive grid**: two-column sections use `col-12 col-md-6` (stacks at <768px). Breakpoints in use: 768px (md) and 576px (sm).

**Dark mode images**: add the `dark-invert` utility class to dark-on-transparent images. CSS applies `filter: invert(1) hue-rotate(180deg)` under `[data-theme="dark"]`.

### Hardcoded content lives in `src/data/`

Footer columns, nav items, FAQ groups, team members, partner tiles — each is `export const NAME_IN_SCREAMING_SNAKE` in `src/data/<name>.js`. Components import the array and render via the matching `landing_page/components/<Name>Card` subcomponent where applicable. Embedding the array back in the component file is a regression — see `.claude/rules/architecture.md`.
