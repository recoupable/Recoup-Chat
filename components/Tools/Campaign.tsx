import { ArtistToolResponse } from "@/types/Tool";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import MissingArtistClient from "./MissingArtistClient";
import MissingArtist from "./MissingArtist";

const Campaign = () => {
  const { context } = useToolCallProvider();
  const status = context?.status;
  const artists = context?.artists;

  return (
    <div>
      {status === ArtistToolResponse.MISSING_ARTIST_CLIENT_ID &&
        (artists?.length ? (
          <MissingArtistClient />
        ) : (
          <MissingArtist description="Please create your first artist before proceeding to create a campaign" />
        ))}
    </div>
  );
};

export default Campaign;
