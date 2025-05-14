import { z } from "zod";
import { tool } from "ai";

// Define the schema for input validation
const schema = z.object({
  postUrls: z
    .array(z.string())
    .min(1, "At least one Instagram post URL is required")
    .describe("Array of Instagram post URLs to fetch comments for"),
});

/**
 * Interface for Instagram comments scraping result
 */
export interface InstagramCommentsResult {
  runId: string;
  datasetId: string;
  error: string | null;
}

// Define the scrape_instagram_comments tool
const scrapeInstagramComments = tool({
  description: `Scrape Instagram comments for multiple post URLs using Apify's Instagram Comment Scraper.
  
This tool will extract comments data for each post URL provided. The scraping process:
1. Submit post URLs to the Instagram Comments API
2. Return a runId and datasetId for tracking the scraping job
3. The actual comment data will be available in the Apify dataset after the run completes

Note: 
- The scraping process may take some time to complete
- Results are not real-time
- Only public comments are scraped
- Rate limits may apply based on Instagram's restrictions
- Data is scraped ethically, only collecting publicly available information`,
  parameters: schema,
  execute: async ({ postUrls }): Promise<InstagramCommentsResult> => {
    try {
      // Construct URL with postUrls as query parameters
      const url = new URL("https://api.recoupable.com/api/instagram/comments");
      postUrls.forEach((postUrl) => {
        url.searchParams.append("postUrls", postUrl);
      });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in scrapeInstagramComments tool:", error);
      return {
        runId: "",
        datasetId: "",
        error:
          error instanceof Error
            ? error.message
            : "Failed to scrape Instagram comments",
      };
    }
  },
});

export default scrapeInstagramComments;
