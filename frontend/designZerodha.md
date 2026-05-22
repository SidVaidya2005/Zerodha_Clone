## Overview

Zerodha is India's largest stock brokerage, and its marketing site reads like the company's ethos made visual: calm, utilitarian, and almost aggressively un-flashy. The page is a stack of generously-spaced white bands (`{colors.canvas}` `#ffffff`) separated by air rather than rules, with copy set entirely in Inter and a single blue accent (`{colors.primary}` `#387ed1`) carrying every call-to-action, link, and hover. There are no gradients, no dark mode, no marketing theatrics — the surface trusts whitespace and a flat illustration system to do the work.

The decoration is restrained and editorial. A large flat-color hero illustration (`landing.svg`) opens the page above a quiet "Invest in everything" headline. Below it, a "Trust with confidence" band pairs four plain text blurbs against an ecosystem diagram, followed by a monochrome press-logo strip on a soft surface, three icon-led pricing tiles, and a free-education block. The page closes with a centered blue-CTA band ("Open a Zerodha account"). Imagery is always flat SVG or PNG illustration — never photography, never atmospheric overlays.

Type is deliberately conversational. The hero headline sits at only `1.75rem` (28px) Inter weight 500 — restrained to the point of modesty for a homepage hero — with a `1.25rem` weight-400 sub-heading beneath it. Body copy runs at 16px Inter with a notably airy `1.7` line-height, reinforcing the "read at your own pace" tone the brand explicitly markets.

**Key Characteristics:**
- A single chromatic accent — Zerodha blue `{colors.primary}` (`#387ed1`) — owns every primary CTA, link, and hover-in state. There is no secondary brand color.
- Bright white canvas (`{colors.canvas}` `#ffffff`) is the dominant surface, with soft off-whites (`{colors.canvas-soft}` `#fbfbfb`) reserved for the footer and quieter bands.
- Tight, near-rectangular button radii — `3px` (`{rounded.sm}`) for CTAs, `4px`–`8px` for cards. The brand never uses pill-shaped CTAs.
- Inter (weights 400 / 500 only) is the sole text face; Fontello provides the icon glyphs. There is no display or mono companion face.
- Flat illustration (SVG/PNG) is the only decorative system — no gradients, no photography, no drop-shadow theatrics.
- Extremely generous vertical rhythm: content bands carry 80–120px of section padding and body text a `1.7` line-height. Whitespace is the brand's signature.
- A consistent "hover-to-dark" interaction: blue CTAs and links resolve to near-black `{colors.ink-strong}` (`#222`) on hover rather than a tint of the accent.

## Colors

### Brand & Accent
- **Zerodha Blue** (`{colors.primary}` — `#387ed1`): The single brand accent. Used as the fill for every primary CTA, as link color, as nav/footer link hover, and as the active-state indicator. This blue IS the brand's chromatic identity — there is no competing accent.
- **Accent Wash** (`{colors.primary-wash}` — `rgba(142,193,255,0.15)`): A pale blue tint used as the resting fill for secondary "pill" links (e.g. SDK / utility chips), paired with `{colors.primary}` text.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The dominant page background. Nearly every content band sits on pure white.
- **Canvas Soft** (`{colors.canvas-soft}` — `#fbfbfb`): The footer fill and quiet alternate-band surface. A barely-there off-white.
- **Canvas Tint** (`{colors.canvas-tint}` — `#fafafb`): A second near-white used for subtle section separation.
- **Hairline** (`{colors.hairline}` — `#eeeeee`): 1px solid divider — footer top border, dropdown separators, nav shadow tone.
- **Hairline Strong** (`{colors.hairline-strong}` — `#cccccc`): 1px border for bounded cards such as the pricing-comparison boxes.

### Text
- **Ink** (`{colors.ink}` — `#424242`): Default body and heading text on canvas. The brand's primary reading color — a soft near-black, never pure `#000`.
- **Ink Strong** (`{colors.ink-strong}` — `#222222`): The hover-resolve color for CTAs and the darkest emphasis tone.
- **Body** (`{colors.body}` — `#666666`): Secondary body text — supporting paragraphs, nav links, footer links, captions.
- **Mute** (`{colors.mute}` — `#9b9b9b`): Lowest-priority text — copyright lines, fine print, social icons, footer "graveyard" links.
- **Link Hover** (`{colors.link-hover}` — `#444444`): The resolve color for inline text-link hover.

