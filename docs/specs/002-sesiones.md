# 002 – Sesiones y terapias elegidas

## Objetivo

Registrar cada vez que un cliente viene, para responder: **hace cuánto viene, cada cuánto vuelve y qué terapias elige.**

## Historias

- Al terminar una sesión, quiero registrarla en 3 toques: cliente, terapia, fecha (hoy por defecto).
- En la ficha de un cliente, quiero ver su historial y cuándo fue la última vez.
- Quiero ver qué clientes **no vienen hace más de N días** para escribirles.
- Quiero saber qué terapias son las más elegidas.

## Modelo de datos

Las terapias ya existen en `content_items` (`type = 'therapy'`). Se reutilizan como catálogo: una terapia nueva en el sitio aparece automáticamente para registrar sesiones.

```sql
create table public.client_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  therapy_id uuid references public.content_items(id) on delete set null,
  therapy_label text,          -- copia del nombre, por si la terapia se borra o no está en el sitio
  session_date date not null default current_date,
  modality text not null default 'presencial' check (modality in ('presencial','online')),
  amount numeric(10,2),        -- opcional: lo cobrado
  paid boolean not null default true,
  notes text,                  -- notas de la sesión (sensibles)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index client_sessions_client_idx on public.client_sessions (client_id, session_date desc);
create index client_sessions_date_idx on public.client_sessions (session_date desc);
```

Vista para resúmenes (`security_invoker = true` para respetar RLS):

```sql
create view public.client_summary with (security_invoker = true) as
select c.id as client_id,
       coalesce(least(c.first_visit_date, min(s.session_date)), c.first_visit_date, min(s.session_date)) as first_visit,
       max(s.session_date) as last_visit,
       count(s.id) as sessions_count,
       current_date - max(s.session_date) as days_since_last
from public.clients c
left join public.client_sessions s on s.client_id = c.id
group by c.id;
```

- RLS solo-admin, igual que `clients`.
- `therapy_id` limitado a `content_items.type = 'therapy'` (validar en la server action con zod; un check cruzado entre tablas no vale la complejidad).

## UX

- **Registrar sesión**: desde la ficha del cliente o desde un botón global. Campos visibles: cliente (buscador), terapia (lista), fecha (hoy). Plegado: modalidad, monto, pagó, notas.
- **Ficha del cliente**: "Viene desde marzo 2025 · 12 sesiones · última hace 3 semanas · suele elegir Reiki".
- **Lista "Para volver a contactar"**: clientes activos con `days_since_last > 60` (umbral configurable más adelante), con botón de WhatsApp.

## Fuera de alcance

Agenda/turnos futuros, facturación, recordatorios automáticos.

## Criterios de aceptación

- Registrar una sesión con valores por defecto requiere elegir solo cliente y terapia.
- La ficha muestra primera visita, última visita, cantidad y terapia más frecuente correctamente (test unitario de la función que arma el resumen).
- Borrar una terapia del sitio no borra sesiones (queda `therapy_label`).
