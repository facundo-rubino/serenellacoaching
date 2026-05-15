import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { about } from "@/data/content";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Sobre mi",
  description: "Conocé a Serenella y su recorrido en mindfulness, coaching y gestión emocional.",
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.inner}>
        <SectionHeading eyebrow="Sobre mi" title="Hola! Me llamo" accent="Serenella" align="left" />
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
