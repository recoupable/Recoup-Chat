import { ImageSkeleton } from "@/components/VercelChat/tools/image/ImageSkeleton";
import { ImageResult } from "@/components/VercelChat/tools/image/ImageResult";
import { ImageGenerationResult } from "@/lib/tools/generateImage";
import MermaidDiagram from "@/components/VercelChat/tools/mermaid/MermaidDiagram";
import { MermaidDiagramSkeleton } from "@/components/VercelChat/tools/mermaid/MermaidDiagramSkeleton";
import { GenerateMermaidDiagramResult } from "@/lib/tools/generateMermaidDiagram";
import CreateArtistToolCall from "./tools/CreateArtistToolCall";
import CreateArtistToolResult from "./tools/CreateArtistToolResult";
import { CreateArtistResult } from "@/lib/tools/createArtist";
import DeleteArtistToolCall from "./tools/DeleteArtistToolCall";
import DeleteArtistToolResult from "./tools/DeleteArtistToolResult";
import { DeleteArtistResult } from "@/lib/tools/deleteArtist";
import GetSpotifySearchToolResult from "./tools/GetSpotifySearchToolResult";
import { SpotifyDeepResearchResultUIType, SpotifyArtistTopTracksResultType, SpotifySearchResponse } from "@/types/spotify";
import { ArtistSocialsResultType } from "@/types/ArtistSocials";
import { ToolInvocation } from "ai";
import UpdateArtistInfoSuccess from "./tools/UpdateArtistInfoSuccess";
import { UpdateAccountInfoResult } from "@/lib/tools/updateAccountInfo";
import UpdateArtistSocialsSuccess from "./tools/UpdateArtistSocialsSuccess";
import { UpdateArtistSocialsResult } from "@/lib/tools/updateArtistSocials";
import { TxtFileResult } from "@/components/ui/TxtFileResult";
import { TxtFileGenerationResult } from "@/lib/tools/createTxtFile";
import { Loader } from "lucide-react";
import { getDisplayToolName } from "@/lib/tools/get-tools-name";
import GenericSuccess from "./tools/GenericSuccess";
import getToolInfo from "@/lib/utils/getToolsInfo";
import { GetSpotifyPlayButtonClickedResult } from "@/lib/supabase/getSpotifyPlayButtonClicked";
import GetVideoGameCampaignPlaysResultComponent from "./tools/GetVideoGameCampaignPlaysResult";
import { CommentsResult } from "@/components/Chat/comments/CommentsResult";
import { CommentsResultData } from "@/types/Comment";
import CommentsResultSkeleton from "@/components/Chat/comments/CommentsResultSkeleton";
import GetSegmentFansResult from "./tools/segment-fans/GetSegmentFansResult";
import GetSegmentFansResultSkeleton from "./tools/segment-fans/GetSegmentFansResultSkeleton";
import { SegmentFansResult } from "@/types/fans";
import YouTubeAccessSkeleton from "./tools/youtube/YouTubeAccessSkeleton";
import YouTubeRevenueResult from "./tools/youtube/YouTubeRevenueResult";
import YouTubeRevenueSkeleton from "./tools/youtube/YouTubeRevenueSkeleton";
import {
  YouTubeChannelInfoResult,
  YouTubeChannelVideoListResult,
  YouTubeRevenueResult as YouTubeRevenueResultType,
} from "@/types/youtube";
import YouTubeChannelsResult from "./tools/youtube/YouTubeChannelsResult";
import YouTubeLoginResult from "./tools/youtube/YouTubeLoginResult";
import { YouTubeLoginResultType } from "@/lib/tools/youtubeLogin";
import YoutubeChannelVideosListResult from "./tools/youtube/YoutubeChannelVideosListResult";
import YouTubeChannelVideosListSkeleton from "./tools/youtube/YouTubeChannelVideosListSkeleton";
import YouTubeSetThumbnailResult from "./tools/youtube/YouTubeSetThumbnailResult";
import YouTubeSetThumbnailSkeleton from "./tools/youtube/YouTubeSetThumbnailSkeleton";
import type { YouTubeSetThumbnailResult as YouTubeSetThumbnailResultType } from "@/types/youtube";
import SearchWebSkeleton from "./tools/SearchWebSkeleton";
import SpotifyDeepResearchSkeleton from "./tools/SpotifyDeepResearchSkeleton";
import SearchWebResult, { SearchWebResultType } from "./tools/SearchWebResult";
import SpotifyDeepResearchResult from "./tools/SpotifyDeepResearchResult";
import GetArtistSocialsResult from "./tools/GetArtistSocialsResult";
import GetArtistSocialsSkeleton from "./tools/GetArtistSocialsSkeleton";
import GetSpotifyArtistAlbumsResult from "./tools/GetSpotifyArtistAlbumsResult";
import { SpotifyArtistAlbumsResultUIType } from "@/types/spotify";
import GetSpotifyArtistAlbumsSkeleton from "./tools/GetSpotifyArtistAlbumsSkeleton";
import SpotifyArtistTopTracksResult from "./tools/SpotifyArtistTopTracksResult";
import SpotifyArtistTopTracksSkeleton from "./tools/SpotifyArtistTopTracksSkeleton";
import GetScheduledActionsSuccess from "./tools/GetScheduledActionsSuccess";
import GetScheduledActionsSkeleton from "./tools/GetScheduledActionsSkeleton";
import { GetScheduledActionsResult } from "@/lib/tools/scheduled_actions/getScheduledActions";
import CreateScheduledActionsSuccess from "./tools/CreateScheduledActionsSuccess";
import CreateScheduledActionsSkeleton from "./tools/CreateScheduledActionsSkeleton";
import { CreateScheduledActionsResult } from "@/lib/tools/scheduled_actions/createScheduledActions";
import GetSpotifyAlbumWithTracksResult from "./tools/GetSpotifyAlbumWithTracksResult";
import { SpotifyAlbum } from "@/lib/tools/getSpotifyAlbum";

