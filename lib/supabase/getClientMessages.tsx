const getClientMessages = async (chatId: string) => {
  try {
    const response = await fetch(`/api/memories/get?roomId=${chatId}`);
    const data = await response.json();

    const memories = data?.data || [];

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
    console.error(error);
    return [];
  }
};

export default getClientMessages;
