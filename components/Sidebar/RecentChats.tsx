import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import capitalize from "@/lib/capitalize";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading } = useConversationsProvider();
  const { handleClick } = useClickChat();

  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-grey-light w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />
      <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark px-2 shrink-0">
        Recent Chats
      </p>
      <div className="overflow-y-auto space-y-1 md:space-y-1.5 flex-grow">
        {isLoading ? (
          <RecentChatSkeleton />
        ) : (
          <>
            {/* eslint-disable-next-line */}
            {conversations.map((conversation: any, index: number) => (
              <button
                className="flex gap-2 items-center w-full py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors duration-150"
                key={index}
                type="button"
                onClick={() => handleClick(conversation, toggleModal)}
              >
                <p className="text-sm truncate max-w-[200px] text-left">
                  {conversation?.topic ||
                    `${capitalize(conversation?.type)} Analysis`}
                </p>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentChats;
