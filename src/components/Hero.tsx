import Image from "next/image";
import Link from "next/link";
import type { PageSection } from "@/lib/content/types";
import { routes } from "@/lib/routes";
import styles from "./Hero.module.scss";

type HeroProps = {
  section?: PageSection;
};

export function Hero({ section }: HeroProps) {
  const title = section?.title ?? "Encontrá tu";
  const accent = section?.accent ?? "mejor versión";
  const body = section?.body ?? "Mindfulness - Gestión emocional";
  const image = section?.image ?? "/assets/img/hero-bg.jpg";

  return (
    <section id="inicio" className={styles.hero}>
      <Image
        className={styles.image}
        src={image}
        alt={section?.imageAlt ?? ""}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <h1>
          {title} <span>{accent}</span>
        </h1>
        <h2>{body}</h2>
        <Link className={styles.cta} href={section?.ctaHref ?? routes.homeSection("sobre-mi")}>
          {section?.ctaLabel ?? "Sobre mi"}
        </Link>
      </div>
    </section>
  );
}
