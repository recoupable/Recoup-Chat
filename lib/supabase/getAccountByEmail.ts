import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

type AccountResponse = {
  account_id: string;
  email: string;
  image: string | null;
  instruction: string | null;
  organization: string | null;
};

/**
 * Gets or creates an account by email
 * @param email The email to search for or create an account with
 * @returns The account data
 * @throws Error if email is not provided or if there's a database error
 */
export async function getOrCreateAccountByEmail(
  email: string
): Promise<AccountResponse> {
  if (!email) {
    throw new Error("Email is required");
  }

  const client = getSupabaseServerAdminClient();

  // Try to find existing account
  const { data: found, error: findError } = await client
    .from("account_emails")
    .select("account_id")
    .eq("email", email)
    .single();

  if (findError && findError.code !== "PGRST116") {
    throw new Error("Error finding account");
  }

  if (found?.account_id) {
    const { data: account, error: accountError } = await client
      .from("accounts")
      .select("*, account_info(*), account_emails(*)")
      .eq("id", found.account_id)
      .single();

    if (accountError || !account?.account_info?.[0]) {
      throw new Error("Error fetching account details");
    }

    const accountInfo = account.account_info[0];
    return {
      account_id: found.account_id,
      email,
      image: accountInfo.image,
      instruction: accountInfo.instruction,
      organization: accountInfo.organization,
    };
  }

  // Create new account if not found
  const { data: newAccount, error: createError } = await client
    .from("accounts")
    .insert({
      name: "",
    })
    .select("id")
    .single();

  if (createError || !newAccount?.id) {
    throw new Error("Error creating new account");
  }

  // Add email to account
  await client.from("account_emails").insert({
    account_id: newAccount.id,
    email,
  });

  // Initialize credits
  await client.from("credits_usage").insert({
    account_id: newAccount.id,
    remaining_credits: 1,
  });

  return {
    account_id: newAccount.id,
    email,
    image: null,
    instruction: null,
    organization: null,
  };
}
