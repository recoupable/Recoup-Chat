export const getSession = async (referenceId: string) => {
  try {
    const response = await fetch(
      `/api/stripe/session/list?referenceId=${referenceId}`,
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    return { error };
  }
};
