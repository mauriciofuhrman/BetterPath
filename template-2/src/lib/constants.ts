// Sportsbook definitions
export const SPORTSBOOKS = [
  {
    id: "FD",
    name: "FanDuel",
    logoPath: "/sportsbook-logos/FanDuel-Logo.png",
    logoStyle: "brightness(1.5)",
  },
  {
    id: "MGM",
    name: "BetMGM",
    logoPath: "/sportsbook-logos/BetMGM-Logo-–-HiRes.png",
    logoStyle: "", // Already bright enough
  },
  {
    id: "DK",
    name: "DraftKings",
    logoPath: "/sportsbook-logos/Draftkings-Logo-PNG-Clipart.png",
    logoStyle: "", // Already bright enough
  },
  {
    id: "BR",
    name: "BetRivers",
    logoPath: "/sportsbook-logos/BetRivers_SB_Horizontal_BlueDrop_RGB.png",
    logoStyle: "brightness(1.5)",
  },
  {
    id: "ESPN",
    name: "ESPN BET",
    logoPath: "/sportsbook-logos/ESPN-BET-Logo-Primary-1352x1080.jpg",
    logoStyle: "brightness(1.5)",
  },
  {
    id: "Fanatics",
    name: "Fanatics",
    logoPath: "/sportsbook-logos/fanatics-bet-logo.png",
    logoStyle: "", // Assuming it's bright enough
  },
];

// Bet type definitions - simplified to match real data structure
export const BET_TYPES = [
  {
    id: "moneyline",
    name: "Moneyline",
  },
  {
    id: "spread",
    name: "Spreads",
  },
  {
    id: "total",
    name: "Totals",
  },
  {
    id: "playerProps",
    name: "Player Props",
  },
];

// Game status types
export const GAME_STATUSES = [
  {
    id: "all",
    name: "All Games",
  },
  {
    id: "live",
    name: "Live",
  },
  {
    id: "upcoming",
    name: "Upcoming",
  },
  {
    id: "final",
    name: "Final",
  },
];
