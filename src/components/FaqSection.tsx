import type { FaqItem, PageSection } from "@/lib/content/types";
import { SectionHeading } from "./SectionHeading";
import styles from "./FaqSection.module.scss";

type FaqSectionProps = {
  items: FaqItem[];
  heading?: PageSection;
};

export function FaqSection({ items, heading }: FaqSectionProps) {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow={heading?.eyebrow ?? "F.A.Q"}
          title={heading?.title ?? "Preguntas más"}
          accent={heading?.accent ?? "frecuentes"}
        />
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
