# SerenellaCoaching

Sitio migrado a Next.js, React, TypeScript y SCSS nativo.

## Scripts

- `npm run dev`: entorno local.
- `npm run build`: build de producción.
- `npm run start`: servir el build de producción.
- `npm run lint`: validación ESLint.
- `npm run typecheck`: validación TypeScript.
- `npm run check`: lint y TypeScript.
- `npm run env:check`: valida las variables obligatorias de producción.
- `npm run release:check`: validación completa previa a un release (entorno, lint, tipos y build).

## Arquitectura

- `src/app`: rutas App Router.
- `src/components`: componentes visuales reutilizables.
- `src/lib/content`: capa de lectura server-side para contenido público desde Supabase, con fallback local.
- `src/lib/admin`: guardas, acciones y data loader del dashboard `/admin`.
- `src/lib/routes.ts`: helpers de rutas.
- `src/styles`: tokens y estilos globales SCSS.
- `supabase/migrations`: esquema relacional, RLS, helpers y Storage.
- `supabase/seed.sql`: contenido inicial migrado desde el sitio hardcodeado.

Las imágenes públicas viven en `public/assets/img`.

## Supabase

1. Crear un proyecto Supabase y configurar en Vercel/local:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
2. Aplicar migraciones y seed:
   - `supabase link`
   - `supabase db push`
   - Ejecutar `supabase/seed.sql` una vez desde SQL Editor o con `psql`.
3. Invitar o crear el usuario administrador en Supabase Auth.
4. Marcarlo como admin:
   ```sql
   insert into public.profiles (id, email, role)
   select id, email, 'admin'
   from auth.users
   where email = 'admin@example.com'
   on conflict (id) do update set role = 'admin';
   ```
5. Entrar a `/admin/login`. El primer ingreso obliga a configurar MFA TOTP antes de acceder al dashboard.

## Deploy en Vercel

El repo queda preparado para Vercel con `vercel.json`, headers básicos de seguridad y `/api/health` para smoke tests.

Para migrar desde Hostinger sin cortar producción:

1. Importar el repositorio en Vercel y configurar las variables de entorno de `.env.example`.
2. Ejecutar `npm run release:check` con las mismas variables que tendrá producción.
3. Deployar a preview y validar:
   - `/`
   - `/admin/login`
   - `/api/health`
   - `/robots.txt`
   - `/sitemap.xml`
4. Confirmar que `/api/health` responde HTTP 200 y `checks.database: "ok"`.
5. Agregar `serenellacoaching.com` y `www.serenellacoaching.com` al proyecto de Vercel.
6. Mantener Hostinger como producción hasta que el preview de Vercel esté validado.
7. Cambiar DNS en Hostinger cuando esté todo listo:
   - dominio raíz/apex: `A` hacia `76.76.21.21`
   - `www`: `CNAME` hacia el destino que indique Vercel en el dashboard
8. Verificar SSL, navegación pública, formulario de contacto, login y MFA antes de apagar el hosting anterior.

Nota: Vercel Hobby es para uso personal/no comercial. Para un sitio comercial o con pagos PayPal, planificar Vercel Pro o elegir un hosting que permita uso comercial en free tier.

La lista operativa completa para el lanzamiento y rollback está en [`RELEASE.md`](./RELEASE.md).
