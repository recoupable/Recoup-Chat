const createRoom = async (account_id: string, title: string) => {
  try {
    const topic = title.replaceAll(`\"`, "");
    const response = await fetch(
      `/api/room/create?account_id=${account_id}&topic=${encodeURIComponent(topic)}`
    );
    const data = await response.json();
    return data.new_room;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createRoom;
