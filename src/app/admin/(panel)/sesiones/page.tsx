import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sesiones",
};

type SessionListRow = {
  id: string;
  client_id: string;
  therapy_label: string | null;
  session_date: string;
  modality: "presencial" | "online";
  paid: boolean;
  clients: { full_name: string } | null;
};

export default async function SessionsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("client_sessions")
    .select("id,client_id,therapy_label,session_date,modality,paid,clients(full_name)")
    .order("session_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<SessionListRow[]>();
  if (error) throw error;
  const sessions = data ?? [];

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Sesiones</h1>
          <p>Las últimas {sessions.length}</p>
        </div>
        <Link className={styles.primaryAction} href="/admin/clientes/sesion">Registrar sesión</Link>
      </header>

      {sessions.length === 0 ? (
        <p>Todavía no registraste sesiones.</p>
      ) : (
        <ul className={styles.plainList}>
          {sessions.map((session) => (
            <li key={session.id}>
              <Link href={`/admin/clientes/${session.client_id}`}>
                <strong>{session.clients?.full_name ?? "Cliente"}</strong>
                <small>
                  {session.therapy_label ?? "Sin terapia"}
                  {session.modality === "online" ? " · Online" : ""}
                  {session.paid ? "" : " · Sin pagar"}
                </small>
              </Link>
              <time dateTime={session.session_date}>
                {new Date(`${session.session_date}T00:00:00`).toLocaleDateString("es-AR")}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
