import getAiTitle from "./getAiTitle";

/**
 * Create a new chat room
 * @param account_id - The user's account ID
 * @param content - The initial message content
 * @param artist_id - Optional artist ID to associate with the room
 * @param chatId - Optional specific UUID to use for the room ID
 * @returns The newly created room object or null if an error occurs
 */
const createRoom = async (
  account_id: string,
  content: string,
  artist_id?: string,
  chatId?: string
) => {
  try {
    const title = await getAiTitle(content);
    const topic = title.replaceAll(`\"`, "");
    let apiUrl = `/api/room/create?account_id=${encodeURIComponent(account_id)}&topic=${encodeURIComponent(topic)}`;

    if (artist_id) {
      apiUrl += `&artist_id=${encodeURIComponent(artist_id)}`;
    }

    if (chatId) {
      apiUrl += `&chat_id=${encodeURIComponent(chatId)}`;
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
