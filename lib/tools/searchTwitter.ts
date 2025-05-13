import { z } from "zod";
import { tool } from "ai";

// Supported search modes from the Recoup API docs
const SEARCH_MODES = ["Top", "Latest", "Photos", "Videos", "Users"] as const;
export type SearchMode = (typeof SEARCH_MODES)[number];

// Zod schema for parameter validation
const schema = z.object({
  query: z.string().min(1, "Search query is required"),
  maxTweets: z
    .number()
    .min(1)
    .max(100)
    .describe("Maximum number of tweets to return (1-1000)"),
  searchMode: z
    .enum(SEARCH_MODES)
    .optional()
    .describe("Optional search mode: Top, Latest, Photos, Videos, Users"),
});

// Types for the API response
export interface TwitterPhoto {
  id: string;
  url: string;
}

export interface TwitterVideo {
  id: string;
  preview: string;
  url: string;
}

export interface Tweet {
  id: string;
  text: string;
  username: string;
  timestamp: number;
  createdAt: string;
  isReply: boolean;
  isRetweet: boolean;
  likes: number;
  retweetCount: number;
  replies: number;
  photos: TwitterPhoto[];
  videos: TwitterVideo[];
  urls: string[];
  permanentUrl: string;
  quotedStatusId?: string;
  inReplyToStatusId?: string;
  hashtags: string[];
}

export interface SearchTwitterResponse {
  status: "success" | "error";
  tweets: Tweet[];
  message?: string;
}

const searchTwitter = tool({
  description:
    "Search for tweets using the Recoup Twitter Search API. Accepts a query, maxTweets, and optional searchMode (Top, Latest, Photos, Videos, Users). Returns an array of tweets.",
  parameters: schema,
  execute: async ({
    query,
    maxTweets,
    searchMode,
  }): Promise<SearchTwitterResponse> => {
    try {
      const url = new URL("https://api.recoupable.com/api/x/search");
      url.searchParams.append("query", query);
      url.searchParams.append("maxTweets", maxTweets.toString());
      if (searchMode) url.searchParams.append("searchMode", searchMode);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as SearchTwitterResponse;
      return {
        status: data.status,
        tweets: data.tweets,
      };
    } catch (error) {
      console.error("Error searching Twitter:", error);
      return {
        status: "error",
        tweets: [],
        message:
          error instanceof Error ? error.message : "Failed to search Twitter",
      };
    }
  },
});

export default searchTwitter;
