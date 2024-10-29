import { ArtistToolResponse } from "@/lib/tools/createArtist";
import MissingArtist from "./MissingArtist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputArtist = ({ context }: any) => {
  return (
    <>
      {context?.status === ArtistToolResponse.MISSING_ARTIST_NAME && (
        <MissingArtist answer={context.answer} question={context.qustion} />
      )}
    </>
  );
};

export default InputArtist;
