import { ArtistRecord } from "@/types/Artist";
import getExistingHandles from "@/lib/getExistingHandles";
import getHandles from "@/lib/getHandles";

type SocialHandles = {
  spotify: string;
  twitter: string;
  instagram: string;
  tiktok: string;
};

export const useHandleLookup = () => {
  const lookupHandles = async (
    artist: ArtistRecord | null,
    funnelType: string
  ): Promise<Record<string, string>> => {
    const existingHandles = getExistingHandles(artist);
    const handle = artist?.name || "";
    const tavilyHandles = await getHandles(handle);

    const mergedHandles: Record<string, string> = {
      spotify: existingHandles.spotify || tavilyHandles.spotify,
      twitter: existingHandles.twitter || tavilyHandles.twitter,
      instagram: existingHandles.instagram || tavilyHandles.instagram,
      tiktok: existingHandles.tiktok || tavilyHandles.tiktok,
    };

    return funnelType === "wrapped"
      ? mergedHandles
      : { [funnelType]: mergedHandles[funnelType as keyof SocialHandles] };
  };

  return {
    lookupHandles,
  };
};

export default useHandleLookup;
