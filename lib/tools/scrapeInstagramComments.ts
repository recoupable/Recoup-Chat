import { z } from "zod";
import { tool } from "ai";
import runInstagramCommentsScraper from "@/lib/apify/comments/runInstagramCommentsScraper";
import { ApifyScraperResult } from "@/lib/apify/types";

// Define the schema for input validation
const schema = z.object({
  postUrls: z
    .array(z.string())
    .min(1, "At least one Instagram post URL is required")
    .describe("Array of Instagram post URLs to fetch comments for"),
});

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
  execute: async ({ postUrls }): Promise<ApifyScraperResult> => {
    return await runInstagramCommentsScraper(postUrls);
  },
});

export default scrapeInstagramComments;
