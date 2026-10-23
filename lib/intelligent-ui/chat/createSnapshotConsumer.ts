import type { UIMessage, UIMessageChunk } from "ai";
import { surfaceSchema, type Surface } from "../schema";
import { SURFACE_STREAM_LIMITS } from "../streamLimits";
import { getAnswerText } from "../presentation/getAnswerText";
import { isChatIntelligentUIEnabled } from "./isChatIntelligentUIEnabled";
import {
  getSnapshotScopeKey,
  type SnapshotHostScope,
} from "./getSnapshotScopeKey";

const SNAPSHOT_TYPE = "data-intelligent-ui-snapshot";
const MAX_RETAINED_MESSAGES = 16;

interface AcceptedSnapshot {
  surface: Surface;
  bytes: number;
}

export interface ChatSnapshotBinding {
  consumer: ReturnType<typeof createSnapshotConsumer>;
  scopeKey: string;
}

/**
 * Owned by the normal chat transport. Only full, validated snapshots reach the
 * SDK's stable-ID replacement. The workflow's upstream cursor still counts every
 * original chunk, including rejected UI candidates.
 */
export function createSnapshotConsumer(
  getScope: () => SnapshotHostScope | undefined,
) {
  let boundScope: string | undefined;
  let scopeIdentity: string | undefined;
  let scopeEpoch = 0;
  let generation = 0;
  let disposed = false;
  let retainedBytes = 0;
  const accepted = new Map<string, AcceptedSnapshot>();
  let historicalText = new WeakMap<
    object,
    { messageId: string; surfaceId: string; revision: number; text: string }
  >();

  const syncScope = () => {
    if (disposed) return { scope: undefined, key: undefined };
    const proposed = isChatIntelligentUIEnabled() ? getScope() : undefined;
    const scope =
      proposed &&
      proposed.actorId &&
      proposed.accountId &&
      proposed.workspaceId &&
      proposed.sessionId &&
      proposed.chatId &&
      proposed.subject.kind &&
      proposed.subject.id
        ? proposed
        : undefined;
    const identity = scope ? getSnapshotScopeKey(scope) : undefined;
    if (identity !== scopeIdentity) {
      scopeIdentity = identity;
      boundScope = identity ? `${identity}:${++scopeEpoch}` : undefined;
      generation++;
      accepted.clear();
      retainedBytes = 0;
      historicalText = new WeakMap();
    }
    return { scope, key: boundScope };
  };

  const parseCandidate = (part: unknown, scope: SnapshotHostScope) => {
    if (
      !part ||
      typeof part !== "object" ||
      !("type" in part) ||
      part.type !== SNAPSHOT_TYPE
    )
      return undefined;
    let json: string;
    try {
      json = JSON.stringify(part);
    } catch {
      return undefined;
    }
    // The SDK has already decoded the SSE JSON. Bound our own validation and
    // retention; this is not a claim to bound the SDK's upstream raw parser.
    if (json.length > SURFACE_STREAM_LIMITS.lineBytes)
      return { bytes: SURFACE_STREAM_LIMITS.lineBytes + 1 };
    const bytes = new TextEncoder().encode(json).byteLength;
    if (
      bytes > SURFACE_STREAM_LIMITS.lineBytes ||
      !("data" in part) ||
      !("id" in part)
    )
      return { bytes };
    const parsed = surfaceSchema.safeParse(part.data);
    if (!parsed.success) return { bytes };
    const surface = parsed.data;
    if (
      part.id !== surface.id ||
      ("transient" in part && part.transient !== false) ||
      surface.context.workspaceId !== scope.workspaceId ||
      surface.context.subject.kind !== scope.subject.kind ||
      surface.context.subject.id !== scope.subject.id
    )
      return { bytes };
    return { bytes, candidate: { surface, bytes } };
  };

  const accept = (messageId: string, candidate: AcceptedSnapshot) => {
    const previous = accepted.get(messageId);
    // One coherent Surface owns this assistant response. Switching its stable
    // identity is not an update and must not mount a second unsolicited UI.
    if (
      previous &&
      (previous.surface.id !== candidate.surface.id ||
        previous.surface.revision >= candidate.surface.revision)
    )
      return false;
    retainedBytes += candidate.bytes - (previous?.bytes ?? 0);
    accepted.delete(messageId);
    accepted.set(messageId, candidate);
    while (
      accepted.size > MAX_RETAINED_MESSAGES ||
      retainedBytes > SURFACE_STREAM_LIMITS.totalBytes
    ) {
      const oldest = accepted.keys().next().value;
      if (oldest === undefined) break;
      retainedBytes -= accepted.get(oldest)!.bytes;
      accepted.delete(oldest);
    }
    return true;
  };

  return {
    syncScope,
    /** Capture this key with a history request; a late previous-scope load cannot seed UI. */
    hydrate(messages: UIMessage[], scopeKey: string) {
      const { scope, key } = syncScope();
      if (!scope || key !== scopeKey) return messages;
      return messages.map((message) => {
        if (message.role !== "assistant") return message;
        let messageSurfaceId: string | undefined;
        let latest: AcceptedSnapshot | undefined;
        let snapshotIndex: number | undefined;
        const parts: UIMessage["parts"] = [];
        for (const part of message.parts) {
          if (part.type !== SNAPSHOT_TYPE) {
            parts.push(part);
            continue;
          }
          const candidate = parseCandidate(part, scope)?.candidate;
          if (
            !candidate ||
            (messageSurfaceId && messageSurfaceId !== candidate.surface.id)
          )
            continue;
          messageSurfaceId = candidate.surface.id;
          snapshotIndex ??= parts.length;
          if (!latest || candidate.surface.revision > latest.surface.revision)
            latest = candidate;
        }
        if (!latest) return { ...message, parts };
        accept(message.id, latest);
        const retained = accepted.get(message.id) ?? latest;
        historicalText.set(retained.surface, {
          messageId: message.id,
          surfaceId: retained.surface.id,
          revision: retained.surface.revision,
          text: getAnswerText(retained.surface),
        });
        parts.splice(snapshotIndex ?? parts.length, 0, {
          type: SNAPSHOT_TYPE,
          id: retained.surface.id,
          data: retained.surface,
        });
        return { ...message, parts };
      });
    },
    /** The SDK clones streamed messages. Bind only clones of already accepted responses. */
    observeMessages(messages: UIMessage[], scopeKey: string) {
      if (syncScope().key !== scopeKey) return;
      for (const message of messages.slice(-MAX_RETAINED_MESSAGES)) {
        const retained = accepted.get(message.id)?.surface;
        if (!retained) continue;
        for (const part of message.parts) {
          if (
            part.type === SNAPSHOT_TYPE &&
            "id" in part &&
            part.id === retained.id &&
            "data" in part &&
            part.data &&
            typeof part.data === "object"
          )
            historicalText.set(part.data, {
              messageId: message.id,
              surfaceId: retained.id,
              revision: retained.revision,
              text: getAnswerText(retained),
            });
        }
      }
    },
    getFallback(messageId: string, part: unknown, scopeKey: string) {
      if (
        syncScope().key !== scopeKey ||
        !part ||
        typeof part !== "object" ||
        !("data" in part) ||
        !part.data ||
        typeof part.data !== "object"
      )
        return undefined;
      const fallback = historicalText.get(part.data);
      return fallback?.messageId === messageId &&
        "id" in part &&
        fallback.surfaceId === part.id
        ? fallback.text
        : undefined;
    },
    getSnapshot(messageId: string, surfaceId: string, scopeKey: string) {
      if (syncScope().key !== scopeKey) return undefined;
      const surface = accepted.get(messageId)?.surface;
      return surface?.id === surfaceId ? surface : undefined;
    },
    /** Cancellation retains accepted content, but invalidates every in-flight token. */
    cancel() {
      generation++;
    },
    dispose() {
      disposed = true;
      generation++;
    },
    activate() {
      disposed = false;
      syncScope();
    },
    beginStream({
      signal,
      messageId,
      getMessages,
    }: {
      signal?: AbortSignal;
      messageId?: string;
      getMessages?: () => UIMessage[];
    } = {}) {
      const { key: streamScope } = syncScope();
      const streamGeneration = ++generation;
      let currentMessageId = messageId;
      const readFloor = () => {
        const message = getMessages?.().find(
          (item) => item.id === currentMessageId,
        );
        if (!message) return undefined;
        for (const part of message.parts) {
          if (
            part.type !== SNAPSHOT_TYPE ||
            !("data" in part) ||
            !part.data ||
            typeof part.data !== "object"
          )
            continue;
          const floor = historicalText.get(part.data);
          if (floor?.messageId === currentMessageId) return floor;
        }
        return undefined;
      };
      let floor = readFloor();
      let events = 0;
      let bytes = 0;
      return (chunk: UIMessageChunk): UIMessageChunk | undefined => {
        if (chunk.type === "start") {
          currentMessageId = chunk.messageId ?? currentMessageId;
          floor = readFloor();
        }
        if (chunk.type !== SNAPSHOT_TYPE) return chunk;
        const { scope, key } = syncScope();
        if (
          !scope ||
          !streamScope ||
          key !== streamScope ||
          generation !== streamGeneration ||
          signal?.aborted ||
          !currentMessageId
        )
          return undefined;
        if (
          ++events > SURFACE_STREAM_LIMITS.events ||
          bytes >= SURFACE_STREAM_LIMITS.totalBytes
        )
          return undefined;
        const parsed = parseCandidate(chunk, scope);
        // Count invalid/oversized candidates too, so repeated malformed input
        // cannot keep invoking schema validation forever within one stream.
        bytes += parsed?.bytes ?? SURFACE_STREAM_LIMITS.lineBytes;
        const candidate = parsed?.candidate;
        if (
          bytes > SURFACE_STREAM_LIMITS.totalBytes ||
          !candidate ||
          (floor &&
            (floor.surfaceId !== candidate.surface.id ||
              floor.revision >= candidate.surface.revision)) ||
          !accept(currentMessageId, candidate)
        )
          return undefined;
        return {
          type: SNAPSHOT_TYPE,
          id: candidate.surface.id,
          data: candidate.surface,
        };
      };
    },
  };
}
