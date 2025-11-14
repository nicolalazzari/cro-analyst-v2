import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;
