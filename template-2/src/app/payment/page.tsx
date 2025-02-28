"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/lib/supabase";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check for userId and get basic info
    const initPage = async () => {
      try {
        // If no userId in the URL, try to get it from the session
        if (!userId) {
          const { data } = await supabase.auth.getSession();

          // If not authenticated at all, redirect to signup
          if (!data.session) {
            router.push("/signup");
            return;
          }

          // Set email and continue with the session user's ID
          setUserEmail(data.session.user.email);
          setIsLoading(false);
          return;
        }

        // If we have a userId, try to get subscription info
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("id", userId)
          .single();

        // If user already has an active subscription, redirect to dashboard
        if (subscriptionData && subscriptionData.status === "active") {
          router.push("/dashboard");
          return;
        }

        // Try to get user email if possible
        const { data } = await supabase.auth.getSession();
        if (data.session && data.session.user.id === userId) {
          setUserEmail(data.session.user.email);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing payment page:", err);
        setError("Error initializing payment. Please try again.");
        setIsLoading(false);
      }
    };

    initPage();
  }, [router, userId]);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Make sure we have a userId
      const checkoutUserId =
        userId || (await supabase.auth.getUser()).data.user?.id;

      if (!checkoutUserId) {
        throw new Error("User ID not found. Please try signing up again.");
      }

      // Create checkout session via API
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: checkoutUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url, sessionId } = await response.json();

      // If we got a direct URL, use it (preferred method)
      if (url) {
        window.location.href = url;
        return;
      }

      // Fall back to client-side redirect if needed
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message || "Stripe redirect error");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during checkout"
      );
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md p-6 bg-gray-900/50 rounded-lg border border-gray-800 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Complete Your Subscription
          </h1>

          {userEmail && (
            <p className="text-gray-300 mb-2">Account: {userEmail}</p>
          )}

          <p className="text-gray-400 text-sm mb-6">
            You're just one step away from accessing all our premium betting
            tools
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Premium Plan</span>
              <span className="text-white font-semibold">$29.99/month</span>
            </div>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>✓ Access to all betting tools</li>
              <li>✓ Real-time odds monitoring</li>
              <li>✓ Unlimited arbitrage opportunities</li>
              <li>✓ Priority customer support</li>
            </ul>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-white hover:bg-white/90 text-black disabled:opacity-50 font-medium"
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>

          <p className="text-center text-gray-500 text-xs">
            You'll be redirected to Stripe for secure payment processing. Your
            subscription can be canceled at any time.
          </p>
        </div>
      </div>
    </main>
  );
}
