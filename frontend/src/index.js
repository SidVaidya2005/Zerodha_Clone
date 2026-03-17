import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import ProductPage from "./landing_page/products/ProductsPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";

import NotFound from "./landing_page/NotFound";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";

const THEME_MODE_KEY = "zerodha-theme-mode";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function AppLayout() {
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem(THEME_MODE_KEY);
    if (
      savedMode === "light" ||
      savedMode === "dark" ||
      savedMode === "system"
    ) {
      return savedMode;
    }

    return "system";
  });

  const [activeTheme, setActiveTheme] = useState(() =>
    themeMode === "system" ? getSystemTheme() : themeMode,
  );

  useEffect(() => {
    const resolvedTheme = themeMode === "system" ? getSystemTheme() : themeMode;
    setActiveTheme(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    localStorage.setItem(THEME_MODE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = () => {
      if (themeMode === "system") {
        const resolvedTheme = getSystemTheme();
        setActiveTheme(resolvedTheme);
        document.documentElement.setAttribute("data-theme", resolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode(activeTheme === "dark" ? "light" : "dark");
  };

  return (
    <BrowserRouter>
      <Navbar theme={activeTheme} onToggleTheme={handleToggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
