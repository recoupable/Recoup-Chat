/** Tool results must not turn non-Spotify destinations into Spotify actions. */
export function isSafeSpotifyUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".spotify.com");
  } catch {
    return false;
  }
}
