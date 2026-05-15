import Image from "next/image";
import Link from "next/link";
import { CardGrid } from "@/components/CardGrid";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { about, contactInfo, courses, faqItems, testimonials, therapies } from "@/data/content";
import { routes } from "@/lib/routes";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <>
      <Hero />
      <main>
        <section id="terapias" className={`${styles.section} ${styles.alt}`}>
          <div className={styles.inner}>
            <SectionHeading eyebrow="Terapias" title="Estas son nuestras" accent="terapias" />
            <CardGrid items={therapies} />
          </div>
        </section>

        <section id="testimonios" className={styles.testimonials}>
          <div className={styles.testimonialOverlay}>
            <div className={styles.inner}>
              <SectionHeading eyebrow="Testimonios" title="Experiencias" accent="reales" tone="light" />
              <TestimonialsCarousel items={testimonials} />
            </div>
          </div>
        </section>

        <section id="cursos" className={`${styles.section} ${styles.alt}`}>
          <div className={styles.inner}>
            <SectionHeading eyebrow="Cursos" title="Nuestros cursos" accent="más actuales" />
            <CardGrid items={courses} />
          </div>
        </section>

        <section id="sobre-mi" className={styles.about}>
          <div className={styles.aboutInner}>
            <SectionHeading eyebrow="Sobre mi" title="Para que me conozcas" accent="un poco más" />
            <div className={styles.aboutGrid}>
              <div className={styles.aboutImage}>
                <Image src={about.image} alt={about.imageAlt} fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
              <div className={styles.aboutCopy}>
                <h3>{about.title}</h3>
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <Link href={routes.about}>Conocer más</Link>
              </div>
            </div>
          </div>
        </section>

        <FaqSection items={faqItems} />
        <ContactSection contact={contactInfo} />
      </main>
    </>
  );
}
