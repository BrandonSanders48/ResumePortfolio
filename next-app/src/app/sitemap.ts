import type { MetadataRoute } from "next";

const BASE_URL = "https://brandonsanders.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/highlights", "/projects", "/volunteer"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
