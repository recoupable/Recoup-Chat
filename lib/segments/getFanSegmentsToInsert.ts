import { GenerateArrayResult } from "../ai/generateArray";
import { Tables } from "@/types/database.types";

/**
 * Returns an array of fan-segment associations to insert, based on the AI-generated segments and the inserted segment records.
 * Each fan is only associated with the segment(s) they are assigned to in the segments array.
 */
export function getFanSegmentsToInsert(
  segments: GenerateArrayResult[],
  insertedSegments: Tables<"segments">[]
) {
  // Map segment name to inserted segment id
  const segmentNameToId = new Map(
    insertedSegments.map((seg) => [seg.name, seg.id])
  );

  // Build fan-segment associations based on generateSegments output
  return segments.flatMap((segment: GenerateArrayResult) => {
    const segmentId = segmentNameToId.get(segment.segmentName);
    if (!segmentId || !segment.fans) return [];
    // segment.fans is an array of fan_social_id (string)
    return segment.fans.map((fan_social_id: string) => ({
      fan_social_id,
      segment_id: segmentId,
      updated_at: new Date().toISOString(),
    }));
  });
}
