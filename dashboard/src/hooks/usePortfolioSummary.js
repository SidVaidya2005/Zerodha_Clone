import { useMemo } from "react";
import { useApiData } from "./useApiData";
import { BACKEND_URL } from "../config";

export function usePortfolioSummary() {
  const {
    data: holdings,
    isLoading,
    error: holdingsError,
  } = useApiData(`${BACKEND_URL}/allHoldings`, "Unable to fetch summary data.", 15000);

  const { data: positions, error: positionsError } = useApiData(
    `${BACKEND_URL}/allPositions`,
    "Unable to fetch summary data.",
    15000
  );

  const summary = useMemo(() => {
    const investment = holdings.reduce(
      (total, item) => total + (item.avg || 0) * (item.qty || 0),
      0
    );

    const currentValue = holdings.reduce(
      (total, item) => total + (item.price || 0) * (item.qty || 0),
      0
    );

    const pnl = currentValue - investment;
    const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;

    const marginsUsed = positions.reduce(
      (total, item) => total + Math.abs((item.price || 0) * (item.qty || 0)),
      0
    );

    return {
      investment,
      currentValue,
      pnl,
      pnlPercent,
      marginsUsed,
      holdingsCount: holdings.length,
    };
  }, [holdings, positions]);

  return {
    ...summary,
    isLoading,
    hasError: Boolean(holdingsError || positionsError),
  };
}
