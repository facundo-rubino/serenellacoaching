#!/usr/bin/env node
// Importa clientes desde un CSV (ver docs/specs/004-importar-clientes.md).
//
//   node scripts/import-clients.mjs clientes.csv --dry-run   # solo muestra qué haría
//   node scripts/import-clients.mjs clientes.csv             # inserta
//
// Variables: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (solo en tu máquina, nunca en el repo).
// Columnas: nombre, telefono, email, ciudad, barrio, como_me_conocio, primera_visita, terapias, notas

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SOURCES = {
  recomendacion: "recomendacion",
  recomendada: "recomendacion",
  referido: "recomendacion",
  instagram: "instagram",
  facebook: "facebook",
  google: "google",
  "sitio web": "sitio_web",
  web: "sitio_web",
  otro: "otro",
};
const LOWER_WORDS = new Set(["de", "del", "la", "las", "los", "el", "y"]);

export const stripAccents = (value) => value.normalize("NFD").replace(/[̀-ͯ]/g, "");
const clean = (value) => (value ?? "").replace(/\s+/g, " ").trim();

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "");
  const firstLine = input.split(/\r?\n/, 1)[0];
  const delimiter = firstLine.split(";").length > firstLine.split(",").length ? ";" : ",";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);

  const [header, ...body] = rows;
  const keys = (header ?? []).map((name) => stripAccents(name).trim().toLowerCase());
  return body.map((cells) => Object.fromEntries(keys.map((key, index) => [key, clean(cells[index])])));
}

