import { Loader } from "lucide-react";
import NoSandboxFiles from "./NoSandboxFiles";
import SandboxDropZone from "./SandboxDropZone";
import SandboxFileBrowser from "./SandboxFileBrowser";
import type useSandboxes from "@/hooks/useSandboxes";
import type useSandboxFileContent from "@/hooks/useSandboxFileContent";

/** File-list status must never take ownership of retained-replacement recovery. */
export default function SandboxFileWorkspace({
  listing,
  fileContent,
  onDrop,
  busy,
}: {
  listing: ReturnType<typeof useSandboxes>;
  fileContent: ReturnType<typeof useSandboxFileContent>;
  onDrop: (files: File[]) => void;
  busy: boolean;
}) {
  if (listing.isLoading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Loading files...</span>
      </div>
    );
  if (listing.error)
    return (
      <div className="text-destructive">
        <p>Failed to load files</p>
        <button
          onClick={() => listing.refetch()}
          className="text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  if (!listing.filetree.length)
    return <NoSandboxFiles onDrop={onDrop} disabled={busy} />;
  return (
    <SandboxDropZone onDrop={onDrop} uploading={busy}>
      <SandboxFileBrowser
        filetree={listing.filetree}
        fileContent={fileContent}
      />
    </SandboxDropZone>
  );
}