### Semantic
Zerodha surfaces a financial semantic palette across its product-adjacent pages (P&L, charges, notices):
- **Success / Positive** (`{colors.success}` — `#4caf50`, wash `#e5faed`): Gains, "free" tags, positive P&L.
- **Error / Negative** (`{colors.error}` — `#df514c`; deep `#f12d2d`; form error `#f6461a`): Losses, negative P&L, validation errors.
- **Warning** (`{colors.warning}` — `#fcb040`; border `#f7db78` on wash `rgba(218,212,27,0.17)`): Notice banners, attention dots.
- **Info** (`{colors.info-wash}` — `#eff6ff` / `#eff5ff`): Pale blue background for informational cards and icon chips.

## Typography

### Font Family
A single working face carries the entire system:
1. **Inter** for every display, body, button, link, label, and nav role. Only weights **400** and **500** are loaded — there is no light or bold extreme. Declared as `font-family: 'Inter', serif` with a serif system fallback.
2. **Fontello** is an icon-glyph font (`icon-arrow-right`, `icon-facebook-official`, etc.) — used purely for inline UI iconography, not text.
3. **monospace** appears only as the generic system fallback for rare code/figure contexts; the brand ships no dedicated mono face.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.h1}` | 28px (1.75rem) | 500 | 1.25 | 0 | Hero / page headline ("Invest in everything"). |
| `{typography.h2}` | 24px (1.5rem) | 500 | 1.5 | 0 | Section headlines ("Trust with confidence", "Unbeatable pricing"). |
| `{typography.h3}` | 20px (1.25rem) | 500 | 1.6 | 0 | Sub-section / blurb titles ("Customer-first always"). |
| `{typography.h4}` | 18px (1.125rem) | 500 | normal | 0 | Card titles, support headings. |
| `{typography.h5}` | 18px (1.125rem) | 400 | normal | 0 | Lighter sub-headings, name labels. |
| `{typography.h6}` | 18px (1.125rem) | 500 | normal | 0 | Minor card heads. |
| `{typography.subheading}` | 20px (1.25rem) | 400 | 1.7 | 0 | Hero sub-heading / lead paragraph. |
| `{typography.body}` | 16px (1rem) | 400 | 1.7 | 0 | Default body copy. |
| `{typography.body-sm}` | 14px (0.875rem) | 400 | 1.7 | 0 | Secondary body, footer columns. |
| `{typography.caption}` | 12px (0.75rem) | 400 | normal | 0 | Captions, nav product sub-labels. |
| `{typography.fineprint}` | ~10.4px (0.65rem) | 400 | 1.7 | 0 | Regulatory small-print paragraphs. |
| `{typography.nav-link}` | 14.4px (0.9rem) | 400 | normal | 0 | Top-nav link labels. |
| `{typography.button}` | ~19px (1.2em) | 500 | 1.2 | 0 | Primary button label. |

### Principles
- **Modest hero, weight 500.** The headline is only 28px — the brand reads as understated and trustworthy, not loud.
- **Only two weights exist.** 400 for narrative, 500 for emphasis and headings. No light, no black.
- **Airy line-height (1.7) is part of the voice.** Body copy is set loose and readable, reinforcing the "use it at your own pace" message.
- **Mobile scales the headings down a step**: h1 → 24px, h2 → 20px, h3 → 18px below the tablet breakpoint.

### Note on Font Substitutes
- **Inter** — open-source; load directly from Google Fonts (only 400 / 500 are required). A `serif` system fallback is declared.
- **Fontello** — a custom icon set; substitute with any equivalent SVG-icon system or a library such as Lucide for the arrow / social glyphs.

## Layout

### Spacing System
- **Base unit**: 5px, with heavy reliance on 10 / 20 / 40 px multiples.
- **Tokens**: `{spacing.xs}` 5px · `{spacing.sm}` 10px · `{spacing.md}` 15px · `{spacing.lg}` 20px · `{spacing.xl}` 25px · `{spacing.2xl}` 32px · `{spacing.3xl}` 40px · `{spacing.4xl}` 60px · `{spacing.5xl}` 80px · `{spacing.6xl}` 120px.
- **Section padding**: homepage content bands carry `{spacing.6xl}` 120px of bottom padding; standalone sections commonly use 80–110px top/bottom.
- **Body offset**: `padding-top: 65px` clears the 60px fixed navbar.
- **Card / box interior**: `{spacing.lg}`–`{spacing.xl}` (20–25px).

### Grid & Container
- **Container**: centers at `1100px` max-width with `20px` side gutters (`{spacing.lg}`); a narrower `mini-container` centers at `900px` for CTA bands.
- **Grid**: a 12-column flexbox system (`.row` + `.columns`). Named spans (`.five columns`, `.seven columns`, `.three columns`) resolve to percentage widths; columns collapse to `width: 100%` (full-stack) below the small breakpoint.
- **Hero**: single centered column — illustration, headline, sub-heading, CTA stacked and centered.
- **Trust band**: 5 / 7 split (text blurbs left, ecosystem illustration right).
- **Pricing**: 5 / 7 split — heading left, three inline icon tiles right.
- **Footer**: 3 / 9 split — brand block left, four link columns right.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 550px | All columns full-width; nav collapses to hamburger; headings step down. |
| Tablet | 550–767px | Multi-up grids begin; 2-up nav menu. |
| Small Desktop | 768–1099px | Full split layouts; container fluid under 1100px. |
| Desktop | ≥ 1100px | Fixed 1100px container; full hero and footer grids. |

#### Touch Targets
Primary buttons render at ~`42px` tall (`10px` vertical padding + `1.2em` line-height). Nav links carry `20px` of padding, giving large comfortable tap zones. Mobile nav items inflate to `7px` cell padding within a 2-up flex grid, comfortably meeting the WCAG 44×44px floor.

#### Collapsing Strategy
- **Nav**: full horizontal link row (Signup / About / Products / Pricing / Support) + hamburger at desktop; collapses to a hamburger-driven full menu with a product grid (Kite / Console / Kite Connect / Coin) on mobile.
- **Hero & split bands**: 5/7 and 5/6 splits stack to a single full-width column.
- **Pricing tiles**: inline icon tiles wrap and stack vertically.
- **Footer**: 4 link columns reflow to stacked full-width groups.

#### Image Behavior
- **Hero illustration** (`landing.svg`): flat-color SVG, capped at `45vh` height with `45–60px` bottom margin.
- **Ecosystem diagram** (`ecosystem.png`): responsive PNG inside the 7-column cell.
- **Press logos** (`press-logos.png`): single monochrome strip, `opacity: 0.8` on hover.
- **Pricing icons**: small flat SVGs (~85–120px) paired with 10px caption labels.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default for all content bands on canvas. |
| Level 1 — Hairline | 1px solid `{colors.hairline}` border. | Footer top border, dropdown separators, bounded pricing boxes (`{colors.hairline-strong}`). |
| Level 2 — Nav Shadow | `box-shadow: 2px 1px 2px {colors.hairline}`. | The fixed top navbar's subtle lift. |
| Level 3 — Soft Card | `box-shadow: 0 0 24px 0 rgba(213,213,213,0.32)`. | Elevated feature cards (e.g. four-column cards), radius 8px. |
| Level 4 — Floating Menu | Layered: `0 50px 100px -20px rgba(50,50,93,0.25)`, `0 30px 60px -30px rgba(0,0,0,0.3)`. | The nav dropdown / product mega-menu. |

The brand stays overwhelmingly flat; shadows appear only on the navbar, the dropdown menu, and a small set of elevated cards. Hairlines and whitespace carry most separation.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands, press strip. |
| `{rounded.xs}` | 2px | Tags ("free"), notice banners. |
| `{rounded.sm}` | 3px | Default button radius, nav signup CTA — near-rectangular. |
| `{rounded.md}` | 4px | Pricing-comparison boxes. |
| `{rounded.lg}` | 8px | Elevated feature cards, SDK / utility pill links. |
| `{rounded.pill}` | 9px / 50% | Nav hamburger bars (9px), attention dots & icon chips (50% circles). |

### Photography Geometry
The brand uses **no photography**. Its visual system is flat illustration:
- Hero & section illustrations: flat-color SVG, no frame, no corner radius.
- Ecosystem / education art: transparent PNG, no chrome.
- Press logos: monochrome strip, no container.
- Icon chips: circular (`50%`) pale-tint backgrounds behind small SVGs.

## Components

### Buttons

**`button-primary`** — the blue CTA on white canvas.
- Background `{colors.primary}` (`#387ed1`), text `#fff`, label `{typography.button}` (1.2em / weight 500), padding `{spacing.sm} {spacing.3xl}` (10px 30px), shape `{rounded.sm}` (3px), 1px transparent border. Hover → background `{colors.ink-strong}` (`#222`), text stays white.

