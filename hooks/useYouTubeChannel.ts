import { useEffect, useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";

const useYouTubeChannel = () => {
  const { selectedArtist } = useArtistProvider();
  const { userData } = useUserProvider();
  const [channelData, setChannelData] = useState<string | null>(null);

  useEffect(() => {
    const artistAccountId = selectedArtist?.account_id;
    const accountId = userData?.id;

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
  }, [selectedArtist?.account_id, userData?.id]);

  return { channelData };
};

export default useYouTubeChannel;
