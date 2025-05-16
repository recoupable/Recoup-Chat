import React from "react";
import { GetSpotifyPlayButtonClickedResult } from "@/lib/supabase/getSpotifyPlayButtonClicked";

const GetVideoGameCampaignPlaysResult: React.FC<{
  result: GetSpotifyPlayButtonClickedResult;
}> = ({ result }) => {
  if (!result || !Array.isArray(result.rows) || result.rows.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No play events found for this campaign.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 font-semibold text-lg">
        Total Plays: <span className="text-primary">{result.total}</span>
      </div>
      <div className="overflow-x-auto overflow-y-auto rounded border border-gray-200 bg-white max-h-64 w-full">
        <table className="min-w-full w-full text-xs text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 sticky top-0 z-10 bg-gray-50">
                Timestamp
              </th>
              <th className="px-3 py-2 sticky top-0 z-10 bg-gray-50">Fan ID</th>
              <th className="px-3 py-2 sticky top-0 z-10 bg-gray-50">
                Premium?
              </th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.timestamp
                    ? new Date(row.timestamp).toLocaleString()
                    : "-"}
                </td>
                <td className="px-3 py-2">{row.fanId || "-"}</td>
                <td className="px-3 py-2">{row.isPremium ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetVideoGameCampaignPlaysResult;
