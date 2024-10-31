import { useChatProvider } from "@/providers/ChatProvider";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

const MissingArtist = () => {
  const [newArtistName, setNewArtistName] = useState("");
  const { append } = useChatProvider();

  const handleSubmit = async () => {
    append({
      id: uuidV4(),
      content: `Create a new artist named ${newArtistName}.`,
      role: "user",
    });
  };

  return (
    <div>
      <p className="text-sm">Please provide the artist name to proceed.</p>
      <fieldset className="pt-2 flex gap-2 items-center">
        <input
          type="text"
          onChange={(e) => setNewArtistName(e.target.value)}
          className="!bg-transparent border-gray-700 border-[1px] rounded-md !outline-none px-2 py-1 text-sm"
          placeholder="Input artist name."
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
        >
          Submit
        </button>
      </fieldset>
    </div>
  );
};

export default MissingArtist;
