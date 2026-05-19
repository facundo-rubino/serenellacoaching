import Image from "next/image";
import Link from "next/link";
import { CardGrid } from "@/components/CardGrid";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { getPublicContent } from "@/lib/content/public";
import { routes } from "@/lib/routes";
import styles from "./page.module.scss";

export default async function HomePage() {
  const { about, contactInfo, courses, faqItems, pages, testimonials, therapies } = await getPublicContent();
  const home = pages.home.sections;

  return (
    <>
      <Hero section={home.hero} />
      <main>
        <section id="terapias" className={`${styles.section} ${styles.alt}`}>
          <div className={styles.inner}>
            <SectionHeading
              eyebrow={home.therapies_heading?.eyebrow ?? "Terapias"}
              title={home.therapies_heading?.title ?? "Estas son nuestras"}
              accent={home.therapies_heading?.accent ?? "terapias"}
            />
            <CardGrid items={therapies} columns={4} />
          </div>
        </section>

        <section id="testimonios" className={styles.testimonials}>
          <div className={styles.testimonialOverlay}>
            <div className={styles.inner}>
              <SectionHeading
                eyebrow={home.testimonials_heading?.eyebrow ?? "Testimonios"}
                title={home.testimonials_heading?.title ?? "Experiencias"}
                accent={home.testimonials_heading?.accent ?? "reales"}
                tone="light"
              />
              <TestimonialsCarousel items={testimonials} />
            </div>
          </div>
        </section>

        <section id="cursos" className={`${styles.section} ${styles.alt}`}>
          <div className={styles.inner}>
            <SectionHeading
              eyebrow={home.courses_heading?.eyebrow ?? "Cursos"}
              title={home.courses_heading?.title ?? "Nuestros cursos"}
              accent={home.courses_heading?.accent ?? "más actuales"}
            />
            <CardGrid items={courses} columns={3} />
          </div>
        </section>

        <section id="sobre-mi" className={styles.about}>
          <div className={styles.aboutInner}>
            <SectionHeading
              eyebrow={home.about_heading?.eyebrow ?? "Sobre mi"}
              title={home.about_heading?.title ?? "Para que me conozcas"}
              accent={home.about_heading?.accent ?? "un poco más"}
            />
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

        <FaqSection items={faqItems} heading={home.faq_heading} />
        <ContactSection contact={contactInfo} heading={home.contact_heading} />
      </main>
    </>
  );
}
