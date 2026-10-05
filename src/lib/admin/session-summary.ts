type SummarySession = {
  session_date: string;
  therapy_label: string | null;
};

export type SessionSummary = {
  firstVisit: string | null;
  lastVisit: string | null;
  sessionsCount: number;
  favoriteTherapy: string | null;
};

export function summarizeSessions(sessions: SummarySession[], firstVisitDate: string | null = null): SessionSummary {
  const dates = sessions.map((session) => session.session_date).sort();
  const candidates = [firstVisitDate, dates[0]].filter((value): value is string => Boolean(value)).sort();
  const counts = new Map<string, { count: number; latest: string }>();

  for (const session of sessions) {
    const label = session.therapy_label?.trim();
    if (!label) continue;
    const current = counts.get(label);
    counts.set(label, {
      count: (current?.count ?? 0) + 1,
      latest: current && current.latest > session.session_date ? current.latest : session.session_date,
    });
  }

  const favorite = [...counts.entries()].sort(
    (a, b) => b[1].count - a[1].count || b[1].latest.localeCompare(a[1].latest),
  )[0];

  return {
    firstVisit: candidates[0] ?? null,
    lastVisit: dates.at(-1) ?? null,
    sessionsCount: sessions.length,
    favoriteTherapy: favorite?.[0] ?? null,
  };
}

export function formatSince(days: number | null) {
  if (days === null) return "sin sesiones";
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 14) return `hace ${days} días`;
  if (days < 60) return `hace ${Math.round(days / 7)} semanas`;
  if (days < 365) return `hace ${Math.round(days / 30)} meses`;
  return `hace ${Math.round(days / 365)} año${Math.round(days / 365) === 1 ? "" : "s"}`;
}
