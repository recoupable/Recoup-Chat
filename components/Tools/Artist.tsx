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

const Artist = () => {
  const { context } = useToolCallProvider();
  const { setSelectedArtist } = useArtistProvider();
  const status = context?.status;
  const artist = context?.artist;

  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  useEffect(() => {
    if (artist) {
      setSelectedArtist(artist);
      setIsOpenModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

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
        <Modal onClose={toggleModal}>
          <Settings toggleModal={toggleModal} />
        </Modal>
      )}
    </>
  );
};

export default Artist;
