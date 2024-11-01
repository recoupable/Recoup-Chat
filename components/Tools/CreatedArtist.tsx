import { useChatProvider } from "@/providers/ChatProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { v4 as uuidV4 } from "uuid";

const CreatedArtist = () => {
  const { context } = useToolCallProvider();
  const { append } = useChatProvider();
  const data = context?.data;

  const handleSubmit = () => {
    append({
      id: uuidV4(),
      content: `Create a new campaign.`,
      role: "user",
    });
  };

  return (
    <div>
      <p className="text-sm">Name: {data?.name}</p>
      <p className="text-sm">Id: {data?.id}</p>
      <p className="py-2 text-sm">
        To create a new campaign for the next step, click the button below.
      </p>
      <button
        type="button"
        className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
        onClick={handleSubmit}
      >
        Create a new campaign
      </button>
    </div>
  );
};

export default CreatedArtist;
