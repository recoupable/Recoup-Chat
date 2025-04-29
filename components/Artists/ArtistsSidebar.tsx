"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useArtistProvider } from "@/providers/ArtistProvider";
import Artist from "../Header/Artist";
import { ArtistRecord } from "@/types/Artist";
import { Plus } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useUserProvider } from "@/providers/UserProvder";
import { useSidebarExpansion } from "@/providers/SidebarExpansionContext";

const ArtistsSidebar = () => {
  const { toggleCreation, toggleSettingModal, sorted, selectedArtist } = useArtistProvider();
  const { isPrepared, email } = useUserProvider();
  const { setIsExpanded } = useSidebarExpansion();
  const isMobile = useIsMobile();
  const isArtistSelected = !!selectedArtist;

  const [menuExpanded, setMenuExpanded] = useState(false);
  const animate = { width: menuExpanded ? 220 : 80 };
  const initial = { width: 80 };

  // Update the shared context when the local state changes
  useEffect(() => {
    setIsExpanded(menuExpanded);
  }, [menuExpanded, setIsExpanded]);

  const handleCreate = () => {
    if (!isPrepared()) return;

    toggleCreation();
    toggleSettingModal();
  };

  return (
    <motion.div
      className={`px-3 py-7 hidden md:flex flex-col gap-2 z-50 ${menuExpanded ? 'items-stretch' : 'items-center'} ${!isArtistSelected ? 'relative' : ''}`}
      animate={animate}
      initial={initial}
      transition={{ duration: 0.2 }}
      onMouseOver={() => setMenuExpanded(!isMobile)}
      onMouseOut={() => setMenuExpanded(false)}
    >
      <div className={`no-scrollbar grow flex flex-col overflow-y-auto overflow-x-hidden ${menuExpanded ? 'w-full' : 'items-center'}`}>
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
        className={`${menuExpanded ? "flex px-2 py-1 gap-2 text-sm items-center text-grey-dark-1" : "flex justify-center"} ${!isArtistSelected ? 'relative z-50 brightness-125' : ''}`}
        onClick={handleCreate}
        type="button"
      >
        <div className={`w-8 flex justify-center ${!menuExpanded && "mx-auto"}`}>
          <Plus className="size-5 text-grey-dark-1" />
        </div>
        {menuExpanded && "New Artist"}
      </button>
    </motion.div>
  );
};

export default ArtistsSidebar;
