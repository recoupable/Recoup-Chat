import { useArtistProvider } from "@/providers/ArtistProvider";

const useChatContext = () => {
  const { selectedArtist } = useArtistProvider();

  return {
    chatContext: selectedArtist ? { activeArtist: selectedArtist } : null,
  };
};

export default useChatContext;
