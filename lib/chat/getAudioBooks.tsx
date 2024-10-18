import { AudioBook } from "@/types/AudioBook";
import { FAN_TYPE } from "@/types/fans";

const getAudioBooks = (fan: FAN_TYPE) => {
  const audioBooks = Array.isArray(fan.savedAudioBooks)
    ? fan.savedAudioBooks
    : [];
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
