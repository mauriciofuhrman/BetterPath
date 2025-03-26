import React from "react";
import Image from "next/image";
import { Game } from "@/lib/types";
import { SPORTSBOOKS } from "@/lib/constants";

interface MoneylineOddsGridProps {
  selectedGame: Game | null;
}

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
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <h2 className="text-xl font-bold text-center text-white">
          Moneyline Odds
        </h2>
      </div>

      {/* Header Row with team names */}
      <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50">
        <div className="p-4 pl-8 font-semibold text-blue-600 text-left">
          Sportsbook
        </div>
        <div className="p-4 font-semibold text-center text-blue-600">
          {awayTeam.name}
        </div>
        <div className="p-4 font-semibold text-center text-blue-600">
          {homeTeam.name}
        </div>
      </div>

      {/* Sportsbooks Rows */}
      {SPORTSBOOKS.map((book) => {
        const currentHomeOdds = homeOdds[book.id as keyof typeof homeOdds];
        const currentAwayOdds = awayOdds[book.id as keyof typeof awayOdds];
        const homeLink = bookLinks.home[book.id];
        const awayLink = bookLinks.away[book.id];

        // Use the API's is_best_odds flag directly
        const isHomeBest = bestOdds.home[book.id] || false;
        const isAwayBest = bestOdds.away[book.id] || false;

        // Determine background color based on sportsbook
        let bgColor = "bg-white";
        if (book.id === "FD") bgColor = "bg-[#0079FF]";
        else if (book.id === "MGM") bgColor = "bg-black";
        else if (book.id === "DK") bgColor = "bg-white";
        else if (book.id === "ESPN") bgColor = "bg-[#0a1e42]";
        else if (book.id === "BR") bgColor = "bg-white";
        else if (book.id === "Fanatics") bgColor = "bg-white"; // White background for Fanatics

        return (
          <div
            key={book.id}
            className="grid grid-cols-3 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Sportsbook Logo */}
            <div className="p-4 pl-8 flex items-center">
              <div
                className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${bgColor} border border-gray-200 shadow-sm`}
              >
                <div className="relative w-8 h-8">
                  <Image
                    src={book.logoPath}
                    alt={`${book.name} logo`}
                    fill
                    className="object-contain"
                    style={{
                      filter: book.logoStyle ? book.logoStyle : "none",
                    }}
                  />
                </div>
              </div>
              <span className="ml-3 text-gray-700 font-medium">
                {book.name}
              </span>
            </div>

            {/* Away Team Odds */}
            <div className="p-3 text-center">
              {awayLink && currentAwayOdds !== "N/A" ? (
                <button
                  onClick={() => handleBetClick(awayLink)}
                  className={`py-2 px-4 rounded-lg font-medium text-lg transition-all ${
                    isAwayBest
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {currentAwayOdds}
                </button>
              ) : (
                <span
                  className={`py-2 px-4 rounded-lg font-medium text-lg ${
                    isAwayBest ? "bg-green-100 text-green-600" : "text-blue-600"
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
                  className={`py-2 px-4 rounded-lg font-medium text-lg transition-all ${
                    isHomeBest
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {currentHomeOdds}
                </button>
              ) : (
                <span
                  className={`py-2 px-4 rounded-lg font-medium text-lg ${
                    isHomeBest ? "bg-green-100 text-green-600" : "text-blue-600"
                  }`}
                >
                  {currentHomeOdds}
                </span>
              )}
            </div>
          </div>
        );
      })}

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

export default MoneylineOddsGrid;
