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

// Zod schema for parameter validation
const schema = z.object({
  access_token: z
    .string()
    .describe(
      "OAuth access token for YouTube API. Must be obtained via prior authentication using the youtube_login tool."
    ),
  refresh_token: z
    .string()
    .optional()
    .describe(
      "OAuth refresh token for YouTube API. Optional, but recommended for token refresh. Must be obtained via prior authentication using the youtube_login tool."
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
  execute: async ({
    access_token,
    refresh_token,
    startDate,
    endDate,
  }): Promise<YouTubeRevenueResult> => {
    if (!access_token || access_token.trim() === "") {
      return YouTubeErrorBuilder.createToolError(
        "No access_token provided to YouTube revenue tool. Please ensure you pass a valid access_token from the authentication step."
      );
    }
    try {
      // Construct a minimal tokenValidation object for queryAnalyticsReports
      const tokenValidation = {
        success: true,
        tokens: {
          access_token,
          refresh_token: refresh_token ?? null,
          account_id: "",
          created_at: "",
          expires_at: "",
          id: "",
          updated_at: "",
        },
      };
      // Query analytics reports using the extracted function
      const analyticsResult = await queryAnalyticsReports(
        tokenValidation,
        startDate,
        endDate,
        "estimatedRevenue"
      );
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
