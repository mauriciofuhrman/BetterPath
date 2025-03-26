import React from "react";
import Image from "next/image";
import { SPORTSBOOKS } from "@/lib/constants";

interface SportsBookOddsProps {
  oddsData: any;
  findOddsForBook: (book: string) => any;
  formatOddsValue: (odds: any) => string;
  onBetClick?: (link: string) => void;
}

/**
 * A reusable component for displaying sportsbook odds across different grid components
 */
const SportsBookOddsDisplay: React.FC<SportsBookOddsProps> = ({
  oddsData,
  findOddsForBook,
  formatOddsValue,
  onBetClick,
}) => {
  // Function to handle bet click if provided
  const handleBetClick = (link: string) => {
    if (onBetClick) {
      onBetClick(link);
    } else {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="font-medium text-blue-600 text-left">Sportsbook</div>
        <div className="font-medium text-blue-600 text-right">Odds</div>
      </div>

      {SPORTSBOOKS.map((book) => {
        // Find odds for this sportsbook using the provided callback
        const bookOdds = findOddsForBook(book.id);

        // Determine background color based on sportsbook
        let bgColor = "bg-white";
        if (book.id === "FD") bgColor = "bg-[#0079FF]";
        else if (book.id === "MGM") bgColor = "bg-black";
        else if (book.id === "DK") bgColor = "bg-white";
        else if (book.id === "ESPN") bgColor = "bg-[#0a1e42]";
        else if (book.id === "BR") bgColor = "bg-white";
        else if (book.id === "FAN") bgColor = "bg-white"; // White background for Fanatics

        if (!bookOdds) {
          return (
            <div
              key={book.id}
              className="grid grid-cols-2 items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-start">
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
              <div className="text-right text-gray-500">N/A</div>
            </div>
          );
        }

        // Get formatted odds using the provided formatter
        const formattedOdds = formatOddsValue(bookOdds);

        return (
          <div
            key={book.id}
            className="grid grid-cols-2 items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-start">
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
            <div className="text-right">
              {bookOdds.book_link ? (
                <button
                  onClick={() => handleBetClick(bookOdds.book_link)}
                  className={`py-2 px-4 rounded-lg font-medium text-lg transition-all ${
                    bookOdds.is_best_odds
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {formattedOdds}
                </button>
              ) : (
                <span
                  className={`py-2 px-4 rounded-lg font-medium text-lg ${
                    bookOdds.is_best_odds
                      ? "bg-green-100 text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {formattedOdds}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SportsBookOddsDisplay;