/**
 * Interface for tool call props
 */
interface ToolCallProps {
  toolName: string;
  toolCallId: string;
}

/**
 * Union type for all possible tool results
 */
type ToolResult =
  | ImageGenerationResult
  | GenerateMermaidDiagramResult
  | CreateArtistResult
  | DeleteArtistResult
  | GetSpotifyPlayButtonClickedResult
  | CommentsResultData
  | SegmentFansResult
  | YouTubeChannelInfoResult
  | YouTubeRevenueResultType
  | YouTubeLoginResultType
  | SearchWebResultType
  | ArtistSocialsResultType
  | SpotifyDeepResearchResultUIType
  | SpotifyArtistAlbumsResultUIType
  | SpotifyArtistTopTracksResultType
  | GetScheduledActionsResult
  | CreateScheduledActionsResult
  | SpotifyAlbum
  | Record<string, unknown>;

/**
 * Interface for tool result props
 */
interface ToolResultProps extends ToolCallProps {
  result: ToolResult;
}

/**
 * Helper function to get the appropriate UI component for a tool call
 */
export function getToolCallComponent({ toolName, toolCallId }: ToolInvocation) {
  // Handle generate_image tool call
  if (toolName === "generate_image") {
    return (
      <div key={toolCallId} className="skeleton">
        <ImageSkeleton />
      </div>
    );
  } else if (toolName === "generate_mermaid_diagram") {
    return (
      <div key={toolCallId}>
        <MermaidDiagramSkeleton />
      </div>
    );
  } else if (toolName === "create_new_artist") {
    return (
      <div key={toolCallId}>
        <CreateArtistToolCall />
      </div>
    );
  } else if (toolName === "delete_artist") {
    return (
      <div key={toolCallId}>
        <DeleteArtistToolCall />
      </div>
    );
  } else if (toolName === "get_post_comments") {
    return (
      <div key={toolCallId}>
        <CommentsResultSkeleton />
      </div>
    );
  } else if (toolName === "get_segment_fans") {
    return (
      <div key={toolCallId} className="w-full">
        <GetSegmentFansResultSkeleton />
      </div>
    );
  } else if (toolName === "get_youtube_channels") {
    return (
      <div key={toolCallId}>
        <YouTubeAccessSkeleton />
      </div>
    );
  } else if (toolName === "get_youtube_revenue") {
    return (
      <div key={toolCallId}>
        <YouTubeRevenueSkeleton />
      </div>
    );
  } else if (toolName === "get_youtube_channel_video_list") {
    return (
      <div key={toolCallId}>
        <YouTubeChannelVideosListSkeleton />
      </div>
    );
  } else if (toolName === "set_youtube_thumbnail") {
    return (
      <div key={toolCallId}>
        <YouTubeSetThumbnailSkeleton />
      </div>
    );
  } else if (toolName === "search_web") {
    return (
      <div key={toolCallId}>
        <SearchWebSkeleton />
      </div>
    );
  } else if (toolName === "spotify_deep_research") {
    return (
      <div key={toolCallId}>
        <SpotifyDeepResearchSkeleton />
      </div>
    );
  } else if (toolName === "get_spotify_artist_albums") {
    return (
      <div key={toolCallId}>
        <GetSpotifyArtistAlbumsSkeleton />
      </div>
    );
  } else if (toolName === "get_artist_socials") {
    return (
      <div key={toolCallId}>
        <GetArtistSocialsSkeleton />
      </div>
    );
  } else if (toolName === "get_spotify_artist_top_tracks") {
    return (
      <div key={toolCallId}>
        <SpotifyArtistTopTracksSkeleton />
      </div>
    );
  } else if (toolName === "get_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <GetScheduledActionsSkeleton />
      </div>
    );
  } else if (toolName === "create_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <CreateScheduledActionsSkeleton />
      </div>
    );
  }

  // Default for other tools
  return (
    <div
      key={toolCallId}
      className="flex items-center gap-1 py-1 px-2 bg-primary/5 rounded-sm border w-fit text-xs"
    >
      <Loader className="h-3 w-3 animate-spin text-primary" />
      <span>Using {getDisplayToolName(toolName)}</span>
    </div>
  );
}

/**
 * Helper function to get the appropriate UI component for a tool result
 */
