import { useEffect, useState } from "react";
import { fetchYouTubeTokens } from "@/lib/youtube/fetchYouTubeTokens";

const useYouTubeConnection = (
  artistAccountId: string | undefined,
  userId: string | undefined
) => {
  const [token, setToken] = useState<null | {
    access_token: string;
    refresh_token?: string;
  }>(null);
  const [channelName, setChannelName] = useState<string | null>(null);

  // Fetch YouTube tokens and channel info when artist/user changes
  useEffect(() => {
    if (!artistAccountId || !userId) {
      setToken(null);
      setChannelName(null);
      return;
    }

    const fetchYouTubeData = async () => {
      const response = await fetchYouTubeTokens(artistAccountId, userId);
      if (
        !response.success ||
        !response.hasValidTokens ||
        !response.tokens?.access_token
      ) {
        setToken(null);
        setChannelName(null);
        return;
      }
      setToken({
        access_token: response.tokens.access_token,
        refresh_token: response.tokens.refresh_token ?? undefined,
      });
      // Fetch channel info from the new API route
      const params = new URLSearchParams({
        access_token: response.tokens.access_token,
        refresh_token: response.tokens.refresh_token || "",
        include_branding: "true",
      });
      const res = await fetch(`/api/youtube/channel-info?${params.toString()}`);
      const channelResult = await res.json();
      setChannelName(
        channelResult.success &&
          channelResult.channelData &&
          channelResult.channelData.length > 0
          ? channelResult.channelData[0].title
          : null
      );
    };

    fetchYouTubeData();
  }, [artistAccountId, userId]);

  return { token, channelName };
};

export default useYouTubeConnection;
