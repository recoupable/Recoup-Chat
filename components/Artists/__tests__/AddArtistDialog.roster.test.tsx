// @vitest-environment jsdom
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AddArtistDialog from "../AddArtistDialog";
import type { SpotifyArtistSearchResult } from "@/types/spotify";

const state = vi.hoisted(() => ({
  organizationId: "11111111-1111-4111-8111-111111111111",
  catalogs: undefined as { catalogs: { id: string }[] } | undefined,
  token: vi.fn(),
  refresh: vi.fn(),
  close: vi.fn(),
  request: vi.fn<typeof fetch>(),
  valuation: vi.fn(),
  invalidate: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  promise: vi.fn(),
}));

const artist: SpotifyArtistSearchResult = {
  id: "0123456789AbCdEfGhIjKl",
  name: "Synthetic roster artist",
  type: "artist",
  uri: "spotify:artist:0123456789AbCdEfGhIjKl",
  external_urls: {
    spotify: "https://open.spotify.com/artist/0123456789AbCdEfGhIjKl",
  },
  images: [],
  popularity: 0,
  genres: [],
  followers: { href: null, total: 0 },
};
const canonicalId = "22222222-2222-4222-8222-222222222222";

// Keep the real dialog, hook, identity helpers and HTTP projection together.
// Auth/workspace/query services, search results and paid work remain synthetic.
vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({ getAccessToken: state.token }),
}));
vi.mock("@/providers/ArtistProvider", () => ({
  useArtistProvider: () => ({
    isCreationOpen: true,
    closeCreation: state.close,
    getArtists: state.refresh,
  }),
}));
vi.mock("@/providers/OrganizationProvider", () => ({
  useOrganization: () => ({ selectedOrgId: state.organizationId }),
}));
vi.mock("@/providers/UserProvder", () => ({
  useUserProvider: () => ({ userData: { account_id: "synthetic-actor" } }),
}));
vi.mock("@/hooks/useAccountOrganizations", () => ({
  default: () => ({
    data: [
      {
        organization_id: state.organizationId,
        organization_name: "Synthetic organization",
      },
    ],
    isPending: false,
  }),
}));
vi.mock("@/hooks/useCatalogs", () => ({
  default: () => ({ data: state.catalogs }),
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: state.invalidate }),
}));
vi.mock("@/hooks/useSpotifyArtistSearch", () => ({
  useSpotifyArtistSearch: () => ({ results: [artist], isSearching: false }),
}));
vi.mock("@/lib/valuation/runValuation", () => ({
  runValuation: state.valuation,
}));
vi.mock("sonner", () => ({
  toast: { success: state.success, error: state.error, promise: state.promise },
}));
vi.mock("@/lib/consts", () => ({
  API_OVERRIDE_STORAGE_KEY: "fixture_api_override",
  NEW_API_BASE_URL: "https://recoup.fixture.invalid",
}));

function respond(status = 200, accountId = canonicalId) {
  state.request.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        artist: { id: accountId, account_id: accountId, name: artist.name },
      }),
      { status, headers: { "Content-Type": "application/json" } },
    ),
  );
}

