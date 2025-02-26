"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Basic Plan */}
      <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 flex flex-col">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
          <div className="flex items-end mb-4">
            <span className="text-4xl font-bold text-white">$29</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          <p className="text-gray-400">
            Perfect for beginners looking to get started with sports arbitrage.
          </p>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              Up to 10 arbitrage alerts per day
            </span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Access to 5 major sportsbooks</span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Basic email support</span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Arbitrage calculator tool</span>
          </div>
        </div>

        <Link href="/signin" className="mt-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Pro Plan */}
      <div className="bg-gray-900/50 p-8 rounded-xl border border-blue-600 flex flex-col relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold py-1 px-4 rounded-full">
          POPULAR
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
          <div className="flex items-end mb-4">
            <span className="text-4xl font-bold text-white">$59</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          <p className="text-gray-400">
            For serious bettors who want more opportunities and features.
          </p>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Unlimited arbitrage alerts</span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              Access to 15 major sportsbooks
            </span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Priority email & chat support</span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              Advanced betting tools & calculators
            </span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              Performance analytics dashboard
            </span>
          </div>
        </div>

        <Link href="/signin" className="mt-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Premium Plan */}
      <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 flex flex-col">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
          <div className="flex items-end mb-4">
            <span className="text-4xl font-bold text-white">$99</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          <p className="text-gray-400">
            The ultimate package for professional bettors and arbitrage experts.
          </p>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Everything in Pro plan</span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              Access to all sportsbooks (20+)
            </span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              24/7 priority support with phone access
            </span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">
              Personalized betting strategy sessions
            </span>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <span className="text-gray-300">Early access to new features</span>
          </div>
        </div>

        <Link href="/signin" className="mt-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
