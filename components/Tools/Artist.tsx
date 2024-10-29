import MissingArtist from "./MissingArtist";
import CreatedArtist from "./CreatedArtist";
import { ArtistToolResponse } from "@/types/Tool";
import ArtistsTable from "./ArtistsTable";
import { ArtistRecord } from "@/types/Artist";
import SubmitArtist from "./SubmitArtist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Artist = ({ context, scroll }: any) => {
  const artists = context?.artists?.filter(
    (artist: ArtistRecord) => artist.name !== "Unknown",
  );

  return (
    <>
      {context?.status === ArtistToolResponse.MISSING_ARTIST_NAME && (
        <MissingArtist answer={context.answer} question={context.qustion} />
      )}
      {context?.status === ArtistToolResponse.CREATED_ARTIST && (
        <CreatedArtist context={context} />
      )}
      {context?.status === ArtistToolResponse.ARTIST_LIST && (
        <ArtistsTable artists={artists} scroll={scroll} />
      )}
      {context?.status === ArtistToolResponse.NO_ARTISTS && <SubmitArtist />}
    </>
  );
};

export default Artist;
