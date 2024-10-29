import { ArtistRecord } from "@/types/Artist";
import { useEffect, useState } from "react";

const ArtistsTable = ({
  artists,
  scroll,
}: {
  artists: ArtistRecord[];
  scroll: () => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const artistsList = artists?.slice(0, isCollapsed ? 3 : artists?.length);

  console.log("ZIAD", scroll);
  useEffect(() => {
    // scroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed]);

  return (
    <div>
      <p className="pl-2 pb-2">{`Here's a table with all the artists which you are managing.`}</p>
      <div className="border-gray-700 border-[1px] rounded-md w-full p-2">
        <table className="w-full">
          <thead>
            <th className="text-xs text-left p-1">ID</th>
            <th className="text-xs text-left p-1">Name</th>
            <th className="text-xs text-left p-1">Updated At</th>
            <th className="text-xs text-left p-1">Action</th>
          </thead>
          <tbody>
            {artistsList?.map((artist, index) => (
              <tr key={index}>
                <td className="text-xs p-1">{artist.id}</td>
                <td className="text-xs p-1">{artist.name}</td>
                <td className="text-xs p-1">
                  {new Date(artist.timestamp).toLocaleDateString()}
                </td>
                <td className="text-xs p-1">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm border-gray-700 border-[1px] rounded-md"
                  >
                    Get Campaign
                  </button>
                </td>
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

export default ArtistsTable;
