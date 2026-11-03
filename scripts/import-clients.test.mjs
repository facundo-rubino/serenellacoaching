import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, parseDate, planImport } from "./import-clients.mjs";

const csv = `nombre,telefono,email,ciudad,barrio,como_me_conocio,primera_visita,terapias,notas
ana perez,11 5555-1234,,Cordoba,centro,Instagram,15/03/2025,"Reiki; Masaje","Dice ""hola"", vuelve"
Ana Pérez,+54 11 5555 1234,,Córdoba,,,,,
Luis Gómez,,luis@x.com,córdoba,,,,,
,123,,,,,,,
Eva,,mal,,,,,,
`;

test("parseCsv respeta comillas y comas", () => {
  const rows = parseCsv(csv);
  assert.equal(rows.length, 5);
  assert.equal(rows[0].notas, 'Dice "hola", vuelve');
});

test("parseDate", () => {
  assert.equal(parseDate("15/03/2025"), "2025-03-15");
  assert.equal(parseDate("2025-3-5"), "2025-03-05");
  assert.equal(parseDate("31/02/2025"), undefined);
  assert.equal(parseDate(""), null);
});

test("planImport: altas, duplicados por teléfono, errores y sesiones", () => {
  const plan = planImport(parseCsv(csv), [], [{ id: "t1", title: "Reiki" }]);
  assert.deepEqual(plan.toInsert.map((i) => i.client.full_name), ["Ana Perez", "Luis Gómez"]);
  assert.equal(plan.duplicates.length, 1);
  assert.equal(plan.errors.length, 2);
  const [first] = plan.toInsert;
  assert.deepEqual(first.sessions.map((s) => [s.therapy_id, s.therapy_label]), [["t1", "Reiki"], [null, "Masaje"]]);
  assert.equal(plan.toInsert[1].client.city, "Córdoba");
});

test("re-ejecutar no duplica", () => {
  const first = planImport(parseCsv(csv), [], []);
  const existing = first.toInsert.map((i) => i.client);
  const second = planImport(parseCsv(csv), existing, []);
  assert.equal(second.toInsert.length, 0);
});

test("parseCsv detecta ; como separador (Excel es-AR)", () => {
  const rows = parseCsv("nombre;ciudad\nAna;Rosario\n");
  assert.deepEqual(rows, [{ nombre: "Ana", ciudad: "Rosario" }]);
});
