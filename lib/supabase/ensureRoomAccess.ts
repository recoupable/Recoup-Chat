import supabase from "./serverClient";
import generateUUID from "../generateUUID";
import getRoom from "./getRoom";

/**
 * Ensures the user has access to a room by creating a copy of a shared room
 * @param sourceRoomId The ID of the original room being shared
 * @param accountId The ID of the user to grant access to
 * @returns The ID of the user's room (new or existing)
 */
export async function ensureRoomAccess(
  sourceRoomId: string, 
  accountId: string
): Promise<string | null> {
  try {
    // Check for existing room
    const { data: existingRoom } = await supabase
      .from("rooms")
      .select("id")
      .eq("id", sourceRoomId)
      .eq("account_id", accountId)
      .maybeSingle();
    
    // Check if room has messages
    if (existingRoom) {
      const { data: messages } = await supabase
        .from("memories")
        .select("id")
        .eq("room_id", sourceRoomId)
        .limit(1);
      
      if (messages && messages.length > 0) return sourceRoomId;
    }
    
    // Get source room data
    const roomData = await getRoom(sourceRoomId);
    if (!roomData?.topic) return null;
    
    // Create or use room
    const roomId = existingRoom ? existingRoom.id : generateUUID();
    
    // Create room if it doesn't exist
    if (!existingRoom) {
      const { error } = await supabase.from("rooms").insert({
        id: roomId,
        account_id: accountId,
        artist_id: roomData.artist_id,
        topic: roomData.topic
      });
      
      if (error) return null;
    }
    
    // Copy messages
    await copyRoomMessages(sourceRoomId, roomId, !!existingRoom);
    
    return roomId;
  } catch (error) {
    console.error("Error ensuring room access:", error);
    return null;
  }
}

/**
 * Copies messages from source room to target room
 */
async function copyRoomMessages(
  sourceRoomId: string,
  targetRoomId: string,
  clearExisting: boolean
): Promise<void> {
  try {
    // Get messages from source room
    const { data: messages } = await supabase
      .from("memories")
      .select("content, updated_at")
      .eq("room_id", sourceRoomId)
      .order("updated_at", { ascending: true });
    
    if (!messages || messages.length === 0) return;
    
    // Clear existing messages if needed
    if (clearExisting) {
      await supabase
        .from("memories")
        .delete()
        .eq("room_id", targetRoomId);
    }
    
    // Prepare new messages
    const newMessages = messages.map(msg => ({
      id: generateUUID(),
      room_id: targetRoomId,
      content: msg.content,
      updated_at: msg.updated_at
    }));
    
    // Insert messages
    await supabase.from("memories").insert(newMessages);
  } catch (error) {
    console.error("Error copying room messages:", error);
  }
} 