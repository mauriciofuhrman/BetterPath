import React, { useState, useEffect, useMemo } from "react";
import { Game } from "@/lib/types";
import BettingCard from "./BettingCard";
import dynamic from "next/dynamic";

// Create a component to handle logo rendering with proper caching
// Add interface for the logo component
interface LogoComponentProps {
  size?: number;
}

const TeamLogo = ({
  abbreviation,
  size = 64,
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

interface GameDetailsProps {
  game: Game;
  selectedBetType: string;
}

export const GameDetails: React.FC<GameDetailsProps> = ({
  game,
  selectedBetType,
}) => {
  const { detailedOdds } = game;
  const [loading, setLoading] = useState(false);

  // Add loading effect when game changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [game.id]);

  // Helper function to format betting options for BettingCard component
  const formatBettingOptions = (
    options: any,
    label1: string,
    label2?: string
  ) => {
    if (!options) return [];

    const formattedOptions = [];

    if (options[label1]) {
      formattedOptions.push({
        name: label1,
        odds: options[label1],
      });
    }

    if (label2 && options[label2]) {
      formattedOptions.push({
        name: label2,
        odds: options[label2],
      });
    }

    return formattedOptions;
  };

  // Render content based on selected bet type
  const renderBetTypeContent = () => {
    if (selectedBetType === "all" || selectedBetType === "Spreads") {
      return (
        <BettingCard
          title="Spread"
          options={formatBettingOptions(detailedOdds.spread, "away", "home")}
        />
      );
    }

    if (selectedBetType === "all" || selectedBetType === "Total") {
      // Check if the total is not a player prop
      if (detailedOdds.total && !detailedOdds.total.is_player_prop) {
        return (
          <BettingCard
            title="Total"
            options={formatBettingOptions(detailedOdds.total, "over", "under")}
          />
        );
      }
    }

    if (selectedBetType === "all" || selectedBetType === "ML") {
      return (
        <BettingCard
          title="Moneyline"
          options={formatBettingOptions(detailedOdds.moneyline, "away", "home")}
        />
      );
    }

    if (selectedBetType === "all" || selectedBetType === "PlayerProps") {
      // Filter for player props
      return (
        <>
          {detailedOdds.playerProps?.map((prop, index) => (
            <BettingCard
              key={index}
              title={prop.title}
              options={prop.options.map((option) => ({
                name: option.name,
                odds: option.odds,
              }))}
            />
          ))}

          {/* Show any first quarter/half totals that are player props */}
          {detailedOdds.firstQuarter?.total.is_player_prop && (
            <BettingCard
              title="1st Quarter Player Totals"
              options={formatBettingOptions(
                detailedOdds.firstQuarter?.total,
                "over",
                "under"
              )}
            />
          )}

          {detailedOdds.firstHalf?.total.is_player_prop && (
            <BettingCard
              title="1st Half Player Totals"
              options={formatBettingOptions(
                detailedOdds.firstHalf?.total,
                "over",
                "under"
              )}
            />
          )}
        </>
      );
    }

    // Default case - show all bets if 'all' is selected but nothing else matched
    if (selectedBetType === "all") {
      return (
        <>
          {/* Spreads */}
          <BettingCard
            title="Spread"
            options={formatBettingOptions(detailedOdds.spread, "away", "home")}
          />

          {/* Totals (not player props) */}
          {!detailedOdds.total?.is_player_prop && (
            <BettingCard
              title="Total"
              options={formatBettingOptions(
                detailedOdds.total,
                "over",
                "under"
              )}
            />
          )}

          {/* Moneyline */}
          <BettingCard
            title="Moneyline"
            options={formatBettingOptions(
              detailedOdds.moneyline,
              "Away",
              "Home"
            )}
          />

          {/* Player Props */}
          {detailedOdds.playerProps?.map((prop, index) => (
            <BettingCard
              key={`prop-${index}`}
              title={prop.title}
              options={prop.options.map((option) => ({
                name: option.name,
                odds: option.odds,
              }))}
            />
          ))}
        </>
      );
    }

    // No match case
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 mb-4">
        <p className="text-center text-gray-400">
          Select a bet type to view odds
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-center space-x-6 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-2">
              <TeamLogo abbreviation={game.awayTeam.abbreviation} size={64} />
            </div>
            <span className="font-bold">{game.awayTeam.abbreviation}</span>
            {game.awayTeam.score !== undefined && (
              <span className="text-2xl font-bold">{game.awayTeam.score}</span>
            )}
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">{game.status}</div>
            <div className="text-lg font-bold">VS</div>
            <div className="text-sm text-gray-400 mt-1">
              {game.date} • {game.time}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-2">
              <TeamLogo abbreviation={game.homeTeam.abbreviation} size={64} />
            </div>
            <span className="font-bold">{game.homeTeam.abbreviation}</span>
            {game.homeTeam.score !== undefined && (
              <span className="text-2xl font-bold">{game.homeTeam.score}</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderBetTypeContent()
      )}
    </div>
  );
};

export default GameDetails;
