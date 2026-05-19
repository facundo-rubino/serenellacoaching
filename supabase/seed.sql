insert into public.site_settings (
  id,
  name,
  title,
  description,
  analytics_id,
  metadata_base,
  logo_url,
  favicon_url
)
values (
  true,
  'SerenellaCoaching',
  'SerenellaCoaching | Mindfulness y gestión emocional',
  'Acompañamiento en mindfulness, gestión emocional, terapias energéticas y cursos para encontrar tu mejor versión.',
  'G-SLMJ6ZH9SJ',
  'https://serenellacoaching.com',
  '/assets/img/logo.png',
  '/assets/img/favicon.ico'
)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  description = excluded.description,
  analytics_id = excluded.analytics_id,
  metadata_base = excluded.metadata_base,
  logo_url = excluded.logo_url,
  favicon_url = excluded.favicon_url,
  updated_at = now();

insert into public.contact_settings (
  id,
  email,
  phone,
  address,
  map_embed_url,
  form_url
)
values (
  true,
  'sereosho@gmail.com',
  '+598 99 210299',
  'Parque Posadas, Montevideo',
  'https://maps.google.com/maps?q=parque%20posadas&t=&z=13&ie=UTF8&iwloc=&output=embed',
  'https://docs.google.com/forms/d/e/1FAIpQLSdY-kC30ZfiPspI5lpglbB3f53SpS6VQi6egLRFu42xXVUoXg/viewform'
)
on conflict (id) do update set
  email = excluded.email,
  phone = excluded.phone,
  address = excluded.address,
  map_embed_url = excluded.map_embed_url,
  form_url = excluded.form_url,
  updated_at = now();

delete from public.navigation_items;
insert into public.navigation_items (label, href, status, sort_order)
values
  ('Inicio', '/#inicio', 'published', 1),
  ('Terapias', '/#terapias', 'published', 2),
  ('Testimonios', '/#testimonios', 'published', 3),
  ('Cursos', '/#cursos', 'published', 4),
  ('Sobre mi', '/#sobre-mi', 'published', 5),
  ('Contacto', '/#contacto', 'published', 6);

delete from public.social_links;
insert into public.social_links (label, href, status, sort_order)
values
  ('Facebook', 'https://www.facebook.com/sereosho.sereosho', 'published', 1),
  ('Instagram', 'https://www.instagram.com/serenellacoaching/', 'published', 2),
  ('LinkedIn', 'https://www.linkedin.com/in/serenelladangelo/', 'published', 3);

delete from public.page_sections;
delete from public.pages;

insert into public.pages (slug, title, seo_title, seo_description, status)
values
  ('home', 'Inicio', 'SerenellaCoaching | Mindfulness y gestión emocional', 'Acompañamiento en mindfulness, gestión emocional, terapias energéticas y cursos para encontrar tu mejor versión.', 'published'),
  ('therapies', 'Terapias', 'Terapias', 'Terapias de SerenellaCoaching para mindfulness, energía, coaching y bienestar.', 'published'),
  ('courses', 'Cursos', 'Cursos', 'Cursos de mindfulness y gestión emocional de SerenellaCoaching.', 'published'),
  ('testimonials', 'Testimonios', 'Testimonios', 'Experiencias de personas que trabajaron con SerenellaCoaching.', 'published'),
  ('about', 'Sobre mi', 'Sobre mi', 'Conocé a Serenella y su recorrido en mindfulness, coaching y gestión emocional.', 'published'),
  ('contact', 'Contacto', 'Contacto', 'Contacto de SerenellaCoaching en Montevideo.', 'published')
on conflict (slug) do update set
  title = excluded.title,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  updated_at = now();

