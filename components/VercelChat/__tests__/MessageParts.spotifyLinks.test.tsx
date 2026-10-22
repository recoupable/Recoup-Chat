// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UIMessage } from "ai";
import type {
  SpotifyArtistSearchResult,
  SpotifyAlbumSearchResult,
  SpotifyTrackSearchResult,
} from "@/types/spotify";
import { MessageParts } from "../MessageParts";

const network = vi.fn(() => {
  throw new Error("Spotify rendering must not request the network");
});
beforeEach(() => {
  vi.stubGlobal("fetch", network);
  vi.stubGlobal("XMLHttpRequest", network);
  vi.stubGlobal("WebSocket", network);
});
afterEach(() => {
  try {
    cleanup();
    expect(network).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
    network.mockClear();
  }
});

const artist: SpotifyArtistSearchResult = {
  id: "synthetic-artist",
  name: "Synthetic artist",
  type: "artist",
  uri: "spotify:artist:synthetic",
  external_urls: { spotify: "https://open.spotify.com/artist/synthetic" },
  images: [],
  popularity: 0,
  genres: ["Ambient"],
  followers: { href: null, total: 0 },
};
const album: SpotifyAlbumSearchResult = {
  id: "synthetic-album",
  name: "Synthetic album",
  type: "album",
  uri: "spotify:album:synthetic",
  external_urls: { spotify: "https://open.spotify.com/album/synthetic" },
  images: [],
  artists: [artist],
  release_date: "2026-10-01",
};
const track: SpotifyTrackSearchResult = {
  id: "synthetic-track",
  name: "Synthetic track",
  type: "track",
  uri: "spotify:track:synthetic",
  external_urls: { spotify: "https://open.spotify.com/track/synthetic" },
  album,
  artists: [artist],
  duration_ms: 60000,
  explicit: false,
  popularity: 0,
};
const routes = [
  {
    tool: "get_spotify_search",
    title: artist.name,
    subtitle: "Ambient",
    fixture: artist,
  },
  {
    tool: "get_spotify_artist_albums",
    title: album.name,
    subtitle: "2026",
    fixture: album,
  },
  {
    tool: "get_spotify_artist_top_tracks",
    title: track.name,
    subtitle: artist.name,
    fixture: track,
  },
] as const;

function renderResult(
  route: (typeof routes)[number],
  url: unknown,
  cover = false,
) {
  const content = {
    ...route.fixture,
    external_urls: { spotify: url },
    ...(cover
      ? { images: [{ url: "/synthetic-cover.png", width: 100, height: 100 }] }
      : {}),
  };
  const results = {
    get_spotify_search: { artists: { items: [content], total: 1 } },
    get_spotify_artist_albums: { items: [content], total: 2 },
    get_spotify_artist_top_tracks: { tracks: [content] },
  };
  const message = {
    id: "spotify-card-boundary",
    role: "assistant",
    parts: [
      { type: "text", text: "Here is the supplied Spotify result." },
      {
        type: "dynamic-tool",
        toolName: route.tool,
        toolCallId: "spotify-call",
        state: "output-available",
        input: {},
        output: {
          content: [
            { type: "text", text: JSON.stringify(results[route.tool]) },
          ],
        },
      },
      { type: "text", text: "The conversation stays here." },
    ],
  } as unknown as UIMessage;
  return render(
    <MessageParts
      message={message}
      mode="view"
      setMode={() => {}}
      status="ready"
      reload={() => {}}
    />,
  );
}

describe.each(routes)("Spotify links through $tool", (route) => {
  it.each([
    "http://open.spotify.com/artist/synthetic",
    "https://open.spotify.com.evil.test/artist/synthetic",
    "https://open.spotify.com@evil.test/artist/synthetic",
    "javascript:void(0)",
    "data:text/html,synthetic",
    "//open.spotify.com/artist/synthetic",
    "/artist/synthetic",
    "not a URL",
    "#",
    "",
    null,
    undefined,
    42,
    {},
  ])(
    "keeps unusable destination %j static without losing content or prose",
    (url) => {
      const { container } = renderResult(route, url);
      expect(screen.queryByRole("link")).toBeNull();
      expect(screen.getByRole("heading", { name: route.title })).toBeTruthy();
      expect(screen.getByText(route.subtitle)).toBeTruthy();
      expect(screen.getByText("No Image")).toBeTruthy();
      expect(
        screen.getByText("Here is the supplied Spotify result."),
      ).toBeTruthy();
      expect(screen.getByText("The conversation stays here.")).toBeTruthy();
      expect(container.querySelector(".lucide-external-link")).toBeNull();
      expect(
        container.querySelector(
          '[class*="hover:bg-black"], [class*="group-hover:scale"]',
        ),
      ).toBeNull();
    },
  );

  it("preserves the destination, new-tab protection and keyboard focus treatment", () => {
    const url =
      "https://open.spotify.com/artist/synthetic?si=synthetic%2Bvalue";
    renderResult(route, url);
    const link = screen.getByRole("link", { name: new RegExp(route.title) });
    expect(link.getAttribute("href")).toBe(url);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")?.split(" ")).toEqual(
      expect.arrayContaining(["noopener", "noreferrer"]),
    );
    expect(link.className).toContain("focus-visible:ring-ring");
    expect(link.className).toContain("focus-visible:ring-2");
    expect(link.querySelector("button, a, input, [tabindex]")).toBeNull();
    expect(screen.getByText(route.subtitle)).toBeTruthy();
    expect(screen.getByText("The conversation stays here.")).toBeTruthy();
    if (route.tool === "get_spotify_artist_albums")
      expect(screen.getByText("Showing 1 of 2 albums")).toBeTruthy();
  });
});

it.each(routes)(
  "canonicalizes an ambiguous URL before rendering through $tool",
  (route) => {
    renderResult(route, "https:open.spotify.com/artist/synthetic?si=a%2Bb");
    const link = screen.getByRole("link", { name: new RegExp(route.title) });
    const expected = "https://open.spotify.com/artist/synthetic?si=a%2Bb";
    expect(link.getAttribute("href")).toBe(expected);
    expect(
      new URL(link.getAttribute("href")!, "https://app.recoupable.dev/chat")
        .href,
    ).toBe(expected);
  },
);

it("retains supplied cover and title when search has no usable link", () => {
  renderResult(
    routes[0],
    "https://elsewhere.example.test/artist/synthetic",
    true,
  );
  const image = screen.getByRole("img", { name: artist.name });
  expect(image.getAttribute("src")).toBe("/synthetic-cover.png");
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("Ambient")).toBeTruthy();
});
