import { ImageSkeleton } from "@/components/ui/ImageSkeleton";
import { ImageResult } from "@/components/ui/ImageResult";
import { ImageGenerationResult } from "@/lib/tools/generateImage";
import MermaidDiagram from "../Chat/mermaid/MermaidDiagram";
import { GenerateMermaidDiagramResult } from "@/lib/tools/generateMermaidDiagram";
import { MermaidDiagramSkeleton } from "../ui/MermaidDiagramSkeleton";
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
type ToolResult = ImageGenerationResult | GenerateMermaidDiagramResult | Record<string, unknown>;

/**
 * Interface for tool result props
 */
interface ToolResultProps extends ToolCallProps {
  result: ToolResult;
}

/**
 * Helper function to get the appropriate UI component for a tool call
 */
export function getToolCallComponent({ toolName, toolCallId }: ToolCallProps) {
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
  }

  // Default for other tools
  return (
    <div key={toolCallId}>
      <div className="text-sm text-gray-500">Using {toolName}...</div>
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
    return <div key={toolCallId}><MermaidDiagram result={result as GenerateMermaidDiagramResult} /></div>
  }
}

/**
 * Main ToolComponents component - Export a single object with all tool-related UI components
 */
export const ToolComponents = {
  getToolCallComponent,
  getToolResultComponent,
};

export default ToolComponents;
