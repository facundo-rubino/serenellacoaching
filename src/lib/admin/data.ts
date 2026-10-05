import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminAdvancedData,
  AdminContentBlockRow,
  AdminContentItemRow,
  AdminPageRow,
  AdminPageSectionRow,
  AdminSiteData,
} from "./types";

function groupBy<T>(rows: T[], key: (row: T) => string) {
  const groups = new Map<string, T[]>();
  rows.forEach((row) => {
    const group = groups.get(key(row)) ?? [];
    group.push(row);
    groups.set(key(row), group);
  });
  return groups;
}

export async function getAdminSiteData(supabase: SupabaseClient): Promise<AdminSiteData> {
  const [contactResult, contentResult, blockResult, faqResult] = await Promise.all([
    supabase.from("contact_settings").select("*").single(),
    supabase.from("content_items").select("*").order("type").order("sort_order"),
    supabase.from("content_blocks").select("*").order("sort_order"),
    supabase.from("faq_items").select("*").order("sort_order"),
  ]);

  if (contactResult.error || contentResult.error || blockResult.error || faqResult.error) {
    throw new Error("No se pudo cargar el contenido del sitio.");
  }

  const blocksByItem = groupBy((blockResult.data ?? []) as AdminContentBlockRow[], (block) => block.item_id);

  return {
    contact: contactResult.data,
    contentItems: ((contentResult.data ?? []) as Omit<AdminContentItemRow, "blocks">[]).map((item) => ({
      ...item,
      blocks: blocksByItem.get(item.id) ?? [],
    })),
    faqItems: faqResult.data ?? [],
  };
}

export async function getAdminAdvancedData(supabase: SupabaseClient): Promise<AdminAdvancedData> {
  const [siteResult, navigationResult, socialResult, pageResult, sectionResult, mediaResult] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("navigation_items").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("pages").select("*").order("slug"),
    supabase.from("page_sections").select("*").order("sort_order"),
    supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(24),
  ]);

  if (siteResult.error || navigationResult.error || socialResult.error || pageResult.error || sectionResult.error || mediaResult.error) {
    throw new Error("No se pudo cargar la configuración avanzada.");
  }

  const sectionsByPage = groupBy((sectionResult.data ?? []) as AdminPageSectionRow[], (section) => section.page_id);

  return {
    site: siteResult.data,
    navigation: navigationResult.data ?? [],
    socialLinks: socialResult.data ?? [],
    pages: ((pageResult.data ?? []) as Omit<AdminPageRow, "sections">[]).map((page) => ({
      ...page,
      sections: sectionsByPage.get(page.id) ?? [],
    })),
    mediaAssets: mediaResult.data ?? [],
  };
}
