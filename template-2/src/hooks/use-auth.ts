import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current session and user when the hook is first called
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        console.log("Client auth: Initializing");

        // Get current session
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error retrieving session:", error.message);
          return;
        }

        // Log session state
        console.log("Client auth session:", {
          hasSession: !!currentSession,
          userId: currentSession?.user?.id || "none",
        });

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsLoggedIn(true);

          // Sync cookies by calling sync endpoint (force a server-side sync)
          try {
            await fetch("/api/auth/sync", {
              method: "POST",
              credentials: "include",
            });
          } catch (e) {
            console.warn("Failed to sync auth cookies with server:", e);
          }
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoggedIn(!!newSession);
        setIsLoading(false);

        // Log auth state changes during development
        console.log("Auth state changed:", event, !!newSession);

        // If logged in or token refreshed, sync cookies with server
        if (
          newSession &&
          (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
        ) {
          try {
            await fetch("/api/auth/sync", {
              method: "POST",
              credentials: "include",
            });
          } catch (e) {
            console.warn(
              "Failed to sync auth cookies with server after state change:",
              e
            );
          }
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Function to sign out the user
  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
    setIsLoading(false);
  };

  return {
    user,
    session,
    isLoggedIn,
    isLoading,
    signOut,
  };
};
