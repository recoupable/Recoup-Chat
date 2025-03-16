const getInitialMessages = async (chatId: string, artistId?: string) => {
  try {
    let url = `/api/memories/get?roomId=${chatId}`;
    if (artistId) {
      url += `&artistId=${artistId}`;
    }
    
    const response = await fetch(url);
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
