"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Verify payment and update subscription status
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Missing session ID");
        setVerificationStatus("error");
        setIsLoading(false);
        return;
      }

      try {
        // Verify the payment with our API
        const response = await fetch(
          `/api/verify-payment?session_id=${sessionId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Payment verification failed");
        }

        const data = await response.json();

        if (data.status === "active") {
          setVerificationStatus("success");

          // Try to send verification email if payment was successful
          try {
            const { data: authData } = await supabase.auth.getSession();
            if (authData.session) {
              // Send verification email
              await supabase.auth.resend({
                type: "signup",
                email: authData.session.user.email || "",
              });
              setEmailSent(true);
            }
          } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            // Continue even if email sending fails
          }
        } else {
          setVerificationStatus("pending");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during verification"
        );
        setVerificationStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md p-6 bg-gray-900/50 rounded-lg border border-gray-800 space-y-6">
        <div className="text-center">
          {isLoading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-r-2 border-blue-500 border-b-2 border-transparent mb-4"></div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Processing Payment...
              </h1>
              <p className="text-gray-400">
                Please wait while we verify your payment.
              </p>
            </>
          ) : verificationStatus === "success" ? (
            <>
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-300 mb-2">
                Thank you for subscribing to our premium service. You now have
                full access to all our betting tools.
              </p>
              {emailSent && (
                <p className="text-blue-400 text-sm mb-4">
                  We've sent a verification email to your account. Please check
                  your inbox to verify your email address.
                </p>
              )}
              <Button
                onClick={handleContinue}
                className="bg-white hover:bg-white/90 text-black font-medium"
              >
                Continue to Dashboard
              </Button>
            </>
          ) : verificationStatus === "pending" ? (
            <>
              <div className="text-yellow-500 text-5xl mb-4">⟳</div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Payment Processing
              </h1>
              <p className="text-gray-300 mb-2">
                Your payment is being processed. This may take a moment.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                You'll have access to all features once the payment is
                confirmed.
              </p>
              <Button
                onClick={handleContinue}
                className="bg-white hover:bg-white/90 text-black font-medium"
              >
                Continue to Dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="text-red-500 text-5xl mb-4">⚠</div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Verification Issue
              </h1>
              {error && (
                <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 mb-4">
                  {error}
                </div>
              )}
              <p className="text-gray-300 mb-6">
                We couldn't verify your payment status. This could be temporary.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleContinue}
                  className="bg-white hover:bg-white/90 text-black font-medium w-full"
                >
                  Continue to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/payment")}
                  variant="outline"
                  className="text-gray-300 border-gray-700 hover:bg-gray-800 w-full"
                >
                  Try Payment Again
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
