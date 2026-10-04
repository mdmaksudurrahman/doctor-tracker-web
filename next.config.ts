import type { NextConfig } from "next";

const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not set");

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;