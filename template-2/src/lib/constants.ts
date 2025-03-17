// Sportsbook definitions
export const SPORTSBOOKS = [
  {
    id: "MGM",
    name: "BetMGM",
    color: "#002960",
    textColor: "#ffffff",
  },
  {
    id: "FD",
    name: "FanDuel",
    color: "#1493ff",
    textColor: "#ffffff",
  },
  {
    id: "DK",
    name: "DraftKings",
    color: "#000000",
    textColor: "#ffffff",
  },
  {
    id: "BR",
    name: "Bet Rivers",
    color: "#f47b20",
    textColor: "#ffffff",
  },
];

// Bet type definitions - simplified to match real data structure
export const BET_TYPES = [
  {
    id: "all",
    name: "All Bets",
  },
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
