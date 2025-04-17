import { z } from "zod";
import { tool } from "ai";

// Response types
interface Comment {
  id: string;
  post_id: string;
  social_id: string;
  comment: string;
  commented_at: string;
}

interface CommentResponse {
  status: "success" | "error";
  comments: Comment[];
  pagination: {
    total_count: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// Zod schema for parameter validation
const schema = z.object({
  artist_account_id: z.string().min(1, "Artist account ID is required"),
  post_id: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
});

const getArtistComments = tool({
  description:
    "Retrieve comments associated with an artist or a specific post, with support for pagination.",
  parameters: schema,
  execute: async ({ artist_account_id, post_id, page, limit }) => {
    try {
      // Construct URL with query parameters
      const url = new URL("https://api.recoupable.com/api/comments");
      url.searchParams.append("artist_account_id", artist_account_id);
      if (post_id) url.searchParams.append("post_id", post_id);
      if (page) url.searchParams.append("page", page.toString());
      if (limit) url.searchParams.append("limit", limit.toString());

      // Make the API request
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as CommentResponse;

      return {
        success: true,
        ...data,
      };
    } catch (error) {
      console.error("Error fetching artist comments:", error);
      return {
        success: false,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch artist comments",
        comments: [],
        pagination: {
          total_count: 0,
          page: page || 1,
          limit: limit || 10,
          total_pages: 0,
        },
      };
    }
  },
});

export default getArtistComments;
