import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  // Helper: build redirect URL using nextUrl to preserve correct external host
  const buildRedirect = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    return url;
  };

  if (!code) {
    return NextResponse.redirect(buildRedirect("/login", { error: "no_code" }));
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(buildRedirect("/login", { error: "oauth_failed" }));
  }

  return NextResponse.redirect(buildRedirect("/"));
}
