const getClientMessages = async (chatId: string) => {
  try {
    console.log(`getClientMessages: fetching for room ${chatId}`);
    const response = await fetch(`/api/memories/get?roomId=${chatId}`);
    const data = await response.json();
    console.log(`API response data for room ${chatId}:`, data);

    const memories = data?.data || [];
    console.log(`getClientMessages: received ${memories.length} memories for room ${chatId}`);
    
    if (memories.length > 0) {
      console.log(`Sample memory content for ${chatId}:`, memories[0].content);
    }

    return memories.map(
      (memory: {
        id: string;
        content: { role: string; content: string };
        updated_at: string;
      }) => ({
        id: memory.id,
        ...memory.content,
      })
    );
  } catch (error) {
    console.error(`getClientMessages error for room ${chatId}:`, error);
    return [];
  }
};

export default getClientMessages;
