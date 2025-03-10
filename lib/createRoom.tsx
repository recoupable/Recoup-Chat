import getAiTitle from "./getAiTitle";

const createRoom = async (account_id: string, content: string, artist_id?: string) => {
  try {
    const title = await getAiTitle(content);
    const topic = title.replaceAll(`\"`, "");
    
    // Construct the URL with artist_id parameter if available
    let url = `/api/room/create?account_id=${account_id}&topic=${encodeURIComponent(topic)}`;
    if (artist_id) {
      url += `&artist_id=${artist_id}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    return data.new_room;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createRoom;
