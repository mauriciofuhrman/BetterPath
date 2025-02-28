import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get Supabase client
    const supabase = createClient();

    // Get subscription data directly instead of getting user from admin API
    const { data: subscriptionData, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", userId)
      .single();

    if (subError && subError.code !== "PGRST116") {
      console.error("Error retrieving subscription:", subError);
      return NextResponse.json(
        { error: "Error retrieving subscription" },
        { status: 500 }
      );
    }

    if (!subscriptionData) {
      console.error("Subscription not found for user ID:", userId);
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Get user email - try from subscription or perform a direct lookup
    let userEmail: string | undefined;

    // Try to get user information from public profile if available
    const { data: profileData } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    userEmail = profileData?.email;

    // If we don't have an email, try to get it from auth.users
    // This might be restricted in some environments
    if (!userEmail) {
      try {
        // Only use admin API if absolutely necessary and available
        const { data: userData, error: userError } =
          await supabase.auth.admin.getUserById(userId);
        if (!userError && userData?.user) {
          userEmail = userData.user.email;
        }
      } catch (error) {
        console.warn(
          "Could not access admin API, proceeding without user email:",
          error
        );
      }
    }

    // Create Stripe customer if needed
    let customerId: string;

    // If the user already has a Stripe customer ID, use it
    if (subscriptionData?.stripe_customer_id) {
      customerId = subscriptionData.stripe_customer_id;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });

      customerId = customer.id;

      // Update Supabase with Stripe customer ID
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ stripe_customer_id: customer.id })
        .eq("id", userId);

      if (updateError) {
        console.error(
          "Error updating subscription with customer ID:",
          updateError
        );
        // Continue anyway - not critical
      }
    }

    // Get origin for success/cancel URLs
    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Your premium plan price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?userId=${userId}`,
      metadata: { userId },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
