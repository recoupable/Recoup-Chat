import { z } from "zod";
import { tool } from "ai";
import getAccountSocials from "@/lib/supabase/accountSocials/getAccountSocials";
import { selectSocialFans } from "@/lib/supabase/social_fans/selectSocialFans";
import { generateSegments } from "@/lib/segments/generateSegments";
import { insertSegments } from "@/lib/supabase/segments/insertSegments";
import { insertArtistSegments } from "@/lib/supabase/artist_segments/insertArtistSegments";

// Zod schema for parameter validation
const schema = z.object({
  artist_account_id: z.string().min(1, "Artist account ID is required"),
  prompt: z.string().min(1, "Prompt is required"),
});

const createArtistSegments = tool({
  description:
    "Create artist segments by analyzing fan data and generating segment names using AI. This tool fetches all fans for an artist, generates segment names based on the provided prompt, and saves the segments to the database.",
  parameters: schema,
  execute: async ({ artist_account_id, prompt }) => {
    try {
      // Step 1: Get all social IDs for the artist
      const accountSocials = await getAccountSocials({
        accountId: artist_account_id,
      });
      const socialIds = accountSocials.map((as) => as.social_id);

      if (socialIds.length === 0) {
        return {
          success: false,
          status: "error",
          message: "No social accounts found for this artist",
          data: [],
          count: 0,
        };
      }

      // Step 2: Get all fans for the artist
      const fans = await selectSocialFans({ social_ids: socialIds });

      if (fans.length === 0) {
        return {
          success: false,
          status: "error",
          message: "No fans found for this artist",
          data: [],
          count: 0,
        };
      }

      // Step 3: Generate segment names using AI
      const segmentNames = await generateSegments({ fans, prompt });
      console.log("segmentNames", segmentNames);
      if (segmentNames.length === 0) {
        return {
          success: false,
          status: "error",
          message: "Failed to generate segment names",
          data: [],
          count: 0,
        };
      }

      // Step 4: Insert segments into the database
      const segmentsToInsert = segmentNames.map((name) => ({
        name,
        updated_at: new Date().toISOString(),
      }));

      const insertedSegments = await insertSegments(segmentsToInsert);

      // Step 5: Associate segments with the artist
      const artistSegmentsToInsert = insertedSegments.map((segment) => ({
        artist_account_id,
        segment_id: segment.id,
        updated_at: new Date().toISOString(),
      }));

      const insertedArtistSegments = await insertArtistSegments(
        artistSegmentsToInsert
      );

      return {
        success: true,
        status: "success",
        message: `Successfully created ${segmentNames.length} segments for artist`,
        data: {
          segments: insertedSegments,
          artist_segments: insertedArtistSegments,
          segment_names: segmentNames,
        },
        count: segmentNames.length,
      };
    } catch (error) {
      console.error("Error creating artist segments:", error);
      return {
        success: false,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create artist segments",
        data: [],
        count: 0,
      };
    }
  },
});

export default createArtistSegments;
