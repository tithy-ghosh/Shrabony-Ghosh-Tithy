import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const BASE_URL = "https://shrabony-ghosh-tithy.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  };

  const projectPages = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [home, ...projectPages];
}
