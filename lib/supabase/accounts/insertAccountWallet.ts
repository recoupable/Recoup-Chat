import supabase from "@/lib/supabase/serverClient";

export async function insertAccountWallet(accountId: string, wallet: string) {
  const { data, error } = await supabase
    .from("account_wallets")
    .insert({
      account_id: accountId,
      wallet,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Error inserting wallet");
  }

  return data;
}
