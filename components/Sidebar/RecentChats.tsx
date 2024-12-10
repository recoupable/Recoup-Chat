import useIsMobile from "@/hooks/useIsMobile";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";
import { Conversation } from "@/types/Stack";
import { useRouter } from "next/navigation";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, streamingTitle, streaming } =
    useConversationsProvider();
  const { push } = useRouter();
  const isMobile = useIsMobile();
  const { clearReport } = useTikTokReportProvider();

  const handleClick = (conversation: Conversation) => {
    if (isMobile) toggleModal();
    clearReport();
    if (conversation.isTikTokAnalysis) {
      push(
        `/funnels/tiktok-account-analysis/${conversation.metadata.conversationId}`,
      );
      return;
    }
    if (conversation?.metadata?.referenceId) {
      push(`/${conversation.metadata.conversationId}?report=enabled`);
      return;
    }
    push(`/${conversation.metadata.conversationId}`);
  };

  return (
    <div>
      <p className="text-md mb-2">Recent Chats</p>
      <div className="max-h-[110px] md:max-h-[140px] overflow-y-auto space-y-2">
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
              {conversation?.title || `${conversation?.metadata.content}`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentChats;
