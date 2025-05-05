/**
 * Copy conversation from source room to a new room with the specified artist
 *
 * @param sourceRoomId The ID of the source room to copy from
 * @param artistId The ID of the artist to associate with the new room
 * @returns The ID of the new room or null if failed
 */
export async function copyRoomToArtist(
  sourceRoomId: string,
  artistId: string
): Promise<string | null> {
  try {
    const response = await fetch(`/api/room/copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceRoomId,
        artistId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to copy room:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.newRoomId || null;
  } catch (error) {
    console.error("Error copying room:", error);
    return null;
  }
}

export default copyRoomToArtist;
