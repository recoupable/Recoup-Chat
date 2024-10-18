import { Album } from "@/types/Album";
import { FAN_TYPE } from "@/types/fans";

const getSavedAlbums = (fan: FAN_TYPE) => {
  const savedAlbums = Array.isArray(fan.savedAlbums) ? fan.savedAlbums : [];
  const uniqueSavedAlbums = savedAlbums.reduce((acc: Album[], album: Album) => {
    const existingElement = acc.find(
      (element: Album) => element.uri === album.uri,
    );
    if (existingElement) Object.assign(existingElement, album);
    else acc.push(album);

    return acc;
  }, []);

  return uniqueSavedAlbums;
};

export default getSavedAlbums;
