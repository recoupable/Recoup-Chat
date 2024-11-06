import { useArtistProvider } from "@/providers/ArtistProvider";
import { useChatProvider } from "@/providers/ChatProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { ArtistRecord } from "@/types/Artist";
import { v4 as uuidV4 } from "uuid";

const UpdateArtistInfo = () => {
  const { artists, setSelectedArtist, setArtistActive } = useArtistProvider();
  const { question } = useToolCallProvider();

  const { append } = useChatProvider();

  const handleSubmit = async () => {
    append({
      id: uuidV4(),
      content: question,
      role: "user",
    });
  };

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
      <p className="text-sm">Please provide the artist id and campaign name.</p>
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
          onClick={handleSubmit}
          className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm w-fit"
        >
          Update Artist Info.
        </button>
      </section>
    </div>
  );
};

export default UpdateArtistInfo;
