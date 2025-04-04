"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useUserProvider } from "./UserProvder";
import { useArtistProvider } from "./ArtistProvider";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "./ConversationsProvider";
import { ChatMessage } from "@/types/reasoning";

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
  const { userData, login } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { addConversation } = useConversationsProvider();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);

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
    });

    setIsUserReady(userReady && artistReady);

    // If user is not logged in, attempt login
    if (!userReady && login) {
      console.log("Attempting to log in user");
      login();
    }
  }, [userData, selectedArtist, login]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const createNewRoom = useCallback(
    async (content: string) => {
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

          // Silent route change - doesn't reload components
          router.push(`/${room.id}`);
        }
      } catch (error) {
        console.error("[InstantChat] Error creating room:", error);
        // Reset pending state on error
        setPending(false);

        // Add error message
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      }
    },
    [userData, selectedArtist, addConversation, router]
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

      // Add message immediately
      setMessages((prev) => [...prev, userMessage]);

      // Clear input
      setInput("");

      // Show thinking state
      setPending(true);

      // Add assistant thinking message
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Hmm...",
      };

      // Add assistant message immediately
      setMessages((prev) => [...prev, assistantMessage]);

      // Create room in background (silently changes route)
      createNewRoom(input);
    },
    [input, isUserReady, createNewRoom]
  );

  const value = {
    messages,
    input,
    pending,
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
