import { SpotifyDeepResearchResultUIType } from "@/types/spotify";
import GetArtistSocialsResult from "./GetArtistSocialsResult";
import { Music } from "lucide-react";
import { ArtistSocialsResultType } from "@/types/ArtistSocials";

export default function SpotifyDeepResearchResultComponent({
  result,
}: {
  result: SpotifyDeepResearchResultUIType;
}) {
  const processedResult = {
    success: result.success,
    socials: result.artistSocials.socials,
  } as ArtistSocialsResultType;
  return <GetArtistSocialsResult title="Spotify Deep Research Complete" icon={<Music />} errorText="Spotify Deep Research Failed" result={processedResult} />
}
