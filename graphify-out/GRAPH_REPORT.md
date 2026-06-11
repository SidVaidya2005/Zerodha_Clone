# Graph Report - .  (2026-06-11)

## Corpus Check
- 162 files · ~202,731 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 623 nodes · 965 edges · 34 communities (24 shown, 10 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.83)
- Token cost: 348,513 input · 87,126 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend Models & Test Suite|Backend Models & Test Suite]]
- [[_COMMUNITY_Dashboard Charts & Context|Dashboard Charts & Context]]
- [[_COMMUNITY_Dashboard Auth Token & Hooks|Dashboard Auth Token & Hooks]]
- [[_COMMUNITY_Dashboard Dependencies|Dashboard Dependencies]]
- [[_COMMUNITY_Backend Auth Controllers & JWT|Backend Auth Controllers & JWT]]
- [[_COMMUNITY_Twelve Data Proxy Server|Twelve Data Proxy Server]]
- [[_COMMUNITY_Backend Dependencies|Backend Dependencies]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Frontend Shared Components|Frontend Shared Components]]
- [[_COMMUNITY_Project Docs & CI Architecture|Project Docs & CI Architecture]]
- [[_COMMUNITY_App UI Screenshots|App UI Screenshots]]
- [[_COMMUNITY_Backend App Bootstrap & Routes|Backend App Bootstrap & Routes]]
- [[_COMMUNITY_User Model & Auth Tests|User Model & Auth Tests]]
- [[_COMMUNITY_Frontend Footer & Links Data|Frontend Footer & Links Data]]
- [[_COMMUNITY_Frontend Pricing Tables|Frontend Pricing Tables]]
- [[_COMMUNITY_Orders Domain (Backend)|Orders Domain (Backend)]]
- [[_COMMUNITY_Frontend FAQ Data|Frontend FAQ Data]]
- [[_COMMUNITY_Frontend About Page|Frontend About Page]]
- [[_COMMUNITY_Zerodha Ecosystem Products|Zerodha Ecosystem Products]]
- [[_COMMUNITY_Zerodha Brand & Kite Connect|Zerodha Brand & Kite Connect]]
- [[_COMMUNITY_PWA Web Manifest|PWA Web Manifest]]
- [[_COMMUNITY_Cross-Site OAuth Auth Flow|Cross-Site OAuth Auth Flow]]
- [[_COMMUNITY_Varsity Education Asset|Varsity Education Asset]]
- [[_COMMUNITY_Robots.txt Files|Robots.txt Files]]
- [[_COMMUNITY_App Store Badges|App Store Badges]]
- [[_COMMUNITY_Sensibull Logo|Sensibull Logo]]
- [[_COMMUNITY_Smallcase Logo|Smallcase Logo]]
- [[_COMMUNITY_Streak Logo|Streak Logo]]
- [[_COMMUNITY_Tijori Logo|Tijori Logo]]
- [[_COMMUNITY_Developer Portrait|Developer Portrait]]
- [[_COMMUNITY_Press Logos Strip|Press Logos Strip]]
- [[_COMMUNITY_Pricing Equity Illustration|Pricing Equity Illustration]]

