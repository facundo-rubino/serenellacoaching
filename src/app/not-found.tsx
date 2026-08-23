import Link from "next/link";
import { routes } from "@/lib/routes";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main id="main-content" className={styles.page}>
      <section>
        <p>404</p>
        <h1>Página no encontrada</h1>
        <Link href={routes.home}>Volver al inicio</Link>
      </section>
    </main>
  );
}
