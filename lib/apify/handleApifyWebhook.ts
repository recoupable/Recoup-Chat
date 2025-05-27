import getDataset from "@/lib/apify/getDataset";
import { ApifyInstagramPost } from "@/types/Apify";
import insertPosts from "@/lib/supabase/posts/insertPosts";
import getPosts from "@/lib/supabase/posts/getPosts";
import { TablesInsert, Tables } from "@/types/database.types";
import { apifyPayloadSchema } from "@/app/api/apify/route";
import { z } from "zod";

/**
 * Handles the Apify webhook payload: fetches dataset, saves posts, and returns results.
 * @param parsed - The parsed and validated Apify webhook payload
 * @returns An object with saveResult and supabasePosts
 */
export default async function handleApifyWebhook(
  parsed: z.infer<typeof apifyPayloadSchema>
) {
  const datasetId = parsed.resource.defaultDatasetId;
  let saveResult = null;
  let supabasePosts: Tables<"posts">[] = [];
  if (datasetId) {
    try {
      const dataset = await getDataset(datasetId);
      if (Array.isArray(dataset) && dataset[0]?.latestPosts) {
        const posts = dataset[0].latestPosts.map(
          (post: ApifyInstagramPost) => ({
            post_url: post.url,
            updated_at: post.timestamp,
          })
        ) as TablesInsert<"posts">[];
        const postUrls = posts.map((post) => post.post_url);
        saveResult = await insertPosts(posts);
        supabasePosts = await getPosts(postUrls);
      }
    } catch (e) {
      console.error("Failed to handle Apify webhook:", e);
    }
  }
  return { saveResult, supabasePosts };
}
