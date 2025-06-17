import supabase from "./serverClient";

export async function deleteMemoriesByRoomId(roomId: string) {
  try {
    const { error, count } = await supabase
      .from("memories")
      .delete({ count: "exact" })
      .eq("room_id", roomId);

    if (error) {
      console.error("Failed to delete memories:", error.message);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Failed to delete memories by room_id from database");
    throw error;
  }
} 