# Specs de Migración — Serenella Coaching (Etapa 1)

## 1. Auditoría del sitio actual

### Estructura general
- **Single Page Application** (SPA estática) — todo en `index.html`
- Template base: **BizLand v3.7.0** (BootstrapMade)
- Stack actual: HTML + Bootstrap 5 + CSS custom + vendor JS libs

### Secciones detectadas (orden en página)

| # | Sección | ID HTML | Contenido |
|---|---------|---------|-----------|
| 1 | Top Bar | `#topbar` | Email, teléfono, redes sociales |
| 2 | Header/Nav | `#header` | Logo texto + nav (6 items) |
| 3 | Hero | `#hero` | Título + subtítulo + CTA "Sobre mi" + bg image |
| 4 | Terapias | `#team` | Grid 4 cols (8 cards con imagen + info) |
| 5 | Testimonios | `#testimonials` | Swiper slider (10 testimonios) + bg image |
| 6 | Cursos | `#cursos` | Grid 3 cols (3 cards con imagen + programa) |
| 7 | Sobre Mi | `#about` | 2 cols: imagen + texto bio largo |
| 8 | FAQ | `#faq` | 11 preguntas colapsables (Bootstrap collapse) |
| 9 | Contacto | `#contact` | Info boxes + Google Maps iframe + CTA Google Forms |
| 10 | Footer Newsletter | `.footer-newsletter` | Formulario suscripción email |
| 11 | Footer | `#footer` | Contacto + links + redes sociales |
| 12 | Extras | — | Preloader + Back to top button |

### Navegación
Inicio, Terapias, Testimonios, Cursos, Sobre Mi, Contacto — todos son anchors internos (scrollto).

### Paleta de colores

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#FF7453` | Acento principal (topbar, links, botones, bordes, iconos) |
| `primary-hover` | `#FF8466` | Hover en links |
| `text-dark` | `#222222` | Títulos, nav, texto principal |
| `text-body` | `#444444` | Cuerpo general |
| `text-muted` | `#777777` | Texto secundario, footer |
| `text-light` | `#aaaaaa` | Spans en cards |
| `text-italic` | `#777777` | Párrafos italic en cards |
| `bg-section` | `#f6f9fe` | Fondo secciones alternas |
| `bg-footer` | `#f1f6fe` | Fondo footer/newsletter |
| `bg-white` | `#ffffff` | Cards, header, footer-top |
| `section-title-bg` | `#F7F7F7` | Badge de título de sección |
| `faq-question` | `#0d58ba` | Texto pregunta FAQ abierta |
| `faq-border` | `#d4e5fc` | Borde inferior FAQ items |
| `testimonial-overlay` | `rgba(0,0,0,0.7)` | Overlay sección testimonios |
| `hero-overlay` | `rgba(255,255,255,0.6)` | Overlay hero |
| `blue-hover` | `#0d58ba` / `#3b8af2` | Hover alternativo en footer/pricing |

### Tipografías

| Familia | Uso | Pesos |
|---------|-----|-------|
| **Open Sans** | Body general | 300, 400, 600, 700 |
| **Roboto** | Headings (h1-h6), textos secundarios | 300, 400, 500, 600, 700 |
| **Poppins** | Logo, hero h1, skills, pricing h4 | 300, 400, 500, 600, 700 |

### Tamaños tipográficos clave

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| Hero h1 | 48px / lh 56px | 28px / lh 36px |
| Hero h2 | 24px | 18px / lh 24px |
| Section title h2 (badge) | 13px uppercase | — |
| Section title h3 | 32px fw700 | — |
| Nav links | 15px fw600 | 15px |
| Card h4 | 18px fw700 | — |
| Card span | 13px fw400 | — |
| Card p | 14px / lh 26px italic | — |
| FAQ question | 18px / lh 24px | — |
| Footer body | 14px | — |
| Button CTA | 14px uppercase, letter-spacing 1px | 13px |

### Spacing / Layout

