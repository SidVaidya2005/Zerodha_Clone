import { useMemo } from "react";
import { getCurrentValue, getPnL } from "../utils/portfolioUtils";
import { useApiData } from "./useApiData";
import { BACKEND_URL } from "../config";

export function useHoldingsSummary() {
  const { data: allHoldings, isLoading, error: errorMessage } = useApiData(
    `${BACKEND_URL}/allHoldings`,
    "Unable to load holdings right now. Please try again.",
  );

  const holdingsWithPnL = useMemo(
    () =>
      allHoldings.map((stock) => ({
        ...stock,
        pnl: getPnL(stock),
      })),
    [allHoldings],
  );

  const totals = useMemo(() => {
    if (holdingsWithPnL.length === 0) {
      return {
        totalPnL: 0,
        bestPerformer: null,
        worstPerformer: null,
        totalInvestment: 0,
        totalCurrentValue: 0,
      };
    }

    let total = 0;
    let investment = 0;
    let currentValue = 0;
    let best = holdingsWithPnL[0];
    let worst = holdingsWithPnL[0];

    holdingsWithPnL.forEach((stock) => {
      total += stock.pnl;
      investment += stock.avg * stock.qty;
      currentValue += getCurrentValue(stock);
      if (stock.pnl > best.pnl) best = stock;
      if (stock.pnl < worst.pnl) worst = stock;
    });

    return {
      totalPnL: total,
      bestPerformer: best,
      worstPerformer: worst,
      totalInvestment: investment,
      totalCurrentValue: currentValue,
    };
  }, [holdingsWithPnL]);

  return {
    holdingsWithPnL,
    holdingsCount: allHoldings.length,
    isLoading,
    errorMessage,
    ...totals,
  };
}
