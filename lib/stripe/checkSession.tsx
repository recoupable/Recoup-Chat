export const checkSession = async (
  sessionId: string,
  chatId: string,
  accountId: string,
) => {
  try {
    const response = await fetch(
      `/api/stripe/session/checked?sessionId=${sessionId}&chatId=${chatId}&accountId=${accountId}`,
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    return { error };
  }
};
