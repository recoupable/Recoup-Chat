import { describe, expect, it } from "vitest";
import { isSafeSpotifyUrl } from "../isSafeSpotifyUrl";

describe("isSafeSpotifyUrl", () => {
  it.each([
    "https://open.spotify.com/track/synthetic?si=a%2Bb#details",
    "https://play.spotify.com/artist/synthetic",
    "https://accounts.spotify.com/",
    "HTTPS://OPEN.SPOTIFY.COM/album/synthetic",
  ])(
    "accepts HTTPS Spotify subdomains under the established policy: %s",
    (value) => {
      expect(isSafeSpotifyUrl(value)).toBe(true);
    },
  );

  it.each([
    undefined,
    null,
    false,
    0,
    42,
    {},
    [],
    "",
    "#",
    "not a URL",
    "javascript:void(0)",
    "data:text/html,synthetic",
    "http://open.spotify.com/track/synthetic",
    "ftp://open.spotify.com/track/synthetic",
    "//open.spotify.com/track/synthetic",
    "/track/synthetic",
    "https://spotify.com/",
    "https://notspotify.com/",
    "https://open.spotify.com.evil.test/",
    "https://open.spotify.com@evil.test/",
    "https://open.spotіfy.com/",
    "https://[malformed/",
  ])("rejects malformed or unsupported tool data: %j", (value) => {
    expect(isSafeSpotifyUrl(value)).toBe(false);
  });
});
