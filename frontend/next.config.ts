import type { NextConfig } from "next";

const LANGGRAPH_INTERNAL_URL =
  process.env.LANGGRAPH_INTERNAL_URL || "http://basis-agent:5095";

const BASIS_API_INTERNAL_URL =
  process.env.BASIS_API_INTERNAL_URL || "http://basis-api:5096";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return {
      // beforeFiles: 在 Next.js 路由（包括 pages/api）之前匹配
      beforeFiles: [
        // LangGraph Agent 反向代理
        {
          source: "/agent/:path*",
          destination: `${LANGGRAPH_INTERNAL_URL}/:path*`,
        },
      ],
      // afterFiles: 在 Next.js pages 之后、但在 public 之前
      afterFiles: [],
      // fallback: 在 Next.js pages + public 都没命中后才走
      // Next.js 自身的 /api/auth/* routes 会优先匹配，剩余 /api/* 走 Business API
      fallback: [
        {
          source: "/api/:path*",
          destination: `${BASIS_API_INTERNAL_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
