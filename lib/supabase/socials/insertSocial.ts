import supabase from "../serverClient";
import type { Tables } from "@/types/database.types";

const insertSocial = async (
  username: string,
  profileUrl: string
): Promise<Tables<"socials"> | null> => {
  const { data } = await supabase
    .from("socials")
    .insert({ username, profile_url: profileUrl })
    .select("*")
    .single();
  return data || null;
};

export default insertSocial;
