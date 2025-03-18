import { createClient } from "@supabase/supabase-js";
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Game {
  game_id: string;
  name: string;
  game_date: string;
  game_time: string;
  home_team: string;
  away_team: string;
  league: string;
}

export interface OddsData {
  odds_id: string;
  line_id: string;
  book: string;
  odds_value: number;
  is_best_odds: boolean;
  is_most_recent: boolean;
  parlayable: boolean;
  book_link?: string;
}

export interface MoneylineData {
  line_id: string;
  team_name: string;
  opponent: string;
  is_home: boolean;
  is_favorite: boolean;
  odds: OddsData[];
}

export interface SpreadData {
  line_id: string;
  team_name: string;
  opponent: string;
  is_home: boolean;
  value: number;
  is_favorite: boolean;
  odds: OddsData[];
}

export interface TotalData {
  line_id: string;
  name: string;
  value: number;
  is_over: boolean;
  is_player_prop?: boolean;
  category?: string;
  odds: OddsData[];
}

/**
 * Get games within the appropriate time window (4PM UTC to 4AM UTC next day)
 * @returns Promise with games data
 */
export const getGames = async (): Promise<Game[]> => {
  // Create a time window from 4PM UTC to 4AM UTC next day
  const now = new Date();

  // Create date objects for our time window boundaries
  const todayAt4PM = new Date(now);
  todayAt4PM.setUTCHours(16, 0, 0, 0); // 4PM UTC today

  const tomorrowAt4AM = new Date(now);
  tomorrowAt4AM.setDate(now.getDate() + 1);
  tomorrowAt4AM.setUTCHours(4, 0, 0, 0); // 4AM UTC tomorrow

  // Determine the date range we need based on current time
  let startDate, endDate;

  if (now.getUTCHours() < 4) {
    // It's before 4AM UTC, so we need yesterday 4PM to today 4AM
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 1);
    startDate.setUTCHours(16, 0, 0, 0); // Yesterday 4PM UTC

    endDate = new Date(now);
    endDate.setUTCHours(4, 0, 0, 0); // Today 4AM UTC
  } else {
    // It's after 4AM UTC, so we need today 4PM to tomorrow 4AM
    startDate = todayAt4PM;
    endDate = tomorrowAt4AM;
  }

  // Format dates for Supabase query
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  // Find the start and end times for filtering
  const startTimeStr = startDate.toISOString().split("T")[1].substring(0, 8); // HH:MM:SS
  const endTimeStr = endDate.toISOString().split("T")[1].substring(0, 8); // HH:MM:SS

  // Start building the base query
  let gamesQuery = supabase
    .from("games")
    .select("*")
    .order("game_time", { ascending: true });

  // If the start and end dates are the same, we need to use time filtering
  if (startDateStr === endDateStr) {
    gamesQuery = gamesQuery
      .eq("game_date", startDateStr)
      .or(`game_time.gte.${startTimeStr},game_time.lt.${endTimeStr}`);
  } else {
    // Handle date boundary crossing
    gamesQuery = gamesQuery.or(
      `and(game_date.eq.${startDateStr},game_time.gte.${startTimeStr}),and(game_date.eq.${endDateStr},game_time.lt.${endTimeStr})`
    );
  }

  // Execute the query
  const { data: games, error } = await gamesQuery;

  if (error) {
    console.error("Error fetching games:", error);
    return [];
  }

  return games || [];
};

/**
 * Get moneyline odds for a specific game
 * @param gameId Game ID to get moneyline odds for
 * @returns Promise with moneyline data for home and away teams
 */
// export const getMoneylineOdds = async (
//   gameId: string
// ): Promise<{ home: MoneylineData | null; away: MoneylineData | null }> => {
//   // Get lines for the specified game with moneyline type
//   const { data: lines, error: linesError } = await supabase
//     .from("lines")
//     .select("*")
//     .eq("game_id", gameId)
//     .eq("line_type", "ML")
//     .eq("is_valid", true);

//   if (linesError || !lines || lines.length === 0) {
//     console.error(
//       `Error fetching moneyline lines for game ${gameId}:`,
//       linesError
//     );
//     return { home: null, away: null };
//   }

//   // Initialize result objects
//   let homeMoneyline: MoneylineData | null = null;
//   let awayMoneyline: MoneylineData | null = null;

