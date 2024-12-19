import useIsMobile from "@/hooks/useIsMobile";
import getConversationTitle from "@/lib/getConversationTitle";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { Conversation } from "@/types/Stack";
import { useRouter } from "next/navigation";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, streamingTitle, streaming } =
    useConversationsProvider();
  const { push } = useRouter();
  const isMobile = useIsMobile();

  const handleClick = (conversation: Conversation) => {
    if (isMobile) toggleModal();
    if (conversation.metadata.is_funnel_analysis) {
      push(
        `/funnels/${conversation.metadata.funnel_name.toLowerCase()}/${conversation.metadata.conversationId}`,
      );
      return;
    }
    push(
      `/${conversation.metadata.conversationId}${conversation.metadata?.is_funnel_report ? "?funnel_report=true" : ""}`,
    );
  };

  return (
    <div>
      <div className="h-[1px] bg-grey-light w-full mt-1 mb-2 md:mt-2 md:mb-3" />
      <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark md:px-4">
        Recent Chats
      </p>
      <div className="max-h-[75px] md:max-h-[140px] overflow-y-auto space-y-1 md:space-y-2 md:px-4">
        {streamingTitle && streaming && (
          <button className="flex gap-2 items-center" type="button">
            <p className="text-sm truncate max-w-[200px]">{streamingTitle}</p>
          </button>
        )}
        {conversations.map((conversation: Conversation) => (
          <button
            className="flex gap-2 items-center"
            key={conversation.metadata.id}
            type="button"
            onClick={() => handleClick(conversation)}
          >
            <p className="text-sm truncate max-w-[200px]">
              {getConversationTitle(conversation)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentChats;
