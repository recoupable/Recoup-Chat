import { z } from "zod";
import { tool } from "ai";
import { ArtistToolResponse } from "@/types/Tool";
import getFunnelAnalysis from "../chat/getFunnelAnalysis";
import getAggregatedArtist from "../agent/getAggregatedArtist";
import getAnalysisSegments from "../agent/getAnalysisSegments";
import { SEGMENT } from "@/types/Agent";

const getSegmentsReport = (question: string) =>
  tool({
    description: `**IMPORTANT:** Always call this tool for ANY question related to fan segments report:
Do NOT attempt to answer questions on these topics without consulting this tool first.
For Example:
"Please create a fan segment report for {chat_id} using this segment {segment_name}"`,
    parameters: z.object({
      chat_id: z.string().optional().describe("The chat id of funnel."),
      segment_name: z.string().optional().describe("The segment name."),
    }),
    execute: async ({ chat_id, segment_name }) => {
      if (!chat_id || !segment_name)
        return {
          context: {
            status: ArtistToolResponse.MISSING_SEGMENT_NAME_ANALYSIS_ID,
          },
          question,
        };

      const funnel_analyses = await getFunnelAnalysis(chat_id);
      if (!funnel_analyses) return;
      // @ts-expect-error TODO: Fix type mismatch between funnel_analyses and FUNNEL_ANALYSIS[]
      const artistProfile = getAggregatedArtist(funnel_analyses);
      // @ts-expect-error TODO: Fix type mismatch between funnel_analyses and FUNNEL_ANALYSIS[]
      const segments = getAnalysisSegments(funnel_analyses);
      const segment = segments?.find(
        (item: SEGMENT) => item.name === segment_name
      );

      return {
        context: {
          status: ArtistToolResponse.FUNNEL_SEGMENT_REPORT,
          artistProfile,
          analysis: {
            ...funnel_analyses,
            segment_name: segment_name,
            segment_size: segment?.size,
          },
        },
        question,
      };
    },
  });

export default getSegmentsReport;
