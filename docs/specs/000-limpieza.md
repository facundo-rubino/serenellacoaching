# 000 – Limpieza y simplificación

## Problema

El admin actual (`src/app/admin/page.tsx`, ~700 líneas) es un CMS genérico: configuración del sitio, navegación, redes sociales, secciones de página con JSON, SEO, media, testimonios ocultos. Es demasiado para Serenella y no cubre lo que necesita (clientes).

## Hecho en esta rama

- Eliminado `TestimonialsCarousel` (+ estilos): reemplazado por el widget de Google y sin usos.
- Eliminado `src/app/testimonios/page.module.scss`: la ruta solo redirige.
- Agregados `docs/VISION.md`, specs y `CLAUDE.md` para alinear objetivos.

## Pendiente

### 1. Separar "lo de ella" de "lo técnico"

| Sección actual | Decisión |
| --- | --- |
| Contenido (terapias / cursos) | **Queda** para ella, simplificado: título, resumen, foto, texto, publicado sí/no. SEO y `sort_order` se ocultan (autogenerados). |
| FAQ | **Queda** para ella. |
| Contacto (email, teléfono, dirección) | **Queda** para ella. `map_embed_url` y `form_url` → técnico. |
| Configuración del sitio, navegación, redes, secciones de página, media | **Pasan a `/admin/avanzado`**, visible solo para Facundo. |
| Testimonios manuales (`reviews`) | No se muestran en el sitio. **Quitar del admin.** Decidir si se borra la tabla (ver preguntas). |

### 2. Partir el monolito del admin

`src/app/admin/page.tsx` → rutas separadas, una tarea por pantalla:

```
/admin                 inicio (spec 003)
/admin/clientes        spec 001
/admin/sesiones        spec 002
/admin/sitio           terapias, cursos, FAQ, contacto
/admin/avanzado        lo técnico (solo rol "owner")
```

Los formularios actuales se mueven a componentes en `src/app/admin/<seccion>/`.

### 3. Roles

Agregar rol `owner` (Facundo) además de `admin` (Serenella) en `profiles.role`. `/admin/avanzado` solo para `owner`.

### 4. Calidad mínima

- No hay tests. Sumar `vitest` solo para validaciones (`zod`) y cálculos de resúmenes de clientes (spec 002); nada de tests de UI por ahora.
- Mantener `npm run check` verde en cada PR.

## Preguntas abiertas

1. **MFA TOTP**: hoy el primer login obliga a configurar una app autenticadora. Para alguien poco técnico es una barrera alta. Recomendación: quitar el TOTP propio y **exigir verificación en 2 pasos en su cuenta de Google** (el login ya es solo con Google). Se mantiene la seguridad, se quita fricción.
2. ¿Borrar la tabla `reviews` o dejarla como respaldo sin UI?

## Criterios de aceptación

- Serenella entra a `/admin` y ve como máximo 4 opciones de menú.
- Ninguna pantalla de ella muestra los términos: slug, SEO, status, sort order, metadata, JSON, href.
- `npm run check` y `npm run build` pasan.
