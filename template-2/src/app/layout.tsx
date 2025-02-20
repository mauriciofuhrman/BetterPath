"use client";

import { AnimatedTitle } from "@/components/animated-title";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Persistent Animated Title */}
        <div className="fixed top-6 left-6 z-50">
          <AnimatedTitle
            titleSize="sm"
            containerWidth="max-w-[200px]"
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        {children}
      </body>
    </html>
  );
}
