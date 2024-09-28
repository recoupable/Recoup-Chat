import Suggestions from "./Suggestions";
import ChatInput from "./ChatInput";
import { useCsrfToken } from "@/packages/shared/src/hooks";
import { useChat } from "ai/react";
import { useQueryClient } from "@tanstack/react-query";
import Messages from "./Messages";

const Chat = () => {
  const csrfToken = useCsrfToken();
  const accountId = "3664dcb4-164f-4566-8e7c-20b2c93f9951";
  const queryClient = useQueryClient();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      accountId,
    },
    onError: console.error,
    onFinish: () => {
      void queryClient.invalidateQueries({
        queryKey: ["credits", accountId],
      });
    },
  });

  return (
    <div>
      <ChatInput
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        input={input}
      />
      <Messages messages={messages} />
      <Suggestions />
    </div>
  );
};

export default Chat;
