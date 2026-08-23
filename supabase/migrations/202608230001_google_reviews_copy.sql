update public.navigation_items
set label = 'Reseñas de Google',
    updated_at = now()
where href = '/#testimonios';

update public.pages
set title = 'Reseñas de Google',
    seo_title = 'Reseñas de Google',
    seo_description = 'Reseñas verificadas en Google de personas que trabajaron con SerenellaCoaching.',
    updated_at = now()
where slug = 'testimonials';

update public.page_sections as section
set eyebrow = 'Reseñas',
    title = 'Experiencias',
    accent = 'en Google',
    body = 'Conocé las experiencias compartidas por quienes trabajaron con Serenella.',
    cta_label = 'Ver reseñas de Google',
    cta_href = '/testimonios',
    updated_at = now()
from public.pages as page
where section.page_id = page.id
  and page.slug = 'home'
  and section.section_key = 'testimonials_heading';

update public.page_sections as section
set eyebrow = 'Reseñas verificadas',
    title = 'Reseñas de',
    accent = 'Google',
    body = 'Opiniones verificadas de personas que compartieron su experiencia con SerenellaCoaching.',
    cta_label = 'Ver todas / dejar una reseña en Google',
    updated_at = now()
from public.pages as page
where section.page_id = page.id
  and page.slug = 'testimonials'
  and section.section_key = 'listing_hero';
