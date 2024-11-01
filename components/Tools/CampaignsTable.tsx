import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { CampaignRecord } from "@/types/Artist";
import { FAN_TYPE } from "@/types/fans";
import { useEffect, useState } from "react";

const CampaignsTable = () => {
  const { context, scrollTo } = useToolCallProvider();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const campaigns = context?.campaigns;
  const campaignsList = campaigns?.slice(
    0,
    isCollapsed ? 3 : campaigns?.length,
  );

  const getRecentFanTimestamp = (fans: FAN_TYPE[]) => {
    const sortedFans = fans?.sort((a, b) => {
      const timestampA = a.timestamp
        ? new Date(a.timestamp).getTime()
        : Number.NEGATIVE_INFINITY;
      const timestampB = b.timestamp
        ? new Date(b.timestamp).getTime()
        : Number.NEGATIVE_INFINITY;
      return timestampA - timestampB;
    });

    if (!sortedFans?.length) return "";
    return sortedFans[0].timestamp
      ? new Date(parseInt(sortedFans[0].timestamp, 10)).toLocaleString()
      : "Unknown";
  };

  useEffect(() => {
    scrollTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed]);

  return (
    <div>
      <p className="pl-2 pb-2 text-sm">{`Here's a table with all the campaigns which you are managing.`}</p>
      <div className="border-gray-700 border-[1px] rounded-md w-full p-2">
        <table className="w-full">
          <thead>
            <th className="text-xs text-left p-1">ID</th>
            <th className="text-xs text-left p-1">Campaign Name</th>
            <th className="text-xs text-left p-1">NumberOfFans</th>
            <th className="text-xs text-left p-1">CreatedOn</th>
            <th className="text-xs text-left p-1">MostRecentFan</th>
            <th className="text-xs text-left p-1">Action</th>
          </thead>
          <tbody>
            {campaignsList?.map((campaign: CampaignRecord, index: number) => (
              <tr key={index}>
                <td className="text-xs p-1">{campaign.id}</td>
                <td className="text-xs p-1">{campaign.clientId}</td>
                <td className="text-xs p-1">{campaign?.fans?.length || 0}</td>
                <td className="text-xs p-1">
                  {new Date(campaign.timestamp).toLocaleString()}
                </td>
                <td className="text-xs p-1">
                  {getRecentFanTimestamp(campaign?.fans)}
                </td>
                <td className="text-xs p-1">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm border-gray-700 border-[1px] rounded-md text-sm"
                  >
                    Get a campaign.
                  </button>
                </td>
              </tr>
            ))}
            {campaignsList?.length > 3 && (
              <tr>
                <td colSpan={3} className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    ...
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsTable;