export function titleCase(value) {
  return clean(value)
    .toLowerCase()
    .split(" ")
    .map((word, index) => (index > 0 && LOWER_WORDS.has(stripAccents(word)) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

export function normalizePhone(value) {
  const phone = clean(value).replace(/[^\d+]/g, "");
  return phone || null;
}

export const phoneKey = (phone) => (phone ? phone.replace(/\D/g, "").slice(-10) : null);
export const nameKey = (name) => stripAccents(clean(name)).toLowerCase();

/** Unifica "Cordoba" / "Córdoba": gana la variante con tildes ya cargada o la primera del archivo. */
export function makePlaceNormalizer(existing = []) {
  const canonical = new Map();
  for (const place of existing) canonical.set(nameKey(place), place);
  return (value) => {
    const place = titleCase(value);
    if (!place) return null;
    const key = nameKey(place);
    const known = canonical.get(key);
    if (!known || (stripAccents(known) === known && place !== known && stripAccents(place) !== place)) canonical.set(key, place);
    return canonical.get(key);
  };
}

export function parseDate(value) {
  const text = clean(value);
  if (!text) return null;
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const local = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  const [y, m, d] = iso ? iso.slice(1) : local ? [local[3].length === 2 ? `20${local[3]}` : local[3], local[2], local[1]] : [];
  if (!y) return undefined;
  const date = new Date(Date.UTC(+y, +m - 1, +d));
  return date.getUTCFullYear() === +y && date.getUTCMonth() === +m - 1 && date.getUTCDate() === +d
    ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    : undefined;
}

/** Devuelve { toInsert, duplicates, errors } sin tocar la base. */
export function planImport(rows, existingClients, therapies, existingPlaces = []) {
  const byPhone = new Map(existingClients.filter((c) => phoneKey(c.phone)).map((c) => [phoneKey(c.phone), c.full_name]));
  const byName = new Map(existingClients.map((c) => [nameKey(c.full_name), c.full_name]));
  const therapyByName = new Map(therapies.map((t) => [nameKey(t.title), t]));
  const normalizePlace = makePlaceNormalizer(existingPlaces);
  const toInsert = [];
  const duplicates = [];
  const errors = [];

  rows.forEach((row, index) => {
    const line = index + 2;
    const name = titleCase(row.nombre);
    if (!name) return errors.push({ line, message: "Falta el nombre" });

    const phone = normalizePhone(row.telefono);
    const email = clean(row.email).toLowerCase() || null;
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return errors.push({ line, name, message: `Email inválido: ${email}` });

    const firstVisit = parseDate(row.primera_visita);
    if (firstVisit === undefined) return errors.push({ line, name, message: `Fecha inválida: ${row.primera_visita}` });

    const source = clean(row.como_me_conocio) ? SOURCES[nameKey(row.como_me_conocio)] : null;
    if (clean(row.como_me_conocio) && !source) return errors.push({ line, name, message: `"Cómo me conoció" no reconocido: ${row.como_me_conocio}` });

    const clash = (phoneKey(phone) && byPhone.get(phoneKey(phone))) || byName.get(nameKey(name));
    if (clash) return duplicates.push({ line, name, matches: clash });

    const sessions = firstVisit
      ? clean(row.terapias)
          .split(/[;|,]/)
          .map(clean)
          .filter(Boolean)
          .map((label) => {
            const therapy = therapyByName.get(nameKey(label));
            return { therapy_id: therapy?.id ?? null, therapy_label: therapy?.title ?? label, session_date: firstVisit };
          })
      : [];

    if (phoneKey(phone)) byPhone.set(phoneKey(phone), name);
    byName.set(nameKey(name), name);
    toInsert.push({
      line,
      client: {
        full_name: name,
        phone,
        email,
        city: normalizePlace(row.ciudad),
        area: normalizePlace(row.barrio),
        referral_source: source,
        first_visit_date: firstVisit,
        notes: clean(row.notas) || null,
      },
      sessions,
    });
  });

  return { toInsert, duplicates, errors };
}

async function main() {
  const args = process.argv.slice(2);
  const file = args.find((arg) => !arg.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  if (!file) {
    console.error("Uso: node scripts/import-clients.mjs <archivo.csv> [--dry-run]");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const [clients, therapies] = await Promise.all([
    supabase.from("clients").select("full_name,phone,city,area"),
    supabase.from("content_items").select("id,title").eq("type", "therapy"),
  ]);
  for (const result of [clients, therapies]) if (result.error) throw result.error;

  const places = [...new Set(clients.data.flatMap((c) => [c.city, c.area]).filter(Boolean))];
  const plan = planImport(parseCsv(readFileSync(file, "utf8")), clients.data, therapies.data, places);
  const sessionCount = plan.toInsert.reduce((sum, item) => sum + item.sessions.length, 0);

  console.log(`${dryRun ? "[dry-run] " : ""}Altas: ${plan.toInsert.length} (${sessionCount} sesiones históricas)`);
  for (const item of plan.toInsert) console.log(`  + ${item.client.full_name}${item.client.city ? ` · ${item.client.city}` : ""}`);
  console.log(`Duplicados (no se insertan): ${plan.duplicates.length}`);
  for (const item of plan.duplicates) console.log(`  = línea ${item.line}: ${item.name} ya existe como "${item.matches}"`);
  console.log(`Errores: ${plan.errors.length}`);
  for (const item of plan.errors) console.log(`  ! línea ${item.line}${item.name ? ` (${item.name})` : ""}: ${item.message}`);

  if (dryRun) return console.log("\nNo se insertó nada.");
  if (plan.errors.length) {
    console.error("\nCorregí los errores y volvé a correr; no se insertó nada.");
    process.exit(1);
  }

  for (const item of plan.toInsert) {
    const { data, error } = await supabase.from("clients").insert(item.client).select("id").single();
    if (error) throw new Error(`Línea ${item.line}: ${error.message}`);
    if (item.sessions.length) {
      const { error: sessionError } = await supabase
        .from("client_sessions")
        .insert(item.sessions.map((session) => ({ ...session, client_id: data.id })));
      if (sessionError) throw new Error(`Línea ${item.line} (sesiones): ${sessionError.message}`);
    }
  }
  console.log("\nImportación terminada.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  });
}
