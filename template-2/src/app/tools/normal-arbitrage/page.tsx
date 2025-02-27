"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function NormalArbitragePage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    outcome1Odds: "",
    outcome2Odds: "",
    bankroll: "",
    oddsType: "american",
  });
  const [results, setResults] = useState({
    bet1Amount: 0,
    bet2Amount: 0,
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
    // Simple implementation - in a real app, this would have more robust calculations
    const outcome1Odds = parseFloat(formData.outcome1Odds);
    const outcome2Odds = parseFloat(formData.outcome2Odds);
    const bankroll = parseFloat(formData.bankroll);

    if (isNaN(outcome1Odds) || isNaN(outcome2Odds) || isNaN(bankroll)) {
      return;
    }

    let decimal1 = 0;
    let decimal2 = 0;

    // Convert to decimal odds
    if (formData.oddsType === "american") {
      // Convert American odds to decimal
      decimal1 =
        outcome1Odds > 0
          ? outcome1Odds / 100 + 1
          : 100 / Math.abs(outcome1Odds) + 1;

      decimal2 =
        outcome2Odds > 0
          ? outcome2Odds / 100 + 1
          : 100 / Math.abs(outcome2Odds) + 1;
    } else {
      // Already decimal odds
      decimal1 = outcome1Odds;
      decimal2 = outcome2Odds;
    }

    // Calculate implied probabilities
    const impliedProb1 = 1 / decimal1;
    const impliedProb2 = 1 / decimal2;
    const totalImpliedProb = impliedProb1 + impliedProb2;

    // Check if arbitrage opportunity exists
    if (totalImpliedProb >= 1) {
      // No arbitrage opportunity
      setResults({
        bet1Amount: 0,
        bet2Amount: 0,
        guaranteedProfit: 0,
        roi: 0,
      });
      return;
    }

    // Calculate optimal stakes
    const bet1Amount = (bankroll * impliedProb1) / totalImpliedProb;
    const bet2Amount = (bankroll * impliedProb2) / totalImpliedProb;

    // Calculate guaranteed profit
    const profit1 = bet1Amount * decimal1 - bankroll;
    const profit2 = bet2Amount * decimal2 - bankroll;

    // Use the smaller profit as the guaranteed profit (should be very close)
    const guaranteedProfit = Math.min(profit1, profit2);
    const roi = (guaranteedProfit / bankroll) * 100;

    setResults({
      bet1Amount: Math.round(bet1Amount * 100) / 100,
      bet2Amount: Math.round(bet2Amount * 100) / 100,
      guaranteedProfit: Math.round(guaranteedProfit * 100) / 100,
      roi: Math.round(roi * 10) / 10,
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Normal Arbitrage
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is Normal Arbitrage?
          </h2>
          <p className="text-gray-300 mb-6">
            Normal Arbitrage is a betting strategy that exploits differences in
            odds between sportsbooks to guarantee a profit regardless of the
            outcome. By placing carefully calculated bets on all possible
            outcomes of an event at different sportsbooks with favorable odds,
            you can secure a profit no matter what happens in the actual event.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Let's look at a baseball game between the Yankees and Red Sox:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>At Sportsbook A, the Yankees are +150 (2.50 decimal)</li>
              <li>At Sportsbook B, the Red Sox are +115 (2.15 decimal)</li>
            </ul>

            <h4 className="font-semibold mb-2">
              Using the Arbitrage Calculator:
            </h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Input: Yankees at +150, Red Sox at +115</li>
              <li>
                The calculator determines you should bet $214.77 on the Yankees
                and $285.23 on the Red Sox (with a total bankroll of $500)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Outcome calculation:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                If Yankees win: $214.77 × 2.50 = $536.93 (profit of $36.93)
              </li>
              <li>
                If Red Sox win: $285.23 × 2.15 = $613.24 (profit of $113.24)
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              This creates a no-risk profit of at least $36.93 (a 7.4% ROI)
              regardless of which team wins.
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
                Unlock the Normal Arbitrage Tool
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our powerful Normal Arbitrage
                scanner and start finding guaranteed profits today.
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
              Normal Arbitrage Calculator
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
                      <option value="fraction">Fraction</option>
                    </select>
                    <input
                      type="text"
                      name="outcome1Odds"
                      value={formData.outcome1Odds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+150"
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
                      placeholder="+115"
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
                  <div className="text-gray-400 mb-1">Guaranteed Profit</div>
                  <div className="text-2xl font-bold text-green-500">
                    ${results.guaranteedProfit.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded border border-gray-700 mb-6">
                <div className="text-gray-400 mb-1">ROI</div>
                <div className="text-2xl font-bold">
                  {results.roi.toFixed(1)}%
                </div>
              </div>

              <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
                <h4 className="font-semibold mb-2">Pro Tip</h4>
                <p className="text-gray-300">
                  An arbitrage opportunity with a 2%+ ROI is considered very
                  good. Our live arbitrage scanner continuously monitors odds
                  across all major sportsbooks to find these opportunities
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
