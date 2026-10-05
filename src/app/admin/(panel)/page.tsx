import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSiteData } from "@/lib/admin/data";
import styles from "../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inicio",
};

export default async function AdminHomePage() {
  const { profile, supabase } = await requireAdmin();
  const data = await getAdminSiteData(supabase);
  const therapies = data.contentItems.filter((item) => item.type === "therapy");
  const courses = data.contentItems.filter((item) => item.type === "course");
  const visible = (items: { status: string }[]) => items.filter((item) => item.status === "published").length;

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Hola{profile.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""}</h1>
          <p>Desde acá cambiás lo que se ve en tu sitio. Pronto vas a poder llevar también tus clientes y sesiones.</p>
        </div>
      </header>

      <div className={styles.metrics}>
        <article>
          <strong>{therapies.length}</strong>
          <span>Terapias</span>
          <small>{visible(therapies)} visibles en el sitio</small>
        </article>
        <article>
          <strong>{courses.length}</strong>
          <span>Cursos</span>
          <small>{visible(courses)} visibles en el sitio</small>
        </article>
        <article>
          <strong>{data.faqItems.length}</strong>
          <span>Preguntas frecuentes</span>
          <small>{visible(data.faqItems)} visibles en el sitio</small>
        </article>
      </div>

      <p>
        <Link href="/admin/sitio">Editar mi sitio →</Link>
      </p>
    </section>
  );
}
