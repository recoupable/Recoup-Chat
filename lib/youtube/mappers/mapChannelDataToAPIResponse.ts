import { YouTubeChannelData } from "@/types/youtube";

function mapChannelDataToAPIResponse(channel: YouTubeChannelData) {
  const { statistics, ...baseChannel } = channel;

  return {
    ...baseChannel,
    statistics: {
      subscriberCount: statistics.subscriberCount,
      videoCount: statistics.videoCount,
      viewCount: statistics.viewCount,
    },
  };
}

export default mapChannelDataToAPIResponse;
