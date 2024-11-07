function removeHtmlTags(str: string) {
  return str
    .replace(/<!--.*?-->/g, "")
    .replace(/<script[^>]*>.*?<\/script>/g, "")
    .replace(/<style[^>]*>.*?<\/style>/g, "")
    .replace(/<[^>]+>|[<>/;]/g, "")
    .trim();
}

export default removeHtmlTags;
