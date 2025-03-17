import React, { useMemo } from "react";
import { Game } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onClick: () => void;
}

// Create a component to handle logo rendering with proper caching
// Add interface for the logo component
interface LogoComponentProps {
  size?: number;
}

const TeamLogo = ({
  abbreviation,
  size = 32,
}: {
  abbreviation: string;
  size?: number;
}) => {
  // Use useMemo to cache the component and prevent re-creation on re-renders
  const LogoComponent = useMemo(() => {
    return dynamic<LogoComponentProps>(
      () => import("react-nba-logos").then((mod) => mod[abbreviation]),
      {
        loading: () => (
          <div
            className={`w-${size / 4} h-${
              size / 4
            } bg-gray-200 dark:bg-gray-700 rounded-full`}
          ></div>
        ),
        ssr: false,
      }
    );
  }, [abbreviation]);

  return <LogoComponent size={size} />;
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isSelected,
  onClick,
}) => {
  const { homeTeam, awayTeam, date, time, status, odds } = game;

  // Status-based styling
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-red-500";
      case "upcoming":
        return "bg-blue-500";
      case "final":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-900 text-white rounded-lg 
        shadow-md p-4 mb-4 cursor-pointer
        transition-all duration-200 ease-in-out 
        hover:bg-gray-800
        ${
          isSelected
            ? "border-l-4 border-blue-500"
            : "border-l-4 border-transparent"
        }
      `}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">
          {date} • {formatTime(time)}
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}
        >
          {status}
        </div>
      </div>

      <div className="space-y-3">
        {/* Away Team */}
        <div className="flex items-center">
          <div className="w-8 h-8 flex-shrink-0 mr-3">
            <TeamLogo abbreviation={awayTeam.abbreviation} size={32} />
          </div>
          <div className="flex-grow">
            <div className="font-semibold">{awayTeam.name}</div>
            <div className="text-xs text-gray-500">{awayTeam.record}</div>
          </div>
          {awayTeam.score !== undefined && (
            <div className="text-xl font-bold">{awayTeam.score}</div>
          )}
        </div>

        {/* Home Team */}
        <div className="flex items-center">
          <div className="w-8 h-8 flex-shrink-0 mr-3">
            <TeamLogo abbreviation={homeTeam.abbreviation} size={32} />
          </div>
          <div className="flex-grow">
            <div className="font-semibold">{homeTeam.name}</div>
            <div className="text-xs text-gray-500">{homeTeam.record}</div>
          </div>
          {homeTeam.score !== undefined && (
            <div className="text-xl font-bold">{homeTeam.score}</div>
          )}
        </div>
      </div>

      {/* Basic Odds Preview */}
      {odds && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs">
            <div className="text-gray-400">Spread</div>
            <div className="font-medium">{odds.spread}</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-400">Total</div>
            <div className="font-medium">{odds.total}</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-400">ML</div>
            <div className="font-medium">{odds.moneyline}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;
