import useGenerateSegmentReport from "@/hooks/useGenerateSegmentReport";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useAutopilotProvider } from "@/providers/AutopilotProvider";
import { ACTION, ACTIONS } from "@/types/Autopilot";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useChatProvider } from "@/providers/ChatProvider";
import instructions from "@/evals/scripts/instructions.json";
import trackAction from "@/lib/stack/trackAction";
import { useUserProvider } from "@/providers/UserProvder";
import { useInitialChatProvider } from "@/providers/InitialChatProvider";
import useFansCSVExport from "./useFansCSVExport";

const useActionApprove = () => {
  const { append } = useChatProvider();
  const { address } = useUserProvider();
  const { selectedArtist, toggleSettingModal, toggleUpdate } =
    useArtistProvider();
  const {
    comments,
    segmentName,
    funnelType,
    reportId,
    getStackActions,
    fansSegments,
  } = useAutopilotProvider();
  const [copied, setCopied] = useState(false);
  const { handleGenerateReport } = useGenerateSegmentReport();
  const { clearMessagesCache } = useInitialChatProvider();
  const { exportCSV } = useFansCSVExport();

  const handleClick = async (action: ACTION) => {
    clearMessagesCache();
    let metadata = {};
    if (action.type === ACTIONS.SOCIAL && selectedArtist) {
      toggleUpdate(selectedArtist);
      toggleSettingModal();
    }
    if (action.type === ACTIONS.POST_REACTION) {
      navigator.clipboard.writeText(comments?.[0]?.comment || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (action.type === ACTIONS.REPORT) {
      handleGenerateReport(segmentName, funnelType || "", reportId || "");
    }
    if (action.type === ACTIONS.CONTENT_CALENDAR) {
      append(
        {
          id: uuidV4(),
          role: "user",
          content: instructions.content_calendar,
        },
        false,
        reportId || "",
      );
    }
    if (action.type === ACTIONS.FANS_PROFILES) {
      metadata = { fansCount: fansSegments.length };
      exportCSV(fansSegments);
    }
    await trackAction(
      address,
      action,
      selectedArtist?.account_id || "",
      true,
      metadata,
    );
    getStackActions();
  };

  return {
    handleClick,
    copied,
  };
};

export default useActionApprove;
