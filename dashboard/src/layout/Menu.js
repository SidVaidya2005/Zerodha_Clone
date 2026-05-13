import React, { useState } from "react";

import { NavLink } from "react-router-dom";

const Menu = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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
                  <p className={isActive ? "menu selected" : "menu"}>
                    {item.label}
                  </p>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <button
                className="logout-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "http://localhost:3000/";
                }}
              >
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
