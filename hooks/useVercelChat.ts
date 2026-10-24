import type { CatalogQueryInput } from "@/lib/intelligent-ui/chat/getChatCatalogHost";
import { createChatSubmissionGuard } from "@/lib/chat/createChatSubmissionGuard";
import { useChat } from "@ai-sdk/react";
import { useMessageLoader } from "./useMessageLoader";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useOrganization } from "@/providers/OrganizationProvider";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import getEarliestFailedUserMessageId from "@/lib/messages/getEarliestFailedUserMessageId";
import { generateUUID } from "@/lib/generateUUID";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { UIMessage, FileUIPart } from "ai";
import useAvailableModels from "./useAvailableModels";
import { useLocalStorage } from "usehooks-ts";
import { useAccountOverride } from "@/providers/AccountOverrideProvider";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import useArtistFilesForMentions from "@/hooks/useArtistFilesForMentions";
import { useChatTransport } from "./useChatTransport";
import { usePrivy } from "@privy-io/react-auth";
import { TextAttachment } from "@/types/textAttachment";
import { formatTextAttachments } from "@/lib/chat/formatTextAttachments";
import { useDeleteTrailingMessages } from "./useDeleteTrailingMessages";
import { getFileContents } from "@/lib/sandboxes/getFileContents";
import getMimeFromPath from "@/lib/files/getMimeFromPath";
import { getChatPath } from "@/lib/chat/getChatPath";
import { useInitialMessageAutoSend } from "./useInitialMessageAutoSend";
import { usePersistSelectedModel } from "./usePersistSelectedModel";
import shouldResumeStream from "@/lib/chat/shouldResumeStream";
import type { WorkspaceStatus } from "@/components/VercelChat/WorkspaceStatusIndicator";
import { isChatIntelligentUIEnabled } from "@/lib/intelligent-ui/chat/isChatIntelligentUIEnabled";
import { getChatCatalogHost } from "@/lib/intelligent-ui/chat/getChatCatalogHost";
import type { SnapshotHostScope } from "@/lib/intelligent-ui/chat/getSnapshotScopeKey";