**`button-outlined`** — the ghost secondary.
- Background transparent, text `{colors.body}` (`#666`), 1px solid `{colors.mute}` (`#9b9b9b`), same typography / shape. Hover → background `{colors.ink-strong}`, text white.

**`nav-signup-button`** — the compact nav CTA (`#nav_acop`).
- Background `{colors.primary}`, text `#fff`, weight 500, padding `3px 20px`, shape `{rounded.sm}`. Hover → background `{colors.ink-strong}`.

**`pill-link`** — the pale-tint secondary action (SDK / utility chips).
- Background `{colors.primary-wash}` (`rgba(142,193,255,0.15)`), text `{colors.primary}`, weight 500, padding `12px 30px`, shape `{rounded.lg}` (8px), no border.

### Cards & Containers

**`pricing-tile`** — the icon-led homepage pricing item.
- Background `{colors.canvas}`, inline-block layout, a flat SVG icon (~85–120px) above a `{typography.caption}` (~10px) label in `{colors.body}`. No border, no shadow.

**`pricing-box`** — the bounded pricing-comparison cell.
- Background `{colors.canvas}`, 1px solid `{colors.hairline-strong}` (`#ccc`), padding `0 25px` with `min-height: 145px`, shape `{rounded.md}` (4px) on the outer corners of a joined row.

