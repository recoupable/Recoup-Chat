import handleError from "../handleError";

export const createCheckoutSession = async () => {
  try {
    const response = await fetch(`/api/stripe/create_checkout_session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    handleError(error);
    return { error };
  }
};
