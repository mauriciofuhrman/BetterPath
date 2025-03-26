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
  displayValue?: number; // Optional display value formatted for UI
}

export interface SpreadGroupData {
  team_name: string;
  opponent: string;
  is_home: boolean;
  spreads: SpreadData[]; // List of available spreads for this team
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

export interface ArbitrageLine {
  sportsbook: string;
  line: string;
  odds: string;
  book_link?: string;
}

export interface ArbitrageOpportunity {
  id: string;
  game_id: string;
  event: string;
  sport: string;
  profit: number;
  bet: string;
  game_time: string;
  game_date: string;
  lines: ArbitrageLine[];
}

export interface ArbitrageData {
  opportunities: ArbitrageOpportunity[];
  sports: string[];
  sportsbooks: string[];
  events: string[];
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
  oddsType: "ML" | "SPR" | "OU"
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
    .eq("line_type", oddsType);

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

    case "SPR": {
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

    case "OU": {
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
    .eq("line_type", "ML");

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

export const getBatchSpreadOdds = async (
  gameIds: string[]
): Promise<
  Record<string, { home: SpreadGroupData | null; away: SpreadGroupData | null }>
> => {
  // Single query to get all spread data with joins
  const { data, error } = await supabase
    .from("lines")
    .select(
      `
      *,
      spreads(*),
      odds(*)
    `
    )
    .in("game_id", gameIds)
    .eq("line_type", "SPR")
    .eq("odds.is_most_recent", true);

  if (error || !data || data.length === 0) {
    console.error(`Error fetching spread data for games:`, error);
    return {};
  }

  // Organize the data by game
  const result: Record<
    string,
    { home: SpreadGroupData | null; away: SpreadGroupData | null }
  > = {};

  // Initialize result for each game
  gameIds.forEach((gameId) => {
    result[gameId] = { home: null, away: null };
  });

  // Group data by game for easier processing
  const gameData: Record<string, Array<any>> = {};
  data.forEach((item) => {
    if (!gameData[item.game_id]) {
      gameData[item.game_id] = [];
    }
    gameData[item.game_id].push(item);
  });

  // Process each game
  for (const gameId in gameData) {
    const items = gameData[gameId];
    const teamMap: Record<string, Array<any>> = {};

    // Group by team name
    items.forEach((item) => {
      // Handle the spread data which might be an array with one item or an object
      const spreadData =
        Array.isArray(item.spreads) && item.spreads.length > 0
          ? item.spreads[0]
          : item.spreads;

      if (!spreadData || !spreadData.team_name) return;

      // Initialize the team map entry if it doesn't exist
      if (!teamMap[spreadData.team_name]) {
        teamMap[spreadData.team_name] = [];
      }

      // Ensure odds is always an array
      const odds = Array.isArray(item.odds) ? item.odds : [item.odds];

      teamMap[spreadData.team_name].push({
        ...item,
        spreads: spreadData,
        odds: odds,
      });
    });

    // Find teams involved in this game
    const teamNames = Object.keys(teamMap);
    if (teamNames.length < 2) continue; // Skip if we don't have at least 2 teams

    // Determine home and away teams
    let homeTeam: string | null = null;
    let awayTeam: string | null = null;

    // Try to infer from the code field if available
    // Example: "Atlanta Hawks at Charlotte Hornets" - second team is home
    for (const team of teamNames) {
      const items = teamMap[team];
      for (const item of items) {
        if (
          item.code &&
          (item.code.includes(" at ") || item.code.includes(" @ "))
        ) {
          const parts = item.code.split(/\s+at\s+|\s+@\s+/);
          if (parts.length === 2) {
            if (parts[0].includes(team)) {
              // This team appears before "at", so it's the away team
              awayTeam = team;
              // Try to find the home team from the second part
              for (const otherTeam of teamNames) {
                if (otherTeam !== team && parts[1].includes(otherTeam)) {
                  homeTeam = otherTeam;
                  break;
                }
              }
              break;
            } else if (parts[1].includes(team)) {
              // This team appears after "at", so it's the home team
              homeTeam = team;
              // Try to find the away team from the first part
              for (const otherTeam of teamNames) {
                if (otherTeam !== team && parts[0].includes(otherTeam)) {
                  awayTeam = otherTeam;
                  break;
                }
              }
              break;
            }
          }
        }
      }
      if (homeTeam && awayTeam) break;
    }

    // If we couldn't determine home/away from the code, use an alternative method
    if (!homeTeam || !awayTeam) {
      // Just use the first two teams we found, in alphabetical order
      // This is a fallback and not ideal
      teamNames.sort();
      homeTeam = teamNames[0];
      awayTeam = teamNames[1];
    }

    // Now create the spread objects for home and away teams with ALL available spread values
    if (homeTeam && teamMap[homeTeam].length > 0) {
      const items = teamMap[homeTeam];
      const spreadItems: SpreadData[] = [];

      // Process all spread options for this team
      for (const item of items) {
        const spreadData = item.spreads;

        // Format the display value for UI based on favorite status
        const displayValue = spreadData.is_favorite
          ? -Math.abs(spreadData.value) // Negative for favorite
          : Math.abs(spreadData.value); // Positive for underdog

        // Create individual spread object
        const spreadObj: SpreadData = {
          line_id: item.line_id,
          team_name: spreadData.team_name,
          opponent: spreadData.opponent,
          is_home: true,
          value: spreadData.value,
          is_favorite: spreadData.is_favorite,
          odds: item.odds,
          displayValue: displayValue,
        };

        spreadItems.push(spreadObj);
      }

      // Sort spreads by value for easier UI display, favorites first
      spreadItems.sort((a, b) => {
        if (a.is_favorite !== b.is_favorite) {
          return a.is_favorite ? -1 : 1; // Favorites first
        }
        // For favorites (negative display values), we want more negative (better for bettor) first
        // For underdogs (positive display values), we want more positive (better for bettor) first
        return a.is_favorite
          ? a.displayValue! - b.displayValue! // Larger negative values first for favorites
          : b.displayValue! - a.displayValue!; // Larger positive values first for underdogs
      });

      // Create the spread group for this team
      result[gameId].home = {
        team_name: homeTeam,
        opponent: spreadItems[0].opponent, // Use the first item's opponent
        is_home: true,
        spreads: spreadItems,
      };
    }

    if (awayTeam && teamMap[awayTeam].length > 0) {
      const items = teamMap[awayTeam];
      const spreadItems: SpreadData[] = [];

      // Process all spread options for this team
      for (const item of items) {
        const spreadData = item.spreads;

        // Format the display value for UI based on favorite status
        const displayValue = spreadData.is_favorite
          ? -Math.abs(spreadData.value) // Negative for favorite
          : Math.abs(spreadData.value); // Positive for underdog

        // Create individual spread object
        const spreadObj: SpreadData = {
          line_id: item.line_id,
          team_name: spreadData.team_name,
          opponent: spreadData.opponent,
          is_home: false,
          value: spreadData.value,
          is_favorite: spreadData.is_favorite,
          odds: item.odds,
          displayValue: displayValue,
        };

        spreadItems.push(spreadObj);
      }

      // Sort spreads by value for easier UI display, favorites first
      spreadItems.sort((a, b) => {
        if (a.is_favorite !== b.is_favorite) {
          return a.is_favorite ? -1 : 1; // Favorites first
        }
        // For favorites (negative display values), we want more negative (better for bettor) first
        // For underdogs (positive display values), we want more positive (better for bettor) first
        return a.is_favorite
          ? a.displayValue! - b.displayValue! // Larger negative values first for favorites
          : b.displayValue! - a.displayValue!; // Larger positive values first for underdogs
      });

      // Create the spread group for this team
      result[gameId].away = {
        team_name: awayTeam,
        opponent: spreadItems[0].opponent, // Use the first item's opponent
        is_home: false,
        spreads: spreadItems,
      };
    }
  }

  return result;
};

export const getBatchTotals = async (
  gameIds: string[]
): Promise<
  Record<string, Array<{ over: TotalData | null; under: TotalData | null }>>
> => {
  // Initialize result object to store the final data organized by game
  const result: Record<
    string,
    Array<{ over: TotalData | null; under: TotalData | null }>
  > = {};

  // Initialize result for each game
  gameIds.forEach((gameId) => {
    result[gameId] = [];
  });

  try {
    // STEP 1: Get all over_unders data with pagination (without complex joins)
    const overUnders: Record<string, any> = {}; // lineId -> over_under data
    const lineIdToGameId: Record<string, string> = {}; // lineId -> gameId mapping
    const linesByValue: Record<
      string,
      Array<{ lineId: string; isOver: boolean; value: number }>
    > = {};

    let hasMoreData = true;
    let page = 0;
    const pageSize = 500;

    console.log(`Fetching over_unders data for ${gameIds.length} games...`);

    while (hasMoreData) {
      // Get line records first (much lighter query)
      const { data: lines, error: linesError } = await supabase
        .from("lines")
        .select("line_id, game_id")
        .in("game_id", gameIds)
        .eq("line_type", "OU")
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (linesError || !lines || lines.length === 0) {
        if (linesError) {
          console.error("Error fetching lines:", linesError);
        }
        hasMoreData = false;
        break;
      }

      // Get the line IDs from this batch
      const lineIds = lines.map((line) => line.line_id);

      // Map line IDs to game IDs for later use
      lines.forEach((line) => {
        lineIdToGameId[line.line_id] = line.game_id;
      });

      // Now get over_unders data for these line IDs
      const { data: ouData, error: ouError } = await supabase
        .from("over_unders")
        .select("*")
        .in("line_id", lineIds)
        .eq("is_player_prop", false);

      if (ouError) {
        console.error("Error fetching over_unders:", ouError);
        page++;
        continue;
      }

      if (!ouData || ouData.length === 0) {
        page++;
        if (lines.length < pageSize) {
          hasMoreData = false;
        }
        continue;
      }

      // Store over_unders data by line ID
      ouData.forEach((ou) => {
        overUnders[ou.line_id] = ou;

        // Group by value for pairing over/unders
        const gameId = lineIdToGameId[ou.line_id];
        const key = `${gameId}_${ou.value}`;

        if (!linesByValue[key]) {
          linesByValue[key] = [];
        }

        linesByValue[key].push({
          lineId: ou.line_id,
          isOver: ou.is_over,
          value: ou.value,
        });
      });

      // Move to next page
      page++;
      if (lines.length < pageSize) {
        hasMoreData = false;
      }

      console.log(
        `Processed page ${page}, found ${ouData.length} over_unders records`
      );
    }

    // STEP 2: Fetch odds for all the over_unders we found
    const lineIds = Object.keys(overUnders);
    const odds: Record<string, OddsData[]> = {}; // lineId -> odds array

    if (lineIds.length > 0) {
      console.log(`Fetching odds for ${lineIds.length} lines...`);

      // Process in chunks to avoid hitting query limits
      const chunkSize = 100;
      for (let i = 0; i < lineIds.length; i += chunkSize) {
        const chunk = lineIds.slice(i, i + chunkSize);

        const { data: oddsData, error: oddsError } = await supabase
          .from("odds")
          .select("*")
          .in("line_id", chunk)
          .eq("is_most_recent", true);

        if (oddsError) {
          console.error(
            `Error fetching odds for chunk ${i / chunkSize + 1}:`,
            oddsError
          );
          continue;
        }

        if (!oddsData) continue;

        // Group odds by line ID
        oddsData.forEach((odd) => {
          if (!odds[odd.line_id]) {
            odds[odd.line_id] = [];
          }
          odds[odd.line_id].push(odd);
        });

        console.log(
          `Processed odds chunk ${i / chunkSize + 1}, found ${
            oddsData.length
          } odds`
        );
      }
    }

    // STEP 3: Build the final data structure by pairing over/unders with the same value
    console.log(
      `Building final data structure from ${
        Object.keys(linesByValue).length
      } value groups...`
    );

    Object.keys(linesByValue).forEach((key) => {
      const [gameId, _] = key.split("_");
      const lines = linesByValue[key];

      if (!lines || lines.length === 0) return;

      // Find the over and under lines for this value
      const overLine = lines.find((l) => l.isOver);
      const underLine = lines.find((l) => !l.isOver);

      let overData: TotalData | null = null;
      let underData: TotalData | null = null;

      // Create TotalData objects if we have the data
      if (overLine && overUnders[overLine.lineId]) {
        const ou = overUnders[overLine.lineId];
        overData = {
          line_id: overLine.lineId,
          name: ou.name,
          value: ou.value,
          is_over: true,
          is_player_prop: false,
          category: ou.category,
          odds: odds[overLine.lineId] || [],
        };
      }

      if (underLine && overUnders[underLine.lineId]) {
        const ou = overUnders[underLine.lineId];
        underData = {
          line_id: underLine.lineId,
          name: ou.name,
          value: ou.value,
          is_over: false,
          is_player_prop: false,
          category: ou.category,
          odds: odds[underLine.lineId] || [],
        };
      }

      // Only add to result if we have at least one side
      if (overData || underData) {
        result[gameId].push({ over: overData, under: underData });
      }
    });

    // Sort results for each game
    gameIds.forEach((gameId) => {
      if (result[gameId] && result[gameId].length > 0) {
        result[gameId].sort((a, b) => {
          const valueA = a.over?.value || a.under?.value || 0;
          const valueB = b.over?.value || b.under?.value || 0;
          return valueA - valueB;
        });
      }
    });

    console.log(`Successfully processed totals for ${gameIds.length} games`);
  } catch (error) {
    console.error("Error in getBatchGameTotals:", error);
  }

  return result;
};

export interface PlayerPropsByCategory {
  pts: Array<{ over: TotalData | null; under: TotalData | null }>;
  rebs: Array<{ over: TotalData | null; under: TotalData | null }>;
  asts: Array<{ over: TotalData | null; under: TotalData | null }>;
  blks: Array<{ over: TotalData | null; under: TotalData | null }>;
  stls: Array<{ over: TotalData | null; under: TotalData | null }>;
  threes: Array<{ over: TotalData | null; under: TotalData | null }>;
  tos: Array<{ over: TotalData | null; under: TotalData | null }>;
  pts_rebs: Array<{ over: TotalData | null; under: TotalData | null }>;
  pts_asts: Array<{ over: TotalData | null; under: TotalData | null }>;
  asts_rebs: Array<{ over: TotalData | null; under: TotalData | null }>;
  pts_rebs_asts: Array<{ over: TotalData | null; under: TotalData | null }>;
  stls_blks: Array<{ over: TotalData | null; under: TotalData | null }>;
  other: Array<{ over: TotalData | null; under: TotalData | null }>;
}

export interface PlayerPropsData {
  byPlayer: Record<string, PlayerPropsByCategory>;
  allCategories: string[];
  allPlayers: string[];
}

export const getBatchPlayerProps = async (
  gameIds: string[]
): Promise<Record<string, PlayerPropsData>> => {
  // Initialize result object to store the final data organized by game
  const result: Record<string, PlayerPropsData> = {};

  // Initialize result for each game
  gameIds.forEach((gameId) => {
    result[gameId] = {
      byPlayer: {},
      allCategories: [],
      allPlayers: [],
    };
  });

  try {
    // STEP 1: Get all player prop data with pagination (without complex joins)
    const overUnders: Record<string, any> = {}; // lineId -> over_under data
    const lineIdToGameId: Record<string, string> = {}; // lineId -> gameId mapping
    const linesByNameAndValue: Record<
      string,
      Array<{
        lineId: string;
        isOver: boolean;
        value: number;
        name: string;
        category: string;
      }>
    > = {};

    // Set to keep track of unique categories and players across all games
    const categoriesSet = new Set<string>();
    const playersByGame: Record<string, Set<string>> = {};

    let hasMoreData = true;
    let page = 0;
    const pageSize = 500;

    console.log(`Fetching player props data for ${gameIds.length} games...`);

    while (hasMoreData) {
      // Get line records first (much lighter query)
      const { data: lines, error: linesError } = await supabase
        .from("lines")
        .select("line_id, game_id")
        .in("game_id", gameIds)
        .eq("line_type", "OU")
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (linesError || !lines || lines.length === 0) {
        if (linesError) {
          console.error("Error fetching lines:", linesError);
        }
        hasMoreData = false;
        break;
      }

      // Get the line IDs from this batch
      const lineIds = lines.map((line) => line.line_id);

      // Map line IDs to game IDs for later use
      lines.forEach((line) => {
        lineIdToGameId[line.line_id] = line.game_id;

        // Initialize player set for this game if not exists
        if (!playersByGame[line.game_id]) {
          playersByGame[line.game_id] = new Set<string>();
        }
      });

      // Now get over_unders data for these line IDs - specifically player props
      const { data: ouData, error: ouError } = await supabase
        .from("over_unders")
        .select("*")
        .in("line_id", lineIds)
        .eq("is_player_prop", true);

      if (ouError) {
        console.error("Error fetching player props:", ouError);
        page++;
        continue;
      }

      if (!ouData || ouData.length === 0) {
        page++;
        if (lines.length < pageSize) {
          hasMoreData = false;
        }
        continue;
      }

      // Store over_unders data by line ID
      ouData.forEach((ou) => {
        overUnders[ou.line_id] = ou;

        // Track the category
        if (ou.category) {
          categoriesSet.add(ou.category);
        }

        // Extract player name from the prop name
        const propName = ou.name || "";
        const propParts = propName.split(" ");

        // Common stat abbreviations that might appear at the end of the prop name
        const statAbbreviations = [
          "PTS",
          "AST",
          "REB",
          "BLK",
          "STL",
          "3PT",
          "3PM",
          "TO",
          "PRA",
          "PR",
          "PA",
          "RA",
          "SB",
        ];

        // Check if the last part is a stat type
        const lastPart = propParts[propParts.length - 1];
        const isLastPartStatType = statAbbreviations.includes(lastPart);

        // If the last part is a stat type, exclude it; otherwise keep the full name
        const playerName = isLastPartStatType
          ? propParts.slice(0, -1).join(" ")
          : propParts.join(" ");

        // For consistent category identification, determine the prop type
        const propType = isLastPartStatType ? lastPart : "OTHER";

        // Add player to the set for this game
        const gameId = lineIdToGameId[ou.line_id];
        if (playersByGame[gameId]) {
          playersByGame[gameId].add(playerName);
        }

        // Group by player name, prop type, and value for pairing over/unders
        const key = `${gameId}_${playerName}_${propType}_${ou.value}`;

        if (!linesByNameAndValue[key]) {
          linesByNameAndValue[key] = [];
        }

        linesByNameAndValue[key].push({
          lineId: ou.line_id,
          isOver: ou.is_over,
          value: ou.value,
          name: ou.name,
          category: ou.category || "other",
        });
      });

      // Move to next page
      page++;
      if (lines.length < pageSize) {
        hasMoreData = false;
      }

      console.log(
        `Processed page ${page}, found ${ouData.length} player prop records`
      );
    }

    // STEP 2: Fetch odds for all the player props we found
    const lineIds = Object.keys(overUnders);
    const odds: Record<string, OddsData[]> = {}; // lineId -> odds array

    if (lineIds.length > 0) {
      console.log(`Fetching odds for ${lineIds.length} player prop lines...`);

      // Process in chunks to avoid hitting query limits
      const chunkSize = 100;
      for (let i = 0; i < lineIds.length; i += chunkSize) {
        const chunk = lineIds.slice(i, i + chunkSize);

        const { data: oddsData, error: oddsError } = await supabase
          .from("odds")
          .select("*")
          .in("line_id", chunk)
          .eq("is_most_recent", true);

        if (oddsError) {
          console.error(
            `Error fetching odds for chunk ${i / chunkSize + 1}:`,
            oddsError
          );
          continue;
        }

        if (!oddsData) continue;

        // Group odds by line ID
        oddsData.forEach((odd) => {
          if (!odds[odd.line_id]) {
            odds[odd.line_id] = [];
          }
          odds[odd.line_id].push(odd);
        });

        console.log(
          `Processed odds chunk ${i / chunkSize + 1}, found ${
            oddsData.length
          } odds for player props`
        );
      }
    }

    // STEP 3: Build the final data structure by pairing over/unders with the same name and value
    console.log(
      `Building final player props data structure from ${
        Object.keys(linesByNameAndValue).length
      } groups...`
    );

    // Convert categories set to array
    const allCategories = Array.from(categoriesSet);

    Object.keys(linesByNameAndValue).forEach((key) => {
      const [gameId, ...rest] = key.split("_");
      const lines = linesByNameAndValue[key];

      if (!lines || lines.length === 0) return;

      // Find the over and under lines for this prop
      const overLine = lines.find((l) => l.isOver);
      const underLine = lines.find((l) => !l.isOver);

      let overData: TotalData | null = null;
      let underData: TotalData | null = null;

      // Create TotalData objects if we have the data
      if (overLine && overUnders[overLine.lineId]) {
        const ou = overUnders[overLine.lineId];
        overData = {
          line_id: overLine.lineId,
          name: ou.name,
          value: ou.value,
          is_over: true,
          is_player_prop: true,
          category: ou.category || "other",
          odds: odds[overLine.lineId] || [],
        };
      }

      if (underLine && overUnders[underLine.lineId]) {
        const ou = overUnders[underLine.lineId];
        underData = {
          line_id: underLine.lineId,
          name: ou.name,
          value: ou.value,
          is_over: false,
          is_player_prop: true,
          category: ou.category || "other",
          odds: odds[underLine.lineId] || [],
        };
      }

      // Only add to result if we have at least one side
      if (overData || underData) {
        // Extract player name from the prop name
        const propName = overData?.name || underData?.name || "";
        const propParts = propName.split(" ");

        // Common stat abbreviations that might appear at the end of the prop name
        const statAbbreviations = [
          "PTS",
          "AST",
          "REB",
          "BLK",
          "STL",
          "3PT",
          "3PM",
          "TO",
          "PRA",
          "PR",
          "PA",
          "RA",
          "SB",
        ];

        // Check if the last part is a stat type
        const lastPart = propParts[propParts.length - 1];
        const isLastPartStatType = statAbbreviations.includes(lastPart);

        // If the last part is a stat type, exclude it; otherwise keep the full name
        const playerName = isLastPartStatType
          ? propParts.slice(0, -1).join(" ")
          : propParts.join(" ");

        // For consistent category identification, determine the prop type
        const propType = isLastPartStatType ? lastPart : "OTHER";

        // Get the category
        const category = (overData?.category ||
          underData?.category ||
          "other") as keyof PlayerPropsByCategory;

        // Initialize player data if not exists
        if (!result[gameId].byPlayer[playerName]) {
          result[gameId].byPlayer[playerName] = {
            pts: [],
            rebs: [],
            asts: [],
            blks: [],
            stls: [],
            threes: [],
            tos: [],
            pts_rebs: [],
            pts_asts: [],
            asts_rebs: [],
            pts_rebs_asts: [],
            stls_blks: [],
            other: [],
          };
        }

        // Add the prop to the appropriate category
        if (category in result[gameId].byPlayer[playerName]) {
          (result[gameId].byPlayer[playerName] as any)[category].push({
            over: overData,
            under: underData,
          });
        } else {
          // If category doesn't match any of our defined ones, put in "other"
          result[gameId].byPlayer[playerName].other.push({
            over: overData,
            under: underData,
          });
        }
      }
    });

    // Sort props by value within each category and add player/category lists to each game
    gameIds.forEach((gameId) => {
      // Sort each category for each player
      const gameData = result[gameId];

      // Set the list of all categories found in this game
      gameData.allCategories = allCategories;

      // Set the list of all players found in this game
      gameData.allPlayers = Array.from(playersByGame[gameId] || []).sort();

      // For each player, sort each category by value
      Object.keys(gameData.byPlayer).forEach((player) => {
        const playerData = gameData.byPlayer[player];

        // Sort each category by prop value
        (Object.keys(playerData) as Array<keyof PlayerPropsByCategory>).forEach(
          (category) => {
            playerData[category].sort((a, b) => {
              const valueA = a.over?.value || a.under?.value || 0;
              const valueB = b.over?.value || b.under?.value || 0;
              return valueA - valueB;
            });
          }
        );
      });
    });

    console.log(
      `Successfully processed player props for ${gameIds.length} games`
    );
  } catch (error) {
    console.error("Error in getBatchPlayerProps:", error);
  }

  return result;
};

/**
 * Get arbitrage opportunities from the materialized view in a single query
 * @param filters Optional filters for sports, sportsbooks, etc.
 * @returns All data needed for the arbitrage page, including opportunities and filter options
 */
export const getArbitrageData = async (filters?: {
  sports?: string[];
  sportsbooks?: string[];
  events?: string[];
}): Promise<ArbitrageData> => {
  try {
    // Start building the query
    let query = supabase
      .from("arbitrage_opportunities")
      .select("*")
      .order("arb_opportunity", { ascending: false });

    // Apply filters if provided
    if (filters) {
      if (filters.sports && filters.sports.length > 0) {
        // Convert all sport filters to lowercase for case-insensitive comparison
        const lowerCaseSports = filters.sports.map((sport) =>
          sport.toLowerCase()
        );
        query = query.in("league", lowerCaseSports);
      }

      if (filters.sportsbooks && filters.sportsbooks.length > 0) {
        // This needs special handling since we have book1 and book2
        query = query.or(
          `book1.in.(${filters.sportsbooks.join(
            ","
          )}),book2.in.(${filters.sportsbooks.join(",")})`
        );
      }

      if (filters.events && filters.events.length > 0) {
        query = query.in("game_name", filters.events);
      }
    }

    // Fetch the arbitrage opportunities
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching arbitrage opportunities:", error);
      return { opportunities: [], sports: [], sportsbooks: [], events: [] };
    }

    if (!data || data.length === 0) {
      return { opportunities: [], sports: [], sportsbooks: [], events: [] };
    }

    // Extract unique sports, sportsbooks, and events
    const sportSet = new Set<string>();
    const bookSet = new Set<string>();
    const eventSet = new Set<string>();

    // Transform to the expected structure for the UI
    const opportunities: ArbitrageOpportunity[] = data.map((item) => {
      // Add to sets for unique values
      if (item.league) {
        // Store the sports in a consistent format (uppercase for display)
        sportSet.add(item.league.toUpperCase());
      }

      if (item.book1) {
        bookSet.add(item.book1);
      }

      if (item.book2) {
        bookSet.add(item.book2);
      }

      if (item.game_name) {
        eventSet.add(item.game_name);
      }

      // Format the profit percentage (arb_opportunity represents the profit in percentage)
      const profit = parseFloat(item.arb_opportunity);

      // Generate a unique ID for this opportunity
      const id = `${item.line_id1}_${item.line_id2}`;

      // Use line_code to determine what each book is betting on
      const line1 = getLineName(
        item.line_code1,
        item.home_team,
        item.away_team
      );
      const line2 = getLineName(
        item.line_code2,
        item.home_team,
        item.away_team
      );

      // Determine the type of bet based on the line codes
      let betType = "Moneyline";
      if (
        (item.line_code1.includes("O") && /O\d+\.?\d*/.test(item.line_code1)) ||
        (item.line_code1.includes("U") && /U\d+\.?\d*/.test(item.line_code1)) ||
        (item.line_code2.includes("O") && /O\d+\.?\d*/.test(item.line_code2)) ||
        (item.line_code2.includes("U") && /U\d+\.?\d*/.test(item.line_code2))
      ) {
        betType = determineBetType(item.line_code1, item.line_code2);
      }

      // Create the lines array with both sides of the arbitrage bet
      const lines: ArbitrageLine[] = [
        {
          sportsbook: item.book1,
          line: line1,
          odds: formatOdds(item.odds_value1),
          book_link: item.book_link1,
        },
        {
          sportsbook: item.book2,
          line: line2,
          odds: formatOdds(item.odds_value2),
          book_link: item.book_link2,
        },
      ];

      return {
        id,
        game_id: item.game_id,
        event: item.game_name,
        sport: item.league?.toUpperCase() || "UNKNOWN",
        profit,
        bet: betType,
        game_time: item.game_time,
        game_date: item.game_date,
        lines,
      };
    });

    // Convert sets to sorted arrays
    const sports = Array.from(sportSet).sort();
    const sportsbooks = Array.from(bookSet).sort();
    const events = Array.from(eventSet).sort();

    return {
      opportunities,
      sports,
      sportsbooks,
      events,
    };
  } catch (error) {
    console.error("Error in getArbitrageData:", error);
    return { opportunities: [], sports: [], sportsbooks: [], events: [] };
  }
};

/**
 * Helper function to determine what team or outcome a line represents
 */
function getLineName(
  lineCode: string,
  homeTeam: string,
  awayTeam: string
): string {
  if (!lineCode) return "Unknown";

  // Check for over/under (totals) bets
  if (lineCode.includes("O") && /O\d+\.?\d*/.test(lineCode)) {
    // Match pattern for over bets (e.g., "Indiana Pacers O117.5")
    const overMatch = lineCode.match(/O(\d+\.?\d*)/);
    if (overMatch) {
      // Return the full bet name including team if available
      const teamPart = lineCode.replace(/O\d+\.?\d*/, "").trim();
      // Apply formatting to team part if it includes a category
      const formattedTeamPart = formatBetCategory(teamPart);
      return formattedTeamPart
        ? `${formattedTeamPart} Over ${overMatch[1]}`
        : `Over ${overMatch[1]}`;
    }
  }

  if (lineCode.includes("U") && /U\d+\.?\d*/.test(lineCode)) {
    // Match pattern for under bets (e.g., "Indiana Pacers U117.5")
    const underMatch = lineCode.match(/U(\d+\.?\d*)/);
    if (underMatch) {
      // Return the full bet name including team if available
      const teamPart = lineCode.replace(/U\d+\.?\d*/, "").trim();
      // Apply formatting to team part if it includes a category
      const formattedTeamPart = formatBetCategory(teamPart);
      return formattedTeamPart
        ? `${formattedTeamPart} Under ${underMatch[1]}`
        : `Under ${underMatch[1]}`;
    }
  }

  // Simple matching based on team names
  if (lineCode.includes(homeTeam)) {
    return homeTeam;
  } else if (lineCode.includes(awayTeam)) {
    return awayTeam;
  } else {
    // Check if the line code might contain a category to format
    return formatBetCategory(lineCode);
  }
}

/**
 * Helper function to format bet categories to be more readable
 */
function formatBetCategory(betName: string): string {
  if (!betName) return betName;

  // Map of category abbreviations to readable formats
  const categoryMap: Record<string, string> = {
    stls: "Steals",
    "Home Total": "Home Total",
    pts_rebs_asts: "Pts+Reb+Ast",
    asts_rebs: "Ast+Reb",
    blks: "Blocks",
    rebs: "Rebounds",
    pts_rebs: "Pts+Reb",
    tos: "Turnovers",
    pts_asts: "Pts+Ast",
    "Game Total": "Game Total",
    pts: "Points",
    stls_blks: "Stl+Blk",
    "Away Total": "Away Total",
    asts: "Assists",
    threes: "Threes",
  };

  // Check for player names followed by category
  const parts = betName.split(" ");
  if (parts.length > 1) {
    // Check if the last part is a category that needs formatting
    const lastPart = parts[parts.length - 1];
    if (lastPart in categoryMap) {
      // Replace the category with a more readable format
      parts[parts.length - 1] = categoryMap[lastPart];
      return parts.join(" ");
    }

    // Check if there's a pts_rebs_asts or similar pattern
    for (const [abbr, readable] of Object.entries(categoryMap)) {
      if (betName.includes(abbr)) {
        return betName.replace(abbr, readable);
      }
    }
  }

  // Return the original if no formatting was applied
  return betName;
}

/**
 * Helper function to format odds in American format
 */
function formatOdds(oddsValue: number): string {
  return oddsValue >= 0 ? `+${oddsValue}` : `${oddsValue}`;
}

/**
 * Helper function to determine the bet type based on line codes
 */
function determineBetType(lineCode1: string, lineCode2: string): string {
  // First check for player props
  const playerPropCategories = [
    "pts",
    "rebs",
    "asts",
    "blks",
    "stls",
    "threes",
    "tos",
    "pts_rebs",
    "pts_asts",
    "asts_rebs",
    "pts_rebs_asts",
    "stls_blks",
  ];

  // For each category, check if it appears in either line code
  for (const category of playerPropCategories) {
    if (lineCode1.includes(category) || lineCode2.includes(category)) {
      return formatBetCategory(category);
    }
  }

  // Check for team/game totals
  if (lineCode1.includes("Home Total") || lineCode2.includes("Home Total")) {
    return "Home Total";
  }

  if (lineCode1.includes("Away Total") || lineCode2.includes("Away Total")) {
    return "Away Total";
  }

  if (lineCode1.includes("Game Total") || lineCode2.includes("Game Total")) {
    return "Game Total";
  }

  // If no specific category is found, default to Totals
  return "Totals";
}
