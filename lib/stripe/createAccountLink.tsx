// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createAccountLink = async (accountLinkData: any) => {
  try {
    const response = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      body: new URLSearchParams(accountLinkData).toString(),
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SK}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createAccountLink;
