interface MemoryMessage {
  id: string;
  role: string;
  content: string;
}

const getInitialMessages = async (chatId: string, artistId?: string) => {
  const url = new URL("/api/memories/get", window.location.origin);
  url.searchParams.set("roomId", chatId);
  if (artistId) {
    url.searchParams.set("artistId", artistId);
  }

  const response = await fetch(url);
  const { data } = await response.json();

  return data?.map((message: MemoryMessage) => ({
    id: message.id,
    role: message.role,
    content: message.content,
  })) || [];
};

export default getInitialMessages;
