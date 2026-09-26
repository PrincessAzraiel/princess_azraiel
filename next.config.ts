import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /AzraTok lists public/AzraTok with fs at build time, which makes the
  // bundler copy every video into the server function (over Vercel's 250 MB
  // limit). The files are served from the CDN, so the function never needs them.
  outputFileTracingExcludes: {
    "/AzraTok": ["./public/AzraTok/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  async redirects() {
    return [
      // /bam was an earlier copy of the /typing experience; keep old shared
      // links working instead of duplicating the page.
      { source: "/bam", destination: "/typing", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
