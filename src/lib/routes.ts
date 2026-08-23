export const routes = {
  home: "/",
  homeSection: (id: string) => `/#${id}`,
  therapies: "/terapias",
  therapy: (slug: string) => `/terapias/${slug}`,
  courses: "/cursos",
  course: (slug: string) => `/cursos/${slug}`,
  testimonials: "/testimonios",
  about: "/sobre-mi",
  contact: "/contacto",
} as const;
