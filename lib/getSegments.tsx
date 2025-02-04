const getSegments = async (artistId: string) => {
  try {
    const response = await fetch(
      `/api/artist/get_fan_segments?artistId=${artistId}`,
    );

    const data = await response.json();
    return data?.fan_segments || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getSegments;
