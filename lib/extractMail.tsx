const extractMails = (bio: string) => {
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Extract emails
  const emails = bio.match(emailRegex);

  return emails?.[0] || "";
};

export default extractMails;
