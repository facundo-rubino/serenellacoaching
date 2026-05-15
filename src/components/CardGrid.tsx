import type { ContentCard as ContentCardType } from "@/data/content";
import { ContentCard } from "./ContentCard";
import styles from "./CardGrid.module.scss";

type CardGridProps = {
  items: ContentCardType[];
};

export function CardGrid({ items }: CardGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <ContentCard key={item.slug} item={item} priority={index < 2} />
      ))}
    </div>
  );
}
