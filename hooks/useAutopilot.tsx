import { useArtistProvider } from "@/providers/ArtistProvider";
import { ACTION, ACTIONS } from "@/types/Autopilot";
import { useEffect, useState } from "react";
import useAnalysisActions from "./useAnalysisActions";
import trackAction from "@/lib/stack/trackAction";
import { useUserProvider } from "@/providers/UserProvder";
import useStackActions from "./useStackActions";
import useRunningAgents from "./useRunningAgents";
import useFansSegments from "./useFansSegments";
import useSocialActions from "./useSocialActions";
import useArtistComments from "./useArtistComments";

const useAutopilot = () => {
  const { selectedArtist } = useArtistProvider();
  const { address, email } = useUserProvider();
  const { curLiveAgent } = useRunningAgents();
  const { fansSegments } = useFansSegments();
  const {
    analyses,
    segmentName,
    actions: analysisActions,
    funnelType,
    reportId,
  } = useAnalysisActions();
  const { socialActions } = useSocialActions();
  const { comments } = useArtistComments();
  const [actions, setActions] = useState<Array<ACTION>>([]);
  const { stackActions, getStackActions } = useStackActions();
  const eventsLogs = [...analyses, ...stackActions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const deny = async (index: number) => {
    const temp = [...actions];
    temp.splice(index, 1);
    setActions([...temp]);
    await trackAction(
      address,
      actions[index],
      selectedArtist?.account_id || "",
      false,
      {},
    );
    getStackActions();
  };

  useEffect(() => {
    const temp = [...socialActions, ...analysisActions];
    if (comments.length)
      temp.push({
        type: ACTIONS.POST_REACTION,
        title: "Post Reaction",
        id: ACTIONS.POST_REACTION,
      });
    const filtered = temp.filter((ele) => {
      const approvedIndex = stackActions.findIndex(
        (stackAction: any) => stackAction.metadata.id === ele.id,
      );
      if (approvedIndex >= 0) return false;
      return true;
    });
    setActions([...filtered]);
    if (fansSegments.length > 0) {
      // eslint-disable-next-line
      const stackProfilesEvent = stackActions.filter(
        (event: any) =>
          event.metadata.id === ACTIONS.FANS_PROFILES &&
          event.metadata.isApproved &&
          event.metadata?.fansCount === fansSegments.length,
      );
      if (stackProfilesEvent.length === 0)
        setActions([
          ...filtered,
          {
            type: ACTIONS.FANS_PROFILES,
            title: "Export Fans Profiles",
            id: ACTIONS.FANS_PROFILES,
          },
        ]);
    }
  }, [
    analysisActions,
    socialActions,
    stackActions,
    fansSegments,
    email,
    comments,
  ]);

  return {
    actions,
    deny,
    comments,
    analyses,
    segmentName,
    funnelType,
    reportId,
    stackActions,
    eventsLogs,
    getStackActions,
    fansSegments,
    curLiveAgent,
  };
};

export default useAutopilot;
