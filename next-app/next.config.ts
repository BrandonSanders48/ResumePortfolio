import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