**`feature-card`** — elevated four-column card.
- Background `{colors.canvas}`, shape `{rounded.lg}` (8px), Level-3 soft shadow `0 0 24px 0 rgba(213,213,213,0.32)`, top margin `3rem`.

**`why-us-block`** — the "Trust with confidence" text blurb.
- No fill / border. Title in `{typography.h3}` (`{colors.ink}`), body in `{typography.body}` (`{colors.body}`), `32px` bottom margin between blurbs.

**`press-strip`** — the monochrome media-logo band.
- Background `{colors.canvas}`, single `press-logos.png` strip, `60px` top margin, `opacity: 0.8` on hover.

**`notice`** — the attention / disclaimer banner.
- Background `rgba(218,212,27,0.17)`, 1px solid `{colors.warning}`-family border (`#f7db78`), padding `15px`, shape `{rounded.xs}` (2px).

**`tag-free`** — the inline "FREE" pill.
- Background `{colors.success}` (`#4caf50`), text `#fff`, uppercase 11px / weight 500, padding `4px 10px`, shape `{rounded.xs}` (2px).

### Inputs & Forms

**`text-input`** — standard form field (derived from base button/input chrome).
- Border 1px solid `{colors.hairline-strong}`, text `{colors.ink}`, padding `10px`, shape `{rounded.sm}` (3px), background `{colors.canvas}`. Validation errors surface in `{colors.error}` (`#f6461a`).

### Navigation

**`nav-bar`** — the fixed top navigation.
- Background `{colors.canvas}` (`#fff`), `60px` tall, full-width fixed, `box-shadow: 2px 1px 2px {colors.hairline}`, `20px` side padding. Logo capped at ~110px wide.

