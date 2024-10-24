import { AudioBook } from "@/types/AudioBook";

const getAudioBooks = (audioBooks: AudioBook[]) => {
  const uniqueAudioBooks = audioBooks
    .reduce((acc: AudioBook[], audioBook: AudioBook) => {
      const existingElement = acc.find(
        (element: AudioBook) => element.uri === audioBook.uri,
      );
      if (existingElement) Object.assign(existingElement, audioBook);
      else acc.push(audioBook);

      return acc;
    }, [])
    .map((audioBook: AudioBook) => audioBook.name || "");

  return uniqueAudioBooks;
};

export default getAudioBooks;
