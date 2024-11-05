"use client";

import { ArrowRightFromLine, BookOpen, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Tooltip from "../Tooltip";
import { useUserProvider } from "@/providers/UserProvder";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SideMenu from "../SideMenu";
import ArtistSettingModal from "../ArtistSettingModal";
import { useArtistProvider } from "@/providers/ArtistProvider";

const Sidebar = () => {
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
  const { artistActive, selectedArtist } = useArtistProvider();

  useEffect(() => {
    setMounted(true);
  }, []);

  const goToItem = (link?: string) => {
    if (isPrepared()) push(`/${link || ""}`);
  };

  if (!mounted) {
    return (
      <div className="border-r-[1px] border-r-gray-700 w-16 flex flex-col py-4 px-2 items-center gap-3 hidden md:block">
        <div className="mb-6 w-[90px] h-[90px]" />
      </div>
    );
  }

  return (
    <div className="border-r-[1px] border-r-gray-700 w-16 flex-col items-center py-4 px-2 gap-3 hidden md:flex h-screen">
      <button
        type="button"
        onClick={() => push("/")}
        className="mb-6 w-[45px] h-[45px]"
      >
        <Image
          src={resolvedTheme === "dark" ? "/logo-light.png" : "/logo-dark.png"}
          width={45}
          height={45}
          alt="logo"
          className="rounded-md overflow-hidden w-full h-full object-contain"
        />
      </button>
      <div className="flex flex-col gap-3 grow">
        <Tooltip
          id={"new-conversation-tooltip"}
          message="New Chat"
          className="!z-[100]"
        >
          <button
            type="button"
            className="border-gray-700 border-[1px] p-2 rounded-md"
            onClick={() => goToItem()}
          >
            <Plus />
          </button>
        </Tooltip>
        <Tooltip
          id={"chat-history-tooltip"}
          message="Chat History"
          className="!z-[100]"
        >
          <button
            type="button"
            className="border-gray-700 border-[1px] p-2 rounded-md"
            onClick={() => goToItem("history")}
          >
            <BookOpen />
          </button>
        </Tooltip>
        {artistActive && selectedArtist && <ArtistSettingModal />}
        <div className="flex-grow flex items-end justify-center">
          <button type="button" onClick={() => setIsOpenSideMenu(true)}>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>
      <SideMenu
        isVisible={isOpenSideMenu}
        toggleModal={() => setIsOpenSideMenu(!isOpenSideMenu)}
      />
    </div>
  );
};

export default Sidebar;
