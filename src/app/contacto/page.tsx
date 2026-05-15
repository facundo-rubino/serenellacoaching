import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { SectionHeading } from "@/components/SectionHeading";
import { contactInfo } from "@/data/content";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacto de SerenellaCoaching en Montevideo.",
};

export default function ContactPage() {
  return (
    <main>
      <section className={styles.hero}>
        <SectionHeading eyebrow="Contacto" title="Coordinemos" accent="un encuentro" align="left" />
        <p>Escribime o completá el formulario para conversar sobre tus intereses.</p>
      </section>
      <ContactSection contact={contactInfo} compact />
    </main>
  );
}
