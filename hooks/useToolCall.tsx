import { Message } from "ai";
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
  useAnalyzeArtistTool(toolName, question, toolArgs);
  useCreateArtistTool(toolName, question, toolArgs);

  return {
    toolName,
    question,
    context,
    specificReportParams,
  };
};

export default useToolCall;
