import Image from "next/image";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminAdvancedData } from "@/lib/admin/data";
import {
  deleteMediaAssetAction,
  deleteNavigationItemAction,
  deleteSocialLinkAction,
  updateMediaAssetAction,
  updateSiteSettingsAction,
  uploadMediaAction,
  upsertNavigationItemAction,
  upsertPageSectionAction,
  upsertSocialLinkAction,
} from "@/lib/admin/actions";
import type { AdminLinkRow, AdminMediaAssetRow, AdminPageSectionRow } from "@/lib/admin/types";
import { AdminActionForm, AdminSubmitButton } from "../../AdminActionForm";
import { DeleteButton, PanelSummary, VisibilitySelect as StatusSelect } from "../AdminFields";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Avanzado",
};

function LinkForm({ item, type }: { item?: AdminLinkRow; type: "navigation" | "social" }) {
  const action = type === "navigation" ? upsertNavigationItemAction : upsertSocialLinkAction;

  return (
    <AdminActionForm
      action={action}
      className={styles.inlineForm}
      successMessage={
        item
          ? `${type === "navigation" ? "Enlace" : "Red social"} actualizado`
          : `${type === "navigation" ? "Enlace" : "Red social"} creado`
      }
      resetOnSuccess={!item}
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <label>
        Etiqueta
        <input name="label" defaultValue={item?.label ?? ""} required />
      </label>
      <label>
        URL
        <input name="href" defaultValue={item?.href ?? ""} required />
      </label>
      <label>
        Orden
        <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
      </label>
      <StatusSelect value={item?.status ?? "draft"} />
      <AdminSubmitButton>Guardar</AdminSubmitButton>
    </AdminActionForm>
  );
}

function PageSectionForm({ section }: { section: AdminPageSectionRow }) {
  return (
    <AdminActionForm
      action={upsertPageSectionAction}
      className={styles.editorForm}
      successMessage="Sección actualizada"
    >
      <input type="hidden" name="id" value={section.id} />
      <label>
        Clave
        <input value={section.section_key} readOnly />
      </label>
      <label>
        Orden
        <input name="sort_order" type="number" defaultValue={section.sort_order} />
      </label>
      <StatusSelect value={section.status} />
      <label>
        Eyebrow
        <input name="eyebrow" defaultValue={section.eyebrow ?? ""} />
      </label>
      <label>
        Título
        <input name="title" defaultValue={section.title ?? ""} />
      </label>
      <label>
        Acento
        <input name="accent" defaultValue={section.accent ?? ""} />
      </label>
      <label>
        Imagen URL
        <input name="image_url" defaultValue={section.image_url ?? ""} />
      </label>
      <label>
        Imagen alt
        <input name="image_alt" defaultValue={section.image_alt ?? ""} />
      </label>
      <label>
        CTA texto
        <input name="cta_label" defaultValue={section.cta_label ?? ""} />
      </label>
      <label>
        CTA URL
        <input name="cta_href" defaultValue={section.cta_href ?? ""} />
      </label>
      <label className={styles.wideField}>
        Cuerpo
        <textarea name="body" rows={5} defaultValue={section.body ?? ""} />
      </label>
      <AdminSubmitButton>Guardar sección</AdminSubmitButton>
    </AdminActionForm>
  );
}

function MediaAssetForm({ asset }: { asset: AdminMediaAssetRow }) {
  return (
    <article className={styles.mediaCard}>
      <Image src={asset.public_url} alt={asset.alt} width={360} height={270} unoptimized />
      <code>{asset.public_url}</code>
      <AdminActionForm
        action={updateMediaAssetAction}
        className={styles.inlineForm}
        successMessage="Imagen actualizada"
      >
        <input type="hidden" name="id" value={asset.id} />
        <label>
          Título
          <input name="title" defaultValue={asset.title ?? ""} />
        </label>
        <label>
          Alt
          <input name="alt" defaultValue={asset.alt} />
        </label>
        <StatusSelect value={asset.status} />
        <AdminSubmitButton>Guardar</AdminSubmitButton>
      </AdminActionForm>
      <AdminActionForm
        action={deleteMediaAssetAction}
        successMessage="Imagen eliminada"
        pendingMessage="Eliminando imagen..."
        confirmation={{
          title: "Eliminar imagen",
          description:
            "Se eliminará el archivo de la biblioteca. Verificá que no esté siendo utilizado antes de continuar.",
          confirmLabel: "Eliminar imagen",
        }}
      >
        <input type="hidden" name="id" value={asset.id} />
        <input type="hidden" name="path" value={asset.path} />
        <DeleteButton />
      </AdminActionForm>
    </article>
  );
}

