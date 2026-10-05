import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSiteData } from "@/lib/admin/data";
import {
  deleteContentBlockAction,
  deleteContentItemAction,
  deleteFaqAction,
  updateContactSettingsAction,
  upsertContentBlockAction,
  upsertContentItemAction,
  upsertFaqAction,
} from "@/lib/admin/actions";
import type { AdminContentBlockRow, AdminContentItemRow, AdminFaqRow } from "@/lib/admin/types";
import { AdminActionForm, AdminSubmitButton } from "../../AdminActionForm";
import { DeleteButton, PanelSummary, VisibilitySelect } from "../AdminFields";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi sitio",
};

type TechFieldProps = {
  isOwner: boolean;
  name: string;
  label: string;
  defaultValue: string | number;
  type?: string;
  wide?: boolean;
};

// Campos técnicos (slug, orden, SEO, URLs embebidas): editables solo por el owner.
// Para el resto viajan ocultos y conservan su valor.
function TechField({ isOwner, name, label, defaultValue, type = "text", wide }: TechFieldProps) {
  if (!isOwner) {
    return <input type="hidden" name={name} value={defaultValue} />;
  }

  return (
    <label className={wide ? styles.wideField : undefined}>
      {label}
      <input name={name} type={type} defaultValue={defaultValue} />
    </label>
  );
}

function ContentBlockForm({ block, itemId, position, isOwner }: { block?: AdminContentBlockRow; itemId: string; position: number; isOwner: boolean }) {
  return (
    <AdminActionForm
      action={upsertContentBlockAction}
      className={styles.inlineForm}
      successMessage={block ? "Párrafo guardado" : "Párrafo agregado"}
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
        Texto
        <textarea name="content" rows={3} defaultValue={block?.content ?? ""} />
      </label>
      <label>
        Enlace de la imagen (si es imagen)
        <input name="image_url" defaultValue={block?.image_url ?? ""} />
      </label>
      <label>
        Qué se ve en la imagen
        <input name="image_alt" defaultValue={block?.image_alt ?? ""} />
      </label>
      <TechField isOwner={isOwner} name="sort_order" label="Orden" type="number" defaultValue={block?.sort_order ?? position} />
      <AdminSubmitButton>{block ? "Guardar" : "Agregar"}</AdminSubmitButton>
    </AdminActionForm>
  );
}

function ContentFields({ item, position, isOwner }: { item?: AdminContentItemRow; position: number; isOwner: boolean }) {
  return (
    <>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <label>
        Es una…
        <select name="type" defaultValue={item?.type ?? "therapy"}>
          <option value="therapy">Terapia</option>
          <option value="course">Curso</option>
        </select>
      </label>
      <VisibilitySelect value={item?.status ?? "draft"} />
      <label className={styles.wideField}>
        Título
        <input name="title" defaultValue={item?.title ?? ""} required />
      </label>
      <label className={styles.wideField}>
        Descripción corta
        <textarea name="summary" rows={3} defaultValue={item?.summary ?? ""} required />
      </label>
      <label>
        Dato breve (ej. duración)
        <input name="meta" defaultValue={item?.meta ?? ""} />
      </label>
      <label>
        Enlace de la foto
        <input name="image_url" defaultValue={item?.image_url ?? ""} required />
      </label>
      <label>
        Qué se ve en la foto
        <input name="image_alt" defaultValue={item?.image_alt ?? ""} required />
      </label>
      <TechField isOwner={isOwner} name="slug" label="Slug" defaultValue={item?.slug ?? ""} />
      <TechField isOwner={isOwner} name="sort_order" label="Orden" type="number" defaultValue={item?.sort_order ?? position} />
      <TechField isOwner={isOwner} name="seo_title" label="SEO título" defaultValue={item?.seo_title ?? ""} />
      <TechField isOwner={isOwner} name="seo_description" label="SEO descripción" defaultValue={item?.seo_description ?? ""} wide />
    </>
  );
}