export function getToolResultComponent({
  toolName,
  toolCallId,
  result,
}: ToolResultProps) {
  if (toolName === "generate_image") {
    return (
      <div key={toolCallId}>
        <ImageResult result={result as ImageGenerationResult} />
      </div>
    );
  } else if (toolName === "generate_mermaid_diagram") {
    return (
      <div key={toolCallId}>
        <MermaidDiagram result={result as GenerateMermaidDiagramResult} />
      </div>
    );
  } else if (toolName === "create_new_artist") {
    return (
      <div key={toolCallId}>
        <CreateArtistToolResult result={result as CreateArtistResult} />
      </div>
    );
  } else if (toolName === "delete_artist") {
    return (
      <div key={toolCallId}>
        <DeleteArtistToolResult result={result as DeleteArtistResult} />
      </div>
    );
  } else if (toolName === "get_spotify_search") {
    return (
      <div key={toolCallId}>
        <GetSpotifySearchToolResult result={result as SpotifySearchResponse} />
      </div>
    );
  } else if (toolName === "update_account_info") {
    return (
      <div key={toolCallId}>
        <UpdateArtistInfoSuccess result={result as UpdateAccountInfoResult} />
      </div>
    );
  } else if (toolName === "update_artist_socials") {
    return (
      <div key={toolCallId}>
        <UpdateArtistSocialsSuccess
          result={result as UpdateArtistSocialsResult}
        />
      </div>
    );
  } else if (toolName === "generate_txt_file") {
    return (
      <div key={toolCallId}>
        <TxtFileResult result={result as TxtFileGenerationResult} />
      </div>
    );
  } else if (toolName === "get_video_game_campaign_plays") {
    return (
      <div key={toolCallId} className="w-full">
        <GetVideoGameCampaignPlaysResultComponent
          result={result as GetSpotifyPlayButtonClickedResult}
        />
      </div>
    );
  } else if (toolName === "get_post_comments") {
    return (
      <div key={toolCallId}>
        <CommentsResult result={result as CommentsResultData} />
      </div>
    );
  } else if (toolName === "get_segment_fans") {
    return (
      <div key={toolCallId} className="w-full">
        <GetSegmentFansResult result={result as SegmentFansResult} />
      </div>
    );
  } else if (toolName === "youtube_login") {
    return (
      <div key={toolCallId}>
        <YouTubeLoginResult result={result as YouTubeLoginResultType} />
      </div>
    );
  } else if (toolName === "get_youtube_channels") {
    return (
      <div key={toolCallId}>
        <YouTubeChannelsResult result={result as YouTubeChannelInfoResult} />
      </div>
    );
  } else if (toolName === "get_youtube_revenue") {
    return (
      <div key={toolCallId}>
        <YouTubeRevenueResult result={result as YouTubeRevenueResultType} />
      </div>
    );
  } else if (toolName === "get_youtube_channel_video_list") {
    return (
      <div key={toolCallId}>
        <YoutubeChannelVideosListResult result={result as YouTubeChannelVideoListResult} />
      </div>
    );
  } else if (toolName === "set_youtube_thumbnail") {
    return (
      <div key={toolCallId}>
        <YouTubeSetThumbnailResult result={result as YouTubeSetThumbnailResultType} />
      </div>
    );
  } else if (toolName === "search_web") {
    return (
      <div key={toolCallId}>
        <SearchWebResult result={result as SearchWebResultType} />
      </div>
    );
  } else if (toolName === "spotify_deep_research") {
    return (
      <div key={toolCallId}>
        <SpotifyDeepResearchResult result={result as SpotifyDeepResearchResultUIType} />
      </div>
    );
  } else if (toolName === "get_artist_socials") {
    return (
      <div key={toolCallId}>
        <GetArtistSocialsResult result={result as ArtistSocialsResultType} />
      </div>
    );
  } else if (toolName === "get_spotify_artist_albums") {
    return (
      <div key={toolCallId}>
        <GetSpotifyArtistAlbumsResult result={result as SpotifyArtistAlbumsResultUIType} />
      </div>
    );
  } else if (toolName === "get_spotify_artist_top_tracks") {
    return (
      <div key={toolCallId}>
        <SpotifyArtistTopTracksResult result={result as SpotifyArtistTopTracksResultType} />
      </div>
    );
  } else if (toolName === "get_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <GetScheduledActionsSuccess result={result as GetScheduledActionsResult} />
      </div>
    );
  } else if (toolName === "create_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <CreateScheduledActionsSuccess result={result as CreateScheduledActionsResult} />
      </div>
    );
  } else if (toolName === "get_spotify_album") {
    return (
      <div key={toolCallId}>
        <GetSpotifyAlbumWithTracksResult result={result as SpotifyAlbum} />
      </div>
    );
  }
 
  // Default generic result for other tools
  return (
    <GenericSuccess
      name={getDisplayToolName(toolName)}
      message={
        (result as { message?: string }).message ??
        getToolInfo(toolName).message
      }
    />
  );
}

/**
 * Main ToolComponents component - Export a single object with all tool-related UI components
 */
export const ToolComponents = {
  getToolCallComponent,
  getToolResultComponent,
};

export default ToolComponents;
