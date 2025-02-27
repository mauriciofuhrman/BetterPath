"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function ParlayFinderPage() {
  const { isLoggedIn, isLoading } = useAuth();

  // Placeholder state for a premium tool
  const [dummyState, setDummyState] = useState("tool not implemented");

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Parlay Finder</h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is a Parlay Finder?
          </h2>
          <p className="text-gray-300 mb-6">
            A Parlay Finder is a tool that identifies profitable parlay
            opportunities across different sportsbooks. Parlays combine multiple
            individual bets into a single wager with a higher potential payout.
            Our Parlay Finder analyzes thousands of betting lines to identify
            combinations that, when parlayed together, offer significant value
            or even guaranteed profit through correlated outcomes or sportsbook
            pricing inefficiencies.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Let's look at a parlay opportunity our tool identified:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>NBA: Lakers -3.5 at DraftKings (+105 odds)</li>
              <li>NFL: Chiefs ML at FanDuel (-140 odds)</li>
              <li>NHL: Bruins over 5.5 goals at BetMGM (-110 odds)</li>
            </ul>

            <h4 className="font-semibold mb-2">The Value Analysis:</h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Individual bet EV: +2.3%, +1.8%, and +3.2% respectively</li>
              <li>
                When combined in a parlay: The total odds are +509 with an EV of
                +7.6%
              </li>
              <li>
                This represents significantly better value than betting each leg
                separately
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Optimal Approach:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                Place a 3-leg parlay at the sportsbook with the best parlay
                bonus
              </li>
              <li>
                With a $100 bet, your expected value is +$7.60, meaning in the
                long run, you'd average a $7.60 profit per $100 wagered on
                similar parlays
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              Our Parlay Finder automatically identifies these opportunities,
              factoring in correlated outcomes and promotional boosts to
              maximize your expected value.
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
                Unlock the Parlay Finder Tool
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our Parlay Finder and discover
                profitable parlay opportunities across major sportsbooks.
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
            <h2 className="text-2xl font-semibold mb-6">Parlay Finder Tool</h2>

            <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Available Parlay Opportunities
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
                {/* This would be a list of parlays in a real implementation */}
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg">
                      2-Leg MLB/NBA Parlay
                    </h4>
                    <span className="bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      +5.4% EV
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex justify-between text-gray-300">
                      <span>Yankees ML</span>
                      <span className="text-white">+115 @ FanDuel</span>
                    </li>
                    <li className="flex justify-between text-gray-300">
                      <span>Celtics -4.5</span>
                      <span className="text-white">-110 @ DraftKings</span>
                    </li>
                  </ul>
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                    <span>Parlay Odds: +310</span>
                    <span>Expected Value: +$21.60 per $100</span>
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
                    <h4 className="font-semibold text-lg">
                      3-Leg NFL/NHL Parlay
                    </h4>
                    <span className="bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      +7.2% EV
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex justify-between text-gray-300">
                      <span>Chiefs ML</span>
                      <span className="text-white">-140 @ BetMGM</span>
                    </li>
                    <li className="flex justify-between text-gray-300">
                      <span>Ravens -3</span>
                      <span className="text-white">+100 @ Caesars</span>
                    </li>
                    <li className="flex justify-between text-gray-300">
                      <span>Maple Leafs Over 6.5</span>
                      <span className="text-white">-115 @ PointsBet</span>
                    </li>
                  </ul>
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                    <span>Parlay Odds: +509</span>
                    <span>Expected Value: +$36.00 per $100</span>
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
                Use the filter options to narrow down opportunities based on
                sports, minimum EV percentage, or specific sportsbooks. The tool
                refreshes every 15 minutes to ensure you always have the most
                current profitable parlays.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
