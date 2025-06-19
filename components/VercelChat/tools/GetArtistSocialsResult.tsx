import { ArtistSocialsResultType } from "@/types/ArtistSocials";
import SpotifyDeepResearchResult from "./SpotifyDeepResearchResult";
import { Music } from "lucide-react";

export default function GetArtistSocialsResult({
  result,
}: {
  result: ArtistSocialsResultType["artistSocials"];
}) {
  const processedResult = {
    success: result?.status === "success",
    artistSocials: {
      socials: result?.socials,
    },
  } as ArtistSocialsResultType;
  return (
    <>
      <SpotifyDeepResearchResult title="Artist Socials" icon={<Music />} result={processedResult} />
    </>
  );
}
