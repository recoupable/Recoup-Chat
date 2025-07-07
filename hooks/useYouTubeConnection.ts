import { useEffect, useState } from "react";

const useYouTubeConnection = (
  artistAccountId: string | undefined,
  userId: string | undefined
) => {
  const [channelName, setChannelName] = useState<string | null>(null);

  useEffect(() => {
    if (!artistAccountId || !userId) {
      setChannelName(null);
      return;
    }

    const fetchChannelInfo = async () => {
      const params = new URLSearchParams({
        artistAccountId,
        userId,
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

    fetchChannelInfo();
  }, [artistAccountId, userId]);

  return { channelName };
};

export default useYouTubeConnection;
