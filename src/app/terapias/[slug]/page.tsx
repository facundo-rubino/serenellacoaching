import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/ContentDetailPage";
import { getContentItem, getPublicContent } from "@/lib/content/public";
import { routes } from "@/lib/routes";

type TherapyPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const { therapies } = await getPublicContent();

  return therapies.map((therapy) => ({ slug: therapy.slug }));
}

export async function generateMetadata({ params }: TherapyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const therapy = await getContentItem("therapy", slug);

  if (!therapy) {
    return {};
  }

  return {
    title: therapy.title,
    description: therapy.summary,
  };
}

export default async function TherapyDetailPage({ params }: TherapyPageProps) {
  const { slug } = await params;
  const therapy = await getContentItem("therapy", slug);

  if (!therapy) {
    notFound();
  }

  return <ContentDetailPage item={therapy} backHref={routes.therapies} backLabel="Todas las terapias" />;
}
