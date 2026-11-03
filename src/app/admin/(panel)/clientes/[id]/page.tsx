import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminActionForm } from "../../../AdminActionForm";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionAction, deleteSessionAction, setClientArchivedAction, updateClientAction } from "@/lib/admin/actions";
import { getClient, listClientNames, listClientPlaces, listClientSessions, listClientSummaries, listTherapies, whatsappUrl } from "@/lib/admin/clients";
import { formatSince, summarizeSessions } from "@/lib/admin/session-summary";
import { ClientFields, ClientSubmit } from "../ClientForm";
import { SessionFields } from "../SessionFields";
import styles from "../../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cliente",
};

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();
  const client = await getClient(supabase, id);
  if (!client) notFound();

  const [places, people, therapies, sessions] = await Promise.all([
    listClientPlaces(supabase),
    listClientNames(supabase),
    listTherapies(supabase),
    listClientSessions(supabase, id),
  ]);
  const summary = summarizeSessions(sessions, client.first_visit_date);
  const daysSince = (await listClientSummaries(supabase)).get(id)?.days_since_last ?? null;
  const sinceLabel = summary.firstVisit
    ? new Date(`${summary.firstVisit}T00:00:00`).toLocaleDateString("es-AR", { month: "long", year: "numeric" })
    : null;
  const whatsapp = whatsappUrl(client.phone);
  const archived = Boolean(client.archived_at);

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>{client.full_name}</h1>
          <p>
            <Link href="/admin/clientes">← Volver a clientes</Link>
            {archived ? " · Archivado" : ""}
          </p>
        </div>
        {whatsapp ? (
          <a className={styles.secondaryButton} href={whatsapp} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp
          </a>
        ) : null}
      </header>

      <AdminActionForm className={styles.editorForm} action={updateClientAction} successMessage="Cliente guardado.">
        <ClientFields client={client} cities={places.cities} areas={places.areas} people={people} />
        <ClientSubmit label="Guardar cambios" />
      </AdminActionForm>

      <article className={styles.panel}>
        <h2>Sesiones</h2>
        <p>
          {[
            sinceLabel ? `Viene desde ${sinceLabel}` : null,
            `${summary.sessionsCount} ${summary.sessionsCount === 1 ? "sesión" : "sesiones"}`,
            summary.lastVisit ? `última ${formatSince(daysSince)}` : null,
            summary.favoriteTherapy ? `suele elegir ${summary.favoriteTherapy}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <AdminActionForm
          className={styles.editorForm}
          action={createSessionAction}
          successMessage="Sesión registrada."
          resetOnSuccess
        >
          <SessionFields clientId={client.id} therapies={therapies} />
          <ClientSubmit label="Registrar sesión" />
        </AdminActionForm>

        {sessions.map((session) => (
          <AdminActionForm
            key={session.id}
            className={styles.deleteForm}
            action={deleteSessionAction}
            successMessage="Sesión eliminada."
            confirmation={{
              title: `¿Eliminar la sesión de ${client.full_name} del ${new Date(`${session.session_date}T00:00:00`).toLocaleDateString("es-AR")}?`,
              description: "Se borra del historial y no se puede deshacer.",
              confirmLabel: "Eliminar",
            }}
          >
            <input type="hidden" name="id" value={session.id} />
            <span>
              {new Date(`${session.session_date}T00:00:00`).toLocaleDateString("es-AR")} · {session.therapy_label ?? "Sin terapia"}
              {session.modality === "online" ? " · Online" : ""}
              {session.paid ? "" : " · Sin pagar"}
            </span>
            <ClientSubmit label="Eliminar" />
          </AdminActionForm>
        ))}
      </article>

      <AdminActionForm
        className={styles.deleteForm}
        action={setClientArchivedAction}
        successMessage={archived ? "Cliente restaurado." : "Cliente archivado."}
        confirmation={
          archived
            ? undefined
            : {
                title: `¿Archivar a ${client.full_name}?`,
                description: "Deja de aparecer en la lista, pero no se pierde ningún dato ni su historial.",
                confirmLabel: "Archivar",
              }
        }
      >
        <input type="hidden" name="id" value={client.id} />
        <input type="hidden" name="archive" value={archived ? "false" : "true"} />
        <ClientSubmit label={archived ? "Restaurar cliente" : "Archivar cliente"} />
      </AdminActionForm>
    </section>
  );
}
