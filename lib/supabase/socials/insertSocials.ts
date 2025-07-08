import supabase from "../serverClient";
import type { Tables, TablesInsert } from "@/types/database.types";

const insertSocials = async (
  socials: TablesInsert<"socials">[]
): Promise<Tables<"socials">[]> => {
  const { data } = await supabase
    .from("socials")
    .upsert(socials, { onConflict: "profile_url" })
    .select("*");
  return data || [];
};

export default insertSocials;