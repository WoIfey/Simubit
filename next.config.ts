import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wolfey.s-ul.eu'
      },
    ]
  }
};

export default nextConfig;
