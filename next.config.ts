import type { NextConfig } from "next";

const prod = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: prod, // Ignore linting errors during production build
  },
  /* other config options here */
};

export default nextConfig;
