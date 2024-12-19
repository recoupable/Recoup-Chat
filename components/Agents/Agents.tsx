import FunnelCard from "./FunnelCard";

const Agents = () => {
  return (
    <div className="grow h-screen overflow-hidden md:bg-background md:p-4">
      <div className="size-full bg-white rounded-xl flex flex-col items-center md:items-start gap-3 pt-6 md:pt-10 px-4 md:px-20">
        <p className="font-plus_jakarta_sans_bold text-[50px]">Agents</p>
        <p className="text-[19px] md:text-[25px] text-grey-dark text-center md:text-left">
          Unlock the potential of your artist with intelligent, task-focused
          agents.
        </p>
        <div className="pt-8 flex flex-col md:flex-row md:flex-wrap gap-8">
          <FunnelCard funnelName="instagram" />
          <FunnelCard funnelName="spotify" />
          <FunnelCard funnelName="twitter" />
          <FunnelCard funnelName="tiktok" />
          <button
            type="button"
            className="w-[335px] h-[162px] overflow-hidden rounded-xl"
          >
            <div className="relative bg-[url('/campaign.png')] bg-cover size-full flex flex-col items-start justify-end pb-4 pl-4">
              <p className="text-white text-2xl text-left">Campaign Creator</p>
              <p className="text-white text-left text-[15px]">
                Promote your music and capture <br />{" "}
                {`fan data with Recoup's
                Webplayer.`}
              </p>
              <div className="bg-white w-[62px] h-[25px] rounded-full flex items-center justify-center text-purple absolute right-4 top-4">
                SOON
              </div>
              <div className="bg-[#00000000] size-full absolute left-0 top-0 backdrop-blur-[1px]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agents;
