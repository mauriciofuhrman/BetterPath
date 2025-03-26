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
  ESPN: string;
  Fanatics: string;
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
    bestOdds?: {
      home: Record<string, boolean>;
      away: Record<string, boolean>;
    };
    bookLinks?: {
      home: Record<string, string>;
      away: Record<string, string>;
    };
    values?: {
      home: string;
      away: string;
    };
    home_group?: any;
    away_group?: any;
  };
  total: {
    over: BookOdds;
    under: BookOdds;
    is_player_prop?: boolean;
    bestOdds?: {
      over: Record<string, boolean>;
      under: Record<string, boolean>;
    };
    bookLinks?: {
      over: Record<string, string>;
      under: Record<string, string>;
    };
    value?: string;
    pairs?: Array<{ over: any | null; under: any | null }>;
    playerProps?: Array<{ over: any | null; under: any | null }>;
    playerPropsData?: any;
  };
  moneyline: {
    away: BookOdds;
    home: BookOdds;
    bestOdds?: {
      home: Record<string, boolean>;
      away: Record<string, boolean>;
    };
    bookLinks?: {
      home: Record<string, string>;
      away: Record<string, string>;
    };
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
