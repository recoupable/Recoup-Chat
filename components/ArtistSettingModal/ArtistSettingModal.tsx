import { MicVocal } from "lucide-react";
import Tooltip from "../Tooltip";
import { useState } from "react";
import Modal from "../Modal";
import Settings from "./Settings";

const ArtistSettingModal = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <div>
      <Tooltip
        id={"artists-tooltip"}
        message="Artist Setting"
        className="!z-[100]"
      >
        <button
          type="button"
          className="border-gray-700 border-[1px] p-2 rounded-md"
          onClick={() => setIsOpenModal(true)}
        >
          <MicVocal />
        </button>
      </Tooltip>
      {isOpenModal && (
        <Modal onClose={toggleModal}>
          <Settings toggleModal={toggleModal} />
        </Modal>
      )}
    </div>
  );
};

export default ArtistSettingModal;