//   // Process each line
//   for (const line of lines) {
//     // Get moneyline details
//     const { data: moneylineData, error: moneylineError } = await supabase
//       .from("moneylines")
//       .select("*")
//       .eq("line_id", line.line_id);

//     if (moneylineError || !moneylineData || moneylineData.length === 0) {
//       console.error(
//         `Error fetching moneyline data for line ${line.line_id}:`,
//         moneylineError
//       );
//       continue;
//     }

//     // Get odds for this line
//     const { data: oddsData, error: oddsError } = await supabase
//       .from("odds")
//       .select("*")
//       .eq("line_id", line.line_id)
//       .eq("is_most_recent", true)
//       .order("is_best_odds", { ascending: false });

//     if (oddsError) {
//       console.error(`Error fetching odds for line ${line.line_id}:`, oddsError);
//       continue;
//     }

//     const moneyline = moneylineData[0];

//     // Create moneyline object
//     const moneylineObj: MoneylineData = {
//       line_id: line.line_id,
//       team_name: moneyline.team_name,
//       opponent: moneyline.opponent,
//       is_home: moneyline.is_home,
//       is_favorite: moneyline.is_favorite,
//       odds: oddsData || [],
//     };

//     // Assign to home or away
//     if (moneyline.is_home) {
//       homeMoneyline = moneylineObj;
//     } else {
//       awayMoneyline = moneylineObj;
//     }
//   }

//   return {
//     home: homeMoneyline,
//     away: awayMoneyline,
//   };
// };

/**
 * Get spread odds for a specific game
 * @param gameId Game ID to get spread odds for
 * @returns Promise with spread data for home and away teams
 */
export const getSpreadOdds = async (
  gameId: string
): Promise<{ home: SpreadData | null; away: SpreadData | null }> => {
  // Get lines for the specified game with spread type
  const { data: lines, error: linesError } = await supabase
    .from("lines")
    .select("*")
    .eq("game_id", gameId)
    .eq("line_type", "SPREAD")
    .eq("is_valid", true);

  if (linesError || !lines || lines.length === 0) {
    console.error(
      `Error fetching spread lines for game ${gameId}:`,
      linesError
    );
    return { home: null, away: null };
  }

  // Initialize result objects
  let homeSpread: SpreadData | null = null;
  let awaySpread: SpreadData | null = null;

  // Process each line
  for (const line of lines) {
    // Get spread details
    const { data: spreadData, error: spreadError } = await supabase
      .from("spreads")
      .select("*")
      .eq("line_id", line.line_id);

    if (spreadError || !spreadData || spreadData.length === 0) {
      console.error(
        `Error fetching spread data for line ${line.line_id}:`,
        spreadError
      );
      continue;
    }

    // Get odds for this line
    const { data: oddsData, error: oddsError } = await supabase
      .from("odds")
      .select("*")
      .eq("line_id", line.line_id)
      .eq("is_most_recent", true)
      .order("is_best_odds", { ascending: false });

    if (oddsError) {
      console.error(`Error fetching odds for line ${line.line_id}:`, oddsError);
      continue;
    }

    const spread = spreadData[0];

    // Create spread object
    const spreadObj: SpreadData = {
      line_id: line.line_id,
      team_name: spread.team_name,
      opponent: spread.opponent,
      is_home: spread.is_home,
      value: spread.value,
      is_favorite: spread.is_favorite,
      odds: oddsData || [],
    };

    // Assign to home or away
    if (spread.is_home) {
      homeSpread = spreadObj;
    } else {
      awaySpread = spreadObj;
    }
  }

  return {
    home: homeSpread,
    away: awaySpread,
  };
};

/**
 * Get over/under (total) odds for a specific game
 * @param gameId Game ID to get total odds for
 * @returns Promise with an array of paired over/under data
 */
