# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [root CLAUDE.md](../CLAUDE.md) for multi-app startup and the shared conventions summarized below.

## Commands

```bash
npm start        # CRA dev server, port 3000 (ESLint plugin disabled — see lint below)
npm run build    # production build (ESLint plugin disabled)
npm test         # Jest + React Testing Library (watch mode)
CI=true npm test # single non-watch run (use this in agent/CI contexts)
npm test -- --testPathPattern=MyComponent   # single file
npm run lint     # ESLint over src/ (uses the root .eslintrc.json) — THIS is the lint gate
npm run format   # prettier --write
```

CRA's webpack ESLint pass is disabled via `DISABLE_ESLINT_PLUGIN=true` in the `start`/`build` scripts. Run `npm run lint` explicitly before committing.

**Known lint warnings (don't "fix" without ask):** 6 `jsx-a11y/alt-text` in `landing_page/home/{Awards,Education}.js` + `landing_page/pricing/Hero.js`. Pre-existing and tolerated.

## Architecture

Standard Create React App. `src/index.js` mounts `AppLayout` — a `BrowserRouter` wrapping shared `Navbar` + `Footer` with page routes between them.

### Source tree

```
src/
  index.js          imports ./styles/index.css and mounts AppLayout
  config.js         BACKEND_URL, GOOGLE_AUTH_URL, GITHUB_URL, PORTFOLIO_URL
  styles/           5-file CSS split — see uistyle rule
  data/             hardcoded UI content: footerLinks, navItems, faqLinks,
                    teamMembers, universeItems
  landing_page/
    shared/         Navbar, Footer, NotFound, OpenAccount
    components/     reusable subcomponents: PageHero, FeatureBlock,
                    PricingTable, SignupCTAButton,
                    FooterColumn, FAQLinkColumn, TeamMemberCard,
                    UniverseTile
    home/  about/  products/  pricing/  support/
```

### Theme — light only

No dark mode (removed). There is no theme toggle, no `data-theme` attribute, and no `[data-theme="dark"]` CSS. `styles/index.css` imports 4 files (no `dark-mode.css`); `tokens.css` is the canonical light-only token set. Do not add `prefers-color-scheme` blocks or a `dark-invert` class.

### Routes

| Path | Component |
|---|---|
| `/` | `home/HomePage` |
| `/signup` | redirect → `/` (`<Navigate replace>`) |
| `/login` | redirect → `/` (`<Navigate replace>`) |
| `/about` | `about/AboutPage` |
| `/product` | `products/ProductsPage` |
| `/pricing` | `pricing/PricingPage` |
| `/support` | `support/SupportPage` |
| `*` | `shared/NotFound` |

### Config

`src/config.js` exports:
- `BACKEND_URL` — defaults to `http://localhost:3002`; override via `REACT_APP_BACKEND_URL`
- `GOOGLE_AUTH_URL` (`${BACKEND_URL}/auth/google`), `GITHUB_URL`, `PORTFOLIO_URL` — single source for sign-in/profile links

Auth is **Google OAuth 2.0**, server-side. There are no `/login` or `/signup` pages (deleted); the navbar's single "Sign up" CTA and every signup CTA do `window.location.href = GOOGLE_AUTH_URL`. The backend runs the flow, sets the httpOnly cookie, and redirects to the dashboard. On error the backend (and the dashboard on logout) redirect to the frontend `/login` → which is a `<Navigate to="/" replace />`, so keep those redirect routes (don't let them 404). No auth `fetch`/axios calls remain in the frontend.

### Styling

All styles live in `src/styles/` as the 5-file split. **No per-component CSS files** — adding one is a regression. Match new selectors to the file that owns their role, and preserve the fixed `@import` cascade order in `index.css`.

**Bootstrap**: loaded via CDN in `public/index.html` — it is NOT in `package.json`. Do not run `npm install bootstrap`.

**Responsive grid**: two-column sections use `col-12 col-md-6` (stacks at <768px). Breakpoints in use: 768px (md) and 576px (sm).

### Hardcoded content lives in `src/data/`

Footer columns, nav items, FAQ groups, team members, partner tiles — each is `export const NAME_IN_SCREAMING_SNAKE` in `src/data/<name>.js`. Components import the array and render via the matching `landing_page/components/<Name>Card` subcomponent where applicable. Embedding the array back in the component file is a regression.
