import MissingArtist from "./MissingArtist";
import CreatedArtist from "./CreatedArtist";
import { ArtistToolResponse } from "@/types/Tool";
import ArtistsTable from "./ArtistsTable";
import SubmitArtist from "./SubmitArtist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import MissingTikTok from "./MissingTikTok";
import TikTokPfp from "./TikTokPfp";
import { useEffect } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import UpdateArtistInfo from "./UpdateArtistInfo";

const Artist = () => {
  const { context, question } = useToolCallProvider();
  const {
    setSelectedArtist,
    selectedArtist,
    artists,
    setIsOpenSettingModal,
    isOpenSettingModal,
    toggleSettingModal,
    setQuestion,
  } = useArtistProvider();
  const status = context?.status;
  const artist = context?.artist;
  const artistInfo =
    (artist || selectedArtist) &&
    status === ArtistToolResponse.UPDATED_ARTIST_INFO;

  useEffect(() => {
    setSelectedArtist(artist || selectedArtist);
    if (artistInfo) {
      setQuestion(question);
      setIsOpenSettingModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistInfo]);

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
      {status === ArtistToolResponse.UPDATED_ARTIST_INFO && (
        <>
          {!isOpenSettingModal && (
            <>
              {artists.length ? (
                <UpdateArtistInfo toggleModal={toggleSettingModal} />
              ) : (
                <SubmitArtist />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Artist;
