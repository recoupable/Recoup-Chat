import { z } from "zod";
import { tool } from "ai";
import { getArtistSocials } from "../api/artist/getArtistSocials";

// Zod schema for parameter validation
const schema = z.object({
  artist_account_id: z.string().min(1, "Artist account ID is required"),
});

const getArtistSocialsTool = tool({
  description:
    "Retrieve all socials associated with an artist. This endpoint should be called before using the Social Posts endpoint to obtain the necessary social IDs.",
  parameters: schema,
  execute: async ({ artist_account_id }) => {
    try {
      const data = await getArtistSocials(artist_account_id);
      return data;
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

export default getArtistSocialsTool;
