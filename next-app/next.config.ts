import type { NextConfig } from "next";

// Third-party origins the site actually loads: Cloudflare Turnstile (site
// gate, contact form, resume download, editor login) and Microsoft Clarity
// (analytics, disabled on /editor). Everything else stays same-origin.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.clarity.ms",
  "font-src 'self' data:",
  "frame-src 'self' https://challenges.cloudflare.com https://www.google.com",
  "connect-src 'self' https://challenges.cloudflare.com https://www.clarity.ms https://*.clarity.ms",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        // Self-hosted @font-face files. The resume/cover documents get
        // rendered by Puppeteer via page.setContent(), which gives the page
        // an opaque origin -- so unlike <img>, cross-origin @font-face
        // loading gets blocked by CORS unless the response explicitly
        // allows it (which is why Google Fonts' CDN works but our own
        // public/ static file serving didn't, by default).
        source: "/files/fonts/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        // Applies everywhere. script-src/style-src still need 'unsafe-inline'
        // since Next's own hydration data and next/script inline blocks
        // (Clarity's snippet) aren't nonce-based here -- this CSP is about
        // constraining which origins can load/connect/frame, not blocking
        // inline execution outright.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          // No "preload" -- that requires submitting the domain to the
          // browser-shipped HSTS preload list, which is a one-way door.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
