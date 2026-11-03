import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listClientSummaries, listClients, whatsappUrl } from "@/lib/admin/clients";
import { formatSince } from "@/lib/admin/session-summary";
import styles from "../../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Para volver a contactar",
};

const THRESHOLD_DAYS = 60;

export default async function RecontactPage() {
  const { supabase } = await requireAdmin();
  const [clients, summaries] = await Promise.all([listClients(supabase), listClientSummaries(supabase)]);
  const rows = clients
    .map((client) => ({ client, days: summaries.get(client.id)?.days_since_last ?? null }))
    .filter((row): row is { client: (typeof clients)[number]; days: number } => row.days !== null && row.days > THRESHOLD_DAYS)
    .sort((a, b) => b.days - a.days);

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Para volver a contactar</h1>
          <p>
            <Link href="/admin/clientes">← Volver a clientes</Link> · No vienen hace más de {THRESHOLD_DAYS} días
          </p>
        </div>
      </header>
      {rows.length === 0 ? (
        <p>No hay nadie para contactar por ahora.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
          {rows.map(({ client, days }) => {
            const whatsapp = whatsappUrl(client.phone);
            return (
              <li key={client.id} className={styles.editorItem} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 14 }}>
                <Link href={`/admin/clientes/${client.id}`} style={{ display: "grid", gap: 3 }}>
                  <strong>{client.full_name}</strong>
                  <small>Última sesión {formatSince(days)}</small>
                </Link>
                {whatsapp ? (
                  <a className={styles.secondaryButton} href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
