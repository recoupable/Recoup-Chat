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
    // Get existing handles from DB
    const existingHandles = getExistingHandles(artist);

    // Get Tavily suggestions
    const handle = artist?.name || "";
    const tavilyHandles = await getHandles(handle);

    // Merge handles based on what's available
    const mergedHandles: Record<string, string> = {
      spotify: existingHandles.spotify || tavilyHandles.spotify,
      twitter: existingHandles.twitter || tavilyHandles.twitter,
      instagram: existingHandles.instagram || tavilyHandles.instagram,
      tiktok: existingHandles.tiktok || tavilyHandles.tiktok,
    };

    // Return either all handles or just the requested platform
    if (funnelType === "wrapped") {
      return mergedHandles;
    }

    return {
      [funnelType]: mergedHandles[funnelType as keyof SocialHandles],
    };
  };

  return {
    lookupHandles,
  };
};

export default useHandleLookup;
