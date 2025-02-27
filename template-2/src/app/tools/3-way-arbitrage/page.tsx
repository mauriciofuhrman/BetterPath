"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function ThreeWayArbitragePage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    outcome1Odds: "",
    outcome2Odds: "",
    outcome3Odds: "",
    bankroll: "",
    oddsType: "american",
  });
  const [results, setResults] = useState({
    bet1Amount: 0,
    bet2Amount: 0,
    bet3Amount: 0,
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
    // Placeholder calculation function for 3-way arbitrage
    // This would have more robust implementation in the real tool
    if (isLoggedIn) {
      setResults({
        bet1Amount: 172.41,
        bet2Amount: 189.65,
        bet3Amount: 137.93,
        guaranteedProfit: 25.86,
        roi: 5.2,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          3-Way Arbitrage
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is 3-Way Arbitrage?
          </h2>
          <p className="text-gray-300 mb-6">
            3-Way Arbitrage is an advanced betting strategy that exploits odds
            differences across sportsbooks for events with three possible
            outcomes, such as soccer matches (win, lose, draw) or certain prop
            bets. By placing carefully calculated bets on all three outcomes at
            different sportsbooks with favorable odds, you can lock in a
            guaranteed profit regardless of which outcome occurs.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Let's examine a soccer match between Manchester United and
              Liverpool:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                At Sportsbook A, Manchester United to win is +210 (3.10 decimal)
              </li>
              <li>At Sportsbook B, Liverpool to win is +160 (2.60 decimal)</li>
              <li>At Sportsbook C, the draw is +240 (3.40 decimal)</li>
            </ul>

            <h4 className="font-semibold mb-2">
              Using the 3-Way Arbitrage Calculator:
            </h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Input: Manchester +210, Liverpool +160, Draw +240</li>
              <li>
                The calculator determines you should bet $172.41 on Manchester,
                $189.65 on Liverpool, and $137.93 on the Draw (with a total
                bankroll of $500)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Outcome calculation:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                If Manchester wins: $172.41 × 3.10 = $534.47 (profit of $34.47)
              </li>
              <li>
                If Liverpool wins: $189.65 × 2.60 = $493.09 (profit of $25.86)
              </li>
              <li>If Draw: $137.93 × 3.40 = $468.96 (profit of $25.86)</li>
            </ul>

            <p className="text-blue-400 font-semibold">
              This creates a guaranteed profit of at least $25.86 (a 5.2% ROI)
              regardless of the match outcome.
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
                Unlock the 3-Way Arbitrage Tool
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our 3-Way Arbitrage calculator
                and start finding guaranteed profits on three-outcome events.
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
              3-Way Arbitrage Calculator
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
                      placeholder="+210"
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
                      placeholder="+160"
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
                      placeholder="+240"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 1)
                  </div>
                  <div className="text-2xl font-bold">
                    ${results.bet1Amount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 2)
                  </div>
                  <div className="text-2xl font-bold">
                    ${results.bet2Amount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">
                    Bet Amount (Outcome 3)
                  </div>
                  <div className="text-2xl font-bold">
                    ${results.bet3Amount.toFixed(2)}
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
                  3-way arbitrage opportunities are most common in soccer
                  matches and 3-way prop bets. Our live scanner continuously
                  analyzes these markets across all major sportsbooks to find
                  actionable opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
