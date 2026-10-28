import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/registration",
        destination: "/memberregistration",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/memberregistration",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
