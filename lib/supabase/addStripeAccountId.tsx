const addStripeAccountId = async (email: string, stripeAccountId: string) => {
  try {
    const response = await fetch(
      `/api/account/add_stripe_account_id?email=${email}&stripeAccountId=${stripeAccountId}`,
    );
    const data = await response.json();
    return data;
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addStripeAccountId;
