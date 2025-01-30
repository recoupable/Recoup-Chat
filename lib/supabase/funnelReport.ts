import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { Database } from "@/packages/supabase/src/database.types";

type FunnelReport = Database["public"]["Tables"]["funnel_reports"]["Row"];

/**
 * Gets a funnel report by ID
 * @param id The report ID to fetch
 * @returns The funnel report data
 * @throws Error if id is not provided or if there's a database error
 */
export async function getFunnelReport(
  id: string
): Promise<FunnelReport | null> {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const client = getSupabaseServerAdminClient();
  const { data, error } = await client
    .from("funnel_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error("Error fetching funnel report");
  }

  return data;
}

/**
 * Saves a funnel report
 * @param report The report data to save
 * @returns The saved report data
 * @throws Error if required data is missing or if there's a database error
 */
export async function saveFunnelReport(
  report: Omit<FunnelReport, "id">
): Promise<FunnelReport> {
  const client = getSupabaseServerAdminClient();
  const { data, error } = await client
    .from("funnel_reports")
    .insert(report)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Error saving funnel report");
  }

  return data;
}

/**
 * Updates a funnel report
 * @param id The report ID to update
 * @param updates The fields to update
 * @returns The updated report data
 * @throws Error if id is not provided, report not found, or if there's a database error
 */
export async function updateFunnelReport(
  id: string,
  updates: Partial<Omit<FunnelReport, "id">>
): Promise<FunnelReport> {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const client = getSupabaseServerAdminClient();
  const { data, error } = await client
    .from("funnel_reports")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Error updating funnel report");
  }

  return data;
}
