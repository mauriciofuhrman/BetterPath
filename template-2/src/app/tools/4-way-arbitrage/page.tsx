"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function FourWayArbitragePage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    outcome1Odds: "",
    outcome2Odds: "",
    outcome3Odds: "",
    outcome4Odds: "",
    bankroll: "",
    oddsType: "american",
  });
  const [results, setResults] = useState({
    bet1Amount: 0,
    bet2Amount: 0,
    bet3Amount: 0,
    bet4Amount: 0,
    guaranteedProfit: 0,
    roi: 0,
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

  const calculateOptimalStakes = () => {
    // Placeholder calculation function for 4-way arbitrage
    // This would have more robust implementation in the real tool
    if (isLoggedIn) {
      setResults({
        bet1Amount: 123.45,
        bet2Amount: 145.67,
        bet3Amount: 105.89,
        bet4Amount: 113.22,
        guaranteedProfit: 11.77,
        roi: 2.4,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          4-Way Arbitrage
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is 4-Way Arbitrage?
          </h2>
          <p className="text-gray-300 mb-6">
            4-Way Arbitrage is an advanced betting strategy that exploits odds
            differences across sportsbooks for events with four possible
            outcomes, such as golf tournament placings, NASCAR race winners, or
            specific prop bet markets. By placing carefully calculated bets on
            all four outcomes at different sportsbooks with favorable odds, you
            can lock in a guaranteed profit regardless of which outcome occurs.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Consider a 4-player golf matchup where betting is offered on which
              player will place highest:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                At Sportsbook A, Player 1 is priced at +300 (4.00 decimal)
              </li>
              <li>
                At Sportsbook B, Player 2 is priced at +250 (3.50 decimal)
              </li>
              <li>
                At Sportsbook C, Player 3 is priced at +325 (4.25 decimal)
              </li>
              <li>
                At Sportsbook D, Player 4 is priced at +400 (5.00 decimal)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">
              Using the 4-Way Arbitrage Calculator:
            </h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Input: Player 1 +300, Player 2 +250, Player 3 +325, Player 4
                +400
              </li>
              <li>
                The calculator determines you should bet $123.45 on Player 1,
                $145.67 on Player 2, $105.89 on Player 3, and $113.22 on Player
                4 (with a total bankroll of $488.23)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Outcome calculation:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                If Player 1 wins: $123.45 × 4.00 = $493.80 (profit of $11.77)
              </li>
              <li>
                If Player 2 wins: $145.67 × 3.50 = $509.85 (profit of $11.77)
              </li>
              <li>
                If Player 3 wins: $105.89 × 4.25 = $450.03 (profit of $11.77)
              </li>
              <li>
                If Player 4 wins: $113.22 × 5.00 = $566.10 (profit of $11.77)
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              This creates a guaranteed profit of $11.77 (a 2.4% ROI) regardless
              of which player finishes highest in the tournament.
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
                Unlock the 4-Way Arbitrage Tool
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our 4-Way Arbitrage calculator
                and start finding guaranteed profits on four-outcome events.
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
              4-Way Arbitrage Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Outcome 1 Odds
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
                      name="outcome1Odds"
                      value={formData.outcome1Odds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+300"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Outcome 2 Odds
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
                      name="outcome2Odds"
                      value={formData.outcome2Odds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+250"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Outcome 3 Odds
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
                      name="outcome3Odds"
                      value={formData.outcome3Odds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+325"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Outcome 4 Odds
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
                      name="outcome4Odds"
                      value={formData.outcome4Odds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+400"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                    placeholder="500"
                    disabled={!isLoggedIn}
                  />
                </div>

                <div className="pt-9">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={!isLoggedIn}
                    onClick={calculateOptimalStakes}
                  >
                    Calculate Optimal Stakes
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Results</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 1)
                  </div>
                  <div className="text-xl font-bold">
                    ${results.bet1Amount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 2)
                  </div>
                  <div className="text-xl font-bold">
                    ${results.bet2Amount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 3)
                  </div>
                  <div className="text-xl font-bold">
                    ${results.bet3Amount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 4)
                  </div>
                  <div className="text-xl font-bold">
                    ${results.bet4Amount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">Guaranteed Profit</div>
                  <div className="text-2xl font-bold text-green-500">
                    ${results.guaranteedProfit.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">ROI</div>
                  <div className="text-2xl font-bold">
                    {results.roi.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
                <h4 className="font-semibold mb-2">Pro Tip</h4>
                <p className="text-gray-300">
                  4-way arbitrage opportunities are typically found in golf,
                  auto racing, and specialty prop markets. While 4-way
                  arbitrages often have lower ROI than 2-way or 3-way
                  arbitrages, they can still provide consistent guaranteed
                  profits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
