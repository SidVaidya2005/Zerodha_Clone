## Plan: Frontend UI/UX Update & Refactoring

This plan restructures the execution into more granular, logical phases. By fixing underlying mechanics first and abstracting repetitive components, styling and dark mode updates later will affect the codebase instantly and cleanly.

**Steps**

**Phase 1: Foundation (Routing & Mechanics)**

1. Implement a `ScrollToTop` component logic in `frontend/src/index.js` (using `useLocation` with `window.scrollTo(0,0)`) so the page correctly resets viewports on route transitions.
2. Audit all `<a>` tags and `<Link>` components globally.
3. Fix broken links using this strategy:
   - Internal routes (`/signup`, `/about`, `/product`, `/pricing`, `/support`) → use React Router `<Link>`
   - External Zerodha pages with no internal equivalent → use real `https://zerodha.com/...` URLs
   - Footer links: map applicable items to internal routes, use real Zerodha URLs for the rest
   - Known broken links: `Footer.js` (~20 links all `href="#"`), `about/Hero.js` (`href=""`), `products/Hero.js` (`href=""`), `pricing/DematAMC.js` (`href=""`)

**Phase 2: Component Abstraction (De-duplication)**

4. Create a reusable `<SignupCTAButton />` in `frontend/src/landing_page/components/SignupCTAButton.js` to abstract the identical "Signup Now" button in `OpenAccount.js`, `home/Hero.js`, and `products/Universe.js`. All three share class `p-2 btn btn-primary fs-5 mb-5 app-cta-button` — replace with the new component.

5. Create a `<PageHero title="..." subtitle="..." />` component to standardize only the two Hero files that share a simple title+subtitle pattern: `home/Hero.js` and `products/Hero.js`. Leave `about/Hero.js` (2-col rich text) and `pricing/Hero.js` (3-col stats grid) as-is — they are structurally unique and do not benefit from this abstraction.

6. Merge the existing `LeftSection.js` and `RightSection.js` in `frontend/src/landing_page/products/` into a single `<FeatureBlock align="left|right" />` component, replacing both files. Make `tryDemo`, `googlePlay`, and `appStore` optional props that only render when provided (currently only used in left-aligned instances).

7. Create a `<PricingTable />` component to encapsulate the shared DOM pattern (`app-pricing-section > h2.app-pricing-heading > div.table-responsive > table.app-pricing-table`) used in `AccountOpeningCharges.js`, `DematAMC.js`, and `ValueAddedServices.js`. Accept `title`, `headers`, `rows`, and optional `footnote` as props.

**Phase 3: Theming Layer (Dark Mode & Base CSS)**

8. Update `frontend/src/index.css` to bridge raw Bootstrap utility classes to the existing custom properties (`--app-link`, `--app-surface`, `--app-bg`, etc.).

9. Verify and resolve hardcoded `btn-primary` classes — but only for the 3 CTA signup buttons (`home/Hero.js`, `OpenAccount.js`, `products/Universe.js`), migrating them to `<SignupCTAButton />` and `--app-link` tokens. Do NOT replace `btn-primary` in `support/Hero.js` (different action), `signup/SignupForm.js` (already has `.app-signup-btn` override), or `NotFound.js` (different action) — instead ensure their colors are correctly driven by CSS variable overrides.

10. Apply the `.dark-invert` class to the **remaining** SVGs and logos not yet covered. Already applied: `home/Hero.js`, `home/Awards.js`, `home/Stats.js`, `products/LeftSection.js` (→ FeatureBlock), `products/RightSection.js` (→ FeatureBlock). Still needed: Navbar logo (`media/images/logo.svg`), Footer logo, and partner/third-party brand logos in the products page (sensibull, tijori, smallcase, varsity, ditto, zerodha fundhouse).

**Phase 4: Global Layout Styling (Navbar & Footer)**

11. Repaint the Navbar (`Navbar.js` and `index.css`). Introduce the requested glassmorphism effect (using `--app-surface` background with `rgba` and `backdrop-filter: blur()`), and refine dropdown or link hover behaviors.

12. Redesign the Footer (`Footer.js`). Clean up grid alignment, ensure semantic typography scale (effective usage of `--app-muted`), and establish professional padding and link hover aesthetics.

**Phase 5: Responsive Polish & Final Audit**

13. Audit all component layouts and pages on mobile dimensions using Chrome DevTools or similar, ensuring Bootstrap's responsive display classes (like `p-3 p-md-5`) correctly buffer components at narrower widths without shifting the core grid.

**Relevant files**

- `frontend/src/index.js` — Routing scroll behavior.
- `frontend/src/index.css` — Core theme variables, typography fixes, and specific Navbar/Footer CSS.
- `frontend/src/landing_page/components/` (new) — Holding the abstracted components (`PageHero`, `SignupCTAButton`, `FeatureBlock`, `PricingTable`).
- `frontend/src/landing_page/Navbar.js` & `Footer.js` — Core layout changes, `.dark-invert`, and link fixes.
- `frontend/src/landing_page/products/LeftSection.js` & `RightSection.js` — Replaced by `FeatureBlock`.
- `frontend/src/landing_page/home/Hero.js`, `OpenAccount.js`, `products/Universe.js` — Signup CTA replaced by `<SignupCTAButton />`.
- `frontend/src/landing_page/pricing/AccountOpeningCharges.js`, `DematAMC.js`, `ValueAddedServices.js` — Refactored to use `<PricingTable />`.

**Verification**

1. Test all links (Navbar, Body, CTAs, Footer) to confirm absolutely no 404s, hash URLs (`#`), or empty `href=""` attributes remain.
2. Route transitions must explicitly spawn at the `window.scrollY = 0` coordinate.
3. Trigger Dark Mode persistently via `AppLayout` and traverse the site observing: (A) Correct visual rendering of SVG logos (`.dark-invert`), (B) Legible contrast for CTA buttons, (C) Glassmorphism active over scrolled text in Navbar.
4. Scale screen to 320px/480px thresholds to observe graceful collapses of the improved Footer and the new abstracted components.

**Decisions**

- By establishing Reusable Components (Phase 2) _before_ Dark Mode CSS updates (Phase 3), the required styling footprint physically shrinks—meaning we only style the CSS rules _once_ to apply them to 10+ pages seamlessly.
- Architecture rules stipulate preserving core routing structure and file boundaries; no external UI package besides standard base Bootstrap and native app styles.
- Footer link resolution: internal app routes (`/signup`, `/about`, `/product`, `/pricing`, `/support`) where applicable, real Zerodha URLs for the rest.
- `btn-primary` migration is scoped only to the 3 identical signup CTA buttons — other `btn-primary` usages retain their class with CSS variable color overrides.
- `PageHero` abstraction covers only `home/Hero.js` and `products/Hero.js`; About and Pricing Heroes are structurally unique and stay as-is.
- `FeatureBlock` is a merge/replace of existing `LeftSection.js` + `RightSection.js`, not a new addition alongside them.
