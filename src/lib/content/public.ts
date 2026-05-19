import "server-only";

import { routes } from "@/lib/routes";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { fallbackContent } from "./fallback";
import type {
  AboutContent,
  ContactInfo,
  ContentBlock,
  ContentCard,
  NavigationItem,
  PageSection,
  PublicContent,
  SiteInfo,
  Testimonial,
} from "./types";

type SiteRow = {
  name: string;
  title: string;
  description: string;
  analytics_id: string | null;
  metadata_base: string | null;
  logo_url: string | null;
  favicon_url: string | null;
};

type ContactRow = {
  email: string;
  phone: string;
  address: string;
  map_embed_url: string;
  form_url: string;
};

type LinkRow = {
  id: string;
  label: string;
  href: string;
  status?: "draft" | "published";
};

type ContentItemRow = {
  id: string;
  type: "therapy" | "course";
  slug: string;
  title: string;
  summary: string;
  meta: string | null;
  image_url: string;
  image_alt: string;
  status: "draft" | "published";
};

type ContentBlockRow = {
  id: string;
  item_id: string;
  block_type: "paragraph" | "heading" | "image";
  content: string;
  image_url: string | null;
  image_alt: string | null;
};

type ReviewRow = {
  id: string;
  reviewer_name: string;
  quote: string;
  image_url: string;
  image_alt: string;
  status: "draft" | "published";
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  status: "draft" | "published";
};

type PageRow = {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
};

type PageSectionRow = {
  id: string;
  page_id: string;
  section_key: string;
  eyebrow: string | null;
  title: string | null;
  accent: string | null;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  cta_label: string | null;
  cta_href: string | null;
  status: "draft" | "published";
};

function routeForContent(type: ContentItemRow["type"], slug: string) {
  return type === "therapy" ? routes.therapy(slug) : routes.course(slug);
}

function mapBlocks(rows: ContentBlockRow[]): ContentBlock[] {
  return rows.map((row) => ({
    id: row.id,
    type: row.block_type,
    content: row.content,
    image: row.image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
  }));
}

function mapContentItems(items: ContentItemRow[], blocks: ContentBlockRow[], type: "therapy" | "course") {
  const blocksByItem = new Map<string, ContentBlockRow[]>();

  blocks.forEach((block) => {
    const list = blocksByItem.get(block.item_id) ?? [];
    list.push(block);
    blocksByItem.set(block.item_id, list);
  });

  return items
    .filter((item) => item.type === type)
    .map<ContentCard>((item) => {
      const itemBlocks = mapBlocks(blocksByItem.get(item.id) ?? []);
      const description = itemBlocks
        .filter((block) => block.type !== "image" && block.content.trim().length > 0)
        .map((block) => block.content);

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        description: description.length > 0 ? description : [item.summary],
        blocks: itemBlocks,
        image: item.image_url,
        imageAlt: item.image_alt,
        href: routeForContent(item.type, item.slug),
        meta: item.meta ?? undefined,
        status: item.status,
      };
    });
}

function mapPages(pages: PageRow[], sections: PageSectionRow[]): PublicContent["pages"] {
  const sectionsByPage = new Map<string, Record<string, PageSection>>();

  sections.forEach((section) => {
    const pageSections = sectionsByPage.get(section.page_id) ?? {};
    pageSections[section.section_key] = {
      id: section.id,
      eyebrow: section.eyebrow ?? undefined,
      title: section.title ?? undefined,
      accent: section.accent ?? undefined,
      body: section.body ?? undefined,
      image: section.image_url ?? undefined,
      imageAlt: section.image_alt ?? undefined,
      ctaLabel: section.cta_label ?? undefined,
      ctaHref: section.cta_href ?? undefined,
      status: section.status,
    };
    sectionsByPage.set(section.page_id, pageSections);
  });

  const mergedPages = { ...fallbackContent.pages };

  pages.forEach((page) => {
    const key = page.slug as keyof PublicContent["pages"];

    if (!(key in mergedPages)) {
      return;
    }

    const fallbackPage = mergedPages[key];
    mergedPages[key] = {
      id: page.id,
      title: page.title,
      seoTitle: page.seo_title ?? fallbackPage.seoTitle,
      seoDescription: page.seo_description ?? fallbackPage.seoDescription,
      sections: {
        ...fallbackPage.sections,
        ...(sectionsByPage.get(page.id) ?? {}),
      },
    };
  });

  return mergedPages;
}

