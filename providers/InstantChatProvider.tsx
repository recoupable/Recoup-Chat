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
import { useRouter, useParams } from "next/navigation";
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
  isUserReady: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loginUser: () => void;
}

const InstantChatContext = createContext<InstantChatContextType>(
  {} as InstantChatContextType
);

export const InstantChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId as string;
  const csrfToken = useCsrfToken();

  // Use a ref to persist messages across re-renders
  const messagesRef = useRef<ChatMessage[]>([]);

  const { userData, login } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { addConversation } = useConversationsProvider();

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isUserReady, setIsUserReady] = useState(false);

  // Connect to AI SDK for chat
  const {
    messages: aiMessages,
    append: appendAiChat,
    status,
  } = useChat({
    id: chatId || "new-chat",
    api: "/api/chat",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      roomId: chatId,
    },
  });

  // Combine local and AI messages
  const messages = useMemo(() => {
    // If we have API responses, show those
    if (aiMessages.length > 0 && chatId) {
      return aiMessages as ChatMessage[];
    }
    // Otherwise, show local messages
    return localMessages;
  }, [aiMessages, localMessages, chatId]);

  // When messages change, update the ref
  useEffect(() => {
    if (messages.length > 0) {
      messagesRef.current = messages;
    }
  }, [messages]);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      console.log("Loading messages for chatId:", chatId);
    }
  }, [chatId]);

  // Function to trigger login
  const loginUser = useCallback(() => {
    if (login) {
      login();
    }
  }, [login]);

  // Check if user data is ready
  useEffect(() => {
    // Check for both userData and selectedArtist since we need both
    const userReady = !!userData?.id;
    const artistReady = !!selectedArtist?.account_id;

    console.log("User data status:", {
      userReady,
      artistReady,
      userData: userData?.id,
      artist: selectedArtist?.account_id,
      currentChatId: chatId,
    });

    setIsUserReady(userReady && artistReady);

    // If user is not logged in, attempt login
    if (!userReady && login) {
      console.log("Attempting to log in user");
      login();
    }
  }, [userData, selectedArtist, login, chatId]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const createNewRoom = useCallback(
    async (content: string, userMessage: ChatMessage) => {
      // If we already have a chatId, don't create a new room
      if (chatId) {
        console.log("Already in a chat room:", chatId);
        return;
      }

      // Safety check for userData and artist
      if (!userData?.id) {
        console.error("[InstantChat] User data not available");
        return;
      }

      if (!selectedArtist?.account_id) {
        console.error("[InstantChat] Artist not selected");
        return;
      }

      try {
        console.log("Creating room with:", {
          userId: userData.id,
          artistId: selectedArtist.account_id,
        });

        // Create room silently in the background
        const room = await createRoom(
          userData.id,
          content,
          selectedArtist.account_id
        );

        // Add to conversations
        if (room) {
          addConversation(room);

          // Use router.replace() for seamless transition
          router.replace(`/instant/${room.id}`);

          // Send message to AI after room creation
          try {
            appendAiChat({
              id: userMessage.id,
              content: userMessage.content,
              role: "user",
            } as Message);
          } catch (error) {
            console.error("[InstantChat] Error sending message to API:", error);
          }
        }
      } catch (error) {
        console.error("[InstantChat] Error creating room:", error);
        // Add error message
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setLocalMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      }
    },
    [userData, selectedArtist, addConversation, router, chatId, appendAiChat]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Safety checks
      if (!isUserReady || !input.trim()) return;

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
        // For new chat, show messages locally first
        // Add user message immediately
        setLocalMessages((prev) => [...prev, userMessage]);

        // Add assistant thinking message
        const thinkingMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: "Hmm...",
        };

        // Add thinking message
        setLocalMessages((prev) => [...prev, thinkingMessage]);

        // Create room and send to API
        createNewRoom(input, userMessage);
      }
    },
    [input, isUserReady, createNewRoom, chatId, appendAiChat]
  );

  const value = {
    messages,
    input,
    pending: status === "streaming" || status === "submitted",
    isUserReady,
    handleInputChange,
    handleSubmit,
    loginUser,
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
