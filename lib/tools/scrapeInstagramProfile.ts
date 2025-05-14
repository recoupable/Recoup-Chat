import { z } from "zod";
import { tool } from "ai";

// Define the schema for input validation
const schema = z.object({
  handles: z
    .array(z.string())
    .min(1, "At least one Instagram handle is required")
    .describe("Array of Instagram handles to fetch profiles for"),
});

/**
 * Interface for Instagram profile scraping result
 */
export interface InstagramProfileResult {
  runId: string;
  datasetId: string;
  error: string | null;
}

// Define the scrape_instagram_profile tool
const scrapeInstagramProfile = tool({
  description: `Scrape Instagram profile information for multiple handles using Apify's Instagram Profile Scraper.
  
This tool will:
1. Submit handles to the Instagram Profiles API
2. Return a runId and datasetId for tracking the scraping job
3. The actual profile data will be available in the Apify dataset after the run completes

Note: The scraping process may take some time to complete and results are not real-time.`,
  parameters: schema,
  execute: async ({ handles }): Promise<InstagramProfileResult> => {
    try {
      // Construct URL with handles as query parameters
      const url = new URL("https://api.recoupable.com/api/instagram/profiles");
      handles.forEach((handle) => {
        url.searchParams.append("handles", handle);
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
      console.error("Error in scrapeInstagramProfile tool:", error);
      return {
        runId: "",
        datasetId: "",
        error:
          error instanceof Error
            ? error.message
            : "Failed to scrape Instagram profiles",
      };
    }
  },
});

export default scrapeInstagramProfile;
