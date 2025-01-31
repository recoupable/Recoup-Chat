// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveArtist = async (artist_data: any) => {
  const response = await fetch("/api/artist/create_or_update", {
    method: "POST",
    body: JSON.stringify(artist_data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
};

export default saveArtist;
