import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root path is handled by page.tsx conditional rendering (Landing vs Chat)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Check for Supabase auth tokens in cookies
  // Supabase SSR stores session in cookies with pattern: sb-<ref>-auth-token
  const hasSession = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.includes("sb-") && cookie.name.includes("auth-token")
    );

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|logo-.*\\.svg|manifest\\.json|login|landing|onboarding|api/auth|a2ui-demo).*)",
  ],
};
