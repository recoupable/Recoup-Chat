export const createSession = async (
  successUrl: string,
  priceId: string,
  referenceId: string,
  chatId: string,
  accountId: string,
) => {
  try {
    const response = await fetch(`/api/stripe/session/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        successUrl,
        priceId,
        referenceId,
        metadata: {
          chatId,
          accountId,
        },
      }),
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    return { error };
  }
};
