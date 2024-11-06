import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";

const UpdateArtistInfo = ({ toggleModal }: { toggleModal: () => void }) => {
  const { artists, setSelectedArtist, setArtistActive } = useArtistProvider();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectArtist = (e: any) => {
    setArtistActive(true);
    const currentArtist = artists.filter(
      (artist: ArtistRecord) => artist.id === e.target.value,
    );
    setSelectedArtist(currentArtist[0]);
  };

  return (
    <div className="w-full">
      <p className="text-sm">Please select the artist to update info.</p>
      <section className="pt-2 flex flex-col gap-2">
        <fieldset className="flex gap-2 items-center">
          <p className="text-sm">Artist Id:</p>
          <select
            className="!bg-transparent border-gray-700 border-[1px] rounded-md px-2 text-center text-sm"
            onChange={handleSelectArtist}
          >
            {artists.map((artist: ArtistRecord, index: number) => (
              <option
                key={index}
                className="!bg-black text-sm"
                value={artist.id}
              >
                {artist.name}
              </option>
            ))}
          </select>
        </fieldset>
        <button
          type="button"
          onClick={toggleModal}
          className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm w-fit"
        >
          Update Artist Info.
        </button>
      </section>
    </div>
  );
};

export default UpdateArtistInfo;
