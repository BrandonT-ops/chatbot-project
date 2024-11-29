import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "via.placeholder.com"], // Add external domains here
  },
};

export default nextConfig;
