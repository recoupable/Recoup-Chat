import { useArtistProvider } from "@/providers/ArtistProvider";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import { Tools } from "@/types/Tool";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

const useCreateArtistTool = (
  toolName: string | null,
  question: string | null,
  toolArgs: any,
) => {
  const { chat_id: chatId } = useParams();
  const { toggleCreation, setName } = useArtistProvider();
  // const { finalCallback } = useMessagesProvider();

  useEffect(() => {
    const triggerTool = async () => {
      toggleCreation();
      setName(toolArgs?.artistName || "");
      // await finalCallback(
      //   {
      //     role: "assistant",
      //     id: uuidV4(),
      //     content: `You create an artist using creation popup after clicking "New Artist" button.`,
      //   },
      //   { id: uuidV4(), content: question || "", role: "user" },
      //   chatId as string,
      // );
    };
    if (toolName === Tools.createArtist && toolArgs && chatId) triggerTool();
  }, [toolArgs, toolName, chatId]);
};

export default useCreateArtistTool;
