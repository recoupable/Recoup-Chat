import Image from "next/image";
import SideModal from "../SideModal";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeftFromLine, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Artists from "../Sidebar/Artists";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import Introducing from "../Sidebar/Introducing";
import { useState } from "react";
import UserInfo from "../Sidebar/UserInfo";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const SideMenu = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { push } = useRouter();
  const { artists } = useArtistProvider();
  const { email, isPrepared } = useUserProvider();
  const [isIntroOpen, setIsIntroOpen] = useState(true);

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || ""}`);
      toggleModal();
    }
  };

  return (
    <SideModal isVisible={isVisible} toggleModal={toggleModal}>
      <div className="flex items-center gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <div className="w-[45px] h-[45px] relative">
            <Image
              src={"/logo-light.png"}
              alt="logo"
              layout="fill"
              className="rounded-md overflow-hidden w-full h-full object-contain"
            />
          </div>
          <p className={`text-white text-[30px] ${plusJakartaSans.className} `}>
            Recoup
          </p>
        </div>
        <button type="button" onClick={toggleModal}>
          <ArrowLeftFromLine />
        </button>
      </div>
      <button
        type="button"
        className="border-gray-700 border-[1px] rounded-md p-2 mt-8 cursor-pointer"
        onClick={() => goToItem("")}
      >
        New Chat
      </button>
      <button
        type="button"
        onClick={() => goToItem("history")}
        className="flex gap-2 items-center my-4"
      >
        <BookOpen />
        Library
      </button>
      {artists.length > 0 && <Artists />}
      <div className="h-[0.1px] bg-gray-700 w-full my-4" />
      {email && <RecentChats toggleModal={toggleModal} />}
      <div className="grow flex flex-col gap-3 justify-end">
        {isIntroOpen && (
          <Introducing toggleVisible={() => setIsIntroOpen(!isIntroOpen)} />
        )}
        {email && <UserInfo />}
      </div>
    </SideModal>
  );
};

export default SideMenu;
