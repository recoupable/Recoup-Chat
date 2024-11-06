import Image from "next/image";
import ArtistDropDown from "./ArtistDropDown";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useClickOutsideSelect from "@/hooks/useClickOutsideSelect";
import { useState } from "react";
import Modal from "../Modal";
import Settings from "../ArtistSettingModal/Settings";

const ArtistToggleModal = () => {
  const { selectRef, setIsVisibleSelect, isVisibleSelect } =
    useClickOutsideSelect();
  const { artistActive, selectedArtist } = useArtistProvider();
  const [isOpenSetting, setIsOpenSetting] = useState(false);

  const toggleSetting = () => {
    setIsOpenSetting(!isOpenSetting);
  };

  const toggleArtistModal = () => {
    setIsVisibleSelect(!isVisibleSelect);
  };

  return (
    <div className="relative" ref={selectRef}>
      <div className="flex items-center gap-2">
        <button
          className="relative flex items-center w-12 h-6 pl-2 border-[1px] border-gray-700 rounded-full cursor-pointer"
          onClick={toggleArtistModal}
          type="button"
        >
          <div
            className={`${artistActive ? "translate-x-[calc(100%-5px)]" : "translate-x-[-5px]"} w-[20px] aspect-[1/1] rounded-full overflow-hidden
              transition duration-[300ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]`}
          >
            <Image
              src={selectedArtist?.image || "https://i.imgur.com/QCdc8Ai.jpg"}
              layout="fill"
              alt="not found artist image"
            />
          </div>
        </button>
        <p className="text-sm">{selectedArtist?.name || "Artist Mode"}</p>
      </div>
      {isVisibleSelect && (
        <ArtistDropDown
          toggleModal={toggleArtistModal}
          toggleSetting={toggleSetting}
        />
      )}
      {isOpenSetting && (
        <Modal onClose={toggleSetting}>
          <Settings toggleModal={toggleSetting} />
        </Modal>
      )}
    </div>
  );
};

export default ArtistToggleModal;
