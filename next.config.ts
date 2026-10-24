import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/exercises",
        destination: "/exercise",
        permanent: true,
      },
      {
        source: "/exercises/:id",
        destination: "/exercise/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
