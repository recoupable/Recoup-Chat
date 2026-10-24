// @vitest-environment jsdom
import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  createUIMessageStreamResponse,
  type UIMessage,
  type UIMessageChunk,
} from "ai";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import SessionChatPage from "../page";
import { Chat } from "@/components/VercelChat/chat";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { MessageParts } from "@/components/VercelChat/MessageParts";
import { chatSnapshotPart } from "@/lib/intelligent-ui/transport/__tests__/chatSnapshotFixture";
import { workflowResponse } from "@/lib/intelligent-ui/transport/__tests__/workflowResponse";

const ids = {
  catalog: "11111111-1111-4111-8111-111111111111",
  otherCatalog: "11111111-1111-4111-8111-111111111112",
  organization: "22222222-2222-4222-8222-222222222222",
  otherOrganization: "22222222-2222-4222-8222-222222222223",
  account: "33333333-3333-4333-8333-333333333333",
  override: "33333333-3333-4333-8333-333333333334",
  artist: "44444444-4444-4444-8444-444444444444",
  session: "55555555-5555-4555-8555-555555555555",
  chat: "66666666-6666-4666-8666-666666666666",
};
const external = vi.hoisted(() => ({
  actor: "synthetic-privy-actor",
  account: "",
  override: null as string | null,
  organization: null as string | null,
  initialized: true,
  artist: null as string | null,
  authenticated: true,
  routeChat: true,
  getAccessToken: vi.fn(async (): Promise<string | null> => "synthetic-token"),
  refetchCredits: vi.fn(async () => {}),
  persistModel: vi.fn(async () => {}),
  updateChatState: vi.fn(),
  files: [],
}));
// Keep the route -> Chat -> provider -> owning hook -> workflow transport,
// canonical history, SDK and accepted answer renderer real. All identities,
// external providers and fetch responses are explicitly synthetic.
vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({
    authenticated: external.authenticated,
    user: { id: external.actor },
    getAccessToken: external.getAccessToken,
  }),
}));
vi.mock("@/providers/UserProvder", () => ({
  useUserProvider: () => ({ userData: { account_id: external.account } }),
}));
vi.mock("@/providers/ArtistProvider", () => ({
  useArtistProvider: () => ({
    selectedArtist: external.artist ? { account_id: external.artist } : null,
    updateChatState: external.updateChatState,
  }),
}));
vi.mock("@/providers/OrganizationProvider", () => ({
  useOrganization: () => ({
    selectedOrgId: external.organization,
    isInitialized: external.initialized,
  }),
}));
vi.mock("@/providers/AccountOverrideProvider", () => ({
  useAccountOverride: () => ({ accountIdOverride: external.override }),
}));
vi.mock("@/providers/PaymentProvider", () => ({
  usePaymentProvider: () => ({ refetchCredits: external.refetchCredits }),
}));
vi.mock("@/providers/ConversationsProvider", () => ({
  useConversationsProvider: () => ({ addOptimisticConversation: vi.fn() }),
}));
vi.mock("@/hooks/useAvailableModels", () => ({
  default: () => ({ data: [] }),
}));
vi.mock("@/hooks/useArtistFilesForMentions", () => ({
  default: () => ({ files: external.files }),
}));
vi.mock("@/hooks/usePersistSelectedModel", () => ({
  usePersistSelectedModel: () => external.persistModel,
}));
vi.mock("@/hooks/useDeleteTrailingMessages", () => ({
  useDeleteTrailingMessages: () => ({ deleteTrailingMessages: vi.fn() }),
}));
vi.mock("@/lib/api/getClientApiBaseUrl", () => ({
  getClientApiBaseUrl: () => "https://recoup.invalid",
}));
vi.mock("next/navigation", () => ({
  useParams: () => (external.routeChat ? { chatId: ids.chat } : {}),
}));
vi.mock("@/hooks/useArtistFromChat", () => ({ useArtistFromChat: () => {} }));
vi.mock("@/hooks/useDropzone", () => ({
  useDropzone: () => ({ getRootProps: () => ({}), isDragActive: false }),
}));
vi.mock("@/hooks/useVisibilityDelay", () => ({
  default: () => ({ isVisible: false }),
}));
vi.mock("@/components/VercelChat/ChatContextGuard", () => ({
  default: () => null,
}));
vi.mock("@/components/VercelChat/ChatInput", () => ({ default: () => null }));
vi.mock("@/components/VercelChat/FileDragOverlay", () => ({
  default: () => null,
}));
vi.mock("@/components/Chat/ChatSkeleton", () => ({
  default: () => <p>Loading history</p>,
}));
vi.mock("@/components/Chat/ChatGreeting", () => ({ default: () => null }));
vi.mock("@/components/Valuation/ValuationRunStatusChip", () => ({
  default: () => null,
}));
vi.mock("@/components/VercelChat/ViewingMessage", () => ({
  default: ({ partText }: { partText: string }) => <p>{partText}</p>,
}));
vi.mock("@/components/VercelChat/EditingMessage", () => ({
  default: () => null,
}));
vi.mock("@/components/VercelChat/ToolComponents", () => ({
  getToolCallComponent: () => null,
  getToolResultComponent: () => null,
}));
vi.mock("@/components/VercelChat/message-file-viewer", () => ({
  default: () => null,
}));
vi.mock("@/components/reasoning/EnhancedReasoning", () => ({
  EnhancedReasoning: () => null,
}));
let current!: ReturnType<typeof useVercelChatContext>;
const prospectiveCatalog = React.createContext<string | undefined>(undefined);
let suspendOnCatalog: string | undefined;
let suspendedRenders = 0;
const never = new Promise<void>(() => {});
vi.mock("@/components/VercelChat/messages", () => ({
  Messages: () => {
    const value = useVercelChatContext();
    const catalog = React.useContext(prospectiveCatalog);
    React.useLayoutEffect(() => {
      current = value;
    });
    if (suspendOnCatalog && catalog === suspendOnCatalog) {
      suspendedRenders++;
      throw never;
    }
    return (
      <>
        {value.messages.map((message) => (
          <MessageParts
            key={message.id}
            message={message}
            mode="view"
            setMode={() => {}}
          />
        ))}
      </>
    );
  },
}));

