"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import Image from "next/image";
import MoneylineOddsGrid from "@/components/nba-odds/MoneylineOddsGrid";
import SpreadOddsGrid from "@/components/nba-odds/SpreadOddsGrid";
import TotalOddsGrid from "@/components/nba-odds/TotalOddsGrid";
import PlayerPropsGrid from "@/components/nba-odds/PlayerPropsGrid";
import { Header } from "@/components/nba-odds";
import { Game } from "@/lib/types";
import { mockGames } from "@/lib/mock-data";
import {
  getGames,
  getBatchMoneylineOdds,
  getBatchSpreadOdds,
  getBatchTotals,
  getBatchPlayerProps,
  Game as SupabaseGame,
} from "@/lib/supabase-utils";
import GameCard from "@/components/nba-odds/GameCard";
import { createClient } from "@supabase/supabase-js";

// BlurredContent component
const BlurredContent = ({ message }: { message: string }) => (
  <div className="relative">
    <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
      <div className="bg-white/80 p-6 rounded-lg shadow-lg max-w-md text-center">
        <h3 className="text-xl font-bold mb-2">Subscription Required</h3>
        <p className="mb-4">{message}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Sign Up Now
        </button>
      </div>
    </div>
  </div>
);

// SVG for NBA Logo
const NBALogo = () => (
  <Image
    src="/nba-logo.png"
    alt="NBA Logo"
    width={24}
    height={24}
    className="object-contain"
  />
);

