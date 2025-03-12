/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
        protocol: "https",
      },
      {
        hostname: "yt3.ggpht.com",
        protocol: "https",
      },
      {
        hostname: "acoustic-orca-473.convex.cloud",
        protocol: "https",
      },
      {
        hostname: "tough-meadowlark-106.convex.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
