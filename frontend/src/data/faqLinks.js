import { Rocket, LayoutDashboard, TrendingUp, Code } from "lucide-react";
import { GOOGLE_AUTH_URL, GITHUB_URL, PORTFOLIO_URL } from "../config";

// Each item is a question + answer; `link` (optional) renders a real outbound
// link inside the answer.
export const FAQ_GROUPS = [
  {
    id: 1,
    title: "Getting started",
    Icon: Rocket,
    items: [
      {
        q: "Signing in with Google",
        a: 'Click "Sign up" in the navbar (or "Go to dashboard" above) and authenticate with your Google account. The app uses Google OAuth, so there is no password to create.',
        link: { label: "Sign in", href: GOOGLE_AUTH_URL },
      },
      {
        q: "Exploring the dashboard",
        a: "After signing in you land on the trading dashboard. Use the left menu to switch between Summary, Holdings, Positions, Orders and Funds.",
      },
      {
        q: "Demo data & test portfolio",
        a: "The dashboard comes pre-loaded with sample holdings and positions, so you can explore every screen without placing real trades.",
      },
      {
        q: "Signing out",
        a: "Open the profile menu in the dashboard's top bar and choose Logout. You'll be returned to this site.",
      },
    ],
  },
  {
    id: 2,
    title: "Your dashboard",
    Icon: LayoutDashboard,
    items: [
      {
        q: "Holdings",
        a: "Holdings lists the stocks you own with quantity, average cost, live price and profit/loss, plus totals for the whole portfolio.",
      },
      {
        q: "Positions",
        a: "Positions shows your intraday and short-term trades with their current value and P&L.",
      },
      { q: "Orders", a: "Orders lists every buy and sell order you've placed." },
      { q: "Funds", a: "Funds summarises your available margin, used margin and balance." },
      {
        q: "Watchlist & live prices",
        a: "The watchlist refreshes live NSE/BSE quotes every 15 seconds. Hover a stock to buy or sell it.",
      },
    ],
  },
  {
    id: 3,
    title: "Trading",
    Icon: TrendingUp,
    items: [
      {
        q: "Placing a buy order",
        a: "Hover a watchlist stock and click Buy, set the quantity and price, then submit. Your holdings update right away.",
      },
      {
        q: "Placing a sell order",
        a: "Same flow as buying — click Sell on a stock you hold and confirm the quantity and price.",
      },
      {
        q: "How orders update your holdings",
        a: "Placing an order updates Orders, Holdings and Positions together on the backend, so the dashboard always stays in sync.",
      },
      {
        q: "Where live prices come from",
        a: "A small Express proxy wraps Yahoo Finance to fetch NSE/BSE quotes — no paid market-data subscription is involved.",
      },
    ],
  },
  {
    id: 4,
    title: "About this project",
    Icon: Code,
    items: [
      {
        q: "What is this site?",
        a: "A full-stack clone of Zerodha's website and trading dashboard, built as a personal learning project. It isn't affiliated with Zerodha.",
      },
      {
        q: "Tech stack",
        a: "React for the marketing site and dashboard, Express and MongoDB on the backend, Chart.js for charts, and a Yahoo Finance proxy for live prices.",
      },
      {
        q: "Source code on GitHub",
        a: "The full source is public on GitHub.",
        link: { label: "View on GitHub", href: GITHUB_URL },
      },
      {
        q: "About the developer",
        a: "Built by Siddarth Vaidya. More projects are on the portfolio site.",
        link: { label: "Visit portfolio", href: PORTFOLIO_URL },
      },
    ],
  },
];

export const FAQ_QUICK_LINKS = [
  { label: "How to sign in", href: GOOGLE_AUTH_URL },
  { label: "Explore the dashboard", href: GOOGLE_AUTH_URL },
  { label: "View source on GitHub", href: GITHUB_URL },
  { label: "About the developer", href: PORTFOLIO_URL },
];

export const FAQ_FEATURED_NOTICES = [
  "This is a portfolio demo — no real money or live trades are involved.",
  "Live market prices are fetched from Yahoo Finance.",
];
