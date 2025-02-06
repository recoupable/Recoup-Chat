import { Message } from "ai";
import useToolMessages from "./useToolMessages";
import useAnalyzeArtistTool from "./useAnalyzeArtistTool";
import useSpecificReport from "./useSpecificReport";
import useCreateArtistTool from "./useCreateArtistTool";

const useToolCall = (message: Message) => {
  const toolInvocations = [...(message.toolInvocations || [])];
  const toolInvocationResult = toolInvocations?.filter(
    (toolInvocation) => toolInvocation.state === "result",
  )?.[0];
  const question = toolInvocationResult?.result?.question || "";
  const context = toolInvocationResult?.result?.context || "";
  const toolArgs = toolInvocationResult?.result?.context?.args;
  const toolName = toolInvocationResult?.toolName;
  const specificReportParams = useSpecificReport();
  const { answer, loading, messages } = useToolMessages(question, toolName);
  useAnalyzeArtistTool(toolName, question, toolArgs);
  useCreateArtistTool(toolName, question, toolArgs);

  return {
    loading,
    answer,
    toolName,
    question,
    context,
    messages,
    specificReportParams,
  };
};

export default useToolCall;
