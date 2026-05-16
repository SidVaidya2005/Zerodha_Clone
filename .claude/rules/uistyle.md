# UI / CSS rules

How selectors are routed across the 5-file split, theme policy, and gotchas to avoid.

## Selector routing — which file owns which selectors

| File | Owns |
|---|---|
| `tokens.css` | Only `:root { --app-* }` and `[data-theme="dark"] { --app-* }`. **Nothing else.** No component rules, ever. |
| `layout.css` | `body`; page-level containers (`.dashboard-container`, `.app-navbar`, `.app-footer`, `.menu-container`, `.topbar-container`, `.watchlist-container`); grid/flex shells (`.row`, `.col`, `.app-universe-container`). |
| `components.css` | Everything visible: buttons, links, cards, tables, forms, modals, accordions, dropdowns, toasts, chart wrappers, the absorbed `.buy-action-window` rules. Media-query overrides for component rules also live here. |
| `utilities.css` | Single-purpose helpers: `.text-muted`, `.dark-invert`, `.profit`, `.loss`, `.up`, `.down`, `.align-left`, `.imp`. |
| `dark-mode.css` | Every `[data-theme="dark"] .x` selector that isn't a token override. Must load last. |

The selector decides which file — not where the markup happens to live. If `.foo` has a base rule and a `@media (max-width: 576px)` override, both go in the same file.

## Cascade order is fixed

`styles/index.css` is exactly:

```css
@import "./tokens.css";
@import "./layout.css";
@import "./components.css";
@import "./utilities.css";
@import "./dark-mode.css";
```

`dark-mode.css` loads last so `[data-theme="dark"]` selectors win specificity ties against earlier files. Reordering the imports is a regression.

## Cascade gotcha: split base and override carefully

If a selector has a base rule and a responsive override, **both must live in the same file or in files where the override loads after the base.** Phase 4 hit this on `.app-rich-text` — base in utilities.css and `@media (max-width: 576px)` override in components.css would have flipped the cascade (utilities loads after components). Fix: keep the responsive selector and its base together in components.css.

When in doubt, place the rule wherever its responsive overrides already live.

## Theme switching uses `[data-theme="dark"]`, not `prefers-color-scheme`

Both apps write `data-theme="dark"` (or `"light"`) to `<html>`. CSS uses `[data-theme="dark"] .x` selectors. **Do not add `@media (prefers-color-scheme: dark)` blocks** — they bypass the user's explicit toggle. The "system" theme setting at the JS layer reads `prefers-color-scheme` and writes the resolved value to `data-theme`; CSS only sees `data-theme`.

## Dark-mode images: `dark-invert`

Images that are dark-on-transparent (logos, icons) carry the `dark-invert` utility class. `utilities.css` applies `filter: invert(1) hue-rotate(180deg)` under `[data-theme="dark"]`. Do not write per-image dark-mode CSS — add the class instead.

## Shared tokens

Token values are governed by [[architecture]] (the shared/tokens.css same-commit rule). When adding a new token, add it to all three files (canonical + both copies) in one commit; ditto for renaming or removing.

## Reference

Folder structure: [[architecture]]. Component size: [[codestyle]].
