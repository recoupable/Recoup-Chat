"use client";

import { usePrivy } from "@privy-io/react-auth";
import { IconUser, IconMessageChatbot } from "@tabler/icons-react";

/**
 * EmptyState component shown when there are no messages in the chat
 * Handles both the user not logged in state and the empty chat state
 */
const EmptyState = () => {
  const { ready, authenticated, login } = usePrivy();
  if (!ready || !authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <IconUser className="h-12 w-12 mb-3 text-gray-400" />
        <p className="text-gray-500 mb-4">User data not available</p>
        <button
          onClick={login}
          className="py-2 px-4 rounded-md bg-primary text-white"
        >
          Login to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <IconMessageChatbot className="h-12 w-12 mb-3 text-gray-400" />
      <p className="text-gray-500">Type a message to start chatting</p>
    </div>
  );
};

export default EmptyState;
