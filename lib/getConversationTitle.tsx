import { Conversation } from "@/types/Stack";

const getConversationTitle = (conversation: Conversation) => {
  return `${conversation?.title}` || `${conversation?.metadata.content}`;
};

export default getConversationTitle;
