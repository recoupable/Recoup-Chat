import useConversations from "@/hooks/useConversations";
import { getRandomHexColor } from "@/lib/getRandomColor";
import { Conversation } from "@/types/Stack";
import { useRouter } from "next/navigation";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations } = useConversations();
  const { push } = useRouter();

  return (
    <div>
      <p className="text-md mb-2">Recent Chats</p>
      <div className="max-h-[110px] md:max-h-[140px] overflow-y-auto space-y-2">
        {conversations.map((conversation: Conversation) => (
          <button
            className="flex gap-2 items-center"
            key={conversation.metadata.id}
            type="button"
            onClick={() => {
              push(`/${conversation.metadata.id}`);
              toggleModal();
            }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: `${getRandomHexColor()}`,
              }}
            />
            <p className="text-sm truncate max-w-[200px]">
              {conversation?.title || `${conversation?.metadata.content}...`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentChats;
