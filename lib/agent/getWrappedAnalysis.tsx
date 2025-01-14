import { FUNNEL_ANALYSIS } from "@/types/Agent";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";

const getWrappedAnalysis = (funnel_analyses: Array<FUNNEL_ANALYSIS>) => {
  const wrappedAnalysis = funnel_analyses.find(
    (funnel_analysis: FUNNEL_ANALYSIS) =>
      !funnel_analysis.type &&
      funnel_analysis.status === STEP_OF_ANALYSIS.WRAPPED_COMPLETED,
  );

  return wrappedAnalysis;
};

export default getWrappedAnalysis;
