import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

const insertAccount = async (account: {
  name: string;
}): Promise<Tables<"accounts"> | null> => {
  const { data } = await supabase
    .from("accounts")
    .insert(account)
    .select("*")
    .single();
  return data || null;
};

export default insertAccount;
