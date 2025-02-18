import supabase from "./serverClient";

export interface ArtistSegment {
  id: string;
  segment_id: string;
  artist_account_id: string;
  created_at: string;
  segment: {
    id: string;
    name: string;
  };
}

/**
 * Get all segments associated with an artist
 */
export async function getArtistSegmentNames(
  artistId: string
): Promise<ArtistSegment[]> {
  try {
    const { data: segments, error: segmentsError } = await supabase
      .from("artist_segments")
      .select(
        `
        *,
        segment:segments(*)
      `
      )
      .eq("artist_account_id", artistId);

    if (segmentsError) {
      console.error("Error fetching segments:", segmentsError);
      return [];
    }

    if (!segments?.length) {
      return [];
    }

    return segments;
  } catch (error) {
    console.error("Error in getArtistSegmentNames:", error);
    return [];
  }
}
