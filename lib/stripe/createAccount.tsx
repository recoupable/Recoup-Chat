// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAccount = async (accountData: any) => {
  try {
    const response = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SK}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(accountData).toString(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
