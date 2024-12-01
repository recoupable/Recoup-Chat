// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSegmentsIcons = async (segments: any) => {
  try {
    const response = await fetch(`/api/segments/icons`, {
      method: "POST",
      body: JSON.stringify(segments),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getSegmentsIcons;
