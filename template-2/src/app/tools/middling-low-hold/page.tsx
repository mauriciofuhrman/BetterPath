"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function MiddlingLowHoldPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("middling");
  const [formData, setFormData] = useState({
    line1: "",
    odds1: "",
    line2: "",
    odds2: "",
    bankroll: "",
  });
  const [results, setResults] = useState({
    bet1Amount: 0,
    bet2Amount: 0,
    middleProfit: 0,
    maxLoss: 0,
    expectedValue: 0,
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

  const calculateMiddling = () => {
    // Placeholder calculation function for middling
    // This would have more robust implementation in the real tool
    if (isLoggedIn) {
      setResults({
        bet1Amount: 545.45,
        bet2Amount: 454.55,
        middleProfit: 1090.91,
        maxLoss: 50,
        expectedValue: 109.09,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Middling & Low Hold
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is Middling & Low Hold?
          </h2>
          <p className="text-gray-300 mb-6">
            Middling and Low Hold are two advanced betting strategies that take
            advantage of discrepancies between sportsbooks:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Middling:</h3>
              <p className="text-gray-300 mb-3">
                Middling involves betting on both sides of a spread or total
                that has moved significantly, creating an opportunity to win
                both bets if the final result falls between your two wagers.
                This strategy creates the potential for a large profit with
                minimal risk, as you can only lose the "gap" between your bet
                amounts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Low Hold:</h3>
              <p className="text-gray-300 mb-3">
                Low Hold opportunities occur when the combined implied
                probabilities of all outcomes from different sportsbooks add up
                to less than 100%. This allows you to bet all sides of an event
                and guarantee a profit regardless of the outcome, similar to
                arbitrage but specifically focusing on minimizing the "hold"
                percentage that sportsbooks typically build into their odds.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg mt-6 mb-8">
            <h3 className="text-xl font-semibold mb-3">Middling Example:</h3>
            <p className="text-gray-300 mb-4">
              Consider a football game where the point spread has moved
              significantly:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Early in the week, you bet $545.45 on Team A +7.5 (-110) at
                Sportsbook X
              </li>
              <li>
                By game day, the line has moved to Team A +2.5, allowing you to
                bet $454.55 on Team B -2.5 (-110) at Sportsbook Y
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Outcome Scenarios:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                If Team B wins by exactly 3, 4, 5, 6, or 7 points, you win BOTH
                bets for a total profit of $1,090.91
              </li>
              <li>
                If any other outcome occurs, you lose only $50 (the difference
                between your two bets)
              </li>
              <li>
                If you calculate the probability of hitting the "middle" at
                14.5%, the expected value is +$109.09
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-8">
              Low Hold Example:
            </h3>
            <p className="text-gray-300 mb-4">
              Consider a tennis match with the following moneyline odds:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Player A: +130 at Sportsbook X (implied probability 43.5%)
              </li>
              <li>
                Player B: +120 at Sportsbook Y (implied probability 45.5%)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Low Hold Analysis:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                Total implied probability: 43.5% + 45.5% = 89% (11% below 100%)
              </li>
              <li>
                With a $1,000 bankroll, optimal bet allocation would be $543 on
                Player A and $457 on Player B
              </li>
              <li>
                Guaranteed profit: $110 (11% of your bankroll) regardless of who
                wins
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              Both strategies can be highly profitable, but require careful
              bankroll allocation and quick action when opportunities arise.
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
                Unlock the Middling & Low Hold Tools
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our Middling and Low Hold
                calculators and start finding these advanced profit
                opportunities.
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
              Middling & Low Hold Calculators
            </h2>

            <div className="mb-6">
              <div className="flex space-x-1 overflow-x-auto bg-gray-800/50 rounded-t-lg">
                <button
                  className={`px-4 py-3 ${
                    activeTab === "middling"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("middling")}
                  disabled={!isLoggedIn}
                >
                  Middling Calculator
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "lowhold"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("lowhold")}
                  disabled={!isLoggedIn}
                >
                  Low Hold Calculator
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "scanner"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("scanner")}
                  disabled={!isLoggedIn}
                >
                  Live Scanner
                </button>
              </div>
            </div>

            {activeTab === "middling" && (
              <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-6">
                  Middling Calculator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        First Line (e.g., +7.5)
                      </label>
                      <input
                        type="text"
                        name="line1"
                        value={formData.line1}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                        placeholder="+7.5"
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        First Line Odds
                      </label>
                      <input
                        type="text"
                        name="odds1"
                        value={formData.odds1}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                        placeholder="-110"
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Second Line (e.g., -2.5)
                      </label>
                      <input
                        type="text"
                        name="line2"
                        value={formData.line2}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                        placeholder="-2.5"
                        disabled={!isLoggedIn}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Second Line Odds
                      </label>
                      <input
                        type="text"
                        name="odds2"
                        value={formData.odds2}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                        placeholder="-110"
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Total Bankroll ($)
                      </label>
                      <input
                        type="number"
                        name="bankroll"
                        value={formData.bankroll}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                        placeholder="1000"
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <div className="pt-9">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                        disabled={!isLoggedIn}
                        onClick={calculateMiddling}
                      >
                        Calculate Optimal Middling Strategy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Results</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="text-gray-400 mb-1">First Bet Amount</div>
                      <div className="text-xl font-bold">
                        ${results.bet1Amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="text-gray-400 mb-1">
                        Second Bet Amount
                      </div>
                      <div className="text-xl font-bold">
                        ${results.bet2Amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="text-gray-400 mb-1">
                        Potential Middle Profit
                      </div>
                      <div className="text-xl font-bold text-green-500">
                        ${results.middleProfit.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="text-gray-400 mb-1">Maximum Loss</div>
                      <div className="text-xl font-bold text-red-400">
                        ${results.maxLoss.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="text-gray-400 mb-1">Expected Value</div>
                      <div className="text-xl font-bold text-green-500">
                        ${results.expectedValue.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
                    <h4 className="font-semibold mb-2">Pro Tip</h4>
                    <p className="text-gray-300">
                      Middling opportunities are most common in basketball and
                      football when point spreads move significantly due to
                      injuries or public betting patterns. Our line movement
                      tracker alerts you when ideal middling situations arise.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "lowhold" && (
              <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-6">
                  Low Hold Calculator
                </h3>

                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-400 text-center">
                    {isLoggedIn
                      ? "Low Hold Calculator interface would be displayed here in the full implementation."
                      : "Sign up to access this tool."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "scanner" && (
              <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-6">Live Scanner</h3>

                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-400 text-center">
                    {isLoggedIn
                      ? "Live Scanner interface would be displayed here in the full implementation."
                      : "Sign up to access this tool."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
