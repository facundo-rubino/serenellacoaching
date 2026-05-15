import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero}>
      <Image
        className={styles.image}
        src="/assets/img/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <p>Mindfulness - Gestión emocional</p>
        <h1>
          Encontrá tu <span>mejor versión</span>
        </h1>
        <Link className={styles.cta} href={routes.homeSection("sobre-mi")}>
          Sobre mi
        </Link>
      </div>
    </section>
  );
}
