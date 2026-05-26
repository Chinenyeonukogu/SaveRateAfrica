const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https://www.saverateafrica.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://*.google-analytics.com https://vitals.vercel-insights.com https://*.supabase.co https://generativelanguage.googleapis.com",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "randomuser.me"
      },
      {
        protocol: "https",
        hostname: "flagcdn.com"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      },
      {
        source: "/:path*\\.(svg|jpg|jpeg|png|webp|avif|gif|ico|mp4|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/providers/pangea",
        destination: "/providers/remitly",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "saverateafrica.com" }],
        destination: "https://www.saverateafrica.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
