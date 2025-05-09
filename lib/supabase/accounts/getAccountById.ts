import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

const getAccountById = async (
  id: string
): Promise<Tables<"accounts"> | null> => {
  const { data } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();
  return data || null;
};

export default getAccountById;
