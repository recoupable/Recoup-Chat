"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useUserProvider } from "./UserProvder";
import { useArtistProvider } from "./ArtistProvider";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "./ConversationsProvider";
import { ChatMessage } from "@/types/reasoning";
import { useChat, Message } from "@ai-sdk/react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

interface InstantChatContextType {
  messages: ChatMessage[];
  input: string;
  pending: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const InstantChatContext = createContext<InstantChatContextType>(
  {} as InstantChatContextType
);

export const InstantChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const chatId = params?.chatId as string;
  const csrfToken = useCsrfToken();

  // State for room ID (used for new chats)
  const [activeRoomId, setActiveRoomId] = useState<string>(chatId || "");

  // Use a ref to persist messages across re-renders
  const messagesRef = useRef<ChatMessage[]>([]);

  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { addConversation } = useConversationsProvider();

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // Connect to AI SDK for chat
  const {
    messages: aiMessages,
    append: appendAiChat,
    status,
    reload,
  } = useChat({
    id: activeRoomId || chatId || "new-chat",
    api: "/api/chat",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      roomId: activeRoomId || chatId,
    },
  });

  // Reload chat when activeRoomId changes
  useEffect(() => {
    if (activeRoomId && !chatId) {
      reload();
    }
  }, [activeRoomId, chatId, reload]);

  // Combine local and AI messages
  const messages = useMemo(() => {
    // If we have API responses, show those
    if (aiMessages.length > 0 && (chatId || activeRoomId)) {
      return aiMessages as ChatMessage[];
    }
    // Otherwise, show local messages
    return localMessages;
  }, [aiMessages, localMessages, chatId, activeRoomId]);

  // When messages change, update the ref
  useEffect(() => {
    if (messages.length > 0) {
      messagesRef.current = messages;
    }
  }, [messages]);

  // If chatId from URL changes, update activeRoomId
  useEffect(() => {
    if (chatId) {
      setActiveRoomId(chatId);
      console.log("Loading messages for chatId:", chatId);
    }
  }, [chatId]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Safety checks
      if (!input.trim()) return;

      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: input,
      };

      // Clear input
      setInput("");

      // If we already have a chatId, send directly to AI
      if (chatId) {
        // Add message to UI immediately
        appendAiChat({
          id: userMessage.id,
          content: userMessage.content,
          role: "user",
        } as Message);
      } else {
        // For new chat, generate room ID upfront
        const newRoomId = uuidv4();

        // Add user message immediately
        setLocalMessages((prev) => [...prev, userMessage]);

        try {
          // First create the room with the new UUID
          // Safety check for userData
          if (!userData?.id) {
            console.error("[InstantChat] User data not available");
            throw new Error("User data not available");
          }

          // Create room with the new UUID
          const room = await createRoom(
            userData.id,
            input,
            selectedArtist?.account_id,
            newRoomId
          );

          // Add to conversations if successful
          if (room) {
            addConversation(room);
            console.log("[InstantChat] Room created:", room.id);

            // Update active room ID after successful room creation
            // This will trigger the useEffect to reload the chat
            setActiveRoomId(newRoomId);

            // Then send the message to the API
            appendAiChat({
              id: userMessage.id,
              content: userMessage.content,
              role: "user",
            } as Message);
          }
        } catch (error) {
          console.error("[InstantChat] Error:", error);

          // Add error message
          const errorMessage: ChatMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          };
          setLocalMessages((prev) =>
            // Replace thinking message with error or add to the end
            prev.length > 1
              ? [...prev.slice(0, -1), errorMessage]
              : [...prev, errorMessage]
          );
        }
      }
    },
    [input, userData, selectedArtist, addConversation, chatId, appendAiChat]
  );

  const value = {
    messages,
    input,
    pending: status === "streaming" || status === "submitted",
    handleInputChange,
    handleSubmit,
  };

  return (
    <InstantChatContext.Provider value={value}>
      {children}
    </InstantChatContext.Provider>
  );
};

export const useInstantChat = () => {
  const context = useContext(InstantChatContext);
  if (!context) {
    throw new Error("useInstantChat must be used within InstantChatProvider");
  }
  return context;
};
