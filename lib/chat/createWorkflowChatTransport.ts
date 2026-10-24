import type { UIMessage, UIMessageChunk } from "ai";
import {
  WorkflowChatTransport,
  type WorkflowChatTransportOptions,
} from "@workflow/ai";
import type { createSnapshotConsumer } from "@/lib/intelligent-ui/chat/createSnapshotConsumer";
import { settleSnapshotReconnect } from "@/lib/intelligent-ui/chat/settleSnapshotReconnect";
import type { CatalogSurfaceRequest } from "@/lib/intelligent-ui/chat/getChatCatalogHost";
import { isChatIntelligentUIEnabled } from "@/lib/intelligent-ui/chat/isChatIntelligentUIEnabled";

interface CreateWorkflowChatTransportOptions {
  /** recoup-api origin, e.g. `https://api.recoupable.dev`. */
  baseUrl: string;
  /** Reads the ids current as of the request, not as of transport construction. */
  getIds: () => { sessionId: string | undefined; chatId: string };
  /** Privy access token for both the POST and every reconnect. */
  getAccessToken: () => Promise<string | null>;
  /**
   * Resolves once the sandbox can take a request; rejects if provisioning
   * failed. A Send pressed while provisioning is a real message from the
   * first frame, and the request itself waits here (app#2052).
   */
  waitForWorkspace?: () => Promise<void>;
  /** Development-only experimental consumer; absent on the default production path. */
  snapshotConsumer?: ReturnType<typeof createSnapshotConsumer>;
  getMessages?: () => UIMessage[];
  /** Optional committed host references, never an authorization grant. */
  getDevCatalogSurface?: () => CatalogSurfaceRequest | undefined;
}

/**
 * A chat transport that reconnects through a dropped stream on its own.
 *
 * `WorkflowChatTransport` is a single generator: it reads the POST stream,
 * and if that stream ends without a `finish` chunk it continues into
 * `while (!gotFinish)`, reissuing `GET {api}/…/stream?startIndex=N` with the
 * chunk index it has been counting all along. One continuous stream reaches
 * `useChat`, which therefore settles exactly when `finish` arrives.
 *
 * That structure is why we adopted it. Our hand-rolled equivalent tracked the
 * same state across React refs — an in-flight flag, an edge-detected trigger,
 * a probe schedule, a terminal-state branch — and each fix exposed another
 * unverified state: a trigger that fired once, a flag held across a 120s
 * connection, a final stream end that fired nothing. There is no trigger to
 * miss here, and no ref to hold (chat#1923).
 *
 * @param options - Api origin, live ids, and the token getter.
 * @returns A transport ready to hand to `useChat`.
 */
export function createWorkflowChatTransport<UI_MESSAGE extends UIMessage>({
  baseUrl,
  getIds,
  getAccessToken,
  waitForWorkspace,
  snapshotConsumer,
  getMessages,
  getDevCatalogSurface,
}: CreateWorkflowChatTransportOptions): WorkflowChatTransport<UI_MESSAGE> {
  const authHeaders = async (): Promise<Record<string, string>> => {
    const token = await getAccessToken().catch(() => null);
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };
  const filterStream = (
    stream: ReadableStream<UIMessageChunk> | null,
    filter?: (chunk: UIMessageChunk) => UIMessageChunk | undefined,
  ) =>
    stream && filter
      ? stream.pipeThrough(
          new TransformStream<UIMessageChunk, UIMessageChunk>({
            transform(chunk, controller) {
              const accepted = filter(chunk);
              if (accepted) controller.enqueue(accepted);
            },
          }),
        )
      : stream;

  const transportOptions = (
    bind?: (ids: { chatId: string; sessionId?: string }) => void,
    signal?: AbortSignal,
  ): WorkflowChatTransportOptions<UI_MESSAGE> => ({
    api: `${baseUrl}/api/chat`,
    prepareSendMessagesRequest: async ({ messages, body }) => {
      // The intent token already exists while provisioning; Stop invalidates
      // it. Bind only once IDs settle, before async auth can change host scope.
      await waitForWorkspace?.();
      signal?.throwIfAborted();
      const ids = getIds();
      bind?.(ids);
      const devCatalogSurface = isChatIntelligentUIEnabled()
        ? getDevCatalogSurface?.()
        : undefined;
      // This field belongs to the committed host, not per-message callers.
      const requestBody = { ...body };
      delete requestBody.intelligentUI;
      delete requestBody.devCatalogSurface;
      const recoupAccessToken = await getAccessToken().catch(() => null);
      const headers = await authHeaders();
      signal?.throwIfAborted();
      return {
        headers,
        body: {
          ...requestBody,
          messages,
          sessionId: ids.sessionId,
          chatId: ids.chatId,
          ...(recoupAccessToken ? { recoupAccessToken } : {}),
          ...(devCatalogSurface ? { devCatalogSurface } : {}),
        },
      };
    },
    // Cursor counting and authenticated recovery remain owned by the SDK. A
    // send's internal reconnect reuses its already-bound filter and identity.
    prepareReconnectToStreamRequest: async () => {
      const ids = getIds();
      bind?.(ids);
      const headers = await authHeaders();
      signal?.throwIfAborted();
      return {
        api: `${baseUrl}/api/chat/${ids.chatId}/stream`,
        headers,
      };
    },
  });

  class RecoupChatTransport extends WorkflowChatTransport<UI_MESSAGE> {
    override async sendMessages(
      options: Parameters<WorkflowChatTransport<UI_MESSAGE>["sendMessages"]>[0],
    ) {
      const pending = snapshotConsumer?.prepareStream({
        signal: options.abortSignal,
        getMessages,
      });
      const signal = pending
        ? options.abortSignal
          ? AbortSignal.any([options.abortSignal, pending.signal])
          : pending.signal
        : options.abortSignal;
      // Per-operation configuration avoids a shared pending-bind callback
      // accidentally attaching an overlapping request to another scope.
      const stream = pending
        ? await new WorkflowChatTransport(
            transportOptions(pending.bind, signal),
          ).sendMessages({
            ...options,
            abortSignal: signal,
          })
        : await super.sendMessages(options);
      return filterStream(stream, pending?.filter)!;
    }

    /**
     * `204` is our api's "nothing to resume" answer, and it has no body — which
     * the transport surfaces as `Failed to fetch chat: 204` and counts toward
     * `maxConsecutiveErrors`. Treat it as the end of the road instead, matching
     * upstream open-agents' wrapper.
     */
    override async reconnectToStream(
      options: Parameters<
        WorkflowChatTransport<UI_MESSAGE>["reconnectToStream"]
      >[0],
    ) {
      try {
        const pending = snapshotConsumer?.prepareStream({
          signal: options.abortSignal,
          getMessages,
        });
        const signal = pending
          ? options.abortSignal
            ? AbortSignal.any([options.abortSignal, pending.signal])
            : pending.signal
          : options.abortSignal;
        const stream = pending
          ? await new WorkflowChatTransport(
              transportOptions(pending.bind, signal),
            ).reconnectToStream({
              ...options,
              abortSignal: signal,
            })
          : await super.reconnectToStream(options);
        const filtered = filterStream(stream, pending?.filter);
        return filtered && pending
          ? await settleSnapshotReconnect(filtered, pending.signal)
          : filtered;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.startsWith("Failed to fetch chat: 204")
        ) {
          return null;
        }
        throw error;
      }
    }
  }

  return new RecoupChatTransport(transportOptions());
}
