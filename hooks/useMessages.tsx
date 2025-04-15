import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useCsrfToken } from "./useCsrfToken";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";
import createMemory from "@/lib/createMemory";
import { useUserProvider } from "@/providers/UserProvder";
import getClientMessages from "@/lib/supabase/getClientMessages";
import { useChatSegment } from "./useChatSegment";
import { ChatMessage } from "@/types/reasoning";

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const { selectedArtist } = useArtistProvider();
  const { roomId } = useParams();
  const { userData } = useUserProvider();
  const [isLoading, setIsLoading] = useState(false);
  const { data: segmentData, isError: segmentError } = useChatSegment(
    roomId as string
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAiChatSubmit,
    append: appendAiChat,
    status,
    setMessages,
    reload: reloadAiChat,
  } = useChat({
    id: roomId as string,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      roomId: roomId as string,
      segmentId: segmentData?.segmentId,
    },
    onFinish: (message) => {
      if (roomId) {
        createMemory(message as ChatMessage, roomId as string);
      }
    },
  });

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
    }
  }, [roomId, setMessages]);

  useEffect(() => {
    const fetch = async () => {
      if (!userData?.id) return;
      if (!roomId) return;
      setIsLoading(true);
      const initialMessages = await getClientMessages(roomId as string);
      setMessages(initialMessages as ChatMessage[]);
      setIsLoading(false);
    };
    fetch();
  }, [roomId, userData, setMessages]);

  if (segmentError) {
    console.error("[useMessages] Error fetching segment:", segmentError);
  }

  return {
    reloadAiChat,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    input,
    setMessages,
    messages: messages as ChatMessage[],
    pending: status === "streaming" || status === "submitted",
    isLoading,
  };
};

export default useMessages;
