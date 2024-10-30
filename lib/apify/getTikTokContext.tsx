// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTikTokContext = (trends: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return trends.map((trend: any) => ({
    username: trend?.author?.unique_id || "",
    follower_count: trend?.author?.follower_count || 0,
    following_count: trend?.author?.following_count || 0,
    nickname: trend?.author?.nickname,
    youtube_channel_id: trend?.author?.youtube_channel_id,
    youtube_channel_title: trend?.author?.youtube_channel_title,
    description: trend?.desc || "",
    music_played_duration: trend?.music?.duration || 0,
    artists: trend?.music?.matched_pgc_sound?.artist_infos?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (artist: any) => artist.nick_name,
    ),
    music_release_date: new Date(
      trend?.music?.music_release_info?.group_release_date ||
        trend?.music?.matched_pgc_sound?.music_release_info
          ?.group_release_date ||
        0,
    ).toLocaleDateString(),
    music_title: trend?.music?.matched_song?.title || "",
    music_total_duration: trend?.music?.matched_song?.full_duration || 0,
    rate: trend?.rate || 0,
    play_count: trend?.statistics?.play_count,
    collect_count: trend?.statistics?.collect_count,
    comment_count: trend?.statistics?.comment_count,
    download_count: trend?.statistics?.download_count,
    share_count: trend?.statistics?.share_count,
    digg_count: trend?.statistics?.digg_count,
  }));
};

export default getTikTokContext;
