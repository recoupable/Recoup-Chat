import { AGENT_API } from "../consts";

// eslint-disable-next-line
const createReport = async (report_data: any) => {
  try {
    const response = await fetch(`${AGENT_API}/api/create_report`, {
      method: "POST",
      body: JSON.stringify(report_data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data.reportId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createReport;
