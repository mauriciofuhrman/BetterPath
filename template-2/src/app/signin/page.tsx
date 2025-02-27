"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

export default function SignInPage() {
  const router = useRouter();
  const { isLoggedIn, refreshAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Signing you in...");
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  // Check if already authenticated on page load
  useEffect(() => {
    if (isLoggedIn) {
      console.log("Already logged in, redirecting to dashboard");
      setAuthSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, [isLoggedIn, router]);

  // Handle redirect attempts with fallback
  useEffect(() => {
    if (authSuccess && redirectAttempts < 3) {
      const timer = setTimeout(() => {
        setRedirectAttempts((prev) => prev + 1);
        setLoadingMessage(
          `Syncing authentication (attempt ${redirectAttempts + 1}/3)...`
        );

        // Try to refresh auth state
        refreshAuth()
          .then(() => {
            // After refresh, send a direct request to check cookie state
            return fetch("/api/auth/sync", {
              method: "POST",
              credentials: "same-origin",
              headers: {
                "Cache-Control": "no-cache",
              },
            }).then((res) => res.json());
          })
          .then((data) => {
            console.log("Auth sync response:", data);
            // If server says we're authenticated, proceed to dashboard
            if (data.authenticated) {
              router.push("/dashboard");
            } else if (redirectAttempts >= 2) {
              // On last attempt, try direct navigation
              window.location.href = "/dashboard";
            }
          })
          .catch((err) => {
            console.error("Error during auth refresh:", err);
            if (redirectAttempts >= 2) {
              // Last attempt - try direct navigation
              window.location.href = "/dashboard";
            }
          });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [authSuccess, redirectAttempts, refreshAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      console.log("Attempting sign in with email:", formData.email);

      // Sign in with Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        console.error("Supabase sign-in error:", signInError);
        throw new Error(signInError.message);
      }

      if (data.session) {
        console.log("Sign in successful, user:", data.session.user.email);
        setAuthSuccess(true);
        setLoadingMessage("Authentication successful! Syncing...");

        // Enhanced session handling after successful sign-in
        // Set session data manually if needed
        localStorage.setItem(
          "supabase.auth.token",
          JSON.stringify(data.session)
        );

        // Force refresh global auth state
        await refreshAuth();

        // Explicitly sync with server
        const syncResponse = await fetch("/api/auth/sync", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            refreshed: true,
            timestamp: new Date().toISOString(),
          }),
        });

        console.log("Server sync response:", await syncResponse.json());

        // Start the redirect process with retries
        setRedirectAttempts(1);
      } else {
        throw new Error("Sign in succeeded but no session was returned");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
      setAuthSuccess(false);
    }
  };

  if (authSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-medium text-white">{loadingMessage}</h2>
          <p className="text-gray-400">
            {redirectAttempts < 3
              ? "You'll be redirected to the dashboard momentarily"
              : "If you are not redirected automatically, click the button below"}
          </p>
          {redirectAttempts >= 3 && (
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            Welcome back
          </h1>
          <p className="text-gray-400">
            Sign in to access your betting opportunities
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="hi@example.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
                className="border-white/10"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-400 font-normal"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))/90] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
