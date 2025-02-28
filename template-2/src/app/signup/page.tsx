"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Check if already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If already authenticated, redirect to dashboard
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password || !formData.name) {
        throw new Error("Name, email, and password are required");
      }

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
          // Skip email verification for now to streamline the payment flow
          emailRedirectTo: `${window.location.origin}/payment`,
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error("Failed to create user account");
      }

      // Create subscription record with pending status
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert({
          id: data.user.id,
          status: "pending", // Changed from "incomplete" to better reflect status
        });

      if (subscriptionError) {
        console.error(
          "Failed to create subscription record",
          subscriptionError
        );
        // Continue with the flow even if subscription record creation fails
      }

      setSignupSuccess(true);

      // Always redirect to payment page directly
      setTimeout(() => {
        router.push(`/payment?userId=${data.user?.id}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a]">
        <div className="w-full max-w-md text-center space-y-4 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-white">Account Created!</h2>
          <p className="text-gray-300">
            Your account has been successfully created.
          </p>
          <p className="text-gray-400 text-sm">
            You'll be redirected to the payment page shortly...
          </p>
          <div className="animate-pulse mt-4">
            <div className="h-1 bg-blue-500 rounded w-full max-w-xs mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            Create an account
          </h1>
          <p className="text-gray-400">
            Join us to get access to exclusive betting opportunities
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
              <Label htmlFor="name" className="text-gray-200">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

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

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptTerms: checked as boolean })
              }
              className="border-white/10 mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-400 font-normal leading-relaxed"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
              >
                terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
              >
                privacy policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={!formData.acceptTerms || loading}
            className="w-full bg-white hover:bg-white/90 text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