| Concepto | Valor |
|----------|-------|
| Topbar height | 40px |
| Header height | 86px (scrolled: 70px) |
| Hero height | 75vh (mobile: 100vh) |
| Section padding | 60px 0 |
| Testimonials padding | 80px 0 |
| Section title padding-bottom | 30px |
| Card member-info padding | 25px 15px |
| Card border-radius | 4px |
| Button border-radius | 4px |
| Button padding | 10px 28px |
| Container | Bootstrap default (max-width 1140px) |
| Grid terapias | 4 cols (`col-lg-3 col-md-6`) |
| Grid cursos | 3 cols (`col-lg-4 col-md-6`) |
| Grid about | 2 cols (`col-lg-6`) |
| Grid contacto | `col-lg-6` + `col-lg-3 col-md-6` x2 |
| Footer grid | 3 cols (`col-lg-3 col-md-6`) |

### Breakpoints relevantes

| Breakpoint | Efecto |
|------------|--------|
| 1366px | Dropdown nested ajuste |
| 1024px | Hero bg fixed, section-title p width 50% |
| 991px | Mobile nav toggle visible, navbar ul hidden |
| 990px | formEncuentro padding-top 2rem |
| 768px | AOS delay disabled, hero 100vh, font sizes reducidas, footer copyright stacked |
| 500px (height) | Hero 120vh |

### Interacciones / JS

| Feature | Implementación actual | Reemplazo Tailwind/JS |
|---------|----------------------|----------------------|
| Scroll spy nav | Custom JS (select/onscroll) | Mantener JS custom |
| Header fixed on scroll | Custom JS | Mantener JS custom |
| Mobile nav toggle | Custom JS toggle classes | Mantener JS custom |
| Smooth scroll to section | Custom JS scrollto | Mantener JS custom |
| Back to top button | Custom JS toggle active | Mantener JS custom |
| Preloader | CSS animation + JS remove | Mantener |
| AOS animations | AOS.js library | **Reemplazar con Tailwind + IntersectionObserver** |
| Testimonials slider | Swiper.js | **Mantener Swiper** (complejo de replicar) |
| FAQ collapse | Bootstrap collapse | **Reemplazar con JS custom** |
| GLightbox | Lib para lightbox | Evaluar si se usa (no hay links glightbox en HTML actual) |
| Isotope | Portfolio filter | **No se usa** — no hay portfolio en la página |
| PureCounter | Counter animation | **No se usa** — no hay counters visibles |
| Waypoints | Scroll triggers | Solo para skills (no visibles) — **eliminar** |

### Assets

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| Imágenes terapias | 11 | `assets/img/terapias/` |
| Imágenes testimonios | 10 | `assets/img/testimonials/` |
| Hero bg | 1 | `assets/img/hero-bg.jpg` |
| Testimonials bg | 1 | `assets/img/testimonials-bg.jpg` |
| About | 1 | `assets/img/about.jpeg` |
| Logo | 1 | `assets/img/logo.png` |
| Favicon | 1 | `assets/img/favicon.ico` |
| Clients (sin usar) | 6 | `assets/img/clients/` |

### Contenido futuro para base de datos (Etapa 3)
- Terapias (8): nombre, descripción corta, descripción larga, imagen
- Testimonios (10): nombre, texto, imagen
- Cursos (3): nombre, duración, programa semanal, imagen
- FAQ (11): pregunta, respuesta
- Info contacto: dirección, email, teléfono, redes
- Bio "Sobre Mi": texto, imagen
- Links navegación

---

## 2. Plan técnico de migración

### Estrategia general
1. **Setup proyecto** con Tailwind CLI (build standalone, sin PostCSS complejo)
2. **Eliminar Bootstrap** y todas las vendor libs no necesarias
3. **Reescribir CSS** usando utilidades Tailwind + custom theme tokens
4. **Mantener Swiper** como única dependencia externa (slider testimonios)
5. **Reescribir FAQ** con JS vanilla (reemplaza Bootstrap collapse)
6. **Reescribir AOS** con IntersectionObserver + clases Tailwind transition
7. **Preservar** todas las imágenes, textos e interacciones exactamente iguales
8. **Validar** contra producción en desktop/tablet/mobile

