import { Show } from "@/types/Show";

const getShows = (shows: Show[]) => {
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

export default getShows;
