import Image from "next/image";
import Link from "next/link";
import type { ContentCard as ContentCardType } from "@/lib/content/types";
import styles from "./ContentCard.module.scss";

type ContentCardProps = {
  item: ContentCardType;
  priority?: boolean;
  headingLevel?: 2 | 3;
};

export function ContentCard({ item, priority = false, headingLevel = 3 }: ContentCardProps) {
  return (
    <article className={styles.card}>
      <Link className={styles.imageLink} href={item.href} aria-label={`Ver ${item.title}`}>
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={priority}
        />
      </Link>
      <div className={styles.body}>
        {item.meta ? <p className={styles.meta}>{item.meta}</p> : null}
        {headingLevel === 2 ? <h2>{item.title}</h2> : <h3>{item.title}</h3>}
        <p className={styles.summary}>{item.summary}</p>
        <p>{item.description[0]}</p>
        <Link className={styles.link} href={item.href}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
