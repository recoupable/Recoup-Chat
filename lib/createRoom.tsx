import getAiTitle from "./getAiTitle";

const createRoom = async (
  account_id: string,
  content: string,
  artist_id?: string,
  room_id?: string
) => {
  try {
    const title = await getAiTitle(content);
    const topic = title.replaceAll(`\"`, "");

    const params = new URLSearchParams({
      account_id: account_id,
      topic: topic,
      ...(artist_id && { artist_id }),
      ...(room_id && { room_id }),
    });

    const apiUrl = `/api/room/create?${params.toString()}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.new_room;
  } catch (error) {
    console.error("[CreateRoom] Error:", error);
    return null;
  }
};

export default createRoom;
