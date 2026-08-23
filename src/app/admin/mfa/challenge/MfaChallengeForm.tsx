"use client";

import { useActionState } from "react";
import { verifyMfaChallengeAction, type ActionState } from "@/lib/admin/actions";
import styles from "../../admin.module.scss";

const initialState: ActionState = {};

export function MfaChallengeForm() {
  const [state, formAction, pending] = useActionState(verifyMfaChallengeAction, initialState);

  return (
    <form action={formAction} className={styles.authForm}>
      <label>
        Código de 6 dígitos
        <input name="code" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required />
      </label>
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Verificando..." : "Verificar"}
      </button>
    </form>
  );
}
