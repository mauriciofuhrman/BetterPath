import React from "react";
import BookOddsButton from "./BookOddsButton";

interface BettingOption {
  name: string;
  odds: {
    [bookId: string]: string;
  };
}

interface BettingCardProps {
  title: string;
  options: BettingOption[];
}

export const BettingCard: React.FC<BettingCardProps> = ({ title, options }) => {
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold mb-3 text-white">{title}</h3>
      <div className="space-y-4">
        {options.map((option, optionIndex) => (
          <div key={optionIndex} className="space-y-2">
            <div className="text-md font-medium text-gray-300">
              {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(option.odds).map(([bookId, odds]) => (
                <BookOddsButton key={bookId} bookId={bookId} odds={odds} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingCard;