**`nav-link`** — top-nav link item.
- Text `{colors.body}` (`#666`), `{typography.nav-link}` (0.9rem / weight 400), `20px` padding, `color .3s` transition. Hover → `{colors.primary}`.

**`nav-mega-menu`** — the hamburger-triggered product menu.
- Background `{colors.canvas}`, shape `{rounded.sm}` (3px), Level-4 floating shadow; product grid (Kite / Console / Kite Connect / Coin) above a `{colors.hairline}`-bordered utilities footer.

**`footer`** — the closing footer band.
- Background `{colors.canvas-soft}` (`#fbfbfb`), 1px top border `{colors.hairline}`, padding `30px 0 5px`. Section heads (`nav-head`) in `{typography.h6}` (1.125rem / 500); links in `{colors.body}` hover `{colors.primary}`; small-print in `{colors.mute}` at `{typography.fineprint}`; "graveyard" links in `{colors.mute}` at 0.75rem.

### Signature Components

**`hero-band`** — the centered opening section.
- Background `{colors.canvas}`, `text-align: center`, `~10vh` top margin. Flat hero illustration (≤45vh) above an `{typography.h1}` headline, a `{typography.subheading}` lead, and a `button-primary` (`25px` top margin).

**`trust-band`** — the "Trust with confidence" 5/7 split.
- Background `{colors.canvas}`, `120px` bottom padding. Four stacked `why-us-block`s left; ecosystem illustration + explore links right.

**`cta-band`** — the closing "Open a Zerodha account" band.
- Background `{colors.canvas}`, centered `mini-container` (900px), `40px` vertical padding. `{typography.h2}` (weight 500) headline + `{colors.body}` lead + `button-primary`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces. Each `ex-*` entry references brand-native primitives so downstream consumers re-skin the same surfaces consistently against Zerodha's white-canvas / blue-accent system.

**`ex-pricing-tier`** — Default pricing tier card. Re-uses `pricing-box` chrome with white surface + hairline border.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured tier — `{colors.primary}` border / accent emphasis on the otherwise white card.
- Properties: `backgroundColor`, `accentColor`, `rounded`, `padding`

**`ex-product-selector`** — "Whole ecosystem" product grid — re-purposes the nav mega-menu product cells (Kite / Console / Coin).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Charges / order summary — line-item list on white with hairline dividers (not a literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row. Active state uses `{colors.primary}` as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default table th + td chrome. Header in `{typography.body-sm}` weight 500; body in `{typography.body-sm}`; positive/negative values in `{colors.success}` / `{colors.error}`.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / open-account card. Re-uses `feature-card` chrome with `text-input` primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — `feature-card` shape with Level-3 soft shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state frame with a flat illustration and `{typography.caption}` caption.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification — `notice` shape, semantic-tinted by context (`{colors.success}` / `{colors.warning}` / `{colors.error}`).
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` Zerodha blue (`#387ed1`) for primary CTAs, links, and active states — it is the single accent.
- Resolve CTA and link hovers to `{colors.ink-strong}` (`#222`), the brand's signature hover-to-dark behavior.
- Keep the canvas bright white with generous 80–120px section padding and `1.7` body line-height. Whitespace is the identity.
- Use tight `{rounded.sm}` 3px (buttons) to `{rounded.lg}` 8px (cards) radii. Never pill-shape a CTA.
- Set type in Inter at weights 400 / 500 only, with a modest 28px hero headline.
- Use flat SVG / PNG illustration for all imagery.

### Don't
- Don't introduce a second brand accent. Blue-on-white IS the voice.
- Don't render headlines in heavy weight (700+) or oversize the hero. The brand is intentionally understated.
- Don't use generous pill CTAs or rounded "bubble" buttons — radii stay at 3–8px.
- Don't darken the canvas or add gradients / atmospheric overlays. The brand has no dark mode.
- Don't use photography. The system is flat illustration only.
- Don't crowd content — tight vertical rhythm breaks the brand's calm, spacious tone.
