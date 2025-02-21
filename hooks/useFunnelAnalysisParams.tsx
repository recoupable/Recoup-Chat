import capitalize from "@/lib/capitalize";
import { Funnel_Type, STEP_OF_AGENT } from "@/types/Funnel";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useFunnelAnalysisParams = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState<any>(null);
  const { funnel_type: funnelType } = useParams();
  const { push } = useRouter();
  const [handles, setHandles] = useState<any>({});
  const [isCheckingHandles, setIsCheckingHandles] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCheckingAgentStatus, setIsCheckingAgentStatus] = useState(true);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [agentsStatus, setAgentsStatus] = useState<any>([]);

  const hasError =
    agentsStatus.some(
      (agentStatus: any) =>
        agentStatus.status === STEP_OF_AGENT.ERROR ||
        agentStatus.status === STEP_OF_AGENT.UNKNOWN_PROFILE
    ) &&
    !agentsStatus.some(
      (agentStatus: any) => agentStatus.status === STEP_OF_AGENT.FINISHED
    );

  const funnelName = useMemo(() => {
    if (!funnelType) return "";
    if (funnelType === Funnel_Type.TIKTOK) return "TikTok";
    return capitalize(funnelType as string);
  }, [funnelType]);

  const handleRetry = () => {
    setUsername("");
    setIsLoading(false);
    push(`/funnels/${funnelType}/${uuidV4()}`);
  };

  return {
    username,
    setUsername,
    isLoading,
    setIsLoading,
    funnelType,
    funnelName,
    handles,
    setHandles,
    isCheckingHandles,
    setIsCheckingHandles,
    isInitializing,
    setIsInitializing,
    isCheckingAgentStatus,
    setIsCheckingAgentStatus,
    isLoadingAgent,
    setIsLoadingAgent,
    agent,
    setAgent,
    agentsStatus,
    setAgentsStatus,
    hasError,
    handleRetry,
  };
};

export default useFunnelAnalysisParams;
