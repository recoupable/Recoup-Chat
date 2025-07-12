import getAccountSocials from "../supabase/accountSocials/getAccountSocials";
import { selectSocialFans } from "../supabase/social_fans/selectSocialFans";
import { generateSegments } from "./generateSegments";
import { insertSegments } from "../supabase/segments/insertSegments";
import { deleteSegments } from "../supabase/segments/deleteSegments";
import { insertArtistSegments } from "../supabase/artist_segments/insertArtistSegments";
import { insertFanSegments } from "../supabase/fan_segments/insertFanSegments";
import { Tables } from "@/types/database.types";
import { successResponse, errorResponse } from "./createSegmentResponses";
import { GenerateArrayResult } from "../ai/generateArray";
import { getFanSegmentsToInsert } from "./getFanSegmentsToInsert";

interface CreateArtistSegmentsParams {
  artist_account_id: string;
  prompt: string;
}

export const createArtistSegments = async ({
  artist_account_id,
  prompt,
}: CreateArtistSegmentsParams) => {
  try {
    // Step 1: Get all social IDs for the artist
    const accountSocials = await getAccountSocials({
      accountId: artist_account_id,
    });
    const socialIds = accountSocials.map(
      (as: { social_id: string }) => as.social_id
    );

    if (socialIds.length === 0) {
      return errorResponse("No social accounts found for this artist");
    }

    // Step 2: Get all fans for the artist
    const fans = await selectSocialFans({ social_ids: socialIds });

    if (fans.length === 0) {
      return errorResponse("No fans found for this artist");
    }

    // Step 3: Generate segment names using AI
    const segments = await generateSegments({ fans, prompt });

    if (segments.length === 0) {
      return errorResponse("Failed to generate segment names");
    }

    // Step 4: Delete existing segments for the artist
    await deleteSegments(artist_account_id);

    // Step 5: Insert segments into the database
    const segmentsToInsert = segments.map((segment: GenerateArrayResult) => ({
      name: segment.segmentName,
      updated_at: new Date().toISOString(),
    }));

    const insertedSegments = await insertSegments(segmentsToInsert);

    // Step 6: Associate segments with the artist
    const artistSegmentsToInsert = insertedSegments.map(
      (segment: Tables<"segments">) => ({
        artist_account_id,
        segment_id: segment.id,
        updated_at: new Date().toISOString(),
      })
    );

    const insertedArtistSegments = await insertArtistSegments(
      artistSegmentsToInsert
    );

    // Step 7: Associate fans with the new segments
    const fanSegmentsToInsert = getFanSegmentsToInsert(
      segments,
      insertedSegments
    );
    const insertedFanSegments = await insertFanSegments(fanSegmentsToInsert);

    return successResponse(
      `Successfully created ${segments.length} segments for artist`,
      {
        supabase_segments: insertedSegments,
        supabase_artist_segments: insertedArtistSegments,
        supabase_fan_segments: insertedFanSegments,
        segments,
      },
      segments.length
    );
  } catch (error) {
    console.error("Error creating artist segments:", error);
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to create artist segments"
    );
  }
};
