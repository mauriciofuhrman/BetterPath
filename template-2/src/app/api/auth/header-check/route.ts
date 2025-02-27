import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  // Initialize the Supabase client with the new server component
  const supabase = createClient();

  // Get the user's session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Log for debugging
  console.log("Header check endpoint:", {
    hasSession: !!session,
    error: error?.message || null,
  });

  // Return the auth state
  return NextResponse.json({
    authState: session ? "logged-in" : "not-logged-in",
    timestamp: new Date().toISOString(),
  });
}
