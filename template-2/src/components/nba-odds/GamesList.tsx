import React, { useState, useMemo } from "react";
import { Game } from "@/lib/types";
import GameCard from "./GameCard";
import { GAME_STATUSES } from "@/lib/constants";

interface GamesListProps {
  games: Game[];
  selectedGameId: number | null;
  onSelectGame: (gameId: number) => void;
  searchTerm: string;
}

export const GamesList: React.FC<GamesListProps> = ({
  games,
  selectedGameId,
  onSelectGame,
  searchTerm,
}) => {
  const [statusFilter, setStatusFilter] = useState("all");

  // Apply filters to games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Apply status filter
      if (
        statusFilter !== "all" &&
        game.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          game.homeTeam.name.toLowerCase().includes(searchLower) ||
          game.awayTeam.name.toLowerCase().includes(searchLower) ||
          game.homeTeam.abbreviation.toLowerCase().includes(searchLower) ||
          game.awayTeam.abbreviation.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [games, statusFilter, searchTerm]);

  return (
    <div>
      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {GAME_STATUSES.map((status) => (
          <button
            key={status.id}
            onClick={() => setStatusFilter(status.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${
                statusFilter === status.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {status.name}
          </button>
        ))}
      </div>

      {/* Game cards */}
      <div className="space-y-4">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isSelected={selectedGameId === game.id}
              onClick={() => onSelectGame(game.id)}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No games match your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesList;
