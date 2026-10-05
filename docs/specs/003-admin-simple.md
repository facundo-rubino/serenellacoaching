# 003 – Admin simple: navegación y pantalla de inicio

## Objetivo

Que al entrar al admin Serenella entienda en 5 segundos qué puede hacer, sin explicación.

## Navegación

Barra inferior fija en celular / lateral en escritorio, con íconos + texto:

| Ícono | Texto | Ruta |
| --- | --- | --- |
| casa | Inicio | `/admin` |
| personas | Clientes | `/admin/clientes` |
| calendario | Sesiones | `/admin/sesiones` |
| globo | Mi sitio | `/admin/sitio` |

"Avanzado" solo aparece para rol `owner` (spec 000).

## Pantalla de inicio

1. Botones grandes: **"Registrar sesión"** y **"Nuevo cliente"**.
2. Tarjetas con números del mes: sesiones, clientes nuevos, clientes activos.
3. Lista corta "Hace tiempo que no vienen" (top 5, spec 002) con botón WhatsApp.
4. Top 3 terapias del mes y top 3 ciudades.

Sin gráficos complejos: números y listas.

## Guía de estilo del admin

- Tipografía ≥ 16px, botones ≥ 44px de alto, alto contraste.
- Confirmación clara tras guardar ("Cliente guardado ✓") — ya existe `sonner`.
- Antes de borrar: confirmación con el nombre ("¿Borrar a Ana Pérez?"). Preferir **archivar** a borrar.
- Mensajes de error en castellano y accionables ("Falta el nombre"), nunca códigos.
- Fechas relativas ("hace 2 semanas") + fecha exacta al tocar.

## Criterios de aceptación

- Prueba real: Serenella carga un cliente y registra una sesión sin ayuda. Anotar dónde dudó y ajustar.
- Lighthouse accesibilidad ≥ 95 en `/admin` y `/admin/clientes`.