function aboutFromPage(section: PageSection): AboutContent {
  const body = section.body ?? fallbackContent.about.paragraphs.join("\n");

  return {
    title: [section.title, section.accent].filter(Boolean).join(" ") || fallbackContent.about.title,
    image: section.image ?? fallbackContent.about.image,
    imageAlt: section.imageAlt ?? fallbackContent.about.imageAlt,
    paragraphs: body
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

export async function getPublicContent(): Promise<PublicContent> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return fallbackContent;
  }

  try {
    const [
      siteResult,
      navigationResult,
      contactResult,
      socialResult,
      contentResult,
      blockResult,
      reviewResult,
      faqResult,
      pageResult,
      sectionResult,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").single(),
      supabase.from("navigation_items").select("id,label,href,status").eq("status", "published").order("sort_order"),
      supabase.from("contact_settings").select("*").single(),
      supabase.from("social_links").select("id,label,href,status").eq("status", "published").order("sort_order"),
      supabase.from("content_items").select("*").eq("status", "published").order("sort_order"),
      supabase.from("content_blocks").select("*").order("sort_order"),
      supabase.from("reviews").select("*").eq("status", "published").order("sort_order"),
      supabase.from("faq_items").select("*").eq("status", "published").order("sort_order"),
      supabase.from("pages").select("*").eq("status", "published"),
      supabase.from("page_sections").select("*").eq("status", "published").order("sort_order"),
    ]);

    if (
      siteResult.error ||
      navigationResult.error ||
      contactResult.error ||
      socialResult.error ||
      contentResult.error ||
      blockResult.error ||
      reviewResult.error ||
      faqResult.error ||
      pageResult.error ||
      sectionResult.error
    ) {
      return fallbackContent;
    }

    const siteRow = siteResult.data as SiteRow;
    const contactRow = contactResult.data as ContactRow;
    const socialRows = (socialResult.data ?? []) as LinkRow[];
    const contentRows = (contentResult.data ?? []) as ContentItemRow[];
    const blockRows = (blockResult.data ?? []) as ContentBlockRow[];
    const pageRows = (pageResult.data ?? []) as PageRow[];
    const sectionRows = (sectionResult.data ?? []) as PageSectionRow[];
    const pages = mapPages(pageRows, sectionRows);
    const about = aboutFromPage(pages.about.sections.main ?? fallbackContent.pages.about.sections.main);

    const site: SiteInfo = {
      name: siteRow.name,
      title: siteRow.title,
      description: siteRow.description,
      analyticsId: siteRow.analytics_id ?? undefined,
      metadataBase: siteRow.metadata_base ?? fallbackContent.site.metadataBase,
      logoUrl: siteRow.logo_url ?? fallbackContent.site.logoUrl,
      faviconUrl: siteRow.favicon_url ?? fallbackContent.site.faviconUrl,
    };

    const contactInfo: ContactInfo = {
      email: contactRow.email,
      phone: contactRow.phone,
      address: contactRow.address,
      mapEmbedUrl: contactRow.map_embed_url,
      formUrl: contactRow.form_url,
      socialLinks: socialRows.map((row) => ({
        id: row.id,
        label: row.label,
        href: row.href,
        status: row.status,
      })),
    };

    return {
      site,
      navigation: ((navigationResult.data ?? []) as LinkRow[]).map<NavigationItem>((row) => ({
        id: row.id,
        label: row.label,
        href: row.href,
        status: row.status,
      })),
      contactInfo,
      therapies: mapContentItems(contentRows, blockRows, "therapy"),
      courses: mapContentItems(contentRows, blockRows, "course"),
      testimonials: ((reviewResult.data ?? []) as ReviewRow[]).map<Testimonial>((row) => ({
        id: row.id,
        name: row.reviewer_name,
        quote: row.quote,
        image: row.image_url,
        imageAlt: row.image_alt,
        status: row.status,
      })),
      about,
      faqItems: ((faqResult.data ?? []) as FaqRow[]).map((row) => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        status: row.status,
      })),
      pages,
    };
  } catch {
    return fallbackContent;
  }
}

export async function getContentItem(type: "therapy" | "course", slug: string) {
  const content = await getPublicContent();
  const items = type === "therapy" ? content.therapies : content.courses;

  return items.find((item) => item.slug === slug) ?? null;
}
