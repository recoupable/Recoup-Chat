const getArtistsOfAccount = async (email: string) => {
  try {
    const response = await fetch(
      `/api/artists?email=${encodeURIComponent(email as string)}`,
    );
    const data = await response.json();
    return data.artists;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getArtistsOfAccount;
