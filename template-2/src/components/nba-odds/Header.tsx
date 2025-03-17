import React from "react";
import { BET_TYPES } from "@/lib/constants";

interface HeaderProps {
  selectedBetType: string;
  onSelectBetType: (betType: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedBetType,
  onSelectBetType,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src="/nba-logo.png"
            alt="NBA Logo"
            className="w-12 h-12 mr-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            NBA Odds Viewer
          </h1>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bet type filter */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
        {BET_TYPES.map((betType) => (
          <button
            key={betType.id}
            onClick={() => onSelectBetType(betType.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
              ${
                selectedBetType === betType.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {betType.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;
