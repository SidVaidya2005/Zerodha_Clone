# UI & Color Style Rules

These rules document the actual design tokens, component patterns, and layout conventions used across the frontend and dashboard. Follow them exactly when adding new UI.

---

## Design Tokens (CSS Custom Properties)

Both apps share the same variable names but have slightly different default values. Always use these variables — never hardcode colors.

### Frontend (`frontend/src/index.css`)

```css
/* Light mode (default) */
--app-bg:         #ffffff
--app-text:       #202124
--app-muted:      #6c757d
--app-surface:    #fafafa      /* slightly off-white for raised surfaces */
--app-border:     #dee2e6
--app-link:       #387ed1      /* primary blue */
--app-link-hover: #2b63a6      /* darker blue on hover */

/* Dark mode ([data-theme="dark"]) */
--app-bg:         #121212
--app-text:       #e6e6e6
--app-muted:      #a0a4ab
--app-surface:    #1b1b1b
--app-border:     #2f2f2f
--app-link:       #6ea8ff
--app-link-hover: #9bc0ff
```

### Dashboard (`dashboard/src/index.css`)

Same variables as above, plus two additional semantic tokens:

```css
--app-profit:  #4caf50    /* green — used for gains, BUY actions */
--app-loss:    #f44336    /* red — used for losses, SELL actions */
```

Note: `--app-surface` in the dashboard defaults to `#ffffff` (not `#fafafa`) in light mode, and the border is `#e6ebf2` (not `#dee2e6`).

---

## Semantic Color Usage

| Semantic meaning | Token to use |
|---|---|
| Page/canvas background | `--app-bg` |
| Card/panel/sidebar background | `--app-surface` |
| Primary text | `--app-text` |
| Secondary/label text | `--app-muted` |
| Dividers, input borders, table borders | `--app-border` |
| Links, active states, primary buttons | `--app-link` |
| Link hover, button hover | `--app-link-hover` |
| Profit / positive P&L / BUY | `--app-profit` (#4caf50) |
| Loss / negative P&L / SELL | `--app-loss` (#f44336) |
| Error state | `--app-loss` (#f44336) |
| Accent / featured highlight | `#ff9933` (orange — used only in support page featured box) |

**Never hardcode `#4caf50` or `#f44336` directly** — always reference `--app-profit` / `--app-loss` so dark mode works.

---

## Typography

**Font stack (both apps):**
```
-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
"Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
```

**Font weights in use:** 400 (body), 500 (labels, headings, nav items), 600 (strong emphasis).

**Font size scale (dashboard):**

| Use case | Size |
|---|---|
| Small label / muted text | `0.8rem` |
| Table header / badge | `0.8rem` |
| Table cell / body text | `0.9rem` |
| Nav menu item | `0.9rem` |
| Section title | `1.3rem` |
| Summary large number | `2.5rem` |

---

## Dark Mode Rules

- Dark mode is applied by setting `data-theme="dark"` on `<html>` — **not** via `prefers-color-scheme` CSS media queries.
- All dark-specific overrides use the selector `[data-theme="dark"] .class-name { }`.
- Glassmorphism surfaces (modals, dropdowns, action overlays) use `rgba` + `backdrop-filter: blur()` — provide a dark variant:
  - Light: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px)`
  - Dark: `background: rgba(27, 27, 27, 0.85); backdrop-filter: blur(8px)`
- Images that are dark-on-white add the class `dark-invert` and are flipped with `filter: invert(1) hue-rotate(180deg); opacity: 0.9`.

---

## Dashboard Layout

```
┌────────────────────────────────────────────────────┐
│  TopBar (height: 10vh)                              │
│  ├── MenuContainer (68%) — logo + nav links         │
│  └── IndicesContainer (32%) — Nifty / Sensex        │
├──────────────────────────────────┬─────────────────┤
│  Content area (flex: 0 0 68%)    │  WatchList       │
│  height: 90vh, overflow-y: auto  │  (flex: 0 0 32%) │
│  padding: 2.5% 2.2%              │  overflow-y: auto│
└──────────────────────────────────┴─────────────────┘
```

- The 68/32 split is a hard pixel ratio — do not change it without updating both `.content` and `.watchlist-container` (and the matching topbar containers).
- At `≤900px`, the layout stacks vertically: content above, watchlist below (min-height: 42vh).
- At `≤1200px`, quick-stats grid collapses from 4 columns to 2.

---

## Component Patterns

### Cards / Panels
```css
border: 1px solid var(--app-border);
border-radius: 8px;
background-color: var(--app-surface);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
```

### Hover lift (stat cards)
```css
transition: transform 180ms ease, box-shadow 180ms ease;
/* on hover: */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
```

### Buttons

| Class | Background | Use case |
|---|---|---|
| `.btn-blue` | `--app-link` → `--app-link-hover` | Primary / BUY |
| `.btn-green` | `--app-profit` → `#388e3c` | Confirm / add funds |
| `.btn-red` | `--app-loss` → `#c62828` | SELL |
| `.btn-grey` | `#d4d4d4` → `#9b9b9b` | Cancel |

All buttons share the base `.btn` class: `padding: 10px 20px; border-radius: 4px; color: #fff; font-weight: 500; transition: all 0.2s ease`.

### Tables (`.order-table`)
- Headers: right-aligned (`text-align: right`), `0.8rem`, `--app-muted`
- First column header/cell: left-aligned
- Cells: right-aligned, `0.9rem`, `--app-text`
- P&L columns: `.profit` → `--app-profit`, `.loss` → `--app-loss`
- Container: `border-radius: 8px`, `overflow: hidden`, `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`

### Modals / Overlays
- Overlay: `position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px)`
- Modal: `border-radius: 12px`, glassmorphism background (see Dark Mode Rules above)
- Entrance animation: `slideUp` — `translateY(20px) → translateY(0)` over `0.2s ease-out`

### Focus / Input States
- Focus ring: `box-shadow: 0 0 0 3px rgba(56, 126, 209, 0.1)` with `border-color: var(--app-link)`
- Error/invalid: `border-color: #f44336` with `box-shadow: 0 0 0 0.25rem rgba(244, 67, 54, 0.25)`

### Transitions
- Color/border transitions: `0.2s ease`
- Transform hover: `180ms ease`
- Theme switch (background/color on `body`): `0.2s ease`

---

## Frontend-Specific UI

The frontend uses Bootstrap 5 utility classes alongside the custom `app-*` CSS. When adding new components to the frontend:
- Use Bootstrap grid/flex utilities for layout
- Use `app-*` CSS variables for colors (override Bootstrap defaults via `!important` where needed — existing code does this for `.form-control`, `.form-label`, etc.)
- The `dark-invert` class flips images for dark mode — apply it to any logo/icon that is dark-on-transparent
