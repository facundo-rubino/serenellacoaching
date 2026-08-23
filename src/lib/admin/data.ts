import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminContentBlockRow,
  AdminContentItemRow,
  AdminDashboardData,
  AdminPageRow,
  AdminPageSectionRow,
} from "./types";

export async function getAdminDashboardData(supabase: SupabaseClient): Promise<AdminDashboardData> {
  const [
    siteResult,
    contactResult,
    navigationResult,
    socialResult,
    contentResult,
    blockResult,
    reviewResult,
    faqResult,
    pageResult,
    sectionResult,
    mediaResult,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("contact_settings").select("*").single(),
    supabase.from("navigation_items").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("content_items").select("*").order("type").order("sort_order"),
    supabase.from("content_blocks").select("*").order("sort_order"),
    supabase.from("reviews").select("*").order("sort_order"),
    supabase.from("faq_items").select("*").order("sort_order"),
    supabase.from("pages").select("*").order("slug"),
    supabase.from("page_sections").select("*").order("sort_order"),
    supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(24),
  ]);

  if (
    siteResult.error ||
    contactResult.error ||
    navigationResult.error ||
    socialResult.error ||
    contentResult.error ||
    blockResult.error ||
    reviewResult.error ||
    faqResult.error ||
    pageResult.error ||
    sectionResult.error ||
    mediaResult.error
  ) {
    throw new Error("No se pudo cargar el dashboard administrativo.");
  }

  const blocksByItem = new Map<string, AdminContentBlockRow[]>();
  ((blockResult.data ?? []) as AdminContentBlockRow[]).forEach((block) => {
    const blocks = blocksByItem.get(block.item_id) ?? [];
    blocks.push(block);
    blocksByItem.set(block.item_id, blocks);
  });

  const sectionsByPage = new Map<string, AdminPageSectionRow[]>();
  ((sectionResult.data ?? []) as AdminPageSectionRow[]).forEach((section) => {
    const sections = sectionsByPage.get(section.page_id) ?? [];
    sections.push(section);
    sectionsByPage.set(section.page_id, sections);
  });

  return {
    site: siteResult.data,
    contact: contactResult.data,
    navigation: navigationResult.data ?? [],
    socialLinks: socialResult.data ?? [],
    contentItems: ((contentResult.data ?? []) as Omit<AdminContentItemRow, "blocks">[]).map((item) => ({
      ...item,
      blocks: blocksByItem.get(item.id) ?? [],
    })),
    reviews: reviewResult.data ?? [],
    faqItems: faqResult.data ?? [],
    pages: ((pageResult.data ?? []) as Omit<AdminPageRow, "sections">[]).map((page) => ({
      ...page,
      sections: sectionsByPage.get(page.id) ?? [],
    })),
    mediaAssets: mediaResult.data ?? [],
  };
}
