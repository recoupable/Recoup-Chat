const getTikTokAnalysisByArtistId = async (artistId: string) => {
  try {
    const response = await fetch(
      `/api/tiktok_analysis/get_by_artist_id?artistId=${artistId}`,
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    return { error };
  }
};

export default getTikTokAnalysisByArtistId;
