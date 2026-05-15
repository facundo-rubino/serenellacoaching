import Image from "next/image";
import Link from "next/link";
import type { ContentCard as ContentCardType } from "@/data/content";
import styles from "./ContentPage.module.scss";

type ContentDetailPageProps = {
  item: ContentCardType;
  backHref: string;
  backLabel: string;
};

export function ContentDetailPage({ item, backHref, backLabel }: ContentDetailPageProps) {
  return (
    <main className={styles.page}>
      <article className={styles.detail}>
        <div className={styles.detailImage}>
          <Image src={item.image} alt={item.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
        </div>

        <div className={styles.detailCopy}>
          <Link className={styles.backLink} href={backHref}>
            {backLabel}
          </Link>
          {item.meta ? <p className={styles.meta}>{item.meta}</p> : null}
          <h1>{item.title}</h1>
          <p className={styles.summary}>{item.summary}</p>
          <div className={styles.body}>
            {item.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
