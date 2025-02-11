const getConversations = async (account_id: string) => {
  try {
    const response = await fetch(`/api/room/get?account_id=${account_id}`);
    const data = await response.json();

    return data.rooms;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getConversations;
