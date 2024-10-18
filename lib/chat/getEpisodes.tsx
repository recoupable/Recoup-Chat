import { Episode } from "@/types/Episodes";
import { FAN_TYPE } from "@/types/fans";

const getEpisodes = (fan: FAN_TYPE) => {
  const episodes = Array.isArray(fan.episodes) ? fan.episodes : [];
  const uniqueEpisodes =
    episodes
      .reduce((acc: Episode[], episode: Episode) => {
        const existingElement = acc.find(
          (element: Episode) => element.uri === episode.uri,
        );
        if (existingElement) Object.assign(existingElement, episode);
        else acc.push(episode);

        return acc;
      }, [])
      .map((episode: Episode) => episode.name || "") || [];

  return uniqueEpisodes;
};

export default getEpisodes;
