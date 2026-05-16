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

describe("Summary", () => {
  it("renders Equity and Holdings sections with mocked portfolio data", () => {
    render(<Summary />);

    // Structural anchors — the two sections + the Hi, <user>! banner.
    expect(screen.getByText(/Hi, /)).not.toBeNull();
    expect(screen.getByText("Equity")).not.toBeNull();
    expect(screen.getByText(/Holdings \(5\)/)).not.toBeNull();
  });
});