## God Nodes (most connected - your core abstractions)
1. `Dashboard Config (BACKEND/PROXY/FRONTEND URL)` - 25 edges
2. `scripts` - 11 edges
3. `scripts` - 11 edges
4. `useApiData()` - 11 edges
5. `buildApp()` - 10 edges
6. `googleCallback()` - 10 edges
7. `HoldingsModel` - 10 edges
8. `BACKEND_URL` - 10 edges
9. `parseNumericPrice()` - 10 edges
10. `PositionsModel` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md (Codex Guidance)` --semantically_similar_to--> `Project README`  [INFERRED] [semantically similar]
  AGENTS.md → README.md
- `Dashboard index.html Template` --semantically_similar_to--> `Frontend index.html Template`  [INFERRED] [semantically similar]
  dashboard/public/index.html → frontend/public/index.html
- `Dashboard robots.txt` --semantically_similar_to--> `Frontend robots.txt`  [INFERRED] [semantically similar]
  dashboard/public/robots.txt → frontend/public/robots.txt
- `AGENTS.md (Codex Guidance)` --references--> `Twelve Data Proxy Server (server.js)`  [AMBIGUOUS]
  AGENTS.md → dashboard/CLAUDE.md
- `Project README` --references--> `Backend Mongoose Data Models`  [INFERRED]
  README.md → backend/CLAUDE.md

## Import Cycles
- 3-file cycle: `dashboard/src/context/BuyWindowContext.js -> dashboard/src/modals/BuyActionWindow.js -> dashboard/src/hooks/useSubmitOrder.js -> dashboard/src/context/BuyWindowContext.js`

## Hyperedges (group relationships)
- **Nonce-Bound Cross-Site OAuth Handoff** — backend_claude_google_oauth_flow, backend_claude_requireauth_dual_path, dashboard_claude_auth_gate_nonce, frontend_claude_oauth_redirect_routes [INFERRED 0.85]
- **Shared ESLint Lint Gate Across Apps** — ci_yml_workflow, contributing_md_guide, root_eslintrc_shared_config, ci_yml_root_devdeps_install [INFERRED 0.85]
- **CRA-Rooted Transitive Dependency Management** — dependabot_config, dependabot_major_version_ignore_policy, security_md_transitive_dep_handling, security_md_vite_migration_tracker [INFERRED 0.85]
- **Order placement cross-collection flow** — routes_orders, controllers_orderscontroller_createorder, services_orderservice_placeorder, model_ordersmodel_ordersmodel, model_holdingsmodel_holdingsmodel, model_positionsmodel_positionsmodel [EXTRACTED 0.95]
- **Google OAuth login + nonce handoff flow** — routes_auth, controllers_authcontroller_googlestart, controllers_authcontroller_googlecallback, services_googleauthservice_getauthurl, services_googleauthservice_exchangecodeforprofile, services_userservice_findorcreategoogleuser, services_authservice_signtoken [EXTRACTED 0.95]
- **Holdings read flow route to model** — routes_holdings, controllers_holdingscontroller_getallholdings, services_holdingsservice_listholdings, model_holdingsmodel_holdingsmodel [EXTRACTED 0.95]
- **Backend supertest suite over buildApp + in-memory Mongo** — tests_auth_test, tests_holdings_test, tests_orders_test, tests_positions_test, tests_setup, app_buildapp [EXTRACTED 1.00]
- **Twelve Data credit-budgeted quote proxy flow** — dashboard_server, twelve_data_api, dashboard_package [INFERRED 0.75]
- **Data-array-driven card subcomponents** — components_teammembercard_teammembercard, components_footercolumn_footercolumn, components_universetile_universetile, components_faqlinkcolumn_faqlinkcolumn [INFERRED 0.85]
- **GOOGLE_AUTH_URL CTA consumers** — frontend_config_google_auth_url, data_faqlinks_faq_groups, data_footerlinks_footer_columns, components_signupctabutton_signupctabutton [EXTRACTED 1.00]
- **Per-section Hero variants share a naming and presentation pattern** — home_hero_hero, pricing_hero_hero, products_hero_hero, support_hero_hero [INFERRED 0.80]
- **Pricing sections share the PricingTable rendering pattern** — pricing_accountopeningcharges_accountopeningcharges, pricing_dematamc_dematamc, pricing_valueaddedservices_valueaddedservices, components_pricingtable_pricingtable [INFERRED 0.85]
- **Sections reuse the shared SignupCTAButton chrome** — home_hero_hero, products_universe_universe, shared_openaccount_openaccount, components_signupctabutton_signupctabutton [INFERRED 0.80]
- **Twelve Data proxy polling hooks (setInterval/fetch on PROXY_URL)** — hooks_useindicespolling_useindicespolling, hooks_usewatchlistpolling_usewatchlistpolling, src_config [INFERRED 0.85]
- **Backend portfolio summary hooks (useApiData over BACKEND_URL)** — hooks_useapidata_useapidata, hooks_useholdingssummary_useholdingssummary, hooks_useportfoliosummary_useportfoliosummary [INFERRED 0.85]
- **Cross-site OAuth nonce + Bearer auth gate flow** — src_index, context_authtoken_authtoken, context_usercontext_userprovider, src_config [INFERRED 0.85]
- **WatchList widget family** — watchlist_watchlist_watchlist, watchlist_watchlistitem_watchlistitem, watchlist_watchlistactions_watchlistactions, watchlist_analyticsmodal_analyticsmodal [EXTRACTED 1.00]
- **Buy order flow: WatchList action to BuyActionWindow** — watchlist_watchlistitem_watchlistitem, watchlist_watchlistactions_watchlistactions, modals_buyactionwindow_buyactionwindow [INFERRED 0.75]
- **Trading Dashboard Surface (overview, holdings table, holdings chart)** — assets_dashboard_screen, assets_dashboard_holding_screen, assets_dashboard_holding_chart_screen [INFERRED 0.85]
- **Public Marketing Site Surface (home, pricing, signup, support)** — assets_homepage_screen, assets_pricing_screen, assets_sign_up_screen, assets_support_screen [INFERRED 0.85]
- **Zerodha Ecosystem Product Logos** — concept_kite, concept_coin, concept_console, concept_ditto [INFERRED 0.85]
- **Mobile App Store Download Badges** — images_appstorebadge_image, images_googleplaybadge_image, images_homehero_image [INFERRED 0.65]
- **Zerodha ecosystem partner product logos** — images_sensibulllogo_product, images_smallcaselogo_product, images_streaklogo_product, images_tijori_product [INFERRED 0.85]
- **Press coverage publication logos** — images_presslogos_image, images_logo_zerodha, images_largestbroker_image [INFERRED 0.65]

## Communities (34 total, 10 thin omitted)

### Community 0 - "Backend Models & Test Suite"
Cohesion: 0.06
Nodes (43): buildApp() (express app factory), backend jest.config.js, HoldingsModel, { HoldingsSchema }, { model }, { model }, PositionsModel, { PositionsSchema } (+35 more)

### Community 1 - "Dashboard Charts & Context"
Cohesion: 0.09
Nodes (31): BarChart(), options, DoughnutChart(), BuyWindowContext, BuyWindowProvider(), BACKGROUND_COLORS, BORDER_COLORS, Chart Palette (+23 more)

### Community 2 - "Dashboard Auth Token & Hooks"
Cohesion: 0.09
Nodes (31): authToken (Session Token + Login Handoff), captureTokenFromUrl(), clearToken(), getToken(), randomNonce(), safeEqual(), setToken(), startLoginIfRequested() (+23 more)

### Community 3 - "Dashboard Dependencies"
Cohesion: 0.04
Nodes (46): browserslist, development, production, dependencies, axios, chart.js, concurrently, cors (+38 more)

### Community 4 - "Backend Auth Controllers & JWT"
Cohesion: 0.09
Nodes (35): Dual Bearer/cookie JWT delivery, OAuth nonce login-CSRF defense, baseCookieOptions(), clearOauthCookies(), crypto, dashboardUrl(), frontendUrl(), googleAuthService (+27 more)

### Community 5 - "Twelve Data Proxy Server"
Cohesion: 0.07
Nodes (29): app, axios, cors, creditsRemaining(), dayStart, express, fetchQuote(), indicesCache (+21 more)

### Community 6 - "Backend Dependencies"
Cohesion: 0.06
Nodes (34): author, dependencies, body-parser, cookie-parser, cors, dotenv, express, google-auth-library (+26 more)

### Community 7 - "Frontend Dependencies"
Cohesion: 0.06
Nodes (34): browserslist, development, production, dependencies, lucide-react, react, react-dom, react-router-dom (+26 more)

### Community 8 - "Frontend Shared Components"
Cohesion: 0.10
Nodes (17): FeatureBlock(), PageHero(), SignupCTAButton(), UniverseTile(), UNIVERSE_ITEMS, BACKEND_URL config, GOOGLE_AUTH_URL config, Awards() (+9 more)

### Community 9 - "Project Docs & CI Architecture"
Cohesion: 0.09
Nodes (29): AGENTS.md (Codex Guidance), buildApp() Test Seam, Backend Mongoose Data Models, Backend Layered Architecture (routes/controllers/services), orderService Cross-Collection Mutation, Root devDependencies Install Step, CI Workflow (lint + format:check + build), CodeQL Analysis Workflow (+21 more)

### Community 10 - "App UI Screenshots"
Cohesion: 0.08
Nodes (29): Dashboard Holdings Chart Screen, Dashboard Holdings Table Screen, Dashboard Overview Screen, Marketing Homepage Screen, Pricing / Charges Screen, Sign Up Form Screen, Support Portal Screen, Dashboard Layout Feature (+21 more)

### Community 11 - "Backend App Bootstrap & Routes"
Cohesion: 0.11
Nodes (18): bodyParser, buildApp(), buildCorsOptions(), cookieParser, cors, express, buildApp, mongoose (+10 more)

### Community 12 - "User Model & Auth Tests"
Cohesion: 0.12
Nodes (19): { model }, UserModel, { UserSchema }, { Schema }, UserSchema, findByGoogleId(), findById(), findOrCreateGoogleUser() (+11 more)

### Community 13 - "Frontend Footer & Links Data"
Cohesion: 0.14
Nodes (10): FooterColumn(), FOOTER_COLUMNS, Footer Links Data, FOOTER_LEGAL_PARAGRAPHS, FOOTER_SOCIAL_LINKS, NAV_ITEMS, Footer(), Navbar() (+2 more)

### Community 14 - "Frontend Pricing Tables"
Cohesion: 0.18
Nodes (12): PricingTable(), AccountOpeningCharges(), headers, rows, DematAMC(), headers, rows, Hero() (+4 more)

### Community 15 - "Orders Domain (Backend)"
Cohesion: 0.18
Nodes (12): createOrder(), getAllOrders(), orderService, { OrdersModel }, { model }, OrdersModel, { OrdersSchema }, express (+4 more)

### Community 16 - "Frontend FAQ Data"
Cohesion: 0.23
Nodes (9): FAQLinkColumn(), FAQ Links Data, FAQ_FEATURED_NOTICES, FAQ_GROUPS, FAQ_QUICK_LINKS, Hero(), filterFaqGroups(), SupportFaq() (+1 more)

### Community 17 - "Frontend About Page"
Cohesion: 0.26
Nodes (7): AboutPage(), Hero(), Team(), TeamMemberCard(), TEAM_MEMBERS, AppLayout, ScrollToTop

### Community 18 - "Zerodha Ecosystem Products"
Cohesion: 0.18
Nodes (12): Coin (Zerodha Mutual Funds), Console (Zerodha Backoffice), Ditto (Insurance Advisory), Kite (Zerodha Investing Platform), Coin Mutual Funds Screenshot, Console Backoffice Holdings Screenshot, Ditto Insurance Logo, Zerodha Ecosystem Diagram (+4 more)

### Community 19 - "Zerodha Brand & Kite Connect"
Cohesion: 0.22
Nodes (9): Kite Connect API illustration, Kite Connect, Largest Broker badge, Zerodha wordmark logo, Zerodha, Varsity education app mockup, Varsity, Zerodha Fund House logo (+1 more)

### Community 20 - "PWA Web Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 21 - "Cross-Site OAuth Auth Flow"
Cohesion: 0.83
Nodes (4): Google OAuth 2.0 Auth Flow (nonce-bound), requireAuth Dual-Path (Bearer + Cookie), Dashboard Auth Gate + Nonce Defense, Frontend OAuth Redirect Routes (/login, /signup → Navigate)

## Ambiguous Edges - Review These
- `AGENTS.md (Codex Guidance)` → `Twelve Data Proxy Server (server.js)`  [AMBIGUOUS]
  AGENTS.md · relation: references
- `Hardcoded Content in src/data/` → `Frontend index.html Template`  [AMBIGUOUS]
  frontend/public/index.html · relation: conceptually_related_to
- `Intraday Trades Feature Icon` → `Kite (Zerodha Investing Platform)`  [AMBIGUOUS]
  frontend/public/media/images/intradayTrades.svg · relation: conceptually_related_to

## Knowledge Gaps
- **249 isolated node(s):** `root`, `overrides`, `recommendations`, `editor.formatOnSave`, `editor.defaultFormatter` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `AGENTS.md (Codex Guidance)` and `Twelve Data Proxy Server (server.js)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Hardcoded Content in src/data/` and `Frontend index.html Template`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Intraday Trades Feature Icon` and `Kite (Zerodha Investing Platform)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `backend jest.config.js` connect `Backend Models & Test Suite` to `User Model & Auth Tests`, `Backend Dependencies`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `Dashboard Config (BACKEND/PROXY/FRONTEND URL)` connect `Dashboard Auth Token & Hooks` to `Frontend Shared Components`, `Frontend FAQ Data`, `Frontend Footer & Links Data`, `Dashboard Charts & Context`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `buildApp()` connect `Backend App Bootstrap & Routes` to `Backend Auth Controllers & JWT`, `Orders Domain (Backend)`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useApiData()` (e.g. with `useIndicesPolling()` and `useWatchlistPolling()`) actually correct?**
  _`useApiData()` has 2 INFERRED edges - model-reasoned connections that need verification._