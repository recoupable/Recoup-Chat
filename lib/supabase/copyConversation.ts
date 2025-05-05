import supabase from "./serverClient";
import createNewRoom from "./createNewRoom";
import copyMessages from "./copyMessages";

/**
 * Copies a conversation to a new room with a different artist
 *
 * @param sourceRoomId The ID of the source room
 * @param artistId The ID of the artist to associate with the new room
 * @returns The ID of the new room or null if operation failed
 */
export async function copyConversation(
  sourceRoomId: string,
  artistId: string
): Promise<string | null> {
  try {
    // Get the source room data
    const { data: sourceRoom, error: roomError } = await supabase
      .from("rooms")
      .select("account_id, topic")
      .eq("id", sourceRoomId)
      .single();

    if (roomError || !sourceRoom) {
      console.error("Error getting source room:", roomError);
      return null;
    }

    // Create new room with same account but new artist
    const newRoomId = await createNewRoom({
      account_id: sourceRoom.account_id,
      artist_id: artistId,
      topic: sourceRoom.topic || "New conversation",
    });

    if (!newRoomId) {
      console.error("Failed to create new room");
      return null;
    }

    // Copy messages from source room to new room
    const messagesCopied = await copyMessages(sourceRoomId, newRoomId, false);

    if (messagesCopied === null) {
      console.error("Error copying messages, but room was created");
      // Still return the room ID even if message copying failed
    } else {
      console.log(`Successfully copied ${messagesCopied} messages to new room`);
    }

    return newRoomId;
  } catch (error) {
    console.error("Error in copyConversation:", error);
    return null;
  }
}

export default copyConversation;
