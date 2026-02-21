import { NextRequest, NextResponse } from "next/server";

/**
 * WeChat OAuth callback handler.
 * After WeChat redirects back with ?code=xxx&state=xxx,
 * this route exchanges the code for a token via the backend API.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  // Helper: build redirect URL using nextUrl to preserve correct external host
  const buildRedirect = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    // Clear existing search params from the callback URL
    url.search = "";
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    return url;
  };

  if (!code) {
    // User denied or error
    return NextResponse.redirect(buildRedirect("/login", { error: "wechat_denied" }));
  }

  try {
    // Exchange code with backend
    const backendUrl = process.env.NEXT_PUBLIC_LANGGRAPH_URL || "http://127.0.0.1:5095";
    const resp = await fetch(`${backendUrl}/api/auth/wechat/callback?code=${code}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok) {
      return NextResponse.redirect(buildRedirect("/login", { error: "wechat_failed" }));
    }

    const data = await resp.json();
    const token = data.token;

    // Redirect to the main app with the token as a query param
    // The client-side JS will store it in localStorage
    const redirectPath = state || "/";
    const params: Record<string, string> = { token, redirect: redirectPath };
    if (data.user?.nickname) {
      params.nickname = data.user.nickname;
    }

    return NextResponse.redirect(buildRedirect("/login/wechat-complete", params));
  } catch (error) {
    console.error("WeChat callback error:", error);
    return NextResponse.redirect(buildRedirect("/login", { error: "wechat_error" }));
  }
}
