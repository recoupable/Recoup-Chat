import { FAN_TYPE } from "@/types/fans";
import { useEffect, useState } from "react";

const FanTable = ({
  fans,
  scroll,
}: {
  fans: FAN_TYPE[];
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const fanslist = fans?.slice(0, isCollapsed ? 3 : fans?.length);

  useEffect(() => {
    scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed]);

  return (
    <div>
      <p className="pl-2 pb-2">{`Here's a table with all the fans from your campaign.`}</p>
      <div className="border-gray-700 border-[1px] rounded-md w-full p-2">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-xs text-left p-1">Name</th>
              <th className="text-xs text-left p-1">Email</th>
              <th className="text-xs text-left p-1">Country</th>
            </tr>
          </thead>
          <tbody>
            {fanslist.map((fan, index) => (
              <tr key={index}>
                <td className="text-xs p-1">{fan.name || fan.display_name}</td>
                <td className="text-xs p-1 !max-w-[350px]">{fan.email}</td>
                <td className="text-xs p-1">{fan.country}</td>
              </tr>
            ))}
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FanTable;
