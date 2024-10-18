import { FAN_TYPE } from "@/types/fans";
import { RecentlyPlayed } from "@/types/RecentlyPlayed";

const getRecentlyPlayed = (fan: FAN_TYPE) => {
  const recentlyPlayed = Array.isArray(fan.recentlyPlayed)
    ? fan.recentlyPlayed
    : [];
  const uniqueRecentlyPlayed = recentlyPlayed.reduce(
    (acc: RecentlyPlayed[], played: RecentlyPlayed) => {
      const existingElement = acc.find(
        (element: RecentlyPlayed) => element.uri === played.uri,
      );
      if (existingElement) Object.assign(existingElement, played);
      else acc.push(played);

      return acc;
    },
    [],
  );

  return uniqueRecentlyPlayed;
};

export default getRecentlyPlayed;
