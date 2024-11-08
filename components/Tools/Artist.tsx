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
import { SETTING_MODE } from "@/types/Setting";
import MissingArtist from "./MissingArtist";

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
    setSettingMode,
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

  useEffect(() => {
    if (status === ArtistToolResponse.MISSING_ARTIST_NAME) {
      setSettingMode(SETTING_MODE.CREATE);
      setIsOpenSettingModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      {status === ArtistToolResponse.MISSING_ARTIST_NAME && (
        <MissingArtist description="Please, click button to create an artist." />
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
                <MissingArtist description="Please, click button to create an artist." />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Artist;
