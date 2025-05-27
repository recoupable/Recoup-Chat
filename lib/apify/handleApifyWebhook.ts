import getDataset from "@/lib/apify/getDataset";
import { ApifyInstagramPost } from "@/types/Apify";
import saveApifyInstagramPosts from "@/lib/apify/saveApifyInstagramPosts";
import { Tables } from "@/types/database.types";
import apifyPayloadSchema from "@/lib/apify/apifyPayloadSchema";
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
        const { saveResult: sr, supabasePosts: sp } =
          await saveApifyInstagramPosts(
            dataset[0].latestPosts as ApifyInstagramPost[]
          );
        saveResult = sr;
        supabasePosts = sp;
      }
    } catch (e) {
      console.error("Failed to handle Apify webhook:", e);
    }
  }
  return { saveResult, supabasePosts };
}
