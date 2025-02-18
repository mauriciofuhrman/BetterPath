"use client";

import { useState } from "react";
import { Home, User, MoveRight } from "lucide-react";
import { NavBar } from "@/components/tubelight-navbar";
import { Hero } from "@/components/animated-hero";
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
  ];

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 },
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

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
          {/* Button */}
          <div
            className={`relative isolate z-50 mb-6 ${
              showModal ? "hidden" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="group relative z-50 inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all duration-300"
            >
              <span>The Growing Problem</span>
              <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Title with Animated Path */}
          <div className="relative flex flex-col items-center w-full max-w-4xl">
            {/* Title Text */}
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-center">
              <span className="text-white">Better</span>
              <span className="text-[hsl(var(--accent-blue))]">Path</span>
            </h1>

            <motion.div
              initial="hidden"
              animate="visible"
              className="absolute inset-0 w-full h-full z-20"
            >
              {/* Glowing background for the path */}
              <motion.div
                variants={glowVariants}
                className="absolute inset-0 w-full h-full"
                style={{
                  filter: "blur(20px)",
                  transform: "translateZ(0)",
                }}
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 950 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M50 100 C200 20, 600 180, 900 100"
                    stroke="hsl(var(--accent-blue))"
                    strokeWidth="40"
                    strokeLinecap="round"
                    variants={pathVariants}
                  />
                </svg>
              </motion.div>

              {/* Main path */}
              <svg
                className="w-full h-full absolute inset-0"
                viewBox="0 0 950 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M50 100 C200 20, 600 180, 900 100"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="8,12"
                  variants={pathVariants}
                />
                {/* Arrow head */}
                <motion.path
                  d="M880 85 L900 100 L880 115"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={pathVariants}
                />
              </svg>
            </motion.div>
          </div>

          {/* Animated Text */}
          <div className="w-full mt-16">
            <Hero />
          </div>
        </div>
      </div>
    </main>
  );
}
