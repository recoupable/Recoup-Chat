import supabase from "../serverClient";
import type { Tables } from "@/types/database.types";

const getAccountSocialByAccountAndSocialId = async (
  accountId: string,
  socialId: string
): Promise<Tables<"account_socials"> | null> => {
  const { data } = await supabase
    .from("account_socials")
    .select("*")
    .eq("account_id", accountId)
    .eq("social_id", socialId)
    .single();
  return data || null;
};

export default getAccountSocialByAccountAndSocialId;
