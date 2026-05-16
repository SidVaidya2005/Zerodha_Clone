import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders without crashing in light mode", () => {
    render(
      <MemoryRouter>
        <Navbar theme="light" onToggleTheme={() => {}} />
      </MemoryRouter>
    );

    // Brand logo + theme toggle button are the structural anchors.
    expect(screen.getByAltText("Logo")).not.toBeNull();
    expect(screen.getByLabelText("Switch to dark mode")).not.toBeNull();
  });

  it("flips the theme-toggle aria-label when theme is dark", () => {
    render(
      <MemoryRouter>
        <Navbar theme="dark" onToggleTheme={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Switch to light mode")).not.toBeNull();
  });
});