// Helper function to transform Supabase Game to our Game type
const transformSupabaseGame = (supaGame: SupabaseGame): Game => {
  // Generate a numeric ID from the game_id string (for compatibility)
  const gameId =
    parseInt(supaGame.game_id.substring(0, 8), 16) ||
    Math.floor(Math.random() * 1000000);

  // Format the date and time - properly handle UTC format with timezone offset
  // Handle the different time formats that might come from Supabase
  let gameDateTime: Date;

  try {
    // Handle timezone offset if present in game_time
    if (supaGame.game_time.includes("+")) {
      // Format: "02:00:00+00" needs to be converted to proper ISO format
      // Extract the time and timezone parts
      const timeParts = supaGame.game_time.split("+");
      const timeWithoutTZ = timeParts[0];
      const tzOffset = timeParts[1];

      // Create a properly formatted ISO string
      // If tzOffset is "00", we format it as "+00:00" for proper ISO format
      const formattedTime = `${timeWithoutTZ}+${tzOffset.padEnd(2, "0")}:00`;

      console.log(`Reformatted time: ${supaGame.game_date}T${formattedTime}`);
      gameDateTime = new Date(`${supaGame.game_date}T${formattedTime}`);
    } else {
      // No timezone info, assume UTC
      gameDateTime = new Date(`${supaGame.game_date}T${supaGame.game_time}Z`);
    }

    // Add detailed logging for debugging
    console.log(`GAME: ${supaGame.name}`);
    console.log(
      `Original date/time: ${supaGame.game_date}T${supaGame.game_time}`
    );
    console.log(`Parsed game time: ${gameDateTime.toString()}`);
    console.log(`Is valid date: ${!isNaN(gameDateTime.getTime())}`);
  } catch (error) {
    console.error("Error parsing game time:", error);
    // Use a more reliable fallback method if the above parsing fails
    try {
      // Alternative parsing approach using separate date components
      const [year, month, day] = supaGame.game_date.split("-").map(Number);
      const [hours, minutes] = supaGame.game_time.split(":").map(Number);

      // Create date with UTC time (months in JS are 0-indexed)
      const fallbackDate = new Date(
        Date.UTC(year, month - 1, day, hours, minutes)
      );
      console.log(
        `Fallback date parsing successful: ${fallbackDate.toString()}`
      );
      gameDateTime = fallbackDate;
    } catch (fallbackError) {
      console.error("Fallback date parsing also failed:", fallbackError);
      gameDateTime = new Date(); // Last resort fallback
    }
  }

  // Format date and time in user's local timezone
  // Only format if we have a valid date
  let formattedDate = "";
  let formattedTime = "";

  if (!isNaN(gameDateTime.getTime())) {
    // We have a valid date
    formattedDate = gameDateTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    formattedTime = gameDateTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    console.log(`Formatted for display: ${formattedDate} at ${formattedTime}`);
  } else {
    console.error(`Invalid date after parsing for game: ${supaGame.name}`);
    // Set fallback values
    formattedDate = supaGame.game_date;
    formattedTime = supaGame.game_time.split("+")[0]; // Remove timezone part for display
  }

  // Properly map team names to their correct abbreviations
  const getAbbr = (teamName: string): string => {
    const teamAbbreviations: Record<string, string> = {
      "Atlanta Hawks": "ATL",
      "Boston Celtics": "BOS",
      "Brooklyn Nets": "BKN",
      "Charlotte Hornets": "CHA",
      "Chicago Bulls": "CHI",
      "Cleveland Cavaliers": "CLE",
      "Dallas Mavericks": "DAL",
      "Denver Nuggets": "DEN",
      "Detroit Pistons": "DET",
      "Golden State Warriors": "GSW",
      "Houston Rockets": "HOU",
      "Indiana Pacers": "IND",
      "Los Angeles Clippers": "LAC",
      "Los Angeles Lakers": "LAL",
      "Memphis Grizzlies": "MEM",
      "Miami Heat": "MIA",
      "Milwaukee Bucks": "MIL",
      "Minnesota Timberwolves": "MIN",
      "New Orleans Pelicans": "NOP",
      "New York Knicks": "NYK",
      "Oklahoma City Thunder": "OKC",
      "Orlando Magic": "ORL",
      "Philadelphia 76ers": "PHI",
      "Phoenix Suns": "PHX",
      "Portland Trail Blazers": "POR",
      "Sacramento Kings": "SAC",
      "San Antonio Spurs": "SAS",
      "Toronto Raptors": "TOR",
      "Utah Jazz": "UTA",
      "Washington Wizards": "WAS",
    };

    return (
      teamAbbreviations[teamName] || teamName.substring(0, 3).toUpperCase()
    );
  };

  // Create default BookOdds object
  const defaultBookOdds = {
    MGM: "N/A",
    FD: "N/A",
    DK: "N/A",
    BR: "N/A",
  };

  // Always set status to "Upcoming" since we don't want to show it
  const status = "Upcoming";

  // Get abbreviations for home and away teams
  const homeAbbr = getAbbr(supaGame.home_team);
  const awayAbbr = getAbbr(supaGame.away_team);

  return {
    id: gameId,
    homeTeam: {
      name: supaGame.home_team,
      abbreviation: homeAbbr,
      record: "0-0", // We don't have this data
    },
    awayTeam: {
      name: supaGame.away_team,
      abbreviation: awayAbbr,
      record: "0-0", // We don't have this data
    },
    date: formattedDate,
    time: formattedTime,
    status, // We'll keep this but won't display it
    odds: {
      moneyline: `${homeAbbr} -110`, // Placeholder value
      spread: `${homeAbbr} -3.5`, // Placeholder value
      total: "O/U 220.5", // Placeholder value
    },
    detailedOdds: {
      moneyline: {
        home: { ...defaultBookOdds },
        away: { ...defaultBookOdds },
      },
      spread: {
        home: { ...defaultBookOdds },
        away: { ...defaultBookOdds },
      },
      total: {
        over: { ...defaultBookOdds },
        under: { ...defaultBookOdds },
        is_player_prop: false,
      },
    },
  };
};

