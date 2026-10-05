# CLAUDE.md

Backoffice + sitio público para Serenella, terapeuta holística con poca experiencia tecnológica.

- Leer `docs/VISION.md` antes de proponer features. Prioridad: clientes y sesiones antes que cursos o redes.
- Cada feature nueva arranca con una spec en `docs/specs/NNN-nombre.md` (objetivo, modelo de datos, UX, fuera de alcance, criterios de aceptación).
- UI del admin: castellano simple, una tarea por pantalla, mobile first, sin jerga técnica (slug, SEO, status…).
- Datos de clientes son sensibles: RLS solo-admin, nunca en rutas públicas ni logs.
- Stack: Next.js App Router + TS + SCSS modules + Supabase. Migraciones en `supabase/migrations`, server actions en `src/lib/admin` con `zod`.
- Antes de pushear: `npm run check`.
