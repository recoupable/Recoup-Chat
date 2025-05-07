import React from "react";
import { SpotifySearchResponse } from "@/types/spotify";
import { getSpotifyImage } from "@/lib/spotify/getSpotifyImage";
import { useVercelChatContext } from "@/providers/VercelChatProvider";

const typeLabels: Record<string, string> = {
  artists: "Artists",
  albums: "Albums",
  tracks: "Tracks",
  playlists: "Playlists",
  shows: "Shows",
  episodes: "Episodes",
  audiobooks: "Audiobooks",
};

const GetSpotifySearchToolResult: React.FC<{
  result: SpotifySearchResponse;
}> = ({ result }) => {
  const { append } = useVercelChatContext();

  const handleSelect = (name: string, type: string) => {
    append({
      role: "user",
      content: `I've selected ${name} (${type})`,
    });
  };

  return (
    <div>
      {Object.entries(result)
        .filter(
          ([key, value]) =>
            key !== "success" &&
            value &&
            typeof value === "object" &&
            "items" in (value as object) &&
            Array.isArray((value as { items?: unknown[] }).items) &&
            ((value as { items?: unknown[] }).items?.length ?? 0) > 0
        )
        .map(([key, value]) => {
          const section = value as { items: unknown[] };
          return (
            <div key={key} className="mb-6">
              <div className="font-semibold text-lg mb-2">
                {typeLabels[key] || key}
              </div>
              <div className="flex flex-nowrap overflow-x-auto pb-1 -mx-2">
                {section.items.map((item) => {
                  const obj = item as { id?: string; name?: string };
                  return (
                    <div
                      key={obj.id || Math.random()}
                      className="w-[140px] border border-gray-200 rounded-lg p-2 m-2 text-center bg-white flex-shrink-0 flex flex-col items-center justify-start cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => obj.name && handleSelect(obj.name, key)}
                    >
                      {getSpotifyImage(item) && (
                        <div className="w-full flex justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getSpotifyImage(item)}
                            alt={obj.name || ""}
                            className="w-[100px] h-[100px] object-cover rounded-md mb-1 block"
                          />
                        </div>
                      )}
                      <div
                        className="font-medium text-[15px] max-w-[120px] truncate mx-auto"
                        title={obj.name}
                      >
                        {obj.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GetSpotifySearchToolResult;
