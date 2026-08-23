import type { MetadataRoute } from "next";
import { getPublicContent } from "@/lib/content/public";
import { routes } from "@/lib/routes";
import { getSiteUrl } from "@/lib/supabase/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const { courses, therapies } = await getPublicContent();
  const updatedAt = new Date();
  const paths = [
    routes.home,
    routes.therapies,
    routes.courses,
    routes.about,
    routes.contact,
    ...therapies.map((therapy) => therapy.href),
    ...courses.map((course) => course.href),
  ];

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: updatedAt,
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.7,
  }));
}
