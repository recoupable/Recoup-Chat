function capitalize(str: string, locale = "en-US") {
  if (!str) return "";
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toLocaleUpperCase(locale) + str.slice(1);
}

export default capitalize;
