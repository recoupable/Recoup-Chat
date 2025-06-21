import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

/**
 * Get account_email for a single account_id
 * @param accountId The account_id to query
 * @returns The email string or null if not found
 */
export default async function getAccountEmail(
  accountId: string
): Promise<string | null> {
  if (!accountId) return null;
  
  const { data, error } = await supabase
    .from("account_emails")
    .select("email")
    .eq("account_id", accountId)
    .single();
    
  if (error) {
    console.error("Error fetching account_email:", error);
    return null;
  }
  
  return data?.email || null;
}