export default async function AdminAdvancedPage() {
  const { supabase } = await requireAdmin({ requireOwner: true });
  const data = await getAdminAdvancedData(supabase);

  return (
    <>
      <header className={styles.adminHeader}>
        <div>
          <h1>Avanzado</h1>
          <p>Configuración técnica del sitio. Solo visible para el rol owner.</p>
        </div>
      </header>

      <details id="sitio" className={styles.panel} open>
        <PanelSummary
          title="Configuración del sitio"
          description="Identidad general, SEO y medición"
        />
        {data.site ? (
          <AdminActionForm
            action={updateSiteSettingsAction}
            className={styles.editorForm}
            successMessage="Configuración actualizada"
          >
            <label>
              Nombre
              <input name="name" defaultValue={data.site.name} required />
            </label>
            <label>
              Analytics ID
              <input name="analytics_id" defaultValue={data.site.analytics_id ?? ""} />
            </label>
            <label className={styles.wideField}>
              Título SEO
              <input name="title" defaultValue={data.site.title} required />
            </label>
            <label className={styles.wideField}>
              Descripción
              <textarea name="description" rows={3} defaultValue={data.site.description} required />
            </label>
            <label>
              URL del sitio
              <input name="metadata_base" defaultValue={data.site.metadata_base} required />
            </label>
            <label>
              Logo
              <input name="logo_url" defaultValue={data.site.logo_url} required />
            </label>
            <label>
              Favicon
              <input name="favicon_url" defaultValue={data.site.favicon_url} required />
            </label>
            <AdminSubmitButton>Guardar configuración</AdminSubmitButton>
          </AdminActionForm>
        ) : null}
      </details>

      <details id="contacto-admin" className={styles.panel}>
        <PanelSummary title="Navegación y redes" description="Enlaces del menú y redes sociales" />
        <div className={styles.columns}>
          <div>
            <h3>Navegación</h3>
            {data.navigation.map((item) => (
              <div key={item.id} className={styles.rowGroup}>
                <LinkForm item={item} type="navigation" />
                <AdminActionForm
                  action={deleteNavigationItemAction}
                  successMessage="Enlace eliminado"
                  pendingMessage="Eliminando enlace..."
                  confirmation={{
                    title: `Eliminar “${item.label}”`,
                    description:
                      "El enlace desaparecerá de la navegación pública. Esta acción no se puede deshacer.",
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton />
                </AdminActionForm>
              </div>
            ))}
            <LinkForm type="navigation" />
          </div>
          <div>
            <h3>Redes</h3>
            {data.socialLinks.map((item) => (
              <div key={item.id} className={styles.rowGroup}>
                <LinkForm item={item} type="social" />
                <AdminActionForm
                  action={deleteSocialLinkAction}
                  successMessage="Red social eliminada"
                  pendingMessage="Eliminando red social..."
                  confirmation={{
                    title: `Eliminar “${item.label}”`,
                    description:
                      "El enlace dejará de mostrarse en el sitio. Esta acción no se puede deshacer.",
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton />
                </AdminActionForm>
              </div>
            ))}
            <LinkForm type="social" />
          </div>
        </div>
      </details>

      <details id="paginas-admin" className={styles.panel}>
        <PanelSummary
          title="Páginas y secciones"
          description="Textos, imágenes y llamadas a la acción por página"
        />
        {data.pages.map((page) => (
          <section key={page.id} className={styles.subsection}>
            <h3>{page.title}</h3>
            {page.sections.map((section) => (
              <PageSectionForm key={section.id} section={section} />
            ))}
          </section>
        ))}
      </details>

      <details id="media-admin" className={styles.panel}>
        <PanelSummary
          title="Biblioteca multimedia"
          description="Subí y administrá imágenes del sitio"
        />
        <AdminActionForm
          action={uploadMediaAction}
          className={styles.editorForm}
          successMessage="Imagen subida"
          pendingMessage="Subiendo imagen..."
          resetOnSuccess
        >
          <label>
            Imagen
            <input name="file" type="file" accept="image/*" required />
          </label>
          <label>
            Título
            <input name="title" />
          </label>
          <label>
            Alt
            <input name="alt" />
          </label>
          <StatusSelect value="published" />
          <AdminSubmitButton pendingLabel="Subiendo...">Subir imagen</AdminSubmitButton>
        </AdminActionForm>
        <div className={styles.mediaGrid}>
          {data.mediaAssets.map((asset) => (
            <MediaAssetForm key={asset.id} asset={asset} />
          ))}
        </div>
      </details>
    </>
  );
}
