import getAiTitle from "./getAiTitle";

/**
 * Creates a new chat room
 * @param account_id - The user's account ID
 * @param content - The initial message content
 * @param artist_id - Optional artist ID
 * @param customRoomId - Optional custom room ID to use instead of generating one
 */
const createRoom = async (
  account_id: string,
  content: string,
  artist_id?: string,
  customRoomId?: string
) => {
  try {
    const title = await getAiTitle(content);
    const topic = title.replaceAll(`\"`, "");

    let apiUrl = `/api/room/create?account_id=${encodeURIComponent(account_id)}&topic=${encodeURIComponent(topic)}`;

    if (artist_id) {
      apiUrl += `&artist_id=${encodeURIComponent(artist_id)}`;
    }

    if (customRoomId) {
      apiUrl += `&custom_id=${encodeURIComponent(customRoomId)}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.new_room;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createRoom;
