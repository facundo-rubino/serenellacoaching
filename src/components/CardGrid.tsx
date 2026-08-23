import type { ContentCard as ContentCardType } from "@/lib/content/types";
import { ContentCard } from "./ContentCard";
import styles from "./CardGrid.module.scss";

type CardGridProps = {
  items: ContentCardType[];
  columns?: 3 | 4;
  headingLevel?: 2 | 3;
};

export function CardGrid({ items, columns = 3, headingLevel = 3 }: CardGridProps) {
  return (
    <div className={`${styles.grid} ${columns === 4 ? styles.four : styles.three}`}>
      {items.map((item, index) => (
        <ContentCard key={item.slug} item={item} priority={index < 2} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
