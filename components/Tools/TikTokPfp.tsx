// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TikTokPfp = ({ trends }: { trends: any }) => {
  return (
    <div>
      <p className="pl-2 pb-2">{`Searching for @${trends[0].username} videos on tiktok...`}</p>
      {/* eslint-disable-next-line @next/next/no-img-element  */}
      <img src={trends[0].pfp} width={40} height={40} alt="not found pfp" />
      <button
        type="button"
        onClick={() => window.open(`${trends[0].pfpUrl}`, "_blank")}
      >
        View on TikTok
      </button>
    </div>
  );
};

export default TikTokPfp;
