import React from "react";
import Image from "next/image";

type SportsbookLogoProps = {
  book: "FD" | "DK" | "MGM" | "BR";
  size?: number;
  className?: string;
};

// Map of book codes to image paths
const LOGO_PATHS = {
  DK: "/sportsbook-logos/Draftkings-Logo-PNG-Clipart.png",
  FD: "/sportsbook-logos/FanDuel-Logo.png",
  MGM: "/sportsbook-logos/BetMGM-Logo-–-HiRes.png",
  BR: "/sportsbook-logos/BetRivers_SB_Horizontal_BlueDrop_RGB.png",
};

// Brand colors for each book
const BRAND_COLORS = {
  DK: "#00694B", // DraftKings green
  FD: "#1493FF", // FanDuel blue
  MGM: "#13294B", // BetMGM navy
  BR: "#174A94", // BetRivers blue
};

// Map of book codes to display names
const BOOK_NAMES = {
  DK: "DraftKings",
  FD: "FanDuel",
  MGM: "BetMGM",
  BR: "BetRivers",
};

const SportsbookLogo: React.FC<SportsbookLogoProps> = ({
  book,
  size = 24,
  className = "",
}) => {
  // Fix the dimensions of each logo slot
  const containerWidth = size * 3; // Fixed width for all logos
  const containerHeight = size; // Fixed height for all logos

  if (!LOGO_PATHS[book]) {
    // Fallback if no logo is found
    return (
      <div
        className={`flex items-center justify-center rounded text-white font-bold ${className}`}
        style={{
          width: containerWidth,
          height: containerHeight,
          backgroundColor: BRAND_COLORS[book] || "#333",
        }}
      >
        {BOOK_NAMES[book] || book}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      <Image
        src={LOGO_PATHS[book]}
        alt={`${BOOK_NAMES[book]} logo`}
        fill
        style={{ objectFit: "contain" }}
        priority
        sizes={`${containerWidth}px`}
      />
    </div>
  );
};

export default SportsbookLogo;
