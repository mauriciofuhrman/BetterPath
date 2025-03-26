import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/lib/types";
import { TotalData } from "@/lib/supabase-utils";
import { SPORTSBOOKS } from "@/lib/constants";
import SportsBookOddsDisplay from "./SportsBookOddsDisplay";

interface TotalOddsGridProps {
  selectedGame: Game | null;
  isLoading?: boolean;
}

// Function to calculate implied probability from odds
const calculateImpliedProbability = (odds: number): number => {
  if (odds > 0) {
    // Positive odds (e.g., +150)
    return 100 / (odds + 100);
  } else {
    // Negative odds (e.g., -200)
    const absOdds = Math.abs(odds);
    return absOdds / (absOdds + 100);
  }
};

// Function to find total with average odds closest to -110 (implied probability 0.524)
const findCenterTotal = (
  totals: Array<{ over: any | null; under: any | null }>
): any => {
  if (!totals || totals.length === 0) return null;

  // Calculate average implied probability for each total
  const totalsWithAvgProb = totals.map((total) => {
    let avgProb = 0;
    let count = 0;

    // Calculate for over odds
    if (total.over && total.over.odds && total.over.odds.length > 0) {
      const overProb =
        total.over.odds.reduce((sum: number, odd: any) => {
          return sum + calculateImpliedProbability(odd.odds_value);
        }, 0) / total.over.odds.length;

      avgProb += overProb;
      count++;
    }

    // Calculate for under odds
    if (total.under && total.under.odds && total.under.odds.length > 0) {
      const underProb =
        total.under.odds.reduce((sum: number, odd: any) => {
          return sum + calculateImpliedProbability(odd.odds_value);
        }, 0) / total.under.odds.length;

      avgProb += underProb;
      count++;
    }

    // Average of over and under probabilities
    avgProb = count > 0 ? avgProb / count : 0;

    return { total, avgProb };
  });

  // Find total with average probability closest to 0.524 (implied from -110)
  const target = 0.524;
  return totalsWithAvgProb.reduce((closest, current) => {
    const currentDiff = Math.abs(current.avgProb - target);
    const closestDiff = Math.abs(closest.avgProb - target);
    return currentDiff < closestDiff ? current : closest;
  }, totalsWithAvgProb[0]).total;
};

