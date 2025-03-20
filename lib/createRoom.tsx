import getAiTitle from "./getAiTitle";

const createRoom = async (account_id: string, content: string, artist_id?: string) => {
  try {
    const title = await getAiTitle(content);
    const topic = title.replaceAll(`\"`, "");
    let apiUrl = `/api/room/create?account_id=${encodeURIComponent(account_id)}&topic=${encodeURIComponent(topic)}`;
    
    if (artist_id) {
      apiUrl += `&artist_id=${encodeURIComponent(artist_id)}`;
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
