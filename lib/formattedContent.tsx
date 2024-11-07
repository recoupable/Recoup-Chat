const formattedContent = (content: string) => {
  return content.replaceAll(`\n`, "<br/>").replaceAll("’", "'");
};

export default formattedContent;
