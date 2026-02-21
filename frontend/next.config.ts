import type { NextConfig } from "next";

const LANGGRAPH_INTERNAL_URL =
  process.env.LANGGRAPH_INTERNAL_URL || "http://basis-agent:5095";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/agent/:path*",
        destination: `${LANGGRAPH_INTERNAL_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
