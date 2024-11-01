import { useToolCallProvider } from "@/providers/ToolCallProvider";

const CreatedCampaign = () => {
  const { context } = useToolCallProvider();
  const data = context?.data;

  return (
    <div>
      <p className="text-sm">Campaign Id: {data?.id}</p>
      <p className="text-sm">
        Add SyncStream OneTap to your campaign site to start collecting listener
        data. Follow the steps in the SyncStream guide{" "}
        <a
          href="https://docs.syncstream.ai/syncstream/quickstart"
          target="_blank"
          className="underline text-[#4377e5]"
        >
          here
        </a>{" "}
        to use your campaignId and capture important insights.
      </p>
    </div>
  );
};

export default CreatedCampaign;
