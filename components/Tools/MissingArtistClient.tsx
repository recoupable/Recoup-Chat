import { useChatProvider } from "@/providers/ChatProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { ArtistRecord } from "@/types/Artist";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const MissingArtistClient = () => {
  const [clientId, setClientId] = useState("");
  const [artistId, setArtistId] = useState("");

  const { context } = useToolCallProvider();
  const artists = context?.artists;

  useEffect(() => {
    if (artists?.length) setArtistId(artists[0].id);
  }, [artists]);

  const { append } = useChatProvider();

  const handleSubmit = async () => {
    if (!clientId || !artistId) return;
    append({
      id: uuidV4(),
      content: `Create a new campaign. ClientId: ${clientId} ArtistId: ${artistId}`,
      role: "user",
    });
  };

  return (
    <div className="w-full">
      <p className="text-sm">Please provide the artist and client id.</p>
      <section className="pt-2 flex flex-col gap-2">
        <fieldset className="flex gap-2 items-center">
          <p className="text-sm">Artist Id:</p>
          <select
            className="!bg-transparent border-gray-700 border-[1px] rounded-md px-2 text-center text-sm"
            onChange={(e) => setArtistId(e.target.value)}
          >
            {artists.map((artist: ArtistRecord, index: number) => (
              <option
                key={index}
                className="!bg-black text-sm"
                value={artist.id}
              >
                {artist.id}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="flex gap-2 items-center">
          <p className="text-sm">Client Id:</p>
          <input
            type="text"
            onChange={(e) => setClientId(e.target.value)}
            className="!bg-transparent border-gray-700 border-[1px] rounded-md !outline-none px-2 py-1 text-sm"
            placeholder="Input client id."
          />
        </fieldset>
        <button
          type="button"
          onClick={handleSubmit}
          className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm w-fit"
        >
          Create a campaign
        </button>
      </section>
    </div>
  );
};

export default MissingArtistClient;
