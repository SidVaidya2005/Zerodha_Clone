import { render, screen } from "@testing-library/react";
import Summary from "./Summary";

// Mock the polling hook so the test doesn't try to hit the backend.
jest.mock("../hooks/usePortfolioSummary", () => ({
  usePortfolioSummary: () => ({
    investment: 100000,
    currentValue: 110000,
    pnl: 10000,
    pnlPercent: 10,
    marginsUsed: 5000,
    holdingsCount: 5,
    isLoading: false,
    hasError: false,
  }),
}));

// Bypass the auth context — Summary now reads user.fullName directly.
jest.mock("../hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({ id: "u1", fullName: "Asha Rao", email: "asha@example.com" }),
}));

describe("Summary", () => {
  it("renders Equity and Holdings sections with the current user's name", () => {
    render(<Summary />);

    expect(screen.getByText("Hi, Asha Rao!")).not.toBeNull();
    expect(screen.getByText("Equity")).not.toBeNull();
    expect(screen.getByText(/Holdings \(5\)/)).not.toBeNull();
  });
});
