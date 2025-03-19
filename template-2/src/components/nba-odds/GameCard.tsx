import React from "react";
import { Game } from "@/lib/types";
import { TeamLogo } from "./TeamLogo";

interface GameCardProps {
  game: Game;
  isActive: boolean;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, isActive, onClick }) => {
  // Ensure we have valid date and time for display
  const dateTimeDisplay = () => {
    if (!game.date || !game.time || game.date.includes("Invalid")) {
      return "Time TBD";
    }
    return `${game.date} • ${game.time}`;
  };

  // Format team names as "Away Team @ Home Team"
  const gameTitle = `${game.awayTeam.name} @ ${game.homeTeam.name}`;

  return (
    <div
      className={`p-4 mb-4 rounded-md cursor-pointer transition-all duration-200 border ${
        isActive
          ? "border-blue-500 bg-blue-900/30"
          : "border-gray-700 hover:border-gray-500 bg-gray-900"
      }`}
      onClick={onClick}
      title={gameTitle}
    >
      <div className="text-xs text-gray-400 mb-2">
        <span>{dateTimeDisplay()}</span>
      </div>

      <div className="flex items-center mb-3">
        <div className="flex-shrink-0 w-10 h-10">
          <TeamLogo abbreviation={game.awayTeam.abbreviation} size={40} />
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <span className="font-bold text-white">{game.awayTeam.name}</span>
            {game.awayTeam.score !== undefined && (
              <span className="ml-auto font-bold text-white">
                {game.awayTeam.score}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">{game.awayTeam.record}</div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10">
          <TeamLogo abbreviation={game.homeTeam.abbreviation} size={40} />
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <span className="font-bold text-white">{game.homeTeam.name}</span>
            {game.homeTeam.score !== undefined && (
              <span className="ml-auto font-bold text-white">
                {game.homeTeam.score}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">{game.homeTeam.record}</div>
        </div>
      </div>

      {/* <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-300 pt-2 border-t border-gray-700">
        <div>
          <div className="text-gray-500">Spread</div>
          <div>{game.odds.spread || "N/A"}</div>
        </div>
        <div>
          <div className="text-gray-500">Total</div>
          <div>{game.odds.total || "N/A"}</div>
        </div>
        <div>
          <div className="text-gray-500">ML</div>
          <div>{game.odds.moneyline || "N/A"}</div>
        </div>
      </div> */}
    </div>
  );
};

export default GameCard;
