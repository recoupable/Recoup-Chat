import React from "react";
import { SpotifySearchResponse } from "@/types/spotify";

const cardStyle: React.CSSProperties = {
  width: 140,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 8,
  margin: 8,
  textAlign: "center",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
};
const imgStyle: React.CSSProperties = {
  width: 100,
  height: 100,
  objectFit: "cover",
  borderRadius: 6,
  marginBottom: 6,
  background: "#f3f4f6",
  display: "block",
};
const titleStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: 15,
  maxWidth: 120,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  margin: "0 auto",
};

function getImage(item: unknown): string | undefined {
  if (typeof item === "object" && item !== null) {
    const obj = item as {
      images?: { url: string }[];
      album?: { images?: { url: string }[] };
    };
    if (obj.images && obj.images.length > 0) {
      return obj.images[0].url;
    }
    if (obj.album && obj.album.images && obj.album.images.length > 0) {
      return obj.album.images[0].url;
    }
  }
  return undefined;
}

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
            <div key={key} style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                {typeLabels[key] || key}
              </div>
              <div
                style={{
                  display: "block",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  paddingBottom: 4,
                  marginLeft: -8,
                  marginRight: -8,
                }}
              >
                {section.items.map((item) => {
                  const obj = item as { id?: string; name?: string };
                  return (
                    <div
                      key={obj.id || Math.random()}
                      style={{
                        ...cardStyle,
                        display: "inline-block",
                        verticalAlign: "top",
                        marginLeft: 8,
                        marginRight: 8,
                      }}
                    >
                      {getImage(item) && (
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImage(item)}
                            alt={obj.name || ""}
                            style={imgStyle}
                          />
                        </div>
                      )}
                      <div style={titleStyle} title={obj.name}>
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
