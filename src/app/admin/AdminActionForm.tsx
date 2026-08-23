"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import styles from "./admin.module.scss";

type ServerFormAction = (formData: FormData) => Promise<unknown>;

type Confirmation = {
  title: string;
  description: string;
  confirmLabel?: string;
};

type AdminActionFormProps = Omit<ComponentPropsWithoutRef<"form">, "action" | "onSubmit"> & {
  action: ServerFormAction;
  children: ReactNode;
  successMessage: string;
  pendingMessage?: string;
  confirmation?: Confirmation;
  resetOnSuccess?: boolean;
};

const PendingContext = createContext(false);

function errorDescription(error: unknown) {
  if (error instanceof Error && error.message && !error.message.includes("Server Components render")) {
    return error.message;
  }

  return "Revisá los datos e intentá nuevamente.";
}

export function AdminActionForm({
  action,
  children,
  successMessage,
  pendingMessage = "Guardando cambios...",
  confirmation,
  resetOnSuccess = false,
  ...formProps
}: AdminActionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const queuedForm = useRef<HTMLFormElement | null>(null);
  const queuedData = useRef<FormData | null>(null);
  const submitter = useRef<HTMLElement | null>(null);
  const cancelButton = useRef<HTMLButtonElement | null>(null);
  const confirmButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (confirmationOpen) {
      cancelButton.current?.focus();
    }
  }, [confirmationOpen]);

  const closeConfirmation = () => {
    if (pending) {
      return;
    }

    setConfirmationOpen(false);
    submitter.current?.focus();
  };

  const runAction = (form: HTMLFormElement, formData: FormData) => {
    const status = formData.get("status");
    const publishing = status === "published";
    const savingDraft = status === "draft";
    const toastId = toast.loading(
      publishing ? "Publicando cambios..." : savingDraft ? "Guardando borrador..." : pendingMessage,
    );

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(successMessage, {
          id: toastId,
          description: publishing
            ? "Los cambios ya están visibles en el sitio."
            : savingDraft
              ? "Se guardó como borrador y no está visible públicamente."
              : "La operación se completó correctamente.",
        });

        if (resetOnSuccess) {
          form.reset();
        }

        router.refresh();
      } catch (error) {
        toast.error("No se pudo completar la acción", {
          id: toastId,
          description: errorDescription(error),
        });
      } finally {
        queuedForm.current = null;
        queuedData.current = null;
        setConfirmationOpen(false);
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pending) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    submitter.current = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;

    if (confirmation) {
      queuedForm.current = form;
      queuedData.current = formData;
      setConfirmationOpen(true);
      return;
    }

    runAction(form, formData);
  };

  const confirmAction = () => {
    if (queuedForm.current && queuedData.current) {
      runAction(queuedForm.current, queuedData.current);
    }
  };

  return (
    <PendingContext.Provider value={pending}>
      <form {...formProps} onSubmit={handleSubmit} aria-busy={pending} data-pending={pending || undefined}>
        {children}
      </form>

      {confirmationOpen && confirmation ? (
        <div className={styles.dialogBackdrop} role="presentation" onMouseDown={closeConfirmation}>
          <div
            className={styles.confirmDialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            aria-describedby="admin-confirm-description"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeConfirmation();
              }

              if (event.key === "Tab") {
                if (event.shiftKey && document.activeElement === cancelButton.current) {
                  event.preventDefault();
                  confirmButton.current?.focus();
                } else if (!event.shiftKey && document.activeElement === confirmButton.current) {
                  event.preventDefault();
                  cancelButton.current?.focus();
                }
              }
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className={styles.dialogIcon} aria-hidden="true">
              !
            </span>
            <div>
              <h2 id="admin-confirm-title">{confirmation.title}</h2>
              <p id="admin-confirm-description">{confirmation.description}</p>
            </div>
            <div className={styles.dialogActions}>
              <button ref={cancelButton} type="button" className={styles.secondaryButton} onClick={closeConfirmation}>
                Cancelar
              </button>
              <button
                ref={confirmButton}
                type="button"
                className={styles.dangerButton}
                disabled={pending}
                onClick={confirmAction}
              >
                {pending ? "Eliminando..." : (confirmation.confirmLabel ?? "Eliminar")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PendingContext.Provider>
  );
}

type AdminSubmitButtonProps = ComponentPropsWithoutRef<"button"> & {
  pendingLabel?: string;
};

export function AdminSubmitButton({ children, pendingLabel = "Guardando...", disabled, ...props }: AdminSubmitButtonProps) {
  const pending = useContext(PendingContext);

  return (
    <button {...props} type={props.type ?? "submit"} disabled={disabled || pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
