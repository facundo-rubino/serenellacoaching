import {
  about as staticAbout,
  contactInfo as staticContactInfo,
  courses as staticCourses,
  faqItems as staticFaqItems,
  navigation as staticNavigation,
  site as staticSite,
  testimonials as staticTestimonials,
  therapies as staticTherapies,
} from "@/data/content";
import { routes } from "@/lib/routes";
import type { ContentCard, PageContent, PublicContent } from "./types";

function withBlocks(items: Array<Omit<ContentCard, "blocks" | "status">>): ContentCard[] {
  return items.map((item) => ({
    ...item,
    blocks: item.description.map((content) => ({ type: "paragraph", content })),
    status: "published",
  }));
}

const homePage: PageContent = {
  title: "Inicio",
  seoTitle: staticSite.title,
  seoDescription: staticSite.description,
  sections: {
    hero: {
      title: "Encontrá tu",
      accent: "mejor versión",
      body: "Mindfulness - Gestión emocional",
      image: "/assets/img/hero-bg.jpg",
      imageAlt: "",
      ctaLabel: "Sobre mi",
      ctaHref: routes.homeSection("sobre-mi"),
      status: "published",
    },
    therapies_heading: {
      eyebrow: "Terapias",
      title: "Estas son nuestras",
      accent: "terapias",
      status: "published",
    },
    testimonials_heading: {
      eyebrow: "Testimonios",
      title: "Experiencias",
      accent: "reales",
      status: "published",
    },
    courses_heading: {
      eyebrow: "Cursos",
      title: "Nuestros cursos",
      accent: "más actuales",
      status: "published",
    },
    about_heading: {
      eyebrow: "Sobre mi",
      title: "Para que me conozcas",
      accent: "un poco más",
      status: "published",
    },
    faq_heading: {
      eyebrow: "F.A.Q",
      title: "Preguntas más",
      accent: "frecuentes",
      status: "published",
    },
    contact_heading: {
      eyebrow: "Contacto",
      title: "¡Contactame!",
      status: "published",
    },
  },
};

export const fallbackContent: PublicContent = {
  site: {
    ...staticSite,
    analyticsId: staticSite.analyticsId,
    metadataBase: "https://serenellacoaching.com",
    logoUrl: "/assets/img/logo.png",
    faviconUrl: "/assets/img/favicon.ico",
  },
  navigation: staticNavigation.map((item) => ({ ...item, status: "published" })),
  contactInfo: {
    ...staticContactInfo,
    socialLinks: staticContactInfo.socialLinks.map((link) => ({ ...link, status: "published" })),
  },
  therapies: withBlocks(staticTherapies),
  courses: withBlocks(staticCourses),
  testimonials: staticTestimonials.map((item) => ({ ...item, status: "published" })),
  about: staticAbout,
  faqItems: staticFaqItems.map((item) => ({ ...item, status: "published" })),
  pages: {
    home: homePage,
    therapies: {
      title: "Terapias",
      seoTitle: "Terapias",
      seoDescription: "Terapias de SerenellaCoaching para mindfulness, energía, coaching y bienestar.",
      sections: {
        listing_hero: {
          eyebrow: "Terapias",
          title: "Todas las",
          accent: "terapias",
          body: "Un punto de partida para ampliar cada propuesta con más detalle cuando el contenido específico esté listo.",
          status: "published",
        },
      },
    },
    courses: {
      title: "Cursos",
      seoTitle: "Cursos",
      seoDescription: "Cursos de mindfulness y gestión emocional de SerenellaCoaching.",
      sections: {
        listing_hero: {
          eyebrow: "Cursos",
          title: "Formaciones",
          accent: "disponibles",
          body: "Cursos actuales y estructura preparada para ampliar cada formación con programa, fechas y modalidad.",
          status: "published",
        },
      },
    },
    testimonials: {
      title: "Testimonios",
      seoTitle: "Testimonios",
      seoDescription: "Experiencias de personas que trabajaron con SerenellaCoaching.",
      sections: {
        listing_hero: {
          eyebrow: "Testimonios",
          title: "Experiencias",
          accent: "reales",
          body: "Historias y devoluciones de personas que transitaron procesos de acompañamiento.",
          status: "published",
        },
      },
    },
    about: {
      title: "Sobre mi",
      seoTitle: "Sobre mi",
      seoDescription: "Conocé a Serenella y su recorrido en mindfulness, coaching y gestión emocional.",
      sections: {
        main: {
          eyebrow: "Sobre mi",
          title: "Hola! Me llamo",
          accent: "Serenella",
          body: staticAbout.paragraphs.join("\n"),
          image: staticAbout.image,
          imageAlt: staticAbout.imageAlt,
          ctaLabel: "Conocer más",
          ctaHref: routes.about,
          status: "published",
        },
      },
    },
    contact: {
      title: "Contacto",
      seoTitle: "Contacto",
      seoDescription: "Contacto de SerenellaCoaching en Montevideo.",
      sections: {
        listing_hero: {
          eyebrow: "Contacto",
          title: "Coordinemos",
          accent: "un encuentro",
          body: "Escribime o completá el formulario para conversar sobre tus intereses.",
          status: "published",
        },
      },
    },
  },
};
