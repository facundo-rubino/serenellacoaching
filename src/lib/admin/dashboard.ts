import type { SupabaseClient } from "@supabase/supabase-js";
import { listClientSummaries } from "./clients";
import { topCounts } from "./session-summary";
import type { ClientRow } from "./types";

export const RECONTACT_DAYS = 60;

export async function getHomeStats(supabase: SupabaseClient) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStartDate = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}-01`;

  const [monthSessions, clientsResult, summaries] = await Promise.all([
    supabase.from("client_sessions").select("therapy_label").gte("session_date", monthStartDate),
    supabase
      .from("clients")
      .select("id,full_name,phone,city,created_at")
      .is("archived_at", null)
      .returns<Pick<ClientRow, "id" | "full_name" | "phone" | "city" | "created_at">[]>(),
    listClientSummaries(supabase),
  ]);

  if (monthSessions.error) throw monthSessions.error;
  if (clientsResult.error) throw clientsResult.error;

  const clients = clientsResult.data ?? [];
  const sessions = monthSessions.data ?? [];
  const daysSince = (id: string) => summaries.get(id)?.days_since_last ?? null;

  return {
    sessionsThisMonth: sessions.length,
    newClientsThisMonth: clients.filter((client) => new Date(client.created_at) >= monthStart).length,
    activeClients: clients.filter((client) => {
      const days = daysSince(client.id);
      return days !== null && days <= RECONTACT_DAYS;
    }).length,
    totalClients: clients.length,
    toContact: clients
      .map((client) => ({ client, days: daysSince(client.id) }))
      .filter((row): row is { client: (typeof clients)[number]; days: number } => row.days !== null && row.days > RECONTACT_DAYS)
      .sort((a, b) => b.days - a.days)
      .slice(0, 5),
    topTherapies: topCounts(sessions.map((session) => session.therapy_label)),
    topCities: topCounts(clients.map((client) => client.city)),
  };
}
