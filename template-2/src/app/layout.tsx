"use client";

import { AnimatedTitle } from "@/components/animated-title";
import { AuthProvider } from "@/components/auth-provider";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app with AuthProvider for shared auth state */}
        <AuthProvider>
          {/* Animated Title - show on all pages except dashboard */}
          {!isDashboard && (
            <div className="fixed top-6 left-6 z-50">
              <AnimatedTitle
                titleSize="sm"
                containerWidth="max-w-[200px]"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
