const formattedContent = (content: string) => {
  return content
    .replaceAll(`\"`, "'")
    .replaceAll(`\n`, "<br/>")
    .replaceAll("’", "'");
};

export default formattedContent;
