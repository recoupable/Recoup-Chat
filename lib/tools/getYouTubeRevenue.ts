/**
 * YouTube Revenue Tool
 *
 * Fetches estimated revenue data for the past month from YouTube Analytics API.
 * Automatically handles authentication checking and returns either:
 * - Revenue data for the past 30 days if authenticated
 * - Authentication error/instructions if not authenticated
 *
 * Requires monetization-enabled YouTube channel with Analytics scope.
 */

import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { YouTubeRevenueResult } from "@/types/youtube";
import { queryAnalyticsReports } from "@/lib/youtube/queryAnalyticsReports";
import { handleRevenueError } from "@/lib/youtube/revenue-error-handler";
import { validateYouTubeTokens } from "../youtube/token-validator";

// Zod schema for parameter validation
const schema = z.object({
  artist_account_id: z
    .string()
    .describe(
      "artist_account_id from the system prompt of the active artist."
    ),
  startDate: z
    .string()
    .default(() => {
      const date = new Date();
      date.setDate(date.getDate() - 30); // 30 days ago
      return date.toISOString().split("T")[0];
    })
    .describe(
      "Start date for revenue data in YYYY-MM-DD format. Example: '2024-01-01'. If not provided, defaults to 30 days ago."
    ),
  endDate: z
    .string()
    .default(() => {
      const date = new Date();
      date.setDate(date.getDate() - 1); // Yesterday
      return date.toISOString().split("T")[0];
    })
    .describe(
      "End date for revenue data in YYYY-MM-DD format. Example: '2024-01-31'. Should be after startDate. If not provided, defaults to yesterday."
    ),
});

const getYouTubeRevenueTool = tool({
  description: `Youtube: Get estimated revenue data for a specific date range for a YouTube account.
This tool requires a valid access_token (and optionally a refresh_token) obtained from a prior authentication step (e.g., youtube_login).
The startDate and endDate parameters are optional - if not provided, it will default to the last 30 days (1 month).
When provided, dates should be in YYYY-MM-DD format.
IMPORTANT: Always call the youtube_login tool first to obtain the required tokens before calling this tool.`,
  parameters: schema,
  // @ts-ignore
  execute: async ({
    artist_account_id,
    startDate,
    endDate,
  }: { artist_account_id: string, startDate: string, endDate: string }): Promise<YouTubeRevenueResult> => {
    if (!artist_account_id || artist_account_id.trim() === "") {
      return YouTubeErrorBuilder.createToolError(
        "No artist_account_id provided to YouTube login tool. The LLM must pass the artist_account_id parameter. Please ensure you're passing the current artist's artist_account_id."
      );
    }
    try {
      const tokenValidation = await validateYouTubeTokens(artist_account_id);
      if (!tokenValidation.success) {
        return YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. Please authenticate by connecting your YouTube account.`
        );
      }
      const access_token = tokenValidation.tokens!.access_token;
      const refresh_token = tokenValidation.tokens!.refresh_token;

      const analyticsResult = await queryAnalyticsReports({
        accessToken: access_token,
        refreshToken: refresh_token ?? undefined,
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        metrics: "estimatedRevenue",
      });
      return YouTubeErrorBuilder.createToolSuccess(
        `YouTube revenue data retrieved successfully for ${analyticsResult.dailyRevenue.length} days. Total revenue: $${analyticsResult.totalRevenue.toFixed(2)}`,
        {
          revenueData: {
            totalRevenue: parseFloat(analyticsResult.totalRevenue.toFixed(2)),
            dailyRevenue: analyticsResult.dailyRevenue,
            dateRange: {
              startDate,
              endDate,
            },
            channelId: analyticsResult.channelId,
            isMonetized: true,
          },
        }
      );
    } catch (error: unknown) {
      return handleRevenueError(error);
    }
  },
});

export default getYouTubeRevenueTool;
