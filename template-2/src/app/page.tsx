"use client";

import { useRef } from "react";
import { Hero } from "@/components/animated-hero";
import { NavBar } from "@/components/tubelight-navbar";
import { PricingSection } from "@/components/pricing-section";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LineChart,
  PieChart,
  BarChart2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatedTitle } from "@/components/animated-title";
import { FeatureCarousel } from "@/components/feature-carousel";

export default function HomePage() {
  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const features = [
    {
      icon: Zap,
      title: "Real-time Alerts",
      description:
        "Get instant notifications when profitable opportunities arise across major sportsbooks. Our system continuously monitors odds changes and alerts you the moment a profitable arbitrage opportunity is detected.",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description:
        "Track your performance with detailed statistics and optimize your betting strategy. Visualize your ROI over time, analyze win rates by sport, and identify your most profitable betting patterns.",
    },
    {
      icon: BarChart3,
      title: "Expert Support",
      description:
        "Our team of betting experts is available 24/7 to help you maximize your profits. Get personalized advice on betting strategies, risk management, and how to best utilize our platform for your specific goals.",
    },
    {
      icon: LineChart,
      title: "Arbitrage Finder",
      description:
        "Automatically identify and compare odds across multiple sportsbooks to find guaranteed profits. Our powerful algorithm calculates the exact stake amounts needed for each bet to lock in profits regardless of outcome.",
    },
    {
      icon: PieChart,
      title: "Bankroll Management",
      description:
        "Smart tools to help you manage your betting capital and maximize long-term returns. Set budget limits, track deposits and withdrawals across sportsbooks, and get recommendations on optimal bet sizing.",
    },
    {
      icon: BarChart2,
      title: "Historical Data",
      description:
        "Access comprehensive historical data to inform your betting decisions with confidence. Analyze past performance of teams and players, track line movements, and identify valuable betting trends across all major sports.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <NavBar items={navItems} className="sm:mt-4" />

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
