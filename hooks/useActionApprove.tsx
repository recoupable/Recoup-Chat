import { useArtistProvider } from "@/providers/ArtistProvider";
import { useAutopilotProvider } from "@/providers/AutopilotProvider";
import { ACTION, ACTIONS } from "@/types/Autopilot";
import { useState } from "react";
import useFansCSVExport from "./useFansCSVExport";
import { v4 as uuidV4 } from "uuid";
import { useChatProvider } from "@/providers/ChatProvider";
import instructions from "@/evals/scripts/instructions.json";

const useActionApprove = () => {
  const { selectedArtist, toggleSettingModal, toggleUpdate } =
    useArtistProvider();
  const { comments, fansSegments, addExistingActions, newActionUsed } =
    useAutopilotProvider();
  const [copied, setCopied] = useState(false);
  const { exportCSV } = useFansCSVExport();
  const { append } = useChatProvider();

  const handleClick = async (action: ACTION) => {
    if (action.type === ACTIONS.AI_ACTION) {
      newActionUsed(action?.id);
      append({
        id: uuidV4(),
        role: "user",
        content: action.title,
      });
    }
    if (action.type === ACTIONS.SOCIAL && selectedArtist) {
      toggleUpdate(selectedArtist);
      toggleSettingModal();
    }
    if (action.type === ACTIONS.POST_REACTION) {
      navigator.clipboard.writeText(comments?.[0]?.comment || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (action.type === ACTIONS.CONTENT_CALENDAR) {
      append({
        id: uuidV4(),
        role: "user",
        content: instructions.content_calendar,
      });
    }
    if (action.type === ACTIONS.FANS_PROFILES) {
      exportCSV(fansSegments);
    }
    addExistingActions(action);
  };

  return {
    handleClick,
    copied,
  };
};

export default useActionApprove;