### Orden de migración por componentes
1. Setup proyecto + Tailwind config con tokens
2. Topbar
3. Header + Nav (desktop + mobile)
4. Hero
5. Terapias (cards grid)
6. Testimonios (Swiper)
7. Cursos (cards grid)
8. Sobre Mi (2 cols)
9. FAQ (collapse custom)
10. Contacto (info + mapa + CTA)
11. Footer (newsletter + links + redes)
12. Extras (preloader, back-to-top)
13. Responsive pass completo
14. Validación visual

---

## 3. Estructura de carpetas propuesta

```
serenellacoaching/
├── public/
│   ├── images/
│   │   ├── terapias/          # 11 imágenes
│   │   ├── testimonials/      # 10 imágenes
│   │   ├── hero-bg.jpg
│   │   ├── testimonials-bg.jpg
│   │   ├── about.jpeg
│   │   └── logo.png
│   ├── favicon.ico
│   └── fonts/                 # Si se descargan Google Fonts
│
├── src/
│   ├── css/
│   │   ├── input.css          # @tailwind directives + @layer custom
│   │   └── output.css         # Generado por Tailwind CLI (no editar)
│   │
│   ├── js/
│   │   ├── app.js             # Init general (preloader, back-to-top, scroll spy)
│   │   ├── nav.js             # Header fixed + mobile toggle
│   │   ├── faq.js             # Accordion custom (reemplaza Bootstrap collapse)
│   │   ├── animations.js      # IntersectionObserver (reemplaza AOS)
│   │   └── testimonials.js    # Init Swiper
│   │
│   └── vendor/
│       └── swiper/            # Solo Swiper (CSS + JS)
│
├── index.html                 # Página principal migrada
│
├── docs/
│   ├── migration-specs.md     # Este documento
│   ├── component-inventory.md # Inventario de componentes
│   ├── visual-checklist.md    # Checklist de validación
│   └── migration-log.md       # Log de decisiones tomadas
│
├── tailwind.config.js
├── package.json
└── README.md
```

### Decisiones de estructura
- **Sin carpeta `pages/`** por ahora — es una SPA de una sola página
- **Sin carpeta `components/`** HTML — en Etapa 1 todo va en `index.html`, los componentes se separarán en Etapa 2 (React)
- **`public/images/`** renombrado desde `assets/img/` para claridad
- **`src/js/`** separado por responsabilidad (nav, faq, animations, testimonials)
- **`src/vendor/`** solo Swiper — eliminamos Bootstrap, AOS, GLightbox, Isotope, PureCounter, Waypoints, php-email-form
- **`docs/`** para documentación de migración

---

## 4. Reglas de implementación

### HTML
- Semántico: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`
- Atributos `data-*` para JS hooks (ej: `data-faq-toggle`, `data-animate`)
- IDs preservados para scroll navigation (`#hero`, `#team`, `#testimonials`, etc.)
- Sin clases Bootstrap — todo Tailwind
- Accesibilidad: `aria-expanded` en FAQ, `alt` en imágenes, roles semánticos

### Tailwind CSS
- **Theme extendido** en `tailwind.config.js` con todos los tokens del diseño
- **Clases arbitrarias** permitidas solo cuando no hay utilidad estándar (ej: `h-[86px]`, `text-[15px]`)
- **`@layer components`** para patrones repetidos: `.btn-primary`, `.section-title`, `.card-member`
- **No usar `@apply` excesivamente** — preferir utilidades en HTML
- **Responsive**: mobile-first con breakpoints `sm`, `md`, `lg`, `xl`

