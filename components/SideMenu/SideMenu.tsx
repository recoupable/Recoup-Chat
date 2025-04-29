import SideModal from "../SideModal";
import { useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import UnlockPro from "../Sidebar/UnlockPro";
import UserInfo from "../Sidebar/UserInfo";
import Logo from "../Logo";
import MenuItemIcon from "../MenuItemIcon";
import { v4 as uuidV4 } from "uuid";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { PointerIcon } from "lucide-react";

const SideMenu = ({
  isVisible,
  toggleModal,
  onOpenArtists,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  onOpenArtists?: () => void;
}) => {
  const { push } = useRouter();
  const { email, isPrepared } = useUserProvider();
  const { selectedArtist, sorted, toggleSettingModal } = useArtistProvider();
  const hasArtists = sorted.length > 0;
  const isArtistSelected = !!selectedArtist;

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || uuidV4()}`);
      toggleModal();
    }
  };

  const handleArtistSelect = () => {
    if (hasArtists) {
      // Open the artist selection sidebar
      if (onOpenArtists) {
        onOpenArtists();
      }
    } else {
      // No artists yet, open the artist creation modal
      toggleSettingModal();
    }
    toggleModal();
  };

  return (
    <SideModal isVisible={isVisible} toggleModal={toggleModal}>
      <button className="mt-4" onClick={() => push("/")} type="button">
        <Logo />
      </button>
      <button
        type="button"
        className="mt-4 border-[#E6E6E6] border-[1px] rounded-md p-2 mt-4 md:mt-8 cursor-pointer shadow-[1px_1px_1px_1px_#E6E6E6]"
        onClick={() => goToItem("chat")}
        aria-label={email ? "Start a new chat" : "Sign in to your account"}
      >
        {email ? "New Chat" : "Sign In"}
      </button>
      
      {email && !isArtistSelected && (
        <button
          type="button"
          onClick={handleArtistSelect}
          className="flex gap-3 items-center mb-2 mt-4 text-black font-semibold"
          aria-label={hasArtists ? "Select your artist from the list" : "Add a new artist"}
        >
          <PointerIcon className="h-5 w-5" />
          {hasArtists ? "Select Your Artist" : "Add Your Artist"}
        </button>
      )}
      
      <button
        type="button"
        onClick={() => goToItem("agents")}
        className="flex gap-3 items-center mb-2"
        aria-label="View agents"
      >
        <MenuItemIcon name="robot" />
        Agents
      </button>
      <button
        type="button"
        onClick={() => goToItem("segments")}
        className="flex gap-3 items-center mb-2"
        aria-label="View segments"
      >
        <MenuItemIcon name="segments" />
        Segments
      </button>
      {email && <RecentChats toggleModal={toggleModal} />}
      <div className="grow flex flex-col gap-1 md:gap-3 justify-end">
        <UnlockPro />
        <UserInfo toggleMenuExpanded={toggleModal} />
      </div>
    </SideModal>
  );
};

export default SideMenu;
