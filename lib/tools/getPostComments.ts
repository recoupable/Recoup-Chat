import { z } from "zod";
import { tool } from "ai";

// Response types
interface Comment {
  id: string;
  post_id: string;
  social_id: string;
  comment: string;
  commented_at: string;
  username: string;
  avatar: string | null;
  profile_url: string;
  post_url: string;
  region: string | null;
  bio: string | null;
  follower_count: number | null;
  following_count: number | null;
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
  post_id: z.string().min(1, "Post ID is required"),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
});

const getPostComments = tool({
  description:
    "Retrieve comments for a specific social media post. This endpoint should be called after obtaining post IDs from the Social Posts endpoint.",
  parameters: schema,
  execute: async ({ post_id, page = 1, limit = 20 }) => {
    try {
      // Construct URL with query parameters
      const url = new URL("https://api.recoupable.com/api/post/comments");
      url.searchParams.append("post_id", post_id);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

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
      console.error("Error fetching post comments:", error);
      return {
        success: false,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch post comments",
        comments: [],
        pagination: {
          total_count: 0,
          page: page,
          limit: limit,
          total_pages: 0,
        },
      };
    }
  },
});

export default getPostComments;
