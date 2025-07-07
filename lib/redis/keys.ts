export const getSystemPromptCacheKey = ({
  artistId,
  accountId,
}: {
  artistId?: string;
  accountId?: string;
}) => {
  return `system_prompt:${artistId}:${accountId}`;
};
