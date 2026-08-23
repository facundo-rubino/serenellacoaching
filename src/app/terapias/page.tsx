import type { Metadata } from "next";
import { ContentListingPage } from "@/components/ContentListingPage";
import { getPublicContent } from "@/lib/content/public";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getPublicContent();

  return {
    title: pages.therapies.seoTitle ?? pages.therapies.title,
    description: pages.therapies.seoDescription,
  };
}

export default async function TherapiesPage() {
  const { pages, therapies } = await getPublicContent();
  const hero = pages.therapies.sections.listing_hero;

  return (
    <ContentListingPage
      eyebrow={hero?.eyebrow ?? "Terapias"}
      title={hero?.title ?? "Todas las"}
      accent={hero?.accent ?? "terapias"}
      intro={hero?.body ?? "Un punto de partida para ampliar cada propuesta con más detalle cuando el contenido específico esté listo."}
      items={therapies}
    />
  );
}
