import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClientRow } from "./types";

export type ClientFilters = {
  q?: string;
  city?: string;
  archived?: boolean;
};

export async function listClients(supabase: SupabaseClient, filters: ClientFilters = {}) {
  let query = supabase.from("clients").select("*").order("full_name", { ascending: true });

  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);

  if (filters.city) {
    query = query.eq("city", filters.city);
  }

  const term = filters.q?.trim().replace(/[%,()*]/g, " ").trim();
  if (term) {
    query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, error } = await query.returns<ClientRow[]>();
  if (error) throw error;
  return data ?? [];
}

export async function getClient(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle<ClientRow>();
  if (error) throw error;
  return data;
}

export async function listClientPlaces(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("clients").select("city,area");
  if (error) throw error;
  const unique = (values: (string | null)[]) =>
    [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "es"));
  return {
    cities: unique((data ?? []).map((row) => row.city)),
    areas: unique((data ?? []).map((row) => row.area)),
  };
}

export async function listClientNames(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("clients").select("id,full_name").order("full_name");
  if (error) throw error;
  return (data ?? []) as { id: string; full_name: string }[];
}

export function whatsappUrl(phone: string | null) {
  const digits = phone?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
