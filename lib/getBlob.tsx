const getBlob = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const type = response.headers.get("content-type") || "";
    const blob = await response.blob();
    return { blob, type };
  } catch (error) {
    return { error };
  }
};

export default getBlob;
