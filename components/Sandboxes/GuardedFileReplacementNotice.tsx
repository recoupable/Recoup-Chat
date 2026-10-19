"use client";

import { Button } from "@/components/ui/button";
import type { PendingFileReplacement } from "@/lib/sandboxes/guardedFileTypes";

export default function GuardedFileReplacementNotice({
  pending,
  error,
  onReopen,
  onDiscard,
  disabled,
}: {
  pending: PendingFileReplacement | null;
  error: string | null;
  onReopen: (path: string) => void;
  onDiscard: () => void;
  disabled: boolean;
}) {
  if (!error) return null;
  const keepCopy = () => {
    if (!pending) return;
    const url = URL.createObjectURL(pending.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = pending.file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="rounded-lg bg-muted p-4 text-sm space-y-3">
      <p role="alert">{error}</p>
      {pending && (
        <>
          <p className="text-muted-foreground">
            Your replacement, {pending.file.name}, is kept here. Review the
            latest file and reconcile before choosing a replacement again.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={keepCopy}
            >
              Keep a copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onReopen(pending.opened.path)}
            >
              View latest file
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={onDiscard}
            >
              Discard replacement
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
