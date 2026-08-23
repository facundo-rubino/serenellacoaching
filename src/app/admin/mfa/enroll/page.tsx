import { requireAdmin } from "@/lib/admin/auth";
import { MfaEnrollForm } from "./MfaEnrollForm";
import styles from "../../admin.module.scss";

export const metadata = {
  title: "Activar MFA",
};

export const dynamic = "force-dynamic";

export default async function MfaEnrollPage() {
  await requireAdmin({ requireMfa: false });

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <p className={styles.kicker}>Seguridad</p>
        <h1>Activá autenticación en dos pasos</h1>
        <p>El dashboard requiere un código TOTP además del acceso con Google.</p>
        <MfaEnrollForm />
      </section>
    </main>
  );
}
