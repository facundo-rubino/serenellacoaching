import { requireAdmin } from "@/lib/admin/auth";
import { MfaChallengeForm } from "./MfaChallengeForm";
import styles from "../../admin.module.scss";

export const metadata = {
  title: "Verificar MFA",
};

export const dynamic = "force-dynamic";

export default async function MfaChallengePage() {
  await requireAdmin({ requireMfa: false });

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <p className={styles.kicker}>Seguridad</p>
        <h1>Verificación MFA</h1>
        <p>Ingresá el código de tu aplicación autenticadora para continuar.</p>
        <MfaChallengeForm />
      </section>
    </main>
  );
}
