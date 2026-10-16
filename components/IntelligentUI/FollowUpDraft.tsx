"use client";

import { useRef, useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FollowUpDraft({
  value,
  onChange,
  onClose,
  saved,
  restored,
}: {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  saved: boolean;
  restored: boolean;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const copyAttempt = useRef(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  return (
    <section
      aria-label="Follow-up draft"
      className="mt-5 rounded-2xl bg-muted/40 p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor="follow-up-draft" className="text-sm font-medium">
          Follow-up draft
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 size-11"
          aria-label="Close draft"
          onClick={onClose}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <textarea
        ref={textarea}
        id="follow-up-draft"
        value={value}
        maxLength={4000}
        rows={5}
        disabled={!restored}
        onChange={(event) => {
          copyAttempt.current += 1;
          onChange(event.target.value);
          setCopied(false);
          setCopyError(false);
        }}
        className="w-full resize-y rounded-xl bg-card p-3 text-base leading-7 shadow-[0_0_0_1px_var(--input)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-5 text-muted-foreground">
          {saved ? "Saved on this device." : "Kept in this tab."} Nothing sent.
        </p>
        <Button
          variant="ghost"
          className="min-h-11"
          disabled={!value.trim()}
          onClick={async () => {
            const attempt = ++copyAttempt.current;
            try {
              await navigator.clipboard.writeText(value);
              if (
                attempt !== copyAttempt.current ||
                !textarea.current ||
                textarea.current.value !== value
              )
                return;
              setCopied(true);
              setCopyError(false);
            } catch {
              if (
                attempt !== copyAttempt.current ||
                !textarea.current ||
                textarea.current.value !== value
              )
                return;
              setCopyError(true);
              textarea.current?.focus();
              textarea.current?.select();
            }
          }}
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
          {copied ? "Copied" : "Copy draft"}
        </Button>
      </div>
      <p
        role="status"
        className={copyError ? "mt-2 text-xs text-muted-foreground" : "sr-only"}
      >
        {copyError
          ? "Copy is unavailable. The draft is selected so you can copy it manually."
          : copied
            ? "Draft copied."
            : ""}
      </p>
    </section>
  );
}
