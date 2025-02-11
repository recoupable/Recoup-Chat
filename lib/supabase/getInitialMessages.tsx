const getInitialMessages = async (chatId: string) => {
  try {
    const response = await fetch(`/api/memories/get?roomId=${chatId}`);
    const data = await response.json();

    const memories = data?.data || [];

    // eslint-disable-next-line
    return memories.map((memory: any) => ({
      ...memory.content,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getInitialMessages;
