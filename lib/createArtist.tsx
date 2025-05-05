const createArtist = async (name: string, account_id: string) => {
  try {
    const response = await fetch(
      `/api/artist/create?name=${encodeURIComponent(name)}&account_id=${account_id}`,
    );
    const data = await response.json();

    return data.artist;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createArtist;
