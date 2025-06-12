import { createYouTubeAPIClient } from "./oauth-client";

/**
 * Fetches videos from a YouTube playlist using the YouTube API client.
 * @param youtube - An authenticated YouTube API client
 * @param playlistId - The uploads playlist ID
 * @param maxResults - Maximum number of results to return (default 25)
 * @param pageToken - (Optional) Page token for pagination
 * @returns The playlistItems.list API response
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

  const videos = (playlistResponse.data.items || []).map((item) => ({
    id: item.contentDetails?.videoId,
    title: item.snippet?.title,
    publishedAt: item.snippet?.publishedAt,
    description: item.snippet?.description,
    thumbnails: item.snippet?.thumbnails,
    position: item.snippet?.position,
    channelTitle: item.snippet?.channelTitle,
    playlistId: item.snippet?.playlistId,
    resourceId: item.snippet?.resourceId,
    status: item.status,
  }));

  return {
    videos,
    nextPageToken: playlistResponse.data.nextPageToken,
    totalResults: playlistResponse.data.pageInfo?.totalResults,
    resultsPerPage: playlistResponse.data.pageInfo?.resultsPerPage,
  };
}
