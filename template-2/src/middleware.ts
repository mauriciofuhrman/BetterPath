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
    const isPaymentRoute = path === "/payment" || path === "/payment-success";
    const isPublicRoute = isAuthRoute || isHomePage || isPaymentRoute;

    // Check if route is a protected tool route
    const isToolRoute = path.startsWith("/tools/");
    const isProtectedRoute =
      path.startsWith("/dashboard") ||
      path === "/positive-ev" ||
      path === "/normal-arbitrage" ||
      path === "/free-bet-converter";

    // Handle authentication
    if (isLoggedIn) {
      // Check subscription status for protected routes
      if (isProtectedRoute || isToolRoute) {
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("id", session.user.id)
          .single();

        // Handle database errors gracefully
        if (subError && subError.code !== "PGRST116") {
          console.error("Error checking subscription:", subError);
          // Continue without blocking - fail open in case of DB issues
        }
        // Redirect to payment if no active subscription
        else if (!subscription || subscription.status !== "active") {
          console.log(
            "User does not have active subscription, redirecting to payment"
          );
          // If in payment flow, let them continue, otherwise redirect to payment
          if (!isPaymentRoute) {
            return NextResponse.redirect(
              new URL(`/payment?userId=${session.user.id}`, request.url)
            );
          }
        }
      }

      // Redirect from auth routes to dashboard when logged in
      if (isAuthRoute) {
        console.log(
          "Redirecting authenticated user from auth page to dashboard"
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      // Redirect from protected routes to sign-in when not logged in
      // Allow tool routes to be accessible with blurred content
      if (isProtectedRoute && !isToolRoute) {
        console.log(
          "Redirecting unauthenticated user from protected route to signin"
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
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/payment",
    "/payment-success",
    "/auth-check",
    "/tools/:path*",
    "/free-bet-converter",
    "/normal-arbitrage",
    "/positive-ev",
  ],
};
