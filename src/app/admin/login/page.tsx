import Link from "next/link";
import { LoginForm } from "./LoginForm";
import styles from "../admin.module.scss";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const metadata = {
  title: "Admin",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <Link className={styles.backLink} href="/">
          Volver al sitio
        </Link>
        <p className={styles.kicker}>SerenellaCoaching</p>
        <h1>Administrador</h1>
        <p>Acceso privado para gestionar contenido del sitio.</p>
        {params.error === "unauthorized" ? (
          <p className={styles.error}>El usuario autenticado no tiene rol administrador.</p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