const historyUrl = `https://recoup.invalid/api/sessions/${ids.session}/chats/${ids.chat}`;
const streamUrl = `https://recoup.invalid/api/chat/${ids.chat}/stream?startIndex=0`;
const postUrl = "https://recoup.invalid/api/chat";
const subject = {
  kind: "catalog",
  id: ids.catalog,
  label: "Synthetic retained catalog",
};
function part(
  revision: number,
  text: string,
  catalog = ids.catalog,
  workspace = ids.organization,
) {
  const value = chatSnapshotPart(revision, text);
  value.data.context = {
    workspaceId: workspace,
    subject: { ...subject, id: catalog },
  };
  return value;
}
function context(
  workspaceId = ids.organization,
  kind = "organization",
  catalogId = ids.catalog,
) {
  return {
    schemaVersion: 1,
    workspace: { kind, id: workspaceId },
    subject: { kind: "catalog", id: catalogId },
  };
}
function mockFetch({
  history = [],
  stream,
  send,
}: { history?: UIMessage[]; stream?: Response; send?: Response } = {}) {
  const fetch = vi.fn(async (url, init) => {
    if (url === historyUrl)
      return Response.json({ messages: structuredClone(history) });
    if (url === streamUrl)
      return stream ?? workflowResponse([{ type: "finish" }]);
    if (url === postUrl && init?.method === "POST")
      return (
        send ??
        workflowResponse([
          { type: "start", messageId: "new-assistant" },
          part(1, "Catalog response."),
          { type: "finish" },
        ])
      );
    throw new Error(`Unexpected synthetic request: ${url}`);
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
}
async function mount(catalogId: string | string[] | undefined = ids.catalog) {
  const page = await SessionChatPage({
    params: Promise.resolve({ sessionId: ids.session, chatId: ids.chat }),
    searchParams: Promise.resolve({ catalogId }),
  });
  const view = render(page);
  await waitFor(() => expect(screen.queryByText("Loading history")).toBeNull());
  return {
    ...view,
    switchCatalog: (
      catalogId?: string | string[],
      changed?: { id?: string; sessionId?: string },
    ) =>
      view.rerender(
        <div className="flex flex-col size-full items-center">
          <Chat
            id={changed?.id ?? ids.chat}
            sessionId={changed?.sessionId ?? ids.session}
            catalogId={catalogId}
          />
        </div>,
      ),
  };
}
async function send() {
  await act(async () => {
    await current.append({
      id: "synthetic-user",
      role: "user",
      parts: [{ type: "text", text: "Explain this retained catalog." }],
    });
  });
  await waitFor(() => expect(current.status).toBe("ready"));
}

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("VERCEL_ENV", "development");
  vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "development");
  vi.stubEnv("NEXT_PUBLIC_RECOUP_INTELLIGENT_UI_CHAT", "true");
  Object.assign(external, {
    actor: "synthetic-privy-actor",
    account: ids.account,
    override: null,
    organization: ids.organization,
    initialized: true,
    artist: null,
    authenticated: true,
    routeChat: true,
  });
  external.getAccessToken.mockReset().mockResolvedValue("synthetic-token");
  suspendOnCatalog = undefined;
  suspendedRenders = 0;
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("consumes the canonical route catalog without an artist and sends selected workspace separately from actor and account override", async () => {
  external.override = ids.override;
  const fetch = mockFetch();
  await mount();
  expect(current.intelligentUI).toBeDefined();
  await send();
  await screen.findByText("Catalog response.");
  const request = fetch.mock.calls.find(([url]) => url === postUrl)!;
  const body = JSON.parse(request[1]!.body as string);
  expect(body.intelligentUI).toEqual(context());
  expect(body.accountId).toBe(ids.override);
  expect(body.artistId).toBeUndefined();
  expect(body.organizationId).toBe(ids.organization);
  expect(body.sessionId).toBe(ids.session);
  expect(body.chatId).toBe(ids.chat);
  expect(body.recoupAccessToken).toBe("synthetic-token");
  expect(request[1]!.headers).toMatchObject({
    Authorization: "Bearer synthetic-token",
  });
  expect(JSON.stringify(body.intelligentUI)).not.toContain(external.actor);
  expect(current.intelligentUI!.scopeKey).toContain(ids.override);
});

it("binds initialized Personal to the effective account with explicit account kind", async () => {
  external.organization = null;
  external.override = ids.override;
  const fetch = mockFetch({
    send: workflowResponse([
      { type: "start", messageId: "personal-assistant" },
      part(1, "Personal catalog response.", ids.catalog, ids.override),
      { type: "finish" },
    ]),
  });
  await mount();
  await send();
  await screen.findByText("Personal catalog response.");
  const body = JSON.parse(
    fetch.mock.calls.find(([url]) => url === postUrl)![1]!.body as string,
  );
  expect(body.intelligentUI).toEqual(context(ids.override, "account"));
  expect(body.organizationId).toBeUndefined();
});

it("does not interpret an uninitialized null workspace as Personal", async () => {
  external.organization = null;
  external.initialized = false;
  const fetch = mockFetch();
  const harness = await mount();
  expect(current.intelligentUI).toBeUndefined();
  await send();
  expect(
    JSON.parse(
      fetch.mock.calls.find(([url]) => url === postUrl)![1]!.body as string,
    ).intelligentUI,
  ).toBeUndefined();
  expect(screen.queryByText("Catalog response.")).toBeNull();
  external.initialized = true;
  harness.switchCatalog(ids.catalog);
  await waitFor(() =>
    expect(current.intelligentUI?.scopeKey).toContain(ids.account),
  );
});

it.each(["", "not-a-uuid", [ids.catalog], [ids.catalog, ids.otherCatalog]])(
  "rejects explicit malformed/array catalog input %j without an artist fallback",
  async (catalogId) => {
    external.artist = ids.artist;
    const fetch = mockFetch();
    await mount(catalogId);
    expect(current.intelligentUI).toBeUndefined();
    await send();
    const body = JSON.parse(
      fetch.mock.calls.find(([url]) => url === postUrl)![1]!.body as string,
    );
    expect(body.intelligentUI).toBeUndefined();
    expect(body.artistId).toBeUndefined();
    expect(screen.queryByText("Catalog response.")).toBeNull();
  },
);

it.each(["production", "disabled"])(
  "keeps %s route and request on the ordinary artist path",
  async (mode) => {
    if (mode === "production") vi.stubEnv("NODE_ENV", "production");
    else vi.stubEnv("NEXT_PUBLIC_RECOUP_INTELLIGENT_UI_CHAT", "false");
    external.artist = ids.artist;
    const fetch = mockFetch();
    await mount();
    await send();
    const body = JSON.parse(
      fetch.mock.calls.find(([url]) => url === postUrl)![1]!.body as string,
    );
    expect(body.intelligentUI).toBeUndefined();
    expect(body.artistId).toBe(ids.artist);
    expect(current.intelligentUI).toBeUndefined();
  },
);

it("keeps the explicit catalog bound when the selected artist changes", async () => {
  external.artist = ids.artist;
  const fetch = mockFetch();
  const harness = await mount();
  await send();
  await screen.findByText("Catalog response.");
  const key = current.intelligentUI!.scopeKey;
  const count = fetch.mock.calls.length;
  external.artist = "another-selected-artist";
  harness.switchCatalog(ids.catalog);
  expect(current.intelligentUI!.scopeKey).toBe(key);
  expect(screen.getByText("Catalog response.")).toBeTruthy();
  expect(fetch).toHaveBeenCalledTimes(count);
});

it("hydrates historical catalog answers and retains their accepted revision against equal/older/wrong-subject data", async () => {
  const saved: UIMessage = {
    id: "saved-catalog-assistant",
    role: "assistant",
    parts: [
      { type: "text", text: "Saved explanation." },
      part(2, "Historical retained observation."),
    ],
  };
  let controller!: ReadableStreamDefaultController<UIMessageChunk>;
  const source = new ReadableStream<UIMessageChunk>({
    start(c) {
      controller = c;
    },
  });
  const fetch = mockFetch({
    history: [saved],
    stream: createUIMessageStreamResponse({
      stream: source,
      headers: { "x-workflow-run-id": "synthetic-run" },
    }),
  });
  await mount();
  await screen.findByText("Historical retained observation.");
  await waitFor(() =>
    expect(fetch.mock.calls.some(([url]) => url === streamUrl)).toBe(true),
  );
  await act(async () => {
    controller.enqueue(part(2, "Conflicting same revision."));
    controller.enqueue(part(1, "Older observation."));
    controller.enqueue(part(3, "Another catalog.", ids.otherCatalog));
  });
  expect(screen.getByText("Historical retained observation.")).toBeTruthy();
  expect(screen.queryByText("Conflicting same revision.")).toBeNull();
  await act(async () => {
    controller.enqueue(part(4, "New complete retained observation."));
    controller.enqueue({ type: "finish" });
    controller.close();
  });
  await screen.findByText("New complete retained observation.");
  expect(current.messages.map((message) => message.id)).toEqual([saved.id]);
  expect(screen.getByText("Saved explanation.")).toBeTruthy();
  expect(
    current.intelligentUI!.consumer.getSnapshot(
      saved.id,
      "synthetic-summary",
      current.intelligentUI!.scopeKey,
    )?.revision,
  ).toBe(4);
});

it.each([
  "catalog",
  "workspace",
  "account",
  "actor",
  "artist",
  "workspace-kind",
  "session",
  "chat",
] as const)(
  "invalidates the catalog stream and hides old accepted UI on a committed %s switch",
  async (field) => {
    let controller!: ReadableStreamDefaultController<UIMessageChunk>;
    const source = new ReadableStream<UIMessageChunk>({
      start(c) {
        controller = c;
      },
    });
    const saved: UIMessage = {
      id: "saved-catalog-assistant",
      role: "assistant",
      parts: [part(1, "Old catalog observation.")],
    };
    const fetch = mockFetch({
      history: [saved],
      stream: createUIMessageStreamResponse({
        stream: source,
        headers: { "x-workflow-run-id": "synthetic-run" },
      }),
    });
    if (field === "workspace-kind") external.account = ids.organization;
    const harness = await mount();
    await screen.findByText("Old catalog observation.");
    await waitFor(() =>
      expect(fetch.mock.calls.some(([url]) => url === streamUrl)).toBe(true),
    );
    const request = fetch.mock.calls.find(([url]) => url === streamUrl)!;
    const previous = current.intelligentUI!;
    // Hold the next history response so only the committed change is under test.
    fetch.mockImplementation(async () => new Promise<Response>(() => {}));
    if (field === "workspace") external.organization = ids.otherOrganization;
    if (field === "workspace-kind") external.organization = null;
    if (field === "account") external.override = ids.override;
    if (field === "actor") external.actor = "another-synthetic-actor";
    if (field === "artist") external.artist = ids.artist;
    harness.switchCatalog(
      field === "catalog"
        ? ids.otherCatalog
        : field === "artist"
          ? undefined
          : ids.catalog,
      field === "session"
        ? { sessionId: "another-synthetic-session" }
        : field === "chat"
          ? { id: "another-synthetic-chat" }
          : undefined,
    );
    expect(request[1]!.signal?.aborted).toBe(true);
    expect(screen.queryByText("Old catalog observation.")).toBeNull();
    expect(
      previous.consumer.getSnapshot(
        saved.id,
        "synthetic-summary",
        previous.scopeKey,
      ),
    ).toBeUndefined();
    await act(async () => {
      controller.enqueue(part(5, "Late old catalog data."));
      controller.enqueue({ type: "finish" });
      controller.close();
    });
    expect(screen.queryByText("Late old catalog data.")).toBeNull();
  },
);

it("keeps committed catalog history and streaming UI while a new catalog render suspends and is abandoned", async () => {
  let controller!: ReadableStreamDefaultController<UIMessageChunk>;
  const source = new ReadableStream<UIMessageChunk>({
    start(c) {
      controller = c;
    },
  });
  const saved: UIMessage = {
    id: "saved-catalog-assistant",
    role: "assistant",
    parts: [part(1, "Committed catalog observation.")],
  };
  const fetch = mockFetch({
    history: [saved],
    stream: createUIMessageStreamResponse({
      stream: source,
      headers: { "x-workflow-run-id": "synthetic-run" },
    }),
  });
  let select!: React.Dispatch<React.SetStateAction<string>>;
  function Harness() {
    const [catalog, setCatalog] = React.useState(ids.catalog);
    select = setCatalog;
    return (
      <React.Suspense fallback={<p>Suspended catalog</p>}>
        <prospectiveCatalog.Provider value={catalog}>
          <Chat id={ids.chat} sessionId={ids.session} catalogId={catalog} />
        </prospectiveCatalog.Provider>
      </React.Suspense>
    );
  }
  suspendOnCatalog = ids.otherCatalog;
  render(<Harness />);
  await screen.findByText("Committed catalog observation.");
  await waitFor(() =>
    expect(fetch.mock.calls.some(([url]) => url === streamUrl)).toBe(true),
  );
  const key = current.intelligentUI!.scopeKey;
  const signal = fetch.mock.calls.find(([url]) => url === streamUrl)![1]!
    .signal!;
  await act(async () => {
    React.startTransition(() => select(ids.otherCatalog));
  });
  expect(suspendedRenders).toBeGreaterThan(0);
  expect(screen.queryByText("Suspended catalog")).toBeNull();
  expect(current.intelligentUI!.scopeKey).toBe(key);
  expect(signal.aborted).toBe(false);
  await act(async () => {
    controller.enqueue(part(2, "Committed catalog updates during suspension."));
  });
  await screen.findByText("Committed catalog updates during suspension.");
  await act(async () => {
    select(ids.catalog);
    controller.enqueue(part(3, "Committed catalog completes."));
    controller.enqueue({ type: "finish" });
    controller.close();
  });
  await screen.findByText("Committed catalog completes.");
  expect(current.intelligentUI!.scopeKey).toBe(key);
  expect(signal.aborted).toBe(false);
  expect(fetch.mock.calls.filter(([url]) => url === historyUrl)).toHaveLength(
    1,
  );
  expect(fetch.mock.calls.filter(([url]) => url === streamUrl)).toHaveLength(1);
});

it.each([
  { catalogId: ids.catalog, query: ids.catalog },
  { catalogId: [] as string[], query: "" },
])(
  "preserves explicit catalog $catalogId through the owning hook's canonical URL update after Send",
  async ({ catalogId, query }) => {
    external.routeChat = false;
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});
    const fetch = mockFetch();
    await mount(catalogId);
    await act(async () => {
      current.setInput("Explain this retained catalog.");
    });
    await act(async () => {
      await current.handleSendMessage({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    });
    await waitFor(() => expect(current.status).toBe("ready"));
    expect(replaceState).toHaveBeenCalledWith(
      {},
      "",
      `/sessions/${ids.session}/chats/${ids.chat}?catalogId=${query}`,
    );
    expect(fetch.mock.calls.filter(([url]) => url === postUrl)).toHaveLength(1);
    expect(
      fetch.mock.calls.filter(
        ([url]) => url === historyUrl || url === streamUrl,
      ),
    ).toHaveLength(0);
  },
);

it.each(["workspace", "personal-account", "signed-out"] as const)(
  "does not bind incomplete %s catalog context",
  async (incomplete) => {
    if (incomplete === "workspace")
      external.organization = "organization-label";
    if (incomplete === "personal-account") {
      external.organization = null;
      external.account = "account-label";
    }
    if (incomplete === "signed-out") external.authenticated = false;
    const fetch = mockFetch();
    await mount();
    expect(current.intelligentUI).toBeUndefined();
    await send();
    expect(
      JSON.parse(
        fetch.mock.calls.find(([url]) => url === postUrl)![1]!.body as string,
      ).intelligentUI,
    ).toBeUndefined();
    expect(screen.queryByText("Catalog response.")).toBeNull();
  },
);

it("replaces artist admission with an explicit catalog subject without inferring a relationship", async () => {
  external.artist = ids.artist;
  const artistPart = part(1, "Historical artist answer.");
  artistPart.data.context.subject = {
    kind: "artist",
    id: ids.artist,
    label: "Synthetic artist",
  };
  const saved: UIMessage = {
    id: "saved-artist-assistant",
    role: "assistant",
    parts: [artistPart],
  };
  const fetch = mockFetch({ history: [saved] });
  const view = render(
    await SessionChatPage({
      params: Promise.resolve({ sessionId: ids.session, chatId: ids.chat }),
      searchParams: Promise.resolve({}),
    }),
  );
  await screen.findByText("Historical artist answer.");
  const previous = current.intelligentUI!;
  view.rerender(
    <div className="flex flex-col size-full items-center">
      <Chat id={ids.chat} sessionId={ids.session} catalogId={ids.catalog} />
    </div>,
  );
  await waitFor(() =>
    expect(current.intelligentUI?.scopeKey).toContain(ids.catalog),
  );
  expect(screen.queryByText("Historical artist answer.")).toBeNull();
  expect(
    previous.consumer.getSnapshot(
      saved.id,
      "synthetic-summary",
      previous.scopeKey,
    ),
  ).toBeUndefined();
  await send();
  await screen.findByText("Catalog response.");
  const body = JSON.parse(
    fetch.mock.calls.find(([url]) => url === postUrl)![1]!.body as string,
  );
  expect(body.artistId).toBeUndefined();
  expect(body.intelligentUI).toEqual(context());
});

it("cannot publish a late catalog history result after a different catalog commits", async () => {
  let oldHistory!: (response: Response) => void;
  let nextHistory!: (response: Response) => void;
  const first = new Promise<Response>((resolve) => {
    oldHistory = resolve;
  });
  const second = new Promise<Response>((resolve) => {
    nextHistory = resolve;
  });
  let histories = 0;
  const fetch = vi.fn(async (url) => {
    if (url === historyUrl) return ++histories === 1 ? first : second;
    if (url === streamUrl) return workflowResponse([{ type: "finish" }]);
    throw new Error(`Unexpected synthetic request: ${url}`);
  });
  vi.stubGlobal("fetch", fetch);
  const view = render(
    await SessionChatPage({
      params: Promise.resolve({ sessionId: ids.session, chatId: ids.chat }),
      searchParams: Promise.resolve({ catalogId: ids.catalog }),
    }),
  );
  await waitFor(() => expect(histories).toBe(1));
  view.rerender(
    <div className="flex flex-col size-full items-center">
      <Chat
        id={ids.chat}
        sessionId={ids.session}
        catalogId={ids.otherCatalog}
      />
    </div>,
  );
  await waitFor(() => expect(histories).toBe(2));
  await act(async () => {
    oldHistory(
      Response.json({
        messages: [
          {
            id: "late-old-assistant",
            role: "assistant",
            parts: [
              { type: "text", text: "Late old catalog prose." },
              part(9, "Late old catalog snapshot."),
            ],
          },
        ],
      }),
    );
  });
  expect(screen.queryByText("Late old catalog prose.")).toBeNull();
  expect(screen.queryByText("Late old catalog snapshot.")).toBeNull();
  expect(fetch.mock.calls.filter(([url]) => url === streamUrl)).toHaveLength(0);
  await act(async () => {
    nextHistory(
      Response.json({
        messages: [
          {
            id: "current-catalog-assistant",
            role: "assistant",
            parts: [part(1, "Current catalog history.", ids.otherCatalog)],
          },
        ],
      }),
    );
  });
  await screen.findByText("Current catalog history.");
  expect(current.messages.map((message) => message.id)).toEqual([
    "current-catalog-assistant",
  ]);
  await waitFor(() =>
    expect(fetch.mock.calls.filter(([url]) => url === streamUrl)).toHaveLength(
      1,
    ),
  );
});
