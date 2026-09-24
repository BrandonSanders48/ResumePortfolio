import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/editor", "/gate", "/api/"],
      },
    ],
    sitemap: "https://brandonsanders.org/sitemap.xml",
  };
}
