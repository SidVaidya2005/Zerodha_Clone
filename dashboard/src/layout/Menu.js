import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import axios from "axios";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { BACKEND_URL, FRONTEND_URL } from "../config";
import { clearToken } from "../context/authToken";

function initialsOf(fullName) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const Menu = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const user = useCurrentUser();

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`${BACKEND_URL}/logout`);
    } catch {
      // Even if the request fails the cookie may still be present client-side,
      // but redirecting to the frontend is the right UX either way.
    }
    // Clear the Bearer token too — the /logout call only clears the cookie.
    clearToken();
    window.location.href = FRONTEND_URL;
  };

  const menuItems = [
    { label: "Dashboard", to: "/" },
    { label: "Orders", to: "/orders" },
    { label: "Holdings", to: "/holdings" },
    { label: "Positions", to: "/positions" },
    { label: "Funds", to: "/funds" },
  ];

  return (
    <div className="menu-container">
      <img src="logo.png" className="menu-logo" alt="Zerodha logo" />
      <div className="menus">
        <ul>
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink className="menu-link" to={item.to} end={item.to === "/"}>
                {({ isActive }) => (
                  <p className={isActive ? "menu selected" : "menu"}>{item.label}</p>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">{initialsOf(user.fullName)}</div>
          <p className="username">{user.fullName}</p>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
