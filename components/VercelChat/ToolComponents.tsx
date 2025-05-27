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
import { SpotifySearchResponse } from "@/types/spotify";
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
