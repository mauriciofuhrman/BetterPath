import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/lib/types";
import { SpreadGroupData, SpreadData } from "@/lib/supabase-utils";
import { SPORTSBOOKS } from "@/lib/constants";
import SportsBookOddsDisplay from "./SportsBookOddsDisplay";

interface SpreadOddsGridProps {
  selectedGame: Game | null;
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

// Function to find spread with average odds closest to -110 (implied probability 0.524)
const findCenterSpread = (spreads: SpreadData[]): SpreadData | null => {
  if (!spreads || spreads.length === 0) return null;

  // Calculate average implied probability for each spread
  const spreadsWithAvgProb = spreads.map((spread) => {
    if (!spread.odds || spread.odds.length === 0) return { spread, avgProb: 0 };

    const totalProb = spread.odds.reduce((sum, odd) => {
      return sum + calculateImpliedProbability(odd.odds_value);
    }, 0);

    const avgProb = totalProb / spread.odds.length;
    return { spread, avgProb };
  });

  // Find spread with average probability closest to 0.524 (implied from -110)
  const target = 0.524;
  return spreadsWithAvgProb.reduce((closest, current) => {
    const currentDiff = Math.abs(current.avgProb - target);
    const closestDiff = Math.abs(closest.avgProb - target);
    return currentDiff < closestDiff ? current : closest;
  }, spreadsWithAvgProb[0]).spread;
};

const SpreadOddsGrid: React.FC<SpreadOddsGridProps> = ({ selectedGame }) => {
  // State for selected team and spread
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
  const [selectedSpreadIndex, setSelectedSpreadIndex] = useState<number>(0);
  const [sortedSpreads, setSortedSpreads] = useState<SpreadData[]>([]);

  if (!selectedGame) {
    return (
      <div className="bg-slate-800 text-white rounded-xl shadow-lg p-8 text-center font-medium">
        <div className="animate-pulse opacity-80">
          Select a game to view detailed odds
        </div>
      </div>
    );
  }

  const { homeTeam, awayTeam, detailedOdds } = selectedGame;

  // Get spread data for the selected game
  const homeSpreadGroup = detailedOdds.spread?.home_group as
    | SpreadGroupData
    | undefined;
  const awaySpreadGroup = detailedOdds.spread?.away_group as
    | SpreadGroupData
    | undefined;

  if (!homeSpreadGroup?.spreads || !awaySpreadGroup?.spreads) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
          <h2 className="text-xl font-bold text-center text-white">
            Spread Odds
          </h2>
        </div>
        <div className="p-8 text-center text-gray-700">
          No spread odds available for this game.
        </div>
      </div>
    );
  }

  // Update sorted spreads when team changes
  useEffect(() => {
    const spreads =
      selectedTeam === "home"
        ? [...homeSpreadGroup.spreads]
        : [...awaySpreadGroup.spreads];

    // Sort spreads by value (ascending for display)
    const sorted = [...spreads].sort((a, b) => {
      const valueA = a.displayValue !== undefined ? a.displayValue : a.value;
      const valueB = b.displayValue !== undefined ? b.displayValue : b.value;
      return valueA - valueB;
    });

    setSortedSpreads(sorted);

    // Find and set the center spread index based on average odds closest to -110
    const centerSpread = findCenterSpread(sorted);
    if (centerSpread) {
      const centerIndex = sorted.findIndex(
        (s) => s.line_id === centerSpread.line_id
      );
      setSelectedSpreadIndex(centerIndex >= 0 ? centerIndex : 0);
    } else {
      setSelectedSpreadIndex(0);
    }
  }, [selectedTeam, homeSpreadGroup.spreads, awaySpreadGroup.spreads]);

  // Get the currently selected spread data
  const currentSpread = sortedSpreads[selectedSpreadIndex];

  // Function to get formatted spread value for display
  const getFormattedSpread = (spread: SpreadData): string => {
    const value =
      spread.displayValue !== undefined
        ? spread.displayValue
        : spread.value * (spread.is_favorite ? -1 : 1);

    return value > 0 ? `+${value}` : `${value}`;
  };

  // Function to handle bet click
  const handleBetClick = (link: string) => {
    window.open(link, "_blank");
  };

  // Handle spread slider change
  const handleSpreadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSpreadIndex(parseInt(e.target.value));
  };

  // Function to find odds for a specific sportsbook
  const findOddsForBook = (bookId: string) => {
    if (!currentSpread || !currentSpread.odds) return null;
    return currentSpread.odds.find((odd) => odd.book === bookId);
  };

  // Function to format odds value
  const formatOddsValue = (bookOdds: any) => {
    return bookOdds.odds_value > 0
      ? `+${bookOdds.odds_value}`
      : bookOdds.odds_value.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <h2 className="text-xl font-bold text-center text-white">
          Spread Odds
        </h2>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-gray-100">
        <button
          className={`py-2 px-4 rounded-md font-semibold transition-all ${
            selectedTeam === "home"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTeam("home")}
        >
          {homeTeam.name}
        </button>
        <button
          className={`py-2 px-4 rounded-md font-semibold transition-all ${
            selectedTeam === "away"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTeam("away")}
        >
          {awayTeam.name}
        </button>
      </div>

      {/* Spread Slider */}
      {sortedSpreads.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">
              Lower Spread
            </div>
            <div className="text-sm font-medium text-gray-500">
              Higher Spread
            </div>
          </div>

          <div className="relative mb-2">
            <input
              type="range"
              min="0"
              max={sortedSpreads.length - 1}
              value={selectedSpreadIndex}
              onChange={handleSpreadChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-center">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold">
              {currentSpread ? getFormattedSpread(currentSpread) : "N/A"}
            </div>
          </div>

          {/* Show available spreads as markers */}
          <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
            {sortedSpreads.length > 1 && (
              <>
                <div>{getFormattedSpread(sortedSpreads[0])}</div>
                {sortedSpreads.length > 2 &&
                  sortedSpreads.length <= 5 &&
                  sortedSpreads
                    .slice(1, -1)
                    .map((spread, idx) => (
                      <div key={idx}>{getFormattedSpread(spread)}</div>
                    ))}
                {sortedSpreads.length > 5 && (
                  <>
                    <div>
                      {getFormattedSpread(
                        sortedSpreads[Math.floor(sortedSpreads.length / 3)]
                      )}
                    </div>
                    <div>
                      {getFormattedSpread(
                        sortedSpreads[
                          Math.floor((sortedSpreads.length * 2) / 3)
                        ]
                      )}
                    </div>
                  </>
                )}
                <div>
                  {getFormattedSpread(sortedSpreads[sortedSpreads.length - 1])}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Odds Display */}
      {currentSpread && (
        <SportsBookOddsDisplay
          oddsData={currentSpread}
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

export default SpreadOddsGrid;
