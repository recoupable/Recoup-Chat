import { useLayoutEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { isOpenedRevisionCurrent } from "@/lib/sandboxes/isOpenedRevisionCurrent";

import type {
  GuardedReplacementOptions,
  PendingFileReplacement,
} from "@/lib/sandboxes/guardedFileTypes";

export function useGuardedFileReplacement(options: GuardedReplacementOptions) {
  const { getAccessToken } = usePrivy();
  const latest = useRef(options);
  const mounted = useRef(false);
  useLayoutEffect(() => {
    latest.current = options;
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, [options]);
  const inFlight = useRef(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<PendingFileReplacement | null>(null);
  const [failure, setFailure] = useState<{
    scope: string;
    message: string;
  } | null>(null);

  const replace = async (files: File[]) => {
    if (inFlight.current) return;
    const { opened, scopeKey, selectedPath, enabled } = latest.current;
    if (
      !enabled ||
      !opened ||
      opened.path !== selectedPath ||
      files.length !== 1 ||
      files[0].name !== opened.path.split("/").at(-1) ||
      opened.scopeKey !== scopeKey
    ) {
      setFailure({
        scope: scopeKey,
        message:
          "Open the file first, then drop one replacement with the same name.",
      });
      return;
    }
    const original = { file: files[0], opened: { ...opened } };
    setPending(original);
    setFailure(null);
    inFlight.current = true;
    setSaving(true);
    const isCurrent = () =>
      mounted.current &&
      isOpenedRevisionCurrent(latest.current, original.opened);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken || !isCurrent())
        throw new Error(
          "The account, file or connection changed. Reopen before replacing.",
        );
      await uploadSandboxFiles({
        accessToken,
        files,
        path: opened.path.split("/").slice(0, -1).join("/"),
        guard: { opened: original.opened, isCurrent },
      });
      if (!isCurrent())
        throw new Error(
          "The view changed while saving. Reopen to confirm the saved revision.",
        );
      setPending(null);
      options.onSaved();
    } catch (error) {
      setFailure({
        scope: scopeKey,
        message:
          error instanceof Error
            ? error.message
            : "Replacement failed. Your file has been kept.",
      });
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };
  return {
    replace,
    saving,
    pending: pending?.opened.scopeKey === options.scopeKey ? pending : null,
    error: failure?.scope === options.scopeKey ? failure.message : null,
    discard: () => {
      if (!inFlight.current) {
        setPending(null);
        setFailure(null);
      }
    },
  };
}