insert into public.page_sections (
  page_id,
  section_key,
  eyebrow,
  title,
  accent,
  body,
  image_url,
  image_alt,
  cta_label,
  cta_href,
  settings,
  status,
  sort_order
)
select p.id, s.section_key, s.eyebrow, s.title, s.accent, s.body, s.image_url, s.image_alt, s.cta_label, s.cta_href, s.settings::jsonb, s.status, s.sort_order
from (
  values
    ('home', 'hero', null, 'Encontrá tu', 'mejor versión', 'Mindfulness - Gestión emocional', '/assets/img/hero-bg.jpg', '', 'Sobre mi', '/#sobre-mi', '{}', 'published', 1),
    ('home', 'therapies_heading', 'Terapias', 'Estas son nuestras', 'terapias', null, null, null, null, null, '{}', 'published', 2),
    ('home', 'testimonials_heading', 'Testimonios', 'Experiencias', 'reales', null, null, null, null, null, '{}', 'published', 3),
    ('home', 'courses_heading', 'Cursos', 'Nuestros cursos', 'más actuales', null, null, null, null, null, '{}', 'published', 4),
    ('home', 'about_heading', 'Sobre mi', 'Para que me conozcas', 'un poco más', null, null, null, null, null, '{}', 'published', 5),
    ('home', 'faq_heading', 'F.A.Q', 'Preguntas más', 'frecuentes', null, null, null, null, null, '{}', 'published', 6),
    ('home', 'contact_heading', 'Contacto', '¡Contactame!', null, null, null, null, null, null, '{}', 'published', 7),
    ('therapies', 'listing_hero', 'Terapias', 'Todas las', 'terapias', 'Un punto de partida para ampliar cada propuesta con más detalle cuando el contenido específico esté listo.', null, null, null, null, '{}', 'published', 1),
    ('courses', 'listing_hero', 'Cursos', 'Formaciones', 'disponibles', 'Cursos actuales y estructura preparada para ampliar cada formación con programa, fechas y modalidad.', null, null, null, null, '{}', 'published', 1),
    ('testimonials', 'listing_hero', 'Testimonios', 'Experiencias', 'reales', 'Historias y devoluciones de personas que transitaron procesos de acompañamiento.', null, null, null, null, '{}', 'published', 1),
    ('about', 'main', 'Sobre mi', 'Hola! Me llamo', 'Serenella', $$Soy un ser en continuo auto descubrimiento y expansión. Comencé con prácticas de meditaciones activas y pasivas desde 2004 que cambiaron mi vida, transformándose en un fluir con la existencia, en un hacerse consciente del movimiento y la calma disfrutando de cada estado que transitamos.
Comencé mi carrera en Alta Performance con el Instructorado en G.R.C (Gimnasia, Respiración y Consciencia) utilizando ejercicios de aeróbica, Pilates, Yoga, Tai Chi y Chi Kung, poniendo vital importancia en los movimientos y cómo el cuerpo responde a la mente y a la emoción. Más tarde, continué con Trascender en la Certificación como Coach Evolutivo, Coach Ontológico y Coach en Programación Neuro-Lingüístico (2010) dando espacio al entendimiento desde la lógica y lo mental.
En el Centro Superior de Estudios Universitarios LA SALLE me fue otorgado el Título Superior Universitario en Mindfulness y Gestión Emocional (2020), que abrió mi capacidad de entendimiento a la unidad, en la estructura que presenta Jon Kabat Zinn.
La vocación de transmitir al mundo la posibilidad de ver la vida a colores, que sea tan disfrutable el negro como el blanco, que las dualidades se unifiquen en la observación de la unidad que somos me mueve a seguir aprendiendo, compartiendo y sintiendo que la vida tiene mucho más para mí, mucho más para ti y mucho más para nosotros.
Si quieres trabajar conmigo, fluiremos juntos en esa dirección.$$, '/assets/img/about.jpeg', 'Retrato de Serenella', 'Conocer más', '/sobre-mi', '{}', 'published', 1),
    ('contact', 'listing_hero', 'Contacto', 'Coordinemos', 'un encuentro', 'Escribime o completá el formulario para conversar sobre tus intereses.', null, null, null, null, '{}', 'published', 1)
) as s(page_slug, section_key, eyebrow, title, accent, body, image_url, image_alt, cta_label, cta_href, settings, status, sort_order)
join public.pages p on p.slug = s.page_slug
on conflict (page_id, section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent = excluded.accent,
  body = excluded.body,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  settings = excluded.settings,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

delete from public.content_blocks;
delete from public.content_items;

insert into public.content_items (
  type,
  slug,
  title,
  summary,
  meta,
  image_url,
  image_alt,
  status,
  sort_order,
  seo_title,
  seo_description
)
values
  ('therapy', 'cirugia-astral', 'Cirugía astral', 'Eliminando bloqueos emocionales, mentales y físicos.', null, '/assets/img/terapias/astral.jpeg', 'Cirugía astral', 'published', 1, 'Cirugía astral', 'Eliminando bloqueos emocionales, mentales y físicos.'),
  ('therapy', 'mindfulness-individual', 'Mindfulness - Entrenamiento Individual', 'Atención plena en sesiones de 60 a 90 minutos.', '60 a 90 minutos', '/assets/img/terapias/individual.jpg', 'Terapia individual de mindfulness', 'published', 2, 'Mindfulness - Entrenamiento Individual', 'Atención plena en sesiones de 60 a 90 minutos.'),
  ('therapy', 'mindfulness-grupal', 'Mindfulness - Entrenamiento Grupal', 'Atención plena en sesiones de 60 a 120 minutos.', '60 a 120 minutos', '/assets/img/terapias/grupal.jpg', 'Entrenamiento grupal de mindfulness', 'published', 3, 'Mindfulness - Entrenamiento Grupal', 'Atención plena en sesiones de 60 a 120 minutos.'),
  ('therapy', 'coach-ontologico', 'Coach ontológico', 'Búsqueda interior y despertar de la consciencia.', null, '/assets/img/terapias/coach.jpg', 'Sesión de coaching ontológico', 'published', 4, 'Coach ontológico', 'Búsqueda interior y despertar de la consciencia.'),
  ('therapy', 'masaje-tui-na', 'Masaje tui na', 'Soltar lo que no me pertenece.', null, '/assets/img/terapias/masaje.jpg', 'Masaje tui na', 'published', 5, 'Masaje tui na', 'Soltar lo que no me pertenece.'),
  ('therapy', 'reiki', 'Reiki', 'Recibir energía vital universal.', null, '/assets/img/terapias/reiki.jpg', 'Sesión de reiki', 'published', 6, 'Reiki', 'Recibir energía vital universal.'),
  ('therapy', 'medicina-cuantica', 'Medicina cuántica', 'Ser mucho más que un cuerpo físico.', null, '/assets/img/terapias/sanacion.jpg', 'Medicina cuántica y sanación energética', 'published', 7, 'Medicina cuántica', 'Ser mucho más que un cuerpo físico.'),
  ('course', 'mindfulness-estres-ansiedad', 'Curso de mindfulness para reducir el estrés y la ansiedad', 'Programa de 4 semanas para entrenar atención plena y gestión emocional.', '4 semanas', '/assets/img/terapias/curso1.jpg', 'Curso de mindfulness para reducir estrés y ansiedad', 'published', 1, 'Curso de mindfulness para reducir el estrés y la ansiedad', 'Programa de 4 semanas para entrenar atención plena y gestión emocional.'),
  ('course', 'mindfulness-manejo-emocional', 'Curso de mindfulness para el manejo emocional', 'Programa de 8 semanas para fortalecer atención plena y vínculos conscientes.', '8 semanas', '/assets/img/terapias/individual.jpg', 'Curso de mindfulness para manejo emocional', 'published', 2, 'Curso de mindfulness para el manejo emocional', 'Programa de 8 semanas para fortalecer atención plena y vínculos conscientes.'),
  ('course', 'instructorado-mindfulness-gestion-emocional', 'Instructorado mindfulness y gestión emocional', 'Formación de 12 semanas para profundizar práctica, comunicación y acompañamiento.', '12 semanas', '/assets/img/terapias/instructorado.jpg', 'Instructorado mindfulness y gestión emocional', 'published', 3, 'Instructorado mindfulness y gestión emocional', 'Formación de 12 semanas para profundizar práctica, comunicación y acompañamiento.')
on conflict (type, slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  meta = excluded.meta,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  status = excluded.status,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();

insert into public.content_blocks (item_id, block_type, content, image_url, image_alt, sort_order)
select ci.id, b.block_type, b.content, b.image_url, b.image_alt, b.sort_order
from (
  values
    ('therapy', 'cirugia-astral', 'paragraph', $$Es una técnica que nos permite conectar con el campo energético sutil que nos rodea y eliminar cualquier densidad que se haya formado y esté bloqueando el fluir de nuestra energía.$$, null, null, 1),
    ('therapy', 'cirugia-astral', 'paragraph', $$El espacio es llenado con energía vital y sanadora generando una sanación de alto impacto, a nivel mental, emocional y físico. Es una reprogramación a nivel energético, un reiniciar la información recibida del exterior que nos bloquea o impide avanzar.$$, null, null, 2),
    ('therapy', 'mindfulness-individual', 'paragraph', $$Se realizan entrevistas previas para establecer objetivos a corto, medio y largo plazo. La instructora de mindfulness crea un plan de prácticas en equipo y proporciona material adaptado a cada persona.$$, null, null, 1),
    ('therapy', 'mindfulness-individual', 'paragraph', $$En las sesiones individuales se enseñan prácticas y se discuten dificultades. Aprenderás a entender tu mente, reconocer patrones, cambiar creencias limitantes y manejar las señales de estrés.$$, null, null, 2),
    ('therapy', 'mindfulness-grupal', 'paragraph', $$Varias personas realizan prácticas de mindfulness guiadas por un profesional. Las sesiones incluyen diálogos para plantear dudas y compartir experiencias.$$, null, null, 1),
    ('therapy', 'mindfulness-grupal', 'paragraph', $$Se practica la atención plena a la respiración, sensaciones, emociones y pensamientos, así como la bondad amorosa hacia uno mismo y los demás. Estos talleres entrenan la presencia con apertura y amabilidad.$$, null, null, 2),
    ('therapy', 'coach-ontologico', 'paragraph', $$Proceso liberador de las creencias condicionantes que nos limitan. Nos conecta con nuestros recursos y con nuestra capacidad de intervenir, hacernos responsables de cada acción y reacción.$$, null, null, 1),
    ('therapy', 'masaje-tui-na', 'paragraph', $$Despierta la capacidad sanadora del cuerpo y restablece el equilibrio psico-físico-energético.$$, null, null, 1),
    ('therapy', 'masaje-tui-na', 'paragraph', $$Trata dolores musculares y articulares, y es especialmente eficaz en estrés, ansiedad, insomnio y problemas emocionales.$$, null, null, 2),
    ('therapy', 'reiki', 'paragraph', $$Utiliza energía divina y energía vital presente en el entorno para ayudar a equilibrar y fortalecer el campo energético y, por consecuente, todas las áreas de la vida.$$, null, null, 1),
    ('therapy', 'reiki', 'paragraph', $$Lograrás vivir con mayor plenitud.$$, null, null, 2),
    ('therapy', 'medicina-cuantica', 'paragraph', $$La sanación energética armoniza nuestro cuerpo no visible, te da una nueva libertad y más espacio.$$, null, null, 1),
    ('therapy', 'medicina-cuantica', 'paragraph', $$El segundo cuerpo es más grande que el primero. Te rodea como un clima sutil, un aura de energía. Te conecta a la experiencia de la Unidad.$$, null, null, 2),
    ('course', 'mindfulness-estres-ansiedad', 'paragraph', $$Semana 1. ¿Qué es mindfulness? ¿Cómo puedo utilizarlo para nuestra gestión emocional? Entrenamiento de atención plena al momento presente.$$, null, null, 1),
    ('course', 'mindfulness-estres-ansiedad', 'paragraph', $$Semana 2. Beneficios de mindfulness para el cambio de creencias limitantes. Entrenamiento de atención plena al entorno presente.$$, null, null, 2),
    ('course', 'mindfulness-estres-ansiedad', 'paragraph', $$Semana 3. Relaciones conscientes, límites saludables, autoestima y empatía. Entrenamiento en atención plena a nuestro espacio y el ajeno.$$, null, null, 3),
    ('course', 'mindfulness-estres-ansiedad', 'paragraph', $$Semana 4. Cómo entender el estrés, la ansiedad y utilizarlos a nuestro favor. Entrenamiento para entrar en estado de relajación.$$, null, null, 4),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 1. Mindfulness - Gestión Emocional.$$, null, null, 1),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 2. Primeros pasos en la atención plena - Fortalezas emocionales.$$, null, null, 2),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 3. Crear consciencia de relaciones automáticas.$$, null, null, 3),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 4. Relaciones conscientes I.$$, null, null, 4),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 5. Relaciones conscientes II.$$, null, null, 5),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 6. Empatía y espacio personal sano.$$, null, null, 6),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 7. Comunicación saludable.$$, null, null, 7),
    ('course', 'mindfulness-manejo-emocional', 'paragraph', $$Semana 8. Cambia el foco, potenciando tus creencias.$$, null, null, 8),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 1. Mindfulness - Gestión Emocional.$$, null, null, 1),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 2. Energía de las emociones.$$, null, null, 2),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 3. Crear consciencia de relaciones automáticas.$$, null, null, 3),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 4. Relaciones conscientes I.$$, null, null, 4),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 5. Relaciones conscientes II.$$, null, null, 5),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 6. Empatía y espacio personal sano.$$, null, null, 6),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 7. Comunicación. Manifestación.$$, null, null, 7),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 8. Comunicación. Manifestación.$$, null, null, 8),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 9. Cambia el foco, potenciando tus creencias.$$, null, null, 9),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 10. Apreciación de la belleza, curiosidad, vitalidad, perdón.$$, null, null, 10),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 11. Aceptación, universalismo, gratitud, armonía, compasión.$$, null, null, 11),
    ('course', 'instructorado-mindfulness-gestion-emocional', 'paragraph', $$Semana 12. Manejo del estrés, estado flow.$$, null, null, 12)
) as b(type, slug, block_type, content, image_url, image_alt, sort_order)
join public.content_items ci on ci.type = b.type and ci.slug = b.slug;

