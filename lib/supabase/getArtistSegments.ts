import { getArtistSegmentNames } from "./getArtistSegmentNames";
import { getSegmentCounts } from "./getSegmentCounts";

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
 * Get all segments with their fan counts for an artist
 */
export async function getArtistSegments(artistId: string): Promise<Segment[]> {
  const segments = await getArtistSegmentNames(artistId);
  if (!segments.length) return [];

  const segmentIds = segments.map((s) => s.segment_id);
  const counts = await getSegmentCounts(segmentIds);

  const countMap = new Map(counts.map((c) => [c.segment_id, c.count]));

  return segments.map((segment) => ({
    id: segment.segment_id,
    name: segment.segment.name,
    size: countMap.get(segment.segment_id) || 0,
    icon: undefined,
  }));
}
