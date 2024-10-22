const getToolCallUrl = (toolName: string) => {
  if (toolName === "getCampaign") return `/api/get_campaign`;
  if (toolName === "getMeetingNotes") return `/api/get_meeting`;

  return `/api/get_campaign`;
};

export default getToolCallUrl;
