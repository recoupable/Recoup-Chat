import { z } from "zod";
import { tool } from "ai";

// Response types
interface Social {
  id: string;
  social_id: string;
  username: string;
  profile_url: string;
  avatar: string | null;
  bio: string | null;
  follower_count: number | null;
  following_count: number | null;
  region: string | null;
  updated_at: string;
}

interface SocialResponse {
  status: "success" | "error";
  socials: Social[];
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
});

const getArtistSocials = tool({
  description:
    "Retrieve all socials associated with an artist. This endpoint should be called before using the Social Posts endpoint to obtain the necessary social IDs.",
  parameters: schema,
  execute: async ({ artist_account_id }) => {
    try {
      // Construct URL with query parameters
      const url = new URL("https://api.recoupable.com/api/artist/socials");
      url.searchParams.append("artist_account_id", artist_account_id);

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

      const data = (await response.json()) as SocialResponse;

      return {
        success: true,
        ...data,
      };
    } catch (error) {
      console.error("Error fetching artist socials:", error);
      return {
        success: false,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch artist socials",
        socials: [],
        pagination: {
          total_count: 0,
          page: 1,
          limit: 20,
          total_pages: 0,
        },
      };
    }
  },
});

export default getArtistSocials;
