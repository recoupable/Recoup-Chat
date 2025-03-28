// eslint-disable-next-line
const getAggregatedSocialProfiles = (account: any) => {
  if (!account)
    return {
      followerCount: 0,
      followingCount: 0,
    };
  const { followerCount, followingCount } = account.account_socials.reduce(
    // eslint-disable-next-line
    (acc: any, account_social: any) => {
      acc.followerCount += account_social?.followerCount || 0;
      acc.followingCount += account_social?.followingCount || 0;
      return acc;
    },
    {
      followerCount: 0,
      followingCount: 0,
    },
  );

  return { followerCount, followingCount };
};

export default getAggregatedSocialProfiles;
