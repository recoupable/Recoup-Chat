import { ArtistToolResponse } from "@/types/Tool";

const FollowUp = ({
  toolName,
  context,
}: {
  toolName: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
}) => {
  return (
    <div>
      {toolName === "getArtistAnalysis" &&
        context.status === ArtistToolResponse.TIKTOK_TRENDS && (
          <>
            <p className="text-sm">
              To create a new campaign for the next step, click the button
              below.
            </p>
            <button
              type="button"
              className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
            >
              Create a new campaign
            </button>
          </>
        )}
    </div>
  );
};

export default FollowUp;
