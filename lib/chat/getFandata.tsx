import { FAN_TYPE } from "@/types/fans";

const getFandata = (fan: FAN_TYPE) => {
  let recommendations =
    typeof fan.recommendations === "string" ? fan.recommendations : "";
  recommendations = recommendations?.replaceAll?.(`\\"`, "");
  let artistNames: string[] = [];
  if (recommendations && typeof recommendations.matchAll === "function") {
    artistNames = Array.from(
      recommendations.matchAll(/artistName:([^,}]+)/g),
      (match) => match?.[1]?.trim(),
    );
  }
  let playlist = typeof fan.playlist === "string" ? fan.playlist : "";
  playlist = playlist?.replaceAll?.(`\\"`, "");

  let userNames: string[] = [];
  if (playlist && typeof playlist.matchAll === "function") {
    userNames = Array.from(
      playlist.matchAll(/display_name:([^,}]+)/g),
      (match) => match?.[1]?.trim(),
    );
  }

  let recentlyPlayed =
    typeof fan.recentlyPlayed === "string" ? fan.recentlyPlayed : "";
  recentlyPlayed = recentlyPlayed?.replaceAll?.(`\\"`, "");

  if (recentlyPlayed && typeof recentlyPlayed.matchAll === "function") {
    artistNames = artistNames.concat(
      Array.from(recentlyPlayed.matchAll(/artistName:([^,}]+)/g), (match) =>
        match?.[1]?.trim(),
      ),
    );
  }

  const mergedUserNames = [...new Set(userNames)];
  const mergedArtistNames = [...new Set(artistNames)];

  const data = {
    userNames: mergedUserNames.join(","),
    artistNames: mergedArtistNames.join(","),
    country: fan.country,
    city: fan.city,
    product: fan.product,
  };

  return data;
};

export default getFandata;