delete from public.reviews;
insert into public.reviews (reviewer_name, image_url, image_alt, quote, status, sort_order)
values
  ('Euge', '/assets/img/testimonials/testimonials-1.jpg', 'Testimonio de Euge', $$Los masajes trascienden la piel y llegan al alma. Viví una experiencia única, la recomiendo al 100%. Muy buena dedicación, una energía especial, quedé encantada, muy profesional pero sobre todo humana, cálida y positiva.$$, 'published', 1),
  ('Pati', '/assets/img/testimonials/testimonials-2.jpg', 'Testimonio de Pati', $$Luego de las preguntas que me hizo tomé la decisión que buscaba y me siento feliz. Lo que me dijo me sirvió para soltar y animarme. Su impulso fue justo lo que necesitaba.$$, 'published', 2),
  ('Patricio', '/assets/img/testimonials/testimonials-3.jpg', 'Testimonio de Patricio', $$Lo más destacable ha sido mi nueva capacidad de observarme. Me siento feliz de estar haciéndolo, pues parece que me hubiese dividido en dos personas: una emocional y otra reflexiva, más despegada y madura.$$, 'published', 3),
  ('María', '/assets/img/testimonials/testimonials-4.jpg', 'Testimonio de María', $$La terapia con Sere fue algo que yo buscaba hace mucho: encontrarme conmigo misma. Ella me enseñó a manejar mi energía, a entenderme y a ver las cosas de una manera diferente.$$, 'published', 4),
  ('Stefi', '/assets/img/testimonials/testimonials-5.jpg', 'Testimonio de Stefi', $$Me siento súper bien, siento que cosas muy buenas me están pasando a nivel del estudio y en mis relaciones. Quiero agradecer desde el corazón porque me siento muy bien.$$, 'published', 5),
  ('Gabi', '/assets/img/testimonials/testimonials-6.jpg', 'Testimonio de Gabi', $$Me di cuenta que no debemos adelantarnos a los acontecimientos ni afligirnos por cosas que no podemos cambiar. Con un pequeño cambio de actitud de nuestra parte, logramos que el entorno mejore.$$, 'published', 6),
  ('Dani', '/assets/img/testimonials/testimonials-7.jpg', 'Testimonio de Dani', $$Excelente profesional y persona. La primera vez que alguien me puede aliviar realmente la tensión física y mental. Busca la excelencia y lo logra, estudiándote y empatizando para un tratamiento único.$$, 'published', 7),
  ('Anto', '/assets/img/testimonials/testimonials-8.jpg', 'Testimonio de Anto', $$Encontré un estado de equilibrio energético y emocional gracias a mis encuentros con Sere. 100% recomendable.$$, 'published', 8),
  ('Pao', '/assets/img/testimonials/testimonials-9.jpg', 'Testimonio de Pao', $$Excelente atención. Una maravillosa experiencia que Sere formara parte de mi proceso personal. Brinda herramientas para continuar trabajando y su labor tiene una faceta humana increíble.$$, 'published', 9),
  ('Romi', '/assets/img/testimonials/testimonials-10.jpg', 'Testimonio de Romi', $$Tuve una excelente experiencia, la cual me aportó mucho conocimiento y ayuda. La coach es increíble, hace todo con mucho amor. Súper recomiendo.$$, 'published', 10);

