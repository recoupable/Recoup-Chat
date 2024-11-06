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
import { ArtistRecord } from "@/types/Artist";
import { useChatProvider } from "@/providers/ChatProvider";
import { v4 as uuidV4 } from "uuid";
import { useParams } from "next/navigation";

const Artist = () => {
  const { context, question } = useToolCallProvider();
  const { conversation: conversationId } = useParams();
  const { finalCallback } = useChatProvider();
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
    setSelectedArtist(artist || selectedArtist);
    if (artistInfo) {
      setIsOpenModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistInfo]);

  const updateCallback = (artistInfo: ArtistRecord) => {
    finalCallback(
      {
        role: "assistant",
        id: uuidV4(),
        content: `Artist Information: Name - ${artistInfo.name} Image - ${artistInfo.image}`,
      },
      { id: uuidV4(), content: question, role: "user" },
      conversationId as string,
    );
  };

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
              <Settings
                toggleModal={toggleModal}
                saveCallback={updateCallback}
              />
            </Modal>
          ) : (
            <>
              {artists.length ? (
                <UpdateArtistInfo toggleModal={toggleModal} />
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
