"use client";

import Image from "next/image";
import { useActionState } from "react";
import {
  startMfaEnrollmentAction,
  verifyMfaEnrollmentAction,
  type ActionState,
  type MfaEnrollState,
} from "@/lib/admin/actions";
import styles from "../../admin.module.scss";

const enrollInitialState: MfaEnrollState = {};
const verifyInitialState: ActionState = {};

export function MfaEnrollForm() {
  const [enrollState, enrollAction, enrolling] = useActionState(startMfaEnrollmentAction, enrollInitialState);
  const [verifyState, verifyAction, verifying] = useActionState(verifyMfaEnrollmentAction, verifyInitialState);

  return (
    <div className={styles.stack}>
      <form action={enrollAction} className={styles.authForm}>
        <button type="submit" disabled={enrolling}>
          {enrolling ? "Creando factor..." : "Crear QR de autenticador"}
        </button>
        {enrollState.error ? <p className={styles.error}>{enrollState.error}</p> : null}
      </form>

      {enrollState.factorId && enrollState.qrCode ? (
        <form action={verifyAction} className={styles.authForm}>
          <input type="hidden" name="factorId" value={enrollState.factorId} />
          <div className={styles.qrWrap}>
            <Image src={enrollState.qrCode} alt="QR para configurar MFA" width={220} height={220} unoptimized />
          </div>
          {enrollState.secret ? (
            <p className={styles.helpText}>
              Código manual: <code>{enrollState.secret}</code>
            </p>
          ) : null}
          <label>
            Código de 6 dígitos
            <input name="code" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required />
          </label>
          {verifyState.error ? <p className={styles.error}>{verifyState.error}</p> : null}
          <button type="submit" disabled={verifying}>
            {verifying ? "Verificando..." : "Activar MFA"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
