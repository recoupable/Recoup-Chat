import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useArtistProvider } from "@/providers/ArtistProvider";
import type { ArtistRecord } from "@/types/Artist";

export const useArtistSelection = () => {
  const {
    selectedArtist,
    setSelectedArtist,
    toggleUpdate,
    toggleSettingModal,
    toggleCreation,
  } = useArtistProvider();
  const pathname = usePathname();
  const { push } = useRouter();

  const handleSelect = useCallback(
    (artist: ArtistRecord | null) => {
      if (pathname.includes("/funnels") && selectedArtist) {
        if (selectedArtist.account_id !== artist?.account_id) {
          push("/");
        }
      }
      setSelectedArtist(artist);
    },
    [pathname, selectedArtist, push, setSelectedArtist]
  );

  const handleEdit = useCallback(
    (artist: ArtistRecord) => {
      toggleUpdate(artist);
      toggleSettingModal();
    },
    [toggleUpdate, toggleSettingModal]
  );

  const handleCreate = useCallback(() => {
    toggleCreation();
  }, [toggleCreation]);

  return {
    selectedArtist,
    handleSelect,
    handleEdit,
    handleCreate,
  };
};
