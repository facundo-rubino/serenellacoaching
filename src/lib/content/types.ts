export type ContentStatus = "draft" | "published";

export type ContentBlockType = "paragraph" | "heading" | "image";

export type ContentBlock = {
  id?: string;
  type: ContentBlockType;
  content: string;
  image?: string;
  imageAlt?: string;
};

export type ContentCard = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  blocks: ContentBlock[];
  image: string;
  imageAlt: string;
  href: string;
  meta?: string;
  status?: ContentStatus;
};

export type Testimonial = {
  id?: string;
  name: string;
  quote: string;
  image: string;
  imageAlt: string;
  status?: ContentStatus;
};

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
  status?: ContentStatus;
};

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  formUrl: string;
  socialLinks: Array<{
    id?: string;
    label: string;
    href: string;
    status?: ContentStatus;
  }>;
};

export type SiteInfo = {
  name: string;
  title: string;
  description: string;
  analyticsId?: string;
  metadataBase: string;
  logoUrl: string;
  faviconUrl: string;
};

export type NavigationItem = {
  id?: string;
  label: string;
  href: string;
  status?: ContentStatus;
};

export type PageSection = {
  id?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  status?: ContentStatus;
};

export type PageContent = {
  id?: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: Record<string, PageSection>;
};

export type AboutContent = {
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

export type PublicContent = {
  site: SiteInfo;
  navigation: NavigationItem[];
  contactInfo: ContactInfo;
  therapies: ContentCard[];
  courses: ContentCard[];
  testimonials: Testimonial[];
  about: AboutContent;
  faqItems: FaqItem[];
  pages: Record<"home" | "therapies" | "courses" | "testimonials" | "about" | "contact", PageContent>;
};
