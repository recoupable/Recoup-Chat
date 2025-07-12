import getAccountSocials from "../supabase/accountSocials/getAccountSocials";
import { selectSocialFans } from "../supabase/social_fans/selectSocialFans";
import { generateSegments } from "./generateSegments";
import { insertSegments } from "../supabase/segments/insertSegments";
import { deleteSegments } from "../supabase/segments/deleteSegments";
import { insertArtistSegments } from "../supabase/artist_segments/insertArtistSegments";
import { Tables } from "@/types/database.types";
import { successResponse, errorResponse } from "./createSegmentResponses";

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
    const segmentNames = await generateSegments({ fans, prompt });

    if (segmentNames.length === 0) {
      return errorResponse("Failed to generate segment names");
    }

    // Step 4: Delete existing segments for the artist
    await deleteSegments(artist_account_id);

    // Step 5: Insert segments into the database
    const segmentsToInsert = segmentNames.map((name: string) => ({
      name,
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

    return successResponse(
      `Successfully created ${segmentNames.length} segments for artist`,
      {
        segments: insertedSegments,
        artist_segments: insertedArtistSegments,
        segment_names: segmentNames,
      },
      segmentNames.length
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
