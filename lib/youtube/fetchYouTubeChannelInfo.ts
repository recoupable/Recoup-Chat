interface FetchYouTubeChannelInfoParams {
    artistAccountId: string;
    accountId: string;
  }
  
  export async function fetchYouTubeChannelInfo({
    artistAccountId,
    accountId,
  }: FetchYouTubeChannelInfoParams) {
    const params = new URLSearchParams({
      artistAccountId,
      accountId,
    });
    const res = await fetch(`/api/youtube/channel-info?${params.toString()}`);
    return res.json();
  }
  