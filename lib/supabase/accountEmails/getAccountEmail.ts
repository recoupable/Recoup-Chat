import supabase from "@/lib/supabase/serverClient";

/**
 * Get the email for a specific account_id
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
    console.error("Error fetching account email:", error);
    return null;
  }
  
  return data?.email || null;
}