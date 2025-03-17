import { createClient } from "@supabase/supabase-js";
import { Game, Team } from "@/lib/types";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definition for Supabase game data
export interface SupabaseGame {
  game_id: string;
  name: string;
  game_time: string;
  game_date: string;
  home_team: string;
  away_team: string;
  league: string;
  created_at: string;
  updated_at: string;
}

// Function to convert UTC to West Coast time (PST/PDT)
export function convertToWestCoast(
  date: string,
  time: string
): { date: string; time: string } {
  // Create a Date object from the UTC date and time
  const utcDate = new Date(`${date}T${time.split("+")[0]}Z`);

  // Convert to West Coast time (UTC-7 or UTC-8 depending on DST)
  // The toLocaleString method automatically accounts for DST
  const westCoastDate = utcDate.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Parse the localized string to extract date and time
  const [westCoastDatePart, westCoastTimePart] = westCoastDate.split(", ");

  // Format date as YYYY-MM-DD
  const [month, day, year] = westCoastDatePart.split("/");
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;

  return {
    date: formattedDate,
    time: westCoastTimePart,
  };
}

// Function to check if a date is today (West Coast time)
export function isToday(date: string): boolean {
  const today = new Date();
  const westCoastToday = today.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [month, day, year] = westCoastToday.split("/");
  const formattedToday = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;

  return date === formattedToday;
}

// Function to format team name to get abbreviation
export function getTeamAbbreviation(teamName: string): string {
  // Map of full team names to abbreviations
  const teamAbbreviations: Record<string, string> = {
    "Atlanta Hawks": "ATL",
    "Boston Celtics": "BOS",
    "Brooklyn Nets": "BKN",
    "Charlotte Hornets": "CHA",
    "Chicago Bulls": "CHI",
    "Cleveland Cavaliers": "CLE",
    "Dallas Mavericks": "DAL",
    "Denver Nuggets": "DEN",
    "Detroit Pistons": "DET",
    "Golden State Warriors": "GSW",
    "Houston Rockets": "HOU",
    "Indiana Pacers": "IND",
    "Los Angeles Clippers": "LAC",
    "Los Angeles Lakers": "LAL",
    "Memphis Grizzlies": "MEM",
    "Miami Heat": "MIA",
    "Milwaukee Bucks": "MIL",
    "Minnesota Timberwolves": "MIN",
    "New Orleans Pelicans": "NOP",
    "New York Knicks": "NYK",
    "Oklahoma City Thunder": "OKC",
    "Orlando Magic": "ORL",
    "Philadelphia 76ers": "PHI",
    "Phoenix Suns": "PHX",
    "Portland Trail Blazers": "POR",
    "Sacramento Kings": "SAC",
    "San Antonio Spurs": "SAS",
    "Toronto Raptors": "TOR",
    "Utah Jazz": "UTA",
    "Washington Wizards": "WAS",
  };

  return teamAbbreviations[teamName] || teamName.substr(0, 3).toUpperCase();
}

// Function to get game status based on current time and game time
export function getGameStatus(
  gameDate: string,
  gameTime: string
): "Live" | "Upcoming" | "Final" {
  const now = new Date();
  const gameDateTime = new Date(`${gameDate}T${gameTime}`);

  // Convert times to timestamps for comparison
  const nowTimestamp = now.getTime();
  const gameTimestamp = gameDateTime.getTime();

  // Define time thresholds (2.5 hours for game duration)
  const gameEndTimestamp = gameTimestamp + 2.5 * 60 * 60 * 1000;

  if (nowTimestamp < gameTimestamp) {
    return "Upcoming";
  } else if (
    nowTimestamp >= gameTimestamp &&
    nowTimestamp <= gameEndTimestamp
  ) {
    return "Live";
  } else {
    return "Final";
  }
}