export const getTotalOdds = async (
  gameId: string
): Promise<Array<{ over: TotalData | null; under: TotalData | null }>> => {
  // Get lines for the specified game with total type
  const { data: lines, error: linesError } = await supabase
    .from("lines")
    .select("*")
    .eq("game_id", gameId)
    .eq("line_type", "TOTAL")
    .eq("is_valid", true);

  if (linesError || !lines || lines.length === 0) {
    console.error(`Error fetching total lines for game ${gameId}:`, linesError);
    return [];
  }

  // Initialize results object to hold paired over/unders
  const totalsMap = new Map<
    string,
    { over: TotalData | null; under: TotalData | null }
  >();

  // Process each line
  for (const line of lines) {
    // Get over/under details
    const { data: overUnderData, error: overUnderError } = await supabase
      .from("over_unders")
      .select("*")
      .eq("line_id", line.line_id);

    if (overUnderError || !overUnderData || overUnderData.length === 0) {
      console.error(
        `Error fetching over/under data for line ${line.line_id}:`,
        overUnderError
      );
      continue;
    }

    // Get odds for this line
    const { data: oddsData, error: oddsError } = await supabase
      .from("odds")
      .select("*")
      .eq("line_id", line.line_id)
      .eq("is_most_recent", true)
      .order("is_best_odds", { ascending: false });

    if (oddsError) {
      console.error(`Error fetching odds for line ${line.line_id}:`, oddsError);
      continue;
    }

    const overUnder = overUnderData[0];

    // Create total object
    const totalObj: TotalData = {
      line_id: line.line_id,
      name: overUnder.name,
      value: overUnder.value,
      is_over: overUnder.is_over,
      is_player_prop: overUnder.is_player_prop,
      category: overUnder.category,
      odds: oddsData || [],
    };

    // Use name and value as key to pair overs and unders
    const key = `${overUnder.name}_${overUnder.value}`;

    if (!totalsMap.has(key)) {
      // Create an entry with empty data
      totalsMap.set(key, {
        over: null,
        under: null,
      });
    }

    // Update the appropriate side
    const pair = totalsMap.get(key)!; // Non-null assertion, safe because we just checked
    if (overUnder.is_over) {
      pair.over = totalObj;
    } else {
      pair.under = totalObj;
    }
  }

  // Convert map to array for return
  return Array.from(totalsMap.values());
};

/**
 * Get all available books (sportsbooks) from the database
 * @returns Promise with array of book names
 */
export const getAvailableBooks = async (): Promise<string[]> => {
  try {
    // Using a different approach for distinct values since there's an issue with the distinct method
    const { data, error } = await supabase.from("odds").select("book");

    if (error) {
      console.error("Error fetching available books:", error);
      return [];
    }

    // Filter unique books manually using a simple object as a map
    const bookMap: Record<string, boolean> = {};
    const uniqueBooks: string[] = [];

    data.forEach((item: { book: string }) => {
      if (!bookMap[item.book]) {
        bookMap[item.book] = true;
        uniqueBooks.push(item.book);
      }
    });

    return uniqueBooks;
  } catch (err) {
    console.error("Error in getAvailableBooks:", err);
    return [];
  }
};

/**
 * Function to get specific odds type for a game with a single query
 * This is a more efficient version using a single query with joins
 * @param gameId Game ID to get odds for
 * @param oddsType Type of odds to retrieve
 */
