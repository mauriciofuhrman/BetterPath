import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/lib/types";
import { TotalData, PlayerPropsByCategory } from "@/lib/supabase-utils";
import { SPORTSBOOKS } from "@/lib/constants";
import SportsBookOddsDisplay from "./SportsBookOddsDisplay";

// Add a type for a dictionary with string keys
type DynamicPlayerProps = {
  [key: string]: Array<{ over: TotalData | null; under: TotalData | null }>;
};

interface PlayerPropsGridProps {
  selectedGame: Game | null;
  isLoading?: boolean;
}

// Category display names and colors for UI
const categoryConfig: Record<string, { label: string; color: string }> = {
  pts: { label: "Points", color: "bg-blue-500" },
  rebs: { label: "Rebounds", color: "bg-green-500" },
  asts: { label: "Assists", color: "bg-purple-500" },
  blks: { label: "Blocks", color: "bg-red-500" },
  stls: { label: "Steals", color: "bg-yellow-500" },
  threes: { label: "3-Pointers", color: "bg-orange-500" },
  tos: { label: "Turnovers", color: "bg-gray-500" },
  pts_rebs: { label: "Points + Rebounds", color: "bg-indigo-500" },
  pts_asts: { label: "Points + Assists", color: "bg-pink-500" },
  asts_rebs: { label: "Assists + Rebounds", color: "bg-teal-500" },
  pts_rebs_asts: { label: "Points + Rebounds + Assists", color: "bg-cyan-500" },
  stls_blks: { label: "Steals + Blocks", color: "bg-amber-500" },
  other: { label: "Other", color: "bg-gray-400" },
};

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

// Function to find prop with average odds closest to -110 (implied probability 0.524)
const findCenterProp = (
  props: Array<{ over: TotalData | null; under: TotalData | null }>
): number => {
  if (!props || props.length === 0) return 0;

  // Calculate average implied probability for each prop
  const propsWithAvgProb = props.map((prop, index) => {
    let totalProb = 0;
    let oddsCount = 0;

    // Check over odds
    if (prop.over && prop.over.odds) {
      prop.over.odds.forEach((odd) => {
        totalProb += calculateImpliedProbability(odd.odds_value);
        oddsCount++;
      });
    }

    // Check under odds
    if (prop.under && prop.under.odds) {
      prop.under.odds.forEach((odd) => {
        totalProb += calculateImpliedProbability(odd.odds_value);
        oddsCount++;
      });
    }

    const avgProb = oddsCount > 0 ? totalProb / oddsCount : 0;
    return { index, avgProb };
  });

  // Find prop with average probability closest to 0.524 (implied from -110)
  const target = 0.524;
  return propsWithAvgProb.reduce((closest, current) => {
    const currentDiff = Math.abs(current.avgProb - target);
    const closestDiff = Math.abs(closest.avgProb - target);
    return currentDiff < closestDiff ? current : closest;
  }, propsWithAvgProb[0]).index;
};

