"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { requireSupabaseServerClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  message?: string;
};

export type MfaEnrollState = ActionState & {
  factorId?: string;
  qrCode?: string;
  secret?: string;
};

const statusSchema = z.enum(["draft", "published"]);
const contentTypeSchema = z.enum(["therapy", "course"]);
const blockTypeSchema = z.enum(["paragraph", "heading", "image"]);
const webUrlSchema = z.string().url().refine((value) => /^https?:\/\//.test(value), "La URL debe usar HTTP o HTTPS.");
const internalOrWebUrlSchema = z.string().min(1).refine(
  (value) => value.startsWith("/") || webUrlSchema.safeParse(value).success,
  "Ingresá una ruta interna o una URL HTTP/HTTPS.",
);
const analyticsIdSchema = z.string().regex(/^G-[A-Z0-9]+$/).nullable();

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableFormString(formData: FormData, key: string) {
  const value = formString(formData, key);
  return value.length > 0 ? value : null;
}

function formInteger(formData: FormData, key: string) {
  const value = Number.parseInt(formString(formData, key), 10);
  return Number.isFinite(value) ? value : 0;
}

function optionalUuid(formData: FormData, key = "id") {
  const value = formString(formData, key);
  return value.length > 0 ? z.string().uuid().parse(value) : null;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/terapias");
  revalidatePath("/cursos");
  revalidatePath("/testimonios");
  revalidatePath("/sobre-mi");
  revalidatePath("/contacto");
  revalidatePath("/terapias/[slug]", "page");
  revalidatePath("/cursos/[slug]", "page");
}

function safeMessage(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo completar la acción.";
}

export async function loginAdminAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = formString(formData, "email");
  const password = formString(formData, "password");

  const parsed = z.object({ email: z.string().email(), password: z.string().min(8) }).safeParse({
    email,
    password,
  });

  if (!parsed.success) {
    return { error: "Ingresá email y contraseña válidos." };
  }

  const supabase = await requireSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "Credenciales inválidas." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single<{ role: string }>();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Este usuario no tiene permisos de administrador." };
  }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
    redirect("/admin/mfa/challenge");
  }

  if (aal?.nextLevel !== "aal2") {
    redirect("/admin/mfa/enroll");
  }

  redirect("/admin");
}

export async function signOutAdminAction() {
  const supabase = await requireSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function startMfaEnrollmentAction(state: MfaEnrollState, formData: FormData): Promise<MfaEnrollState> {
  void state;
  void formData;

  const { supabase } = await requireAdmin({ requireMfa: false });
  const { data: factors } = await supabase.auth.mfa.listFactors();

  for (const factor of factors?.all ?? []) {
    if (factor.factor_type === "totp" && factor.status === "unverified") {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Serenella admin",
    issuer: "SerenellaCoaching",
  });

  if (error) {
    return { error: error.message };
  }

  return {
    factorId: data.id,
    qrCode: `data:image/svg+xml;utf-8,${encodeURIComponent(data.totp.qr_code)}`,
    secret: data.totp.secret,
    message: "Escaneá el QR y verificá el código para activar MFA.",
  };
}

export async function verifyMfaEnrollmentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin({ requireMfa: false });
  const factorId = z.string().uuid().safeParse(formString(formData, "factorId"));
  const code = z.string().regex(/^\d{6}$/).safeParse(formString(formData, "code"));

  if (!factorId.success || !code.success) {
    return { error: "Ingresá el código de 6 dígitos." };
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: factorId.data,
    code: code.data,
  });

  if (error) {
    return { error: "No se pudo verificar el código MFA." };
  }

  redirect("/admin");
}

export async function verifyMfaChallengeAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin({ requireMfa: false });
  const code = z.string().regex(/^\d{6}$/).safeParse(formString(formData, "code"));

  if (!code.success) {
    return { error: "Ingresá el código de 6 dígitos." };
  }

  const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp[0];

  if (factorError || !factor) {
    redirect("/admin/mfa/enroll");
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: factor.id,
    code: code.data,
  });

  if (error) {
    return { error: "No se pudo verificar el código MFA." };
  }

  redirect("/admin");
}

