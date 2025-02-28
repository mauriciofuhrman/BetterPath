import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export async function GET(request: Request) {
  // Get the session ID from the URL
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id parameter" },
      { status: 400 }
    );
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get the user ID from the session metadata
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabase = createClient();

    // Check the current status in our database
    const { data: subscriptionData, error: subError } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("id", userId)
      .single();

    // If there's a database error, log it
    if (subError) {
      console.error("Error retrieving subscription from database:", subError);
    }

    // If payment is successful and subscription is active in Stripe
    if (session.payment_status === "paid" && session.subscription) {
      // Retrieve the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (subscription.status === "active") {
        // If our database doesn't reflect the active status, update it
        if (!subscriptionData || subscriptionData.status !== "active") {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              stripe_subscription_id: subscription.id,
              status: "active",
              plan_id: subscription.items.data[0]?.price.id,
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", userId);

          if (updateError) {
            console.error("Error updating subscription status:", updateError);
          }
        }

        // Return active status
        return NextResponse.json({
          status: "active",
          subscription_id: subscription.id,
        });
      }
    }

    // For any other case, return the current status
    return NextResponse.json({
      status: subscriptionData?.status || "incomplete",
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
