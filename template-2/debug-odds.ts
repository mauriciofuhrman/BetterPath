// Debug script for odds fetching
import { fetchTodaysMoneylineOdds } from "./src/lib/supabase-utils";

async function testOdds() {
  console.log("Starting odds test...");
  try {
    // Fetch moneyline odds
    console.log("Calling fetchTodaysMoneylineOdds()...");
    const odds = await fetchTodaysMoneylineOdds();

    console.log(`Received ${odds.length} moneyline odds`);

    if (odds.length > 0) {
      console.log("First odd:", JSON.stringify(odds[0], null, 2));
    } else {
      console.log("No odds data returned.");

      // Check if the Supabase connection is properly initialized
      console.log("Checking Supabase configuration...");

      // Check environment variables (print safe parts only)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      console.log("Supabase URL configured:", !!supabaseUrl);
      console.log(
        "Supabase Key configured:",
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
    }
  } catch (error) {
    console.error("Error testing odds:", error);
  }
}

testOdds().then(() => console.log("Test complete"));
