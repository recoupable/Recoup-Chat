import { usePathname, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import UnlockPro from "./UnlockPro";
import UserInfo from "../Sidebar/UserInfo";
import Logo from "../Logo";
import Icon from "../Icon";

const Menu = ({ toggleMenuExpanded }: { toggleMenuExpanded: () => void }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { email, isPrepared } = useUserProvider();
  const activeClasses = "bg-background-dark";
  const itemClasses = "flex gap-2 items-center rounded-md px-3 py-2";
  const isAgents = pathname.includes("/agents");
  const isDashboard = pathname.includes("/dashboard");
  const isArtists = pathname.includes("/artists");

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || ""}`);
    }
  };

  return (
    <div className="w-full h-screen pt-10 pb-4 pl-6 pr-2 gap-1 hidden md:flex flex-col">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <Logo />
        </div>
      </div>
      <button
        type="button"
        className="border-[#E6E6E6] border-[1px] rounded-md p-2 mt-4 md:mt-8 cursor-pointer shadow-[1px_1px_1px_1px_#E6E6E6] bg-white"
        onClick={() => goToItem("")}
      >
        New Chat
      </button>
      <button
        type="button"
        onClick={() => goToItem("dashboard")}
        className={`${itemClasses} ${isDashboard && activeClasses} mt-6`}
      >
        <Icon name="dashboard" />
        Dashboard
      </button>
      <button
        className={`${itemClasses} ${isArtists && activeClasses}`}
        type="button"
        onClick={() => goToItem("artists")}
      >
        <Icon name="micval" />
        Artists
      </button>
      <button
        type="button"
        onClick={() => goToItem("agents")}
        className={`${itemClasses} ${isAgents && activeClasses}`}
      >
        <Icon name="robot" />
        Agents
      </button>
      <div className="h-[0.1px] bg-greyw-full my-4" />
      {email && <RecentChats toggleModal={toggleMenuExpanded} />}
      <div className="grow flex flex-col gap-1 md:gap-3 justify-end">
        <UnlockPro />
        <UserInfo toggleMenuExpanded={toggleMenuExpanded} />
      </div>
    </div>
  );
};

export default Menu;
