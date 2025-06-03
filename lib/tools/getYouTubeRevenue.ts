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
import { validateDateRange } from "@/lib/utils/date-validator";

// Zod schema for parameter validation
const schema = z.object({
  artist_id: z.string().describe("Artist ID to get YouTube revenue data for. This tool handles authentication checking internally."),
  startDate: z.string().describe("Start date for revenue data in YYYY-MM-DD format. Example: '2024-01-01'"),
  endDate: z.string().describe("End date for revenue data in YYYY-MM-DD format. Example: '2024-01-31'. Should be after startDate.")
});

const getYouTubeRevenueTool = tool({
  description:
    "Get YouTube estimated revenue data for a specific date range for a specific account. " +
    "This tool automatically checks authentication status and either returns revenue data or authentication instructions. " +
    "Requires a monetized YouTube channel with Analytics scope enabled. " +
    "Returns daily revenue breakdown and total revenue for the specified date range. " +
    "IMPORTANT: This tool requires the artist_id, startDate, and endDate parameters. " +
    "Dates should be in YYYY-MM-DD format. If you don't know the artist_id, ask the user or use the current artist's artist_id.",
  parameters: schema,
  execute: async ({ artist_id, startDate, endDate }): Promise<YouTubeRevenueResult> => {
    // Early validation of parameters
    if (!artist_id || artist_id.trim() === '') {
      const missingParamError = YouTubeErrorBuilder.createToolError(
        "No artist_id provided to YouTube revenue tool. The LLM must pass the artist_id parameter. Please ensure you're passing the current artist's artist_id."
      );
      return missingParamError;
    }

    // Validate date range using utility function
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      const dateValidationError = YouTubeErrorBuilder.createToolError(dateValidation.error!);
      return dateValidationError;
    }
    
    try {
      // Validate YouTube tokens (internal authentication check)
      const tokenValidation = await validateYouTubeTokens(artist_id);
      
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
      console.error("YouTube revenue tool unexpected error:", error);
      
      // Handle specific API errors
      if (error && typeof error === 'object' && 'code' in error) {
        const apiError = error as { code: number; message?: string; errors?: unknown[] };
        
        if (apiError.code === 401) {
          const authExpiredError = YouTubeErrorBuilder.createToolError(
            "YouTube authentication has expired for this account. Please re-authenticate by connecting your YouTube account to get revenue data."
          );
          return authExpiredError;
        }
        
        if (apiError.code === 403) {
          console.error("403 Forbidden error details:", apiError);
          
          // More specific 403 error handling for revenue data
          const scopeError = YouTubeErrorBuilder.createToolError(
            "Access denied to YouTube revenue data. This typically means:\n\n" +
            "1. **Channel Not Monetized**: Your channel may not be eligible for or have monetization enabled.\n" +
            "2. **YouTube Partner Program**: You may not be part of the YouTube Partner Program.\n\n" +
            "**Solution**: Please re-authenticate your YouTube account and ensure you grant ALL permissions, especially Analytics and Monetization permissions. Your channel must also be eligible for monetization."
          );
          return scopeError;
        }
      }
      
      const generalError = YouTubeErrorBuilder.createToolError(
        error instanceof Error ? 
          `Failed to get YouTube revenue data: ${error.message}` : 
          "Failed to get YouTube revenue data. Please ensure your account is authenticated with YouTube and has Analytics permissions."
      );
      return generalError;
    }
  },
});

export default getYouTubeRevenueTool; 