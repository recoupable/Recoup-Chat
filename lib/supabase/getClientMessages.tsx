/**
 * Client-side message fetching function that uses the public API endpoint
 * This function is safe to use in the browser as it uses the public anon key
 * and returns data in the chat interface format
 * 
 * @param chatId The ID of the chat room to fetch messages for
 * @returns Array of messages formatted for the chat UI
 */
const getClientMessages = async (chatId: string) => {
  try {
    const response = await fetch(`/api/memories/get?roomId=${chatId}`);
    const data = await response.json();

    const memories = data?.data || [];

    // eslint-disable-next-line
    return memories.map((memory: any) => ({
      ...memory.content,
    }));
  } catch (error) {
    console.error("[getClientMessages] Error fetching messages:", error);
    return [];
  }
};

export default getClientMessages; 