import { loginAdminWithGoogleAction } from "@/lib/admin/actions";
import styles from "../admin.module.scss";

export function LoginForm() {
  return (
    <form action={loginAdminWithGoogleAction} className={styles.authForm}>
      <button type="submit">Continuar con Google</button>
      <p className={styles.authHint}>Usá la cuenta de Google habilitada para administrar el sitio.</p>
    </form>
  );
}
