import { AdminSubmitButton } from "../AdminActionForm";
import styles from "../admin.module.scss";

export function VisibilitySelect({ value }: { value: "draft" | "published" }) {
  return (
    <label>
      ¿Se ve en el sitio?
      <select name="status" defaultValue={value}>
        <option value="published">Sí, visible</option>
        <option value="draft">No, oculto</option>
      </select>
    </label>
  );
}

export function DeleteButton({ label = "Eliminar" }: { label?: string }) {
  return (
    <AdminSubmitButton className={styles.dangerButton} pendingLabel="Eliminando...">
      {label}
    </AdminSubmitButton>
  );
}

export function PanelSummary({ title, description }: { title: string; description: string }) {
  return (
    <summary>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className={styles.summaryChevron} aria-hidden="true">⌄</span>
    </summary>
  );
}
