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
import { createYouTubeAnalyticsClient } from "@/lib/youtube/youtube-analytics-oauth-client";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { YouTubeRevenueResult } from "@/types/youtube";

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
        // Return authentication error with clear instructions
        const authError = YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. ${tokenValidation.error!.message} Please authenticate by connecting your YouTube account.`
        );
        return authError;
      }

      // Get user's channel ID first
      const youtube = createYouTubeAPIClient(
        tokenValidation.tokens!.access_token, 
        tokenValidation.tokens!.refresh_token ?? undefined
      );
      
      const channelResponse = await youtube.channels.list({
        part: ["id"],
        mine: true,
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        const noChannelError = YouTubeErrorBuilder.createToolError(
          "No YouTube channel found for this account. Please ensure you have a YouTube channel."
        );
        return noChannelError;
      }

      const channelId = channelResponse.data.items[0].id;
      if (!channelId) {
        const invalidChannelError = YouTubeErrorBuilder.createToolError(
          "Unable to retrieve channel ID. Please ensure your YouTube account is properly set up."
        );
        return invalidChannelError;
      }

      // Create YouTube Analytics API client
      const ytAnalytics = createYouTubeAnalyticsClient(
        tokenValidation.tokens!.access_token,
        tokenValidation.tokens!.refresh_token ?? undefined
      );

      // Query estimated revenue for the specified date range
      const response = await ytAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate: startDate,
        endDate: endDate,
        metrics: "estimatedRevenue",
        dimensions: "day",
        sort: "day",
      });

      // Process the response
      const rows = response.data.rows || [];
      
      if (rows.length === 0) {
        // No revenue data - channel might not be monetized
        const noRevenueData = YouTubeErrorBuilder.createToolError(
          "No revenue data found. This could mean your channel is not monetized or you don't have the required Analytics scope permissions. Please ensure your channel is eligible for monetization and you've granted Analytics permissions."
        );
        return noRevenueData;
      }

      // Parse daily revenue data
      const dailyRevenue = rows.map((row: (string | number)[]) => ({
        date: String(row[0]), // Day dimension (YYYY-MM-DD format)
        revenue: parseFloat(String(row[1])) || 0 // Estimated revenue
      }));

      // Calculate total revenue
      const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);

      const returnResult = YouTubeErrorBuilder.createToolSuccess(
        `YouTube revenue data retrieved successfully for ${dailyRevenue.length} days. Total revenue: $${totalRevenue.toFixed(2)}`,
        {
          revenueData: {
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            dailyRevenue,
            dateRange: {
              startDate: startDate,
              endDate: endDate,
            },
            channelId,
            isMonetized: true,
          }
        }
      );
      return returnResult;

    } catch (error: unknown) {
      return YouTubeErrorBuilder.createToolError(
        error instanceof Error ? error.message : "Failed to get YouTube revenue data. Please check your authentication and try again, or channel might not be monetized or have insufficient permissions."
      );
    }
  },
});

export default getYouTubeRevenueTool; 