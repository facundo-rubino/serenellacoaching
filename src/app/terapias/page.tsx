import type { Metadata } from "next";
import { ContentListingPage } from "@/components/ContentListingPage";
import { therapies } from "@/data/content";

export const metadata: Metadata = {
  title: "Terapias",
  description: "Terapias de SerenellaCoaching para mindfulness, energía, coaching y bienestar.",
};

export default function TherapiesPage() {
  return (
    <ContentListingPage
      eyebrow="Terapias"
      title="Todas las"
      accent="terapias"
      intro="Un punto de partida para ampliar cada propuesta con más detalle cuando el contenido específico esté listo."
      items={therapies}
    />
  );
}
