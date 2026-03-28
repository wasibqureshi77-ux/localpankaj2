import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // DEBUG LOGS (PRODUCTION VISIBLE IN SERVER LOGS)
    console.log(`[AUTH MIDDLEWARE] Path: ${pathname} | Token Role: ${token?.role || "NONE"}`);

    // If no token at all, withAuth will handle redirect unless it's in public list
    if (!token) return NextResponse.next();

    // 1. SUPER ADMIN PROTECTION (ADMIN, MANAGER ONLY)
    if (pathname.startsWith("/super-admin") && pathname !== "/super-admin/login") {
      const role = token.role;
      if (role !== "ADMIN" && role !== "MANAGER") {
         console.warn(`[AUTH] Access denied to admin area for role: ${role}`);
         return NextResponse.redirect(new URL("/super-admin/login", req.url));
      }
    }

    // 2. EDITOR PROTECTION (EDITOR ONLY)
    if (pathname.startsWith("/editor") && pathname !== "/editor/login") {
      const role = token.role;
      if (role !== "EDITOR") {
         console.warn(`[AUTH] Access denied to editor area for role: ${role}`);
         return NextResponse.redirect(new URL("/editor/login", req.url));
      }
    }

    // 3. USER DASHBOARD PROTECTION
    if (pathname.startsWith("/dashboard")) {
       if (!token) {
          return NextResponse.redirect(new URL("/login", req.url));
       }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // ALLOW PUBLIC ROUTES ALWAYS
        if (
          pathname.startsWith("/api/auth") || 
          pathname.startsWith("/_next") || 
          pathname === "/login" || 
          pathname === "/super-admin/login" || 
          pathname === "/editor/login" ||
          pathname === "/"
        ) {
          return true;
        }

        // REQUIRE TOKEN FOR MATCHED ROUTES
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/auth-error",
    },
  }
);

export const config = {
  matcher: [
    "/super-admin/:path*", 
    "/editor/:path*", 
    "/dashboard/:path*"
  ],
};