export default function OddsViewerPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [games, setGames] = useState<Game[]>(mockGames);
  const [loading, setLoading] = useState(true);
  const [totalsLoading, setTotalsLoading] = useState(false);
  const [playerPropsLoading, setPlayerPropsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [betTypeFilter, setBetTypeFilter] = useState("all"); // Keeping state for future implementation
  const [oddsView, setOddsView] = useState<
    "moneyline" | "spread" | "total" | "playerProps"
  >("moneyline");

  // Find the selected game
  const selectedGame = selectedGameId
    ? games.find((game) => game.id === selectedGameId)
    : null;

  // Handle game selection
  const handleSelectGame = (gameId: number) => {
    setSelectedGameId(gameId);
  };

  // Function to fetch games
  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch today's games
      console.log("Fetching NBA games...");
      const gamesData = await getGames();
      console.log(`Received ${gamesData.length} games`);

      if (gamesData && gamesData.length > 0) {
        const gameIds = gamesData.map((game) => game.game_id);

        // Fetch moneyline and spread odds first (fast)
        const [allMoneyLineOdds, allSpreadOdds] = await Promise.all([
          getBatchMoneylineOdds(gameIds),
          getBatchSpreadOdds(gameIds),
        ]);

        console.log("Moneyline odds:", allMoneyLineOdds);
        console.log("Spread odds:", allSpreadOdds);

        // Initialize with empty totals for now
        let allGameTotals: Record<
          string,
          Array<{ over: any | null; under: any | null }>
        > = {};
        gameIds.forEach((id) => {
          allGameTotals[id] = [];
        });

        // Transform the Supabase games to our Game format
        const transformedGames = gamesData.map((game) => {
          // Get the moneyline odds for this game if available
          const gameOdds = allMoneyLineOdds[game.game_id] || {
            home: null,
            away: null,
          };

          // Get the spread odds for this game if available
          const spreadOdds = allSpreadOdds[game.game_id] || {
            home: null,
            away: null,
          };

          // Get the total odds for this game if available
          const gameTotals = allGameTotals[game.game_id] || [];

          // Transform the game data
          const transformedGame = transformSupabaseGame(game);

          // Update the game with real odds data if available
          if (gameOdds.home && gameOdds.away) {
            // Process home team odds
            const homeOddsMap: Record<string, string> = {};
            const homeBestOddsMap: Record<string, boolean> = {};
            const homeLinksMap: Record<string, string> = {};

            // Create a mapping of books to their odds values and best odds flags
            gameOdds.home.odds.forEach((odd) => {
              // Format the odds value (positive numbers should have a + sign)
              const formattedOdds =
                odd.odds_value > 0
                  ? `+${odd.odds_value}`
                  : odd.odds_value.toString();
              homeOddsMap[odd.book] = formattedOdds;

              // Store which book has the best odds
              if (odd.is_best_odds) {
                homeBestOddsMap[odd.book] = true;
              }

              // Store the book link
              if (odd.book_link) {
                homeLinksMap[odd.book] = odd.book_link;
              }
            });

            // Process away team odds
            const awayOddsMap: Record<string, string> = {};
            const awayBestOddsMap: Record<string, boolean> = {};
            const awayLinksMap: Record<string, string> = {};

            // Create a mapping of books to their odds values and best odds flags
            gameOdds.away.odds.forEach((odd) => {
              // Format the odds value (positive numbers should have a + sign)
              const formattedOdds =
                odd.odds_value > 0
                  ? `+${odd.odds_value}`
                  : odd.odds_value.toString();
              awayOddsMap[odd.book] = formattedOdds;

              // Store which book has the best odds
              if (odd.is_best_odds) {
                awayBestOddsMap[odd.book] = true;
              }

              // Store the book link
              if (odd.book_link) {
                awayLinksMap[odd.book] = odd.book_link;
              }
            });

            // Update the game's detailed odds with the real data
            transformedGame.detailedOdds.moneyline = {
              home: {
                MGM: homeOddsMap.MGM || "N/A",
                FD: homeOddsMap.FD || "N/A",
                DK: homeOddsMap.DK || "N/A",
                BR: homeOddsMap.BR || "N/A",
              },
              away: {
                MGM: awayOddsMap.MGM || "N/A",
                FD: awayOddsMap.FD || "N/A",
                DK: awayOddsMap.DK || "N/A",
                BR: awayOddsMap.BR || "N/A",
              },
              bestOdds: {
                home: homeBestOddsMap,
                away: awayBestOddsMap,
              },
              bookLinks: {
                home: homeLinksMap,
                away: awayLinksMap,
              },
            };

            // Also update the basic odds summary (using the best odds for display)
            const homeBestOdds = gameOdds.home.odds.find(
              (odd) => odd.is_best_odds
            );
            const awayBestOdds = gameOdds.away.odds.find(
              (odd) => odd.is_best_odds
            );

            if (homeBestOdds && awayBestOdds) {
              const homeBestFormatted =
                homeBestOdds.odds_value > 0
                  ? `+${homeBestOdds.odds_value}`
                  : homeBestOdds.odds_value.toString();
              const awayBestFormatted =
                awayBestOdds.odds_value > 0
                  ? `+${awayBestOdds.odds_value}`
                  : awayBestOdds.odds_value.toString();

              transformedGame.odds.moneyline = `${transformedGame.homeTeam.abbreviation} ${homeBestFormatted} / ${transformedGame.awayTeam.abbreviation} ${awayBestFormatted}`;
            }
          }

          // Update the game with real spread odds data if available
          if (spreadOdds.home && spreadOdds.away) {
            // Process home team spread odds
            const homeOddsMap: Record<string, string> = {};
            const homeBestOddsMap: Record<string, boolean> = {};
            const homeLinksMap: Record<string, string> = {};

            // Create a mapping of books to their odds values and best odds flags
            if (spreadOdds.home.spreads && spreadOdds.home.spreads.length > 0) {
              const mainSpread = spreadOdds.home.spreads[0]; // Use the first spread as main one

              mainSpread.odds.forEach((odd) => {
                const formattedOdds =
                  odd.odds_value > 0
                    ? `+${odd.odds_value}`
                    : odd.odds_value.toString();
                homeOddsMap[odd.book] = formattedOdds;

                if (odd.is_best_odds) {
                  homeBestOddsMap[odd.book] = true;
                }

                if (odd.book_link) {
                  homeLinksMap[odd.book] = odd.book_link;
                }
              });
            }

            // Process away team spread odds
            const awayOddsMap: Record<string, string> = {};
            const awayBestOddsMap: Record<string, boolean> = {};
            const awayLinksMap: Record<string, string> = {};

            if (spreadOdds.away.spreads && spreadOdds.away.spreads.length > 0) {
              const mainSpread = spreadOdds.away.spreads[0]; // Use the first spread as main one

              mainSpread.odds.forEach((odd) => {
                const formattedOdds =
                  odd.odds_value > 0
                    ? `+${odd.odds_value}`
                    : odd.odds_value.toString();
                awayOddsMap[odd.book] = formattedOdds;

                if (odd.is_best_odds) {
                  awayBestOddsMap[odd.book] = true;
                }

                if (odd.book_link) {
                  awayLinksMap[odd.book] = odd.book_link;
                }
              });
            }

            // Get the display values for spreads
            let homeDisplayValue = "N/A";
            let awayDisplayValue = "N/A";

            if (
              spreadOdds.home.spreads &&
              spreadOdds.home.spreads.length > 0 &&
              spreadOdds.home.spreads[0].displayValue !== undefined
            ) {
              homeDisplayValue =
                spreadOdds.home.spreads[0].displayValue.toString();
            }

            if (
              spreadOdds.away.spreads &&
              spreadOdds.away.spreads.length > 0 &&
              spreadOdds.away.spreads[0].displayValue !== undefined
            ) {
              awayDisplayValue =
                spreadOdds.away.spreads[0].displayValue.toString();
            }

            // Update the game's detailed odds with the real spread data
            transformedGame.detailedOdds.spread = {
              home: {
                MGM: homeOddsMap.MGM || "N/A",
                FD: homeOddsMap.FD || "N/A",
                DK: homeOddsMap.DK || "N/A",
                BR: homeOddsMap.BR || "N/A",
              },
              away: {
                MGM: awayOddsMap.MGM || "N/A",
                FD: awayOddsMap.FD || "N/A",
                DK: awayOddsMap.DK || "N/A",
                BR: awayOddsMap.BR || "N/A",
              },
              bestOdds: {
                home: homeBestOddsMap,
                away: awayBestOddsMap,
              },
              bookLinks: {
                home: homeLinksMap,
                away: awayLinksMap,
              },
              values: {
                home: homeDisplayValue,
                away: awayDisplayValue,
              },
              home_group: spreadOdds.home,
              away_group: spreadOdds.away,
            };

            // Also update the basic odds summary
            if (
              spreadOdds.home.spreads &&
              spreadOdds.home.spreads.length > 0 &&
              spreadOdds.away.spreads &&
              spreadOdds.away.spreads.length > 0
            ) {
              transformedGame.odds.spread = `${transformedGame.homeTeam.abbreviation} ${homeDisplayValue}`;
            }
          }

          // Initialize basic total odds data structure with empty values
          // This will be populated more fully by the background fetch
          transformedGame.detailedOdds.total = {
            over: {
              MGM: "N/A",
              FD: "N/A",
              DK: "N/A",
              BR: "N/A",
            },
            under: {
              MGM: "N/A",
              FD: "N/A",
              DK: "N/A",
              BR: "N/A",
            },
            pairs: gameTotals,
            is_player_prop: false,
          };

          // Set a default total value for display
          transformedGame.odds.total = `O/U TBD`;

          return transformedGame;
        });

        // Sort games chronologically by the date and time
        const sortedGames = [...transformedGames].sort((a, b) => {
          // Create Date objects for comparison
          const currentYear = new Date().getFullYear();

          // Parse date and time strings
          const dateTimeA = `${currentYear} ${a.date} ${a.time}`; // e.g. "2025 Mar 18 7:00 PM"
          const dateTimeB = `${currentYear} ${b.date} ${b.time}`; // e.g. "2025 Mar 18 7:30 PM"

          // Create Date objects
          const dateA = new Date(dateTimeA);
          const dateB = new Date(dateTimeB);

          // Simple numerical comparison of timestamps
          return dateA.getTime() - dateB.getTime();
        });

        console.log("SORTED GAMES", sortedGames);

        setGames(sortedGames);
        setLoading(false);

        // Select the first game by default if none is selected
        if (sortedGames.length > 0 && !selectedGameId) {
          setSelectedGameId(sortedGames[0].id);
        }

        // Now fetch totals and player props separately in the background
        setTotalsLoading(true);
        setPlayerPropsLoading(true);

        console.log(
          "Fetching game totals and player props in the background..."
        );

        // Fetch totals and player props in parallel
        try {
          // Use Promise.all to fetch both datasets simultaneously
          const [allGameTotals, allPlayerProps] = await Promise.all([
            getBatchTotals(gameIds),
            getBatchPlayerProps(gameIds),
          ]);

          console.log("Game total odds:", allGameTotals);
          console.log("Player props data:", allPlayerProps);

          // Process the totals data first
          const gamesWithTotals = sortedGames.map((game) => {
            // Find the corresponding Supabase game to get the game_id
            const supabaseGame = gamesData.find(
              (sg) =>
                parseInt(sg.game_id.substring(0, 8), 16) === game.id ||
                (sg.home_team === game.homeTeam.name &&
                  sg.away_team === game.awayTeam.name)
            );

            if (supabaseGame) {
              const gameTotals = allGameTotals[supabaseGame.game_id] || [];

              // Deep clone the game to avoid reference issues
              const updatedGame = JSON.parse(JSON.stringify(game));

              // Update the totals data
              if (gameTotals.length > 0) {
                // Find the main total (first one or search for game total if available)
                const mainTotal =
                  gameTotals.find(
                    (total) =>
                      (total.over && !total.over.is_player_prop) ||
                      (total.under && !total.under.is_player_prop)
                  ) || gameTotals[0];

                if (mainTotal && (mainTotal.over || mainTotal.under)) {
                  // Get the total value
                  const totalValue =
                    mainTotal.over?.value || mainTotal.under?.value || 0;

                  // Update both the pairs and the text display
                  updatedGame.detailedOdds.total = {
                    ...updatedGame.detailedOdds.total,
                    pairs: gameTotals,
                    value: totalValue.toString(),
                  };

                  // Update the basic odds summary
                  updatedGame.odds.total = `O/U ${totalValue.toFixed(1)}`;
                } else {
                  updatedGame.detailedOdds.total.pairs = gameTotals;
                }
              }

              // Now add player props data to the same game object
              if (allPlayerProps[supabaseGame.game_id]) {
                // Update with player props data
                updatedGame.detailedOdds.total.playerPropsData =
                  allPlayerProps[supabaseGame.game_id];

                // Also store the raw player props for compatibility
                const playerPropsList: Array<{
                  over: any | null;
                  under: any | null;
                }> = [];

                // Flatten the player props data into a single array
                const playerPropsData = allPlayerProps[supabaseGame.game_id];
                Object.keys(playerPropsData.byPlayer).forEach((playerName) => {
                  const playerProps = playerPropsData.byPlayer[playerName];
                  Object.keys(playerProps).forEach((category) => {
                    playerPropsList.push(...(playerProps as any)[category]);
                  });
                });

                updatedGame.detailedOdds.total.playerProps = playerPropsList;
              }

              return updatedGame;
            }

            return game;
          });

          // Update the state with the processed data
          setGames(gamesWithTotals);
        } catch (error) {
          console.error("Error fetching game data:", error);
        } finally {
          // Make sure to update loading states regardless of outcome
          setTotalsLoading(false);
          setPlayerPropsLoading(false);
        }
      } else {
        console.log("No games found, using mock data");
        setGames(mockGames);
        setLoading(false);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to fetch game data. Showing sample data instead.");
      setLoading(false);
      setTotalsLoading(false);
      setPlayerPropsLoading(false);
    }
  };

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchGames();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setTimeout(() => setRefreshing(false), 1000); // Visual feedback
  };

  // Format the last updated time in user's local timezone
  const formattedLastUpdated = lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Filter games based on search term
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      searchTerm === "" ||
      game.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Updated authenticatedContent to include error message if needed
  const authenticatedContent = (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column - Games List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search teams..."
            className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
            title="Refresh data"
          >
            <RefreshCw
              size={18}
              className={`text-gray-400 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 p-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No games found matching your filters.
            </div>
          ) : (
            filteredGames.map((game) => (
              <div key={game.id} className="mb-4 cursor-pointer">
                <GameCard
                  game={game}
                  isActive={selectedGameId === game.id}
                  onClick={() => setSelectedGameId(game.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column - Game Details */}
      <div className="w-full lg:w-2/3">
        {selectedGame ? (
          <div className="bg-gray-900 text-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold">
                {selectedGame.awayTeam.name} @ {selectedGame.homeTeam.name}
              </h2>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <span>
                  {selectedGame.date} • {selectedGame.time}
                </span>
              </div>
            </div>

            {/* Update tabs to include totals view */}
            <div className="flex border-b border-gray-800">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  oddsView === "moneyline"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setOddsView("moneyline")}
              >
                Moneyline
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  oddsView === "spread"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setOddsView("spread")}
              >
                Spread
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  oddsView === "total"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setOddsView("total")}
              >
                Totals
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  oddsView === "playerProps"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setOddsView("playerProps")}
              >
                Player Props
              </button>
            </div>

            <div className="p-4 space-y-6">
              {oddsView === "moneyline" ? (
                <MoneylineOddsGrid selectedGame={selectedGame} />
              ) : oddsView === "spread" ? (
                <SpreadOddsGrid selectedGame={selectedGame} />
              ) : oddsView === "total" ? (
                <TotalOddsGrid
                  selectedGame={selectedGame}
                  isLoading={totalsLoading}
                />
              ) : (
                <PlayerPropsGrid
                  selectedGame={selectedGame}
                  isLoading={playerPropsLoading}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 text-white rounded-lg shadow-md p-8 text-center text-gray-400">
            Select a game to view detailed odds.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-black text-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <NBALogo />
          <h1 className="text-2xl font-bold">NBA Odds Viewer</h1>
        </div>
        <div className="flex items-center text-sm text-gray-400 gap-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Local Time</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>Updated: {formattedLastUpdated}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <span>Note: Game times are shown in your local timezone.</span>
        </div>
      </div>

      {isLoggedIn ? (
        authenticatedContent
      ) : (
        <>
          <BlurredContent message="Log in or subscribe to view real-time NBA odds from multiple sportsbooks." />
          <div className="opacity-20 pointer-events-none">
            {authenticatedContent}
          </div>
        </>
      )}
    </div>
  );
}
