import supabase from "../serverClient";
import type { TablesInsert } from "@/types/database.types";

/**
 * Creates records in the social_posts table.
 * @param socialPosts - Array of rows to insert.
 * @returns Supabase insert result
 */
export default async function insertSocialPosts(
  socialPosts: TablesInsert<"social_posts">[],
) {
  const { data, error } = await supabase
    .from("social_posts")
    .insert(socialPosts);
  return { data, error };
}
