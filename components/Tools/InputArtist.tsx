import MissingArtist from "./MissingArtist";
import CreatedArtist from "./CreatedArtist";
import { ArtistToolResponse } from "@/types/Tool";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputArtist = ({ context }: any) => {
  return (
    <>
      {context?.status === ArtistToolResponse.MISSING_ARTIST_NAME && (
        <MissingArtist answer={context.answer} question={context.qustion} />
      )}
      {context?.status === ArtistToolResponse.CREATED_ARTIST && (
        <CreatedArtist context={context} />
      )}
    </>
  );
};

export default InputArtist;
