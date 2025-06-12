const getKnowledgeIcon = (type: string) => {
  if (type.includes("office")) return "word";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("json")) return "json";
  if (type.includes("plain")) return "plain";
  if (type.includes("csv")) return "csv";
  return "image";
};

export default getKnowledgeIcon;
