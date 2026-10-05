# 001 – Clientes

## Objetivo

Que Serenella tenga su lista de clientes en un solo lugar: quién es, de dónde viene, cómo la conoció y cómo contactarla.

## Historias

- Como Serenella, después de atender a alguien nuevo, quiero **cargarlo en menos de un minuto** desde el celular.
- Quiero **buscar** un cliente por nombre o teléfono.
- Quiero ver de **qué ciudades/barrios** vienen mis clientes.
- Quiero saber **cómo me conocieron** (recomendación, Instagram, Google…).
- Quiero **archivar** a alguien que ya no viene, sin perder su historial.

## Modelo de datos

Migración nueva `supabase/migrations/<fecha>_clients.sql`:

```sql
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  city text,                 -- ciudad / localidad
  area text,                 -- barrio o zona (opcional)
  country text default 'AR', -- ajustar al país real
  birth_date date,
  referral_source text check (referral_source in
    ('recomendacion','instagram','facebook','google','sitio_web','otro')),
  referred_by uuid references public.clients(id) on delete set null,
  first_visit_date date,     -- para clientes históricos sin sesiones cargadas
  consent_at timestamptz,    -- cuándo aceptó que se guarden sus datos
  notes text,                -- notas generales (no clínicas detalladas)
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index clients_name_idx on public.clients (lower(full_name));
create index clients_city_idx on public.clients (city);
```

- RLS activo; select/insert/update/delete **solo** con `public.is_admin()` (ya existe en el esquema inicial). Sin acceso `anon`.
- Trigger `set_updated_at`.
- Ciudad y barrio son texto libre, pero el formulario sugiere los valores ya cargados (`<datalist>`) para evitar "Cordoba" vs "Córdoba".

## UX

**Lista** `/admin/clientes`
- Buscador arriba. Botón grande "+ Nuevo cliente".
- Cada fila: nombre, ciudad, última sesión ("hace 3 semanas"), terapia más frecuente (de spec 002).
- Filtros simples: ciudad, activos / archivados.

**Alta / edición**
- Obligatorio solo **nombre**. Visibles de entrada: nombre, teléfono, ciudad, cómo te conoció.
- "Más datos" (plegado): email, barrio, fecha de nacimiento, quién lo recomendó, notas, primera visita.
- Checkbox "El cliente aceptó que guarde sus datos" → setea `consent_at`.
- Botón de teléfono → abre WhatsApp (`https://wa.me/<numero>`).

**Ficha** `/admin/clientes/[id]`
- Datos + historial de sesiones (spec 002) + botón "Registrar sesión".

## Privacidad

- Datos de salud/bienestar: tratar como sensibles bajo la ley de datos personales local (AR Ley 25.326 / UY Ley 18.331, confirmar país).
- Nunca exponer en rutas públicas ni en logs. Nada de `select *` hacia el cliente del navegador fuera de `/admin`.
- Exportar CSV de un cliente a pedido (derecho de acceso) — puede quedar para una iteración posterior.

## Fuera de alcance

Turnos/agenda, pagos online, mensajes automáticos.

## Criterios de aceptación

- Alta de cliente con solo nombre funciona desde un celular (ancho 375px).
- Búsqueda por nombre parcial y por teléfono.
- Un usuario no admin (o anónimo) no puede leer `clients` (verificado con la anon key).
- Archivar oculta de la lista por defecto pero conserva datos y sesiones.