const TotalOddsGrid: React.FC<TotalOddsGridProps> = ({
  selectedGame,
  isLoading = false,
}) => {
  // State for selected bet type (over/under) and total index
  const [selectedBetType, setSelectedBetType] = useState<"over" | "under">(
    "over"
  );
  const [selectedTotalIndex, setSelectedTotalIndex] = useState<number>(0);

  // Extract data safely with null checks
  const totalPairs = selectedGame?.detailedOdds?.total?.pairs || [];

  // Sort totals by value (ascending) - do this once, outside of any conditionals
  const sortedTotals = [...totalPairs].sort((a, b) => {
    const valueA = a.over?.value || a.under?.value || 0;
    const valueB = b.over?.value || b.under?.value || 0;
    return valueA - valueB;
  });

  // Use effect to find the center total - now always called
  useEffect(() => {
    if (sortedTotals.length > 0) {
      const centerTotal = findCenterTotal(sortedTotals);
      if (centerTotal) {
        const centerIndex = sortedTotals.findIndex(
          (t) =>
            t.over?.line_id === centerTotal.over?.line_id ||
            t.under?.line_id === centerTotal.under?.line_id
        );
        setSelectedTotalIndex(centerIndex >= 0 ? centerIndex : 0);
      } else {
        setSelectedTotalIndex(0);
      }
    }
  }, [totalPairs]);

  // Handle total slider change
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTotalIndex(parseInt(e.target.value));
  };

  // Function to format total value
  const formatTotalValue = (totalPair: any): string => {
    const value = totalPair.over?.value || totalPair.under?.value || 0;
    return value.toFixed(1);
  };

  // Function to handle bet click
  const handleBetClick = (link: string) => {
    window.open(link, "_blank");
  };

  // Early return for no game selected
  if (!selectedGame) {
    return (
      <div className="bg-slate-800 text-white rounded-xl shadow-lg p-8 text-center font-medium">
        <div className="animate-pulse opacity-80">
          Select a game to view detailed odds
        </div>
      </div>
    );
  }

  // Loading state display
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
          <h2 className="text-xl font-bold text-center text-white">
            Total Odds
          </h2>
        </div>
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-gray-600">Loading total odds data...</p>
          <p className="text-xs text-gray-500 mt-2">
            This may take a moment for games with many lines
          </p>
        </div>
      </div>
    );
  }

  // Early return for no total pairs
  if (totalPairs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
          <h2 className="text-xl font-bold text-center text-white">
            Total Odds
          </h2>
        </div>
        <div className="p-8 text-center text-gray-700">
          No total odds available for this game.
        </div>
      </div>
    );
  }

  // Get the currently selected total data
  const currentTotal = sortedTotals[selectedTotalIndex];
  const currentBetData =
    selectedBetType === "over" ? currentTotal?.over : currentTotal?.under;

  // Function to find odds for a specific sportsbook
  const findOddsForBook = (bookId: string) => {
    if (!currentBetData || !currentBetData.odds) return null;
    return currentBetData.odds.find((odd: any) => odd.book === bookId);
  };

  // Function to format odds value
  const formatOddsValue = (bookOdds: any) => {
    return bookOdds.odds_value > 0
      ? `+${bookOdds.odds_value}`
      : bookOdds.odds_value.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <h2 className="text-xl font-bold text-center text-white">Total Odds</h2>
      </div>

      {/* Over/Under Selection */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-gray-100">
        <button
          className={`py-2 px-4 rounded-md font-semibold transition-all ${
            selectedBetType === "over"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedBetType("over")}
        >
          Over
        </button>
        <button
          className={`py-2 px-4 rounded-md font-semibold transition-all ${
            selectedBetType === "under"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedBetType("under")}
        >
          Under
        </button>
      </div>

      {/* Total Slider */}
      {sortedTotals.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Lower Total</div>
            <div className="text-sm font-medium text-gray-500">
              Higher Total
            </div>
          </div>

          <div className="relative mb-2">
            <input
              type="range"
              min="0"
              max={sortedTotals.length - 1}
              value={selectedTotalIndex}
              onChange={handleTotalChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-center">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold">
              {currentTotal ? formatTotalValue(currentTotal) : "N/A"}
            </div>
          </div>

          {/* Show available totals as markers */}
          <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
            {sortedTotals.length > 1 && (
              <>
                <div>{formatTotalValue(sortedTotals[0])}</div>
                {sortedTotals.length > 2 &&
                  sortedTotals.length <= 5 &&
                  sortedTotals
                    .slice(1, -1)
                    .map((total, idx) => (
                      <div key={idx}>{formatTotalValue(total)}</div>
                    ))}
                {sortedTotals.length > 5 && (
                  <>
                    <div>
                      {formatTotalValue(
                        sortedTotals[Math.floor(sortedTotals.length / 3)]
                      )}
                    </div>
                    <div>
                      {formatTotalValue(
                        sortedTotals[Math.floor((sortedTotals.length * 2) / 3)]
                      )}
                    </div>
                  </>
                )}
                <div>
                  {formatTotalValue(sortedTotals[sortedTotals.length - 1])}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Odds Display */}
      {currentBetData && (
        <SportsBookOddsDisplay
          oddsData={currentBetData}
          findOddsForBook={findOddsForBook}
          formatOddsValue={formatOddsValue}
          onBetClick={handleBetClick}
        />
      )}

      <div className="p-4 flex flex-col items-center text-sm text-gray-500">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Best available odds</span>
        </div>
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default TotalOddsGrid;
