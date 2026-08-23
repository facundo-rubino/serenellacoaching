# Primer release de producción

## Antes del deploy

- [ ] Crear el proyecto de Supabase de producción.
- [ ] Aplicar todas las migraciones de `supabase/migrations` en orden.
- [ ] Ejecutar `supabase/seed.sql` una sola vez.
- [ ] Configurar el cliente OAuth de Google y activar el provider Google en Supabase Auth.
- [ ] Agregar las callbacks `/admin/auth/callback` de local, preview y producción a la lista de redirects permitidos de Supabase.
- [ ] Iniciar sesión una primera vez con la cuenta Google elegida y asignar luego el rol `admin` a su perfil.
- [ ] Volver a iniciar sesión y comprobar el alta de MFA.
- [ ] Crear y configurar el carrusel gratuito de EmbedSocial, conectado a la cuenta administradora del perfil de Google.
- [ ] Configurar en Vercel `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_EMBEDSOCIAL_WIDGET_REF` y `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` para Preview y Production.
- [ ] Mantener las variables de PayPal vacías hasta implementar el checkout.
- [ ] Ejecutar `npm ci` y `npm run release:check` con las variables de producción.

## Validación del preview

- [ ] Confirmar navegación en desktop y móvil.
- [ ] Confirmar que inicio, terapias, cursos, reseñas de Google, sobre mí y contacto cargan sin errores.
- [ ] Confirmar que la home carga una sola instancia del widget, muestra las reseñas en español y permite navegar el carrusel.
- [ ] Confirmar que el CTA de la home abre el perfil público de Google en una pestaña nueva.
- [ ] Confirmar que `/testimonios` redirige directamente al perfil público de Google sin cargar EmbedSocial.
- [ ] Bloquear temporalmente el script externo y confirmar que el enlace directo a Google sigue disponible en la home.
- [ ] Controlar que el uso se mantenga dentro del límite gratuito de 500 visualizaciones mensuales.
- [ ] Confirmar que el enlace de novedades y el formulario de contacto abren el formulario correcto.
- [ ] Confirmar que `/admin/login`, callback de Google, enrolamiento MFA, challenge MFA y edición de contenido funcionan.
- [ ] Confirmar que `/api/health` responde HTTP 200 con `checks.database: "ok"`.
- [ ] Confirmar que `/robots.txt` y `/sitemap.xml` usan el dominio de producción.
- [ ] Confirmar que no hay errores de CSP, JavaScript o recursos en la consola del navegador.

## Publicación

- [ ] Agregar y verificar los dominios apex y `www` en Vercel.
- [ ] Reducir temporalmente el TTL DNS antes del cambio, si el proveedor lo permite.
- [ ] Cambiar DNS solamente después de aprobar el preview.
- [ ] Verificar HTTPS, redirección al dominio canónico y las rutas críticas tras la propagación.
- [ ] Mantener el hosting anterior disponible durante la ventana de observación.

## Rollback

Si falla una ruta crítica, restaurar los registros DNS anteriores o promover en Vercel el último deployment sano. Las migraciones de este release son aditivas; no borrar datos durante el rollback.
