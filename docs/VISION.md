# Visión del repo

## Objetivo

Darle a Serenella (terapeuta holística, poco contacto con la tecnología) **un backoffice simple** para llevar su consultorio, y un sitio público que la presente.

Orden de prioridad:

1. **Base del negocio**: clientes, sesiones, terapias. Saber quién viene, de dónde, hace cuánto y qué elige.
2. **Sitio público** estable y editable sin configuración técnica (textos, terapias, FAQ, contacto).
3. Recién después: **cursos online** y **posteos en redes**.

## Principios de producto

- **Una tarea por pantalla.** Nada de paneles con 10 secciones desplegables.
- **Lenguaje de ella**, no de developer: "Clientes", "Sesiones", "Mi sitio". Nunca "slug", "SEO", "status", "sort order", "metadata".
- **Mobile first**: lo va a usar desde el celular, al terminar una sesión.
- **Pocos campos obligatorios.** Cargar un cliente nuevo tiene que tomar < 1 minuto.
- **Lo técnico existe pero no se ve.** Configuración del sitio, navegación, SEO y redes quedan para el admin técnico (Facundo), fuera de la vista de ella.
- **Datos sensibles.** La info de clientes es de salud/bienestar: solo accesible por admins, nunca pública, con consentimiento registrado.

## Principios técnicos

- Stack actual: Next.js (App Router) + TypeScript + SCSS + Supabase (Postgres, Auth, RLS, Storage) + Vercel. No sumar dependencias sin motivo.
- Toda tabla nueva: migración en `supabase/migrations`, RLS activado, políticas solo-admin salvo que sea contenido público.
- Server actions en `src/lib/admin`, validación con `zod`.
- Cada feature empieza con una spec en `docs/specs/` y se cierra con sus criterios de aceptación cumplidos.

## Roadmap

| Fase | Spec | Estado |
| --- | --- | --- |
| 0 | [000 – Limpieza y simplificación](specs/000-limpieza.md) | En curso |
| 1 | [001 – Clientes](specs/001-clientes.md) | Propuesta |
| 1 | [002 – Sesiones y terapias elegidas](specs/002-sesiones.md) | Propuesta |
| 2 | [003 – Admin simple (navegación y pantalla de inicio)](specs/003-admin-simple.md) | Propuesta |
| 2 | [004 – Importar clientes existentes](specs/004-importar-clientes.md) | Propuesta |
| 3 | Cursos online | Pendiente de spec |
| 4 | Posteos en redes | Pendiente de spec |

### Preguntas a responder antes de especificar fases 3 y 4

**Cursos online**
- ¿Se venden o son gratis? ¿Con qué medio de pago (Mercado Pago, transferencia)?
- ¿Dónde se alojan los videos (YouTube no listado, Vimeo, plataforma tipo Hotmart)? Recomendación inicial: **no** construir una plataforma de cursos propia; usar una existente y enlazarla desde el sitio.
- ¿Los alumnos son los mismos clientes? (si sí, se vinculan a la tabla `clients`).

**Posteos en redes**
- ¿Qué redes usa realmente (Instagram, Facebook, WhatsApp)?
- ¿El problema es *publicar* o *saber qué publicar*? Recomendación inicial: un calendario de ideas/borradores simple en el admin + publicar con Meta Business Suite, sin integraciones de API.
