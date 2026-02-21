import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root path always shows landing page — no auth required
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
    // Unauthenticated → redirect to landing page (/) with login modal hint
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|logo-.*\\.svg|manifest\\.json|login|landing|onboarding|assessment|api/auth|a2ui-demo|agent).*)",
  ],
};
