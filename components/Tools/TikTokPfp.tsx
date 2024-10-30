// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TikTokPfp = ({ trends }: { trends: any }) => {
  return (
    <div>
      <p className="pl-2 pb-2 text-sm">{`Searching for @${trends[0].username} videos on tiktok...`}</p>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={trends[0].pfp} width={40} height={40} alt="not found pfp" />
      </div>
      <button
        type="button"
        onClick={() => window.open(`${trends[0].profileUrl}`, "_blank")}
        className="text-sm border-[1px] border-gray-700 rounded-md px-3 py-1"
      >
        View on TikTok
      </button>
    </div>
  );
};

export default TikTokPfp;
