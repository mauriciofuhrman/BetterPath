"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function PositiveEVPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    betAmount: "",
    bookmakerOdds: "",
    trueOdds: "",
    oddsType: "american",
  });
  const [results, setResults] = useState({
    evValue: 0,
    evPercent: 0,
    expectedProfit: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateEV = () => {
    // Placeholder function for calculation
    const betAmount = parseFloat(formData.betAmount);
    const bookmakerOddsValue = parseFloat(formData.bookmakerOdds);
    const trueOddsValue = parseFloat(formData.trueOdds);

    if (isNaN(betAmount) || isNaN(bookmakerOddsValue) || isNaN(trueOddsValue)) {
      return;
    }

    // Convert to decimal if needed
    let decimalBookmakerOdds = 0;
    let decimalTrueOdds = 0;

    if (formData.oddsType === "american") {
      // Convert American odds to decimal
      decimalBookmakerOdds =
        bookmakerOddsValue > 0
          ? bookmakerOddsValue / 100 + 1
          : 100 / Math.abs(bookmakerOddsValue) + 1;

      decimalTrueOdds =
        trueOddsValue > 0
          ? trueOddsValue / 100 + 1
          : 100 / Math.abs(trueOddsValue) + 1;
    } else {
      // Already decimal odds
      decimalBookmakerOdds = bookmakerOddsValue;
      decimalTrueOdds = trueOddsValue;
    }

    // Calculate EV
    const trueProb = 1 / decimalTrueOdds;
    const profit = betAmount * (decimalBookmakerOdds - 1);
    const loss = betAmount;

    const evValue = trueProb * profit - (1 - trueProb) * loss;
    const evPercent = (evValue / betAmount) * 100;

    setResults({
      evValue: Math.round(evValue * 100) / 100,
      evPercent: Math.round(evPercent * 10) / 10,
      expectedProfit: Math.round(evValue * 100) / 100,
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Positive EV Calculator
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is Positive Expected Value (EV)?
          </h2>
          <p className="text-gray-300 mb-6">
            Positive Expected Value (EV) betting is a strategy that focuses on
            identifying bets where the potential payout is higher than the true
            probability of the event occurring would suggest. This indicates
            that the bet has a mathematical advantage over time, even though
            individual results may vary. Skilled bettors calculate the expected
            value of a bet to determine if it's worth placing regardless of the
            short-term outcome.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Let's say a basketball team has a 60% chance of winning according
              to your analysis:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                The sportsbook is offering +120 odds (2.20 decimal) on this team
              </li>
              <li>
                You calculate the true odds should be -150 (1.67 decimal) based
                on a 60% win probability
              </li>
            </ul>

            <h4 className="font-semibold mb-2">
              Using the Positive EV Calculator:
            </h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Input: $100 bet amount, +120 bookmaker odds, -150 true odds
              </li>
              <li>
                The calculator determines your EV is +$32.00, with an EV% of
                +32.0%
              </li>
            </ul>

            <h4 className="font-semibold mb-2">What this means:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                In the long run, every $100 bet on similar situations would
                generate an average profit of $32.00
              </li>
              <li>
                This doesn't guarantee you'll win this specific bet, but
                indicates it has a strong mathematical edge
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              By consistently betting on positive EV opportunities, you can
              build a profitable betting strategy over time regardless of
              individual wins and losses.
            </p>
          </div>
        </section>

        {/* Premium Content Section - Blurred for non-logged in users */}
        <section className="relative">
          {/* Loading state */}
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !isLoggedIn ? (
            /* Blurred overlay for non-logged in users */
            <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 rounded-xl flex flex-col items-center justify-center p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">
                Unlock the Positive EV Calculator
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our Positive EV calculator and
                start finding mathematically profitable bets today.
              </p>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  Sign Up to Unlock
                </Button>
              </Link>
            </div>
          ) : null}

          {/* Premium content - visible but blurred for non-logged in users */}
          <div
            className={`bg-gray-900/50 p-8 rounded-xl border ${
              isLoggedIn ? "border-blue-500/50" : "border-gray-800"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-6">
              Positive EV Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Bet Amount ($)
                  </label>
                  <input
                    type="number"
                    name="betAmount"
                    value={formData.betAmount}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                    placeholder="100"
                    disabled={!isLoggedIn}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Bookmaker Odds
                  </label>
                  <div className="flex">
                    <select
                      name="oddsType"
                      value={formData.oddsType}
                      onChange={handleInputChange}
                      className="bg-gray-800 border border-gray-700 rounded-l p-3 text-white"
                      disabled={!isLoggedIn}
                    >
                      <option value="american">American</option>
                      <option value="decimal">Decimal</option>
                    </select>
                    <input
                      type="text"
                      name="bookmakerOdds"
                      value={formData.bookmakerOdds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+120"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    True Odds (Your Assessment)
                  </label>
                  <div className="flex">
                    <select
                      disabled
                      className="bg-gray-800 border border-gray-700 rounded-l p-3 text-white"
                    >
                      <option value="american">American</option>
                    </select>
                    <input
                      type="text"
                      name="trueOdds"
                      value={formData.trueOdds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="-150"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>

                <div className="pt-9">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={!isLoggedIn}
                    onClick={calculateEV}
                  >
                    Calculate Expected Value
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Results</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">Expected Value</div>
                  <div className="text-2xl font-bold">
                    ${results.evValue.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">EV Percentage</div>
                  <div className="text-2xl font-bold text-green-500">
                    {results.evPercent.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">Expected Profit</div>
                  <div className="text-2xl font-bold">
                    ${results.expectedProfit.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
                <h4 className="font-semibold mb-2">Pro Tip</h4>
                <p className="text-gray-300">
                  An EV% of 5%+ is considered excellent value. Our Positive EV
                  scanner continuously analyzes lines across major sportsbooks
                  and compares them to sharp market prices to identify +EV
                  opportunities automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
