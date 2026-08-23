import Image from "next/image";
import Link from "next/link";
import type { ContentBlock, ContentCard as ContentCardType } from "@/lib/content/types";
import styles from "./ContentPage.module.scss";

type ContentDetailPageProps = {
  item: ContentCardType;
  backHref: string;
  backLabel: string;
};

export function ContentDetailPage({ item, backHref, backLabel }: ContentDetailPageProps) {
  const blocks: ContentBlock[] =
    item.blocks.length > 0
      ? item.blocks
      : item.description.map((paragraph) => ({ type: "paragraph", content: paragraph }));

  return (
    <main id="main-content" className={styles.page}>
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
            {blocks.map((block, index) => {
              if (block.type === "heading") {
                return <h2 key={block.id ?? `${block.type}-${index}`}>{block.content}</h2>;
              }

              if (block.type === "image" && block.image) {
                return (
                  <div key={block.id ?? `${block.type}-${index}`} className={styles.inlineImage}>
                    <Image src={block.image} alt={block.imageAlt ?? ""} fill sizes="(max-width: 900px) 100vw, 720px" />
                  </div>
                );
              }

              return <p key={block.id ?? `${block.type}-${index}`}>{block.content}</p>;
            })}
          </div>
        </div>
      </article>
    </main>
  );
}