### JavaScript
- Vanilla JS, sin jQuery ni frameworks
- Módulos ES6 si el browser target lo permite, sino IIFE
- Event delegation donde sea posible
- IntersectionObserver para animaciones de entrada (fade-up, zoom-out)

### Tailwind Config esperado

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7453',
        'primary-hover': '#FF8466',
        'text-dark': '#222222',
        'text-body': '#444444',
        'text-muted': '#777777',
        'text-light': '#aaaaaa',
        'bg-section': '#f6f9fe',
        'bg-footer': '#f1f6fe',
        'section-title-bg': '#F7F7F7',
        'faq-question': '#0d58ba',
        'faq-border': '#d4e5fc',
        'blue-hover': '#3b8af2',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      height: {
        'topbar': '40px',
        'header': '86px',
        'header-scrolled': '70px',
      },
      fontSize: {
        'hero-title': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'hero-title-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'hero-subtitle': ['24px', { fontWeight: '400' }],
        'section-badge': ['13px', { letterSpacing: '1px', fontWeight: '700' }],
        'section-heading': ['32px', { fontWeight: '700' }],
        'nav': ['15px', { fontWeight: '600' }],
        'card-title': ['18px', { fontWeight: '700' }],
        'card-meta': ['13px', { fontWeight: '400' }],
        'card-body': ['14px', { lineHeight: '26px' }],
        'faq': ['18px', { lineHeight: '24px' }],
        'btn': ['14px', { letterSpacing: '1px', fontWeight: '500' }],
      },
      boxShadow: {
        'header': '0px 2px 15px rgba(0, 0, 0, 0.1)',
        'card': '0px 2px 15px rgba(16, 110, 234, 0.15)',
        'contact-info': '0 0 30px rgba(214, 215, 216, 0.3)',
        'newsletter': '0px 2px 15px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'badge': '50px',
      },
    },
  },
  plugins: [],
}
```

---

## 5. Checklist de validación visual

### Desktop (1920px / 1440px / 1280px)
- [ ] Topbar: fondo #FF7453, altura 40px, email + tel centrados, redes a la derecha
- [ ] Header: altura 86px, logo "SerenellaCoaching." con punto naranja, nav 6 items a la derecha
- [ ] Header fixed on scroll: altura 70px, shadow visible
- [ ] Hero: 75vh, bg image con overlay blanco 60%, título con "mejor versión" en naranja, botón CTA
- [ ] Terapias: título con badge + heading, grid 4 cols, cards con imagen + info
- [ ] Testimonios: bg image con overlay oscuro 70%, slider Swiper funcional, autoplay 5s
- [ ] Cursos: grid 3 cols, cards con programa semanal detallado
- [ ] Sobre Mi: 2 cols, imagen izq + texto largo derecha
- [ ] FAQ: 11 preguntas colapsables, icono chevron toggle, color azul en activo
- [ ] Contacto: 3 info boxes + mapa Google + CTA "Comenzar"
- [ ] Footer newsletter: input email + botón suscribir
- [ ] Footer: 3 cols (contacto + links + redes sociales)
- [ ] Back to top button: aparece al scrollear, naranja, esquina inferior derecha
- [ ] Preloader: spinner naranja al cargar

### Tablet (768px - 991px)
- [ ] Nav cambia a hamburger menu
- [ ] Terapias: grid 2 cols
- [ ] Cursos: grid 2 cols (tercero wrappea)
- [ ] Contacto: info boxes apilados 2+1
- [ ] Footer: cols se apilan
- [ ] formEncuentro: padding-top 2rem

### Mobile (< 768px)
- [ ] Hero: 100vh, h1 28px, h2 18px
- [ ] AOS delays desactivados
- [ ] Todas las grids 1 col
- [ ] Mapa Google responsive
- [ ] FAQ sigue funcional
- [ ] Footer copyright centrado
- [ ] Mobile nav overlay oscuro, menú en caja blanca

### Interacciones
- [ ] Smooth scroll en nav links
- [ ] Hover underline animado en nav desktop
- [ ] Hover color naranja en links
- [ ] FAQ toggle funcional (open/close con animación)
- [ ] Swiper autoplay + bullets clickeables
- [ ] Mobile menu toggle funcional
- [ ] Back to top scroll suave

---

## 6. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| **Grid Bootstrap vs Tailwind** no mapea 1:1 en breakpoints | Diferencias en responsive | Usar grid Tailwind con breakpoints custom mapeados a los de Bootstrap (sm:640 → md:768, lg:1024 → no hay 991px en Tailwind default) — usar `max-lg:` o breakpoint custom a 992px |
| **Spacing Bootstrap** (container, gutters) difiere de Tailwind | Anchos y márgenes diferentes | Configurar container en tailwind.config para igualar max-widths de Bootstrap (540/720/960/1140px) |
| **Swiper CSS** puede colisionar con Tailwind reset | Slider roto visualmente | Importar Swiper CSS después de Tailwind base, antes de components |
| **Google Fonts carga lenta** | FOUT visible | Preconnect + font-display swap (ya funciona así) |
| **FAQ sin Bootstrap JS** | Collapse deja de funcionar | Implementar accordion JS custom antes de quitar Bootstrap |
| **AOS removal** | Animaciones de entrada desaparecen | Implementar IntersectionObserver + clases CSS transition equivalentes antes de quitar AOS |
| **Imágenes sin optimizar** | Mismo peso que actual | No es scope de Etapa 1, documentar para futuro |
| **iframe Google Maps** | Puede afectar responsive | Wrapper responsive con aspect-ratio o padding-bottom hack |
| **Breakpoint 991px** (Bootstrap lg) no existe en Tailwind | Mobile nav trigger a distinto tamaño | Agregar breakpoint custom `'nav': '992px'` en tailwind.config |

---

## 7. Roadmap posterior

### Etapa 2 — React
- Extraer secciones como componentes: `<TopBar>`, `<Header>`, `<Hero>`, `<TerapiasGrid>`, `<Testimonials>`, `<CursosGrid>`, `<AboutMe>`, `<FAQ>`, `<Contact>`, `<Footer>`
- Props para datos (terapias, testimonios, cursos, FAQs)
- Reutilizar 100% de las clases Tailwind ya definidas
- Vite como bundler (fast, React-friendly)
- React Router si se agregan páginas (por ahora es SPA)

### Etapa 3 — Base de datos
- Tablas/colecciones: `terapias`, `testimonios`, `cursos`, `faqs`, `contacto_info`, `bio`
- API REST o Supabase/Firebase para CRUD
- Contenido sale del HTML → viene del backend
- Imágenes a storage externo (Supabase Storage, S3, Cloudinary)

### Etapa 4 — Dashboard admin
- App separada (ruta `/admin` o subdominio)
- CRUD para todas las entidades
- Editor WYSIWYG para bio
- Upload de imágenes
- Estadísticas (Google Analytics embebido o custom)
- Auth para admin (email + password mínimo)
- Basado en React + shadcn/ui o similar

---

## Resumen ejecutivo

El sitio actual es una **SPA estática** basada en el template BizLand (Bootstrap 5), con 12 secciones, 8 terapias, 3 cursos, 10 testimonios y 11 FAQs. La paleta se centra en `#FF7453` (naranja) como color primario, con tipografías Open Sans/Roboto/Poppins.

La migración a Tailwind requiere:
1. Reemplazar Bootstrap grid y utilidades por Tailwind equivalentes exactos
2. Mapear todos los valores custom del CSS actual a tokens en tailwind.config.js
3. Eliminar 6 de 8 vendor libs (mantener solo Swiper)
4. Reescribir FAQ collapse y AOS animations en JS vanilla
5. Preservar pixel-perfect fidelidad visual en los 3 breakpoints

El riesgo principal es la diferencia de breakpoints entre Bootstrap (576/768/992/1200) y Tailwind (640/768/1024/1280), que requiere configuración custom.
