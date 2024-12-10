const getReportReference = async (referenceId: string) => {
  try {
    const response = await fetch(
      `/api/report/get_reference?referenceId=${referenceId}`,
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getReportReference;
