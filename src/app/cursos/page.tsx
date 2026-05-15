import type { Metadata } from "next";
import { ContentListingPage } from "@/components/ContentListingPage";
import { courses } from "@/data/content";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Cursos de mindfulness y gestión emocional de SerenellaCoaching.",
};

export default function CoursesPage() {
  return (
    <ContentListingPage
      eyebrow="Cursos"
      title="Formaciones"
      accent="disponibles"
      intro="Cursos actuales y estructura preparada para ampliar cada formación con programa, fechas y modalidad."
      items={courses}
    />
  );
}
