import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionAndOpenClientAction } from "@/lib/admin/actions";
import { listClients, listTherapies } from "@/lib/admin/clients";
import { ClientSubmit } from "../ClientForm";
import { SessionFields } from "../SessionFields";
import styles from "../../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Registrar sesión",
};

export default async function NewSessionPage() {
  const { supabase } = await requireAdmin();
  const [clients, therapies] = await Promise.all([listClients(supabase), listTherapies(supabase)]);

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Registrar sesión</h1>
          <p><Link href="/admin/clientes">← Volver a clientes</Link></p>
        </div>
      </header>
      <form className={styles.editorForm} action={createSessionAndOpenClientAction}>
        <SessionFields clients={clients} therapies={therapies} />
        <ClientSubmit label="Guardar sesión" />
      </form>
    </section>
  );
}
