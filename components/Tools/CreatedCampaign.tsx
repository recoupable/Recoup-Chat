import { useToolCallProvider } from "@/providers/ToolCallProvider";

const CreatedCampaign = () => {
  const { context } = useToolCallProvider();
  const data = context?.data;

  return (
    <div>
      <p className="text-sm">Campagin Id: {data?.id}</p>
      <p className="text-sm">
        Please refer to the SyncStream documentation{" "}
        <a
          href="https://docs.syncstream.ai/syncstream/less-than-syncstreamprovider-greater-than"
          target="_blank"
          className="underline text-[#4377e5]"
        >
          here
        </a>{" "}
        for the next steps on using the campaignId.
      </p>
    </div>
  );
};

export default CreatedCampaign;
