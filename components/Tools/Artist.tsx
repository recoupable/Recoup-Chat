import MissingArtist from "./MissingArtist";
import CreatedArtist from "./CreatedArtist";
import { ArtistToolResponse } from "@/types/Tool";
import ArtistsTable from "./ArtistsTable";
import SubmitArtist from "./SubmitArtist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";

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
    </>
  );
};

export default Artist;
