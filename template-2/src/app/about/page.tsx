"use client";

import { User } from "lucide-react";
import { NavBar } from "@/components/tubelight-navbar";
import { Home } from "lucide-react";

export default function AboutPage() {
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar items={navItems} />

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Circular Image Placeholder */}
            <div className="mx-auto w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-6">
              <User className="w-16 h-16 text-gray-400" />
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mauricio Fuhrman
            </h1>

            {/* About Text */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4">
                Hi there! I'm a passionate developer and advocate for positive
                change. With a background in technology and a deep understanding
                of personal challenges, I'm dedicated to creating solutions that
                make a real difference in people's lives.
              </p>
              <p className="text-gray-600">
                Through BetterPath, I'm working to provide support and tools for
                those seeking to overcome gambling addiction. My goal is to
                combine technology with compassion to build a platform that
                truly helps people on their journey to recovery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
