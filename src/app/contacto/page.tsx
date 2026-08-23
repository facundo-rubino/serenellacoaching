import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublicContent } from "@/lib/content/public";
import styles from "./page.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getPublicContent();

  return {
    title: pages.contact.seoTitle ?? pages.contact.title,
    description: pages.contact.seoDescription,
  };
}

export default async function ContactPage() {
  const { contactInfo, pages } = await getPublicContent();
  const hero = pages.contact.sections.listing_hero;

  return (
    <main>
      <section className={styles.hero}>
        <SectionHeading
          eyebrow={hero?.eyebrow ?? "Contacto"}
          title={hero?.title ?? "Coordinemos"}
          accent={hero?.accent ?? "un encuentro"}
          align="left"
        />
        <p>{hero?.body ?? "Escribime o completá el formulario para conversar sobre tus intereses."}</p>
      </section>
      <ContactSection contact={contactInfo} compact />
    </main>
  );
}
