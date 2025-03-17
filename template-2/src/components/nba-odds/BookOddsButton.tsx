import React from "react";
import { SPORTSBOOKS } from "@/lib/constants";

interface BookOddsButtonProps {
  bookId: string;
  odds: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const BookOddsButton: React.FC<BookOddsButtonProps> = ({
  bookId,
  odds,
  onClick,
  isSelected = false,
}) => {
  const sportsbook =
    SPORTSBOOKS.find((book) => book.id === bookId) || SPORTSBOOKS[0];

  // Determine if odds are positive (underdog) for styling
  const isPositive = odds.startsWith("+");

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        rounded-md px-3 py-2 w-full
        transition-all duration-150
        ${
          isSelected
            ? "ring-2 ring-blue-500 shadow-md transform scale-105"
            : "hover:shadow-md hover:scale-102"
        }
      `}
      style={{
        backgroundColor: sportsbook.color,
        color: sportsbook.textColor,
      }}
    >
      <div className="text-sm font-semibold">{sportsbook.name}</div>
      <div
        className={`text-base font-bold ${isPositive ? "text-green-300" : ""}`}
      >
        {odds}
      </div>
    </button>
  );
};

export default BookOddsButton;
