import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/ContentDetailPage";
import { getContentItem, getPublicContent } from "@/lib/content/public";
import { routes } from "@/lib/routes";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const { courses } = await getPublicContent();

  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getContentItem("course", slug);

  if (!course) {
    return {};
  }

  return {
    title: course.title,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getContentItem("course", slug);

  if (!course) {
    notFound();
  }

  return <ContentDetailPage item={course} backHref={routes.courses} backLabel="Todos los cursos" />;
}
