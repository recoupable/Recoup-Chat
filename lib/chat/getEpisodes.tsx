import { Episode } from "@/types/Episodes";

const getEpisodes = (episodes: Episode[]) => {
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
