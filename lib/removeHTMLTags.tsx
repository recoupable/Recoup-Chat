function removeHtmlTags(str: string) {
  return str.replace(/<[^>]*>/g, "");
}

export default removeHtmlTags;
