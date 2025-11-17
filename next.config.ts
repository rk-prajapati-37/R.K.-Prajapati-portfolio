import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images and Sanity CDN images
    domains: ["localhost", "127.0.0.1"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
