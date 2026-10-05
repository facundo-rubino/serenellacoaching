import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminActionForm } from "../../../AdminActionForm";
import { requireAdmin } from "@/lib/admin/auth";
import { setClientArchivedAction, updateClientAction } from "@/lib/admin/actions";
import { getClient, listClientNames, listClientPlaces, whatsappUrl } from "@/lib/admin/clients";
import { ClientFields, ClientSubmit } from "../ClientForm";
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

  const [places, people] = await Promise.all([listClientPlaces(supabase), listClientNames(supabase)]);
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
        <p>Pronto vas a poder registrar y ver acá las sesiones de este cliente.</p>
      </article>

      <AdminActionForm
        className={styles.deleteForm}
        action={setClientArchivedAction}
        successMessage={archived ? "Cliente restaurado." : "Cliente archivado."}
        confirmation={
          archived
            ? undefined
            : {
                title: "¿Archivar este cliente?",
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
