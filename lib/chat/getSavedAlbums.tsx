import { Album } from "@/types/Album";

const getSavedAlbums = (savedAlbums: Album[]) => {
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
