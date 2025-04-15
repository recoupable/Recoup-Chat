import SideModal from "../SideModal";
import { useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import UnlockPro from "../Sidebar/UnlockPro";
import UserInfo from "../Sidebar/UserInfo";
import Logo from "../Logo";
import MenuItemIcon from "../MenuItemIcon";
import { v4 as uuidV4 } from "uuid";

const SideMenu = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { push } = useRouter();
  const { email, isPrepared } = useUserProvider();

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || uuidV4()}`);
      toggleModal();
    }
  };

  return (
    <SideModal isVisible={isVisible} toggleModal={toggleModal}>
      <button className="mt-4" onClick={() => push("/")} type="button">
        <Logo />
      </button>
      <button
        type="button"
        className="mt-4 border-[#E6E6E6] border-[1px] rounded-md p-2 mt-4 md:mt-8 cursor-pointer shadow-[1px_1px_1px_1px_#E6E6E6]"
        onClick={() => goToItem("new")}
      >
        {email ? "New Chat" : "Sign In"}
      </button>
      <button
        type="button"
        onClick={() => goToItem("agents")}
        className="flex gap-3 items-center mb-2"
      >
        <MenuItemIcon name="robot" />
        Agents
      </button>
      <button
        type="button"
        onClick={() => goToItem("segments")}
        className="flex gap-3 items-center mb-2"
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
