// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFullReport = async (context: any) => {
  try {
    const response = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify(context),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export default getFullReport;
