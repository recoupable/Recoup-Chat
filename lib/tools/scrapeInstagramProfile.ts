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
  
This tool will extract the following data for each profile:
{
  "inputUrl": "string",              // Original Instagram profile URL
  "id": "string",                    // Instagram user ID
  "username": "string",              // Instagram username
  "url": "string",                   // Full Instagram profile URL
  "fullName": "string",              // User's full name
  "biography": "string",             // User's bio text
  "externalUrls": [{                 // Array of external URLs
    "title": "string",               // URL title
    "lynx_url": "string",           // Instagram's processed URL
    "url": "string",                // Original URL
    "link_type": "string"           // Type of link
  }],
  "externalUrl": "string|null",      // Primary external website URL
  "externalUrlShimmed": "string|null", // Processed external URL
  "followersCount": number,          // Number of followers
  "followsCount": number,            // Number of accounts followed
  "hasChannel": boolean,             // Whether user has a channel
  "highlightReelCount": number,      // Number of highlight reels
  "isBusinessAccount": boolean,      // Whether account is a business account
  "joinedRecently": boolean,         // Whether account was created recently
  "businessCategoryName": "string|null", // Business category if applicable
  "private": boolean,                // Whether account is private
  "verified": boolean,               // Whether account is verified
  "profilePicUrl": "string",         // Standard profile picture URL
  "profilePicUrlHD": "string",       // High-definition profile picture URL
  "igtvVideoCount": number,          // Number of IGTV videos
  "relatedProfiles": [],             // Array of related profiles
  "latestIgtvVideos": [{             // Array of latest IGTV videos
    "type": "string",                // Content type (e.g., "Video")
    "shortCode": "string",           // Instagram post shortcode
    "title": "string",               // Video title
    "caption": "string",             // Video caption
    "commentsCount": number,         // Number of comments
    "commentsDisabled": boolean,     // Whether comments are disabled
    "dimensionsHeight": number,      // Video height
    "dimensionsWidth": number,       // Video width
    "displayUrl": "string",          // Thumbnail URL
    "likesCount": number,            // Number of likes
    "videoDuration": number,         // Video duration in seconds
    "videoViewCount": number,        // Number of video views
    "id": "string",                  // Video ID
    "hashtags": ["string"],          // Array of hashtags
    "mentions": [],                  // Array of mentions
    "url": "string",                 // Video URL
    "firstComment": "string",        // First comment
    "latestComments": [],            // Array of latest comments
    "images": [],                    // Array of images
    "videoUrl": "string",            // Direct video URL
    "alt": "string|null",            // Alt text
    "timestamp": "string",           // Post timestamp
    "childPosts": [],                // Array of child posts
    "ownerUsername": "string",       // Owner's username
    "ownerId": "string",             // Owner's ID
    "productType": "string",         // Product type (e.g., "igtv")
    "isCommentsDisabled": boolean    // Whether comments are disabled
  }],
  "postsCount": number,              // Total number of posts
  "latestPosts": [{                  // Array of latest posts
    "id": "string",                  // Post ID
    "type": "string",                // Content type (e.g., "Video", "Image")
    "shortCode": "string",           // Instagram post shortcode
    "caption": "string",             // Post caption
    "hashtags": ["string"],          // Array of hashtags
    "mentions": [],                  // Array of mentions
    "url": "string",                 // Post URL
    "commentsCount": number,         // Number of comments
    "dimensionsHeight": number,      // Content height
    "dimensionsWidth": number,       // Content width
    "displayUrl": "string",          // Content URL
    "images": [],                    // Array of images
    "videoUrl": "string|null",       // Video URL if applicable
    "alt": "string|null",            // Alt text
    "likesCount": number,            // Number of likes
    "videoViewCount": number|null,   // Number of video views if applicable
    "timestamp": "string",           // Post timestamp
    "childPosts": [],                // Array of child posts
    "ownerUsername": "string",       // Owner's username
    "ownerId": "string",             // Owner's ID
    "productType": "string|null",    // Product type if applicable
    "isPinned": boolean,             // Whether post is pinned
    "isCommentsDisabled": boolean    // Whether comments are disabled
  }],
  "fbid": "string"                   // Facebook ID
}

The scraping process:
1. Submit handles to the Instagram Profiles API
2. Return a runId and datasetId for tracking the scraping job
3. The actual profile data will be available in the Apify dataset after the run completes

Note: 
- The scraping process may take some time to complete
- Results are not real-time
- Only public data is scraped
- Rate limits may apply based on Instagram's restrictions
- Data is scraped ethically, only collecting publicly available information`,
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