// Function to format date for display
export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Function to transform Supabase game data to our Game type
export function transformGame(supabaseGame: SupabaseGame): Game {
  // Convert UTC to West Coast time
  const { date, time } = convertToWestCoast(
    supabaseGame.game_date,
    supabaseGame.game_time
  );

  // Get team abbreviations
  const homeTeamAbbr = getTeamAbbreviation(supabaseGame.home_team);
  const awayTeamAbbr = getTeamAbbreviation(supabaseGame.away_team);

  // Determine game status
  const status = getGameStatus(date, time);

  // Create Team objects
  const homeTeam: Team = {
    name: supabaseGame.home_team,
    abbreviation: homeTeamAbbr,
    record: "0-0", // This would be fetched from a different API or table
  };

  const awayTeam: Team = {
    name: supabaseGame.away_team,
    abbreviation: awayTeamAbbr,
    record: "0-0", // This would be fetched from a different API or table
  };

  // Add scores for live or finished games (this would come from a different API or table)
  if (status === "Live" || status === "Final") {
    homeTeam.score = 0;
    awayTeam.score = 0;
  }

  // Create placeholder for player props data
  const playerProps = [
    {
      title: `${homeTeam.name.split(" ").pop()} Points`,
      options: [
        {
          name: "Over 24.5",
          odds: {
            MGM: "-110",
            FD: "-110",
            DK: "-110",
            BR: "-110",
          },
          is_player_prop: true,
        },
        {
          name: "Under 24.5",
          odds: {
            MGM: "-110",
            FD: "-110",
            DK: "-110",
            BR: "-110",
          },
          is_player_prop: true,
        },
      ],
      is_player_prop: true,
    },
  ];

  // Create placeholders for team totals data
  const totalOdds = {
    over: {
      MGM: "O 220.5 (-110)",
      FD: "O 220.5 (-110)",
      DK: "O 220.5 (-110)",
      BR: "O 220.5 (-110)",
    },
    under: {
      MGM: "U 220.5 (-110)",
      FD: "U 220.5 (-110)",
      DK: "U 220.5 (-110)",
      BR: "U 220.5 (-110)",
    },
    is_player_prop: false,
  };

  // Create placeholder odds data (would be fetched from sportsbooks API or table)
  const placeholderGame: Game = {
    id: parseInt(supabaseGame.game_id.substring(0, 8), 16), // Convert first 8 chars of UUID to number
    homeTeam,
    awayTeam,
    date: formatDate(date),
    time: time,
    status,
    odds: {
      spread: `${homeTeamAbbr} -3.5`,
      total: "O/U 220.5",
      moneyline: `${homeTeamAbbr} -150`,
    },
    detailedOdds: {
      spread: {
        away: {
          MGM: "+3.5 (-110)",
          FD: "+3.5 (-110)",
          DK: "+3.5 (-110)",
          BR: "+3.5 (-110)",
        },
        home: {
          MGM: "-3.5 (-110)",
          FD: "-3.5 (-110)",
          DK: "-3.5 (-110)",
          BR: "-3.5 (-110)",
        },
      },
      total: totalOdds,
      moneyline: {
        away: {
          MGM: "+130",
          FD: "+130",
          DK: "+130",
          BR: "+130",
        },
        home: {
          MGM: "-150",
          FD: "-150",
          DK: "-150",
          BR: "-150",
        },
      },
      firstQuarter: {
        spread: {
          away: {
            MGM: "+1 (-110)",
            FD: "+1 (-110)",
            DK: "+1 (-110)",
            BR: "+1 (-110)",
          },
          home: {
            MGM: "-1 (-110)",
            FD: "-1 (-110)",
            DK: "-1 (-110)",
            BR: "-1 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 55.5 (-110)",
            FD: "O 55.5 (-110)",
            DK: "O 55.5 (-110)",
            BR: "O 55.5 (-110)",
          },
          under: {
            MGM: "U 55.5 (-110)",
            FD: "U 55.5 (-110)",
            DK: "U 55.5 (-110)",
            BR: "U 55.5 (-110)",
          },
          is_player_prop: false,
        },
      },
      firstHalf: {
        spread: {
          away: {
            MGM: "+1.5 (-110)",
            FD: "+1.5 (-110)",
            DK: "+1.5 (-110)",
            BR: "+1.5 (-110)",
          },
          home: {
            MGM: "-1.5 (-110)",
            FD: "-1.5 (-110)",
            DK: "-1.5 (-110)",
            BR: "-1.5 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 110.5 (-110)",
            FD: "O 110.5 (-110)",
            DK: "O 110.5 (-110)",
            BR: "O 110.5 (-110)",
          },
          under: {
            MGM: "U 110.5 (-110)",
            FD: "U 110.5 (-110)",
            DK: "U 110.5 (-110)",
            BR: "U 110.5 (-110)",
          },
          is_player_prop: false,
        },
      },
      alternativeSpreads: [],
      alternativeTotals: [],
      playerProps: playerProps,
    },
  };

  return placeholderGame;
}

// Function to fetch all NBA games for today (West Coast time)
export async function fetchTodaysNBAGames(): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("league", "nba");

    if (error) {
      console.error("Error fetching games:", error);
      return [];
    }

    // Convert games to West Coast time and filter for today
    const games = (data as SupabaseGame[])
      .map((game) => {
        const { date } = convertToWestCoast(game.game_date, game.game_time);
        return { ...game, westCoastDate: date };
      })
      .filter((game) => isToday(game.westCoastDate))
      .map((game) => transformGame(game));

    return games;
  } catch (error) {
    console.error("Error in fetchTodaysNBAGames:", error);
    return [];
  }
}

// In the future, implement fetchOddsData function to get real odds from your database
export async function fetchOddsData(gameId: string) {
  // Mock implementation - would be replaced with actual API call
  try {
    // This is where you would query the over_unders table with is_player_prop flag
    // const { data: totalOdds, error: totalError } = await supabase
    //   .from('over_unders')
    //   .select('*')
    //   .eq('game_id', gameId)
    //   .eq('is_player_prop', false);

    // const { data: playerPropOdds, error: propsError } = await supabase
    //   .from('over_unders')
    //   .select('*')
    //   .eq('game_id', gameId)
    //   .eq('is_player_prop', true);

    // Then process and transform the data into the appropriate format

    return {
      totalOdds: [], // would come from the database
      playerPropOdds: [], // would come from the database
    };
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return {
      totalOdds: [],
      playerPropOdds: [],
    };
  }
}
