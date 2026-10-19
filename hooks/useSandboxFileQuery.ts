import { useCallback, useLayoutEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { getFileContents } from "@/lib/sandboxes/getFileContents";
import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import type { OpenedFileRevision } from "@/lib/sandboxes/guardedFileTypes";

export function useSandboxFileQuery(
  path: string | undefined,
  enabled: boolean,
  includeRevision: boolean,
) {
  const { getAccessToken, user } = usePrivy();
  const scopeKey = user?.id ?? "";
  const apiBaseUrl = getClientApiBaseUrl();
  const client = useQueryClient();
  const current = useRef({ scopeKey, apiBaseUrl });
  useLayoutEffect(() => {
    current.current = { scopeKey, apiBaseUrl };
  }, [scopeKey, apiBaseUrl]);
  const prefix = ["sandbox-file-content", apiBaseUrl, scopeKey];
  const query = useQuery({
    queryKey: [...prefix, path, includeRevision],
    enabled: Boolean(enabled && path),
    queryFn: async () => {
      if (!path) throw new Error("Select a file to open.");
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Please sign in to view file contents");
      const sameScope = () =>
        current.current.scopeKey === scopeKey &&
        current.current.apiBaseUrl === apiBaseUrl &&
        getClientApiBaseUrl() === apiBaseUrl;
      if (!sameScope())
        throw new Error("The account or connection changed. Reopen this file.");
      const result = await getFileContents(accessToken, path, {
        includeRevision,
      });
      if (!sameScope())
        throw new Error("The account or connection changed. Reopen this file.");
      const openedRevision: OpenedFileRevision | undefined =
        includeRevision && result.sha && scopeKey
          ? { path, sha: result.sha, apiBaseUrl, scopeKey }
          : undefined;
      return { ...result, openedRevision };
    },
    ...(includeRevision && {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }),
  });
  const reopen = useCallback(
    (target: string) => {
      void client.invalidateQueries({
        queryKey: ["sandbox-file-content", apiBaseUrl, scopeKey, target],
      });
    },
    [client, apiBaseUrl, scopeKey],
  );
  return { query, scopeKey, reopen };
}
