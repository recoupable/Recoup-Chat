import getDataset from "@/lib/apify/getDataset";
import { z } from "zod";
import apifyPayloadSchema from "@/lib/apify/apifyPayloadSchema";

// Type definition for Instagram comment data structure
export interface InstagramComment {
  id: string;
  text: string;
  timestamp: string;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  postUrl: string;
}

/**
 * Handles Instagram Comments Scraper results: fetches dataset, processes comments, and returns results.
 * @param parsed - The parsed and validated Apify webhook payload
 * @returns An object with comments and processing metadata
 */
export default async function handleInstagramCommentsScraper(
  parsed: z.infer<typeof apifyPayloadSchema>
) {
  const datasetId = parsed.resource.defaultDatasetId;
  let comments: InstagramComment[] = [];
  let processedPostUrls: string[] = [];
  let totalComments = 0;
  
  const fallbackResponse = {
    comments: [],
    processedPostUrls: [],
    totalComments: 0,
  };

  try {
    if (datasetId) {
      const dataset = await getDataset(datasetId);
      
      if (dataset && Array.isArray(dataset)) {
        // Assign comments directly from the dataset
        comments = dataset as InstagramComment[];

        // Extract unique post URLs
        processedPostUrls = Array.from(
          new Set(dataset.map((item: any) => item.postUrl).filter(Boolean))
        );
        
        totalComments = dataset.length;
        
        console.log(`Processed ${totalComments} comments from ${processedPostUrls.length} posts`);
        
        // Log sample data for debugging
        if (comments.length > 0) {
          console.log('Sample comment:', comments[0]);
        }
      }
    }

    return {
      comments,
      processedPostUrls,
      totalComments,
    };
  } catch (error) {
    console.error("Failed to handle Instagram Comments Scraper webhook:", error);
    return fallbackResponse;
  }
}