"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useArtistProvider } from "@/providers/ArtistProvider";
import Artist from "../Header/Artist";
import { ArtistRecord } from "@/types/Artist";
import { Plus } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useUserProvider } from "@/providers/UserProvder";

const ArtistsSidebar = () => {
  const { toggleCreation, toggleSettingModal, sorted } = useArtistProvider();
  const { isPrepared, email } = useUserProvider();
  const isMobile = useIsMobile();

  const [menuExpanded, setMenuExpanded] = useState(false);
  const animate = { width: menuExpanded ? 220 : 80 };
  const initial = { width: 80 };

  const handleCreate = () => {
    if (!isPrepared()) return;

    toggleCreation();
    toggleSettingModal();
  };

  return (
    <motion.div
      className="px-3 py-7 hidden md:flex flex-col gap-2 items-center"
      animate={animate}
      initial={initial}
      transition={{ duration: 0.2 }}
      onMouseOver={() => setMenuExpanded(!isMobile)}
      onMouseOut={() => setMenuExpanded(false)}
    >
      <div className="no-scrollbar grow flex flex-col overflow-y-auto overflow-x-hidden">
        {email &&
          sorted.map((artist: ArtistRecord | null) => (
            <Artist
              artist={artist}
              toggleDropDown={() => {}}
              key={artist?.account_id}
              isMini={!menuExpanded}
            />
          ))}
      </div>
      <button
        className={`${menuExpanded && "flex px-2 py-1 gap-2 text-sm items-center text-grey-dark-1"}`}
        onClick={handleCreate}
      >
        <div className="w-8 flex justify-center">
          <Plus className="size-5 text-grey-dark-1" />
        </div>
        {menuExpanded && "New Artist"}
      </button>
    </motion.div>
  );
};

export default ArtistsSidebar;
