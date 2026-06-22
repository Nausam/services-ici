import type { NextConfig } from "next";

const r2PublicUrl = process.env.R2_PUBLIC_BASE_URL
  ? new URL(process.env.R2_PUBLIC_BASE_URL)
  : null;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10MB",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      ...(r2PublicUrl
        ? [
            {
              protocol: r2PublicUrl.protocol.replace(
                ":",
                ""
              ) as "http" | "https",
              hostname: r2PublicUrl.hostname,
              port: r2PublicUrl.port,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
