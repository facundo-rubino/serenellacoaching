import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublicContent } from "@/lib/content/public";
import styles from "./page.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getPublicContent();

  return {
    title: pages.about.seoTitle ?? pages.about.title,
    description: pages.about.seoDescription,
  };
}

export default async function AboutPage() {
  const { about, pages } = await getPublicContent();
  const main = pages.about.sections.main;

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.inner}>
        <SectionHeading
          eyebrow={main?.eyebrow ?? "Sobre mi"}
          title={main?.title ?? "Hola! Me llamo"}
          accent={main?.accent ?? "Serenella"}
          align="left"
          level={1}
        />
        <div className={styles.grid}>
          <div className={styles.image}>
            <Image src={about.image} alt={about.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className={styles.copy}>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
