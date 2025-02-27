"use client";

import { useRef, useEffect } from "react";
import { Hero } from "@/components/animated-hero";
import { NavBar } from "@/components/tubelight-navbar";
import { PricingSection } from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
} from "lucide-react";
import { AnimatedTitle } from "@/components/animated-title";
import { FeatureCarousel } from "@/components/feature-carousel";

export default function HomePage() {
  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page refresh
  useEffect(() => {
    // Scroll to top when the component mounts (page loads/refreshes)
    window.scrollTo(0, 0);

    // Add beforeunload event to save scroll position
    const handleBeforeUnload = () => {
      sessionStorage.setItem("wasRefreshed", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check if page was refreshed and scroll to top if it was
    const wasRefreshed = sessionStorage.getItem("wasRefreshed") === "true";
    if (wasRefreshed) {
      window.scrollTo(0, 0);
      sessionStorage.removeItem("wasRefreshed");
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Free Bet Converter",
      description:
        "Maximize the value of your free bet credits across all major sportsbooks. Our converter tool calculates the optimal hedge strategy to guarantee profits from free bet promotions, turning bonuses into real cash.",
    },
    {
      icon: Scale,
      title: "Normal Arbitrage",
      description:
        "Identify discrepancies between betting markets to secure guaranteed profits regardless of outcome. Our system continuously scans all major sportsbooks to find and alert you to profitable arbitrage opportunities in real-time.",
    },
    {
      icon: TrendingUp,
      title: "Positive EV",
      description:
        "Discover bets with positive expected value to gain a long-term edge. Our algorithm compares true probabilities against bookmaker odds to find markets where the bookmakers have set incorrect lines in your favor.",
    },
    {
      icon: GitMerge,
      title: "Parlay Finder",
      description:
        "Build profitable parlay bets with our advanced correlation engine. Our system identifies parlay combinations with higher expected value and alerts you when bookmakers offer inflated odds on correlated events.",
    },
    {
      icon: SplitSquareVertical,
      title: "3-Way Arbitrage",
      description:
        "Capitalize on three-outcome markets like soccer matches with our specialized 3-way arbitrage scanner. Lock in profits across home, draw, and away outcomes with optimized stake calculations.",
    },
    {
      icon: Layers,
      title: "4-Way Arbitrage",
      description:
        "Take advantage of complex markets with our 4-way arbitrage tool. Perfect for tennis sets, basketball quarters, or other multi-outcome scenarios where market inefficiencies create guaranteed profit opportunities.",
    },
    {
      icon: Combine,
      title: "Positive EV SGP",
      description:
        "Identify single-game parlays with positive expected value. Our proprietary algorithm analyzes correlated outcomes within the same game to find same-game parlay opportunities where bookmakers have mispriced the odds.",
    },
    {
      icon: Network,
      title: "Combo Positive EV",
      description:
        "Discover powerful combinations of positive expected value bets across different games. Our system identifies portfolio-style betting opportunities that maximize your edge while managing variance.",
    },
    {
      icon: MoveVertical,
      title: "Middling/Low Hold",
      description:
        "Find opportunities to middle bets or exploit low-hold markets. Our scanner identifies line movements and price differences that allow you to position yourself to win both sides of a bet or minimize the bookmaker's advantage.",
    },
  ];

  // Create dropdown items from features
  const featureDropdownItems = features.map((feature) => ({
    title: feature.title,
    path: `/tools/${feature.title.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  const navItems = [
    // home
    {
      name: "Home",
      action: () => scrollToSection(homeRef),
      sectionRef: homeRef,
    },
    {
      name: "Tools",
      action: () => scrollToSection(featuresRef),
      sectionRef: featuresRef,
      hasDropdown: true,
      dropdownItems: featureDropdownItems,
    },
    {
      name: "Pricing",
      action: () => scrollToSection(pricingRef),
      sectionRef: pricingRef,
    },
  ];

  const heroTitles = [
    "Let Math Do The Winning",
    "Proven By The Numbers",
    "Win The Long Game",
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full relative">
        {/* Sign In Button */}
        <div className="absolute top-4 right-4 z-20">
          <Link href="/signin">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-950 hover:text-blue-300"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <NavBar items={navItems} className="sm:mt-4" />
      </div>

      <div className="w-full">
        {/* Hero Section with Math/Analytics Background */}
        <div
          ref={homeRef}
          className="relative w-full h-[90vh] flex flex-col items-center justify-center bg-black overflow-hidden pt-20"
        >
          {/* Math/Analytics Background */}
          <div className="absolute inset-0 overflow-hidden opacity-50">
            {/* Grid lines */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 space-y-12 mt-8">
            {/* Hero Title */}
            {/* Animated Title (Logo) */}
            <div className="flex flex-col items-center text-center">
              <div className="transform scale-125 mb-4">
                <AnimatedTitle titleSize="lg" containerWidth="max-w-4xl" />
              </div>
              <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                The smarter way to bet on sports
              </p>
            </div>

            {/* Animated Hero Titles */}
            <div className="w-full max-w-5xl mx-auto mt-8">
              <Hero titles={heroTitles} />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="py-32 bg-black">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
              Why Choose BetterPath?
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
              Our platform provides everything you need to make smarter betting
              decisions and maximize your profits.
            </p>

            <div className="min-h-[500px]">
              <FeatureCarousel features={features} />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div
          ref={pricingRef}
          className="py-24 bg-gradient-to-b from-black to-gray-900"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-16">
              Choose Your Plan
            </h2>

            <PricingSection />
          </div>
        </div>
      </div>
    </main>
  );
}
