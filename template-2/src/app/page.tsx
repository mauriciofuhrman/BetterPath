"use client";

import { useState } from "react";
import { Home, User } from "lucide-react";
import { NavBar } from "@/components/tubelight-navbar";
import { Hero } from "@/components/animated-hero";
import { Modal } from "@/components/ui/modal";
import { GrowingProblemButton } from "@/components/ui/growing-problem-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedTitle } from "@/components/animated-title";
export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Navbar */}
      <NavBar items={navItems} />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-8 max-h-[80vh] overflow-y-auto">
          <h2 className="text-3xl font-bold tracking-tighter">
            The Impact of Legalized Gambling
          </h2>

          <p className="text-lg text-gray-300 tracking-tight">
            Since the Supreme Court's ruling in 2018, states with legalized
            gambling have experienced:
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-lg">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm">
                📈
              </span>
              <div>
                <span className="font-semibold text-white">23% increase</span>
                <span className="text-gray-300">
                  {" "}
                  in gambling-related help-seeking
                </span>
              </div>
            </li>
            <li className="flex items-center gap-3 text-lg">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm">
                💰
              </span>
              <div>
                <span className="font-semibold text-white">28% rise</span>
                <span className="text-gray-300">
                  {" "}
                  in gambling-related bankruptcies
                </span>
              </div>
            </li>
            <li className="flex items-center gap-3 text-lg">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm">
                ⚠️
              </span>
              <div>
                <span className="font-semibold text-white">9% uptick</span>
                <span className="text-gray-300">
                  {" "}
                  in domestic violence incidents
                </span>
              </div>
            </li>
          </ul>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight">
              The Funding Chasm: Industry Profits vs. Addiction Services
            </h3>
            <p className="text-lg text-gray-300">
              Despite collecting $150 million in federal sports excise taxes in
              2024, no dedicated national funding exists for gambling addiction
              programs. State-level disparities are equally glaring:
            </p>

            <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-white">
                    Pennsylvania
                  </h4>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Annual Gaming Revenue
                    </p>
                    <p className="text-lg text-white">$417 million</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Addiction Services Budget
                    </p>
                    <p className="text-lg text-white">$3.1 million</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      % of Revenue to Services
                    </p>
                    <p className="text-lg font-medium text-[hsl(var(--accent-blue))]">
                      0.75%
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-white">
                    New Jersey
                  </h4>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Annual Gaming Revenue
                    </p>
                    <p className="text-lg text-white">$457 million</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Addiction Services Budget
                    </p>
                    <p className="text-lg text-white">$1.2 million</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      % of Revenue to Services
                    </p>
                    <p className="text-lg font-medium text-[hsl(var(--accent-blue))]">
                      0.27%
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-white">Ohio</h4>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Annual Gaming Revenue
                    </p>
                    <p className="text-lg text-white">$291 million</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Addiction Services Budget
                    </p>
                    <p className="text-lg text-white">$2.8 million</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      % of Revenue to Services
                    </p>
                    <p className="text-lg font-medium text-[hsl(var(--accent-blue))]">
                      0.96%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-300 tracking-tight">
              This 0.27–0.96% allocation range contrasts sharply with the
              $10,000 annual societal cost per problem gambler, revealing a
              systemic preference for revenue generation over harm reduction.
            </p>
          </div>

          <p className="text-lg text-gray-300 tracking-tight">
            The rapid expansion of online sports betting and mobile gambling
            apps has made it easier than ever to develop problematic gambling
            behaviors. Our mission at{" "}
            <span className="font-semibold text-white">BetterPath</span> is to
            provide the necessary support and tools to help individuals regain
            control.
          </p>

          <div className="pt-6 border-t border-white/10">
            <h3 className="text-xl font-semibold mb-4 tracking-tight">
              Sources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.forwardpathway.us/the-impact-of-legalizing-sports-betting-and-rising-gambling-addiction-in-the-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
                >
                  Forward Pathway: The Impact of Legalizing Sports Betting
                </a>
              </li>
              <li>
                <a
                  href="https://www.nbcnews.com/business/consumer/online-sports-gambling-bankrupting-households-reducing-savings-rcna167235"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
                >
                  NBC News: Online Sports Gambling & Household Bankruptcies
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncpgambling.org/advocacy/grit-act/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
                >
                  NCPG: GRIT Act - National Council on Problem Gambling
                </a>
              </li>
              <li>
                <a
                  href="https://taxfoundation.org/research/all/state/sports-betting-tax-revenue/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
                >
                  Tax Foundation: Sports Betting Tax Revenue Analysis
                </a>
              </li>
              <li>
                <a
                  href="https://today.ucsd.edu/story/study-reveals-surge-in-gambling-addiction-following-legalization-of-sports-betting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
                >
                  UCSD: Study Reveals Surge in Gambling Addiction
                  Post-Legalization
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Main Content */}
      <div className="container mx-auto pt-32">
        <div className="flex flex-col items-center">
          {/* Growing Problem Button */}
          <GrowingProblemButton
            onClick={() => setShowModal(true)}
            isHidden={showModal}
            className="mb-6"
          />

          {/* Animated Title */}
          <AnimatedTitle titleSize="lg" containerWidth="max-w-4xl" />

          {/* Animated Text */}
          <div className="w-full mt-8">
            <Hero />
          </div>

          {/* Auth Buttons */}
          <div
            className={`mt-12 flex gap-4 relative z-50 ${
              showModal ? "hidden" : ""
            }`}
          >
            <Link href="/signin" className="relative z-50">
              <Button
                variant="outline"
                className="relative text-white bg-transparent border-white/10 hover:bg-white/5"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup" className="relative z-50">
              <Button className="relative text-black bg-white hover:bg-white/90">
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
