const increaseCredits = async (accountId: string) => {
  try {
    const response = await fetch(
      `/api/credits/increase?accountId=${accountId}`,
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default increaseCredits;
