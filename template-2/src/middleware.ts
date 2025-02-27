import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  console.log("Middleware running for path:", requestPath);

  // Check for auth cookie presence
  const cookieNames = request.cookies.getAll().map((c) => c.name);
  const hasSbCookies = cookieNames.some((name) => name.startsWith("sb-"));

  console.log("Cookie debug:", {
    cookieCount: cookieNames.length,
    hasSbCookies,
    // Don't log actual values for security, just names
    cookieNames: cookieNames.join(", "),
  });

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Set header to prevent caching
  response.headers.set("Cache-Control", "no-store, max-age=0");

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // This is needed for middleware or edge functions
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.headers.set("Cache-Control", "no-store, max-age=0");
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.headers.set("Cache-Control", "no-store, max-age=0");
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.getSession();
    const session = data?.session;

    console.log(
      "Middleware session check:",
      session ? `logged-in (${session.user.email})` : "not-logged-in",
      error ? `Error: ${error.message}` : ""
    );

    // Add a debug header to help troubleshoot
    response.headers.set(
      "X-Auth-State",
      session ? "authenticated" : "unauthenticated"
    );

    // Handle auth redirects
    const path = request.nextUrl.pathname;
    const isLoggedIn = !!session;
    const isAuthRoute = path === "/signin" || path === "/signup";
    const isHomePage = path === "/";
    const isDashboardPage = path === "/dashboard";

    // Redirect based on auth state
    if (isLoggedIn) {
      // Redirect from auth routes to dashboard when logged in
      if (isAuthRoute) {
        console.log(
          "Redirecting authenticated user from auth page to dashboard"
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      // Redirect from homepage to dashboard when logged in
      if (isHomePage) {
        console.log(
          "Redirecting authenticated user from homepage to dashboard"
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      // Redirect from dashboard to sign-in when not logged in
      if (isDashboardPage) {
        console.log(
          "Redirecting unauthenticated user from dashboard to signin"
        );
        return NextResponse.redirect(new URL("/signin", request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    // Add error header for debugging but continue
    response.headers.set("X-Auth-Error", "true");
    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/signin",
    "/signup",
    "/auth-check",
    "/free-bet-converter",
    "/normal-arbitrage",
  ],
};
