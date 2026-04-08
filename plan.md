## Plan: Frontend UI/UX Update & Refactoring

This plan restructures the execution into more granular, logical phases. By fixing underlying mechanics first and abstracting repetitive components, styling and dark mode updates later will affect the codebase instantly and cleanly.

**Steps**

**Phase 1: Foundation (Routing & Mechanics)**

1. Implement a `ScrollToTop` component logic in `frontend/src/index.js` (using `useLocation` with `window.scrollTo(0,0)`) so the page correctly resets viewports on route transitions.
2. Audit all `<a>` tags and `<Link>` components globally.
3. Replace empty placeholders (like `href="#"`), broken links, or trash redirects with proper paths or route them to legitimate destinations (e.g., `/about`, `/signup`, or real external URLs).

**Phase 2: Component Abstraction (De-duplication)** 4. Create a reusable `<SignupCTAButton />` to abstract the heavily duplicated "Signup Now" button (`OpenAccount.js`, `home/Hero.js`, `Universe.js`). 5. Create a `<PageHero title="..." subtitle="..." />` component to standardize the deeply repetitive `Hero.js` containers located in `/home`, `/about`, `/pricing`, `/products`. 6. Create a `<FeatureBlock align="left|right" />` to unify `LeftSection.js` and `RightSection.js` within the products page architecture. 7. Create a `<PricingTable />` component to encapsulate the large DOM strings for identical tables under `/pricing`.

**Phase 3: Theming Layer (Dark Mode & Base CSS)** 8. Update `frontend/src/index.css` to bridge raw Bootstrap utility classes to the existing custom properties (`--app-link`, `--app-surface`, `--app-bg`, etc.). 9. Verify and resolve hardcoded button classes (like `btn-primary`), migrating entirely to the new `<SignupCTAButton />` and `--app-link` tokens for perfect contrast in both themes. 10. Systematically apply the `.dark-invert` class to essential vector graphics, brand logos, and SVGs across the new components so they remain visible when the `[data-theme="dark"]` property triggers.

**Phase 4: Global Layout Styling (Navbar & Footer)** 11. Repaint the Navbar (`Navbar.js` and `index.css`). Introduce the requested glassmorphism effect (using `--app-surface` background with `rgba` and `backdrop-filter: blur()`), and refine dropdown or link hover behaviors. 12. Redesign the Footer (`Footer.js`). Clean up grid alignment, ensure semantic typography scale (effective usage of `--app-muted`), and establish professional padding and link hover aesthetics.

**Phase 5: Responsive Polish & Final Audit** 13. Audit all component layouts and pages on mobile dimensions using Chrome DevTools or similar, ensuring Bootstrap's responsive display classes (like `p-3 p-md-5`) correctly buffer components at narrower widths without shifting the core grid.

**Relevant files**

- `frontend/src/index.js` — Routing scroll behavior.
- `frontend/src/index.css` — Core theme variables, typography fixes, and specific Navbar/Footer CSS.
- `frontend/src/landing_page/components/` (new) — Holding the abstracted components (`PageHero`, `SignupCTAButton`, etc.).
- `frontend/src/landing_page/Navbar.js` & `Footer.js` — Core layout changes, `.dark-invert`, and link fixes.
- Various domain components (e.g., `Hero.js`, `LeftSection.js`) — Deprecating duplicated DOM code for shared partials.

**Verification**

1. Test all links (Navbar, Body, CTAs, Footer) to confirm absolutely no 404s, hash URLs (`#`), or unintended behaviors map incorrectly.
2. Route transitions must explicitly spawn at the `window.scrollY = 0` coordinate.
3. Trigger Dark Mode persistently via `AppLayout` and traverse the site observing: (A) Correct visual rendering of SVG logos (`.dark-invert`), (B) Legible contrast for CTA buttons, (C) Glassmorphism active over scrolled text in Navbar.
4. Scale screen to 320px/480px thresholds to observe graceful collapses of the improved Footer and the new abstracted components.

**Decisions**

- By establishing Reusable Components (Phase 2) _before_ Dark Mode CSS updates (Phase 3), the required styling footprint physically shrinks—meaning we only style the CSS rules _once_ to apply them to 10+ pages seamlessly.
- Architecture rules stipulate preserving core routing structure and file boundaries; no external UI package besides standard base Bootstrap and native app styles.
