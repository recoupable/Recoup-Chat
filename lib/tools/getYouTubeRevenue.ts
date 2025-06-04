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
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { YouTubeRevenueResult } from "@/types/youtube";
import { queryAnalyticsReports } from "@/lib/youtube/queryAnalyticsReports";
import { handleRevenueError } from "@/lib/youtube/revenue-error-handler";

// Zod schema for parameter validation
const schema = z.object({
  artist_account_id: z.string().describe("Artist ID to get YouTube revenue data for. This tool handles authentication checking internally."),
  startDate: z.string().default(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // 30 days ago
    return date.toISOString().split("T")[0];
  }).describe("Start date for revenue data in YYYY-MM-DD format. Example: '2024-01-01'. If not provided, defaults to 30 days ago."),
  endDate: z.string().default(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Yesterday
    return date.toISOString().split("T")[0];
  }).describe("End date for revenue data in YYYY-MM-DD format. Example: '2024-01-31'. Should be after startDate. If not provided, defaults to yesterday.")
});

const getYouTubeRevenueTool = tool({
  description:
    "Get YouTube estimated revenue data for a specific date range for a specific account. " +
    "This tool automatically checks authentication status and either returns revenue data or authentication instructions. " +
    "Requires a monetized YouTube channel with Analytics scope enabled. " +
    "Returns daily revenue breakdown and total revenue for the specified date range. " +
    "IMPORTANT: This tool requires the artist_account_id parameter. The startDate and endDate parameters are optional - " +
    "if not provided, it will default to the last 30 days (1 month). " +
    "When provided, dates should be in YYYY-MM-DD format. If you don't know the artist_account_id, ask the user or use the current artist's artist_account_id.",
  parameters: schema,
  execute: async ({ artist_account_id, startDate, endDate }): Promise<YouTubeRevenueResult> => {
    try {
      // Validate YouTube tokens (internal authentication check)
      const tokenValidation = await validateYouTubeTokens(artist_account_id);
      
      if (!tokenValidation.success) {
        return YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. ${tokenValidation.error!.message} Please authenticate by connecting your YouTube account.`
        );
      }

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
              startDate: startDate,
              endDate: endDate,
            },
            channelId: analyticsResult.channelId,
            isMonetized: true,
          }
        }
      );

    } catch (error: unknown) {
      return handleRevenueError(error);
    }
  },
});

export default getYouTubeRevenueTool; 