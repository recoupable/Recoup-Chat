import { useEffect, useState } from "react";

const useYouTubeChannel = (
  artistAccountId: string | undefined,
  accountId: string | undefined
) => {
  const [channelData, setChannelData] = useState<string | null>(null);
  
  useEffect(() => {
    if (!artistAccountId || !accountId) {
      setChannelData(null);
      return;
    }

    const fetchChannelInfo = async () => {
      const params = new URLSearchParams({
        artistAccountId,
        accountId,
      });
      const res = await fetch(`/api/youtube/channel-info?${params.toString()}`);
      const channelResult = await res.json();
      setChannelData(
        channelResult.success &&
          channelResult.channelData &&
          channelResult.channelData.length > 0
          ? channelResult.channelData[0].title
          : null
      );
    };

    fetchChannelInfo();
  }, [artistAccountId, accountId]);

  return { channelData };
};

export default useYouTubeChannel;