export const getGameOddsByType = async (
  gameId: string,
  oddsType: "ML" | "SPREAD" | "TOTAL"
) => {
  // Query to get specific odds type for a game
  const { data, error } = await supabase
    .from("lines")
    .select(
      `
      *,
      moneylines!moneylines_line_id_fkey(*),
      spreads!spreads_line_id_fkey(*),
      over_unders!over_under_line_id_fkey(*),
      odds!odds_line_id_fkey(*)
    `
    )
    .eq("game_id", gameId)
    .eq("line_type", oddsType)
    .eq("is_valid", true);

  if (error) {
    console.error(`Error fetching ${oddsType} odds for game ${gameId}:`, error);
    return null;
  }

  // Format the data based on odds type
  let formattedData;

  switch (oddsType) {
    case "ML": {
      // Group moneylines by home/away
      const home = { team_name: "", odds: [] };
      const away = { team_name: "", odds: [] };

      data.forEach((line: any) => {
        const moneyline = line.moneylines[0];
        if (!moneyline) return;

        const isHome = moneyline.is_home;
        const sortedOdds = line.odds
          .filter((odd: any) => odd.is_most_recent)
          .sort((a: any, b: any) => {
            if (a.is_best_odds !== b.is_best_odds)
              return b.is_best_odds ? 1 : -1;
            return 0;
          });

        if (isHome) {
          home.team_name = moneyline.team_name;
          home.odds = sortedOdds;
        } else {
          away.team_name = moneyline.team_name;
          away.odds = sortedOdds;
        }
      });

      formattedData = { home, away };
      break;
    }

    case "SPREAD": {
      // Group spreads by home/away
      const home = { team_name: "", value: 0, odds: [] };
      const away = { team_name: "", value: 0, odds: [] };

      data.forEach((line: any) => {
        const spread = line.spreads[0];
        if (!spread) return;

        const isHome = spread.is_home;
        const sortedOdds = line.odds
          .filter((odd: any) => odd.is_most_recent)
          .sort((a: any, b: any) => {
            if (a.is_best_odds !== b.is_best_odds)
              return b.is_best_odds ? 1 : -1;
            return 0;
          });

        if (isHome) {
          home.team_name = spread.team_name;
          home.value = spread.value;
          home.odds = sortedOdds;
        } else {
          away.team_name = spread.team_name;
          away.value = spread.value;
          away.odds = sortedOdds;
        }
      });

      formattedData = { home, away };
      break;
    }

    case "TOTAL": {
      // Group totals by pairs of over/under
      const totalsMap = new Map<string, { over: any; under: any }>();

      data.forEach((line: any) => {
        const overUnder = line.over_unders[0];
        if (!overUnder) return;

        const sortedOdds = line.odds
          .filter((odd: any) => odd.is_most_recent)
          .sort((a: any, b: any) => {
            if (a.is_best_odds !== b.is_best_odds)
              return b.is_best_odds ? 1 : -1;
            return 0;
          });

        const key = `${overUnder.name}_${overUnder.value}`;

        if (!totalsMap.has(key)) {
          totalsMap.set(key, { over: null, under: null });
        }

        const pair = totalsMap.get(key)!; // Non-null assertion
        const totalObj = {
          name: overUnder.name,
          value: overUnder.value,
          is_over: overUnder.is_over,
          category: overUnder.category,
          is_player_prop: overUnder.is_player_prop,
          odds: sortedOdds,
        };

        if (overUnder.is_over) {
          pair.over = totalObj;
        } else {
          pair.under = totalObj;
        }
      });

      formattedData = Array.from(totalsMap.values());
      break;
    }

    default:
      formattedData = data;
  }

  return formattedData;
};

export const getBatchMoneylineOdds = async (
  gameIds: string[]
): Promise<
  Record<string, { home: MoneylineData | null; away: MoneylineData | null }>
> => {
  // Get all lines for the specified games with moneyline type in a single query
  const { data: lines, error: linesError } = await supabase
    .from("lines")
    .select("*")
    .in("game_id", gameIds)
    .eq("line_type", "ML")
    .eq("is_valid", true);

  if (linesError || !lines || lines.length === 0) {
    console.error(`Error fetching moneyline lines for games:`, linesError);
    return {};
  }

  // Extract all line_ids
  const lineIds = lines.map((line) => line.line_id);

  // Get all moneyline details in a single query
  const { data: allMoneylineData, error: moneylineError } = await supabase
    .from("moneylines")
    .select("*")
    .in("line_id", lineIds);

  if (moneylineError) {
    console.error(`Error fetching moneyline data:`, moneylineError);
    return {};
  }

  // Get all odds in a single query
  const { data: allOddsData, error: oddsError } = await supabase
    .from("odds")
    .select("*")
    .in("line_id", lineIds)
    .eq("is_most_recent", true)
    .order("is_best_odds", { ascending: false });

  if (oddsError) {
    console.error(`Error fetching odds:`, oddsError);
    return {};
  }

  // Organize the data by game
  const result: Record<
    string,
    { home: MoneylineData | null; away: MoneylineData | null }
  > = {};

  // Initialize result for each game
  gameIds.forEach((gameId) => {
    result[gameId] = { home: null, away: null };
  });

  // Process the data
  lines.forEach((line) => {
    const gameId = line.game_id;
    const lineId = line.line_id;

    // Find moneyline data for this line
    const moneylineData =
      allMoneylineData?.filter((ml) => ml.line_id === lineId) || [];

    if (moneylineData.length === 0) return;

    // Find odds for this line
    const oddsForLine =
      allOddsData?.filter((odd) => odd.line_id === lineId) || [];

    const moneyline = moneylineData[0];

    // Create moneyline object
    const moneylineObj: MoneylineData = {
      line_id: lineId,
      team_name: moneyline.team_name,
      opponent: moneyline.opponent,
      is_home: moneyline.is_home,
      is_favorite: moneyline.is_favorite,
      odds: oddsForLine,
    };

    // Assign to home or away
    if (moneyline.is_home) {
      result[gameId].home = moneylineObj;
    } else {
      result[gameId].away = moneylineObj;
    }
  });

  return result;
};
