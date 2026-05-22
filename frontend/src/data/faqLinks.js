import { PlusCircle, User, Smile, Info, CircleDot, Circle } from "lucide-react";

export const FAQ_GROUPS = [
  {
    id: 1,
    title: "Account Opening",
    Icon: PlusCircle,
    links: [
      "Getting started",
      "Online",
      "Offline",
      "Charges",
      "Company, Partnership and HUF",
      "Non Resident Indian (NRI)",
    ],
  },
  {
    id: 2,
    title: "Your Zerodha Account",
    Icon: User,
    links: [
      "Login credentials",
      "Your Profile",
      "Account modification and segment addition",
      "CMR & DP ID",
      "Nomination",
      "Transfer and conversion of shares",
    ],
  },
  {
    id: 3,
    title: "Kite",
    Icon: Smile,
    links: ["Kite features", "Orders", "Funds", "Holdings and Positions", "Dashboard", "Kite app"],
  },
  {
    id: 4,
    title: "Funds",
    Icon: Info,
    links: ["Fund withdrawal", "Adding funds", "Adding bank accounts", "eMandates"],
  },
  {
    id: 5,
    title: "Console",
    Icon: CircleDot,
    links: ["IPO", "Portfolio", "Funds statement", "Profile", "Reports", "Referral program"],
  },
  {
    id: 6,
    title: "Coin",
    Icon: Circle,
    links: [
      "Understanding mutual funds and Coin",
      "Coin app",
      "Coin web",
      "Transactions and reports",
      "National Pension Scheme (NPS)",
    ],
  },
];

export const FAQ_QUICK_LINKS = [
  "Track account opening",
  "Track segment activation",
  "Intraday margins",
  "Kite user manual",
  "Learn how to create a ticket",
];

export const FAQ_FEATURED_LINKS = [
  "MCX - Revision in Trading Hours from March 09, 2026",
  "Exchange issue with order placement on NSE [Resolved]",
];
