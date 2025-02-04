import { AGENT_API } from "./consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectFansToArtist = async (fansSegments: any, artistId: string) => {
  try {
    const response = await fetch(
      `${AGENT_API}/api/connect_fans_segments_to_artist`,
      {
        method: "POST",
        body: JSON.stringify({
          fansSegments,
          artistId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default connectFansToArtist;
