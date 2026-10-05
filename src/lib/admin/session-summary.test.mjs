import assert from "node:assert/strict";
import test from "node:test";
import { formatSince, summarizeSessions } from "./session-summary.ts";

test("resume primera/última visita, cantidad y terapia más frecuente", () => {
  const summary = summarizeSessions([
    { session_date: "2025-03-10", therapy_label: "Reiki" },
    { session_date: "2025-05-02", therapy_label: "Masaje" },
    { session_date: "2025-06-20", therapy_label: "Reiki" },
  ]);
  assert.deepEqual(summary, {
    firstVisit: "2025-03-10",
    lastVisit: "2025-06-20",
    sessionsCount: 3,
    favoriteTherapy: "Reiki",
  });
});

test("usa la primera visita histórica si es anterior", () => {
  assert.equal(summarizeSessions([{ session_date: "2025-03-10", therapy_label: null }], "2024-01-05").firstVisit, "2024-01-05");
});

test("sin sesiones", () => {
  assert.deepEqual(summarizeSessions([]), { firstVisit: null, lastVisit: null, sessionsCount: 0, favoriteTherapy: null });
});

test("empate: gana la terapia más reciente", () => {
  const summary = summarizeSessions([
    { session_date: "2025-01-01", therapy_label: "Reiki" },
    { session_date: "2025-02-01", therapy_label: "Masaje" },
  ]);
  assert.equal(summary.favoriteTherapy, "Masaje");
});

test("formatSince", () => {
  assert.equal(formatSince(null), "sin sesiones");
  assert.equal(formatSince(21), "hace 3 semanas");
});
