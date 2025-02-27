"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function FreeBetConverterPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    freeBetAmount: "",
    freeBetOdds: "",
    hedgeOdds: "",
    oddsType: "american",
  });
  const [results, setResults] = useState({
    hedgeBetAmount: 0,
    guaranteedProfit: 0,
    conversionRate: 0,
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

  const calculateOptimalHedge = () => {
    // Simple implementation - in a real app, this would have more robust calculations

    const freeBetAmount = parseFloat(formData.freeBetAmount);
    const freeBetOddsValue = parseFloat(formData.freeBetOdds);
    const hedgeOddsValue = parseFloat(formData.hedgeOdds);

    // Basic calculation for American odds
    if (
      isNaN(freeBetAmount) ||
      isNaN(freeBetOddsValue) ||
      isNaN(hedgeOddsValue)
    ) {
      return;
    }

    let decimalFreeBetOdds = 0;
    let decimalHedgeOdds = 0;

    // Convert to decimal odds
    if (formData.oddsType === "american") {
      // Convert American odds to decimal
      decimalFreeBetOdds =
        freeBetOddsValue > 0
          ? freeBetOddsValue / 100 + 1
          : 100 / Math.abs(freeBetOddsValue) + 1;

      decimalHedgeOdds =
        hedgeOddsValue > 0
          ? hedgeOddsValue / 100 + 1
          : 100 / Math.abs(hedgeOddsValue) + 1;
    } else {
      // Already decimal odds
      decimalFreeBetOdds = freeBetOddsValue;
      decimalHedgeOdds = hedgeOddsValue;
    }

    // Calculate optimal hedge (simplified)
    const potentialProfit = freeBetAmount * (decimalFreeBetOdds - 1);
    const hedgeBetAmount = potentialProfit / (decimalHedgeOdds - 1);
    const guaranteedProfit = potentialProfit - hedgeBetAmount;
    const conversionRate = (guaranteedProfit / freeBetAmount) * 100;

    setResults({
      hedgeBetAmount: Math.round(hedgeBetAmount * 100) / 100,
      guaranteedProfit: Math.round(guaranteedProfit * 100) / 100,
      conversionRate: Math.round(conversionRate * 10) / 10,
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Free Bet Converter
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is a Free-Bet Converter?
          </h2>
          <p className="text-gray-300 mb-6">
            A Free-Bet Converter (also called a Bonus Bet Converter) is a
            calculator tool that helps bettors maximize the cash value they can
            extract from free or bonus bets offered by sportsbooks. Since bonus
            bets don't return the stake if you win (only the profit), this tool
            calculates the optimal hedge bet amount to place on the opposite
            outcome at another sportsbook, ensuring a guaranteed profit
            regardless of the event's result.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              You receive a $50 free bet from DraftKings. You find an NFL game
              between the Chiefs and Broncos where:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                You can place your $50 free bet on Chiefs at +200 odds on
                DraftKings
              </li>
              <li>
                You can place a hedge bet on Broncos at -180 odds on FanDuel
              </li>
            </ul>

            <h4 className="font-semibold mb-2">
              Using the Free-Bet Converter:
            </h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Input: $50 free bet at +200 odds, hedge at -180</li>
              <li>
                The calculator determines you should place a $90 hedge bet on
                the Broncos
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Outcome calculation:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                If Chiefs win: You win $100 from the free bet (no stake
                returned), minus your $90 hedge = $10 profit
              </li>
              <li>
                If Broncos win: You win $50 from the hedge bet, and lose the
                free bet (which cost you nothing) = $10 profit
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              This converts your $50 free bet into a guaranteed $10 cash profit
              (20% conversion rate), regardless of the game outcome.
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
                Unlock the Free Bet Converter Tool
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our powerful Free Bet Converter
                calculator and start maximizing your profits today.
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
              Free Bet Converter Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Free Bet Amount ($)
                  </label>
                  <input
                    type="number"
                    name="freeBetAmount"
                    value={formData.freeBetAmount}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                    placeholder="50"
                    disabled={!isLoggedIn}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Free Bet Odds
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
                      name="freeBetOdds"
                      value={formData.freeBetOdds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="+200"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Hedge Odds</label>
                  <div className="flex">
                    <select
                      disabled
                      className="bg-gray-800 border border-gray-700 rounded-l p-3 text-white"
                    >
                      <option value="american">American</option>
                    </select>
                    <input
                      type="text"
                      name="hedgeOdds"
                      value={formData.hedgeOdds}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-y border-r border-gray-700 rounded-r p-3 text-white"
                      placeholder="-180"
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>

                <div className="pt-9">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={!isLoggedIn}
                    onClick={calculateOptimalHedge}
                  >
                    Calculate Optimal Hedge
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Results</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">Hedge Bet Amount</div>
                  <div className="text-2xl font-bold">
                    ${results.hedgeBetAmount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">Guaranteed Profit</div>
                  <div className="text-2xl font-bold text-green-500">
                    ${results.guaranteedProfit.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">Conversion Rate</div>
                  <div className="text-2xl font-bold">
                    {results.conversionRate.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
                <h4 className="font-semibold mb-2">Pro Tip</h4>
                <p className="text-gray-300">
                  A conversion rate of 70%+ is considered very good. Try using
                  our arbitrage finder to locate the best markets for your free
                  bet conversions!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
