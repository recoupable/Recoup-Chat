import MissingArtist from "./MissingArtist";
import CreatedArtist from "./CreatedArtist";
import { ArtistToolResponse } from "@/types/Tool";
import ArtistsTable from "./ArtistsTable";
import SubmitArtist from "./SubmitArtist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import MissingTikTok from "./MissingTikTok";
import TikTokPfp from "./TikTokPfp";

const Artist = () => {
  const { context } = useToolCallProvider();
  const status = context?.status;

  return (
    <>
      {status === ArtistToolResponse.MISSING_ARTIST_NAME && (
        <MissingArtist description="Please provide the artist name to proceed." />
      )}
      {status === ArtistToolResponse.CREATED_ARTIST && <CreatedArtist />}
      {status === ArtistToolResponse.ARTIST_LIST && <ArtistsTable />}
      {status === ArtistToolResponse.NO_ARTISTS && <SubmitArtist />}
      {status === ArtistToolResponse.MISSING_ARTIST_TIKTOK_USERNAME && (
        <MissingTikTok />
      )}
      {status === ArtistToolResponse.TIKTOK_TRENDS && <TikTokPfp />}
    </>
  );
};

export default Artist;
