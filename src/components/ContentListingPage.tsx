import Link from "next/link";
import type { ContentCard as ContentCardType } from "@/data/content";
import { routes } from "@/lib/routes";
import { CardGrid } from "./CardGrid";
import { SectionHeading } from "./SectionHeading";
import styles from "./ContentPage.module.scss";

type ContentListingPageProps = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  items: ContentCardType[];
};

export function ContentListingPage({ eyebrow, title, accent, intro, items }: ContentListingPageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <Link className={styles.backLink} href={routes.home}>
            Inicio
          </Link>
          <SectionHeading eyebrow={eyebrow} title={title} accent={accent} align="left" />
          <p>{intro}</p>
        </div>
      </section>

      <section className={styles.listing}>
        <CardGrid items={items} />
      </section>
    </main>
  );
}
