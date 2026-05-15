import type { FaqItem } from "@/data/content";
import { SectionHeading } from "./SectionHeading";
import styles from "./FaqSection.module.scss";

type FaqSectionProps = {
  items: FaqItem[];
};

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading eyebrow="F.A.Q" title="Preguntas más" accent="frecuentes" />
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.question} className={styles.item}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