interface UseVercelChatProps {
  id: string;
  catalogId?: string | string[];
  catalogQuery?: CatalogQueryInput;
  /**
   * Session id from `/sessions/[sessionId]/chats/[chatId]` (always
   * present) or the new-chat bootstrap (absent until provisioning
   * resolves; the transport holds the request until it lands).
   */
  sessionId?: string;
  /**
   * Api-minted chat id from bootstrap when `id` is a client placeholder.
   * Used as the transport / message-load / URL target; falls back to `id`.
   */
  workflowChatId?: string;
  /** Workspace lifecycle; the transport holds a send until `ready`. */
  workspaceStatus?: WorkspaceStatus;
  initialMessages?: UIMessage[];
  attachments?: FileUIPart[];
  textAttachments?: TextAttachment[];
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({
  id,
  catalogId,
  catalogQuery,
  sessionId,
  workflowChatId,
  workspaceStatus,
  initialMessages,
  attachments = [],
  textAttachments = [],
}: UseVercelChatProps) {
  const submitOnce = useMemo(() => createChatSubmissionGuard(), []);
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { selectedOrgId: organizationId, isInitialized } = useOrganization();
  const { chatId } = useParams<{ chatId?: string }>();

  const userId = userData?.account_id || userData?.id; // Use account_id if available, fallback to id
  const { accountIdOverride } = useAccountOverride();
  const effectiveAccountId = accountIdOverride ?? userId;
  const catalogHost = getChatCatalogHost({
    catalogId,
    catalogQuery,
    workspaceInitialized: isInitialized,
    organizationId,
    accountId: effectiveAccountId,
  });
  // An explicit malformed catalog must not silently become artist context.
  const artistId =
    catalogHost.kind === "absent" ? selectedArtist?.account_id : undefined;
  const { authenticated, getAccessToken, user: authenticatedUser } = usePrivy();
  const messagesRef = useRef<UIMessage[]>([]);
  const historyScopeRef = useRef("");
  const supersededHistoryScopeRef = useRef<string | undefined>(undefined);
  const { addOptimisticConversation } = useConversationsProvider();
  const { data: availableModels = [] } = useAvailableModels();
  const [input, setInput] = useState("");
  // Start existing browsers on Auto too; the legacy key stores a fixed model
  // from the removed composer picker and would otherwise bypass routing.
  const [model, setModel] = useLocalStorage("RECOUP_CHAT_MODEL_V2", "auto");
  const { refetchCredits } = usePaymentProvider();
  // The api-minted chat id once bootstrap resolves; before then `id` is a
  // client placeholder. Drives the transport, message load, and URL so
  // sends/persistence target the row recoup-api actually created.
  const transportChatId = workflowChatId ?? id;
  const hostWorkspace =
    catalogHost.kind === "catalog"
      ? catalogHost.workspace
      : catalogHost.kind === "absent" && organizationId
        ? { kind: "organization" as const, id: organizationId }
        : undefined;
  const hostSubject =
    catalogHost.kind === "catalog"
      ? catalogHost.subject
      : artistId
        ? { kind: "artist", id: artistId }
        : undefined;
  const snapshotScope: SnapshotHostScope | undefined =
    authenticated &&
    authenticatedUser?.id &&
    userId &&
    effectiveAccountId &&
    (hostWorkspace || catalogHost.kind === "catalog") &&
    hostSubject
      ? {
          actorId: authenticatedUser.id,
          accountId: effectiveAccountId,
          workspaceId: hostWorkspace?.id ?? "",
          ...(catalogHost.kind === "catalog" && {
            workspaceKind: hostWorkspace?.kind ?? "uninitialized",
            queryKey: catalogHost.queryKey,
          }),
          sessionId:
            catalogHost.kind === "catalog" && !catalogHost.query
              ? ""
              : (sessionId ?? ""),
          chatId: transportChatId,
          subject: hostSubject,
        }
      : undefined;
  const { transport, getHeaders, intelligentUI, snapshotConsumer } =
    useChatTransport({
      chatId: transportChatId,
      sessionId,
      workspaceStatus,
      snapshotScope,
      devCatalogSurface:
        snapshotScope?.sessionId &&
        catalogHost.kind === "catalog" &&
        catalogHost.workspace &&
        catalogHost.query
          ? {
              workspaceId: catalogHost.workspace.id,
              query: catalogHost.query,
            }
          : undefined,
      getMessages: () => messagesRef.current,
    });
  const coordinateHistory = isChatIntelligentUIEnabled();
  const captureSendIntent = useCallback(
    () => snapshotConsumer.captureSendIntent(),
    [snapshotConsumer],
  );
  const historyLoadScope = coordinateHistory
    ? JSON.stringify([
        authenticatedUser?.id,
        userId,
        accountIdOverride,
        organizationId,
        artistId,
        sessionId,
        transportChatId,
        intelligentUI?.scopeKey,
        ...(catalogHost.kind !== "absent"
          ? [catalogId, isInitialized, snapshotScope?.queryKey]
          : []),
      ])
    : "";
  useLayoutEffect(() => {
    historyScopeRef.current = historyLoadScope;
  }, [historyLoadScope]);
  const [historyReadiness, setHistoryReadiness] = useState<{
    scopeKey: string;
    state: "ready" | "cancelled";
  }>();
  const cancelPendingResume = useCallback(
    (supersedeHistory = false) => {
      if (!coordinateHistory) return;
      // Stop may still display saved history. A deliberate new send owns the
      // SDK state immediately, so its pending history must never replace it.
      if (supersedeHistory)
        supersededHistoryScopeRef.current = historyLoadScope;
      setHistoryReadiness({ scopeKey: historyLoadScope, state: "cancelled" });
    },
    [coordinateHistory, historyLoadScope],
  );

  // Persists the picker's selected model to chats.model_id; awaited before
  // send so the workflow bills the selected model (it reads chats.model_id
  // at request time), not the default.
  const persistSelectedModel = usePersistSelectedModel({
    sessionId,
    chatId: transportChatId,
    model,
    getAccessToken,
  });

  // Load artist files for mentions (from Supabase)
  const { files: allArtistFiles = [] } = useArtistFilesForMentions();

  // Extract mentioned file ids from input markup '@[display](id)'
  const selectedFileIds = useMemo(() => {
    const ids = new Set<string>();
    const regex = /@\[[^\]]+\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(input))) {
      if (match[1]) ids.add(match[1]);
    }
    return Array.from(ids);
  }, [input]);

  // Resolve selected sandbox files for mention context and file attachments.
  const [mentionAttachments, setMentionAttachments] = useState<FileUIPart[]>(
    [],
  );
  const [mentionTextContext, setMentionTextContext] = useState("");
  const [isLoadingSignedUrls, setIsLoadingSignedUrls] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!selectedFileIds.length) {
        if (!cancelled)
          setMentionAttachments((prev) => (prev.length ? [] : prev));
        if (!cancelled) setMentionTextContext((prev) => (prev ? "" : prev));
        if (!cancelled) setIsLoadingSignedUrls((prev) => (prev ? false : prev));
        return;
      }

      const idSet = new Set(selectedFileIds);
      const selected = allArtistFiles.filter((f) => idSet.has(f.id));
      if (selected.length === 0) {
        if (!cancelled)
          setMentionAttachments((prev) => (prev.length ? [] : prev));
        if (!cancelled) setMentionTextContext((prev) => (prev ? "" : prev));
        if (!cancelled) setIsLoadingSignedUrls((prev) => (prev ? false : prev));
        return;
      }

      try {
        if (!cancelled) setIsLoadingSignedUrls(true);

        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Please sign in to attach mentioned files");
        }

        const results = await Promise.all(
          selected.map(async (f) => {
            const fileResult = await getFileContents(accessToken, f.path);
            const mimeType = f.mime_type || getMimeFromPath(f.path);
            return {
              path: f.path,
              mimeType,
              content: fileResult.content,
              dataUrl: fileResult.imageUrl,
            };
          }),
        );

        const nextAttachments: FileUIPart[] = [];
        const textBlocks: string[] = [];
        for (const result of results) {
          if (
            result.dataUrl &&
            (result.mimeType === "application/pdf" ||
              result.mimeType.startsWith("image/"))
          ) {
            nextAttachments.push({
              type: "file",
              url: result.dataUrl,
              mediaType: result.mimeType,
            });
            continue;
          }

          if (result.content) {
            textBlocks.push(
              `[Mentioned File: ${result.path}]\n${result.content}`,
            );
          }
        }

        if (!cancelled) setMentionAttachments(nextAttachments);
        if (!cancelled)
          setMentionTextContext(
            textBlocks.length ? textBlocks.join("\n\n") : "",
          );
        if (!cancelled) setIsLoadingSignedUrls(false);
      } catch (e) {
        console.error(e);
        if (!cancelled)
          setMentionAttachments((prev) => (prev.length ? [] : prev));
        if (!cancelled) setMentionTextContext((prev) => (prev ? "" : prev));
        if (!cancelled) setIsLoadingSignedUrls((prev) => (prev ? false : prev));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedFileIds, allArtistFiles, getAccessToken]);

  const chatRequestBody = useMemo(
    () => ({
      roomId: id,
      artistId,
      // Only include organizationId if it's not null (schema expects string | undefined)
      ...(organizationId && { organizationId }),
      ...(accountIdOverride && { accountId: accountIdOverride }),
      model,
    }),
    [id, artistId, organizationId, accountIdOverride, model],
  );

  const {
    messages,
    status,
    stop: stopChat,
    sendMessage,
    setMessages,
    regenerate,
    resumeStream,
  } = useChat({
    id,
    transport,
    // Re-attach to an in-progress response, so returning to a chat mid-turn
    // keeps rendering instead of showing a frozen half-message. Gated to an
    // authenticated visit to an existing chat — resuming unconditionally
    // 401s/404s on every cold load and surfaces as an error toast
    // (chat#1949 F4a).
    resume:
      shouldResumeStream({ authenticated, routeChatId: chatId }) &&
      (!coordinateHistory ||
        (historyReadiness?.scopeKey === historyLoadScope &&
          historyReadiness.state === "ready")),
    experimental_throttle: 100,
    generateId: generateUUID,
    onError: (e) => {
      console.error("An error occurred, please try again!", e);
      toast.error("An error occurred, please try again!");
    },
    onFinish: async () => {
      // Update credits after AI response completes
      await refetchCredits();
    },
  });
  useLayoutEffect(() => {
    messagesRef.current = messages;
    if (intelligentUI)
      snapshotConsumer.observeMessages(messages, intelligentUI.scopeKey);
  }, [messages, intelligentUI, snapshotConsumer]);
  const stop = useCallback(async () => {
    cancelPendingResume();
    snapshotConsumer.cancel();
    await stopChat();
  }, [cancelPendingResume, snapshotConsumer, stopChat]);
  const historyScopeKey = intelligentUI?.scopeKey;
  const setHistoryMessages = useCallback(
    (loaded: UIMessage[]) => {
      if (
        coordinateHistory &&
        (historyScopeRef.current !== historyLoadScope ||
          supersededHistoryScopeRef.current === historyLoadScope)
      )
        return;
      const canonical = historyScopeKey
        ? snapshotConsumer.hydrate(loaded, historyScopeKey)
        : loaded;
      // Publish the canonical SDK state to the transport in this same turn;
      // the render/layout getter must not expose a preceding temporary message.
      if (coordinateHistory) messagesRef.current = canonical;
      setMessages(canonical);
    },
    [
      coordinateHistory,
      historyLoadScope,
      historyScopeKey,
      snapshotConsumer,
      setMessages,
    ],
  );
  const onHistoryLoaded = useCallback(() => {
    if (
      historyScopeRef.current !== historyLoadScope ||
      supersededHistoryScopeRef.current === historyLoadScope
    )
      return;
    setHistoryReadiness((previous) =>
      previous?.scopeKey === historyLoadScope && previous.state === "cancelled"
        ? previous
        : { scopeKey: historyLoadScope, state: "ready" },
    );
  }, [historyLoadScope]);

  // Reconnection through a dropped stream is the transport's job now — see
  // `createWorkflowChatTransport`. A long turn's stream ends at the ~120s
  // connection cap (chat#1928); the transport notices the missing `finish`
  // chunk and resumes from its own chunk count without a hook involved.

  const earliestFailedUserMessageId = useMemo(
    () => getEarliestFailedUserMessageId(messages),
    [messages],
  );

  const { deleteTrailingMessages } = useDeleteTrailingMessages({
    onSuccess: () => {
      setMessages((messages) => {
        const index = messages.findIndex(
          (m) => m.id === earliestFailedUserMessageId,
        );
        if (index !== -1) {
          return [...messages.slice(0, index)];
        }

        return messages;
      });
    },
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    isCurrent: () => boolean,
  ) => {
    e.preventDefault();
    cancelPendingResume(true);

    const headers = await getHeaders();
    if (!isCurrent()) return false;

    // Combine all attachments
    const combined: FileUIPart[] = [];
    if (attachments && attachments.length > 0) combined.push(...attachments);
    if (mentionAttachments.length > 0) combined.push(...mentionAttachments);

    // Separate audio files (can't be sent to AI as file parts)
    const audioAttachments = combined.filter((f) =>
      f.mediaType?.startsWith("audio/"),
    );
    const nonAudioAttachments = combined.filter(
      (f) => !f.mediaType?.startsWith("audio/"),
    );

    // Build message text with text file content and audio URLs prepended
    let messageText = input;

    // Prepend text file content (markdown, CSV)
    const textContext = formatTextAttachments(textAttachments);
    if (textContext) {
      messageText = textContext + "\n\n" + messageText;
    }

    // Prepend mentioned sandbox file text content.
    if (mentionTextContext) {
      messageText = mentionTextContext + "\n\n" + messageText;
    }

    // Prepend audio URLs
    if (audioAttachments.length > 0) {
      const audioContext = audioAttachments
        .map((a) => `[Audio: ${a.filename || "audio"}]\nURL: ${a.url}`)
        .join("\n\n");
      messageText = audioContext + "\n\n" + messageText;
    }

    const payload = {
      text: messageText,
      files: nonAudioAttachments.length > 0 ? nonAudioAttachments : undefined,
    };

    // Land the selected model in chats.model_id before the send fires.
    await persistSelectedModel(isCurrent);
    if (!isCurrent()) return false;

    const response = sendMessage(payload, { body: chatRequestBody, headers });
    setInput("");
    await response;
    return isCurrent();
  };

  const append = async (message: UIMessage) => {
    const isCurrent = captureSendIntent();
    cancelPendingResume(true);
    const headers = await getHeaders();
    if (!isCurrent()) return;
    // Retry/Edit and programmatic sends bypass handleSubmit, so persist the
    // selected model here too before the workflow reads chats.model_id.
    await persistSelectedModel(isCurrent);
    if (!isCurrent()) return;
    sendMessage(message, { body: chatRequestBody, headers });
  };

  const handleReload = useCallback(async () => {
    const isCurrent = captureSendIntent();
    cancelPendingResume(true);
    const headers = await getHeaders();
    if (!isCurrent()) return;
    // Retry/Edit (MessageParts + message-editor) call reload() → regenerate,
    // bypassing handleSubmit; persist the selected model first so the
    // regenerated turn bills it, not the previous/default model.
    await persistSelectedModel(isCurrent);
    if (!isCurrent()) return;
    await regenerate({ body: chatRequestBody, headers });
  }, [
    captureSendIntent,
    cancelPendingResume,
    getHeaders,
    regenerate,
    chatRequestBody,
    persistSelectedModel,
  ]);

  // Only load persisted history for an existing chat opened from a
  // canonical `/sessions/[sessionId]/chats/[chatId]` URL (route `chatId`
  // present). A new chat from the bootstrap has nothing to load, so we
  // skip the fetch — avoiding a spinner flashing over the input the user
  // is already typing into while provisioning resolves.
  const { isLoading: isMessagesLoading, hasError } = useMessageLoader(
    sessionId,
    chatId && (coordinateHistory || messages.length === 0)
      ? transportChatId
      : undefined,
    userId,
    setHistoryMessages,
    coordinateHistory ? onHistoryLoaded : undefined,
  );

  // Only show loading state when fetching persisted history for an existing chat.
  const isLoading = isMessagesLoading && !!id && messages.length === 0;

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const silentlyUpdateUrl = useCallback(() => {
    if (!sessionId) return;
    window.history.replaceState(
      {},
      "",
      getChatPath(sessionId, transportChatId, catalogId, catalogQuery),
    );
  }, [transportChatId, sessionId, catalogId, catalogQuery]);

  // On a cold start the ids land about a second after Send (app#2052), so
  // the URL update in handleSendMessage is a no-op then; this catches up.
  useEffect(() => {
    if (!chatId && messages.length > 0) silentlyUpdateUrl();
  }, [chatId, messages.length, silentlyUpdateUrl]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isGeneratingResponse) return false;
    const isCurrent = captureSendIntent();
    cancelPendingResume(true);
    let didSend = false;

    await submitOnce(async () => {
      if (!isCurrent()) return;
      if (earliestFailedUserMessageId) {
        await deleteTrailingMessages({
          chatId: id,
          fromMessageId: earliestFailedUserMessageId,
          isCurrent,
        });
      }
      if (!isCurrent()) return;

      const messageContent = input;
      const submission = handleSubmit(event, isCurrent);

      if (!chatId) {
        addOptimisticConversation(
          "New Chat",
          transportChatId,
          sessionId,
          messageContent,
        );
        silentlyUpdateUrl();
      }
      didSend = await submission;
    }, isCurrent);
    return didSend;
  };

  const handleSendQueryMessages = useCallback(
    async (initialMessage: UIMessage) => {
      const isCurrent = captureSendIntent();
      cancelPendingResume(true);
      silentlyUpdateUrl();
      const headers = await getHeaders();
      if (!isCurrent()) return;
      await persistSelectedModel(isCurrent);
      if (!isCurrent()) return;
      await sendMessage(initialMessage, { body: chatRequestBody, headers });
    },
    [
      captureSendIntent,
      silentlyUpdateUrl,
      sendMessage,
      chatRequestBody,
      getHeaders,
      persistSelectedModel,
      cancelPendingResume,
    ],
  );

  // The ?q= deep-link behavior (prefill + provisioning-gated auto-fire)
  // lives entirely in this hook — extend it there, not here (chat#1847).
  useInitialMessageAutoSend({
    initialMessages,
    status,
    messagesLength: messages.length,
    sessionId,
    input,
    setInput,
    send: handleSendQueryMessages,
  });

  return {
    // States
    messages,
    status,
    input,
    isLoading,
    hasError,
    isGeneratingResponse,
    model,
    isLoadingSignedUrls,
    intelligentUI,
    captureSendIntent,

    // Actions
    handleSendMessage,
    setInput,
    setMessages,
    setModel,
    availableModels,
    stop,
    reload: handleReload,
    append,
  };
}
