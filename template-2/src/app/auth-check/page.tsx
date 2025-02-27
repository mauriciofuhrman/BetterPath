"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthCheckPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [serverHeader, setServerHeader] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    // Check server auth header
    fetch("/api/auth/header-check")
      .then((res) => res.json())
      .then((data) => {
        setServerHeader(data.authState);
      })
      .catch((err) => {
        console.error("Error checking server auth header:", err);
      });
  }, []);

  const handleForceSync = async () => {
    setSyncLoading(true);
    try {
      const response = await fetch("/api/auth/sync", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setSyncResult(data);
    } catch (error) {
      setSyncResult({ error: String(error) });
    } finally {
      setSyncLoading(false);
    }
  };

  const handleStorageCheck = () => {
    const authData = localStorage.getItem("sb-access-token");
    alert(`Auth data in localStorage: ${authData ? "Present" : "Not present"}`);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth State Diagnostic</h1>

        <div className="space-y-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Client Auth State</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">Loading: </span>
                {isLoading ? "True" : "False"}
              </p>
              <p>
                <span className="text-gray-400">Is Logged In: </span>
                <span
                  className={
                    isLoggedIn ? "text-green-500 font-bold" : "text-red-500"
                  }
                >
                  {isLoggedIn ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <span className="text-gray-400">User Email: </span>
                {user?.email || "No user"}
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Server Auth State</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">Middleware Auth Header: </span>
                {serverHeader === null ? (
                  "Loading..."
                ) : (
                  <span
                    className={
                      serverHeader === "logged-in"
                        ? "text-green-500 font-bold"
                        : "text-red-500"
                    }
                  >
                    {serverHeader}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-4">
              <div>
                <Button
                  onClick={handleForceSync}
                  disabled={syncLoading}
                  className="mr-4 bg-blue-600 hover:bg-blue-700"
                >
                  {syncLoading ? "Syncing..." : "Force Auth Sync"}
                </Button>
                <Button
                  onClick={handleStorageCheck}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Check Local Storage
                </Button>
              </div>

              {syncResult && (
                <div className="bg-gray-800 p-4 rounded overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(syncResult, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-4 flex space-x-4">
                <Link href="/signin">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Go to Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="bg-gray-600 hover:bg-gray-700">
                    Go to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
