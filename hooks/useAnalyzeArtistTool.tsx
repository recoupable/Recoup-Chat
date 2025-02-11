import { useAgentsProvider } from "@/providers/AgentsProvider";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import { Tools } from "@/types/Tool";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

const useAnalyzeArtistTool = (
  toolName: string | null,
  question: string | null,
  toolArgs: any,
) => {
  const { lookupProfiles } = useAgentsProvider();
  // const { finalCallback } = useMessagesProvider();
  const { chat_id: chatId } = useParams();

  useEffect(() => {
    const triggerTool = async () => {
      const socialPlatform = toolArgs?.social_platform;
      const agentType = socialPlatform
        ? socialPlatform.toLowerCase()
        : "wrapped";
      // await finalCallback(
      //   {
      //     role: "assistant",
      //     id: uuidV4(),
      //     content: `I am trying here. https://chat.recoupable.com/funnels/${agentType}`,
      //   },
      //   { id: uuidV4(), content: question || "", role: "user" },
      //   chatId as string,
      // );
      lookupProfiles(agentType);
    };
    if (toolName === Tools.analyzeArtist && toolArgs && chatId) triggerTool();
  }, [toolName, toolArgs]);
};

export default useAnalyzeArtistTool;
