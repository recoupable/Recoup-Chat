import supabase from "../supabase/serverClient";

const getTopSongListeningFansCount = async (
  artistId: string,
  email: string,
) => {
  try {
    const { data } = await supabase.rpc("get_fans_listening_top_songs", {
      artistid: artistId,
      email: email,
    });
    return data?.fans?.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export default getTopSongListeningFansCount;
