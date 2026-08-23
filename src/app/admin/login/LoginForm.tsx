"use client";

import { useActionState } from "react";
import { loginAdminAction, type ActionState } from "@/lib/admin/actions";
import styles from "../admin.module.scss";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className={styles.authForm}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" autoComplete="current-password" required minLength={8} />
      </label>
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
