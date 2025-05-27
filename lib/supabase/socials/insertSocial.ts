import supabase from "../serverClient";
import type { Tables, TablesInsert } from "@/types/database.types";

const insertSocial = async (
  social: TablesInsert<"socials">
): Promise<Tables<"socials"> | null> => {
  const { data } = await supabase
    .from("socials")
    .upsert(social, { onConflict: "profile_url" })
    .select("*")
    .single();
  return data || null;
};

export default insertSocial;
