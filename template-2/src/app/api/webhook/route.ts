import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// This is the raw string of the Stripe webhook secret from env
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: "Missing stripe-signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Webhook signature verification failed",
      },
      { status: 400 }
    );
  }

  // Get Supabase client
  const supabase = createClient();

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Update subscription status in database
          const { error } = await supabase
            .from("subscriptions")
            .update({
              stripe_subscription_id: subscription.id,
              status:
                subscription.status === "active" ? "active" : "incomplete",
              plan_id: subscription.items.data[0]?.price.id,
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", userId);

          if (error) {
            console.error(
              "Error updating subscription on session completion:",
              error
            );
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: subscriptionData, error: lookupError } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();

        if (lookupError) {
          console.error("Error finding user by customer ID:", lookupError);
          break;
        }

        if (subscriptionData) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              status: subscription.status === "active" ? "active" : "canceled",
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", subscriptionData.id);

          if (updateError) {
            console.error("Error updating subscription status:", updateError);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: subscriptionData, error: lookupError } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();

        if (lookupError) {
          console.error("Error finding user by customer ID:", lookupError);
          break;
        }

        if (subscriptionData) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", subscriptionData.id);

          if (updateError) {
            console.error(
              "Error updating subscription status to canceled:",
              updateError
            );
          }
        }
        break;
      }

      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
