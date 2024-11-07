const formattedContent = (content: string) => {
  return content.replaceAll(`\n`, "<br/>").replace(/’|&/g, "");
};

export default formattedContent;
