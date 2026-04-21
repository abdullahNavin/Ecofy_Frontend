import type { NextConfig } from "next";

const backendProxyTarget =
  process.env.BACKEND_PROXY_TARGET ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backendProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
