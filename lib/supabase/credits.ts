import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

type CreditsInfo = {
  id: number;
  account_id: string;
  remaining_credits: number;
  timestamp: string | null;
};

/**
 * Gets credits information for an account
 * @param accountId The account ID to get credits for
 * @returns Credits information
 * @throws Error if accountId is not provided or if there's a database error
 */
export async function getCredits(
  accountId: string
): Promise<CreditsInfo | null> {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  const client = getSupabaseServerAdminClient();
  const { data, error } = await client
    .from("credits_usage")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error("Error fetching credits");
  }

  return data;
}

/**
 * Decreases credits for an account
 * @param accountId The account ID to decrease credits for
 * @returns Updated credits information
 * @throws Error if accountId is not provided, no credits found, or if there's a database error
 */
export async function decreaseCredits(accountId: string): Promise<CreditsInfo> {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  const client = getSupabaseServerAdminClient();
  const credits = await getCredits(accountId);

  if (!credits) {
    throw new Error("No credits found for account");
  }

  if (credits.remaining_credits <= 0) {
    throw new Error("No credits remaining");
  }

  const { data, error } = await client
    .from("credits_usage")
    .update({
      remaining_credits: credits.remaining_credits - 1,
      timestamp: new Date().toISOString(),
    })
    .eq("account_id", accountId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Error updating credits");
  }

  return data;
}

/**
 * Increases credits for an account
 * @param accountId The account ID to increase credits for
 * @param amount Amount of credits to add (default: 1)
 * @returns Updated credits information
 * @throws Error if accountId is not provided or if there's a database error
 */
export async function increaseCredits(
  accountId: string,
  amount: number = 1
): Promise<CreditsInfo> {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  const client = getSupabaseServerAdminClient();
  const credits = await getCredits(accountId);

  if (!credits) {
    // Create new credits record if none exists
    const { data, error } = await client
      .from("credits_usage")
      .insert({
        account_id: accountId,
        remaining_credits: amount,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error("Error creating credits");
    }
    return data;
  }

  // Update existing credits
  const { data, error } = await client
    .from("credits_usage")
    .update({
      remaining_credits: credits.remaining_credits + amount,
      timestamp: new Date().toISOString(),
    })
    .eq("account_id", accountId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Error updating credits");
  }

  return data;
}
