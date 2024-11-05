import Image from "next/image";
import ArtistDropDown from "./ArtistDropDown";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useClickOutsideSelect from "@/hooks/useClickOutsideSelect";

const ArtistToggleModal = () => {
  const { selectRef, setIsVisibleSelect, isVisibleSelect } =
    useClickOutsideSelect();
  const { artistActive } = useArtistProvider();

  const toggleArtistModal = () => {
    setIsVisibleSelect(!isVisibleSelect);
  };

  return (
    <div className="relative" ref={selectRef}>
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
            src={"https://i.imgur.com/QCdc8Ai.jpg"}
            layout="fill"
            alt="not found artist image"
          />
        </div>
      </button>
      {isVisibleSelect && <ArtistDropDown toggleModal={toggleArtistModal} />}
    </div>
  );
};

export default ArtistToggleModal;
