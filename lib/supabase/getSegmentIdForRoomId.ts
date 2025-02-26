import supabase from "./serverClient";

export const getSegmentIdForRoomId = async (roomId: string) => {
  console.log("[getSegmentIdForRoomId] Querying for roomId:", roomId);

  try {
    const { data, error } = await supabase
      .from("segment_rooms")
      .select("segment_id")
      .eq("room_id", roomId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log(
          `[getSegmentIdForRoomId] No segment found for roomId: ${roomId}`
        );
        return null;
      }
      console.error("[getSegmentIdForRoomId] Error:", {
        error,
        roomId,
      });
      throw error;
    }

    console.log("[getSegmentIdForRoomId] Found segmentId:", data?.segment_id);
    return data?.segment_id;
  } catch (error) {
    console.error("[getSegmentIdForRoomId] Unexpected error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      roomId,
    });
    return null;
  }
};
