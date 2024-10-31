"use client";

import { BookOpen, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Tooltip from "../Tooltip";
import { useUserProvider } from "@/providers/UserProvder";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    <div className="border-r-[1px] border-r-gray-700 w-16 flex flex-col py-4 px-2 items-center gap-3 hidden md:block">
      <button type="button" onClick={() => goToItem()} className="mb-6 w-[45px] h-[45px]">
        <Image
          src={resolvedTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png'}
          width={45}
          height={45}
          alt="logo"
          className="rounded-md overflow-hidden w-full h-full object-contain"
        />
      </button>
      <div className="flex flex-col gap-3">
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
      </div>
    </div>
  );
};

export default Sidebar;
