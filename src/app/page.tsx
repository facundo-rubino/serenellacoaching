import Image from "next/image";
import Link from "next/link";
import { CardGrid } from "@/components/CardGrid";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublicContent } from "@/lib/content/public";
import { routes } from "@/lib/routes";
import styles from "./page.module.scss";

export default async function HomePage() {
  const { about, contactInfo, courses, faqItems, pages, therapies } = await getPublicContent();
  const home = pages.home.sections;
  const widgetRef = process.env.NEXT_PUBLIC_EMBEDSOCIAL_WIDGET_REF?.trim();
  const googleReviewsUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim();

  return (
    <main id="main-content">
      <Hero section={home.hero} />
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
                eyebrow={home.testimonials_heading?.eyebrow ?? "Reseñas"}
                title={home.testimonials_heading?.title ?? "Experiencias"}
                accent={home.testimonials_heading?.accent ?? "en Google"}
              />
              <div className={styles.testimonialCta}>
                <p>
                  {home.testimonials_heading?.body ??
                    "Conocé las experiencias compartidas por quienes trabajaron con Serenella."}
                </p>
                <div className={styles.testimonialWidget}>
                  <GoogleReviewsWidget widgetRef={widgetRef} />
                </div>
                {googleReviewsUrl ? (
                  <a
                    href={googleReviewsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.googleReviewsLink}
                  >
                    {home.testimonials_heading?.ctaLabel ?? "Ver reseñas de Google"}
                  </a>
                ) : (
                  <Link
                    href={home.testimonials_heading?.ctaHref ?? routes.testimonials}
                    className={styles.googleReviewsLink}
                  >
                    {home.testimonials_heading?.ctaLabel ?? "Ver reseñas de Google"}
                  </Link>
                )}
              </div>
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
  );
}
