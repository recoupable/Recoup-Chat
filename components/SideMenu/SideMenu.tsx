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
import { Button } from "../ui/button";
import { useMiniAppContext } from "@/providers/MiniAppProvider";

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
  const { address, isPrepared } = useUserProvider();
  const { selectedArtist, sorted, toggleCreation } = useArtistProvider();
  const { isMiniApp } = useMiniAppContext();
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
      toggleCreation();
    }
    toggleModal();
  };

  return (
    <SideModal isVisible={isVisible} toggleModal={toggleModal}>
      <button className="mt-4" onClick={() => push("/")} type="button">
        <Logo />
      </button>
      <div className="flex flex-col gap-1 w-full pb-2">
        <Button
          variant="outline"
          className="mt-4 rounded-xl md:mt-8 cursor-pointer"
          onClick={() => goToItem("chat")}
          aria-label={address ? "Start a new chat" : "Sign in to your account"}
        >
          {address ? "New Chat" : "Sign In"}
        </Button>
        {address && !isArtistSelected && (
          <Button
            variant="outline"
            onClick={handleArtistSelect}
            className="flex gap-3 items-center rounded-xl w-full"
            aria-label={
              hasArtists
                ? "Select your artist from the list"
                : "Add a new artist"
            }
          >
            <PointerIcon className="h-5 w-5" />
            {hasArtists ? "Select Your Artist" : "Add Your Artist"}
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => goToItem("agents")}
          className="rounded-xl w-full flex justify-start"
          aria-label="View agents"
        >
          <MenuItemIcon name="robot" />
          Agents
        </Button>
        <Button
          variant="ghost"
          onClick={() => goToItem("segments")}
          className="flex justify-start rounded-xl w-full"
          aria-label="View segments"
        >
          <MenuItemIcon name="segments" />
          Segments
        </Button>
      </div>
      {address && <RecentChats toggleModal={toggleModal} />}
      <div className="grow flex flex-col gap-1 md:gap-3 justify-end">
        {!isMiniApp && <UnlockPro />}
        <UserInfo toggleMenuExpanded={toggleModal} />
      </div>
    </SideModal>
  );
};

export default SideMenu;
