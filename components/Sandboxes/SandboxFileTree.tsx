"use client";

import SandboxFileBrowser from "./SandboxFileBrowser";
import SandboxDropZone from "./SandboxDropZone";
import NoSandboxFiles from "./NoSandboxFiles";
import useSandboxes from "@/hooks/useSandboxes";
import useSandboxFileContent from "@/hooks/useSandboxFileContent";
import { useSandboxFileDrop } from "@/hooks/useSandboxFileDrop";
import { Loader } from "lucide-react";
import { useState } from "react";
import { getGuardedGitApiBaseUrl } from "@/lib/sandboxes/getGuardedGitApiBaseUrl";
import { useGuardedFileReplacement } from "@/hooks/useGuardedFileReplacement";
import GuardedFileReplacementNotice from "./GuardedFileReplacementNotice";

export default function SandboxFileTree() {
  const { filetree, isLoading, error, refetch } = useSandboxes();
  const [protectReplacement, setProtectReplacement] = useState(false);
  const available = Boolean(getGuardedGitApiBaseUrl());
  const fileContent = useSandboxFileContent({
    includeRevision: protectReplacement,
  });
  const { handleFilesDropped, uploading } = useSandboxFileDrop({
    selectedPath: fileContent.selectedPath,
    filetree,
    refetch,
  });
  const guarded = useGuardedFileReplacement({
    enabled: protectReplacement,
    opened: fileContent.openedRevision,
    selectedPath: fileContent.selectedPath,
    scopeKey: fileContent.scopeKey,
    onSaved: () => {
      refetch();
      if (fileContent.selectedPath)
        fileContent.reopen(fileContent.selectedPath);
    },
  });
  const busy = uploading || guarded.saving;
  const onDrop = (files: File[]) => {
    if (protectReplacement) void guarded.replace(files);
    else handleFilesDropped(files);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        <p>Failed to load files</p>
        <button
          onClick={() => refetch()}
          className="text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (filetree.length === 0) {
    return <NoSandboxFiles onDrop={onDrop} disabled={busy} />;
  }

  return (
    <div className="space-y-4">
      {(available || protectReplacement) && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={protectReplacement}
            disabled={busy || Boolean(guarded.pending)}
            onChange={(event) => setProtectReplacement(event.target.checked)}
          />
          Protect replacement of the opened file
        </label>
      )}
      <GuardedFileReplacementNotice
        pending={guarded.pending}
        error={guarded.error}
        disabled={busy}
        onDiscard={guarded.discard}
        onReopen={fileContent.reopen}
      />
      <SandboxDropZone onDrop={onDrop} uploading={busy}>
        <SandboxFileBrowser filetree={filetree} fileContent={fileContent} />
      </SandboxDropZone>
    </div>
  );
}
