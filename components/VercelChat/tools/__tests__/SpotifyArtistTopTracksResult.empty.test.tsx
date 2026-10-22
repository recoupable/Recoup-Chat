// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UIMessage } from "ai";
import type {
  SpotifyArtistSearchResult,
  SpotifyArtistTopTracksResultType,
  SpotifyTrackSearchResult,
} from "@/types/spotify";
import { MessageParts } from "@/components/VercelChat/MessageParts";
import SpotifyArtistTopTracksResult from "../SpotifyArtistTopTracksResult";

const network = vi.fn(() => {
  throw new Error("Top-tracks rendering must not request the network");
});
beforeEach(() => vi.stubGlobal("fetch", network));
afterEach(() => {
  try {
    cleanup();
    expect(network).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
    network.mockClear();
  }
});

const emptyCases: [string, unknown][] = [
  ["empty tracks", { tracks: [] }],
  ["null tracks", { tracks: null }],
  ["omitted tracks", {}],
];
const artist: SpotifyArtistSearchResult = {
  id: "synthetic-artist",
  name: "Synthetic artist",
  type: "artist",
  uri: "spotify:artist:synthetic",
  external_urls: { spotify: "https://open.spotify.com/artist/synthetic" },
  images: [],
  popularity: 0,
  genres: [],
  followers: { href: null, total: 0 },
};
const track: SpotifyTrackSearchResult = {
  id: "synthetic-track-one",
  name: "First supplied track",
  type: "track",
  uri: "spotify:track:synthetic",
  external_urls: {
    spotify: "https://open.spotify.com/track/synthetic?si=a%2Bb#supplied",
  },
  album: {
    id: "synthetic-album",
    name: "Synthetic album",
    type: "album",
    uri: "spotify:album:synthetic",
    external_urls: { spotify: "https://open.spotify.com/album/synthetic" },
    images: [],
    artists: [artist],
  },
  artists: [artist],
  duration_ms: 180000,
  explicit: false,
  popularity: 0,
};
const populated: SpotifyArtistTopTracksResultType = {
  tracks: [
    track,
    {
      ...track,
      id: "synthetic-track-two",
      name: "Second supplied track",
      external_urls: { spotify: "javascript:synthetic()" },
    },
  ],
};

function renderChatResult(result: unknown, dynamic: boolean, failed = false) {
  const reload = vi.fn();
  const message = {
    id: "synthetic-top-tracks",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Here are the supplied top tracks.",
        state: "done",
      },
      {
        type: dynamic ? "dynamic-tool" : "tool-get_spotify_artist_top_tracks",
        toolName: "get_spotify_artist_top_tracks",
        toolCallId: "synthetic-top-tracks",
        state: !dynamic && failed ? "output-error" : "output-available",
        errorText:
          !dynamic && failed ? "Synthetic provider failure" : undefined,
        input: {},
        output: dynamic
          ? {
              isError: failed,
              content: [{ type: "text", text: JSON.stringify(result) }],
            }
          : result,
      },
      {
        type: "tool-get_chats",
        toolCallId: "synthetic-chats",
        state: "output-available",
        input: {},
        output: {
          chats: [
            {
              id: "synthetic-chat",
              title: "Synthetic saved chat",
              accountId: "synthetic-account",
              sessionId: "synthetic-session",
              updatedAt: "2026-10-22T00:00:00Z",
            },
          ],
        },
      },
      { type: "text", text: "The conversation continues.", state: "done" },
    ],
  } as unknown as UIMessage;
  render(
    <MessageParts
      message={message}
      mode="view"
      setMode={() => {}}
      status="ready"
      reload={reload}
    />,
  );
  expect(screen.getByText("Here are the supplied top tracks.")).toBeTruthy();
  expect(screen.getByText("The conversation continues.")).toBeTruthy();
  expect(
    screen
      .getByRole("link", { name: "Synthetic saved chat" })
      .getAttribute("href"),
  ).toBe("/sessions/synthetic-session/chats/synthetic-chat");
  return reload;
}

describe("Spotify top tracks with no returned tracks", () => {
  it.each(emptyCases)(
    "explains %s without a card or action",
    (_label, result) => {
      const { container } = render(
        <SpotifyArtistTopTracksResult
          result={result as SpotifyArtistTopTracksResultType}
        />,
      );
      expect(screen.getByText("No Spotify top tracks returned.").tagName).toBe(
        "P",
      );
      expect(container.textContent).toBe("No Spotify top tracks returned.");
      expect(container.children.length).toBe(1);
      expect(
        container.querySelector(
          "h1,h2,h3,h4,svg,a,button,[role='status'],[aria-live]",
        ),
      ).toBeNull();
    },
  );

  describe.each([true, false])("chat output with dynamic=%s", (dynamic) => {
    it.each(emptyCases)(
      "keeps %s alongside prose and chat",
      (_label, result) => {
        const reload = renderChatResult(result, dynamic);
        expect(
          screen.getByText("No Spotify top tracks returned."),
        ).toBeTruthy();
        expect(screen.queryByText(/Failed to get Spotify/)).toBeNull();
        expect(
          screen.queryByRole("heading", { name: "Top Tracks" }),
        ).toBeNull();
        expect(reload).not.toHaveBeenCalled();
      },
    );

    it("preserves populated track order and guarded destinations", () => {
      const reload = renderChatResult(populated, dynamic);
      expect(screen.queryByText("No Spotify top tracks returned.")).toBeNull();
      expect(screen.getByRole("heading", { name: "Top Tracks" })).toBeTruthy();
      expect(
        screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent),
      ).toEqual(["First supplied track", "Second supplied track"]);
      const link = screen.getByRole("link", { name: /First supplied track/ });
      expect(link.getAttribute("href")).toBe(track.external_urls.spotify);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(screen.getByText("Second supplied track").closest("a")).toBeNull();
      expect(reload).not.toHaveBeenCalled();
    });

    it("keeps an explicit failure in the existing error disclosure", () => {
      const reload = renderChatResult({ tracks: [] }, dynamic, true);
      expect(screen.queryByText("No Spotify top tracks returned.")).toBeNull();
      const error = screen.getByRole("button", {
        name: dynamic ? /Tool failed/ : "get_spotify_artist_top_tracks",
      });
      expect(error.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(error);
      expect(
        screen.getByText(
          dynamic ? '{"tracks":[]}' : "Synthetic provider failure",
        ),
      ).toBeTruthy();
      expect(reload).not.toHaveBeenCalled();
    });
  });
});
