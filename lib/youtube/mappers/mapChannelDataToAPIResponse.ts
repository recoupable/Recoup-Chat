import { YouTubeChannelData } from "@/types/youtube";

export function mapChannelDataArrayToAPIResponse(
  channels: YouTubeChannelData[]
) {
  return channels.map(mapChannelDataToAPIResponse);
}

export function mapChannelDataToAPIResponse(channel: YouTubeChannelData) {
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
