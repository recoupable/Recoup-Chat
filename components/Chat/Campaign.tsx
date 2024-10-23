import FanTable from "./FanTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Campaign = ({ context }: any) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">
        <span className="underline">Artists</span>:{" "}
        {`${context.artists.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Playlists</span>:{" "}
        {`${context.playlists.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Tracks</span>:{" "}
        {`${context.tracks.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Albums</span>:{" "}
        {`${context.albums.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Audio Books</span>:{" "}
        {`${context.audioBooks.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Episodes</span>:{" "}
        {`${context.episodes.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Shows</span>:{" "}
        {`${context.shows.join(", ")}`}
      </p>
      <p className="text-sm">
        <span className="underline">Premium Fans</span>: {context.premiumCount}
      </p>
      <p className="text-sm">
        <span className="underline">Free Fans</span>: {context.freeCount}
      </p>
      <p className="text-sm">
        <span className="underline">Total Fans</span>: {context.totalFansCount}
      </p>
      <p className="text-sm">
        <span className="underline">Total Followers</span>:{" "}
        {context.totalFollowersCount}
      </p>
      <FanTable fans={context.fans} />
    </div>
  );
};

export default Campaign;
