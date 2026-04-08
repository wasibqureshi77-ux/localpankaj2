import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get token (session)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 1. SUPER ADMIN PROTECTION
  if (pathname.startsWith("/super-admin") && pathname !== "/super-admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/super-admin/login", req.url));
    }
    if (token.role !== "ADMIN" && token.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/super-admin/login", req.url));
    }
  }

  // 2. EDITOR PROTECTION
  if (pathname.startsWith("/editor") && pathname !== "/editor/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/editor/login", req.url));
    }
    if (token.role !== "EDITOR") {
      return NextResponse.redirect(new URL("/editor/login", req.url));
    }
  }

  // 3. USER DASHBOARD PROTECTION
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 4. TECHNICIAN PROTECTION
  if (pathname.startsWith("/technician") && pathname !== "/technician/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/technician/login", req.url));
    }
    if (token.role !== "TECHNICIAN") {
      return NextResponse.redirect(new URL("/technician/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/editor/:path*", "/dashboard/:path*", "/technician/:path*"],
};