delete from public.faq_items;
insert into public.faq_items (question, answer, status, sort_order)
values
  ('¿Qué es Mindfulness?', $$Es la habilidad de mantener la atención plena en el momento presente, es vivir aquí y ahora, sin juicios, sin culpas, sin miedos, sin adelantar acontecimientos, sin poner etiquetas. Es una enseñanza que proviene del budismo y significa intención, atención pura, recepción y presencia del corazón. Es un concepto rico y múltiple: una práctica forma de meditación y también una manera de percibir el mundo, la vida y a uno mismo.$$, 'published', 1),
  ('¿Cómo se practica?', $$Tan solo hay que prestar atención al momento presente, al aquí y al ahora. El éxito en la práctica consiste en practicar con ecuanimidad, serenidad y amabilidad, no en conseguir nada. Tanto en prácticas formales como informales se escoge algo que nos ancle al presente, como respiración, sensaciones corporales o sonidos, y observamos lo que surja sin emitir juicio.$$, 'published', 2),
  ('¿Se trata de una terapia?', $$Mindfulness no es una terapia psicológica como tal. Es un programa de psicoeducación que busca dotar a las personas de habilidades y estrategias para enfrentar creencias limitantes, estrés o ansiedad de una manera más eficaz. No sustituye el tratamiento indicado por tu médico.$$, 'published', 3),
  ('¿Cómo es una sesión individual?', $$Después de una o varias entrevistas previas, cada persona decide objetivos a corto, medio y largo plazo. La instructora analiza la situación actual y se crea en equipo un plan de prácticas. En cada sesión se enseñan una o varias prácticas, se comentan dificultades o dudas y se proporcionan audios para continuar en la vida cotidiana.$$, 'published', 4),
  ('¿Cómo es una sesión grupal?', $$En una sesión grupal varias personas hacen las prácticas a la vez, guiadas por una profesional experta en mindfulness. Las sesiones suelen durar entre 60 y 120 minutos e incluyen diálogo para plantear dudas y compartir experiencias. No hacen falta conocimientos previos.$$, 'published', 5),
  ('¿Qué habilidades aprenderé?', $$Aprenderás a entender cómo funciona tu mente, reconocer hábitos y patrones recurrentes, poner distancia de pensamientos y emociones estresantes, detectar señales de estrés y relacionarte con tus sensaciones, pensamientos y emociones con más amabilidad y compasión.$$, 'published', 6),
  ('¿Qué beneficios obtengo practicando Mindfulness?', $$Seremos más conscientes de nuestras propias experiencias, aceptando lo que viene sin reaccionar automáticamente. Esto entrena respuestas más reflexivas y equilibradas, regula mejor las emociones y ayuda a bajar el nivel de estrés.$$, 'published', 7),
  ('¿Mindfulness tiene base científica?', $$El programa que hizo historia en occidente fue el de Jon Kabat Zinn en 1979, basado en prácticas contemplativas y orientado a reducción del estrés. Existen numerosos estudios que muestran beneficios en concentración, sueño, inteligencia emocional, relaciones interpersonales, prevención de recaídas y salud mental.$$, 'published', 8),
  ('¿Cómo son las prácticas?', $$Son variadas y adaptables a la edad y necesidades de cada persona. Consisten en atender a la respiración, sensaciones corporales, emociones y pensamientos. Las prácticas formales reservan un tiempo y postura específicos; las informales llevan la atención a actividades cotidianas.$$, 'published', 9),
  ('¿Qué cantidad de prácticas son recomendables realizar?', $$Cada ser requiere diferentes tiempos y formas. En las primeras semanas se recomienda usar alguna herramienta unos 10 minutos mínimos diariamente e ir aumentando. Práctica formal, práctica informal y auto observación conforman los tres aspectos fundamentales a entrenar.$$, 'published', 10),
  ('¿Qué efecto tiene Mindfulness en la salud física, emocional y mental?', $$Ayuda a vivenciar estados con menores niveles de estrés físico y emocional, mejores recursos para afrontar retos y buenas estrategias cognitivas. El objetivo es observar cómo nos relacionamos con nuestros pensamientos, emociones y creencias para potenciar respuestas más saludables.$$, 'published', 11);
