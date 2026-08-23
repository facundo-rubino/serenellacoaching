import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublicContent } from "@/lib/content/public";
import styles from "./page.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getPublicContent();

  return {
    title: pages.testimonials.seoTitle ?? pages.testimonials.title,
    description: pages.testimonials.seoDescription,
  };
}

export default async function TestimonialsPage() {
  const { pages, testimonials } = await getPublicContent();
  const hero = pages.testimonials.sections.listing_hero;

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <SectionHeading
          eyebrow={hero?.eyebrow ?? "Testimonios"}
          title={hero?.title ?? "Experiencias"}
          accent={hero?.accent ?? "reales"}
          align="left"
          level={1}
        />
        <p>{hero?.body ?? "Historias y devoluciones de personas que transitaron procesos de acompañamiento."}</p>
      </section>

      <section className={styles.grid}>
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className={styles.card}>
            <div className={styles.avatar}>
              <Image src={testimonial.image} alt={testimonial.imageAlt} fill sizes="80px" />
            </div>
            <h2>{testimonial.name}</h2>
            <p>{testimonial.quote}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
