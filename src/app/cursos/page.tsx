import type { Metadata } from "next";
import { ContentListingPage } from "@/components/ContentListingPage";
import { getPublicContent } from "@/lib/content/public";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getPublicContent();

  return {
    title: pages.courses.seoTitle ?? pages.courses.title,
    description: pages.courses.seoDescription,
  };
}

export default async function CoursesPage() {
  const { courses, pages } = await getPublicContent();
  const hero = pages.courses.sections.listing_hero;

  return (
    <ContentListingPage
      eyebrow={hero?.eyebrow ?? "Cursos"}
      title={hero?.title ?? "Formaciones"}
      accent={hero?.accent ?? "disponibles"}
      intro={hero?.body ?? "Cursos actuales y estructura preparada para ampliar cada formación con programa, fechas y modalidad."}
      items={courses}
    />
  );
}
