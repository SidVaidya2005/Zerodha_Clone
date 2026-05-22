import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { NAV_ITEMS } from "../../data/navItems";

describe("Navbar", () => {
  it("renders the brand logo", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Logo")).not.toBeNull();
  });

  it("renders every nav item from NAV_ITEMS", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    NAV_ITEMS.forEach((item) => {
      expect(screen.getByText(item.label)).not.toBeNull();
    });
  });
});
