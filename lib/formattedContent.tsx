const formattedContent = (content: string) => {
  return encodeURIComponent(
    content.replaceAll(`\n`, "<br/>").replaceAll("’", "'"),
  );
};

export default formattedContent;
