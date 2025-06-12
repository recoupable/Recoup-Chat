import { createYouTubeAPIClient } from "./oauth-client";
import { youtube_v3 } from "googleapis";

/**
 * Fetches videos from a YouTube playlist using the YouTube API client,
 * then fetches full video details using the videos.list endpoint.
 * @param access_token - OAuth access token
 * @param refresh_token - OAuth refresh token (optional)
 * @param uploads_playlist_id - The uploads playlist ID
 * @param max_results - Maximum number of results to return (default 25)
 * @returns An object with videos (full details), nextPageToken, totalResults, resultsPerPage
 */
export async function getYoutubePlaylistItems({
  access_token,
  refresh_token,
  uploads_playlist_id,
  max_results = 50,
}: {
  access_token: string;
  refresh_token?: string;
  uploads_playlist_id: string;
  max_results?: number;
}) {
  const youtube = createYouTubeAPIClient(access_token, refresh_token);

  // Step 1: Get videos from the uploads playlist
  const playlistResponse = await youtube.playlistItems.list({
    playlistId: uploads_playlist_id,
    part: ["snippet", "contentDetails", "status"],
    maxResults: max_results,
  });

  const items = playlistResponse.data.items || [];
  const videoIds = items
    .map((item) => item.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));

  let videos: youtube_v3.Schema$Video[] = [];
  if (videoIds.length > 0) {
    // Step 2: Fetch full video details using videos.list
    const videosResponse = await youtube.videos.list({
      id: videoIds,
      part: [
        "id",
        "snippet",
        "contentDetails",
        "status",
        "statistics",
        "player",
        "liveStreamingDetails",
        "localizations",
      ],
      maxResults: videoIds.length,
    });
    videos = videosResponse.data.items || [];
  }

  return {
    videos,
    nextPageToken: playlistResponse.data.nextPageToken,
    totalResults: playlistResponse.data.pageInfo?.totalResults,
    resultsPerPage: playlistResponse.data.pageInfo?.resultsPerPage,
  };
}
