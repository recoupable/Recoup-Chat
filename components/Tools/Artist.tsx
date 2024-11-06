import MissingArtist from "./MissingArtist";
import CreatedArtist from "./CreatedArtist";
import { ArtistToolResponse } from "@/types/Tool";
import ArtistsTable from "./ArtistsTable";
import SubmitArtist from "./SubmitArtist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import MissingTikTok from "./MissingTikTok";
import TikTokPfp from "./TikTokPfp";
import Settings from "../ArtistSettingModal/Settings";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import UpdateArtistInfo from "./UpdateArtistInfo";

const Artist = () => {
  const { context } = useToolCallProvider();
  const { setSelectedArtist, selectedArtist, artists } = useArtistProvider();
  const status = context?.status;
  const artist = context?.artist;
  const artistInfo =
    (artist || selectedArtist) &&
    status === ArtistToolResponse.UPDATED_ARTIST_INFO;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  useEffect(() => {
    setSelectedArtist(artistInfo);
    if (artistInfo) {
      setIsOpenModal(true);
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
          {isOpenModal ? (
            <Modal onClose={toggleModal}>
              <Settings toggleModal={toggleModal} />
            </Modal>
          ) : (
            <>{artists.length ? <UpdateArtistInfo /> : <SubmitArtist />}</>
          )}
        </>
      )}
    </>
  );
};

export default Artist;
