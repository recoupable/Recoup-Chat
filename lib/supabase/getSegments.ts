import supabase from "./serverClient";

export interface Segment {
  id: string;
  name: string;
  size: number;
  icon?: string;
}

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

export interface SegmentCount {
  segment_id: string;
  count: number;
}

export interface FanSegment {
  id: string;
  artist_segment_id: string;
  fan_social_id: string;
  created_at: string;
}

export interface SegmentWithCount extends ArtistSegment {
  fan_count: number;
}

/**
 * Get all segments associated with an artist
 */
export async function getArtistSegmentNames(
  artistId: string
): Promise<ArtistSegment[]> {
  console.log("Fetching segment names for artist:", artistId);

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
      console.log("No segments found for artist");
      return [];
    }

    console.log(`Found ${segments.length} segments`);
    return segments;
  } catch (error) {
    console.error("Error in getArtistSegmentNames:", error);
    return [];
  }
}

/**
 * Get fan counts for a list of segment IDs
 */
export async function getSegmentCounts(
  segmentIds: string[]
): Promise<SegmentCount[]> {
  console.log("Fetching fan counts for segments:", segmentIds);

  try {
    // Get all matching fan segments
    const { data: fanSegments, error: countsError } = await supabase
      .from("fan_segments")
      .select("segment_id")
      .in("segment_id", segmentIds);

    if (countsError) {
      console.error("Error fetching fan counts:", countsError);
      return [];
    }

    // Count occurrences of each segment_id
    const counts = segmentIds.map((segmentId) => ({
      segment_id: segmentId,
      count:
        fanSegments?.filter((fs) => fs.segment_id === segmentId).length || 0,
    }));

    console.log(`Found counts for ${counts.length} segments`);
    return counts;
  } catch (error) {
    console.error("Error in getSegmentCounts:", error);
    return [];
  }
}

/**
 * Get all segments with their fan counts for an artist
 */
export async function getArtistSegments(artistId: string): Promise<Segment[]> {
  const segments = await getArtistSegmentNames(artistId);
  if (!segments.length) return [];

  const segmentIds = segments.map((s) => s.segment_id);
  const counts = await getSegmentCounts(segmentIds);

  // Create a map of segment_id to count for easy lookup
  const countMap = new Map(counts.map((c) => [c.segment_id, c.count]));

  // Return segments in the format expected by BaseSegments
  return segments.map((segment) => ({
    id: segment.id,
    name: segment.segment.name,
    size: countMap.get(segment.segment_id) || 0,
    icon: undefined, // You can add icon mapping logic here if needed
  }));
}
