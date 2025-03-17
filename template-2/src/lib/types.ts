export type Team = {
  name: string;
  abbreviation: string;
  record: string;
  score?: number;
};

export type BookOdds = {
  MGM: string;
  FD: string;
  DK: string;
  BR: string;
};

export interface BetOption {
  name: string;
  odds: BookOdds;
  is_player_prop?: boolean;
}

export type GameOdds = {
  spread: string;
  total: string;
  moneyline: string;
};

export interface DetailedOdds {
  spread: {
    away: BookOdds;
    home: BookOdds;
  };
  total: {
    over: BookOdds;
    under: BookOdds;
    is_player_prop?: boolean;
  };
  moneyline: {
    away: BookOdds;
    home: BookOdds;
  };
  firstQuarter?: {
    spread: {
      away: BookOdds;
      home: BookOdds;
    };
    total: {
      over: BookOdds;
      under: BookOdds;
      is_player_prop?: boolean;
    };
  };
  firstHalf?: {
    spread: {
      away: BookOdds;
      home: BookOdds;
    };
    total: {
      over: BookOdds;
      under: BookOdds;
      is_player_prop?: boolean;
    };
  };
  alternativeSpreads?: BetOption[];
  alternativeTotals?: BetOption[];
  playerProps?: {
    title: string;
    options: BetOption[];
    is_player_prop: boolean;
  }[];
}

export type Game = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  status: "Live" | "Upcoming" | "Final";
  odds: GameOdds;
  detailedOdds: DetailedOdds;
};
