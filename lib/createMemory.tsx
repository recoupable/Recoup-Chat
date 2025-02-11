// eslint-disable-next-line
const createMemory = async (message: any, roomId: string, artistId: string) => {
  try {
    const response = await fetch("/api/memories/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        room_id: roomId,
        artist_id: artistId,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default createMemory;