function ContentItemEditor({ item, isOwner }: { item: AdminContentItemRow; isOwner: boolean }) {
  return (
    <details className={styles.editorItem}>
      <summary>
        <span>
          <strong>{item.title}</strong>
          <small>{item.type === "therapy" ? "Terapia" : "Curso"}</small>
        </span>
        <span className={`${styles.statusBadge} ${item.status === "published" ? styles.statusPublished : styles.statusDraft}`}>
          {item.status === "published" ? "Visible" : "Oculto"}
        </span>
      </summary>
      <AdminActionForm action={upsertContentItemAction} className={styles.editorForm} successMessage="Cambios guardados">
        <ContentFields item={item} position={item.sort_order} isOwner={isOwner} />
        <AdminSubmitButton>Guardar cambios</AdminSubmitButton>
      </AdminActionForm>
      <div className={styles.subsection}>
        <h4>Texto de la página</h4>
        {item.blocks.map((block) => (
          <div key={block.id} className={styles.blockRow}>
            <ContentBlockForm block={block} itemId={item.id} position={block.sort_order} isOwner={isOwner} />
            <AdminActionForm
              action={deleteContentBlockAction}
              successMessage="Párrafo eliminado"
              pendingMessage="Eliminando..."
              confirmation={{
                title: "Eliminar este párrafo",
                description: "Va a dejar de verse en la página. No se puede deshacer.",
                confirmLabel: "Sí, eliminar",
              }}
            >
              <input type="hidden" name="id" value={block.id} />
              <DeleteButton />
            </AdminActionForm>
          </div>
        ))}
        <ContentBlockForm itemId={item.id} position={item.blocks.length} isOwner={isOwner} />
      </div>
      <AdminActionForm
        action={deleteContentItemAction}
        className={styles.deleteForm}
        successMessage="Eliminado"
        pendingMessage="Eliminando..."
        confirmation={{
          title: `¿Eliminar “${item.title}”?`,
          description: "Se borra con todo su texto. Si solo querés que no se vea, elegí “No, oculto”. No se puede deshacer.",
          confirmLabel: "Sí, eliminar",
        }}
      >
        <input type="hidden" name="id" value={item.id} />
        <DeleteButton label={`Eliminar “${item.title}”`} />
      </AdminActionForm>
    </details>
  );
}

function FaqForm({ item, position, isOwner }: { item?: AdminFaqRow; position: number; isOwner: boolean }) {
  return (
    <AdminActionForm
      action={upsertFaqAction}
      className={styles.editorForm}
      successMessage={item ? "Pregunta guardada" : "Pregunta agregada"}
      resetOnSuccess={!item}
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <VisibilitySelect value={item?.status ?? "published"} />
      <TechField isOwner={isOwner} name="sort_order" label="Orden" type="number" defaultValue={item?.sort_order ?? position} />
      <label className={styles.wideField}>
        Pregunta
        <input name="question" defaultValue={item?.question ?? ""} required />
      </label>
      <label className={styles.wideField}>
        Respuesta
        <textarea name="answer" rows={4} defaultValue={item?.answer ?? ""} required />
      </label>
      <AdminSubmitButton>{item ? "Guardar" : "Agregar pregunta"}</AdminSubmitButton>
    </AdminActionForm>
  );
}

export default async function AdminSitePage() {
  const { supabase, isOwner } = await requireAdmin();
  const data = await getAdminSiteData(supabase);

  return (
    <>
      <header className={styles.adminHeader}>
        <div>
          <h1>Mi sitio</h1>
          <p>Terapias, cursos, preguntas frecuentes y tus datos de contacto.</p>
        </div>
      </header>

      <details className={styles.panel} open>
        <PanelSummary title="Terapias y cursos" description="Lo que ofrecés y cómo se presenta" />
        {data.contentItems.map((item) => (
          <ContentItemEditor key={item.id} item={item} isOwner={isOwner} />
        ))}
        <details className={styles.editorItem}>
          <summary>
            <span>
              <strong>+ Agregar terapia o curso</strong>
              <small>Después vas a poder sumarle texto</small>
            </span>
          </summary>
          <AdminActionForm action={upsertContentItemAction} className={styles.editorForm} successMessage="Agregado" resetOnSuccess>
            <ContentFields position={data.contentItems.length} isOwner={isOwner} />
            <AdminSubmitButton>Agregar</AdminSubmitButton>
          </AdminActionForm>
        </details>
      </details>

      <details className={styles.panel}>
        <PanelSummary title="Preguntas frecuentes" description="Se muestran en la portada" />
        {data.faqItems.map((item) => (
          <div key={item.id} className={styles.rowGroup}>
            <FaqForm item={item} position={item.sort_order} isOwner={isOwner} />
            <AdminActionForm
              action={deleteFaqAction}
              successMessage="Pregunta eliminada"
              pendingMessage="Eliminando..."
              confirmation={{
                title: "¿Eliminar esta pregunta?",
                description: `Se eliminará “${item.question}”. No se puede deshacer.`,
                confirmLabel: "Sí, eliminar",
              }}
            >
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton />
            </AdminActionForm>
          </div>
        ))}
        <FaqForm position={data.faqItems.length} isOwner={isOwner} />
      </details>

      <details className={styles.panel}>
        <PanelSummary title="Mis datos de contacto" description="Email, teléfono y dirección que se ven en el sitio" />
        {data.contact ? (
          <AdminActionForm action={updateContactSettingsAction} className={styles.editorForm} successMessage="Datos de contacto guardados">
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
            <TechField isOwner={isOwner} name="map_embed_url" label="Mapa embed" defaultValue={data.contact.map_embed_url} wide />
            <TechField isOwner={isOwner} name="form_url" label="Formulario" defaultValue={data.contact.form_url} wide />
            <AdminSubmitButton>Guardar</AdminSubmitButton>
          </AdminActionForm>
        ) : null}
      </details>
    </>
  );
}
