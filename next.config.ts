import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These pages were folded into About; keep old links and search results working.
  async redirects() {
    return ["applications", "quality", "global-reach", "processing"].map((page) => ({
      source: `/${page}`,
      destination: "/about",
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
    ],
  },
};

export default nextConfig;
