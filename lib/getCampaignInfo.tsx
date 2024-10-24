import { SpecificFocus } from "@/types/Campaign";

const getCampaignInfo = (
  specific_focus: string,
  playlists: string[],
  episodes: string[],
  artistNames: string[],
  albumNames: string[],
  audioBooks: string[],
  shows: string[],
  trackNames: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[],
  premiumCount: number,
  freeCount: number,
  followers: number | null,
) => {
  const baseReturn = {
    fans: rows,
    premiumCount,
    freeCount,
    totalFansCount: premiumCount + freeCount,
    totalFollowersCount: followers,
  };

  switch (specific_focus) {
    case SpecificFocus.playlist:
      return {
        ...baseReturn,
        playlists,
      };

    case SpecificFocus.episodes:
      return {
        ...baseReturn,
        episodes,
      };

    case SpecificFocus.artists:
      return {
        ...baseReturn,
        artists: artistNames,
      };

    case SpecificFocus.albums:
      return {
        ...baseReturn,
        albums: albumNames,
      };

    case SpecificFocus.audio_books:
      return {
        ...baseReturn,
        audioBooks,
      };

    case SpecificFocus.shows:
      return {
        ...baseReturn,
        shows,
      };

    case SpecificFocus.listening_habits:
    default:
      return {
        ...baseReturn,
        tracks: trackNames,
        playlists,
        episodes,
        artists: artistNames,
        albums: albumNames,
        audioBooks,
        shows,
      };
  }
};

export default getCampaignInfo;
