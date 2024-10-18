import { FAN_TYPE } from "@/types/fans";
import { Show } from "@/types/Show";

const getAudioBooks = (fan: FAN_TYPE) => {
  const shows = Array.isArray(fan.savedShows) ? fan.savedShows : [];
  const uniqueShows = shows
    .reduce((acc: Show[], show: Show) => {
      const existingElement = acc.find(
        (element: Show) => element.uri === show.uri,
      );
      if (existingElement) Object.assign(existingElement, show);
      else acc.push(show);

      return acc;
    }, [])
    .map((show: Show) => show.name || "");

  return uniqueShows;
};

export default getAudioBooks;
