import createNewRoom from "./createNewRoom";
import getRoom from "./getRoom";

/**
 * Create a new room based on an existing room's data
 * (does not copy messages - only creates the room)
 *
 * @param sourceRoomId The ID of the source room to use as a template
 * @param artistId The ID of the artist for the new room
 * @returns The ID of the new room or null if operation failed
 */
export async function copyRoom(
  sourceRoomId: string,
  artistId: string
): Promise<string | null> {
  try {
    // Get the source room data using getRoom utility
    const sourceRoom = await getRoom(sourceRoomId);

    if (!sourceRoom) {
      console.error("Error getting source room");
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

    return newRoomId;
  } catch (error) {
    console.error("Error in copyRoom:", error);
    return null;
  }
}

export default copyRoom;
