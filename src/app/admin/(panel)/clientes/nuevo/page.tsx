import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { createClientAction } from "@/lib/admin/actions";
import { listClientNames, listClientPlaces } from "@/lib/admin/clients";
import { ClientFields, ClientSubmit } from "../ClientForm";
import styles from "../../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nuevo cliente",
};

export default async function NewClientPage() {
  const { supabase } = await requireAdmin();
  const [places, people] = await Promise.all([listClientPlaces(supabase), listClientNames(supabase)]);

  return (
    <section className={styles.dashboardOverview}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Nuevo cliente</h1>
          <p><Link href="/admin/clientes">← Volver a clientes</Link></p>
        </div>
      </header>
      <form className={styles.editorForm} action={createClientAction}>
        <ClientFields cities={places.cities} areas={places.areas} people={people} />
        <ClientSubmit label="Guardar cliente" />
      </form>
    </section>
  );
}
