import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

/**
 * Get all account_emails for a list of account_ids
 * @param accountIds Array of account_id to query
 * @returns Array of account_emails rows
 */
export default async function getAccountEmails(
  accountIds: string[]
): Promise<Tables<"account_emails">[]> {
  if (!Array.isArray(accountIds) || accountIds.length === 0) return [];
  const { data, error } = await supabase
    .from("account_emails")
    .select("*")
    .in("account_id", accountIds);
  if (error) {
    console.error("Error fetching account_emails:", error);
    return [];
  }
  return data || [];
}
