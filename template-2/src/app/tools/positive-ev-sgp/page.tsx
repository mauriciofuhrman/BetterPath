"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function PositiveEVSGPPage() {
  const { isLoggedIn, isLoading } = useAuth();

  // Placeholder state for a premium tool dashboard
  const [activeTab, setActiveTab] = useState("nba");

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Positive EV Same Game Parlay
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is a Positive EV Same Game Parlay?
          </h2>
          <p className="text-gray-300 mb-6">
            A Positive EV Same Game Parlay (SGP) strategy identifies same-game
            parlays with positive expected value, meaning they offer
            mathematical advantage over time. Unlike traditional parlays that
            combine bets across different games, SGPs allow you to parlay
            multiple bets within the same game. Our tool identifies situations
            where sportsbooks misprice the correlation between SGP legs, or
            where promotions and odds boosts create +EV opportunities that smart
            bettors can exploit.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Consider this NBA SGP opportunity our tool found:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Lakers vs. Warriors game</li>
              <li>LeBron James over 26.5 points (-110)</li>
              <li>LeBron James over 8.5 assists (-115)</li>
              <li>Lakers +3.5 (-110)</li>
            </ul>

            <h4 className="font-semibold mb-2">The Value Analysis:</h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Standard SGP odds offered: +475</li>
              <li>
                Our correlation model indicates the fair odds should be +400 due
                to the positive correlation between LeBron's performance and
                Lakers covering
              </li>
              <li>
                FanDuel is offering a 25% SGP boost, bringing the final odds to
                +593
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Expected Value Calculation:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                True probability of hitting (based on our model): 20%
                (equivalent to +400 odds)
              </li>
              <li>
                With a $100 bet at +593 odds:
                <ul className="list-disc pl-6 mt-2">
                  <li>Potential payout: $693 (including stake)</li>
                  <li>
                    EV calculation: (0.20 × $693) - (0.80 × $100) = $58.60
                  </li>
                </ul>
              </li>
              <li>This represents a strong +58.6% expected value</li>
            </ul>

            <p className="text-blue-400 font-semibold">
              Our SGP finder automatically identifies these opportunities by
              analyzing correlations between bet legs and factoring in
              promotional boosts that create profitable betting situations.
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
                Unlock the Positive EV SGP Finder
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our SGP finder and discover
                highly profitable same-game parlay opportunities across major
                sportsbooks.
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
              Positive EV SGP Finder
            </h2>

            <div className="mb-6">
              <div className="flex space-x-1 overflow-x-auto bg-gray-800/50 rounded-t-lg">
                <button
                  className={`px-4 py-3 ${
                    activeTab === "nba"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("nba")}
                  disabled={!isLoggedIn}
                >
                  NBA
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "nfl"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("nfl")}
                  disabled={!isLoggedIn}
                >
                  NFL
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "mlb"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("mlb")}
                  disabled={!isLoggedIn}
                >
                  MLB
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "nhl"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("nhl")}
                  disabled={!isLoggedIn}
                >
                  NHL
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Current SGP Opportunities
                </h3>
                <div className="flex space-x-3">
                  <Button
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                    disabled={!isLoggedIn}
                  >
                    Refresh Data
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isLoggedIn}
                  >
                    Filter Options
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        Lakers vs. Warriors
                      </h4>
                      <span className="text-sm text-gray-400">
                        Today at 7:30 PM ET • FanDuel
                      </span>
                    </div>
                    <span className="bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      +58.6% EV
                    </span>
                  </div>
                  <div className="mb-3 bg-gray-900/50 p-3 rounded">
                    <div className="text-sm font-medium text-gray-400 mb-2">
                      SGP Legs:
                    </div>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex justify-between">
                        <span>• LeBron James over 26.5 points</span>
                        <span className="text-white">-110</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• LeBron James over 8.5 assists</span>
                        <span className="text-white">-115</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Lakers +3.5</span>
                        <span className="text-white">-110</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div>
                      <span className="text-gray-400">Raw Odds: </span>
                      <span className="text-white">+475</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fair Odds: </span>
                      <span className="text-white">+400</span>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        Final Odds (w/boost):{" "}
                      </span>
                      <span className="text-green-500 font-bold">+593</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isLoggedIn}
                  >
                    View Details
                  </Button>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        Celtics vs. Bucks
                      </h4>
                      <span className="text-sm text-gray-400">
                        Tomorrow at 8:00 PM ET • DraftKings
                      </span>
                    </div>
                    <span className="bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      +32.4% EV
                    </span>
                  </div>
                  <div className="mb-3 bg-gray-900/50 p-3 rounded">
                    <div className="text-sm font-medium text-gray-400 mb-2">
                      SGP Legs:
                    </div>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex justify-between">
                        <span>• Giannis Antetokounmpo over 29.5 points</span>
                        <span className="text-white">-115</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Over 228.5 total points</span>
                        <span className="text-white">-110</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Jayson Tatum over 2.5 threes</span>
                        <span className="text-white">-125</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div>
                      <span className="text-gray-400">Raw Odds: </span>
                      <span className="text-white">+425</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fair Odds: </span>
                      <span className="text-white">+380</span>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        Final Odds (w/boost):{" "}
                      </span>
                      <span className="text-green-500 font-bold">+531</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isLoggedIn}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
              <h4 className="font-semibold mb-2">Pro Tip</h4>
              <p className="text-gray-300">
                SGP opportunities are most valuable when there's strong
                correlation between legs and when sportsbooks offer odds boosts.
                Our model accounts for correlations that sportsbooks often
                misprice, giving you a significant edge. Always look for SGPs
                with at least 10%+ EV for the best long-term profit potential.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
