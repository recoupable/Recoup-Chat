const saveReportReferenece = async (
  stackUniqueId: string,
  summary: string,
  report: string,
  nextSteps: string,
) => {
  try {
    const response = await fetch(`/api/report/save`, {
      method: "POST",
      body: JSON.stringify({
        stackUniqueId,
        summary,
        report,
        nextSteps,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export default saveReportReferenece;
