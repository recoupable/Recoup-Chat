import { useArtistProvider } from "@/providers/ArtistProvider";
import ImageWithFallback from "../ImageWithFallback";

const ImageSelect = () => {
  const { imageUploading, imageRef, image, handleImageSelected } =
    useArtistProvider();
  return (
    <>
      <button
        className="w-full"
        type="button"
        onClick={() => imageRef.current?.click()}
      >
        <div className="w-[90px] aspect-[5/4] md:w-[120px] aspect-[1/1] rounded-md relative overflow-hidden flex items-center justify-center">
          {imageUploading ? (
            <p className="text-sm">Uploading...</p>
          ) : (
            <ImageWithFallback
              src={image || "https://i.imgur.com/QCdc8Ai.jpg"}
            />
          )}
        </div>
      </button>
      <input type="file" hidden ref={imageRef} onChange={handleImageSelected} />
    </>
  );
};

export default ImageSelect;