function pickArtist() {
  fireEvent.click(
    screen.getByRole("option", { name: /Synthetic roster artist/ }),
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  state.organizationId = "11111111-1111-4111-8111-111111111111";
  state.catalogs = undefined;
  state.token.mockResolvedValue("synthetic-access-token");
  state.refresh.mockResolvedValue(undefined);
  state.valuation.mockResolvedValue(undefined);
  state.request.mockRejectedValue(
    new Error("Unexpected synthetic HTTP request"),
  );
  vi.stubGlobal("fetch", state.request);
  window.sessionStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("roster dialog HTTP handoff", () => {
  it.each([200, 201])(
    "attaches an exact Spotify identity and refreshes the returned account after HTTP %s",
    async (status) => {
      respond(status);
      render(<AddArtistDialog />);
      pickArtist();
      await waitFor(() => expect(state.close).toHaveBeenCalledOnce());

      expect(state.request).toHaveBeenCalledExactlyOnceWith(
        "https://recoup.fixture.invalid/api/artists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer synthetic-access-token",
          },
          body: JSON.stringify({
            name: artist.name,
            organization_id: state.organizationId,
            spotify_artist_id: artist.id,
          }),
        },
      );
      expect(state.refresh).toHaveBeenCalledExactlyOnceWith(canonicalId);
      expect(state.success).toHaveBeenCalledOnce();
      expect(state.error).not.toHaveBeenCalled();
      expect(state.valuation).not.toHaveBeenCalled();
    },
  );

  it("uses the current organization after remounting rather than retaining the previous workspace", async () => {
    respond();
    const first = render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() => expect(state.close).toHaveBeenCalledTimes(1));
    first.unmount();

    state.organizationId = "33333333-3333-4333-8333-333333333333";
    respond();
    render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() => expect(state.close).toHaveBeenCalledTimes(2));
    const body = JSON.parse(String(state.request.mock.calls[1][1]?.body));
    expect(body).toEqual({
      name: artist.name,
      organization_id: state.organizationId,
      spotify_artist_id: artist.id,
    });
    expect(state.refresh).toHaveBeenLastCalledWith(canonicalId);
  });

  it.each([403, 500])(
    "requests an error notification and keeps the dialog open after HTTP %s without a name-only retry",
    async (status) => {
      state.request.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: "Synthetic association rejected" }),
          { status },
        ),
      );
      render(<AddArtistDialog />);
      pickArtist();
      await waitFor(() =>
        expect(state.error).toHaveBeenCalledWith(
          "Synthetic association rejected",
        ),
      );
      expect(screen.getByRole("dialog")).toBeDefined();
      expect(state.close).not.toHaveBeenCalled();
      expect(state.request).toHaveBeenCalledOnce();
      expect(state.refresh).not.toHaveBeenCalled();
      expect(state.success).not.toHaveBeenCalled();
      expect(state.valuation).not.toHaveBeenCalled();
    },
  );

  it("does not submit without an authenticated token", async () => {
    state.token.mockResolvedValue(null);
    render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() =>
      expect(state.error).toHaveBeenCalledWith(
        "Please sign in to add an artist",
      ),
    );
    expect(state.request).not.toHaveBeenCalled();
    expect(state.close).not.toHaveBeenCalled();
    expect(state.valuation).not.toHaveBeenCalled();
  });

  it("waits for roster refresh before requesting closure and disables repeated selection meanwhile", async () => {
    let finishRefresh: () => void = () => undefined;
    state.refresh.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishRefresh = resolve;
        }),
    );
    respond();
    render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() =>
      expect(state.refresh).toHaveBeenCalledWith(canonicalId),
    );
    expect(state.close).not.toHaveBeenCalled();
    expect(
      screen.getByRole("option", { name: /Synthetic roster artist/ }),
    ).toHaveProperty("disabled", true);
    await act(async () => {
      finishRefresh();
    });
    await waitFor(() => expect(state.close).toHaveBeenCalledOnce());
  });

  it("does not report success or start valuation when refresh fails after an acknowledged attachment", async () => {
    state.refresh.mockRejectedValueOnce(
      new Error("Synthetic roster refresh failed"),
    );
    respond();
    render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() =>
      expect(state.error).toHaveBeenCalledWith(
        "Synthetic roster refresh failed",
      ),
    );
    expect(state.close).not.toHaveBeenCalled();
    expect(state.success).not.toHaveBeenCalled();
    expect(state.request).toHaveBeenCalledOnce();
    expect(state.valuation).not.toHaveBeenCalled();
  });

  it("does not seed valuation when a catalog already exists", async () => {
    state.catalogs = { catalogs: [{ id: "synthetic-catalog" }] };
    respond();
    render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() => expect(state.close).toHaveBeenCalledOnce());
    expect(state.valuation).not.toHaveBeenCalled();
  });

  it("characterizes the existing first-artist valuation side effect using only a mocked paid boundary", async () => {
    state.catalogs = { catalogs: [] };
    respond();
    render(<AddArtistDialog />);
    pickArtist();
    await waitFor(() => expect(state.close).toHaveBeenCalledOnce());
    expect(state.valuation).toHaveBeenCalledExactlyOnceWith(
      "synthetic-access-token",
      artist.id,
    );
    await waitFor(() =>
      expect(state.invalidate).toHaveBeenCalledWith({ queryKey: ["catalogs"] }),
    );
    expect(state.request).toHaveBeenCalledOnce();
  });
});
