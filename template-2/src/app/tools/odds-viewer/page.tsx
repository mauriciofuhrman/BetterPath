"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Header, GamesList, GameDetails } from "@/components/nba-odds";
import { Game } from "@/lib/types";
import { mockGames } from "@/lib/mock-data";
import { fetchTodaysNBAGames } from "@/lib/supabase-utils";
import { GameCard } from "@/components/nba-odds/GameCard";

// Constants for bet types
const BET_TYPES = [
  { id: "all", name: "All Bets" },
  { id: "ML", name: "ML" },
  { id: "Spreads", name: "Spreads" },
  { id: "Total", name: "Total" },
  { id: "PlayerProps", name: "Player Props" },
];

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

export default function OddsViewerPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedBetType, setSelectedBetType] = useState("all");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [betTypeFilter, setBetTypeFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // In a real app, you'd fetch data from your API here
    // For now, we'll use the mock data
    setGames(mockGames);
  }, []);

  // Find the selected game
  const selectedGame = selectedGameId
    ? games.find((game) => game.id === selectedGameId)
    : null;

  // Handle game selection
  const handleSelectGame = (gameId: number) => {
    setSelectedGameId(gameId);
  };

  // Handle game status filter
  const handleStatusFilterChange = (status: string) => {
    setActiveTab(status.toLowerCase());
  };

  // Function to fetch games
  const fetchGames = async () => {
    setLoading(true);
    try {
      const todaysGames = await fetchTodaysNBAGames();
      setGames(todaysGames);
      // Select the first game by default if available
      if (todaysGames.length > 0 && !selectedGameId) {
        setSelectedGameId(todaysGames[0].id);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
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

  // Format the last updated time
  const formattedLastUpdated = lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Filter games based on search term and status
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      searchTerm === "" ||
      game.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      game.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Content to show for authenticated users
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

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            All Games
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "live"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setStatusFilter("live")}
          >
            Live
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setStatusFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "final"
                ? "bg-gray-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setStatusFilter("final")}
          >
            Final
          </button>
        </div>

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
                  isSelected={selectedGameId === game.id}
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
          <div className="bg-gray-900 text-white rounded-lg shadow-md p-5">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bet Type</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {BET_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                        betTypeFilter === type.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setBetTypeFilter(type.id)}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <GameDetails game={selectedGame} selectedBetType={betTypeFilter} />
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
            <span>West Coast Time</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>Updated: {formattedLastUpdated}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <span>
            Note: Game times are converted from UTC to West Coast time.
          </span>
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
