import supabase from "./serverClient";

export const getSegmentIdForRoomId = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from("segment_rooms")
      .select("segment_id")
      .eq("room_id", roomId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("[getSegmentIdForRoomId] Error:", {
        error,
        roomId,
      });
      throw error;
    }

    return data?.segment_id;
  } catch (error) {
    console.error("[getSegmentIdForRoomId] Unexpected error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      roomId,
    });
    return null;
  }
};
