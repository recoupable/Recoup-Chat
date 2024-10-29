import { useChatProvider } from "@/providers/ChatProvider";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

const SubmitArtist = () => {
  const [artistName, setArtistName] = useState("");

  const { append } = useChatProvider();

  const handleSubmit = async () => {
    append({
      id: uuidV4(),
      content: `Create a new artist. Name:${artistName}`,
      role: "user",
    });
  };
  return (
    <div>
      <p className="text-sm">{`You don't manage any artists.`}</p>
      <p className="py-2 text-sm">
        To create a new artist, submit new artist information.
      </p>
      <fieldset className="flex gap-2 items-center">
        <input
          type="text"
          onChange={(e) => setArtistName(e.target.value)}
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

export default SubmitArtist;
