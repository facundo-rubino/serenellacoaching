import Link from "next/link";
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
    <button className={styles.dangerButton} type="submit">
      {label}
    </button>
  );
}

function LinkForm({ item, type }: { item?: AdminLinkRow; type: "navigation" | "social" }) {
  const action = type === "navigation" ? upsertNavigationItemAction : upsertSocialLinkAction;

  return (
    <form action={action} className={styles.inlineForm}>
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
      <button type="submit">Guardar</button>
    </form>
  );
}

function ContentBlockForm({ block, itemId }: { block?: AdminContentBlockRow; itemId: string }) {
  return (
    <form action={upsertContentBlockAction} className={styles.inlineForm}>
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
      <button type="submit">Guardar bloque</button>
    </form>
  );
}

function ContentItemEditor({ item }: { item: AdminContentItemRow }) {
  return (
    <details className={styles.editorItem}>
      <summary>
        <span>{item.title}</span>
        <small>{item.type === "therapy" ? "Terapia" : "Curso"} · {item.status}</small>
      </summary>
      <form action={upsertContentItemAction} className={styles.editorForm}>
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
        <button type="submit">Guardar contenido</button>
      </form>
      <form action={deleteContentItemAction} className={styles.deleteForm}>
        <input type="hidden" name="id" value={item.id} />
        <DeleteButton />
      </form>
      <div className={styles.subsection}>
        <h4>Bloques</h4>
        {item.blocks.map((block) => (
          <div key={block.id} className={styles.blockRow}>
            <ContentBlockForm block={block} itemId={item.id} />
            <form action={deleteContentBlockAction}>
              <input type="hidden" name="id" value={block.id} />
              <DeleteButton label="Eliminar bloque" />
            </form>
          </div>
        ))}
        <ContentBlockForm itemId={item.id} />
      </div>
    </details>
  );
}

function ReviewForm({ item }: { item?: AdminReviewRow }) {
  return (
    <form action={upsertReviewAction} className={styles.editorForm}>
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
      <button type="submit">Guardar testimonio</button>
    </form>
  );
}

function FaqForm({ item }: { item?: AdminFaqRow }) {
  return (
    <form action={upsertFaqAction} className={styles.editorForm}>
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
      <button type="submit">Guardar FAQ</button>
    </form>
  );
}

function PageSectionForm({ section }: { section: AdminPageSectionRow }) {
  return (
    <form action={upsertPageSectionAction} className={styles.editorForm}>
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
      <button type="submit">Guardar sección</button>
    </form>
  );
}

function MediaAssetForm({ asset }: { asset: AdminMediaAssetRow }) {
  return (
    <article className={styles.mediaCard}>
      <Image src={asset.public_url} alt={asset.alt} width={360} height={270} unoptimized />
      <code>{asset.public_url}</code>
      <form action={updateMediaAssetAction} className={styles.inlineForm}>
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
        <button type="submit">Guardar</button>
      </form>
      <form action={deleteMediaAssetAction}>
        <input type="hidden" name="id" value={asset.id} />
        <input type="hidden" name="path" value={asset.path} />
        <DeleteButton />
      </form>
    </article>
  );
}

export default async function AdminDashboardPage() {
  const { profile, supabase } = await requireAdmin();
  const data = await getAdminDashboardData(supabase);

  return (
    <main className={styles.adminPage}>
      <header className={styles.adminHeader}>
        <div>
          <p className={styles.kicker}>Dashboard</p>
          <h1>Contenido SerenellaCoaching</h1>
          <p>{profile.email}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/">Ver sitio</Link>
          <form action={signOutAdminAction}>
            <button type="submit">Salir</button>
          </form>
        </div>
      </header>

      <section className={styles.metrics}>
        <article>
          <strong>{data.contentItems.length}</strong>
          <span>Cursos y terapias</span>
        </article>
        <article>
          <strong>{data.reviews.length}</strong>
          <span>Testimonios</span>
        </article>
        <article>
          <strong>{data.faqItems.length}</strong>
          <span>FAQs</span>
        </article>
        <article>
          <strong>{data.mediaAssets.length}</strong>
          <span>Imágenes recientes</span>
        </article>
      </section>

      <details className={styles.panel} open>
        <summary>Configuración del sitio</summary>
        {data.site ? (
          <form action={updateSiteSettingsAction} className={styles.editorForm}>
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
            <button type="submit">Guardar configuración</button>
          </form>
        ) : null}
      </details>

      <details className={styles.panel}>
        <summary>Contacto, navegación y redes</summary>
        {data.contact ? (
          <form action={updateContactSettingsAction} className={styles.editorForm}>
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
            <button type="submit">Guardar contacto</button>
          </form>
        ) : null}
        <div className={styles.columns}>
          <div>
            <h3>Navegación</h3>
            {data.navigation.map((item) => (
              <div key={item.id} className={styles.rowGroup}>
                <LinkForm item={item} type="navigation" />
                <form action={deleteNavigationItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton />
                </form>
              </div>
            ))}
            <LinkForm type="navigation" />
          </div>
          <div>
            <h3>Redes</h3>
            {data.socialLinks.map((item) => (
              <div key={item.id} className={styles.rowGroup}>
                <LinkForm item={item} type="social" />
                <form action={deleteSocialLinkAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton />
                </form>
              </div>
            ))}
            <LinkForm type="social" />
          </div>
        </div>
      </details>

      <details className={styles.panel} open>
        <summary>Contenido</summary>
        <form action={upsertContentItemAction} className={styles.editorForm}>
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
          <button type="submit">Crear contenido</button>
        </form>
        {data.contentItems.map((item) => (
          <ContentItemEditor key={item.id} item={item} />
        ))}
      </details>

      <details className={styles.panel}>
        <summary>Testimonios</summary>
        <ReviewForm />
        {data.reviews.map((item) => (
          <div key={item.id} className={styles.rowGroup}>
            <ReviewForm item={item} />
            <form action={deleteReviewAction}>
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton />
            </form>
          </div>
        ))}
      </details>

      <details className={styles.panel}>
        <summary>FAQ</summary>
        <FaqForm />
        {data.faqItems.map((item) => (
          <div key={item.id} className={styles.rowGroup}>
            <FaqForm item={item} />
            <form action={deleteFaqAction}>
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton />
            </form>
          </div>
        ))}
      </details>

      <details className={styles.panel}>
        <summary>Páginas y secciones</summary>
        {data.pages.map((page) => (
          <section key={page.id} className={styles.subsection}>
            <h3>{page.title}</h3>
            {page.sections.map((section) => (
              <PageSectionForm key={section.id} section={section} />
            ))}
          </section>
        ))}
      </details>

      <details className={styles.panel}>
        <summary>Media</summary>
        <form action={uploadMediaAction} className={styles.editorForm}>
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
          <button type="submit">Subir imagen</button>
        </form>
        <div className={styles.mediaGrid}>
          {data.mediaAssets.map((asset) => (
            <MediaAssetForm key={asset.id} asset={asset} />
          ))}
        </div>
      </details>
    </main>
  );
}