const PlayerPropsGrid: React.FC<PlayerPropsGridProps> = ({
  selectedGame,
  isLoading = false,
}) => {
  // State for selections
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("pts");
  const [selectedBetType, setSelectedBetType] = useState<"over" | "under">(
    "over"
  );
  const [selectedPropIndex, setSelectedPropIndex] = useState<number>(0);

  // State to hold the processed player props data
  const [playersList, setPlayersList] = useState<string[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [currentPlayerProps, setCurrentPlayerProps] =
    useState<PlayerPropsByCategory | null>(null);
  const [currentCategoryProps, setCurrentCategoryProps] = useState<
    Array<{ over: TotalData | null; under: TotalData | null }>
  >([]);

  // Process player props data when the selected game changes
  useEffect(() => {
    if (!selectedGame || !selectedGame.detailedOdds?.total?.playerPropsData) {
      setPlayersList([]);
      setCategoriesList([]);
      setCurrentPlayerProps(null);
      setCurrentCategoryProps([]);
      return;
    }

    // Extract data from the game
    const playerPropsData = selectedGame.detailedOdds.total.playerPropsData;

    if (!playerPropsData) return;

    // Get the list of players
    const players = playerPropsData.allPlayers || [];
    setPlayersList(players);

    // Get the list of categories
    const categories = playerPropsData.allCategories || [];
    setCategoriesList(categories);

    // Set the initial player selection if needed
    if (
      players.length > 0 &&
      (!selectedPlayer || !players.includes(selectedPlayer))
    ) {
      setSelectedPlayer(players[0]);
    }

    // Reset category if needed
    if (
      categories.length > 0 &&
      (!selectedCategory || !categories.includes(selectedCategory))
    ) {
      setSelectedCategory("pts"); // Default to points if available
    }

    // Update the current player's props
    if (selectedPlayer && playerPropsData.byPlayer[selectedPlayer]) {
      setCurrentPlayerProps(playerPropsData.byPlayer[selectedPlayer]);
    } else if (players.length > 0) {
      setCurrentPlayerProps(playerPropsData.byPlayer[players[0]]);
    }
  }, [selectedGame, selectedPlayer, selectedCategory]);

  // Update current category props when player or category selection changes
  useEffect(() => {
    if (!currentPlayerProps) {
      setCurrentCategoryProps([]);
      return;
    }

    // Get the props for the selected category using the dynamic type
    const playerPropsDict = currentPlayerProps as unknown as DynamicPlayerProps;
    const categoryProps = playerPropsDict[selectedCategory] || [];

    // First, sort the props by value for consistent display
    const sortedProps = [...categoryProps].sort((a, b) => {
      const valueA = a.over?.value || a.under?.value || 0;
      const valueB = b.over?.value || b.under?.value || 0;
      return valueA - valueB;
    });

    setCurrentCategoryProps(sortedProps);

    // Find and set the center prop index (with odds closest to -110)
    const centerIndex = findCenterProp(sortedProps);
    setSelectedPropIndex(centerIndex);
  }, [currentPlayerProps, selectedCategory]);

  // Handle player selection change
  const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(e.target.value);
  };

  // Handle category selection change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle prop slider change
  const handlePropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPropIndex(parseInt(e.target.value));
  };

  // Function to format prop value
  const formatPropValue = (prop: any): string => {
    const value = prop.over?.value || prop.under?.value || 0;
    return value.toFixed(1);
  };

  // Function to get the prop type name (e.g., "PTS", "AST")
  const getPropTypeName = (prop: any): string => {
    const name = prop.over?.name || prop.under?.name || "";

    // Extract the statistic type (e.g., "PTS", "AST", "3PM") and player name
    // Format is typically "Player Name PTS" - we want to show the player's full name
    const nameParts = name.split(" ");

    // Common stat abbreviations that might appear at the end of the prop name
    const statAbbreviations = [
      "PTS",
      "AST",
      "REB",
      "BLK",
      "STL",
      "3PT",
      "3PM",
      "TO",
      "PRA",
      "PR",
      "PA",
      "RA",
      "SB",
    ];

    // If the last part is a known stat abbreviation, remove it to get the player name
    let playerNameFromProp = name;
    const lastPart = nameParts[nameParts.length - 1];

    if (statAbbreviations.includes(lastPart)) {
      playerNameFromProp = nameParts.slice(0, -1).join(" ");
    }

    // Return the selected player name (which should be complete) or the extracted name
    return selectedPlayer || playerNameFromProp;
  };

  // Function to handle bet click
  const handleBetClick = (link: string) => {
    window.open(link, "_blank");
  };

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

  // Loading state display
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
          <h2 className="text-xl font-bold text-center text-white">
            Player Props
          </h2>
        </div>
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-gray-600">Loading player props data...</p>
          <p className="text-xs text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Early return for no game selected
  if (!selectedGame) {
    return (
      <div className="bg-slate-800 text-white rounded-xl shadow-lg p-8 text-center font-medium">
        <div className="animate-pulse opacity-80">
          Select a game to view player props
        </div>
      </div>
    );
  }

  // Early return for no player props data
  if (
    !selectedGame.detailedOdds?.total?.playerPropsData ||
    playersList.length === 0
  ) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
          <h2 className="text-xl font-bold text-center text-white">
            Player Props
          </h2>
        </div>
        <div className="p-8 text-center text-gray-700">
          No player props available for this game.
        </div>
      </div>
    );
  }

  // Get the currently selected prop
  const currentProp = currentCategoryProps[selectedPropIndex] || null;
  const currentBetData = currentProp
    ? selectedBetType === "over"
      ? currentProp.over
      : currentProp.under
    : null;

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <h2 className="text-xl font-bold text-center text-white">
          Player Props
        </h2>
      </div>

      {/* Player Selection */}
      <div className="p-4 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Player
        </label>
        <select
          value={selectedPlayer}
          onChange={handlePlayerChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {playersList.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>

      {/* Category Selection */}
      <div className="p-4 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          {Object.keys(categoryConfig).map((category) => {
            // Check if current player has props for this category
            const playerPropsDict =
              currentPlayerProps as unknown as DynamicPlayerProps;
            const hasProps =
              currentPlayerProps &&
              playerPropsDict[category] &&
              playerPropsDict[category].length > 0;

            if (!hasProps) return null;

            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`py-2 px-3 text-xs sm:text-sm rounded-md font-medium ${
                  selectedCategory === category
                    ? `${categoryConfig[category].color} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoryConfig[category].label}
              </button>
            );
          })}
        </div>
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

      {/* No props available for this category */}
      {currentCategoryProps.length === 0 ? (
        <div className="p-8 text-center text-gray-700">
          No props available for{" "}
          {categoryConfig[selectedCategory]?.label || selectedCategory}.
        </div>
      ) : (
        <>
          {/* Prop Type and Value Display */}
          <div className="p-4 border-b border-gray-100 text-center">
            <div className="mb-2 font-semibold text-gray-700">
              {currentProp ? getPropTypeName(currentProp) : ""}
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold inline-block">
              {currentProp ? formatPropValue(currentProp) : "N/A"}
            </div>
          </div>

          {/* Prop Value Slider (only if more than one prop) */}
          {currentCategoryProps.length > 1 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium text-gray-500">
                  Lower{" "}
                  {selectedCategory === "pts"
                    ? "Points"
                    : categoryConfig[selectedCategory]?.label ||
                      selectedCategory}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Higher{" "}
                  {selectedCategory === "pts"
                    ? "Points"
                    : categoryConfig[selectedCategory]?.label ||
                      selectedCategory}
                </div>
              </div>

              <div className="relative mb-2">
                <input
                  type="range"
                  min="0"
                  max={currentCategoryProps.length - 1}
                  value={selectedPropIndex}
                  onChange={handlePropChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Show available values as markers */}
              <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
                {currentCategoryProps.length > 1 && (
                  <>
                    <div>{formatPropValue(currentCategoryProps[0])}</div>
                    {currentCategoryProps.length > 2 &&
                      currentCategoryProps.length <= 5 &&
                      currentCategoryProps
                        .slice(1, -1)
                        .map((prop, idx) => (
                          <div key={idx}>{formatPropValue(prop)}</div>
                        ))}
                    {currentCategoryProps.length > 5 && (
                      <>
                        <div>
                          {formatPropValue(
                            currentCategoryProps[
                              Math.floor(currentCategoryProps.length / 3)
                            ]
                          )}
                        </div>
                        <div>
                          {formatPropValue(
                            currentCategoryProps[
                              Math.floor((currentCategoryProps.length * 2) / 3)
                            ]
                          )}
                        </div>
                      </>
                    )}
                    <div>
                      {formatPropValue(
                        currentCategoryProps[currentCategoryProps.length - 1]
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Odds Display */}
          {currentBetData && currentBetData.odds && (
            <SportsBookOddsDisplay
              oddsData={currentBetData}
              findOddsForBook={findOddsForBook}
              formatOddsValue={formatOddsValue}
              onBetClick={handleBetClick}
            />
          )}
        </>
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

export default PlayerPropsGrid;
