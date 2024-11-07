import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { FAN_TYPE } from "@/types/fans";
import { useEffect, useState } from "react";

const FanTable = () => {
  const { fans, scrollTo } = useToolCallProvider();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const fanslist = fans?.slice(0, isCollapsed ? 3 : fans?.length);

  useEffect(() => {
    scrollTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed]);

  return (
    <div className="pb-2">
      <p className="pl-2 pb-2 text-sm">{`Here's a table with all the fans from your campaign.`}</p>
      <div className="border-gray-700 border-[1px] rounded-md w-full p-2">
        <table className="w-full">
          <thead>
            <th className="text-xs text-left p-1">Name</th>
            <th className="text-xs text-left p-1">Email</th>
            <th className="text-xs text-left p-1">Country</th>
          </thead>
          <tbody>
            {fanslist?.map((fan: FAN_TYPE, index: number) => (
              <tr key={index}>
                <td className="text-xs p-1">{fan.name || fan.display_name}</td>
                <td className="text-xs p-1">{fan.email}</td>
                <td className="text-xs p-1">{fan.country}</td>
              </tr>
            ))}
            {fans?.length > 3 && (
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

export default FanTable;
