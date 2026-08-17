// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Security headers for all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Assets ke liye cache
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 day
          },
        ],
      },
      {
        // Data ke liye cache
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300", // 5 minutes
          },
        ],
      },
      {
        // API routes ke liye no-cache
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // Other config options
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;