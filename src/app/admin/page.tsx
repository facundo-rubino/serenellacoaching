import Image from "next/image";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminDashboardData } from "@/lib/admin/data";
import {
  deleteContentBlockAction,
  deleteContentItemAction,
  deleteFaqAction,
  deleteMediaAssetAction,
  deleteNavigationItemAction,
  deleteReviewAction,
  deleteSocialLinkAction,
  signOutAdminAction,
  updateContactSettingsAction,
  updateMediaAssetAction,
  updateSiteSettingsAction,
  uploadMediaAction,
  upsertContentBlockAction,
  upsertContentItemAction,
  upsertFaqAction,
  upsertNavigationItemAction,
  upsertPageSectionAction,
  upsertReviewAction,
  upsertSocialLinkAction,
} from "@/lib/admin/actions";
import type {
  AdminContentBlockRow,
  AdminContentItemRow,
  AdminFaqRow,
  AdminLinkRow,
  AdminMediaAssetRow,
  AdminPageSectionRow,
  AdminReviewRow,
} from "@/lib/admin/types";
import { AdminActionForm, AdminSubmitButton } from "./AdminActionForm";
import { AdminDashboardShell } from "./AdminDashboardShell";
import styles from "./admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard admin",
};

function StatusSelect({ value }: { value: "draft" | "published" }) {
  return (
    <label>
      Estado
      <select name="status" defaultValue={value}>
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
      </select>
    </label>
  );
}

function DeleteButton({ label = "Eliminar" }: { label?: string }) {
  return (
    <AdminSubmitButton className={styles.dangerButton} pendingLabel="Eliminando...">
      {label}
    </AdminSubmitButton>
  );
}

