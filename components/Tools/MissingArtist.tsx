import { useChatProvider } from "@/providers/ChatProvider";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

const MissingArtist = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [newArtistName, setNewArtistName] = useState("");
  const { append } = useChatProvider();

  const handleSubmit = async () => {
    append({
      id: uuidV4(),
      content: `${question as string}. Artist name: ${newArtistName}`,
      role: "user",
    });
  };

  return (
    <div>
      <p>{answer}</p>
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
    </div>
  );
};

export default MissingArtist;
