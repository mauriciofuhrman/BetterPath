"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function ComboPositiveEVPage() {
  const { isLoggedIn, isLoading } = useAuth();

  // Placeholder state for a premium tool
  const [activeTab, setActiveTab] = useState("popular");

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Combo Positive EV
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is Combo Positive EV?
          </h2>
          <p className="text-gray-300 mb-6">
            Combo Positive EV is an advanced strategy that combines multiple
            individual positive expected value bets into optimized betting
            portfolios. While traditional +EV betting focuses on single
            opportunities, our Combo +EV tool identifies the most efficient ways
            to allocate your bankroll across multiple +EV opportunities,
            factoring in correlation effects, variance reduction, promotion
            stacking, and profit optimization. This approach can significantly
            enhance your ROI compared to placing single +EV bets in isolation.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Consider these three independent positive EV opportunities:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Lakers ML at +150: +8% EV (FanDuel)</li>
              <li>Cavaliers -3.5 at -110: +5% EV (DraftKings)</li>
              <li>Knicks vs. Celtics Over 220.5 at -105: +6% EV (BetMGM)</li>
            </ul>

            <h4 className="font-semibold mb-2">The Combo Strategy:</h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Our tool analyzes these bets and calculates optimal bankroll
                allocation: 45% on Lakers, 25% on Cavaliers, and 30% on the Over
              </li>
              <li>
                Additionally, it identifies valid promotions that can be
                stacked:
                <ul className="list-disc pl-6 mt-1">
                  <li>FanDuel's 3x odds boost token on the Lakers bet</li>
                  <li>
                    DraftKings' risk-free SGP token can be used on another bet
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Expected Value Optimization:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                With a $1,000 bankroll:
                <ul className="list-disc pl-6 mt-1">
                  <li>Base EV from optimal allocation: $64.50</li>
                  <li>Additional EV from promotion stacking: $41.75</li>
                  <li>Total expected profit: $106.25 (10.6% ROI)</li>
                </ul>
              </li>
              <li>
                Compared to equal allocation across the three bets, this
                optimized approach increases expected profit by 38%
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              Our Combo +EV optimizer handles these complex calculations
              automatically, providing you with the ideal betting portfolio to
              maximize your profits and efficiently utilize available
              promotions.
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
                Unlock the Combo Positive EV Tool
              </h3>
              <p className="text-gray-300 mb-6 text-center max-w-md">
                Sign up for an account to access our Combo +EV optimizer and
                learn how to maximize your profits through optimal bankroll
                allocation and promotion stacking.
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
              Combo Positive EV Optimizer
            </h2>

            <div className="mb-6">
              <div className="flex space-x-1 overflow-x-auto bg-gray-800/50 rounded-t-lg">
                <button
                  className={`px-4 py-3 ${
                    activeTab === "popular"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("popular")}
                  disabled={!isLoggedIn}
                >
                  Popular Combos
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "custom"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("custom")}
                  disabled={!isLoggedIn}
                >
                  Custom Optimizer
                </button>
                <button
                  className={`px-4 py-3 ${
                    activeTab === "promo"
                      ? "bg-blue-900/60 text-white"
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                  onClick={() => isLoggedIn && setActiveTab("promo")}
                  disabled={!isLoggedIn}
                >
                  Promo Stacking
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Today's Recommended Combos
                </h3>
                <div className="flex space-x-3">
                  <Button
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                    disabled={!isLoggedIn}
                  >
                    Set Bankroll
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isLoggedIn}
                  >
                    View All Bets
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 p-5 rounded border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">
                        MLB/NBA Combo Package
                      </h4>
                      <span className="text-sm text-gray-400">
                        3 bets • Optimized for $1,000 bankroll
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-1">
                        +12.8% EV
                      </span>
                      <div className="text-sm text-gray-400">
                        Expected profit: $128.00
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">Yankees ML (+135)</div>
                        <div className="text-sm text-gray-400">
                          FanDuel • 40% of bankroll ($400)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+7.5% EV</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">Lakers -2.5 (-110)</div>
                        <div className="text-sm text-gray-400">
                          DraftKings • 35% of bankroll ($350)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+5.2% EV</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Warriors/Suns Over 225.5 (-105)
                        </div>
                        <div className="text-sm text-gray-400">
                          BetMGM • 25% of bankroll ($250)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+6.8% EV</div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 p-3 rounded mb-4">
                    <h5 className="font-medium mb-1">
                      Available Promotion Stack
                    </h5>
                    <p className="text-sm text-gray-300">
                      Using FanDuel's MLB No Sweat Bet on Yankees and BetMGM's
                      risk-free same game parlay on Warriors/Suns adds +$47.50
                      in additional EV.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!isLoggedIn}
                    >
                      Apply Combo to Bet Tracker
                    </Button>
                    <Button
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                      disabled={!isLoggedIn}
                    >
                      Customize Combo
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-800 p-5 rounded border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">
                        NFL Weekend Combo
                      </h4>
                      <span className="text-sm text-gray-400">
                        4 bets • Optimized for $500 bankroll
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-1">
                        +9.3% EV
                      </span>
                      <div className="text-sm text-gray-400">
                        Expected profit: $46.50
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">Chiefs -3 (-105)</div>
                        <div className="text-sm text-gray-400">
                          Caesars • 30% of bankroll ($150)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+5.8% EV</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">49ers ML (+115)</div>
                        <div className="text-sm text-gray-400">
                          FanDuel • 25% of bankroll ($125)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+6.2% EV</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Lions/Packers Under 48.5 (-110)
                        </div>
                        <div className="text-sm text-gray-400">
                          DraftKings • 25% of bankroll ($125)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+4.5% EV</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">Cowboys -7 (-115)</div>
                        <div className="text-sm text-gray-400">
                          BetMGM • 20% of bankroll ($100)
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">+3.7% EV</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!isLoggedIn}
                    >
                      Apply Combo to Bet Tracker
                    </Button>
                    <Button
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                      disabled={!isLoggedIn}
                    >
                      Customize Combo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 rounded border border-blue-800/50">
              <h4 className="font-semibold mb-2">Pro Tip</h4>
              <p className="text-gray-300">
                The real power of Combo +EV comes from correctly balancing your
                portfolio and maximizing promotion value. Use our optimizer to
                dynamically adjust your allocations as odds change throughout
                the day, and be sure to check your sportsbook accounts for
                personalized promotions that can significantly boost your EV.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
