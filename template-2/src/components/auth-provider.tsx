"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      console.log("Refreshing auth state...");
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsLoggedIn(true);

        // Sync with server - only if we have a session
        try {
          await fetch("/api/auth/sync", {
            method: "POST",
            // Use same-origin for this request to avoid CORS issues
            credentials: "same-origin",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          console.log(
            "Auth refreshed - user is logged in:",
            data.session.user.email
          );
        } catch (syncError) {
          console.error("Error syncing with server:", syncError);
        }
      } else {
        setSession(null);
        setUser(null);
        setIsLoggedIn(false);
        console.log("Auth refreshed - no active session");
      }
    } catch (error) {
      console.error("Error refreshing auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial auth check
    refreshAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession);

        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoggedIn(!!newSession);

        // If logged in or token refreshed, sync with server
        if (newSession && ["SIGNED_IN", "TOKEN_REFRESHED"].includes(event)) {
          try {
            await fetch("/api/auth/sync", {
              method: "POST",
              credentials: "same-origin",
              headers: {
                "Cache-Control": "no-cache",
              },
            });
          } catch (error) {
            console.error("Auth sync failed after state change:", error);
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      // Force clear session state immediately
      setSession(null);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isLoggedIn, isLoading, signOut, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