export async function updateSiteSettingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = z
    .object({
      id: z.literal(true),
      name: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      analytics_id: analyticsIdSchema,
      metadata_base: webUrlSchema,
      logo_url: internalOrWebUrlSchema,
      favicon_url: internalOrWebUrlSchema,
    })
    .parse({
      id: true,
      name: formString(formData, "name"),
      title: formString(formData, "title"),
      description: formString(formData, "description"),
      analytics_id: nullableFormString(formData, "analytics_id"),
      metadata_base: formString(formData, "metadata_base"),
      logo_url: formString(formData, "logo_url"),
      favicon_url: formString(formData, "favicon_url"),
    });

  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function updateContactSettingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = z
    .object({
      id: z.literal(true),
      email: z.string().email(),
      phone: z.string().min(1),
      address: z.string().min(1),
      map_embed_url: webUrlSchema,
      form_url: webUrlSchema,
    })
    .parse({
      id: true,
      email: formString(formData, "email"),
      phone: formString(formData, "phone"),
      address: formString(formData, "address"),
      map_embed_url: formString(formData, "map_embed_url"),
      form_url: formString(formData, "form_url"),
    });

  const { error } = await supabase.from("contact_settings").upsert(payload);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertNavigationItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalUuid(formData);
  const payload = {
    label: z.string().min(1).parse(formString(formData, "label")),
    href: internalOrWebUrlSchema.parse(formString(formData, "href")),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
    sort_order: formInteger(formData, "sort_order"),
  };
  const query = id ? supabase.from("navigation_items").update(payload).eq("id", id) : supabase.from("navigation_items").insert(payload);
  const { error } = await query;
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteNavigationItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertSocialLinkAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalUuid(formData);
  const payload = {
    label: z.string().min(1).parse(formString(formData, "label")),
    href: webUrlSchema.parse(formString(formData, "href")),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
    sort_order: formInteger(formData, "sort_order"),
  };
  const query = id ? supabase.from("social_links").update(payload).eq("id", id) : supabase.from("social_links").insert(payload);
  const { error } = await query;
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteSocialLinkAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertContentItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalUuid(formData);
  const title = z.string().min(1).parse(formString(formData, "title"));
  const slug = formString(formData, "slug") || slugify(title);
  const payload = {
    type: contentTypeSchema.parse(formString(formData, "type")),
    slug: z.string().min(1).parse(slug),
    title,
    summary: z.string().min(1).parse(formString(formData, "summary")),
    meta: nullableFormString(formData, "meta"),
    image_url: z.string().min(1).parse(formString(formData, "image_url")),
    image_alt: z.string().min(1).parse(formString(formData, "image_alt")),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
    sort_order: formInteger(formData, "sort_order"),
    seo_title: nullableFormString(formData, "seo_title"),
    seo_description: nullableFormString(formData, "seo_description"),
  };
  const query = id ? supabase.from("content_items").update(payload).eq("id", id) : supabase.from("content_items").insert(payload);
  const { error } = await query;
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteContentItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertContentBlockAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalUuid(formData);
  const payload = {
    item_id: z.string().uuid().parse(formString(formData, "item_id")),
    block_type: blockTypeSchema.parse(formString(formData, "block_type")),
    content: formString(formData, "content"),
    image_url: nullableFormString(formData, "image_url"),
    image_alt: nullableFormString(formData, "image_alt"),
    sort_order: formInteger(formData, "sort_order"),
  };
  const query = id ? supabase.from("content_blocks").update(payload).eq("id", id) : supabase.from("content_blocks").insert(payload);
  const { error } = await query;
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteContentBlockAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const { error } = await supabase.from("content_blocks").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertReviewAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalUuid(formData);
  const payload = {
    reviewer_name: z.string().min(1).parse(formString(formData, "reviewer_name")),
    quote: z.string().min(1).parse(formString(formData, "quote")),
    image_url: z.string().min(1).parse(formString(formData, "image_url")),
    image_alt: z.string().min(1).parse(formString(formData, "image_alt")),
    source: nullableFormString(formData, "source"),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
    sort_order: formInteger(formData, "sort_order"),
  };
  const query = id ? supabase.from("reviews").update(payload).eq("id", id) : supabase.from("reviews").insert(payload);
  const { error } = await query;
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteReviewAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertFaqAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalUuid(formData);
  const payload = {
    question: z.string().min(1).parse(formString(formData, "question")),
    answer: z.string().min(1).parse(formString(formData, "answer")),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
    sort_order: formInteger(formData, "sort_order"),
  };
  const query = id ? supabase.from("faq_items").update(payload).eq("id", id) : supabase.from("faq_items").insert(payload);
  const { error } = await query;
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteFaqAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function upsertPageSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const payload = {
    eyebrow: nullableFormString(formData, "eyebrow"),
    title: nullableFormString(formData, "title"),
    accent: nullableFormString(formData, "accent"),
    body: nullableFormString(formData, "body"),
    image_url: nullableFormString(formData, "image_url"),
    image_alt: nullableFormString(formData, "image_alt"),
    cta_label: nullableFormString(formData, "cta_label"),
    cta_href: nullableFormString(formData, "cta_href"),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
    sort_order: formInteger(formData, "sort_order"),
  };
  const { error } = await supabase.from("page_sections").update(payload).eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function uploadMediaAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Seleccioná una imagen.");
  }

  const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("El formato de imagen no está permitido.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("La imagen no puede superar los 10 MB.");
  }

  const title = nullableFormString(formData, "title") ?? file.name;
  const alt = formString(formData, "alt");
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${slugify(baseName)}.${extension}`;

  const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
    contentType: file.type,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  const { error } = await supabase.from("media_assets").insert({
    bucket: "site-media",
    path,
    public_url: data.publicUrl,
    title,
    alt,
    status: statusSchema.parse(formString(formData, "status") || "published"),
    created_by: user.id,
  });

  if (error) throw error;
  revalidatePublicPaths();
}

export async function updateMediaAssetAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const payload = {
    title: nullableFormString(formData, "title"),
    alt: formString(formData, "alt"),
    status: statusSchema.parse(formString(formData, "status") || "draft"),
  };
  const { error } = await supabase.from("media_assets").update(payload).eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function deleteMediaAssetAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formString(formData, "id"));
  const path = z.string().min(1).parse(formString(formData, "path"));

  const { error: storageError } = await supabase.storage.from("site-media").remove([path]);
  if (storageError) throw storageError;

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw error;
  revalidatePublicPaths();
}

export async function runAdminAction(action: () => Promise<void>): Promise<ActionState> {
  try {
    await action();
    return { message: "Cambios guardados." };
  } catch (error) {
    return { error: safeMessage(error) };
  }
}
