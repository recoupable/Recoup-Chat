import { useArtistProvider } from "@/providers/ArtistProvider";
import { ARTIST_INFO } from "@/types/Artist";
import { Trash2 } from "lucide-react";

const DropDown = ({ artist }: { artist: ARTIST_INFO }) => {
  const { setArtists, artists, setMenuVisibleArtistId, getArtists } =
    useArtistProvider();

  const handleDelete = async () => {
    const temp = artists.filter(
      (artistEle: ARTIST_INFO) => artistEle.artist_id !== artist.artist_id,
    );
    setArtists([...temp]);
    setMenuVisibleArtistId(null);
    await fetch(`/api/artist/remove?artistId=${artist.artist_id}`);
    getArtists();
  };

  return (
    <div className="rounded-md absolute left-1/2 top-1/2 z-[2] bg-white p-1">
      <button
        className="text-red-700 flex items-center gap-1 border-red-700 text-sm"
        onClick={handleDelete}
      >
        <Trash2 className="size-4" /> Remove
      </button>
    </div>
  );
};

export default DropDown;
