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
          <p className={styles.error}>
            La cuenta quedó registrada, pero todavía no tiene rol administrador.
          </p>
        ) : null}
        {params.error === "oauth" ? <p className={styles.error}>No se pudo completar el acceso con Google.</p> : null}
        {params.error === "google_required" ? (
          <p className={styles.error}>El panel solo admite cuentas autenticadas con Google.</p>
        ) : null}
        {params.error === "config" ? (
          <p className={styles.error}>Supabase Auth no está configurado.</p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
