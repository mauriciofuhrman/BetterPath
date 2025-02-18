"use client";

import { useState } from "react";
import { Home, User, MoveRight } from "lucide-react";
import { NavBar } from "@/components/tubelight-navbar";
import { Hero } from "@/components/animated-hero";
import { Modal } from "@/components/ui/modal";

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
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">The Growing Problem</h2>
          <p className="text-gray-300">
            Gambling addiction affects millions worldwide, with numbers growing
            at an alarming rate. The rise of online gambling and mobile betting
            apps has made it easier than ever to develop problematic gambling
            behaviors. Our mission is to provide support and resources to those
            affected by this growing crisis.
          </p>
          <p className="text-gray-300">
            Through BetterPath, we're building a community-driven platform that
            combines technology with compassion to help individuals overcome
            gambling addiction and rebuild their lives.
          </p>
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

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-center mb-8">
            <span className="text-white">Better</span>
            <span className="text-[hsl(var(--accent-blue))]">Path</span>
          </h1>

          {/* Animated Text */}
          <div className="w-full">
            <Hero />
          </div>
        </div>
      </div>
    </main>
  );
}
