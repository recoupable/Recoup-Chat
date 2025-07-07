import { useEffect, useState } from "react";
import { fetchYouTubeTokens } from "@/lib/youtube/fetchYouTubeTokens";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";

const useYouTubeConnection = (artistAccountId: string | undefined, userId: string | undefined) => {
  const [token, setToken] = useState<null | { access_token: string; refresh_token?: string }>(null);
  const [channelName, setChannelName] = useState<string | null>(null);

  useEffect(() => {
    if (!artistAccountId || !userId) return;
    const fetchData = async () => {
      const response = await fetchYouTubeTokens(artistAccountId, userId);
      if (response.success && response.hasValidTokens && response.tokens?.access_token) {
        setToken({ access_token: response.tokens.access_token, refresh_token: response.tokens.refresh_token ?? undefined });
        const channelResult = await fetchYouTubeChannelInfo({
          accessToken: response.tokens.access_token,
          refreshToken: response.tokens.refresh_token || "",
          includeBranding: true,
        });
        if (channelResult.success && channelResult.channelData && channelResult.channelData.length > 0) {
          setChannelName(channelResult.channelData[0].title);
        } else {
          setChannelName(null);
        }
      } else {
        setToken(null);
        setChannelName(null);
      }
    };
    fetchData();
  }, [artistAccountId, userId]);

  return { token, channelName };
};

export default useYouTubeConnection; 