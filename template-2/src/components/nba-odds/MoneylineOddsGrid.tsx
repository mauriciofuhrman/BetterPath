import React from "react";
import Image from "next/image";
import { Game } from "@/lib/types";

interface MoneylineOddsGridProps {
  selectedGame: Game | null;
}

const sportsbooks = [
  {
    id: "FD",
    name: "FanDuel",
    logoPath: "/sportsbook-logos/FanDuel-Logo.png",
    logoStyle: "brightness(1.5)",
  },
  {
    id: "MGM",
    name: "BetMGM",
    logoPath: "/sportsbook-logos/BetMGM-Logo-–-HiRes.png",
    logoStyle: "", // Already bright enough
  },
  {
    id: "DK",
    name: "DraftKings",
    logoPath: "/sportsbook-logos/Draftkings-Logo-PNG-Clipart.png",
    logoStyle: "", // Already bright enough
  },
  {
    id: "BR",
    name: "BetRivers",
    logoPath: "/sportsbook-logos/BetRivers_SB_Horizontal_BlueDrop_RGB.png",
    logoStyle: "brightness(1.5)",
  },
];

const MoneylineOddsGrid: React.FC<MoneylineOddsGridProps> = ({
  selectedGame,
}) => {
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

  // Get moneyline odds from the detailedOdds
  const homeOdds = detailedOdds.moneyline.home;
  const awayOdds = detailedOdds.moneyline.away;
  const bestOdds = detailedOdds.moneyline.bestOdds || { home: {}, away: {} };
  const bookLinks = detailedOdds.moneyline.bookLinks || { home: {}, away: {} };

  // Function to handle bet click
  const handleBetClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="bg-[#ffffff] text-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#326fff] p-4">
        <h2 className="text-xl font-bold text-center">Moneyline Odds</h2>
      </div>

      {/* Header Row with team names - reversed to match image */}
      <div className="grid grid-cols-3 border-b border-gray-700">
        <div className="p-3 font-semibold text-[#326fff]">Sportsbook</div>
        <div className="p-3 font-semibold text-center text-[#326fff]">
          {awayTeam.name}
        </div>
        <div className="p-3 font-semibold text-center text-[#326fff]">
          {homeTeam.name}
        </div>
      </div>

      {/* Sportsbooks Rows */}
      {sportsbooks.map((book) => {
        const currentHomeOdds = homeOdds[book.id as keyof typeof homeOdds];
        const currentAwayOdds = awayOdds[book.id as keyof typeof awayOdds];
        const homeLink = bookLinks.home[book.id];
        const awayLink = bookLinks.away[book.id];

        // Use the API's is_best_odds flag directly
        const isHomeBest = bestOdds.home[book.id] || false;
        const isAwayBest = bestOdds.away[book.id] || false;

        return (
          <div
            key={book.id}
            className="grid grid-cols-3 items-center border-b border-gray-800"
          >
            {/* Sportsbook Logo */}
            <div className="p-3 flex items-center justify-start">
              <div className="relative h-9 w-24 lg:w-32">
                <Image
                  src={book.logoPath}
                  alt={`${book.name} logo`}
                  fill
                  className="object-contain object-left"
                  style={{
                    filter: book.logoStyle ? book.logoStyle : "none",
                    backdropFilter: "brightness(1.1)",
                  }}
                />
              </div>
            </div>

            {/* Away Team Odds */}
            <div className="p-3 text-center">
              {awayLink && currentAwayOdds !== "N/A" ? (
                <button
                  onClick={() => handleBetClick(awayLink)}
                  className={`py-1 px-3 rounded font-medium text-lg hover:bg-[#1e2637] transition-colors ${
                    isAwayBest ? "text-green-400" : "text-[#326fff]"
                  }`}
                >
                  {currentAwayOdds}
                </button>
              ) : (
                <span
                  className={`py-1 px-3 rounded font-medium text-lg ${
                    isAwayBest ? "text-green-400" : "text-[#326fff]"
                  }`}
                >
                  {currentAwayOdds}
                </span>
              )}
            </div>

            {/* Home Team Odds */}
            <div className="p-3 text-center">
              {homeLink && currentHomeOdds !== "N/A" ? (
                <button
                  onClick={() => handleBetClick(homeLink)}
                  className={`py-1 px-3 rounded font-medium text-lg hover:bg-[#1e2637] transition-colors ${
                    isHomeBest ? "text-green-400" : "text-[#326fff]"
                  }`}
                >
                  {currentHomeOdds}
                </button>
              ) : (
                <span
                  className={`py-1 px-3 rounded font-medium text-lg ${
                    isHomeBest ? "text-green-400" : "text-[#326fff]"
                  }`}
                >
                  {currentHomeOdds}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <div className="p-4 flex flex-col items-center text-xs text-gray-500">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
          <span>Best available odds</span>
        </div>
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default MoneylineOddsGrid;
