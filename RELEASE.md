# Primer release de producción

## Antes del deploy

- [ ] Crear el proyecto de Supabase de producción.
- [ ] Aplicar `supabase/migrations/202605190001_initial_schema.sql`.
- [ ] Ejecutar `supabase/seed.sql` una sola vez.
- [ ] Crear el usuario administrador, asignarle el rol `admin` y comprobar el alta de MFA.
- [ ] Configurar en Vercel `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SITE_URL` para Production.
- [ ] Mantener las variables de PayPal vacías hasta implementar el checkout.
- [ ] Ejecutar `npm ci` y `npm run release:check` con las variables de producción.

## Validación del preview

- [ ] Confirmar navegación en desktop y móvil.
- [ ] Confirmar que inicio, terapias, cursos, testimonios, sobre mí y contacto cargan sin errores.
- [ ] Confirmar que el enlace de novedades y el formulario de contacto abren el formulario correcto.
- [ ] Confirmar que `/admin/login`, enrolamiento MFA, challenge MFA y edición de contenido funcionan.
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
