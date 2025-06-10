export const getFileMimeType = (file: File): string => {
  // Handle markdown files specifically
  if (!file.type && file.name.toLowerCase().endsWith(".md")) {
    return "text/markdown";
  }
  return file.type;
};
