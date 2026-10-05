import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listClientPlaces, listClients } from "@/lib/admin/clients";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clientes",
};

type SearchParams = Promise<{ q?: string; city?: string; estado?: string }>;

export default async function ClientsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, city, estado } = await searchParams;
  const archived = estado === "archivados";
  const { supabase } = await requireAdmin();
  const [clients, places] = await Promise.all([
    listClients(supabase, { q, city, archived }),
    listClientPlaces(supabase),
  ]);

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Clientes</h1>
          <p>{clients.length} {archived ? "archivados" : "activos"}</p>
        </div>
        <Link className={styles.secondaryButton} href="/admin/clientes/nuevo">+ Nuevo cliente</Link>
      </header>

      <form className={styles.inlineForm} role="search">
        <label>
          Buscar por nombre o teléfono
          <input name="q" type="search" defaultValue={q ?? ""} />
        </label>
        <label>
          Ciudad
          <select name="city" defaultValue={city ?? ""}>
            <option value="">Todas</option>
            {places.cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Mostrar
          <select name="estado" defaultValue={estado ?? "activos"}>
            <option value="activos">Activos</option>
            <option value="archivados">Archivados</option>
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Buscar</button>
      </form>

      {clients.length === 0 ? (
        <p>No hay clientes para mostrar.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
          {clients.map((client) => (
            <li key={client.id}>
              <Link href={`/admin/clientes/${client.id}`} className={styles.editorItem} style={{ display: "grid", gap: 3, padding: 14 }}>
                <strong>{client.full_name}</strong>
                <small>{[client.city, client.phone].filter(Boolean).join(" · ") || "Sin datos de contacto"}</small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
