import { NextRequest, NextResponse } from "next/server";

/**
 * WeChat OAuth callback handler.
 * After WeChat redirects back with ?code=xxx&state=xxx,
 * this route exchanges the code for a token via the backend API.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) {
    // User denied or error
    return NextResponse.redirect(new URL("/login?error=wechat_denied", request.url));
  }

  try {
    // Exchange code with backend
    const backendUrl = process.env.NEXT_PUBLIC_LANGGRAPH_URL || "http://127.0.0.1:5095";
    const resp = await fetch(`${backendUrl}/api/auth/wechat/callback?code=${code}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok) {
      return NextResponse.redirect(new URL("/login?error=wechat_failed", request.url));
    }

    const data = await resp.json();
    const token = data.token;

    // Redirect to the main app with the token as a query param
    // The client-side JS will store it in localStorage
    const redirectPath = state || "/";
    const redirectUrl = new URL(`/login/wechat-complete`, request.url);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("redirect", redirectPath);
    if (data.user?.nickname) {
      redirectUrl.searchParams.set("nickname", data.user.nickname);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("WeChat callback error:", error);
    return NextResponse.redirect(new URL("/login?error=wechat_error", request.url));
  }
}
