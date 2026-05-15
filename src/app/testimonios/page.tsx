import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { testimonials } from "@/data/content";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Testimonios",
  description: "Experiencias de personas que trabajaron con SerenellaCoaching.",
};

export default function TestimonialsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SectionHeading eyebrow="Testimonios" title="Experiencias" accent="reales" align="left" />
        <p>Historias y devoluciones de personas que transitaron procesos de acompañamiento.</p>
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
