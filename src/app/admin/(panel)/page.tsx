import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { whatsappUrl } from "@/lib/admin/clients";
import { getHomeStats } from "@/lib/admin/dashboard";
import { formatSince } from "@/lib/admin/session-summary";
import styles from "../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inicio",
};

export default async function AdminHomePage() {
  const { profile, supabase } = await requireAdmin();
  const stats = await getHomeStats(supabase);

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Hola{profile.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""}</h1>
          <p>¿Qué querés hacer?</p>
        </div>
        <div className={styles.bigActions}>
          <Link className={styles.primaryAction} href="/admin/clientes/sesion">Registrar sesión</Link>
          <Link className={styles.primaryAction} href="/admin/clientes/nuevo">Nuevo cliente</Link>
        </div>
      </header>

      <div className={styles.metrics}>
        <article>
          <strong>{stats.sessionsThisMonth}</strong>
          <span>Sesiones este mes</span>
        </article>
        <article>
          <strong>{stats.newClientsThisMonth}</strong>
          <span>Clientes nuevos este mes</span>
        </article>
        <article>
          <strong>{stats.activeClients}</strong>
          <span>Clientes activos</span>
          <small>Vinieron en los últimos 60 días</small>
        </article>
      </div>

      <article className={styles.panel}>
        <h2>Hace tiempo que no vienen</h2>
        {stats.toContact.length === 0 ? (
          <p>No hay nadie para contactar por ahora.</p>
        ) : (
          <ul className={styles.plainList}>
            {stats.toContact.map(({ client, days }) => {
              const whatsapp = whatsappUrl(client.phone);
              return (
                <li key={client.id}>
                  <Link href={`/admin/clientes/${client.id}`}>
                    <strong>{client.full_name}</strong>
                    <small>Última sesión {formatSince(days)}</small>
                  </Link>
                  {whatsapp ? (
                    <a className={styles.secondaryButton} href={whatsapp} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
        <p><Link href="/admin/clientes/recontactar">Ver todos →</Link></p>
      </article>

      <div className={styles.columns}>
        <article className={styles.panel}>
          <h2>Terapias más elegidas este mes</h2>
          {stats.topTherapies.length === 0 ? (
            <p>Todavía no hay sesiones este mes.</p>
          ) : (
            <ol className={styles.plainList}>
              {stats.topTherapies.map((item) => (
                <li key={item.label}><span>{item.label}</span><strong>{item.count}</strong></li>
              ))}
            </ol>
          )}
        </article>
        <article className={styles.panel}>
          <h2>Ciudades de tus clientes</h2>
          {stats.topCities.length === 0 ? (
            <p>Cargá la ciudad de tus clientes para verla acá.</p>
          ) : (
            <ol className={styles.plainList}>
              {stats.topCities.map((item) => (
                <li key={item.label}><span>{item.label}</span><strong>{item.count}</strong></li>
              ))}
            </ol>
          )}
        </article>
      </div>
    </section>
  );
}
