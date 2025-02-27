import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    // Initialize the Supabase client with the new server component
    const supabase = createClient();

    // Get the user's session (this will update the cookies if needed)
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("Auth sync endpoint:", {
      hasSession: !!session,
      error: error?.message || null,
    });

    // Create response with appropriate headers
    const response = NextResponse.json({
      status: "success",
      authenticated: !!session,
      timestamp: new Date().toISOString(),
    });

    // Set cache control headers to prevent caching of auth state
    response.headers.set("Cache-Control", "no-store, max-age=0");

    // Return session status
    return response;
  } catch (error) {
    console.error("Error in auth sync endpoint:", error);

    const errorResponse = NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );

    // Set cache control headers
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");

    return errorResponse;
  }
}
