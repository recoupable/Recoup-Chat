import { useArtistProvider } from "@/providers/ArtistProvider";
import { useChatProvider } from "@/providers/ChatProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { ARTIST_INFO } from "@/types/Artist";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const MissingArtistClient = () => {
  const [clientId, setClientId] = useState("");
  const [artistId, setArtistId] = useState("");
  const { selectedArtist } = useArtistProvider();

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
      content: `Create a new campaign. CampaignName: ${clientId} ArtistId: ${selectedArtist?.artist_id || artistId}`,
      role: "user",
    });
  };

  return (
    <div className="w-full">
      <p className="text-sm">Please provide the artist id and campaign name.</p>
      <section className="pt-2 flex flex-col gap-2">
        <fieldset className="flex gap-2 items-center">
          <p className="text-sm">Artist Id:</p>
          {selectedArtist ? (
            <p className="text-sm">{selectedArtist?.artist.name}</p>
          ) : (
            <select
              className="!bg-transparent border-grey border-[1px] rounded-md px-2 text-center text-sm"
              onChange={(e) => setArtistId(e.target.value)}
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
          )}
        </fieldset>
        <fieldset className="flex gap-2 items-center">
          <p className="text-sm">Campaign Name:</p>
          <input
            type="text"
            onChange={(e) => setClientId(e.target.value)}
            className="!bg-transparent border-grey border-[1px] rounded-md !outline-none px-2 py-1 text-sm"
            placeholder="Input campaign name."
          />
        </fieldset>
        <button
          type="button"
          onClick={handleSubmit}
          className="border-grey border-[1px] px-3 py-1 rounded-full text-sm w-fit"
        >
          Create a campaign
        </button>
      </section>
    </div>
  );
};

export default MissingArtistClient;
