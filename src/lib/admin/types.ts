export type AdminProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "owner" | "admin" | "editor" | "user";
};

export type SiteSettingsRow = {
  name: string;
  title: string;
  description: string;
  analytics_id: string | null;
  metadata_base: string;
  logo_url: string;
  favicon_url: string;
};

export type ContactSettingsRow = {
  email: string;
  phone: string;
  address: string;
  map_embed_url: string;
  form_url: string;
};

export type AdminLinkRow = {
  id: string;
  label: string;
  href: string;
  status: "draft" | "published";
  sort_order: number;
};

export type AdminContentBlockRow = {
  id: string;
  item_id: string;
  block_type: "paragraph" | "heading" | "image";
  content: string;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
};

export type AdminContentItemRow = {
  id: string;
  type: "therapy" | "course";
  slug: string;
  title: string;
  summary: string;
  meta: string | null;
  image_url: string;
  image_alt: string;
  status: "draft" | "published";
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  blocks: AdminContentBlockRow[];
};

export type AdminFaqRow = {
  id: string;
  question: string;
  answer: string;
  status: "draft" | "published";
  sort_order: number;
};

export type AdminPageSectionRow = {
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
  sort_order: number;
};

export type AdminPageRow = {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  sections: AdminPageSectionRow[];
};

export type AdminMediaAssetRow = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  alt: string;
  title: string | null;
  status: "draft" | "published";
  created_at: string;
};

export type AdminSiteData = {
  contact: ContactSettingsRow | null;
  contentItems: AdminContentItemRow[];
  faqItems: AdminFaqRow[];
};

export type AdminAdvancedData = {
  site: SiteSettingsRow | null;
  navigation: AdminLinkRow[];
  socialLinks: AdminLinkRow[];
  pages: AdminPageRow[];
  mediaAssets: AdminMediaAssetRow[];
};

export const referralSources = [
  { value: "recomendacion", label: "Recomendación" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "sitio_web", label: "Sitio web" },
  { value: "otro", label: "Otro" },
] as const;

export type ClientRow = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  area: string | null;
  country: string | null;
  birth_date: string | null;
  referral_source: (typeof referralSources)[number]["value"] | null;
  referred_by: string | null;
  first_visit_date: string | null;
  consent_at: string | null;
  notes: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};
