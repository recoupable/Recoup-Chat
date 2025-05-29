import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

export type AccountWithInfoAndEmail = Tables<"accounts"> & {
  account_emails: Array<Pick<Tables<"account_emails">, "email">>;
  account_info: Array<Tables<"account_info">>;
  account_wallets: Array<Tables<"account_wallets">>;
};

const getAccountById = async (
  id: string
): Promise<AccountWithInfoAndEmail | null> => {
  const { data } = await supabase
    .from("accounts")
    .select(
      "*, account_emails(email), account_info(*), account_wallets(wallet)"
    )
    .eq("id", id)
    .single();
  return data || null;
};

export default getAccountById;
