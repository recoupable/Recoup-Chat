import React from "react";
import { SpotifySearchResponse } from "@/types/spotify";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import SpotifyContentCard from "./SpotifyContentCard";

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
                      className="w-[140px] m-2 flex-shrink-0"
                    >
                      <SpotifyContentCard
                        content={item as any}
                        onClick={(name, type) => handleSelect(name, type)}
                      />
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
