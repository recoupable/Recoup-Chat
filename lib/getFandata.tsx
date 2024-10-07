import { FAN_TYPE } from "@/types/fans";

const getFandata = (fan: FAN_TYPE) => {
  let recommendations = fan.recommendations || "";
  recommendations = recommendations.replaceAll(`\\"`, "");
  let artistNames = Array.from(
    recommendations.matchAll(/artistName:([^,}]+)/g),
    (match) => match?.[1]?.trim()
  );
  let playlist = fan.playlist || "";
  playlist = playlist.replaceAll(`\\"`, "");
  const userNames = Array.from(
    playlist.matchAll(/display_name:([^,}]+)/g),
    (match) => match?.[1]?.trim()
  );

  let recentlyPlayed = fan.recentlyPlayed || "";
  recentlyPlayed = recentlyPlayed.replaceAll(`\\"`, "");
  artistNames = artistNames.concat(
    Array.from(recentlyPlayed.matchAll(/artistName:([^,}]+)/g), (match) =>
      match?.[1]?.trim()
    )
  );

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
