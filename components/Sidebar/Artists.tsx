import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, MicVocal, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Artists = () => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const { artists, setSelectedArtist, setIsOpenSettingModal, toggleCreation } =
    useArtistProvider();

  const handleClick = (artist: ArtistRecord) => {
    setSelectedArtist(artist);
    setIsOpenSettingModal(true);
  };

  return (
    <>
      <button
        className="flex gap-3 items-center transition duration-[300ms] relative"
        type="button"
        onClick={() => setIsOpenDropDown(!isOpenDropDown)}
      >
        <div className="flex gap-2">
          <MicVocal />
          Artists
        </div>
        {isOpenDropDown ? <ChevronUp /> : <ChevronDown />}
      </button>
      <AnimatePresence initial={false}>
        {isOpenDropDown && (
          <motion.section
            className="pl-6 pt-3 flex flex-col gap-2 max-h-[100px] md:max-h-[160px] overflow-y-auto"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto" },
              collapsed: { height: 0 },
            }}
            transition={{
              duration: 0.1,
            }}
          >
            {artists.map((artist: ArtistRecord) => (
              <button
                key={artist.id}
                className="flex gap-2 items-center"
                type="button"
                onClick={() => handleClick(artist)}
              >
                <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-md overflow-hidden">
                  <Image
                    src={artist.image || "https://i.imgur.com/QCdc8Ai.jpg"}
                    layout="fill"
                    alt="not found icon"
                  />
                </div>
                <p className="text-sm">{artist.name}</p>
              </button>
            ))}
            <button
              type="button"
              className="flex gap-2 items-center"
              onClick={toggleCreation}
            >
              <Plus />
              <p className="text-sm">New Artist</p>
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default Artists;
