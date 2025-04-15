import { usePathname, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import UnlockPro from "./UnlockPro";
import UserInfo from "../Sidebar/UserInfo";
import Logo from "../Logo";
import MenuItemIcon from "../MenuItemIcon";
import { v4 as uuidV4 } from "uuid";

const Menu = ({ toggleMenuExpanded }: { toggleMenuExpanded: () => void }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { email, isPrepared } = useUserProvider();
  const activeClasses = "bg-grey";
  const itemClasses = "flex gap-3 items-center rounded-md px-3 py-2";
  const isAgents = pathname.includes("/agents");
  const isSegments = pathname.includes("/segments");

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || uuidV4()}`);
    }
  };

  return (
    <div className="w-full h-screen pt-10 pb-4 pl-6 pr-2 hidden md:flex flex-col">
      <button
        className="mt-2 shrink-0"
        onClick={() => push("/")}
        type="button"
        aria-label="Home"
      >
        <Logo />
      </button>
      <button
        type="button"
        className="border-[#E6E6E6] border-[1px] rounded-md p-2 mt-4 cursor-pointer shadow-[1px_1px_1px_1px_#E6E6E6] bg-white shrink-0"
        onClick={() => goToItem("chat")}
      >
        {email ? "New Chat" : "Sign In"}
      </button>
      <button
        type="button"
        onClick={() => goToItem("agents")}
        className={`${itemClasses} ${isAgents && activeClasses} shrink-0`}
      >
        <MenuItemIcon name="robot" />
        Agents
      </button>
      <button
        type="button"
        onClick={() => goToItem("segments")}
        className={`${itemClasses} ${isSegments && activeClasses} shrink-0`}
      >
        <MenuItemIcon name="segments" />
        Segments
      </button>

      <div className="flex flex-col flex-grow min-h-0">
        {email && <RecentChats toggleModal={toggleMenuExpanded} />}

        <div className="shrink-0 mt-auto">
          {email && <UnlockPro />}
          <UserInfo toggleMenuExpanded={toggleMenuExpanded} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
