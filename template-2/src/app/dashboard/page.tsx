"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  Zap,
  Scale,
  TrendingUp,
  GitMerge,
  SplitSquareVertical,
  Layers,
  Combine,
  Network,
  MoveVertical,
  LogOut,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // If still loading or not logged in, show loading state
  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tools = [
    {
      icon: Zap,
      title: "Free Bet Converter",
      description: "Convert free bets to guaranteed cash with optimal hedging",
      path: "/tools/free-bet-converter",
    },
    {
      icon: Scale,
      title: "Normal Arbitrage",
      description:
        "Find and capitalize on odds differences between sportsbooks",
      path: "/tools/normal-arbitrage",
    },
    {
      icon: TrendingUp,
      title: "Positive EV",
      description: "Identify bets with positive expected value",
      path: "/tools/positive-ev",
    },
    {
      icon: GitMerge,
      title: "Parlay Finder",
      description: "Build profitable parlay bets with correlation analysis",
      path: "/tools/parlay-finder",
    },
    {
      icon: SplitSquareVertical,
      title: "3-Way Arbitrage",
      description: "Secure profits in three-outcome markets like soccer",
      path: "/tools/3-way-arbitrage",
    },
    {
      icon: Layers,
      title: "4-Way Arbitrage",
      description: "Profit from four-outcome markets with guaranteed returns",
      path: "/tools/4-way-arbitrage",
    },
    {
      icon: Combine,
      title: "Positive EV SGP",
      description: "Find single-game parlays with positive expected value",
      path: "/tools/positive-ev-sgp",
    },
    {
      icon: Network,
      title: "Combo Positive EV",
      description: "Discover powerful combinations of +EV bets across games",
      path: "/tools/combo-positive-ev",
    },
    {
      icon: MoveVertical,
      title: "Middling/Low Hold",
      description: "Exploit line movements to middle bets or find low holds",
      path: "/tools/middling-low-hold",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header with user info and sign out */}
      <header className="border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="text-white">Better</span>
              <span className="text-[hsl(var(--accent-blue))]">Path</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-1 border-gray-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome to BetterPath
        </h1>
        <p className="text-gray-400 mb-12">
          Access your betting tools and start maximizing your profits
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.path}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-900/80 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg group-hover:bg-blue-500/30 transition-all">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
