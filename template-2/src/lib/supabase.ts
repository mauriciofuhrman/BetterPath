import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a standard Supabase client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    // Use the newer storage interface for cookie-based storage
    storage: {
      getItem: (key) => {
        if (typeof document === "undefined") return null;
        const item = document.cookie
          .split(";")
          .find((c) => c.trim().startsWith(`${key}=`));
        return item ? item.split("=")[1] : null;
      },
      setItem: (key, value) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=${value}; path=/; max-age=${
          60 * 60 * 8 // 8 hours
        }; samesite=lax;${
          process.env.NODE_ENV === "production" ? " secure;" : ""
        }`;
      },
      removeItem: (key) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      },
    },
  },
});
