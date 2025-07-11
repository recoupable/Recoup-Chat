import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type SocialFan = Tables<"social_fans">;

interface SelectSocialFansParams {
  social_ids?: string[];
}

export const selectSocialFans = async (
  params?: SelectSocialFansParams
): Promise<SocialFan[]> => {
  let query = serverClient.from("social_fans").select();

  if (params?.social_ids && params.social_ids.length > 0) {
    query = query.in("artist_social_id", params.social_ids);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error selecting social fans:", error);
    throw error;
  }

  return data;
};