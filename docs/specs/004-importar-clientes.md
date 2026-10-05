# 004 – Importar clientes existentes

## Objetivo

Arrancar con los clientes que Serenella ya tiene (agenda en papel, contactos del teléfono, planilla, WhatsApp) en vez de una base vacía.

## Primero averiguar

- ¿Dónde está hoy la información? (cuaderno, Excel/Google Sheets, contactos)
- ¿Qué datos tiene de cada uno? (nombre, teléfono, ciudad, terapias, fechas)

## Propuesta

1. **Plantilla Google Sheets** con columnas: `nombre, telefono, email, ciudad, barrio, como_me_conocio, primera_visita, terapias, notas`. Se completa (con ayuda) una sola vez.
2. Exportar CSV → **script** `scripts/import-clients.mjs` (lo corre Facundo, no ella):
   - Normaliza teléfonos y ciudades (trim, mayúsculas, tildes).
   - Detecta duplicados por teléfono o nombre exacto y los reporta en vez de insertarlos.
   - Modo `--dry-run` que muestra qué haría.
   - Si hay `terapias` y `primera_visita`, crea una sesión histórica por terapia con `therapy_label`.
3. No construir una UI de importación: es una operación de una vez.

## Criterios de aceptación

- `--dry-run` sobre la planilla real no inserta nada y lista altas/duplicados/errores.
- Re-ejecutar el import no duplica clientes.