function LinkForm({ item, type }: { item?: AdminLinkRow; type: "navigation" | "social" }) {
  const action = type === "navigation" ? upsertNavigationItemAction : upsertSocialLinkAction;

  return (
    <AdminActionForm
      action={action}
      className={styles.inlineForm}
      successMessage={item ? `${type === "navigation" ? "Enlace" : "Red social"} actualizado` : `${type === "navigation" ? "Enlace" : "Red social"} creado`}
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

function ContentBlockForm({ block, itemId }: { block?: AdminContentBlockRow; itemId: string }) {
  return (
    <AdminActionForm
      action={upsertContentBlockAction}
      className={styles.inlineForm}
      successMessage={block ? "Bloque actualizado" : "Bloque creado"}
      resetOnSuccess={!block}
    >
      {block ? <input type="hidden" name="id" value={block.id} /> : null}
      <input type="hidden" name="item_id" value={itemId} />
      <label>
        Tipo
        <select name="block_type" defaultValue={block?.block_type ?? "paragraph"}>
          <option value="paragraph">Párrafo</option>
          <option value="heading">Subtítulo</option>
          <option value="image">Imagen</option>
        </select>
      </label>
      <label className={styles.wideField}>
        Contenido
        <textarea name="content" rows={3} defaultValue={block?.content ?? ""} />
      </label>
      <label>
        Imagen URL
        <input name="image_url" defaultValue={block?.image_url ?? ""} />
      </label>
      <label>
        Alt
        <input name="image_alt" defaultValue={block?.image_alt ?? ""} />
      </label>
      <label>
        Orden
        <input name="sort_order" type="number" defaultValue={block?.sort_order ?? 0} />
      </label>
      <AdminSubmitButton>Guardar bloque</AdminSubmitButton>
    </AdminActionForm>
  );
}

function ContentItemEditor({ item }: { item: AdminContentItemRow }) {
  return (
    <details className={styles.editorItem}>
      <summary>
        <span>
          <strong>{item.title}</strong>
          <small>{item.type === "therapy" ? "Terapia" : "Curso"}</small>
        </span>
        <span className={`${styles.statusBadge} ${item.status === "published" ? styles.statusPublished : styles.statusDraft}`}>
          {item.status === "published" ? "Publicado" : "Borrador"}
        </span>
      </summary>
      <AdminActionForm action={upsertContentItemAction} className={styles.editorForm} successMessage="Contenido actualizado">
        <input type="hidden" name="id" value={item.id} />
        <label>
          Tipo
          <select name="type" defaultValue={item.type}>
            <option value="therapy">Terapia</option>
            <option value="course">Curso</option>
          </select>
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={item.slug} required />
        </label>
        <label>
          Orden
          <input name="sort_order" type="number" defaultValue={item.sort_order} />
        </label>
        <StatusSelect value={item.status} />
        <label className={styles.wideField}>
          Título
          <input name="title" defaultValue={item.title} required />
        </label>
        <label className={styles.wideField}>
          Resumen
          <textarea name="summary" rows={3} defaultValue={item.summary} required />
        </label>
        <label>
          Meta
          <input name="meta" defaultValue={item.meta ?? ""} />
        </label>
        <label>
          Imagen URL
          <input name="image_url" defaultValue={item.image_url} required />
        </label>
        <label>
          Imagen alt
          <input name="image_alt" defaultValue={item.image_alt} required />
        </label>
        <label>
          SEO título
          <input name="seo_title" defaultValue={item.seo_title ?? ""} />
        </label>
        <label className={styles.wideField}>
          SEO descripción
          <textarea name="seo_description" rows={2} defaultValue={item.seo_description ?? ""} />
        </label>
        <AdminSubmitButton>Guardar contenido</AdminSubmitButton>
      </AdminActionForm>
      <AdminActionForm
        action={deleteContentItemAction}
        className={styles.deleteForm}
        successMessage="Contenido eliminado"
        pendingMessage="Eliminando contenido..."
        confirmation={{
          title: `Eliminar “${item.title}”`,
          description: "Esta acción elimina el contenido y sus bloques asociados. No se puede deshacer.",
          confirmLabel: "Sí, eliminar contenido",
        }}
      >
        <input type="hidden" name="id" value={item.id} />
        <DeleteButton />
      </AdminActionForm>
      <div className={styles.subsection}>
        <h4>Bloques</h4>
        {item.blocks.map((block) => (
          <div key={block.id} className={styles.blockRow}>
            <ContentBlockForm block={block} itemId={item.id} />
            <AdminActionForm
              action={deleteContentBlockAction}
              successMessage="Bloque eliminado"
              pendingMessage="Eliminando bloque..."
              confirmation={{
                title: "Eliminar bloque",
                description: "El bloque dejará de formar parte de este contenido. Esta acción no se puede deshacer.",
                confirmLabel: "Eliminar bloque",
              }}
            >
              <input type="hidden" name="id" value={block.id} />
              <DeleteButton label="Eliminar bloque" />
            </AdminActionForm>
          </div>
        ))}
        <ContentBlockForm itemId={item.id} />
      </div>
    </details>
  );
}

function ReviewForm({ item }: { item?: AdminReviewRow }) {
  return (
    <AdminActionForm
      action={upsertReviewAction}
      className={styles.editorForm}
      successMessage={item ? "Testimonio actualizado" : "Testimonio creado"}
      resetOnSuccess={!item}
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <label>
        Nombre
        <input name="reviewer_name" defaultValue={item?.reviewer_name ?? ""} required />
      </label>
      <label>
        Orden
        <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
      </label>
      <StatusSelect value={item?.status ?? "draft"} />
      <label>
        Imagen URL
        <input name="image_url" defaultValue={item?.image_url ?? ""} required />
      </label>
      <label>
        Imagen alt
        <input name="image_alt" defaultValue={item?.image_alt ?? ""} required />
      </label>
      <label>
        Fuente
        <input name="source" defaultValue={item?.source ?? ""} />
      </label>
      <label className={styles.wideField}>
        Testimonio
        <textarea name="quote" rows={4} defaultValue={item?.quote ?? ""} required />
      </label>
      <AdminSubmitButton>Guardar testimonio</AdminSubmitButton>
    </AdminActionForm>
  );
}

function FaqForm({ item }: { item?: AdminFaqRow }) {
  return (
    <AdminActionForm
      action={upsertFaqAction}
      className={styles.editorForm}
      successMessage={item ? "Pregunta actualizada" : "Pregunta creada"}
      resetOnSuccess={!item}
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <label>
        Orden
        <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
      </label>
      <StatusSelect value={item?.status ?? "draft"} />
      <label className={styles.wideField}>
        Pregunta
        <input name="question" defaultValue={item?.question ?? ""} required />
      </label>
      <label className={styles.wideField}>
        Respuesta
        <textarea name="answer" rows={4} defaultValue={item?.answer ?? ""} required />
      </label>
      <AdminSubmitButton>Guardar FAQ</AdminSubmitButton>
    </AdminActionForm>
  );
}

function PageSectionForm({ section }: { section: AdminPageSectionRow }) {
  return (
    <AdminActionForm action={upsertPageSectionAction} className={styles.editorForm} successMessage="Sección actualizada">
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
      <AdminActionForm action={updateMediaAssetAction} className={styles.inlineForm} successMessage="Imagen actualizada">
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
          description: "Se eliminará el archivo de la biblioteca. Verificá que no esté siendo utilizado antes de continuar.",
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

function PanelSummary({ title, description }: { title: string; description: string }) {
  return (
    <summary>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className={styles.summaryChevron} aria-hidden="true">⌄</span>
    </summary>
  );
}

export default async function AdminDashboardPage() {
  const { profile, supabase } = await requireAdmin();
  const data = await getAdminDashboardData(supabase);
  const publishedContent = data.contentItems.filter((item) => item.status === "published").length;
  const publishedReviews = data.reviews.filter((item) => item.status === "published").length;
  const publishedFaqs = data.faqItems.filter((item) => item.status === "published").length;
  const publishedMedia = data.mediaAssets.filter((item) => item.status === "published").length;

  return (
    <AdminDashboardShell
      email={profile.email}
      displayName={profile.display_name}
      signOutAction={signOutAdminAction}
    >
      <section id="resumen" className={styles.dashboardOverview}>
        <header className={styles.adminHeader}>
        <div>
          <p className={styles.kicker}>Panel de control</p>
          <h1>Hola{profile.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""}</h1>
          <p>Gestioná el contenido, la publicación y la configuración del sitio desde un solo lugar.</p>
        </div>
        <span className={styles.systemStatus}><i /> Sitio operativo</span>
        </header>

        <div className={styles.metrics}>
        <article>
          <strong>{data.contentItems.length}</strong>
          <span>Cursos y terapias</span>
          <small>{publishedContent} publicados · {data.contentItems.length - publishedContent} borradores</small>
        </article>
        <article>
          <strong>{data.reviews.length}</strong>
          <span>Testimonios</span>
          <small>{publishedReviews} publicados</small>
        </article>
        <article>
          <strong>{data.faqItems.length}</strong>
          <span>FAQs</span>
          <small>{publishedFaqs} publicadas</small>
        </article>
        <article>
          <strong>{data.mediaAssets.length}</strong>
          <span>Imágenes recientes</span>
          <small>{publishedMedia} publicadas</small>
        </article>
        </div>
      </section>

      <details id="sitio" className={styles.panel} open>
        <PanelSummary title="Configuración del sitio" description="Identidad general, SEO y medición" />
        {data.site ? (
          <AdminActionForm action={updateSiteSettingsAction} className={styles.editorForm} successMessage="Configuración actualizada">
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
        <PanelSummary title="Contacto, navegación y redes" description="Datos públicos y enlaces principales" />
        {data.contact ? (
          <AdminActionForm action={updateContactSettingsAction} className={styles.editorForm} successMessage="Datos de contacto actualizados">
            <label>
              Email
              <input name="email" type="email" defaultValue={data.contact.email} required />
            </label>
            <label>
              Teléfono
              <input name="phone" defaultValue={data.contact.phone} required />
            </label>
            <label>
              Dirección
              <input name="address" defaultValue={data.contact.address} required />
            </label>
            <label className={styles.wideField}>
              Mapa embed
              <input name="map_embed_url" defaultValue={data.contact.map_embed_url} required />
            </label>
            <label className={styles.wideField}>
              Formulario
              <input name="form_url" defaultValue={data.contact.form_url} required />
            </label>
            <AdminSubmitButton>Guardar contacto</AdminSubmitButton>
          </AdminActionForm>
        ) : null}
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
                    description: "El enlace desaparecerá de la navegación pública. Esta acción no se puede deshacer.",
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
                    description: "El enlace dejará de mostrarse en el sitio. Esta acción no se puede deshacer.",
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

      <details id="contenido-admin" className={styles.panel} open>
        <PanelSummary title="Cursos y terapias" description="Creá, editá y definí qué contenido está publicado" />
        <div className={styles.creationHeader}>
          <div>
            <h2>Crear contenido</h2>
            <p>Completá los datos principales. Podrás agregar bloques después de crearlo.</p>
          </div>
        </div>
        <AdminActionForm action={upsertContentItemAction} className={styles.editorForm} successMessage="Contenido creado" resetOnSuccess>
          <label>
            Tipo
            <select name="type" defaultValue="therapy">
              <option value="therapy">Terapia</option>
              <option value="course">Curso</option>
            </select>
          </label>
          <label>
            Slug
            <input name="slug" placeholder="se-genera-si-queda-vacio" />
          </label>
          <label>
            Orden
            <input name="sort_order" type="number" defaultValue={0} />
          </label>
          <StatusSelect value="draft" />
          <label className={styles.wideField}>
            Título
            <input name="title" required />
          </label>
          <label className={styles.wideField}>
            Resumen
            <textarea name="summary" rows={3} required />
          </label>
          <label>
            Meta
            <input name="meta" />
          </label>
          <label>
            Imagen URL
            <input name="image_url" required />
          </label>
          <label>
            Imagen alt
            <input name="image_alt" required />
          </label>
          <label>
            SEO título
            <input name="seo_title" />
          </label>
          <label className={styles.wideField}>
            SEO descripción
            <textarea name="seo_description" rows={2} />
          </label>
          <AdminSubmitButton>Crear contenido</AdminSubmitButton>
        </AdminActionForm>
        <div className={styles.contentListHeader}>
          <h2>Contenido existente</h2>
          <span>{data.contentItems.length} elementos</span>
        </div>
        {data.contentItems.map((item) => (
          <ContentItemEditor key={item.id} item={item} />
        ))}
      </details>

      <details id="testimonios-admin" className={styles.panel}>
        <PanelSummary title="Testimonios" description="Experiencias visibles en la portada y la sección dedicada" />
        <ReviewForm />
        {data.reviews.map((item) => (
          <div key={item.id} className={styles.rowGroup}>
            <ReviewForm item={item} />
            <AdminActionForm
              action={deleteReviewAction}
              successMessage="Testimonio eliminado"
              pendingMessage="Eliminando testimonio..."
              confirmation={{
                title: `Eliminar testimonio de ${item.reviewer_name}`,
                description: "El testimonio dejará de mostrarse en el sitio. Esta acción no se puede deshacer.",
              }}
            >
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton />
            </AdminActionForm>
          </div>
        ))}
      </details>

      <details id="faq-admin" className={styles.panel}>
        <PanelSummary title="Preguntas frecuentes" description="Respuestas publicadas en la portada" />
        <FaqForm />
        {data.faqItems.map((item) => (
          <div key={item.id} className={styles.rowGroup}>
            <FaqForm item={item} />
            <AdminActionForm
              action={deleteFaqAction}
              successMessage="Pregunta eliminada"
              pendingMessage="Eliminando pregunta..."
              confirmation={{
                title: "Eliminar pregunta frecuente",
                description: `Se eliminará “${item.question}”. Esta acción no se puede deshacer.`,
              }}
            >
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton />
            </AdminActionForm>
          </div>
        ))}
      </details>

      <details id="paginas-admin" className={styles.panel}>
        <PanelSummary title="Páginas y secciones" description="Textos, imágenes y llamadas a la acción por página" />
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
        <PanelSummary title="Biblioteca multimedia" description="Subí y administrá imágenes del sitio" />
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
    </AdminDashboardShell>
  );
}
