import { useArtistProvider } from "@/providers/ArtistProvider";
import { ARTIST_INFO } from "@/types/Artist";

const UpdateARTIST_INFO = ({ toggleModal }: { toggleModal: () => void }) => {
  const { artists, setSelectedArtist } = useArtistProvider();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectArtist = (e: any) => {
    const currentArtist = artists.find(
      (artist: ARTIST_INFO) => artist.id === e.target.value,
    );
    if (currentArtist) setSelectedArtist(currentArtist);
  };

  return (
    <div className="w-full">
      <p className="text-sm">Please select the artist to update info.</p>
      <section className="pt-2 flex flex-col gap-2">
        <fieldset className="flex gap-2 items-center">
          <p className="text-sm">Artist Id:</p>
          <select
            className="!bg-transparent border-grey border-[1px] rounded-md px-2 text-center text-sm"
            onChange={handleSelectArtist}
          >
            {artists.map((artist: ARTIST_INFO, index: number) => (
              <option
                key={index}
                className="!bg-black text-sm"
                value={artist.id}
              >
                {artist.artist.name}
              </option>
            ))}
          </select>
        </fieldset>
        <button
          type="button"
          onClick={toggleModal}
          className="border-grey border-[1px] px-3 py-1 rounded-full text-sm w-fit"
        >
          Update Artist Info.
        </button>
      </section>
    </div>
  );
};

export default UpdateARTIST_INFO;
